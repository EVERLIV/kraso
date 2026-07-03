const { onRequest } = require("firebase-functions/https");
const logger = require("firebase-functions/logger");
const { runFalQueue } = require("./lib/falQueueClient");

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const VIDEO_SYSTEM_PROMPT =
  "You are a prompt engineer for AI image-to-video generation. " +
  "Enhance the user's prompt for cinematic motion: camera movement, lighting, mood, textures, and subtle motion. " +
  "Keep the subject from the source image. Write in the same language as the input. " +
  "Return ONLY the enhanced prompt, no quotes or commentary. Max 200 tokens.";

const IMAGE_SYSTEM_PROMPT =
  "You are a prompt engineer for AI image generation. " +
  "Enhance the user's prompt with vivid composition, lighting, colors, textures, and mood. " +
  "Write in the same language as the input. Return ONLY the enhanced prompt, no quotes. Max 200 tokens.";

/**
 * @param {unknown} data
 * @returns {string | null}
 */
function extractLlmOutput(data) {
  if (!data || typeof data !== "object") return null;
  const d = /** @type {Record<string, unknown>} */ (data);
  if (typeof d.output === "string" && d.output.trim()) return d.output.trim();
  if (typeof d.text === "string" && d.text.trim()) return d.text.trim();
  if (typeof d.content === "string" && d.content.trim()) return d.content.trim();
  if (Array.isArray(d.choices) && d.choices[0] && typeof d.choices[0] === "object") {
    const choice = /** @type {Record<string, unknown>} */ (d.choices[0]);
    const msg = choice.message;
    if (msg && typeof msg === "object") {
      const content = /** @type {Record<string, unknown>} */ (msg).content;
      if (typeof content === "string" && content.trim()) return content.trim();
    }
  }
  return null;
}

/**
 * POST { prompt: string, context?: 'video' | 'image' }
 * Returns { prompt: string }
 */
const enhancePromptHandler = onRequest({ timeoutSeconds: 60, memory: "512MiB" }, async (req, res) => {
  Object.entries(CORS).forEach(([k, v]) => res.set(k, v));
  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  const { prompt, context = "video" } = req.body || {};
  if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
    res.status(400).json({ error: "Missing or invalid prompt" });
    return;
  }

  const system_prompt = context === "image" ? IMAGE_SYSTEM_PROMPT : VIDEO_SYSTEM_PROMPT;

  try {
    logger.info("enhancePrompt.start", { context, len: prompt.length });

    const { data } = await runFalQueue(
      "fal-ai/any-llm",
      {
        model: "google/gemini-2.5-flash-lite",
        prompt: prompt.trim(),
        system_prompt,
      },
      { timeoutMs: 45_000 },
    );

    const enhanced = extractLlmOutput(data);
    if (!enhanced) {
      logger.warn("enhancePrompt: empty LLM output", { data });
      res.status(200).json({ prompt: prompt.trim() });
      return;
    }

    res.status(200).json({ prompt: enhanced });
  } catch (err) {
    logger.error("enhancePrompt.error", err);
    res.status(500).json({ error: err.message || String(err) });
  }
});

module.exports = { enhancePromptHandler };
