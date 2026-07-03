/**
 * Client-side mirror of verified fal.ai model IDs.
 * Server source of truth: functions/lib/falModelRegistry.js
 *
 * Last verified: 2026-07-03
 */

export const FAL_REGISTRY_VERIFIED_AT = '2026-07-03';

export type FalModelKind = 'text-to-image' | 'image-to-image';
export type FalImageInputField = 'image_url' | 'image_urls';
export type TemplateTier = 'fast' | 'standard' | 'pro';
export type StudioTier = 'kraso-fast' | 'kraso-quality' | 'kraso-realism';

export interface FalModelEntry {
  id: string;
  kind: FalModelKind;
  label: string;
  docsUrl: string;
  costHint?: string;
  imageInputField?: FalImageInputField;
  supportsResolution?: boolean;
  notes?: string;
}

/** Verified model IDs — do not use unlisted endpoints in production */
export const FAL_MODEL_IDS = {
  // Templates (text-to-image)
  fluxSchnell: 'fal-ai/flux/schnell',
  fluxDev: 'fal-ai/flux/dev',
  fluxProUltra: 'fal-ai/flux-pro/v1.1-ultra',
  qwenImage: 'fal-ai/qwen-image',
  qwenImage2T2i: 'fal-ai/qwen-image-2/text-to-image',
  sdxl35: 'fal-ai/stable-diffusion-v35-large',
  seedreamV4: 'fal-ai/bytedance/seedream/v4/text-to-image',
  seedream45: 'fal-ai/bytedance/seedream/v4.5/text-to-image',
  nanoBananaT2i: 'fal-ai/nano-banana',
  nanoBananaProT2i: 'fal-ai/nano-banana-pro',
  flux2Pro: 'fal-ai/flux-2-pro',
  ideogramV4: 'ideogram/v4',
  gptImage2T2i: 'openai/gpt-image-2',

  // Studio (image-to-image / edit)
  nanoBananaLiteEdit: 'google/nano-banana-2-lite/edit',
  nanoBanana2LiteT2i: 'google/nano-banana-2-lite',
  qwenImage2Edit: 'fal-ai/qwen-image-2/edit',
  fluxKontextPro: 'fal-ai/flux-pro/kontext',
  nanoBananaEdit: 'fal-ai/nano-banana/edit',
  nanoBanana2Edit: 'fal-ai/nano-banana-2/edit',
  nanoBananaProEdit: 'fal-ai/nano-banana-pro/edit',
  gptImage2Edit: 'openai/gpt-image-2/edit',
} as const;

export type FalModelId = (typeof FAL_MODEL_IDS)[keyof typeof FAL_MODEL_IDS];

export const TEMPLATE_TIER_PRIMARY: Record<TemplateTier, FalModelId> = {
  fast: FAL_MODEL_IDS.fluxSchnell,
  standard: FAL_MODEL_IDS.fluxDev,
  pro: FAL_MODEL_IDS.fluxProUltra,
};

export const STUDIO_TIER_PRIMARY: Record<StudioTier, FalModelId> = {
  'kraso-fast': FAL_MODEL_IDS.nanoBananaLiteEdit,
  'kraso-quality': FAL_MODEL_IDS.fluxKontextPro,
  'kraso-realism': FAL_MODEL_IDS.nanoBananaProEdit,
};
