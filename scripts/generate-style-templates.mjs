/**
 * Batch-generate Recolor PHOTO_STYLES previews (15 portrait styles → public/styles/).
 * For the main Templates page (278 presets, 21 categories) use:
 *   node scripts/generate-all-templates.mjs
 *
 * Usage:
 *   cd functions && cp .env.example .env   # fill ATLASCLOUD_API_KEY + TEMPLATE_BATCH_SECRET
 *   firebase deploy --only functions:generateTemplateBatch
 *   node ../scripts/generate-style-templates.mjs
 *
 * Env:
 *   TEMPLATE_BATCH_URL — default: cloud function URL
 *   TEMPLATE_BATCH_SECRET — must match functions secret
 *   TEMPLATE_TIER — fast | standard | pro (default: fast)
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

// Read PHOTO_STYLES from compiled-ish export — parse from recolorPresets source
const presetsPath = join(root, "lib", "recolorPresets.ts");
const src = readFileSync(presetsPath, "utf8");
const block = src.match(/export const PHOTO_STYLES[^=]*=\s*\[([\s\S]*?)\];/);
if (!block) {
  console.error("Could not parse PHOTO_STYLES from recolorPresets.ts");
  process.exit(1);
}

const items = [];
const entryRe = /id:\s*'([^']+)'[\s\S]*?title:\s*'([^']+)'[\s\S]*?prompt:\s*'([^']+)'/g;
let m;
while ((m = entryRe.exec(block[1])) !== null) {
  items.push({
    templateId: m[1],
    title: m[2],
    prompt: `Professional portrait photoshoot preview, square 1:1 thumbnail. ${m[3]}. Single person, photorealistic, no text, no watermark.`,
  });
}

const url =
  process.env.TEMPLATE_BATCH_URL ||
  "https://us-central1-project-1285666415996898989.cloudfunctions.net/generateTemplateBatch";

const tier = process.env.TEMPLATE_TIER || "fast";
const secret = process.env.TEMPLATE_BATCH_SECRET;

console.log(`Generating ${items.length} style templates via ${url} (tier: ${tier})...`);

const resp = await fetch(url, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    ...(secret ? { "x-template-batch-secret": secret } : {}),
  },
  body: JSON.stringify({
    items,
    category: "style",
    aspectRatio: "1:1",
    tier,
    saveToStorage: true,
  }),
});

const data = await resp.json();
if (!resp.ok) {
  console.error("Batch failed:", data);
  process.exit(1);
}

console.log(JSON.stringify(data, null, 2));
console.log(`Done: ${data.succeeded}/${data.total} succeeded`);
