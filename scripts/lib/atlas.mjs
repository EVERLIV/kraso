/**
 * Shared Atlas Cloud REST client for dev scripts.
 * Loads ATLASCLOUD_API_KEY from env or functions/.env.
 */
import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';

const ATLAS_API_BASE = 'https://api.atlascloud.ai/api/v1';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');

export const ATLAS_FLUX_SCHNELL = 'black-forest-labs/flux-schnell';

export function loadAtlasKey() {
  const fromEnv = process.env.ATLASCLOUD_API_KEY?.trim();
  if (fromEnv) return fromEnv.replace(/^["']|["']$/g, '');

  const envPaths = [
    path.join(ROOT, 'functions', '.env'),
    path.join(process.cwd(), 'functions', '.env'),
  ];

  for (const envPath of envPaths) {
    if (!fs.existsSync(envPath)) continue;
    const text = fs.readFileSync(envPath, 'utf8');
    for (const rawLine of text.split('\n')) {
      const line = rawLine.replace(/\r$/, '').trim();
      const m = line.match(/^ATLASCLOUD_API_KEY=(.+)$/);
      if (m) return m[1].trim().replace(/^["']|["']$/g, '');
    }
  }

  throw new Error('ATLASCLOUD_API_KEY not set — add to env or functions/.env');
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function atlasFetch(url, options = {}) {
  const resp = await fetch(url, options);
  const text = await resp.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`Atlas API error (${resp.status}): ${text.slice(0, 300)}`);
  }
  if (!resp.ok) {
    const msg = json?.message || json?.error || text.slice(0, 300);
    throw new Error(`Atlas API error (${resp.status}): ${msg}`);
  }
  return json;
}

async function pollPrediction(key, predictionId, { intervalMs = 3000, timeoutMs = 240_000 } = {}) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    const json = await atlasFetch(`${ATLAS_API_BASE}/model/prediction/${predictionId}`, {
      headers: { Authorization: `Bearer ${key}`, Accept: 'application/json' },
    });
    const data = json?.data ?? json;
    const status = String(data?.status || '').toLowerCase();

    if (status === 'completed' || status === 'succeeded' || status === 'success') {
      return data;
    }
    if (status === 'failed' || status === 'error' || status === 'canceled' || status === 'cancelled') {
      throw new Error(data?.error || data?.fail_reason || `Atlas prediction ${status}`);
    }
    await sleep(intervalMs);
  }
  throw new Error(`Atlas prediction timeout after ${timeoutMs}ms`);
}

function extractOutputUrl(data) {
  const outputs = data?.outputs;
  if (Array.isArray(outputs) && outputs.length > 0) {
    const first = outputs[0];
    if (typeof first === 'string') return first;
    if (first?.url) return first.url;
    if (first?.image) return first.image;
    if (first?.video) return first.video;
  }
  if (typeof data?.output === 'string') return data.output;
  if (data?.images?.[0]?.url) return data.images[0].url;
  if (data?.video?.url) return data.video.url;
  return null;
}

/**
 * Submit image or video generation and wait for result.
 * @param {'image'|'video'} type
 * @param {string} modelId
 * @param {Record<string, unknown>} input
 * @param {{ timeoutMs?: number }} [opts]
 */
export async function runAtlasPrediction(type, modelId, input, opts = {}) {
  const key = loadAtlasKey();
  const timeoutMs = opts.timeoutMs ?? 240_000;
  const endpoint = type === 'video' ? '/model/generateVideo' : '/model/generateImage';

  const submitJson = await atlasFetch(`${ATLAS_API_BASE}${endpoint}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ model: modelId, ...input }),
  });

  const predictionId = submitJson?.data?.id || submitJson?.id;
  if (!predictionId) {
    throw new Error(`Atlas submit did not return prediction id: ${JSON.stringify(submitJson).slice(0, 200)}`);
  }

  const result = await pollPrediction(key, predictionId, { timeoutMs });
  const url = extractOutputUrl(result);
  return { data: result, url, requestId: predictionId };
}

/** Convenience wrapper for text-to-image scripts. */
export async function runAtlasImage(modelId, input, opts) {
  return runAtlasPrediction('image', modelId, input, opts);
}

/** Convenience wrapper for image-to-video scripts. */
export async function runAtlasVideo(modelId, input, opts) {
  return runAtlasPrediction('video', modelId, input, opts);
}

/** Upload local file → temporary public URL for i2v / edit workflows. */
export async function uploadAtlasMedia(filePath) {
  const key = loadAtlasKey();
  const abs = path.resolve(filePath);
  if (!fs.existsSync(abs)) throw new Error(`File not found: ${abs}`);

  const blob = new Blob([fs.readFileSync(abs)]);
  const form = new FormData();
  form.append('file', blob, path.basename(abs));

  const resp = await fetch(`${ATLAS_API_BASE}/model/uploadMedia`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}` },
    body: form,
  });
  const text = await resp.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`Atlas upload error (${resp.status}): ${text.slice(0, 300)}`);
  }
  if (!resp.ok) {
    throw new Error(json?.message || json?.error || `Upload failed (${resp.status})`);
  }
  const url = json?.url || json?.data?.url || json?.download_url || json?.data?.download_url;
  if (!url) throw new Error(`Upload did not return URL: ${JSON.stringify(json).slice(0, 200)}`);
  return url;
}

export function download(url, dest) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(dest);
    proto.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        file.close();
        fs.unlink(dest, () => {});
        download(res.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode && res.statusCode >= 400) {
        file.close();
        fs.unlink(dest, () => {});
        reject(new Error(`Download failed (${res.statusCode}): ${url}`));
        return;
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', (err) => { fs.unlink(dest, () => {}); reject(err); });
  });
}
