/**
 * Client-side mirror of verified Atlas Cloud model IDs.
 * Server source of truth: functions/lib/atlasModelRegistry.js
 *
 * Last verified: 2026-07-06
 */

export const ATLAS_REGISTRY_VERIFIED_AT = '2026-07-06';

export type AtlasModelKind = 'text-to-image' | 'image-to-image';
export type AtlasImageInputField = 'image' | 'image_url' | 'images' | 'image_urls';
export type TemplateTier = 'fast' | 'standard' | 'pro';
export type StudioTier = 'kraso-fast' | 'kraso-quality' | 'kraso-realism';

export interface AtlasModelEntry {
  id: string;
  kind: AtlasModelKind;
  label: string;
  docsUrl: string;
  costHint?: string;
  imageInputField?: AtlasImageInputField;
  supportsResolution?: boolean;
  notes?: string;
}

/** Verified model IDs — do not use unlisted endpoints in production */
export const ATLAS_MODEL_IDS = {
  fluxSchnell: 'black-forest-labs/flux-1-schnell/text-to-image',
  fluxDev: 'black-forest-labs/flux-1-dev/text-to-image',
  fluxProUltra: 'black-forest-labs/flux-1.1-pro-ultra/text-to-image',
  qwenImage: 'qwen/qwen-image/text-to-image',
  qwenImage2T2i: 'qwen/qwen-image-2/text-to-image',
  sdxl35: 'stability-ai/stable-diffusion-3.5-large/text-to-image',
  seedreamV4: 'bytedance/seedream-v4/text-to-image',
  seedream45: 'bytedance/seedream-v4.5/text-to-image',
  nanoBananaT2i: 'google/nano-banana/text-to-image',
  nanoBananaProT2i: 'google/nano-banana-pro/text-to-image',
  flux2Pro: 'black-forest-labs/flux-2-pro/text-to-image',
  ideogramV4: 'ideogram/ideogram-v4/text-to-image',
  gptImage2T2i: 'openai/gpt-image-2/text-to-image',

  nanoBananaLiteEdit: 'google/nano-banana-2-lite/edit',
  nanoBanana2LiteT2i: 'google/nano-banana-2-lite/text-to-image',
  qwenImage2Edit: 'qwen/qwen-image-2/edit',
  fluxKontextPro: 'black-forest-labs/flux-kontext-pro/image-to-image',
  nanoBananaEdit: 'google/nano-banana/edit',
  nanoBanana2T2i: 'google/nano-banana-2/text-to-image',
  nanoBanana2Edit: 'google/nano-banana-2/edit',
  nanoBananaProEdit: 'google/nano-banana-pro/edit',
  gptImage2Edit: 'openai/gpt-image-2/edit',

  wan25I2v: 'alibaba/wan-2.5/image-to-video',
  kling25TurboI2v: 'kwaivgi/kling-v2.5-turbo-pro/image-to-video',
  kling3ProI2v: 'kwaivgi/kling-v3.0-pro/image-to-video',
  seedance15ProI2v: 'bytedance/seedance-v1.5-pro/image-to-video',
  veo3I2v: 'google/veo-3/image-to-video',
  veo31I2v: 'google/veo-3.1/image-to-video',
} as const;

export type AtlasModelId = (typeof ATLAS_MODEL_IDS)[keyof typeof ATLAS_MODEL_IDS];

export const TEMPLATE_TIER_PRIMARY: Record<TemplateTier, AtlasModelId> = {
  fast: ATLAS_MODEL_IDS.fluxSchnell,
  standard: ATLAS_MODEL_IDS.fluxDev,
  pro: ATLAS_MODEL_IDS.fluxProUltra,
};

export const STUDIO_TIER_PRIMARY: Record<StudioTier, AtlasModelId> = {
  'kraso-fast': ATLAS_MODEL_IDS.nanoBananaLiteEdit,
  'kraso-quality': ATLAS_MODEL_IDS.fluxKontextPro,
  'kraso-realism': ATLAS_MODEL_IDS.nanoBanana2Edit,
};
