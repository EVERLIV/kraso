/**
 * Map internal (legacy FAL-shaped) payloads to Atlas Cloud API fields.
 */

/**
 * @param {string|number|undefined} duration
 * @returns {number|undefined}
 */
function parseDurationSeconds(duration) {
  if (duration == null) return undefined;
  if (typeof duration === "number") return duration;
  const s = String(duration).trim().replace(/s$/i, "");
  const n = parseInt(s, 10);
  return Number.isFinite(n) ? n : undefined;
}

/**
 * @param {Record<string, unknown>} input
 * @returns {Record<string, unknown>}
 */
function buildAtlasVideoInput(input) {
  const out = { ...input };

  if (Array.isArray(input.image_urls) && input.image_urls.length > 0) {
    out.image = input.image_urls[0];
    delete out.image_urls;
  } else if (typeof input.image_url === "string") {
    out.image = input.image_url;
    delete out.image_url;
  }

  if (input.generate_audio != null) {
    out.generate_audio = input.generate_audio;
  }

  const dur = parseDurationSeconds(input.duration);
  if (dur != null) out.duration = dur;

  if (input.negative_prompt) out.negative_prompt = input.negative_prompt;
  if (input.cfg_scale != null) out.cfg_scale = input.cfg_scale;
  if (input.aspect_ratio) out.aspect_ratio = input.aspect_ratio;
  if (input.resolution) out.resolution = input.resolution;

  delete out.model_id;
  delete out.auto_fix;

  return out;
}

/**
 * @param {string} modelId
 * @param {Record<string, unknown>} input
 * @returns {Record<string, unknown>}
 */
function buildAtlasImageInput(modelId, input) {
  const out = { ...input };

  if (Array.isArray(input.image_urls) && input.image_urls.length > 0) {
    if (modelId.includes("/edit") || modelId.includes("kontext") || modelId.includes("image-to-image")) {
      out.images = input.image_urls;
    } else {
      out.image = input.image_urls[0];
    }
    delete out.image_urls;
  } else if (typeof input.image_url === "string") {
    out.image = input.image_url;
    delete out.image_url;
  }

  if (input.aspect_ratio) out.aspect_ratio = input.aspect_ratio;
  if (input.resolution) out.resolution = input.resolution;
  if (input.output_format) out.output_format = input.output_format;
  if (input.seed != null) out.seed = input.seed;

  delete out.num_images;
  delete out.safety_tolerance;
  delete out.enable_safety_checker;
  delete out.limit_generations;

  return out;
}

module.exports = {
  buildAtlasVideoInput,
  buildAtlasImageInput,
  parseDurationSeconds,
};
