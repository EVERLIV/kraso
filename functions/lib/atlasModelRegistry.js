/**
 * Verified Atlas Cloud model IDs — single source of truth for Functions.
 * Re-check on https://www.atlascloud.ai/models before production deploy.
 *
 * Last verified: 2026-07-06
 */

const ATLAS_REGISTRY_VERIFIED_AT = "2026-07-06";

/** @typedef {'text-to-image' | 'image-to-image'} AtlasModelKind */
/** @typedef {'image' | 'image_url' | 'images' | 'image_urls'} AtlasImageInputField */

/**
 * @typedef {object} AtlasModelEntry
 * @property {string} id
 * @property {AtlasModelKind} kind
 * @property {string} label
 * @property {string} docsUrl
 * @property {string} [costHint]
 * @property {AtlasImageInputField} [imageInputField]
 * @property {boolean} [supportsResolution]
 * @property {string} [notes]
 */

/** @type {Record<string, AtlasModelEntry>} */
const ATLAS_MODELS = {
  // ── Template text-to-image (fast tier) ────────────────────────────────
  "black-forest-labs/flux-1-schnell/text-to-image": {
    id: "black-forest-labs/flux-1-schnell/text-to-image",
    kind: "text-to-image",
    label: "FLUX.1 Schnell",
    docsUrl: "https://www.atlascloud.ai/models/flux",
    costHint: "~$0.003",
  },
  "qwen/qwen-image/text-to-image": {
    id: "qwen/qwen-image/text-to-image",
    kind: "text-to-image",
    label: "Qwen Image",
    docsUrl: "https://www.atlascloud.ai/models",
    costHint: "~$0.02/MP",
  },
  "qwen/qwen-image-2/text-to-image": {
    id: "qwen/qwen-image-2/text-to-image",
    kind: "text-to-image",
    label: "Qwen Image 2",
    docsUrl: "https://www.atlascloud.ai/models",
    costHint: "~$0.02/MP",
  },
  "stability-ai/stable-diffusion-3.5-large/text-to-image": {
    id: "stability-ai/stable-diffusion-3.5-large/text-to-image",
    kind: "text-to-image",
    label: "SD 3.5 Large",
    docsUrl: "https://www.atlascloud.ai/models",
    costHint: "~$0.01–0.03",
  },

  // ── Template text-to-image (standard tier) ────────────────────────────
  "black-forest-labs/flux-1-dev/text-to-image": {
    id: "black-forest-labs/flux-1-dev/text-to-image",
    kind: "text-to-image",
    label: "FLUX.1 Dev",
    docsUrl: "https://www.atlascloud.ai/models/flux",
    costHint: "~$0.025",
  },
  "bytedance/seedream-v4/text-to-image": {
    id: "bytedance/seedream-v4/text-to-image",
    kind: "text-to-image",
    label: "Seedream V4",
    docsUrl: "https://www.atlascloud.ai/models",
    costHint: "~$0.03",
  },
  "google/nano-banana/text-to-image": {
    id: "google/nano-banana/text-to-image",
    kind: "text-to-image",
    label: "Nano Banana",
    docsUrl: "https://www.atlascloud.ai/models",
    costHint: "~$0.04",
  },

  // ── Template text-to-image (pro tier) ─────────────────────────────────
  "black-forest-labs/flux-1.1-pro-ultra/text-to-image": {
    id: "black-forest-labs/flux-1.1-pro-ultra/text-to-image",
    kind: "text-to-image",
    label: "FLUX 1.1 Pro Ultra",
    docsUrl: "https://www.atlascloud.ai/models/flux",
    costHint: "~$0.10–0.20",
    imageInputField: "image",
  },
  "google/nano-banana-pro/text-to-image": {
    id: "google/nano-banana-pro/text-to-image",
    kind: "text-to-image",
    label: "Nano Banana Pro",
    docsUrl: "https://www.atlascloud.ai/models",
    costHint: "~$0.10–0.20",
    supportsResolution: true,
  },
  "black-forest-labs/flux-2-pro/text-to-image": {
    id: "black-forest-labs/flux-2-pro/text-to-image",
    kind: "text-to-image",
    label: "FLUX.2 Pro",
    docsUrl: "https://www.atlascloud.ai/models/flux",
    costHint: "~$0.10+",
  },
  "bytedance/seedream-v4.5/text-to-image": {
    id: "bytedance/seedream-v4.5/text-to-image",
    kind: "text-to-image",
    label: "Seedream 4.5",
    docsUrl: "https://www.atlascloud.ai/models",
    costHint: "~$0.10–0.20",
  },
  "ideogram/ideogram-v4/text-to-image": {
    id: "ideogram/ideogram-v4/text-to-image",
    kind: "text-to-image",
    label: "Ideogram V4",
    docsUrl: "https://www.atlascloud.ai/models",
    costHint: "~$0.08–0.15",
  },
  "openai/gpt-image-2/text-to-image": {
    id: "openai/gpt-image-2/text-to-image",
    kind: "text-to-image",
    label: "GPT Image 2",
    docsUrl: "https://www.atlascloud.ai/models",
    costHint: "~$0.10–0.20",
  },

  // ── Studio image-to-image ───────────────────────────────────────────
  "google/nano-banana-2/text-to-image": {
    id: "google/nano-banana-2/text-to-image",
    kind: "text-to-image",
    label: "Nano Banana 2",
    docsUrl: "https://www.atlascloud.ai/models",
    costHint: "~$0.04–0.06",
    supportsResolution: true,
    notes: "T2I fallback for КрасоРеализм without reference",
  },
  "google/nano-banana-2-lite/text-to-image": {
    id: "google/nano-banana-2-lite/text-to-image",
    kind: "text-to-image",
    label: "Nano Banana 2 Lite",
    docsUrl: "https://www.atlascloud.ai/models",
    costHint: "sub-2s",
    notes: "T2I fallback for КрасоФаст without reference",
  },
  "google/nano-banana-2-lite/edit": {
    id: "google/nano-banana-2-lite/edit",
    kind: "image-to-image",
    label: "Nano Banana 2 Lite Edit",
    docsUrl: "https://www.atlascloud.ai/models",
    costHint: "sub-2s",
    imageInputField: "images",
    notes: "КрасоФаст — быстрые итерации в чате",
  },
  "qwen/qwen-image-2/edit": {
    id: "qwen/qwen-image-2/edit",
    kind: "image-to-image",
    label: "Qwen Image 2 Edit",
    docsUrl: "https://www.atlascloud.ai/models",
    costHint: "~$0.02/MP",
    imageInputField: "images",
  },
  "black-forest-labs/flux-kontext-pro/image-to-image": {
    id: "black-forest-labs/flux-kontext-pro/image-to-image",
    kind: "image-to-image",
    label: "FLUX Kontext Pro",
    docsUrl: "https://www.atlascloud.ai/models/flux",
    costHint: "~$0.04",
    imageInputField: "image",
    notes: "КрасоКачество — стабильные правки с референсом",
  },
  "google/nano-banana/edit": {
    id: "google/nano-banana/edit",
    kind: "image-to-image",
    label: "Nano Banana Edit",
    docsUrl: "https://www.atlascloud.ai/models",
    costHint: "~$0.04",
    imageInputField: "images",
  },
  "google/nano-banana-2/edit": {
    id: "google/nano-banana-2/edit",
    kind: "image-to-image",
    label: "Nano Banana 2 Edit",
    docsUrl: "https://www.atlascloud.ai/models",
    costHint: "~$0.04–0.06",
    imageInputField: "images",
    supportsResolution: true,
    notes: "КрасоРеализм — 1K/2K/4K via resolution param",
  },
  "google/nano-banana-pro/edit": {
    id: "google/nano-banana-pro/edit",
    kind: "image-to-image",
    label: "Nano Banana Pro Edit",
    docsUrl: "https://www.atlascloud.ai/models",
    costHint: "~$0.10–0.20",
    imageInputField: "images",
    supportsResolution: true,
  },
  "openai/gpt-image-2/edit": {
    id: "openai/gpt-image-2/edit",
    kind: "image-to-image",
    label: "GPT Image 2 Edit",
    docsUrl: "https://www.atlascloud.ai/models",
    costHint: "~$0.10–0.20",
    imageInputField: "images",
  },

  // ── Video image-to-video ──────────────────────────────────────────────
  "alibaba/wan-2.5/image-to-video": {
    id: "alibaba/wan-2.5/image-to-video",
    kind: "text-to-image",
    label: "Wan 2.5 I2V",
    docsUrl: "https://www.atlascloud.ai/models",
    imageInputField: "image",
  },
  "kwaivgi/kling-v2.5-turbo-pro/image-to-video": {
    id: "kwaivgi/kling-v2.5-turbo-pro/image-to-video",
    kind: "text-to-image",
    label: "Kling 2.5 Turbo Pro I2V",
    docsUrl: "https://www.atlascloud.ai/models/kwaivgi/kling-v2.5-turbo-pro/image-to-video",
    imageInputField: "image",
  },
  "kwaivgi/kling-v3.0-pro/image-to-video": {
    id: "kwaivgi/kling-v3.0-pro/image-to-video",
    kind: "text-to-image",
    label: "Kling 3.0 Pro I2V",
    docsUrl: "https://www.atlascloud.ai/models/kwaivgi/kling-v3.0-pro/image-to-video",
    imageInputField: "image",
  },
  "bytedance/seedance-v1.5-pro/image-to-video": {
    id: "bytedance/seedance-v1.5-pro/image-to-video",
    kind: "text-to-image",
    label: "Seedance 1.5 Pro I2V",
    docsUrl: "https://www.atlascloud.ai/models",
    imageInputField: "image",
  },
  "google/veo-3/image-to-video": {
    id: "google/veo-3/image-to-video",
    kind: "text-to-image",
    label: "Veo 3 I2V",
    docsUrl: "https://www.atlascloud.ai/models",
    imageInputField: "image",
  },
  "google/veo-3.1/image-to-video": {
    id: "google/veo-3.1/image-to-video",
    kind: "text-to-image",
    label: "Veo 3.1 I2V",
    docsUrl: "https://www.atlascloud.ai/models",
    imageInputField: "image",
  },
};

/** @typedef {'fast' | 'standard' | 'pro'} TemplateTier */

const TEMPLATE_TIER_MODELS = {
  fast: {
    primary: "black-forest-labs/flux-1-schnell/text-to-image",
    alternatives: [
      "qwen/qwen-image-2/text-to-image",
      "qwen/qwen-image/text-to-image",
      "black-forest-labs/flux-1-schnell/text-to-image",
      "stability-ai/stable-diffusion-3.5-large/text-to-image",
    ],
  },
  standard: {
    primary: "black-forest-labs/flux-1-dev/text-to-image",
    alternatives: [
      "bytedance/seedream-v4/text-to-image",
      "google/nano-banana/text-to-image",
      "black-forest-labs/flux-1-dev/text-to-image",
    ],
  },
  pro: {
    primary: "black-forest-labs/flux-1.1-pro-ultra/text-to-image",
    alternatives: [
      "google/nano-banana-pro/text-to-image",
      "black-forest-labs/flux-2-pro/text-to-image",
      "bytedance/seedream-v4.5/text-to-image",
      "ideogram/ideogram-v4/text-to-image",
      "black-forest-labs/flux-1.1-pro-ultra/text-to-image",
    ],
  },
};

/** @typedef {'kraso-fast' | 'kraso-quality' | 'kraso-realism'} StudioTier */

const STUDIO_TIER_MODELS = {
  "kraso-fast": {
    primary: "google/nano-banana-2-lite/edit",
    alternatives: ["qwen/qwen-image-2/edit", "google/nano-banana-2-lite/edit"],
  },
  "kraso-quality": {
    primary: "black-forest-labs/flux-kontext-pro/image-to-image",
    alternatives: ["google/nano-banana/edit", "black-forest-labs/flux-kontext-pro/image-to-image"],
  },
  "kraso-realism": {
    primary: "google/nano-banana-2/edit",
    alternatives: ["google/nano-banana-pro/edit", "openai/gpt-image-2/edit", "google/nano-banana-2/edit"],
  },
};

const STUDIO_TIER_T2I = {
  "kraso-fast": "google/nano-banana-2-lite/text-to-image",
  "kraso-quality": "google/nano-banana/text-to-image",
  "kraso-realism": "google/nano-banana-2/text-to-image",
};

/** LLM for prompt enhancement */
const ATLAS_ENHANCE_LLM = "google/gemini-2.5-flash-lite";

/**
 * @param {string} modelId
 * @returns {AtlasModelEntry}
 */
function getAtlasModel(modelId) {
  const entry = ATLAS_MODELS[modelId];
  if (!entry) {
    throw new Error(`Unknown Atlas model ID: ${modelId}. Check atlasModelRegistry.js`);
  }
  return entry;
}

/**
 * @param {TemplateTier} tier
 * @param {string} [modelIdOverride]
 */
function resolveTemplateModelId(tier = "standard", modelIdOverride) {
  if (modelIdOverride) {
    getAtlasModel(modelIdOverride);
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
    getAtlasModel(modelIdOverride);
    return modelIdOverride;
  }
  const tierCfg = STUDIO_TIER_MODELS[tier] || STUDIO_TIER_MODELS["kraso-quality"];
  return tierCfg.primary;
}

function listAllModelIds() {
  return Object.keys(ATLAS_MODELS);
}

module.exports = {
  ATLAS_REGISTRY_VERIFIED_AT,
  ATLAS_MODELS,
  TEMPLATE_TIER_MODELS,
  STUDIO_TIER_MODELS,
  STUDIO_TIER_T2I,
  ATLAS_ENHANCE_LLM,
  getAtlasModel,
  resolveTemplateModelId,
  resolveStudioModelId,
  listAllModelIds,
};
