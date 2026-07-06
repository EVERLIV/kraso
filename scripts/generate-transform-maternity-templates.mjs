/**
 * Generate preview thumbnails for transform_viral + maternity template categories.
 * Uses Atlas Flux Schnell (fast, affordable tier).
 *
 * Usage:
 *   node scripts/generate-transform-maternity-templates.mjs
 *   CATEGORY=transform_viral node scripts/generate-transform-maternity-templates.mjs
 */
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { ATLAS_FLUX_SCHNELL, download, runAtlasImage } from './lib/atlas.mjs';
import { parseAllPresets, previewFilename } from './lib/parseAllPresets.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '..', 'public', 'templates');
const categoryFilter = process.env.CATEGORY || null;
const SKIP_EXISTING = process.env.SKIP_EXISTING !== '0';

const DEFAULT_CATEGORIES = ['transform_viral', 'maternity', 'portraits_pro'];

const STYLIZED = new Set([
  'viral-anime-manga',
  'viral-pixar-3d',
  'viral-barbie-ken',
  'viral-fursona',
]);

function buildPreviewPrompt(preset) {
  const stylized = STYLIZED.has(preset.id);
  let prefix = 'Square 1:1 template thumbnail preview. ';
  if (stylized) {
    prefix += 'Stylized character portrait, high quality. ';
  } else if (preset.category === 'maternity') {
    prefix += 'Fine art maternity photography with a pregnant woman. ';
  } else if (preset.category === 'portraits_pro') {
    prefix += 'Professional portrait headshot of one person. ';
  } else {
    prefix += 'Photorealistic portrait scene with one person. ';
  }
  return `${prefix}${preset.prompt} No text, no watermark, no UI elements, no logos.`;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function toWebp(srcPath, destPath) {
  await sharp(srcPath).webp({ quality: 82 }).toFile(destPath);
  fs.unlinkSync(srcPath);
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const presets = parseAllPresets().filter((p) => {
    if (!DEFAULT_CATEGORIES.includes(p.category)) return false;
    if (categoryFilter && p.category !== categoryFilter) return false;
    return true;
  });

  if (presets.length === 0) {
    console.log('No presets found.');
    return;
  }

  console.log(`Generating ${presets.length} previews via ${ATLAS_FLUX_SCHNELL}...`);

  let ok = 0;
  let fail = 0;

  for (const preset of presets) {
    const fname = previewFilename(preset);
    const dest = path.join(OUT_DIR, fname);
    const tmp = path.join(OUT_DIR, `_tmp_${preset.id}.png`);

    if (SKIP_EXISTING && fs.existsSync(dest)) {
      console.log(`SKIP ${preset.id} (exists)`);
      continue;
    }

    const prompt = buildPreviewPrompt(preset);
    console.log(`\nGEN ${preset.id} — ${preset.title}`);

    try {
      const { url } = await runAtlasImage(
        ATLAS_FLUX_SCHNELL,
        { prompt, aspect_ratio: '1:1' },
        { timeoutMs: 180_000 },
      );
      if (!url) throw new Error('No output URL');
      await download(url, tmp);
      await toWebp(tmp, dest);
      console.log(`  OK -> public/templates/${fname}`);
      ok++;
    } catch (err) {
      console.error(`  FAIL ${preset.id}: ${err.message}`);
      fail++;
    }

    await sleep(2000);
  }

  console.log(`\nDone: ${ok} ok, ${fail} failed`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
