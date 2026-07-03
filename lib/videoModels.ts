import type { KrasoModelId } from './krasoModels';

export type VideoVariantId =
  | 'wan-2.5'
  | 'ovi'
  | 'wan-2.2'
  | 'kling-2.5-turbo'
  | 'kling-3'
  | 'seedance-1.5-pro'
  | 'veo-3'
  | 'veo-3.1'
  | 'sora-2'
  | 'seedance-2';

export interface VideoVariantOption {
  id: VideoVariantId;
  label: string;
  hint: string;
  resolution: '720p' | '1080p' | '4K';
  hasAudio?: boolean;
  falModelId: string;
  /** Requires explicit user confirmation before use (expensive tier) */
  requiresConfirm?: boolean;
}

/**
 * Real fal.ai models grouped by user-facing Kraso tier.
 * Prices are intentionally NOT surfaced in the UI — internal reference only:
 * КрасоФаст: Wan 2.5 $0.05/с, Ovi $0.20/ролик (аудио), Wan 2.2 $0.10/с — черновики.
 * КрасоКачество: Kling 2.5 Turbo Pro $0.07/с, Kling 3.0 ~$0.10–0.224/с, Seedance 1.5 Pro ~$0.26/5с (аудио).
 * КрасоРеализм: Veo 3 $0.40/с, Veo 3.1 (4K, аудио, липсинк), Sora 2, Seedance 2.0 — дорого, только по запросу.
 */
export const VIDEO_TIER_VARIANTS: Record<KrasoModelId, VideoVariantOption[]> = {
  'kraso-fast': [
    {
      id: 'wan-2.5',
      label: 'Wan 2.5',
      hint: 'Быстрые черновики',
      resolution: '720p',
      falModelId: 'fal-ai/wan/v2.5',
    },
    {
      id: 'ovi',
      label: 'Ovi',
      hint: 'С нативным аудио',
      resolution: '720p',
      hasAudio: true,
      falModelId: 'fal-ai/ovi',
    },
    {
      id: 'wan-2.2',
      label: 'Wan 2.2',
      hint: 'Стабильная массовка',
      resolution: '720p',
      falModelId: 'fal-ai/wan/v2.2',
    },
  ],
  'kraso-quality': [
    {
      id: 'kling-2.5-turbo',
      label: 'Kling 2.5 Turbo Pro',
      hint: 'Лучшее соотношение цены и качества',
      resolution: '1080p',
      falModelId: 'fal-ai/kling-video/v2.5-turbo/pro',
    },
    {
      id: 'kling-3',
      label: 'Kling 3.0',
      hint: 'Более чёткая детализация',
      resolution: '1080p',
      falModelId: 'fal-ai/kling-video/v3/pro',
    },
    {
      id: 'seedance-1.5-pro',
      label: 'Seedance 1.5 Pro',
      hint: '720p со звуком',
      resolution: '720p',
      hasAudio: true,
      falModelId: 'fal-ai/seedance/v1.5/pro',
    },
  ],
  'kraso-realism': [
    {
      id: 'veo-3',
      label: 'Veo 3',
      hint: 'Google, высокое качество',
      resolution: '1080p',
      hasAudio: true,
      falModelId: 'fal-ai/veo3',
      requiresConfirm: true,
    },
    {
      id: 'veo-3.1',
      label: 'Veo 3.1',
      hint: '4K, лучший липсинк',
      resolution: '4K',
      hasAudio: true,
      falModelId: 'fal-ai/veo3.1',
      requiresConfirm: true,
    },
    {
      id: 'sora-2',
      label: 'Sora 2',
      hint: 'OpenAI',
      resolution: '1080p',
      falModelId: 'fal-ai/sora-2',
      requiresConfirm: true,
    },
    {
      id: 'seedance-2',
      label: 'Seedance 2.0',
      hint: 'Новое поколение',
      resolution: '4K',
      hasAudio: true,
      falModelId: 'fal-ai/seedance/v2',
      requiresConfirm: true,
    },
  ],
};

export function getTierVariants(tier: KrasoModelId): VideoVariantOption[] {
  return VIDEO_TIER_VARIANTS[tier];
}

export function getDefaultVariant(tier: KrasoModelId): VideoVariantOption {
  return VIDEO_TIER_VARIANTS[tier][0];
}

export function getVariant(tier: KrasoModelId, variantId: VideoVariantId): VideoVariantOption {
  return VIDEO_TIER_VARIANTS[tier].find((v) => v.id === variantId) ?? getDefaultVariant(tier);
}

export function tierForVariant(variantId: VideoVariantId): KrasoModelId {
  for (const tier of Object.keys(VIDEO_TIER_VARIANTS) as KrasoModelId[]) {
    if (VIDEO_TIER_VARIANTS[tier].some((v) => v.id === variantId)) return tier;
  }
  return 'kraso-quality';
}
