
import { AspectRatio, GenModelId, ImageResolution } from "../types";
import { inferKrasoModel, type KrasoModelId } from "../lib/krasoModels";
import { USE_FAL_STUDIO } from "../lib/featureFlags";

export interface ReferenceImage {
  data: string; // Base64 data
  mimeType: string;
  role?: 'character' | 'reference';
}

export interface GenerateImageOptions {
  quality?: ImageResolution | string;
  format?: string;
  onProgress?: (status: string) => void;
  intensity?: number;
  /** Kraso tier — preferred over inferring from legacy modelId */
  krasoModel?: KrasoModelId;
}

const STUDIO_FUNCTION_URL =
  import.meta.env.VITE_STUDIO_IMAGE_FUNCTION_URL ||
  "https://us-central1-project-1285666415996898989.cloudfunctions.net/generateStudioImage";

const GEMINI_FUNCTION_URL =
  import.meta.env.VITE_GOOGLE_IMAGE_FUNCTION_URL ||
  "https://us-central1-project-1285666415996898989.cloudfunctions.net/generateGoogleImage";

async function callFalStudio(
  prompt: string,
  referenceImages: ReferenceImage[],
  aspectRatio: AspectRatio,
  krasoTier: KrasoModelId,
  options?: GenerateImageOptions,
): Promise<string> {
  const refs = referenceImages?.filter(r => r?.data) ?? [];
  const resolution = (options?.quality as ImageResolution) || '1K';

  const payload = {
    prompt,
    aspectRatio,
    krasoTier,
    resolution,
    referenceImages: refs.map(r => ({
      data: r.data,
      mimeType: r.mimeType,
      role: r.role,
    })),
    imageBase64: refs[0]?.data,
    mimeType: refs[0]?.mimeType,
  };

  options?.onProgress?.("Генерация через FAL...");

  const resp = await fetch(STUDIO_FUNCTION_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!resp.ok) {
    const text = await resp.text();
    let errorMessage = text;
    try {
      const errorJson = JSON.parse(text);
      errorMessage = errorJson.error || errorJson.message || text;
    } catch {
      // keep text
    }
    throw new Error(errorMessage || `Ошибка FAL (${resp.status})`);
  }

  const data = await resp.json();
  const base64 = data?.image?.base64;
  const mimeType = data?.image?.mimeType || "image/png";
  if (!base64) {
    throw new Error("Сервер не вернул изображение");
  }
  return `data:${mimeType};base64,${base64}`;
}

async function callGeminiLegacy(
  prompt: string,
  referenceImages: ReferenceImage[] | null | undefined,
  aspectRatio: AspectRatio,
  modelId: GenModelId,
  options?: GenerateImageOptions,
): Promise<string> {
  const refs = referenceImages?.filter(r => r?.data) ?? [];
  const primary = refs[0] ?? null;

  const payload: Record<string, unknown> = {
    prompt,
    aspectRatio,
    negativePrompt: "",
    parameters: {
      quality: options?.quality,
      format: options?.format,
    },
    imageBase64: primary?.data || undefined,
    mimeType: primary?.mimeType || undefined,
    referenceImages: refs.map(r => ({
      data: r.data,
      mimeType: r.mimeType,
      role: r.role,
    })),
    intensity: options?.intensity || 50,
    modelId,
    quality: options?.quality,
  };

  options?.onProgress?.("Запрос к Google Imagen...");

  const resp = await fetch(GEMINI_FUNCTION_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!resp.ok) {
    const text = await resp.text();
    let errorMessage = text;
    try {
      const errorJson = JSON.parse(text);
      errorMessage = errorJson.error || errorJson.message || text;
    } catch {
      // keep text
    }
    throw new Error(errorMessage || `Ошибка генерации (${resp.status})`);
  }

  const data = await resp.json();
  const base64 = data?.image?.base64;
  const mimeType = data?.image?.mimeType || "image/png";
  if (!base64) {
    throw new Error("Сервер не вернул изображение");
  }
  return `data:${mimeType};base64,${base64}`;
}

/** Main image generation entry — routes to FAL studio by default */
export const generateImageWithGemini = async (
  prompt: string,
  referenceImages?: ReferenceImage[] | null,
  aspectRatio: AspectRatio = '1:1',
  modelId: GenModelId = 'gemini-2.5-flash-image',
  options?: GenerateImageOptions,
): Promise<string> => {
  const resolution = (options?.quality as ImageResolution) || '1K';
  const krasoTier = options?.krasoModel ?? inferKrasoModel(modelId, resolution);

  if (USE_FAL_STUDIO) {
    return callFalStudio(prompt, referenceImages ?? [], aspectRatio, krasoTier, options);
  }
  return callGeminiLegacy(prompt, referenceImages, aspectRatio, modelId, options);
};

export const cleanBase64 = (dataUrl: string): string => {
  const parts = dataUrl.split(',');
  return parts.length > 1 ? parts[1] : parts[0];
};

export const getMimeType = (dataUrl: string): string => {
  const match = dataUrl.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
  if (match && match.length > 1) {
    return match[1];
  }
  return 'image/jpeg';
};
