/**
 * Verify improved marketing video prompts — generates sample clips via Atlas Cloud.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ATLAS_FLUX_SCHNELL, download, loadAtlasKey, runAtlasImage, runAtlasVideo } from './lib/atlas.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'public', 'marketing', 'videos', 'prompt-verify');
fs.mkdirSync(OUT_DIR, { recursive: true });

try {
    loadAtlasKey();
} catch {
    console.error('ATLASCLOUD_API_KEY not set — skip generation, run checklist only.');
    process.exit(0);
}

const TESTS = [
    {
        name: 'verify-selfie-testimonial',
        model: 'kwaivgi/kling-v3.0-pro/image-to-video',
        negative_prompt:
            'distorted hands, extra fingers, third hand, melted face, background change, identity drift, watermark, subtitles',
        startImagePrompt:
            'Photorealistic selfie UGC, young woman holding phone at arm length, warm smile, casual outfit, bright cafe, vertical portrait',
        videoPrompt:
            '[Character A: creator — match reference exactly]\n[Product A: white supplement bottle — match reference]\n\n' +
            'Continuity: preserve exact face, hair, outfit from reference across every shot. Same cafe location and warm daylight. ' +
            'Exactly two hands when holding Product A. Anatomically correct fingers.\n\n' +
            'Shot 1 (0-3s). Wide selfie 24mm handheld. Eyes lock lens; thumb at frame edge; faint cafe hum.\n' +
            'Shot 2 (3-7s). Product A beside cheek — both hands, label readable. Says warmly: "Okay I have to tell you about this."\n' +
            'Shot 3 (7-10s). Same framing. Slow nod. Product steady.\n\nAudio: conversational voice, ambient cafe.',
        duration: 10,
    },
    {
        name: 'verify-couple-sharing',
        model: 'kwaivgi/kling-v3.0-pro/image-to-video',
        negative_prompt:
            'distorted hands, extra fingers, melted face, background change, identity drift, face merge, watermark',
        startImagePrompt:
            'Photorealistic couple on sofa at home, cozy living room, warm evening light, product box between them, vertical portrait',
        videoPrompt:
            '[Character A: Person 1 — match reference]\n[Character B: Person 2 — match reference 2]\n[Product A: product — match reference]\n\n' +
            'Continuity: preserve faces and outfits. Same sofa and lighting. Character A and B distinct — no face merging.\n\n' +
            'Shot 1 (0-3s). Medium-wide 35mm. Both lean toward Product A on sofa; soft home ambient.\n' +
            'Shot 2 (3-6s). Rack focus on Product A, faces soft behind, label readable.\n' +
            'Shot 3 (6-10s). Two-shot demo; mutual laugh; glance to camera. Same room.\n\nAudio: home ambient, soft laughter.',
        duration: 10,
    },
    {
        name: 'verify-camera-pov',
        model: 'google/veo-3.1/image-to-video',
        startImagePrompt:
            'POV first person hands holding skincare product bottle, city street daylight, wide angle, vertical portrait',
        videoPrompt:
            'True POV 24mm. Two hands rise holding product bottle; city street behind. Slight sway; footsteps faint.\n' +
            'Hands rotate product — label readable. Exactly two hands, clean finger separation. Same background throughout.\n' +
            'Audio: urban ambient, breeze.\nDuration: 6s.',
        duration: 6,
    },
];

async function generateStartImage(prompt) {
    const { url } = await runAtlasImage(ATLAS_FLUX_SCHNELL, {
        prompt,
        aspect_ratio: '9:16',
    }, { timeoutMs: 120_000 });
    if (!url) throw new Error('No start image URL');
    return url;
}

async function generateVideo(test) {
    console.log(`\n=== ${test.name} ===`);
    const imageUrl = await generateStartImage(test.startImagePrompt);
    console.log('  Start image OK');

    const payload = {
        prompt: test.videoPrompt,
        image: imageUrl,
        aspect_ratio: '9:16',
        duration: test.duration,
    };
    if (test.negative_prompt) payload.negative_prompt = test.negative_prompt;

    const { url: videoUrl } = await runAtlasVideo(test.model, payload, { timeoutMs: 480_000 });
    const dest = path.join(OUT_DIR, `${test.name}.mp4`);
    await download(videoUrl, dest);
    console.log(`  ✓ ${dest}`);
    return dest;
}

const CHECKLIST = [
    'Same character face across shots',
    'Same location / no background swap',
    'Correct hand count (two hands when holding)',
    'No watermark / subtitles',
    'Product label readable when specified',
];

console.log('Continuity checklist (manual review after generation):');
CHECKLIST.forEach((c, i) => console.log(`  ${i + 1}. ${c}`));

(async () => {
    let ok = 0;
    for (const test of TESTS) {
        try {
            await generateVideo(test);
            ok++;
        } catch (e) {
            console.error(`  ✗ ${test.name}: ${e.message}`);
        }
    }
    console.log(`\nDone: ${ok}/${TESTS.length} → ${OUT_DIR}`);
})();
