const { onRequest } = require("firebase-functions/https");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const { buildStudioInput } = require("./lib/studioModels");
const { runAtlasPrediction, extractImageUrl } = require("./lib/atlasCloudClient");
const { buildShotPrompt, SHOTS_PRESETS } = require("./lib/shotsPromptRules");

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const SHOTS_COST = 90;
const SHOTS_REGENERATE_COST = 15;
const SHOTS_UPSCALE_COST = 20;
const UPSCALE_PROMPT =
  "Upscale this image to 4K resolution. Enhance details, sharpen textures, remove noise, and improve lighting while keeping the original content exactly the same. Photorealistic high quality.";

async function fetchAsBase64(url) {
  const fetchResp = await fetch(url);
  if (!fetchResp.ok) {
    throw new Error(`Failed to download generated shot: ${fetchResp.statusText}`);
  }
  const buffer = Buffer.from(await fetchResp.arrayBuffer());
  const contentType = fetchResp.headers.get("content-type") || "image/png";
  return {
    base64: buffer.toString("base64"),
    mimeType: contentType.split(";")[0],
  };
}

async function deductUserCredits(uid, amount) {
  const userRef = admin.firestore().collection("users").doc(uid);
  return admin.firestore().runTransaction(async (tx) => {
    const snap = await tx.get(userRef);
    if (!snap.exists) return false;
    const data = snap.data() || {};
    const credits = typeof data.credits === "number" ? data.credits : 0;
    if (credits < amount) return false;
    tx.update(userRef, { credits: credits - amount });
    return true;
  });
}

async function refundUserCredits(uid, amount) {
  const userRef = admin.firestore().collection("users").doc(uid);
  await userRef.set({
    credits: admin.firestore.FieldValue.increment(amount),
  }, { merge: true });
}

const generateShotsGridHandler = onRequest({ timeoutSeconds: 540, memory: "1GiB" }, async (req, res) => {
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
    action = "grid",
    shotId,
    aspectRatio = "3:4",
    krasoTier = "kraso-quality",
    resolution = "1K",
    imageBase64,
    mimeType,
    referenceImages = [],
  } = req.body || {};

  const authHeader = req.headers.authorization || "";
  const tokenMatch = authHeader.match(/^Bearer\s+(.+)$/i);
  if (!tokenMatch) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const decoded = await admin.auth().verifyIdToken(tokenMatch[1]);
    req.user = decoded;
  } catch (err) {
    logger.warn("generateShotsGrid.auth_failed", err);
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const refs = [...(referenceImages || [])];
  if (imageBase64 && !refs.length) {
    refs.push({ data: imageBase64, mimeType: mimeType || "image/jpeg", role: "character" });
  }

  if (!refs.length) {
    res.status(400).json({ error: "Missing source image" });
    return;
  }

  try {
    const uid = req.user.uid;
    const price = action === "upscale" ? SHOTS_UPSCALE_COST : action === "retry" ? SHOTS_REGENERATE_COST : SHOTS_COST;
    const charged = await deductUserCredits(uid, price);
    if (!charged) {
      res.status(402).json({ error: `Недостаточно кредитов (${price} кр)` });
      return;
    }

    logger.info("generateShotsGrid.start", {
      action,
      aspectRatio,
      krasoTier,
      resolution,
      refCount: refs.length,
      shotCount: action === "grid" ? SHOTS_PRESETS.length : 1,
    });

    const presets = action === "grid"
      ? SHOTS_PRESETS
      : action === "retry"
        ? SHOTS_PRESETS.filter((preset) => preset.id === shotId)
        : [{ id: "upscale", title: "Upscaled", description: "Upscaled shot", promptSuffix: "" }];
    if (!presets.length) throw new Error("Invalid shot preset");

    const results = [];
    for (const preset of presets) {
      const prompt = action === "upscale" ? UPSCALE_PROMPT : buildShotPrompt(preset);
      const { modelId, input } = buildStudioInput({
        prompt,
        krasoTier,
        aspectRatio,
        resolution,
        referenceImages: refs,
      });
      const { data } = await runAtlasPrediction("image", modelId, input, { timeoutMs: 240_000 });
      const image = extractImageUrl(data);
      if (!image?.url) throw new Error(`Model did not return shot URL for ${preset.id}`);
      const inlineImage = await fetchAsBase64(image.url);
      results.push({
        shotId: action === "upscale" ? "upscale" : preset.id,
        title: preset.title,
        description: preset.description,
        prompt,
        image: inlineImage,
        url: image.url,
      });
    }

    res.status(200).json({
      shots: results,
      count: results.length,
      chargedCredits: price,
    });
  } catch (err) {
    try {
      await refundUserCredits(req.user.uid, action === "upscale" ? SHOTS_UPSCALE_COST : action === "retry" ? SHOTS_REGENERATE_COST : SHOTS_COST);
    } catch (refundErr) {
      logger.error("generateShotsGrid refund failed", refundErr);
    }
    logger.error("generateShotsGrid error", err);
    res.status(500).json({ error: err.message || String(err) });
  }
});

module.exports = {
  generateShotsGridHandler,
};
