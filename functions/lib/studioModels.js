/**
 * Build Atlas Cloud input for user studio / chat image generation.
 */

const {
  getAtlasModel,
  resolveStudioModelId,
  STUDIO_TIER_T2I,
} = require("./atlasModelRegistry");

/** @typedef {'kraso-fast' | 'kraso-quality' | 'kraso-realism'} StudioTier */

const ASPECT_TO_NANO = {
  "1:1": "1:1",
  "16:9": "16:9",
  "9:16": "9:16",
  "4:3": "4:3",
  "3:4": "3:4",
  "4:5": "4:5",
};

const ASPECT_TO_FLUX_SIZE = {
  "1:1": "square",
  "16:9": "landscape_16_9",
  "9:16": "portrait_16_9",
  "4:3": "landscape_4_3",
  "3:4": "portrait_4_3",
  "4:5": "portrait_4_3",
};

const ASPECT_TO_QWEN_SIZE = {
  "1:1": "square_hd",
  "16:9": "landscape_16_9",
  "9:16": "portrait_16_9",
  "4:3": "landscape_4_3",
  "3:4": "portrait_4_3",
  "4:5": "portrait_4_3",
};

/**
 * @param {Array<{ data: string, mimeType?: string }>} referenceImages base64 without data: prefix
 * @returns {string[]}
 */
function toDataUris(referenceImages) {
  return (referenceImages || [])
    .filter((r) => r?.data)
    .map((r) => {
      const mime = r.mimeType || "image/jpeg";
      const data = r.data.replace(/^data:[^;]+;base64,/, "");
      return `data:${mime};base64,${data}`;
    });
}

/**
 * @param {object} opts
 * @param {string} opts.prompt
 * @param {StudioTier} [opts.krasoTier]
 * @param {string} [opts.modelId]
 * @param {string} [opts.aspectRatio]
 * @param {'1K'|'2K'|'4K'} [opts.resolution]
 * @param {Array<{ data: string, mimeType?: string }>} [opts.referenceImages]
 * @param {number} [opts.seed]
 */
function buildStudioInput({
  prompt,
  krasoTier = "kraso-quality",
  modelId: modelIdOverride,
  aspectRatio = "1:1",
  resolution = "1K",
  referenceImages = [],
  seed,
}) {
  const imageUris = toDataUris(referenceImages);
  const hasReference = imageUris.length > 0;

  let modelId;
  if (modelIdOverride) {
    modelId = modelIdOverride;
    getAtlasModel(modelId);
  } else if (hasReference) {
    modelId = resolveStudioModelId(krasoTier);
  } else {
    modelId = STUDIO_TIER_T2I[krasoTier] || STUDIO_TIER_T2I["kraso-quality"];
    getAtlasModel(modelId);
  }

  const meta = getAtlasModel(modelId);
  const input = {
    prompt,
    num_images: 1,
  };

  if (hasReference) {
    if (meta.imageInputField === "image_url") {
      input.image_url = imageUris[0];
    } else if (meta.imageInputField === "image_urls") {
      input.image_urls = imageUris;
    } else {
      input.image_urls = imageUris;
    }
  }

  if (modelId.includes("nano-banana") || modelId.startsWith("google/nano-banana")) {
    input.aspect_ratio = ASPECT_TO_NANO[aspectRatio] || "auto";
    input.safety_tolerance = "4";
    input.output_format = "png";
    if (modelId.includes("lite")) {
      input.limit_generations = true;
    }
    if (meta.supportsResolution && resolution) {
      input.resolution = resolution;
    }
  } else if (modelId === "black-forest-labs/flux-kontext-pro/image-to-image") {
    const ar = ASPECT_TO_NANO[aspectRatio];
    if (ar) input.aspect_ratio = ar;
    input.output_format = "jpeg";
    input.safety_tolerance = "2";
  } else if (modelId === "qwen/qwen-image-2/edit") {
    input.image_size = ASPECT_TO_QWEN_SIZE[aspectRatio] || "square_hd";
    input.enable_safety_checker = false;
    input.output_format = "png";
  } else if (modelId === "openai/gpt-image-2/edit" || modelId.endsWith("/edit")) {
    input.image_size = "auto";
    input.quality = resolution === "4K" || resolution === "2K" ? "high" : "medium";
    input.output_format = "png";
  } else if (meta.kind === "text-to-image") {
    if (modelId.startsWith("ideogram/")) {
      input.image_size = ASPECT_TO_FLUX_SIZE[aspectRatio] || "square_hd";
    } else {
      input.image_size = ASPECT_TO_FLUX_SIZE[aspectRatio] || "square";
    }
  }

  if (typeof seed === "number") input.seed = seed;

  return {
    modelId,
    input,
    mode: hasReference ? "edit" : "text-to-image",
    krasoTier,
    modelMeta: meta,
  };
}

module.exports = {
  buildStudioInput,
  toDataUris,
};
