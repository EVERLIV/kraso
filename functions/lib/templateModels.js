/**
 * Tier → fal model mapping for template / preset preview generation.
 * Model IDs are verified in ./falModelRegistry.js (re-check before deploy).
 */

const {
  FAL_REGISTRY_VERIFIED_AT,
  getFalModel,
  resolveTemplateModelId,
  TEMPLATE_TIER_MODELS,
} = require("./falModelRegistry");

/** @typedef {'fast' | 'standard' | 'pro'} TemplateTier */
/** @typedef {'style' | 'palette' | 'avatar' | 'preset'} TemplateCategory */

/** Per-model default input overrides (merged into buildTemplateInput) */
const MODEL_DEFAULT_INPUT = {
  "fal-ai/flux/schnell": {
    num_inference_steps: 4,
    enable_safety_checker: false,
  },
  "fal-ai/flux/dev": {
    num_inference_steps: 28,
    guidance_scale: 3.5,
    enable_safety_checker: false,
  },
  "fal-ai/flux-pro/v1.1-ultra": {
    enable_safety_checker: false,
  },
  "fal-ai/qwen-image-2/text-to-image": {
    enable_safety_checker: false,
    output_format: "webp",
  },
  "fal-ai/qwen-image": {
    enable_safety_checker: false,
    use_turbo: true,
  },
  "fal-ai/bytedance/seedream/v4/text-to-image": {
    enable_safety_checker: false,
  },
  "fal-ai/nano-banana": {
    safety_tolerance: "4",
    output_format: "webp",
  },
  "fal-ai/nano-banana-pro": {
    safety_tolerance: "4",
    resolution: "1K",
    output_format: "webp",
  },
  "fal-ai/flux-2-pro": {
    enable_safety_checker: false,
  },
  "fal-ai/bytedance/seedream/v4.5/text-to-image": {
    enable_safety_checker: false,
  },
  "ideogram/v4": {
    enable_safety_checker: false,
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
  const meta = getFalModel(id);
  const tierCfg = TEMPLATE_TIER_MODELS[tier] || TEMPLATE_TIER_MODELS.standard;
  return {
    id,
    label: meta.label,
    costHint: meta.costHint || "",
    docsUrl: meta.docsUrl,
    verifiedAt: FAL_REGISTRY_VERIFIED_AT,
    alternatives: tierCfg.alternatives,
    defaultInput: MODEL_DEFAULT_INPUT[id] || {},
  };
}

/**
 * Build fal input for a template preview (text-to-image).
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
  if (model.id.startsWith("fal-ai/nano-banana")) {
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
  FAL_REGISTRY_VERIFIED_AT,
  getTemplateModel,
  buildTemplateInput,
  TEMPLATE_TIER_MODELS,
};
