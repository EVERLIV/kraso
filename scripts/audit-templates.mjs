import { readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parseAllPresets, previewFilename } from "./lib/parseAllPresets.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const presets = parseAllPresets();

const existing = new Set(readdirSync(join(root, "public", "templates")));
const missing = [];
for (const p of presets) {
  const fname = previewFilename(p);
  if (!existing.has(fname)) missing.push({ ...p, fname });
}

const byCat = {};
for (const p of presets) byCat[p.category] = (byCat[p.category] || 0) + 1;
const missingByCat = {};
for (const m of missing) missingByCat[m.category] = (missingByCat[m.category] || 0) + 1;

console.log("Total presets:", presets.length);
console.log("Existing files:", existing.size);
console.log("Missing previews:", missing.length);
console.log("\nPresets by category:");
for (const [k, v] of Object.entries(byCat).sort((a, b) => b[1] - a[1])) {
  const miss = missingByCat[k] || 0;
  console.log(`  ${k}: ${v}${miss ? ` (${miss} missing)` : ""}`);
}
if (missing.length) {
  console.log("\nMissing files:");
  for (const m of missing) console.log(`  ${m.id} -> ${m.fname}`);
}
