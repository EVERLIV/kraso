/**
 * Verified fal.ai model IDs — single source of truth for Functions.
 * Re-check on https://fal.ai/models before production deploy.
 *
 * Last verified: 2026-07-03 (public API docs pages)
 */

const FAL_REGISTRY_VERIFIED_AT = "2026-07-03";

/** @typedef {'text-to-image' | 'image-to-image'} FalModelKind */
/** @typedef {'image_url' | 'image_urls'} FalImageInputField */

/**
 * @typedef {object} FalModelEntry
 * @property {string} id
 * @property {FalModelKind} kind
 * @property {string} label
 * @property {string} docsUrl
 * @property {string} [costHint]
 * @property {FalImageInputField} [imageInputField]
 * @property {boolean} [supportsResolution]
 * @property {string} [notes]
 */

/** @type {Record<string, FalModelEntry>} */
const FAL_MODELS = {
  // ── Template text-to-image (дешёвый tier) ─────────────────────────────
  "fal-ai/flux/schnell": {
    id: "fal-ai/flux/schnell",
    kind: "text-to-image",
    label: "FLUX.1 Schnell",
    docsUrl: "https://fal.ai/models/fal-ai/flux/schnell/api",
    costHint: "~$0.003–0.01",
  },
  "fal-ai/qwen-image": {
    id: "fal-ai/qwen-image",
    kind: "text-to-image",
    label: "Qwen Image",
    docsUrl: "https://fal.ai/models/fal-ai/qwen-image/api",
    costHint: "~$0.02/MP",
  },
  "fal-ai/qwen-image-2/text-to-image": {
    id: "fal-ai/qwen-image-2/text-to-image",
    kind: "text-to-image",
    label: "Qwen Image 2",
    docsUrl: "https://fal.ai/models/fal-ai/qwen-image-2/text-to-image/api",
    costHint: "~$0.02/MP",
    notes: "Native 2K, newer than qwen-image",
  },
  "fal-ai/stable-diffusion-v35-large": {
    id: "fal-ai/stable-diffusion-v35-large",
    kind: "text-to-image",
    label: "SD 3.5 Large",
    docsUrl: "https://fal.ai/models/fal-ai/stable-diffusion-v35-large/api",
    costHint: "~$0.01–0.03",
    notes: "SDXL-class fallback",
  },

  // ── Template text-to-image (средний tier) ─────────────────────────────
  "fal-ai/flux/dev": {
    id: "fal-ai/flux/dev",
    kind: "text-to-image",
    label: "FLUX.1 Dev",
    docsUrl: "https://fal.ai/models/fal-ai/flux/dev/api",
    costHint: "~$0.025",
  },
  "fal-ai/bytedance/seedream/v4/text-to-image": {
    id: "fal-ai/bytedance/seedream/v4/text-to-image",
    kind: "text-to-image",
    label: "Seedream V4",
    docsUrl: "https://fal.ai/models/fal-ai/bytedance/seedream/v4/text-to-image/api",
    costHint: "~$0.03",
  },
  "fal-ai/nano-banana": {
    id: "fal-ai/nano-banana",
    kind: "text-to-image",
    label: "Nano Banana",
    docsUrl: "https://fal.ai/models/fal-ai/nano-banana/api",
    costHint: "~$0.04",
  },

  // ── Template text-to-image (премиум tier) ─────────────────────────────
  "fal-ai/flux-pro/v1.1-ultra": {
    id: "fal-ai/flux-pro/v1.1-ultra",
    kind: "text-to-image",
    label: "FLUX 1.1 Pro Ultra",
    docsUrl: "https://fal.ai/models/fal-ai/flux-pro/v1.1-ultra/api",
    costHint: "~$0.10–0.20",
    notes: "Supports optional image_url for redux-style conditioning",
    imageInputField: "image_url",
  },
  "fal-ai/nano-banana-pro": {
    id: "fal-ai/nano-banana-pro",
    kind: "text-to-image",
    label: "Nano Banana Pro",
    docsUrl: "https://fal.ai/models/fal-ai/nano-banana-pro/api",
    costHint: "~$0.10–0.20",
    supportsResolution: true,
    notes: "Native 1K/2K/4K via resolution param",
  },
  "fal-ai/flux-2-pro": {
    id: "fal-ai/flux-2-pro",
    kind: "text-to-image",
    label: "FLUX.2 Pro",
    docsUrl: "https://fal.ai/models/fal-ai/flux-2-pro/api",
    costHint: "~$0.10+",
  },
  "fal-ai/bytedance/seedream/v4.5/text-to-image": {
    id: "fal-ai/bytedance/seedream/v4.5/text-to-image",
    kind: "text-to-image",
    label: "Seedream 4.5",
    docsUrl: "https://fal.ai/models/fal-ai/bytedance/seedream/v4.5/text-to-image/api",
    costHint: "~$0.10–0.20",
  },
  "ideogram/v4": {
    id: "ideogram/v4",
    kind: "text-to-image",
    label: "Ideogram V4",
    docsUrl: "https://fal.ai/models/ideogram/v4/api",
    costHint: "~$0.08–0.15",
    notes: "Best for text/logos on image",
  },
  "openai/gpt-image-2": {
    id: "openai/gpt-image-2",
    kind: "text-to-image",
    label: "GPT Image 2",
    docsUrl: "https://fal.ai/models/openai/gpt-image-2/api",
    costHint: "~$0.10–0.20",
    notes: "T2I endpoint; edit variant is openai/gpt-image-2/edit",
  },

  // ── Studio image-to-image (фото-генерация с референсом) ───────────────
  "google/nano-banana-2-lite": {
    id: "google/nano-banana-2-lite",
    kind: "text-to-image",
    label: "Nano Banana 2 Lite",
    docsUrl: "https://fal.ai/models/google/nano-banana-2-lite/api",
    costHint: "sub-2s",
    notes: "T2I fallback for КрасоФаст without reference",
  },
  "google/nano-banana-2-lite/edit": {
    id: "google/nano-banana-2-lite/edit",
    kind: "image-to-image",
    label: "Nano Banana 2 Lite Edit",
    docsUrl: "https://fal.ai/models/google/nano-banana-2-lite/edit/api",
    costHint: "sub-2s, cheapest edit",
    imageInputField: "image_urls",
    notes: "КрасоФаст — быстрые итерации в чате",
  },
  "fal-ai/qwen-image-2/edit": {
    id: "fal-ai/qwen-image-2/edit",
    kind: "image-to-image",
    label: "Qwen Image 2 Edit",
    docsUrl: "https://fal.ai/models/fal-ai/qwen-image-2/edit/api",
    costHint: "~$0.02/MP",
    imageInputField: "image_urls",
  },
  "fal-ai/flux-pro/kontext": {
    id: "fal-ai/flux-pro/kontext",
    kind: "image-to-image",
    label: "FLUX Kontext Pro",
    docsUrl: "https://fal.ai/models/fal-ai/flux-pro/kontext/api",
    costHint: "~$0.04",
    imageInputField: "image_url",
    notes: "КрасоКачество — стабильные правки с референсом",
  },
  "fal-ai/nano-banana/edit": {
    id: "fal-ai/nano-banana/edit",
    kind: "image-to-image",
    label: "Nano Banana Edit",
    docsUrl: "https://fal.ai/models/fal-ai/nano-banana/edit/api",
    costHint: "~$0.04",
    imageInputField: "image_urls",
  },
  "fal-ai/nano-banana-2/edit": {
    id: "fal-ai/nano-banana-2/edit",
    kind: "image-to-image",
    label: "Nano Banana 2 Edit",
    docsUrl: "https://fal.ai/models/fal-ai/nano-banana-2/edit/api",
    costHint: "~$0.04–0.06",
    imageInputField: "image_urls",
    supportsResolution: true,
  },
  "fal-ai/nano-banana-pro/edit": {
    id: "fal-ai/nano-banana-pro/edit",
    kind: "image-to-image",
    label: "Nano Banana Pro Edit",
    docsUrl: "https://fal.ai/models/fal-ai/nano-banana-pro/edit/api",
    costHint: "~$0.10–0.20",
    imageInputField: "image_urls",
    supportsResolution: true,
    notes: "КрасоРеализм — 1K/2K/4K via resolution param",
  },
  "openai/gpt-image-2/edit": {
    id: "openai/gpt-image-2/edit",
    kind: "image-to-image",
    label: "GPT Image 2 Edit",
    docsUrl: "https://fal.ai/models/openai/gpt-image-2/edit/api",
    costHint: "~$0.10–0.20",
    imageInputField: "image_urls",
    notes: "Сложные инструкции, маски через mask_url",
  },
};

/** @typedef {'fast' | 'standard' | 'pro'} TemplateTier */

/**
 * Tier → primary + fallback model IDs for template preview generation.
 * Primary = current production default; alternatives = verified swap options.
 */
const TEMPLATE_TIER_MODELS = {
  fast: {
    primary: "fal-ai/flux/schnell",
    alternatives: [
      "fal-ai/qwen-image-2/text-to-image",
      "fal-ai/qwen-image",
      "fal-ai/flux/schnell",
      "fal-ai/stable-diffusion-v35-large",
    ],
  },
  standard: {
    primary: "fal-ai/flux/dev",
    alternatives: [
      "fal-ai/bytedance/seedream/v4/text-to-image",
      "fal-ai/nano-banana",
      "fal-ai/flux/dev",
    ],
  },
  pro: {
    primary: "fal-ai/flux-pro/v1.1-ultra",
    alternatives: [
      "fal-ai/nano-banana-pro",
      "fal-ai/flux-2-pro",
      "fal-ai/bytedance/seedream/v4.5/text-to-image",
      "ideogram/v4",
      "fal-ai/flux-pro/v1.1-ultra",
    ],
  },
};

/** @typedef {'kraso-fast' | 'kraso-quality' | 'kraso-realism'} StudioTier */

/** Kraso UI → FAL edit model (for future generateStudioImage) */
const STUDIO_TIER_MODELS = {
  "kraso-fast": {
    primary: "google/nano-banana-2-lite/edit",
    alternatives: ["fal-ai/qwen-image-2/edit", "google/nano-banana-2-lite/edit"],
  },
  "kraso-quality": {
    primary: "fal-ai/flux-pro/kontext",
    alternatives: ["fal-ai/nano-banana/edit", "fal-ai/flux-pro/kontext"],
  },
  "kraso-realism": {
    primary: "fal-ai/nano-banana-pro/edit",
    alternatives: ["openai/gpt-image-2/edit", "fal-ai/nano-banana-pro/edit"],
  },
};

/** Text-to-image when studio request has no reference photos */
const STUDIO_TIER_T2I = {
  "kraso-fast": "google/nano-banana-2-lite",
  "kraso-quality": "fal-ai/nano-banana",
  "kraso-realism": "fal-ai/nano-banana-pro",
};

/**
 * @param {string} modelId
 * @returns {FalModelEntry}
 */
function getFalModel(modelId) {
  const entry = FAL_MODELS[modelId];
  if (!entry) {
    throw new Error(`Unknown FAL model ID: ${modelId}. Check falModelRegistry.js`);
  }
  return entry;
}

/**
 * @param {TemplateTier} tier
 * @param {string} [modelIdOverride]
 */
function resolveTemplateModelId(tier = "standard", modelIdOverride) {
  if (modelIdOverride) {
    getFalModel(modelIdOverride);
    return modelIdOverride;
  }
  const tierCfg = TEMPLATE_TIER_MODELS[tier] || TEMPLATE_TIER_MODELS.standard;
  return tierCfg.primary;
}

/**
 * @param {StudioTier} tier
 * @param {string} [modelIdOverride]
 */
function resolveStudioModelId(tier = "kraso-quality", modelIdOverride) {
  if (modelIdOverride) {
    getFalModel(modelIdOverride);
    return modelIdOverride;
  }
  const tierCfg = STUDIO_TIER_MODELS[tier] || STUDIO_TIER_MODELS["kraso-quality"];
  return tierCfg.primary;
}

/** All registered model IDs (for audit scripts) */
function listAllModelIds() {
  return Object.keys(FAL_MODELS);
}

module.exports = {
  FAL_REGISTRY_VERIFIED_AT,
  FAL_MODELS,
  TEMPLATE_TIER_MODELS,
  STUDIO_TIER_MODELS,
  STUDIO_TIER_T2I,
  getFalModel,
  resolveTemplateModelId,
  resolveStudioModelId,
  listAllModelIds,
};
