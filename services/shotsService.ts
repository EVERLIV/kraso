import { AspectRatio, ImageResolution } from '../types';
import { cleanBase64, getMimeType } from './geminiService';
import { KrasoModelId } from '../lib/krasoModels';
import { ShotsShotId } from '../lib/shotsPromptRules';
import { auth } from '../lib/firebase';

const SHOTS_FUNCTION_URL =
  import.meta.env.VITE_SHOTS_GRID_FUNCTION_URL ||
  'https://us-central1-project-1285666415996898989.cloudfunctions.net/generateShotsGrid';

export interface ShotsGridItem {
  shotId: ShotsShotId;
  title: string;
  description: string;
  prompt: string;
  image: string;
  url?: string;
  selected?: boolean;
  upscaled?: string | null;
}

interface GenerateShotsGridOptions {
  aspectRatio: Extract<AspectRatio, '3:4' | '4:5'>;
  krasoTier: KrasoModelId;
  resolution: ImageResolution;
}

async function callShotsFunction(payload: Record<string, unknown>): Promise<ShotsGridItem[]> {
  const token = auth?.currentUser ? await auth.currentUser.getIdToken() : null;
  const resp = await fetch(SHOTS_FUNCTION_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!resp.ok) {
    const text = await resp.text();
    let errorMessage = text;
    try {
      const json = JSON.parse(text);
      errorMessage = json.error || json.message || text;
    } catch {
      // keep raw text
    }
    throw new Error(errorMessage || `Ошибка генерации сетки (${resp.status})`);
  }

  const data = await resp.json();
  const shots = Array.isArray(data?.shots) ? data.shots : [];
  return shots.map((shot: any) => ({
    shotId: shot.shotId,
    title: shot.title,
    description: shot.description,
    prompt: shot.prompt,
    image: `data:${shot.image?.mimeType || 'image/png'};base64,${shot.image?.base64 || ''}`,
    url: shot.url,
    selected: false,
    upscaled: null,
  }));
}

export async function generateShotsGrid(
  sourceImage: string,
  options: GenerateShotsGridOptions,
): Promise<ShotsGridItem[]> {
  return callShotsFunction({
    action: 'grid',
    imageBase64: cleanBase64(sourceImage),
    mimeType: getMimeType(sourceImage),
    aspectRatio: options.aspectRatio,
    krasoTier: options.krasoTier,
    resolution: options.resolution,
  });
}

export async function regenerateShotsShot(
  sourceImage: string,
  shotId: ShotsShotId,
  options: GenerateShotsGridOptions,
): Promise<ShotsGridItem> {
  const shots = await callShotsFunction({
    action: 'retry',
    shotId,
    imageBase64: cleanBase64(sourceImage),
    mimeType: getMimeType(sourceImage),
    aspectRatio: options.aspectRatio,
    krasoTier: options.krasoTier,
    resolution: options.resolution,
  });
  return shots[0];
}

export async function upscaleShotsShot(
  shotImage: string,
  options: GenerateShotsGridOptions,
): Promise<string> {
  const shots = await callShotsFunction({
    action: 'upscale',
    imageBase64: cleanBase64(shotImage),
    mimeType: getMimeType(shotImage),
    aspectRatio: options.aspectRatio,
    krasoTier: 'kraso-quality',
    resolution: options.resolution,
  });
  return shots[0]?.image;
}
