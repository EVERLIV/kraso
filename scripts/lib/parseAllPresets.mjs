import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");

/** Parse ALL_PRESETS from TemplateGrid.tsx (no TS compile step). */
export function parseAllPresets() {
  const src = readFileSync(join(root, "components", "TemplateGrid.tsx"), "utf8");
  const block = src.match(/export const ALL_PRESETS[^=]*=\s*\[([\s\S]*)\];\s*\n/);
  if (!block) throw new Error("Could not parse ALL_PRESETS from TemplateGrid.tsx");

  const presets = [];
  for (const chunk of block[1].split(/\n\s*\{/).slice(1)) {
    const id = chunk.match(/id:\s*'([^']+)'/)?.[1];
    const category = chunk.match(/category:\s*'([^']+)'/)?.[1];
    const title = chunk.match(/title:\s*'([^']*)'/)?.[1];
    const image = chunk.match(/image:\s*'([^']*)'/)?.[1];
    const promptMatch = chunk.match(/prompt:\s*'((?:\\'|[^'])*)'/);
    const prompt = promptMatch ? promptMatch[1].replace(/\\'/g, "'") : null;
    if (id && prompt) {
      presets.push({ id, category, title, image, prompt });
    }
  }
  return presets;
}

export function previewFilename(preset) {
  return (preset.image || `/templates/${preset.id}.webp`).replace(/^\/templates\//, "");
}
