/**
 * Generate marketing template preview images via Atlas Nano Banana 2.
 * For templates that should use image previews instead of video demos.
 *
 * Usage:
 *   node scripts/generate-marketing-images.mjs
 *   node scripts/generate-marketing-images.mjs --only mess-to-fresh
 *   node scripts/generate-marketing-images.mjs --skip-existing
 *   node scripts/generate-marketing-images.mjs --dry-run
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  MARKETING_TEMPLATES,
  resolveMarketingPrompt,
} from '../lib/marketingPresets.ts';
import { runAtlasImage, download } from './lib/atlas.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const STYLE_DIR = path.join(ROOT, 'public/marketing/pickers/style');
const RESULTS_PATH = path.join(__dirname, 'marketing-image-results.json');

const NANO_BANANA_2_MODEL = 'google/nano-banana-2/text-to-image';

/** Negative prompt to suppress extra limbs and anatomical errors. */
const NEGATIVE_IMAGE =
  'extra hand, third hand, extra arm, extra limb, extra fingers, ' +
  'mutated hands, deformed, disfigured, twisted, unnatural proportions, ' +
  'extra limbs, merged fingers, floating limbs';

/**
 * Templates that should use image previews.
 */
const IMAGE_TEMPLATE_IDS = [
  'mess-to-fresh',
  'classic-modern',
  'before-after',
  'selfie-testimonial',
  'unboxing-asmr',
];

/** PNG filenames per template slot (must match what msPreviews expects) */
const TARGET_FILES = {
  'mess-to-fresh': ['mess-fresh-1.png', 'mess-fresh-2.png', 'mess-fresh-3.png'],
  'classic-modern': ['classic-1.png', 'classic-2.png', 'classic-3.png'],
  'before-after': ['before-after.png', 'before-after-2.png', 'before-after-3.png'],
  'selfie-testimonial': ['selfie-testimonial.png', 'selfie-2.png', 'selfie-3.png'],
  'unboxing-asmr': ['unboxing-asmr.png', 'asmr-2.png', 'asmr-3.png'],
};

function parseArgs(argv) {
  const opts = { only: null, dryRun: false, skipExisting: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--only' && argv[i + 1]) opts.only = argv[++i];
    else if (a === '--dry-run') opts.dryRun = true;
    else if (a === '--skip-existing') opts.skipExisting = true;
  }
  return opts;
}

async function generateImage(tpl, slotIndex, targetFile, opts) {
  const dest = path.join(STYLE_DIR, targetFile);

  if (opts.skipExisting && fs.existsSync(dest)) {
    console.log(`  [${targetFile}] exists, skipping`);
    return { id: targetFile, status: 'skipped', dest };
  }

  const prompt = resolveMarketingPrompt(tpl);

  console.log(`  [${targetFile}] Nano Banana 2 generating…`);
  let lastErr;
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const { url } = await runAtlasImage(
        NANO_BANANA_2_MODEL,
        {
          prompt: prompt + ' Photorealistic, 9:16 vertical, vibrant natural colors, no text, no watermark.',
          size: '1024*1536',
          prompt_extend: false,
          negative_prompt: NEGATIVE_IMAGE,
        },
        { timeoutMs: 180_000 },
      );
      if (!url) throw new Error('No image URL');
      await download(url, dest);
      console.log(`  ✓ ${targetFile}`);
      return { id: targetFile, status: 'ok', dest };
    } catch (err) {
      lastErr = err;
      if (attempt < 2) {
        console.warn(`  retry: ${err.message}`);
        await new Promise((r) => setTimeout(r, 3000));
      }
    }
  }
  throw lastErr;
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));

  let templates = MARKETING_TEMPLATES.filter((t) => IMAGE_TEMPLATE_IDS.includes(t.id));
  if (opts.only) {
    templates = templates.filter((t) => t.id === opts.only);
    if (!templates.length) throw new Error(`Unknown image template: ${opts.only}`);
  }

  fs.mkdirSync(STYLE_DIR, { recursive: true });
  console.log(`Marketing image previews | Nano Banana 2 | ${templates.length} templates × 3`);

  if (opts.dryRun) {
    for (const tpl of templates) {
      for (let i = 0; i < 3; i++) {
        const files = TARGET_FILES[tpl.id];
        console.log(`DRY ${tpl.id} slot ${i + 1} → ${files[i]}`);
      }
    }
    return;
  }

  const results = [];
  for (const tpl of templates) {
    console.log(`\n=== ${tpl.id} ===`);
    for (let i = 0; i < 3; i++) {
      try {
        const targetFile = TARGET_FILES[tpl.id][i];
        results.push(await generateImage(tpl, i, targetFile, opts));
      } catch (err) {
        console.error(`  ✗ ${tpl.id} slot ${i + 1}: ${err.message}`);
        results.push({ id: `${tpl.id}-${i + 1}`, status: 'failed', error: err.message });
      }
    }
  }

  fs.writeFileSync(RESULTS_PATH, JSON.stringify(results, null, 2));
  const ok = results.filter((r) => r.status === 'ok' || r.status === 'skipped').length;
  console.log(`\nDone: ${ok}/${results.length} → ${STYLE_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});