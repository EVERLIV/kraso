import { GenModelId, ImageResolution } from '../types';

/** Credit cost for one image in the templates / studio flow. */
export function calculateImageGenCost(
  model: GenModelId,
  resolution: ImageResolution = '1K',
): number {
  if (model === 'gemini-2.5-flash-image' || !model) return 15;
  let base = 60;
  if (resolution === '2K') base = 90;
  if (resolution === '4K') base = 120;
  return base;
}

/** Map UI quality chips to Gemini imageSize (Pro model only). */
export function apiResolutionForModel(
  model: GenModelId,
  resolution: ImageResolution,
): ImageResolution | undefined {
  if (model !== 'gemini-3-pro-image-preview') return undefined;
  return resolution;
}

export const CHAT_QUALITY_TO_RESOLUTION: Record<'low' | 'medium' | 'high', ImageResolution> = {
  low: '1K',
  medium: '2K',
  high: '4K',
};
