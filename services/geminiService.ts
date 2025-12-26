
import { GoogleGenAI } from "@google/genai";
import { AspectRatio, GenModelId, ImageResolution } from "../types";

const API_KEY = process.env.API_KEY || '';

if (!API_KEY) {
  console.warn("Missing API_KEY environment variable. API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export interface ReferenceImage {
  data: string; // Base64 data without prefix
  mimeType: string;
}

/**
 * Applies a text watermark to a base64 image
 */
const applyWatermark = async (base64Image: string, text: string = "SmartPhotos.Ru"): Promise<string> => {
  if (typeof window === 'undefined') return base64Image;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(base64Image);
        return;
      }

      // Draw original image
      ctx.drawImage(img, 0, 0);

      // Configure text style - Smaller size (approx 3% of width)
      const fontSize = Math.max(img.width * 0.03, 16); 
      ctx.font = `600 ${fontSize}px sans-serif`; // Less bold weight (900 -> 600)
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Draw Text - No outline, more transparent (0.35)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)'; 
      ctx.fillText(text, cx, cy);

      // Resolve with new base64 (stripped prefix)
      const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
      resolve(cleanBase64(dataUrl));
    };
    img.onerror = (e) => {
        console.error("Watermark failed", e);
        resolve(base64Image);
    };
    img.src = `data:image/jpeg;base64,${base64Image}`;
  });
};

/**
 * Generates or Edits an image using Gemini models.
 * Supports multiple reference images and specific model configurations.
 * 
 * @param prompt The text prompt.
 * @param referenceImages (Optional) Array of reference images (data + mimeType).
 * @param aspectRatio The desired aspect ratio for the output.
 * @param modelId The specific model to use (flash or pro).
 * @param resolution The resolution (only applicable for Pro model).
 * @param addWatermark If true, adds "SmartPhotos.Ru" watermark to the result.
 * @returns The base64 data of the generated image.
 */
export const generateImageWithGemini = async (
  prompt: string,
  referenceImages: ReferenceImage[] | null = [],
  aspectRatio: AspectRatio = '1:1',
  modelId: GenModelId = 'gemini-2.5-flash-image',
  resolution: ImageResolution = '1K',
  shouldWatermark: boolean = false
): Promise<string> => {
  try {
    const parts: any[] = [{ text: prompt }];

    // If images are provided, add them to the request
    if (referenceImages && referenceImages.length > 0) {
      referenceImages.forEach(img => {
        parts.push({
          inlineData: {
            data: img.data,
            mimeType: img.mimeType,
          },
        });
      });
    }

    // Configure Image Generation Params
    const imageConfig: any = {
      aspectRatio: aspectRatio
    };

    // 'imageSize' is only supported by gemini-3-pro-image-preview
    if (modelId === 'gemini-3-pro-image-preview') {
      imageConfig.imageSize = resolution;
    }

    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: parts,
      },
      config: {
        imageConfig: imageConfig
      }
    });

    // Iterate through parts to find the image part
    let rawImageBase64 = null;
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          rawImageBase64 = part.inlineData.data;
          break;
        }
      }
    }

    if (!rawImageBase64) {
      throw new Error("No image data found in the response. The model might have returned only text.");
    }

    // Apply watermark if requested
    if (shouldWatermark) {
        return await applyWatermark(rawImageBase64);
    }

    return rawImageBase64;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

/**
 * Legacy wrapper for backward compatibility with single image calls
 */
export const editImageWithGemini = async (
  imageBase64: string,
  mimeType: string,
  prompt: string,
  aspectRatio: AspectRatio = '1:1'
) => {
  return generateImageWithGemini(prompt, [{ data: imageBase64, mimeType }], aspectRatio);
};

/**
 * Helper to strip the data URL prefix if present.
 */
export const cleanBase64 = (dataUrl: string): string => {
  const parts = dataUrl.split(',');
  return parts.length > 1 ? parts[1] : parts[0];
};

/**
 * Helper to get mime type from data URL.
 */
export const getMimeType = (dataUrl: string): string => {
  const match = dataUrl.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
  if (match && match.length > 1) {
    return match[1];
  }
  return 'image/jpeg'; // Default
};
