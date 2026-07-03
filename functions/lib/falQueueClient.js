const { fal } = require("@fal-ai/client");
const logger = require("firebase-functions/logger");

let configured = false;

function ensureFalConfigured() {
  const key = process.env.FAL_KEY;
  if (!key) {
    throw new Error("FAL_KEY is not configured. Set Firebase secret or functions/.env");
  }
  if (!configured) {
    fal.config({ credentials: key });
    configured = true;
  }
}

/**
 * Run a fal queue job and wait for the result (subscribe = submit + poll).
 * @param {string} modelId e.g. fal-ai/flux/schnell
 * @param {Record<string, unknown>} input model-specific payload
 * @param {{ timeoutMs?: number }} [opts]
 * @returns {Promise<{ data: unknown, requestId?: string }>}
 */
async function runFalQueue(modelId, input, opts = {}) {
  ensureFalConfigured();
  const timeoutMs = opts.timeoutMs ?? 240_000;
  const started = Date.now();

  logger.info("fal.queue.subscribe", { modelId, inputKeys: Object.keys(input || {}) });

  const result = await Promise.race([
    fal.subscribe(modelId, {
      input,
      logs: false,
      onQueueUpdate: (update) => {
        if (update?.status) {
          logger.debug("fal.queue.update", { modelId, status: update.status });
        }
      },
    }),
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`fal queue timeout after ${timeoutMs}ms`)), timeoutMs);
    }),
  ]);

  const elapsed = Date.now() - started;
  logger.info("fal.queue.done", { modelId, elapsedMs: elapsed });

  return {
    data: result?.data ?? result,
    requestId: result?.requestId,
  };
}

/**
 * Extract first image URL from a fal model response.
 * @param {unknown} data
 * @returns {{ url: string, width?: number, height?: number } | null}
 */
function extractImageUrl(data) {
  if (!data || typeof data !== "object") return null;
  const d = /** @type {Record<string, unknown>} */ (data);

  if (Array.isArray(d.images) && d.images[0]) {
    const img = /** @type {Record<string, unknown>} */ (d.images[0]);
    if (typeof img.url === "string") {
      return { url: img.url, width: /** @type {number|undefined} */ (img.width), height: /** @type {number|undefined} */ (img.height) };
    }
  }
  if (d.image && typeof d.image === "object") {
    const img = /** @type {Record<string, unknown>} */ (d.image);
    if (typeof img.url === "string") {
      return { url: img.url, width: /** @type {number|undefined} */ (img.width), height: /** @type {number|undefined} */ (img.height) };
    }
  }
  return null;
}

module.exports = {
  runFalQueue,
  extractImageUrl,
  ensureFalConfigured,
};
