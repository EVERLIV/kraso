/**
 * Tier → Atlas model mapping for template / preset preview generation.
 * Model IDs are verified in ./atlasModelRegistry.js (re-check before deploy).
 */

const {
  ATLAS_REGISTRY_VERIFIED_AT,
  getAtlasModel,
  resolveTemplateModelId,
  TEMPLATE_TIER_MODELS,
} = require("./atlasModelRegistry");

/** @typedef {'fast' | 'standard' | 'pro'} TemplateTier */
/** @typedef {'style' | 'palette' | 'avatar' | 'preset'} TemplateCategory */

/** Per-model default input overrides (merged into buildTemplateInput) */
const MODEL_DEFAULT_INPUT = {
  "black-forest-labs/flux-1-schnell/text-to-image": {
    num_inference_steps: 4,
  },
  "black-forest-labs/flux-1-dev/text-to-image": {
    num_inference_steps: 28,
    guidance_scale: 3.5,
  },
  "black-forest-labs/flux-1.1-pro-ultra/text-to-image": {},
  "qwen/qwen-image-2/text-to-image": {
    output_format: "webp",
  },
  "qwen/qwen-image/text-to-image": {
    use_turbo: true,
  },
  "bytedance/seedream-v4/text-to-image": {},
  "google/nano-banana/text-to-image": {
    output_format: "webp",
  },
  "google/nano-banana-pro/text-to-image": {
    resolution: "1K",
    output_format: "webp",
  },
  "black-forest-labs/flux-2-pro/text-to-image": {},
  "bytedance/seedream-v4.5/text-to-image": {},
  "ideogram/ideogram-v4/text-to-image": {
    rendering_speed: "BALANCED",
  },
};

const ASPECT_TO_FLUX_IMAGE_SIZE = {
  "1:1": "square",
  "4:3": "landscape_4_3",
  "3:4": "portrait_4_3",
  "16:9": "landscape_16_9",
  "9:16": "portrait_16_9",
};

const ASPECT_TO_NANO_BANANA = {
  "1:1": "1:1",
  "4:3": "4:3",
  "3:4": "3:4",
  "16:9": "16:9",
  "9:16": "9:16",
};

/**
 * @param {TemplateTier} tier
 * @param {string} [modelIdOverride]
 */
function getTemplateModel(tier = "standard", modelIdOverride) {
  const id = resolveTemplateModelId(tier, modelIdOverride);
  const meta = getAtlasModel(id);
  const tierCfg = TEMPLATE_TIER_MODELS[tier] || TEMPLATE_TIER_MODELS.standard;
  return {
    id,
    label: meta.label,
    costHint: meta.costHint || "",
    docsUrl: meta.docsUrl,
    verifiedAt: ATLAS_REGISTRY_VERIFIED_AT,
    alternatives: tierCfg.alternatives,
    defaultInput: MODEL_DEFAULT_INPUT[id] || {},
  };
}

/**
 * Build Atlas input for a template preview (text-to-image).
 * @param {object} opts
 * @param {string} opts.prompt
 * @param {TemplateTier} [opts.tier]
 * @param {string} [opts.modelId] explicit model override (must be in registry)
 * @param {string} [opts.aspectRatio]
 * @param {number} [opts.seed]
 */
function buildTemplateInput({ prompt, tier = "standard", modelId, aspectRatio = "1:1", seed }) {
  const model = getTemplateModel(tier, modelId);
  const input = {
    prompt,
    num_images: 1,
    ...model.defaultInput,
  };

  // Aspect / size — model-specific schemas differ on fal
  if (model.id.startsWith("google/nano-banana")) {
    input.aspect_ratio = ASPECT_TO_NANO_BANANA[aspectRatio] || "1:1";
  } else if (model.id.startsWith("ideogram/")) {
    input.image_size = ASPECT_TO_FLUX_IMAGE_SIZE[aspectRatio] || "square_hd";
  } else {
    input.image_size = ASPECT_TO_FLUX_IMAGE_SIZE[aspectRatio] || "square";
  }

  if (typeof seed === "number") input.seed = seed;

  return {
    modelId: model.id,
    input,
    tierMeta: model,
  };
}

module.exports = {
  ATLAS_REGISTRY_VERIFIED_AT,
  getTemplateModel,
  buildTemplateInput,
  TEMPLATE_TIER_MODELS,
};
