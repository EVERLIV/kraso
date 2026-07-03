import type { KrasoModelId } from './krasoModels';

/** Credits per second of generated video, by tier (baseline at 5s). */
const PER_SECOND_RATE: Record<KrasoModelId, number> = {
  'kraso-fast': 12,
  'kraso-quality': 18,
  'kraso-realism': 24,
};

export function calculateVideoKrasoCost(id: KrasoModelId, durationSec: number = 5): number {
  const rate = PER_SECOND_RATE[id] ?? PER_SECOND_RATE['kraso-quality'];
  return Math.max(Math.round(rate * durationSec), rate * 3);
}

export function videoResolutionForKraso(id: KrasoModelId): '720p' | '1080p' {
  return id === 'kraso-realism' ? '1080p' : '720p';
}
