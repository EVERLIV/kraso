const { onRequest } = require("firebase-functions/https");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const { buildTemplateInput } = require("./lib/templateModels");
const { runFalQueue, extractImageUrl } = require("./lib/falQueueClient");

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

/**
 * Generate a single template preview image via fal queue.
 *
 * POST body:
 * {
 *   prompt: string,           // required
 *   tier?: 'fast'|'standard'|'pro',
 *   modelId?: string,           // override tier primary — must be in falModelRegistry
 *   category?: 'style'|'palette'|'avatar'|'preset',
 *   aspectRatio?: '1:1'|'3:4'|...,
 *   seed?: number,
 *   templateId?: string,      // e.g. studio-beauty — for logging / storage path
 *   saveToStorage?: boolean,  // upload to Firebase Storage, return public URL
 *   storagePath?: string      // optional override, default templates/{category}/{id}.webp
 * }
 *
 * Returns: { url, tier, modelId, category?, templateId?, storageUrl? }
 */
const generateTemplateImageHandler = onRequest({ timeoutSeconds: 300, memory: "1GiB" }, async (req, res) => {
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
    tier = "standard",
    modelId: modelIdOverride,
    category = "style",
    aspectRatio = "1:1",
    seed,
    templateId,
    saveToStorage = false,
    storagePath,
  } = req.body || {};

  if (!prompt || typeof prompt !== "string") {
    res.status(400).json({ error: "Missing or invalid prompt" });
    return;
  }

  try {
    const { modelId, input, tierMeta } = buildTemplateInput({
      prompt,
      tier,
      modelId: modelIdOverride,
      aspectRatio,
      seed,
    });
    const { data } = await runFalQueue(modelId, input);
    const image = extractImageUrl(data);

    if (!image?.url) {
      logger.error("generateTemplateImage: no image in fal response", { modelId, data });
      res.status(500).json({ error: "Model did not return an image URL" });
      return;
    }

    let storageUrl = null;
    if (saveToStorage) {
      storageUrl = await persistFalImageToStorage(image.url, {
        category,
        templateId,
        storagePath,
      });
    }

    res.status(200).json({
      url: image.url,
      storageUrl,
      tier,
      tierLabel: tierMeta.label,
      modelId,
      category,
      templateId: templateId || null,
      width: image.width,
      height: image.height,
    });
  } catch (err) {
    logger.error("generateTemplateImage error", err);
    res.status(500).json({ error: err.message || String(err) });
  }
});

/**
 * Batch-generate template previews (admin / CI script).
 * POST { items: [{ prompt, templateId, tier? }], category?, aspectRatio?, saveToStorage? }
 */
const generateTemplateBatchHandler = onRequest({ timeoutSeconds: 540, memory: "1GiB" }, async (req, res) => {
  Object.entries(CORS).forEach(([k, v]) => res.set(k, v));
  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  const adminSecret = process.env.TEMPLATE_BATCH_SECRET;
  if (adminSecret && req.headers["x-template-batch-secret"] !== adminSecret) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  const { items, category = "style", aspectRatio = "1:1", tier = "fast", saveToStorage = true } = req.body || {};
  if (!Array.isArray(items) || items.length === 0) {
    res.status(400).json({ error: "items[] required" });
    return;
  }

  const results = [];
  for (const item of items) {
    try {
      const { modelId, input } = buildTemplateInput({
        prompt: item.prompt,
        tier: item.tier || tier,
        aspectRatio,
        seed: item.seed,
      });
      const { data } = await runFalQueue(modelId, input);
      const image = extractImageUrl(data);
      if (!image?.url) throw new Error("No image URL");

      let storageUrl = null;
      if (saveToStorage) {
        storageUrl = await persistFalImageToStorage(image.url, {
          category: item.category || category,
          templateId: item.templateId || item.id,
          storagePath: item.storagePath,
        });
      }

      results.push({
        ok: true,
        templateId: item.templateId || item.id,
        url: image.url,
        storageUrl,
        modelId,
      });
    } catch (err) {
      results.push({
        ok: false,
        templateId: item.templateId || item.id,
        error: err.message || String(err),
      });
    }
  }

  res.status(200).json({
    total: items.length,
    succeeded: results.filter((r) => r.ok).length,
    failed: results.filter((r) => !r.ok).length,
    results,
  });
});

async function persistFalImageToStorage(falUrl, { category, templateId, storagePath }) {
  const fetchResp = await fetch(falUrl);
  if (!fetchResp.ok) throw new Error(`Failed to download fal image: ${fetchResp.statusText}`);
  const buffer = Buffer.from(await fetchResp.arrayBuffer());

  const bucket = admin.storage().bucket();
  const safeId = (templateId || `gen-${Date.now()}`).replace(/[^a-zA-Z0-9-_]/g, "-");
  const path = storagePath || `templates/${category}/${safeId}.webp`;
  const file = bucket.file(path);

  await file.save(buffer, {
    metadata: {
      contentType: fetchResp.headers.get("content-type") || "image/webp",
      cacheControl: "public, max-age=31536000",
    },
  });
  await file.makePublic();
  return file.publicUrl();
}

module.exports = {
  generateTemplateImageHandler,
  generateTemplateBatchHandler,
};
