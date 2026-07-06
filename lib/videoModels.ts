import type { KrasoModelId } from './krasoModels';

export type VideoVariantId =
  | 'wan-2.5'
  | 'kling-2.5-turbo'
  | 'kling-3'
  | 'seedance-1.5-pro'
  | 'veo-3'
  | 'veo-3.1';

export type VideoAspectRatio = '16:9' | '9:16' | '1:1' | '4:3' | '3:4' | '21:9';
export type VideoResolution = '480p' | '720p' | '1080p' | '4k';

/**
 * Real per-model parameter constraints sourced from Atlas Cloud API schemas.
 */
export interface ModelParamConstraints {
  /**
   * Fixed duration options in seconds (renders as a dropdown).
   * Use when the model only accepts specific values.
   */
  durationFixed?: number[];
  /**
   * Continuous duration range (renders as a slider).
   * Use when the model accepts any integer between min and max.
   */
  durationRange?: { min: number; max: number };
  /**
   * Available resolution options.
   * If empty / absent, resolution is fixed and not user-selectable.
   */
  resolutionOptions?: VideoResolution[];
  /** Available aspect-ratio options. */
  aspectRatioOptions?: VideoAspectRatio[];
  /**
   * Duration string format expected by the video API.
   * 'seconds' → "5", 'seconds-suffix' → "5s"   (Veo uses the suffix format)
   */
  durationFormat?: 'seconds' | 'seconds-suffix';
}

export interface VideoVariantOption {
  id: VideoVariantId;
  label: string;
  hint: string;
  /** Default / max resolution label */
  resolution: VideoResolution;
  hasAudio?: boolean;
  /** Correct Atlas Cloud model endpoint ID */
  atlasModelId: string;
  /** Requires explicit user confirmation before use (expensive tier) */
  requiresConfirm?: boolean;
  /** Real API constraints */
  params: ModelParamConstraints;
  /** Local demo video path (served from /public). Shown in model picker on hover/select. */
  demoVideoUrl?: string;
}

/**
 * Real Atlas Cloud models grouped by user-facing Kraso tier.
 *
 * Sources (July 2026): https://www.atlascloud.ai/models
 */
export const VIDEO_TIER_VARIANTS: Record<KrasoModelId, VideoVariantOption[]> = {
  'kraso-fast': [
    {
      id: 'wan-2.5',
      label: 'Wan 2.5',
      hint: 'Быстрые черновики · 5 или 10с · до 1080p',
      resolution: '1080p',
      atlasModelId: 'alibaba/wan-2.5/image-to-video',
      demoVideoUrl: '/video/demos/demo-wan2-5.mp4',
      params: {
        durationFixed: [5, 10],
        resolutionOptions: ['480p', '720p', '1080p'],
        aspectRatioOptions: ['16:9', '9:16'],
        durationFormat: 'seconds',
      },
    },
  ],
  'kraso-quality': [
    {
      id: 'kling-2.5-turbo',
      label: 'Kling 2.5 Turbo Pro',
      hint: 'Лучшее соотношение цена/качество · 5 или 10с',
      resolution: '1080p',
      atlasModelId: 'kwaivgi/kling-v2.5-turbo-pro/image-to-video',
      demoVideoUrl: '/video/demos/demo-kling2-5.mp4',
      params: {
        durationFixed: [5, 10],
        aspectRatioOptions: ['16:9', '9:16', '1:1'],
        durationFormat: 'seconds',
      },
    },
    {
      id: 'kling-3',
      label: 'Kling 3.0 Pro',
      hint: 'Мультишот · нативный диалог · до 15с',
      resolution: '1080p',
      hasAudio: true,
      atlasModelId: 'kwaivgi/kling-v3.0-pro/image-to-video',
      demoVideoUrl: '/video/demos/demo-kling3.mp4',
      params: {
        durationRange: { min: 3, max: 15 },
        aspectRatioOptions: ['16:9', '9:16'],
        durationFormat: 'seconds',
      },
    },
    {
      id: 'seedance-1.5-pro',
      label: 'Seedance 1.5 Pro',
      hint: 'Нативный звук · 4–12с · до 1080p',
      resolution: '1080p',
      hasAudio: true,
      atlasModelId: 'bytedance/seedance-v1.5-pro/image-to-video',
      demoVideoUrl: '/video/demos/demo-seedance.mp4',
      params: {
        durationRange: { min: 4, max: 12 },
        resolutionOptions: ['480p', '720p', '1080p'],
        aspectRatioOptions: ['16:9', '9:16', '1:1', '4:3', '3:4', '21:9'],
        durationFormat: 'seconds',
      },
    },
  ],
  'kraso-realism': [
    {
      id: 'veo-3',
      label: 'Veo 3',
      hint: 'Google · нативный звук · 4/6/8с',
      resolution: '1080p',
      hasAudio: true,
      atlasModelId: 'google/veo-3/image-to-video',
      requiresConfirm: true,
      demoVideoUrl: '/video/demos/demo-veo3.mp4',
      params: {
        durationFixed: [4, 6, 8],
        resolutionOptions: ['720p', '1080p'],
        aspectRatioOptions: ['16:9', '9:16'],
        durationFormat: 'seconds-suffix',
      },
    },
    {
      id: 'veo-3.1',
      label: 'Veo 3.1',
      hint: 'Google 4K · лучший липсинк · 4/6/8с',
      resolution: '4k',
      hasAudio: true,
      atlasModelId: 'google/veo-3.1/image-to-video',
      requiresConfirm: true,
      demoVideoUrl: '/video/demos/demo-veo3-1.mp4',
      params: {
        durationFixed: [4, 6, 8],
        resolutionOptions: ['720p', '1080p', '4k'],
        aspectRatioOptions: ['16:9', '9:16'],
        durationFormat: 'seconds-suffix',
      },
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

export interface VideoVariantEntry {
  tier: KrasoModelId;
  variant: VideoVariantOption;
}

/** All video variants across tiers — for the horizontal model bar. */
export function getAllVideoVariants(): VideoVariantEntry[] {
  return (Object.keys(VIDEO_TIER_VARIANTS) as KrasoModelId[]).flatMap((tier) =>
    VIDEO_TIER_VARIANTS[tier].map((variant) => ({ tier, variant })),
  );
}

/** Format duration number into the string format the model expects. */
export function formatDuration(seconds: number, format: ModelParamConstraints['durationFormat']): string {
  if (format === 'seconds-suffix') return `${seconds}s`;
  return String(seconds);
}

/** Snap a duration value to the nearest allowed fixed option. */
export function snapToFixed(value: number, options: number[]): number {
  return options.reduce((closest, opt) =>
    Math.abs(opt - value) < Math.abs(closest - value) ? opt : closest,
    options[0],
  );
}
