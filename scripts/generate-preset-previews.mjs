/**
 * Batch-generate preset preview videos via Atlas Cloud.
 *
 * Usage:
 *   node scripts/generate-preset-previews.mjs --group seedance
 *   node scripts/generate-preset-previews.mjs --group seedance --only sd_gym_mirror
 *   node scripts/generate-preset-previews.mjs --group seedance --dry-run
 *   node scripts/generate-preset-previews.mjs --group seedance --ref public/video/presets/ref-girl.jpg
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  download,
  runAtlasImage,
  runAtlasVideo,
  uploadAtlasMedia,
} from './lib/atlas.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const MANIFEST = path.join(__dirname, 'preset-preview-manifest.json');
const OUT_DIR = path.join(ROOT, 'public/video/presets');
const REFS_DIR = path.join(OUT_DIR, 'refs');
const REF_CARTOON_PATH = path.join(OUT_DIR, 'ref-girl-cartoon.jpg');
const RESULTS_PATH = path.join(__dirname, 'preset-preview-results.json');

const REF_IMAGE_MODEL = 'z-image/turbo';

/** Varied cast — one per preset id, not a shared studio portrait. */
const PREVIEW_CAST = [
  'a man in his 30s with short black hair and stubble',
  'a woman in her 40s with auburn curls and freckles',
  'a person in their 20s with bleached buzz cut and ear piercings',
  'a man in his 50s with gray beard and reading glasses',
  'a woman in her 20s with long braided hair',
  'a person in their 30s with olive skin and curly dark hair',
  'a man in his 20s with athletic build and tan skin',
];

function hashId(id) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function castForJob(jobId) {
  return PREVIEW_CAST[hashId(jobId) % PREVIEW_CAST.length];
}

/** In-scene first frame — NOT a neutral portrait on gray background. */
const SEEDANCE_START_FRAMES = {
  sd_grocery_paparazzi: (c) =>
    `Night city sidewalk outside a club, ${c} in dark hoodie and oversized glasses holding an energy drink can, ` +
    'wet pavement reflections, distant paparazzi camera flashes, cinematic photorealistic, 9:16 vertical, no text',
  sd_gym_mirror: (c) =>
    `Commercial gym interior, ${c} standing before a wall mirror between dumbbell racks, fluorescent light, ` +
    'mid-flex pose, photorealistic, 9:16 vertical, no text',
  sd_airport_sprint: (c) =>
    `Airport terminal wide shot, ${c} sprinting with rolling suitcase, boarding pass visible, polished floors, ` +
    'photorealistic motion blur hint, 9:16 vertical, no text',
  sd_cafe_rain: (c) =>
    `Rainy cafe window seat, ${c} in knit sweater holding latte with heart foam, rain on glass, warm interior light, ` +
    'photorealistic, 9:16 vertical, no text',
  sd_rooftop_wind: (c) =>
    `Rooftop at night, ${c} on ledge with Tokyo skyline bokeh behind, wind in hair and jacket, ` +
    'cinematic photorealistic, 9:16 vertical, no text',
  sd_dino_sprint: (c) =>
    `Daylight city sidewalk, ${c} mid-sprint in casual streetwear, coffee cup falling, T-Rex silhouette far behind, ` +
    'photorealistic action, 9:16 vertical, no text',
  sd_spire_banner: (c) =>
    `Skyscraper spire platform, ${c} in harness gripping black banner edge, city haze below, ` +
    'photorealistic, 9:16 vertical, no text',
};

const WAN_START_FRAMES = {
  wan_rpg_levelup: (c) =>
    `3D stylized cartoon game avatar of ${c} on stone arena platform, fantasy RPG, bright colors, 9:16, no text`,
  wan_platformer_run: (c) =>
    `3D cartoon hero ${c} on floating candy platforms, Pixar style, saturated colors, 9:16, no text`,
  wan_boss_intro: (c) =>
    `3D cartoon warrior ${c} facing giant shadow dragon, low angle, dramatic sky, cel-shaded, 9:16, no text`,
  wan_anime_powerup: (c) =>
    `3D anime-style ${c} crouching with lightning aura spiraling, cracked ground, 9:16, no text`,
  wan_arcade_highscore: (c) =>
    `3D cartoon ${c} at neon arcade cabinet, HIGH SCORE screen glow, pink-cyan palette, 9:16, no text`,
};

function startFramePromptForJob(jobId, groupKey) {
  const cast = castForJob(jobId);
  const map = groupKey === 'wan' ? WAN_START_FRAMES : SEEDANCE_START_FRAMES;
  const builder = map[jobId];
  if (!builder) {
    throw new Error(`No start-frame prompt for job ${jobId} in group ${groupKey}`);
  }
  return builder(cast);
}

const GROUPS = {
  seedance: {
    model: 'bytedance/seedance-v1.5-pro/image-to-video',
    filter: (id) => id.startsWith('sd_'),
    buildPayload: (prompt, imageUrl, { resolution, duration }) => ({
      prompt,
      image: imageUrl,
      aspect_ratio: '9:16',
      resolution,
      duration,
      generate_audio: false,
    }),
  },
  kling: {
    model: 'kwaivgi/kling-v2.5-turbo-pro/image-to-video',
    filter: (id) => id.startsWith('kling_'),
    buildPayload: (prompt, imageUrl, { duration }) => ({
      prompt,
      image: imageUrl,
      aspect_ratio: '9:16',
      duration,
    }),
  },
  wan: {
    model: 'alibaba/wan-2.5/image-to-video',
    filter: (id) => id.startsWith('wan_'),
    buildPayload: (prompt, imageUrl, { resolution, duration }) => ({
      prompt,
      image: imageUrl,
      resolution,
      duration,
      generate_audio: false,
      enable_prompt_expansion: false,
    }),
  },
};

function parseArgs(argv) {
  const opts = {
    group: 'seedance',
    only: null,
    ref: null,
    dryRun: false,
    skipExisting: false,
    resolution: '720p',
    duration: 5,
    skipRef: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--group' && argv[i + 1]) opts.group = argv[++i];
    else if (a === '--only' && argv[i + 1]) opts.only = argv[++i];
    else if (a === '--ref' && argv[i + 1]) opts.ref = argv[++i];
    else if (a === '--resolution' && argv[i + 1]) opts.resolution = argv[++i];
    else if (a === '--duration' && argv[i + 1]) opts.duration = Number(argv[++i]);
    else if (a === '--dry-run') opts.dryRun = true;
    else if (a === '--skip-existing') opts.skipExisting = true;
    else if (a === '--skip-ref') opts.skipRef = true;
  }
  return opts;
}

function loadJobs(groupKey, onlyId) {
  const group = GROUPS[groupKey];
  if (!group) throw new Error(`Unknown group: ${groupKey}. Use: ${Object.keys(GROUPS).join(', ')}`);

  const manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
  let jobs = manifest.filter((j) => group.filter(j.id));
  if (onlyId) jobs = jobs.filter((j) => j.id === onlyId);
  if (jobs.length === 0) throw new Error(`No jobs for group=${groupKey} only=${onlyId ?? 'all'}`);
  return { group, jobs };
}

async function resolveStartFrameUrl(jobId, groupKey, opts) {
  if (opts.ref) {
    if (opts.ref.startsWith('http')) return opts.ref;
    const local = path.resolve(ROOT, opts.ref);
    if (!fs.existsSync(local)) throw new Error(`Ref file not found: ${local}`);
    console.log(`  Uploading manual ref: ${local}`);
    return uploadAtlasMedia(local);
  }

  fs.mkdirSync(REFS_DIR, { recursive: true });
  const localPath = path.join(REFS_DIR, `${jobId}-start.jpg`);
  const prompt = startFramePromptForJob(jobId, groupKey);

  if (fs.existsSync(localPath) && opts.skipExisting) {
    console.log(`  Using cached start frame: ${localPath}`);
    return uploadAtlasMedia(localPath);
  }

  console.log(`  Generating in-scene start frame (${REF_IMAGE_MODEL})…`);
  console.log(`  Cast: ${castForJob(jobId)}`);
  const { url } = await runAtlasImage(
    REF_IMAGE_MODEL,
    { prompt, size: '1024*1536', prompt_extend: false },
    { timeoutMs: 120_000 },
  );
  if (!url) throw new Error('Start frame generation returned no URL');
  await download(url, localPath);
  console.log(`  Saved start frame → ${localPath}`);
  return url;
}

async function generateOne(job, group, imageUrl, opts) {
  const dest = path.join(OUT_DIR, `${job.id}.mp4`);
  if (opts.skipExisting && fs.existsSync(dest)) {
    console.log(`  [${job.id}] Already exists, skipping.`);
    return { id: job.id, status: 'skipped', dest };
  }

  const payload = group.buildPayload(job.prompt, imageUrl, opts);
  console.log(`  [${job.id}] Submitting to ${group.model}...`);

  let lastErr;
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const { url: videoUrl } = await runAtlasVideo(group.model, payload, { timeoutMs: 480_000 });
      if (!videoUrl) throw new Error('No video URL in response');
      await download(videoUrl, dest);
      console.log(`  ✓ ${job.id} → ${dest}`);
      return { id: job.id, status: 'ok', dest };
    } catch (err) {
      lastErr = err;
      if (attempt < 2) {
        console.warn(`  [${job.id}] Attempt ${attempt} failed: ${err.message}. Retrying...`);
        await new Promise((r) => setTimeout(r, 3000));
      }
    }
  }
  throw lastErr;
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const { group, jobs } = loadJobs(opts.group, opts.only);

  fs.mkdirSync(OUT_DIR, { recursive: true });

  console.log(`Group: ${opts.group} | Jobs: ${jobs.length} | ${opts.resolution} ${opts.duration}s 9:16`);
  if (opts.dryRun) {
    for (const j of jobs) console.log(`  DRY-RUN ${j.id}`);
    return;
  }

  const results = [];
  for (const job of jobs) {
    console.log(`\n=== ${job.id} ===`);
    try {
      const imageUrl = await resolveStartFrameUrl(job.id, opts.group, opts);
      const r = await generateOne(job, group, imageUrl, opts);
      results.push(r);
    } catch (err) {
      console.error(`  ✗ ${job.id} FAILED: ${err.message}`);
      results.push({ id: job.id, status: 'failed', error: err.message });
    }
  }

  fs.writeFileSync(RESULTS_PATH, JSON.stringify(results, null, 2));
  const ok = results.filter((r) => r.status === 'ok' || r.status === 'skipped').length;
  console.log(`\nDone: ${ok}/${jobs.length} → ${OUT_DIR}`);
  console.log(`Results log → ${RESULTS_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
