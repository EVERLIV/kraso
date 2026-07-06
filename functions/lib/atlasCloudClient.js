const logger = require("firebase-functions/logger");

const ATLAS_API_BASE = "https://api.atlascloud.ai/api/v1";
const ATLAS_LLM_BASE = "https://api.atlascloud.ai/v1";

/**
 * @param {Record<string, unknown>} body
 */
async function atlasPost(path, body) {
  const key = process.env.ATLASCLOUD_API_KEY;
  if (!key) {
    throw new Error("ATLASCLOUD_API_KEY is not configured. Set Firebase secret or functions/.env");
  }

  const resp = await fetch(`${ATLAS_API_BASE}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  const text = await resp.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`Atlas API error (${resp.status}): ${text.slice(0, 300)}`);
  }

  if (!resp.ok) {
    const msg = json?.message || json?.error || text.slice(0, 300);
    throw new Error(`Atlas API error (${resp.status}): ${msg}`);
  }

  return json;
}

/**
 * @param {string} predictionId
 */
async function atlasGetPrediction(predictionId) {
  const key = process.env.ATLASCLOUD_API_KEY;
  if (!key) {
    throw new Error("ATLASCLOUD_API_KEY is not configured");
  }

  const resp = await fetch(`${ATLAS_API_BASE}/model/prediction/${predictionId}`, {
    headers: {
      Authorization: `Bearer ${key}`,
      Accept: "application/json",
    },
  });

  const text = await resp.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`Atlas poll error (${resp.status}): ${text.slice(0, 300)}`);
  }

  if (!resp.ok) {
    const msg = json?.message || json?.error || text.slice(0, 300);
    throw new Error(`Atlas poll error (${resp.status}): ${msg}`);
  }

  return json;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * @param {string} predictionId
 * @param {{ intervalMs?: number, timeoutMs?: number }} [opts]
 */
async function pollPrediction(predictionId, opts = {}) {
  const intervalMs = opts.intervalMs ?? 3000;
  const timeoutMs = opts.timeoutMs ?? 240_000;
  const started = Date.now();

  while (Date.now() - started < timeoutMs) {
    const json = await atlasGetPrediction(predictionId);
    const data = json?.data ?? json;
    const status = String(data?.status || "").toLowerCase();

    logger.debug("atlas.poll", { predictionId, status });

    if (status === "completed" || status === "succeeded" || status === "success") {
      return data;
    }
    if (status === "failed" || status === "error" || status === "canceled" || status === "cancelled") {
      throw new Error(data?.error || data?.fail_reason || `Atlas prediction ${status}`);
    }

    await sleep(intervalMs);
  }

  throw new Error(`Atlas prediction timeout after ${timeoutMs}ms`);
}

/**
 * Submit image or video generation and wait for result.
 * @param {'image'|'video'} type
 * @param {string} modelId
 * @param {Record<string, unknown>} input
 * @param {{ timeoutMs?: number }} [opts]
 */
async function runAtlasPrediction(type, modelId, input, opts = {}) {
  const timeoutMs = opts.timeoutMs ?? 240_000;
  const endpoint = type === "video" ? "/model/generateVideo" : "/model/generateImage";
  const started = Date.now();

  logger.info("atlas.submit", { type, modelId, inputKeys: Object.keys(input || {}) });

  const submitJson = await atlasPost(endpoint, { model: modelId, ...input });
  const predictionId = submitJson?.data?.id || submitJson?.id;
  if (!predictionId) {
    throw new Error(`Atlas submit did not return prediction id: ${JSON.stringify(submitJson).slice(0, 200)}`);
  }

  const result = await pollPrediction(predictionId, { timeoutMs });
  const elapsed = Date.now() - started;
  logger.info("atlas.done", { type, modelId, predictionId, elapsedMs: elapsed });

  return { data: result, requestId: predictionId };
}

/**
 * OpenAI-compatible chat completion via Atlas LLM API.
 * @param {{ model: string, messages: Array<{role: string, content: string}>, max_tokens?: number }} params
 * @param {{ timeoutMs?: number }} [opts]
 */
async function runAtlasChat(params, opts = {}) {
  const key = process.env.ATLASCLOUD_API_KEY;
  if (!key) {
    throw new Error("ATLASCLOUD_API_KEY is not configured");
  }

  const timeoutMs = opts.timeoutMs ?? 45_000;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const resp = await fetch(`${ATLAS_LLM_BASE}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: params.model,
        messages: params.messages,
        max_tokens: params.max_tokens ?? 512,
        temperature: 0.7,
      }),
      signal: controller.signal,
    });

    const text = await resp.text();
    let json;
    try {
      json = JSON.parse(text);
    } catch {
      throw new Error(`Atlas LLM error (${resp.status}): ${text.slice(0, 300)}`);
    }

    if (!resp.ok) {
      throw new Error(json?.error?.message || json?.message || text.slice(0, 300));
    }

    return json;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * @param {unknown} data prediction result data
 * @returns {{ url: string, width?: number, height?: number } | null}
 */
function extractImageUrl(data) {
  if (!data || typeof data !== "object") return null;
  const d = /** @type {Record<string, unknown>} */ (data);

  const outputs = d.outputs;
  if (Array.isArray(outputs) && outputs.length > 0) {
    const first = outputs[0];
    if (typeof first === "string") return { url: first };
    if (first && typeof first === "object") {
      const o = /** @type {Record<string, unknown>} */ (first);
      if (typeof o.url === "string") return { url: o.url };
      if (typeof o.image === "string") return { url: o.image };
    }
  }

  if (typeof d.output === "string") return { url: d.output };
  if (Array.isArray(d.images) && d.images[0]) {
    const img = /** @type {Record<string, unknown>} */ (d.images[0]);
    if (typeof img.url === "string") return { url: img.url };
  }
  if (d.image && typeof d.image === "object") {
    const img = /** @type {Record<string, unknown>} */ (d.image);
    if (typeof img.url === "string") return { url: img.url };
  }

  return null;
}

/**
 * @param {unknown} data prediction result data
 * @returns {string | null}
 */
function extractVideoUrl(data) {
  if (!data || typeof data !== "object") return null;
  const d = /** @type {Record<string, unknown>} */ (data);

  const outputs = d.outputs;
  if (Array.isArray(outputs) && outputs.length > 0) {
    const first = outputs[0];
    if (typeof first === "string") return first;
    if (first && typeof first === "object") {
      const o = /** @type {Record<string, unknown>} */ (first);
      if (typeof o.url === "string") return o.url;
      if (typeof o.video === "string") return o.video;
    }
  }

  if (typeof d.output === "string") return d.output;
  if (d.video && typeof d.video === "object") {
    const v = /** @type {Record<string, unknown>} */ (d.video);
    if (typeof v.url === "string") return v.url;
  }
  if (typeof d.url === "string") return d.url;

  return null;
}

module.exports = {
  runAtlasPrediction,
  runAtlasChat,
  pollPrediction,
  extractImageUrl,
  extractVideoUrl,
  ATLAS_API_BASE,
  ATLAS_LLM_BASE,
};
