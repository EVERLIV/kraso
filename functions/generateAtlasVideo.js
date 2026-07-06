const { onRequest } = require("firebase-functions/https");
const logger = require("firebase-functions/logger");
const { runAtlasPrediction, extractVideoUrl } = require("./lib/atlasCloudClient");
const { buildAtlasVideoInput } = require("./lib/atlasInputAdapter");
const { getAtlasModel } = require("./lib/atlasModelRegistry");

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

/**
 * Image-to-video generation via Atlas Cloud.
 *
 * POST body:
 * {
 *   prompt: string,
 *   image_urls: string[],
 *   aspect_ratio?: string,
 *   duration?: string | number,
 *   resolution?: string,
 *   generate_audio?: boolean,
 *   negative_prompt?: string,
 *   model_id: string
 * }
 *
 * Returns: { success: true, video: { url } }
 */
const generateAtlasVideoHandler = onRequest({ timeoutSeconds: 540, memory: "2GiB" }, async (req, res) => {
  Object.entries(CORS).forEach(([k, v]) => res.set(k, v));
  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  const {
    prompt,
    image_urls,
    image_url,
    aspect_ratio = "16:9",
    duration,
    resolution = "720p",
    generate_audio = true,
    negative_prompt,
    cfg_scale,
    model_id,
  } = req.body || {};

  if (!prompt || typeof prompt !== "string") {
    res.status(400).json({ error: "Missing or invalid prompt" });
    return;
  }
  if (!model_id || typeof model_id !== "string") {
    res.status(400).json({ error: "Missing model_id" });
    return;
  }

  const urls = Array.isArray(image_urls) ? image_urls : image_url ? [image_url] : [];
  if (!urls.length || !urls[0]) {
    res.status(400).json({ error: "Missing image_urls or image_url" });
    return;
  }

  try {
    getAtlasModel(model_id);

    const rawInput = {
      prompt,
      image_urls: urls,
      aspect_ratio,
      duration,
      resolution,
      generate_audio,
      negative_prompt,
      cfg_scale,
    };

    const atlasInput = buildAtlasVideoInput(rawInput);

    logger.info("generateAtlasVideo.start", {
      model_id,
      aspect_ratio,
      duration,
      resolution,
      generate_audio,
    });

    const { data, requestId } = await runAtlasPrediction("video", model_id, atlasInput, {
      timeoutMs: 480_000,
    });

    const videoUrl = extractVideoUrl(data);
    if (!videoUrl) {
      logger.error("generateAtlasVideo: no video URL", { model_id, data });
      res.status(500).json({ error: "Model did not return a video URL" });
      return;
    }

    res.status(200).json({
      success: true,
      video: { url: videoUrl },
      modelId: model_id,
      requestId,
    });
  } catch (err) {
    logger.error("generateAtlasVideo.error", err);
    res.status(500).json({ error: err.message || String(err) });
  }
});

module.exports = { generateAtlasVideoHandler };
