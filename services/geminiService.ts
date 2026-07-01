
import { AspectRatio, GenModelId } from "../types";

export interface ReferenceImage {
  data: string; // Base64 data
  mimeType: string;
}

export const generateImageWithGemini = async (
  prompt: string,
  referenceImages?: ReferenceImage[] | null,
  aspectRatio: AspectRatio = '1:1',
  modelId: GenModelId = 'gemini-2.5-flash-image',
  options?: { quality?: string; format?: string; onProgress?: (status: string) => void; intensity?: number; }
): Promise<string> => {
  // All models now go through our Google Imagen Cloud Function.
  // We ignore modelId variations for now and use a single underlying Imagen model.

  // Take first reference image (основное лицо / исходное фото)
  let imageBase64: string | null = null;
  if (referenceImages && referenceImages.length > 0) {
    imageBase64 = referenceImages[0].data; // уже очищенный base64 без data: префикса
  }

  const payload: any = {
    prompt,
    aspectRatio,
    negativePrompt: "",
    parameters: {},
    // Передаём исходное фото в облачную функцию, если оно есть
    imageBase64: imageBase64 || undefined,
    intensity: options?.intensity || 50, // Pass intensity (0-100)
    modelId, // Pass the selected model ID to the backend
  };

  // Basic onProgress is not supported for Imagen REST right now; we'll just log start/finish.
  options?.onProgress?.("Запрос к Google Imagen...");

  const functionUrl =
    import.meta.env.VITE_GOOGLE_IMAGE_FUNCTION_URL ||
    "https://us-central1-project-1285666415996898989.cloudfunctions.net/generateGoogleImage";

  console.log("[GeminiService] Calling Cloud Function:", functionUrl);
  console.log("[GeminiService] Payload:", { 
    promptLength: prompt.length, 
    hasImage: !!imageBase64, 
    aspectRatio, 
    modelId,
    intensity: options?.intensity 
  });

  const resp = await fetch(functionUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!resp.ok) {
    const text = await resp.text();
    let errorMessage = text;
    try {
      const errorJson = JSON.parse(text);
      errorMessage = errorJson.error || errorJson.message || text;
    } catch {
      // Keep text as is
    }
    console.error("[GeminiService] Cloud Function error:", {
      status: resp.status,
      statusText: resp.statusText,
      body: errorMessage
    });
    throw new Error(errorMessage || `Ошибка генерации (${resp.status}): ${resp.statusText}`);
  }

  const data = await resp.json();
  console.log("[GeminiService] Response received:", { 
    hasData: !!data, 
    hasImage: !!data?.image,
    hasBase64: !!data?.image?.base64 
  });

  const base64 = data?.image?.base64;
  const mimeType = data?.image?.mimeType || "image/png";

  if (!base64) {
    console.error("[GeminiService] Missing base64 in response:", data);
    throw new Error("Сервер не вернул изображение. Ответ: " + JSON.stringify(data));
  }

  // Return data URL so existing storage logic can handle upload
  return `data:${mimeType};base64,${base64}`;
};

// Legacy Helpers
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

// Video generation via FAL is no longer supported in this simplified setup.
