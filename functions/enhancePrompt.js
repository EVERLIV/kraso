const { onRequest } = require("firebase-functions/https");
const logger = require("firebase-functions/logger");
const { runAtlasChat } = require("./lib/atlasCloudClient");
const { ATLAS_ENHANCE_LLM } = require("./lib/atlasModelRegistry");

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const BANNED_WORDS =
  "cinematic, masterpiece, epic, stunning, amazing, hyperrealistic 8k, beautiful lighting, professional quality";

const VIDEO_BASE_RULES =
  "You are an expert AI video prompt engineer (visual-skills methodology).\n" +
  "Enhance the user's prompt for image-to-video generation.\n\n" +
  "RULES:\n" +
  "1. Details Law: each implied shot needs one environmental pressure, one physical micro-action, one sound anchor.\n" +
  "2. Show don't tell — translate emotions into body (jaw locks, knuckles whiten, breath catches).\n" +
  "3. One primary camera move per shot. Name lens (35mm, 50mm, 85mm).\n" +
  "4. Continuity: preserve subject identity, wardrobe, background from source image. No background swap. No extra people.\n" +
  "5. Hands: anatomically correct, exactly two hands when gripping objects. No extra fingers.\n" +
  "6. Natural language prose — no tag spam. BAN these words: " + BANNED_WORDS + ".\n" +
  "7. Keep the same language as user input unless context is marketing-video (then output English).\n" +
  "Return ONLY the enhanced prompt. No quotes. Max 300 tokens.";

const MODEL_HINTS = {
  kling: "\nTarget: Kling. Single continuous take — no cuts, no Shot N structure. One smooth camera move. Describe concrete body actions and environment in plain prose.",
  veo: "\nTarget: Veo 3.1. Single scene, lead with camera. One motivated move. Optional Audio: line. No montage, no scene changes.",
  seedance: "\nTarget: Seedance 2.0. ONE continuous take only — no shot list, no cuts, no scene changes. Scene-first: reference photo = face/body likeness only. All subjects visible in opening frame. Cinematic realism, no AI slop. Exactly two hands.",
  wan: "\nTarget: Wan 2.5. Keep simple — one subject, one action, 3-4 elements max.",
  default: "",
};

const MARKETING_VIDEO_RULES =
  VIDEO_BASE_RULES +
  "\nContext: marketing UGC ad, 9:16 vertical.\n" +
  "Structure: [Character A] + [Product A] tags, Continuity block, Master intent, Shot list with timings, Audio line.\n" +
  "Output in English. Remove inline Negative: blocks from prose.";

const IMAGE_SYSTEM_PROMPT =
  "You are a prompt engineer for AI image generation. " +
  "Enhance vivid composition, lighting, colors, textures. Show don't tell. " +
  "Anatomically correct hands. Write in the same language as input. " +
  "Return ONLY the enhanced prompt, no quotes. Max 200 tokens.";

function resolveVideoSystemPrompt(context, modelId) {
  if (context === "image") return IMAGE_SYSTEM_PROMPT;
  if (context === "marketing-video") return MARKETING_VIDEO_RULES;

  const id = String(modelId || "").toLowerCase();
  let hint = MODEL_HINTS.default;
  if (id.includes("kling")) hint = MODEL_HINTS.kling;
  else if (id.includes("veo")) hint = MODEL_HINTS.veo;
  else if (id.includes("seedance")) hint = MODEL_HINTS.seedance;
  else if (id.includes("wan")) hint = MODEL_HINTS.wan;

  return VIDEO_BASE_RULES + hint;
}

/**
 * POST { prompt: string, context?: 'video' | 'image' | 'marketing-video', modelId?: string }
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

  const { prompt, context = "video", modelId } = req.body || {};
  if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
    res.status(400).json({ error: "Missing or invalid prompt" });
    return;
  }

  const system_prompt = resolveVideoSystemPrompt(context, modelId);

  try {
    logger.info("enhancePrompt.start", { context, modelId, len: prompt.length });

    const data = await runAtlasChat({
      model: ATLAS_ENHANCE_LLM,
      messages: [
        { role: "system", content: system_prompt },
        { role: "user", content: prompt.trim() },
      ],
      max_tokens: 400,
    });

    const enhanced = data?.choices?.[0]?.message?.content?.trim();
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
