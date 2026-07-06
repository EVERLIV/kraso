/**
 * One-off: export preset prompts for batch preview generation.
 * Run: npx jiti scripts/export-preset-prompts.mjs
 */
import fs from 'fs';
import {
    WAN_VIDEO_PRESETS,
    SEEDANCE_VIDEO_PRESETS,
    buildVideoPresetPrompt,
} from '../lib/videoPresets.ts';

const PREFIX = '';

const all = [...SEEDANCE_VIDEO_PRESETS, ...WAN_VIDEO_PRESETS];
const jobs = all.map((p) => ({
    id: p.id,
    prompt: PREFIX + buildVideoPresetPrompt(p, ''),
}));

const out = 'scripts/preset-preview-manifest.json';
fs.writeFileSync(out, JSON.stringify(jobs, null, 2));
console.log(`Wrote ${jobs.length} jobs → ${out}`);
