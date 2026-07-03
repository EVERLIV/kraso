const { onRequest } = require("firebase-functions/https");
const logger = require("firebase-functions/logger");
const { buildStudioInput } = require("./lib/studioModels");
const { runFalQueue, extractImageUrl } = require("./lib/falQueueClient");

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

/**
 * User studio / chat image generation via fal.ai.
 *
 * POST body:
 * {
 *   prompt: string,
 *   krasoTier?: 'kraso-fast'|'kraso-quality'|'kraso-realism',
 *   modelId?: string,
 *   aspectRatio?: '1:1'|'16:9'|...,
 *   resolution?: '1K'|'2K'|'4K',
 *   referenceImages?: [{ data: base64, mimeType?: string }],
 *   seed?: number
 * }
 *
 * Returns: { image: { base64, mimeType }, modelId, mode, url? }
 */
const generateStudioImageHandler = onRequest({ timeoutSeconds: 300, memory: "1GiB" }, async (req, res) => {
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
    krasoTier = "kraso-quality",
    modelId: modelIdOverride,
    aspectRatio = "1:1",
    resolution = "1K",
    referenceImages = [],
    imageBase64,
    mimeType,
    seed,
  } = req.body || {};

  if (!prompt || typeof prompt !== "string") {
    res.status(400).json({ error: "Missing or invalid prompt" });
    return;
  }

  const refs = [...(referenceImages || [])];
  if (imageBase64 && !refs.length) {
    refs.push({ data: imageBase64, mimeType: mimeType || "image/jpeg" });
  }

  try {
    const { modelId, input, mode, modelMeta } = buildStudioInput({
      prompt,
      krasoTier,
      modelId: modelIdOverride,
      aspectRatio,
      resolution,
      referenceImages: refs,
      seed,
    });

    logger.info("generateStudioImage.start", {
      modelId,
      mode,
      krasoTier,
      aspectRatio,
      resolution,
      refCount: refs.length,
    });

    const { data } = await runFalQueue(modelId, input);
    const image = extractImageUrl(data);

    if (!image?.url) {
      logger.error("generateStudioImage: no image in fal response", { modelId, data });
      res.status(500).json({ error: "Model did not return an image URL" });
      return;
    }

    const fetchResp = await fetch(image.url);
    if (!fetchResp.ok) {
      throw new Error(`Failed to download generated image: ${fetchResp.statusText}`);
    }

    const buffer = Buffer.from(await fetchResp.arrayBuffer());
    const contentType = fetchResp.headers.get("content-type") || image.content_type || "image/png";

    res.status(200).json({
      image: {
        base64: buffer.toString("base64"),
        mimeType: contentType.split(";")[0],
      },
      modelId,
      mode,
      modelLabel: modelMeta.label,
      url: image.url,
      width: image.width,
      height: image.height,
    });
  } catch (err) {
    logger.error("generateStudioImage error", err);
    res.status(500).json({ error: err.message || String(err) });
  }
});

module.exports = {
  generateStudioImageHandler,
};
