/**
 * Batch-generate ALL_PRESETS previews (278 templates, 21 categories).
 *
 * Usage:
 *   node scripts/audit-templates.mjs              # check missing
 *   node scripts/generate-all-templates.mjs       # missing only, tier fast
 *   CATEGORY=retro node scripts/generate-all-templates.mjs
 *   ALL=1 node scripts/generate-all-templates.mjs # regenerate everything
 *
 * Env (from functions/.env or shell):
 *   TEMPLATE_BATCH_URL, TEMPLATE_BATCH_SECRET, TEMPLATE_TIER (fast|standard|pro)
 *   CATEGORY — filter one category (e.g. retro, makeup)
 *   ALL=1 — include presets that already have local files
 *   BATCH_SIZE — items per HTTP request (default 5)
 *   DELAY_MS — pause between batches (default 2000)
 */

import { readFileSync, existsSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parseAllPresets, previewFilename } from "./lib/parseAllPresets.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const templatesDir = join(root, "public", "templates");

// Load functions/.env if present
const envPath = join(root, "functions", ".env");
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const url =
  process.env.TEMPLATE_BATCH_URL ||
  "https://us-central1-project-1285666415996898989.cloudfunctions.net/generateTemplateBatch";
const tier = process.env.TEMPLATE_TIER || "fast";
const secret = process.env.TEMPLATE_BATCH_SECRET;
const categoryFilter = process.env.CATEGORY || null;
const includeAll = process.env.ALL === "1";
const batchSize = Number(process.env.BATCH_SIZE || 5);
const delayMs = Number(process.env.DELAY_MS || 2000);

mkdirSync(templatesDir, { recursive: true });

const presets = parseAllPresets().filter((p) => !categoryFilter || p.category === categoryFilter);

const queue = presets.filter((p) => {
  if (includeAll) return true;
  const fname = previewFilename(p);
  return !existsSync(join(templatesDir, fname));
});

if (queue.length === 0) {
  console.log("Nothing to generate — all previews exist locally.");
  process.exit(0);
}

console.log(`Generating ${queue.length} template previews (tier: ${tier})...`);
if (categoryFilter) console.log(`  category: ${categoryFilter}`);

function buildPreviewPrompt(preset) {
  const isProduct =
    preset.category === "marketplaces" ||
    preset.category === "ecommerce" ||
    preset.prompt.toLowerCase().includes("product from");
  const isFood = preset.category === "restaurants";
  const isDoc = preset.category === "documents";

  let prefix = "Square 1:1 template thumbnail preview. ";
  if (isProduct) prefix += "Product showcase, commercial photography. ";
  else if (isFood) prefix += "Appetizing food photography. ";
  else if (isDoc) prefix += "Professional ID/document photo style. ";
  else prefix += "Photorealistic scene with a person. ";

  return `${prefix}${preset.prompt} No text, no watermark, no UI elements.`;
}

function chunk(arr, n) {
  const out = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}

let succeeded = 0;
let failed = 0;

for (const [i, batch] of chunk(queue, batchSize).entries()) {
  console.log(`\nBatch ${i + 1}/${Math.ceil(queue.length / batchSize)} (${batch.length} items)...`);

  const items = batch.map((p) => ({
    templateId: p.id,
    category: p.category,
    storagePath: `templates/${previewFilename(p)}`,
    prompt: buildPreviewPrompt(p),
  }));

  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(secret ? { "x-template-batch-secret": secret } : {}),
    },
    body: JSON.stringify({
      items,
      category: "preset",
      aspectRatio: "1:1",
      tier,
      saveToStorage: true,
    }),
  });

  const data = await resp.json();
  if (!resp.ok) {
    console.error("Batch failed:", data);
    failed += batch.length;
    continue;
  }

  for (const r of data.results || []) {
    if (!r.ok) {
      console.error(`  FAIL ${r.templateId}: ${r.error}`);
      failed++;
      continue;
    }

    const preset = batch.find((p) => p.id === r.templateId);
    const fname = preset ? previewFilename(preset) : `${r.templateId}.webp`;
    const localPath = join(templatesDir, fname);
    const downloadUrl = r.storageUrl || r.url;

    try {
      const imgResp = await fetch(downloadUrl);
      if (!imgResp.ok) throw new Error(`download ${imgResp.status}`);
      const buf = Buffer.from(await imgResp.arrayBuffer());
      writeFileSync(localPath, buf);
      console.log(`  OK ${r.templateId} -> public/templates/${fname}`);
      succeeded++;
    } catch (err) {
      console.error(`  FAIL save ${r.templateId}: ${err.message}`);
      failed++;
    }
  }

  if (i < Math.ceil(queue.length / batchSize) - 1 && delayMs > 0) {
    await new Promise((r) => setTimeout(r, delayMs));
  }
}

console.log(`\nDone: ${succeeded} succeeded, ${failed} failed (${queue.length} total)`);
process.exit(failed > 0 ? 1 : 0);
