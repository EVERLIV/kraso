/**
 * Batch-generate Marketing Studio homepage demo videos via Kling 3.0 Pro.
 * User-facing generation still uses each template's videoModel (Veo/Kling/etc.).
 *
 * Usage:
 *   npx jiti scripts/generate-marketing-demos.mjs
 *   npx jiti scripts/generate-marketing-demos.mjs --only ugc
 *   node scripts/generate-marketing-demos.mjs --skip-existing
 *   node scripts/generate-marketing-demos.mjs --dry-run
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  MARKETING_TEMPLATES,
  MARKETING_DEMO_NEGATIVE,
  resolveMarketingDemoVideoPrompt,
  resolveMarketingPrompt,
} from '../lib/marketingPresets.ts';
import {
  download,
  runAtlasImage,
  runAtlasVideo,
  uploadAtlasMedia,
} from './lib/atlas.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const STYLE_DIR = path.join(ROOT, 'public/marketing/pickers/style');
const OUT_DIR = path.join(ROOT, 'public/marketing/videos');
const REFS_DIR = path.join(OUT_DIR, 'refs');
const RESULTS_PATH = path.join(__dirname, 'marketing-demo-results.json');

const KLING_MODEL = 'kwaivgi/kling-v3.0-pro/image-to-video';
const REF_IMAGE_MODEL = 'z-image/turbo';
const DURATION = 8;
const RESOLUTION = '1080p';

/** PNG start frames (existing style picker art) — one per card slot. */
const START_FRAMES = {
  ugc: ['ugc-bathroom', 'ugc-2', 'ugc-3'],
  'unboxing-asmr': ['unboxing-asmr', 'asmr-2', 'asmr-3'],
  'unboxing-tryon': ['unboxing-tryon', 'unboxing-tryon-2', 'unboxing-tryon-3'],
  'selfie-testimonial': ['selfie-testimonial', 'selfie-2', 'selfie-3'],
  'before-after': ['before-after', 'before-after-2', 'before-after-3'],
  'product-review': ['product-review', 'product-review-2', 'product-review-3'],
  'couple-sharing': ['couple-1', 'couple-2', 'couple-3'],
  'secret-hack': ['hack-1', 'hack-2', 'hack-3'],
  'camera-pov': ['pov-1', 'pov-2', 'pov-3'],
  'classic-modern': ['classic-1', 'classic-2', 'classic-3'],
  'mess-to-fresh': ['mess-fresh-1', 'mess-fresh-2', 'mess-fresh-3'],
  'gadget-saved-me': ['gadget-1', 'gadget-2', 'gadget-3'],
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

async function resolveStartFrameUrl(tpl, slotIndex, opts) {
  const frames = START_FRAMES[tpl.id];
  if (!frames?.[slotIndex]) throw new Error(`No start frame map for ${tpl.id} slot ${slotIndex + 1}`);

  const pngName = frames[slotIndex];
  const localPath = path.join(STYLE_DIR, `${pngName}.png`);

  if (fs.existsSync(localPath)) {
    return uploadAtlasMedia(localPath);
  }

  fs.mkdirSync(REFS_DIR, { recursive: true });
  const cachePath = path.join(REFS_DIR, `${tpl.id}-${slotIndex + 1}-start.jpg`);
  if (fs.existsSync(cachePath) && opts.skipExisting) {
    return uploadAtlasMedia(cachePath);
  }

  const imagePrompt =
    resolveMarketingPrompt(tpl) +
    ' Photorealistic marketing ad still, vertical 9:16 portrait, vibrant natural colours, no text, no watermark.';
  console.log(`  Generating missing start frame (${REF_IMAGE_MODEL})…`);
  const { url } = await runAtlasImage(
    REF_IMAGE_MODEL,
    { prompt: imagePrompt, size: '1024*1536', prompt_extend: false },
    { timeoutMs: 120_000 },
  );
  if (!url) throw new Error('Start frame generation returned no URL');
  await download(url, cachePath);
  return url;
}

async function generateDemo(tpl, slotIndex, opts) {
  const slot = slotIndex + 1;
  const outFile = `${tpl.id}-${slot}.mp4`;
  const dest = path.join(OUT_DIR, outFile);

  if (opts.skipExisting && fs.existsSync(dest)) {
    console.log(`  [${outFile}] exists, skipping`);
    return { id: outFile, status: 'skipped', dest };
  }

  const prompt = resolveMarketingDemoVideoPrompt(tpl);
  const imageUrl = await resolveStartFrameUrl(tpl, slotIndex, opts);

  console.log(`  [${outFile}] Kling 3.0 Pro ${DURATION}s…`);
  let lastErr;
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const { url: videoUrl } = await runAtlasVideo(
        KLING_MODEL,
        {
          prompt,
          image: imageUrl,
          aspect_ratio: '9:16',
          resolution: RESOLUTION,
          duration: DURATION,
          generate_audio: true,
          negative_prompt: MARKETING_DEMO_NEGATIVE,
        },
        { timeoutMs: 480_000 },
      );
      if (!videoUrl) throw new Error('No video URL');
      await download(videoUrl, dest);
      console.log(`  ✓ ${outFile}`);
      return { id: outFile, status: 'ok', dest };
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
  let templates = MARKETING_TEMPLATES;
  if (opts.only) {
    templates = templates.filter((t) => t.id === opts.only);
    if (!templates.length) throw new Error(`Unknown template: ${opts.only}`);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  console.log(`Marketing demos | Kling 3.0 Pro | ${DURATION}s | ${templates.length} templates × 3`);

  if (opts.dryRun) {
    for (const tpl of templates) {
      for (let i = 0; i < 3; i++) {
        console.log(`DRY ${tpl.id}-${i + 1} ← ${START_FRAMES[tpl.id]?.[i] ?? 'generate'}.png`);
      }
    }
    return;
  }

  const results = [];
  for (const tpl of templates) {
    console.log(`\n=== ${tpl.id} ===`);
    for (let i = 0; i < 3; i++) {
      try {
        results.push(await generateDemo(tpl, i, opts));
      } catch (err) {
        console.error(`  ✗ ${tpl.id}-${i + 1}: ${err.message}`);
        results.push({ id: `${tpl.id}-${i + 1}`, status: 'failed', error: err.message });
      }
    }
  }

  fs.writeFileSync(RESULTS_PATH, JSON.stringify(results, null, 2));
  const ok = results.filter((r) => r.status === 'ok' || r.status === 'skipped').length;
  console.log(`\nDone: ${ok}/${results.length} → ${OUT_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
