/**
 * Retry script: generates demo videos for Kling 3, Kling 2.5, Seedance 1.5, Wan 2.5
 * Strategy: Generate a starting image first (Flux Schnell), then use i2v endpoints.
 */
import fs from 'fs';
import path from 'path';
import { ATLAS_FLUX_SCHNELL, download, runAtlasImage, runAtlasVideo } from './lib/atlas.mjs';

const OUT_DIR = 'public/video/demos';
fs.mkdirSync(OUT_DIR, { recursive: true });

async function generateStartingImage(prompt) {
    console.log('  Generating starting image...');
    const { url } = await runAtlasImage(ATLAS_FLUX_SCHNELL, {
        prompt,
        aspect_ratio: '16:9',
    }, { timeoutMs: 120_000 });
    if (!url) throw new Error('No starting image URL');
    console.log(`  Starting image: ${url.slice(0, 80)}...`);
    return url;
}

const DEMOS = [
    {
        name: 'demo-kling3',
        startImagePrompt: 'Rain-soaked neon city street at night, wet asphalt reflecting pink and cyan neon signs from storefronts, sharp perspective, hyperrealistic, no people, cinematic',
        videoModel: 'kwaivgi/kling-v3.0-pro/image-to-video',
        videoPrompt: 'A black motorcycle with a helmeted rider in leather suit blasts through the frame at high speed, rear wheel throwing up rooster-tail spray, bike leans deep into a corner, knee slider grazing the wet asphalt, neon reflections distort in the puddles. Camera swings from a low rear-tracking shot to a dynamic side angle. Rain droplets on the lens, Blade Runner neon palette.',
        duration: 5,
        aspect_ratio: '16:9',
    },
    {
        name: 'demo-kling2-5',
        startImagePrompt: 'Inside the barrel of a massive turquoise ocean wave at Teahupoo Tahiti, sunlight piercing through the wave ceiling creating god rays, turquoise-green water, foam spray, hyperrealistic water photography',
        videoModel: 'kwaivgi/kling-v2.5-turbo-pro/image-to-video',
        videoPrompt: 'A professional surfer rides inside the barrel, dragging a hand along the wave face leaving a white water trail. The massive wave curls overhead, god rays pierce through. Camera at water level, salt spray on the lens. 120fps slow-motion feel, hyper-detailed water simulation.',
        duration: 5,
        aspect_ratio: '16:9',
    },
    {
        name: 'demo-seedance',
        startImagePrompt: 'Hong Kong rooftop cityscape at dusk, neon city lights bokeh below, golden-magenta sunset sky, concrete ledge edge in foreground, urban skyline',
        videoModel: 'bytedance/seedance-v1.5-pro/image-to-video',
        videoPrompt: 'A free runner in a grey hoodie sprints into frame, launches across the rooftop gap — cut to: hands gripping a concrete ledge, knuckles white, pulling up — cut to: precision landing on a narrow railing, city-light bokeh behind in slow motion — cut to: hero standing at the roof edge looking over the glowing neon city. Fast hard cuts, kinetic urban action documentary.',
        duration: 5,
        resolution: '1080p',
        aspect_ratio: '16:9',
    },
    {
        name: 'demo-wan2-5',
        startImagePrompt: '3D animated Pixar-style cartoon castle courtyard, sunny day, stone walls, hay carts, wooden barrels, chickens, bright saturated colors, soft global illumination, no characters',
        videoModel: 'alibaba/wan-2.5/image-to-video',
        videoPrompt: 'Two comical cartoon knights enter the courtyard — a short round knight in oversized shiny armor and a tall skinny knight in battered dented armor — they duel with exaggerated swords, the round knight misses and topples into the hay cart, chickens scatter in panic, the tall knight laughs then his visor slams shut and he stumbles into the barrel. Pixar squash-and-stretch animation, bright saturated colors.',
        duration: 5,
        resolution: '720p',
    },
];

(async () => {
    let ok = 0;
    for (const demo of DEMOS) {
        const dest = path.join(OUT_DIR, `${demo.name}.mp4`);
        if (fs.existsSync(dest)) {
            console.log(`\n[${demo.name}] Already exists, skipping.`);
            ok++;
            continue;
        }
        try {
            console.log(`\n=== ${demo.name} ===`);
            const imageUrl = await generateStartingImage(demo.startImagePrompt);

            const payload = {
                prompt: demo.videoPrompt,
                image: imageUrl,
            };
            if (demo.duration !== undefined) payload.duration = demo.duration;
            if (demo.aspect_ratio !== undefined) payload.aspect_ratio = demo.aspect_ratio;
            if (demo.resolution !== undefined) payload.resolution = demo.resolution;

            console.log(`  [${demo.name}] Submitting to ${demo.videoModel}...`);
            const { url: videoUrl } = await runAtlasVideo(demo.videoModel, payload, { timeoutMs: 480_000 });
            console.log(`  Downloading from ${videoUrl.slice(0, 80)}...`);
            await download(videoUrl, dest);
            console.log(`  ✓ Saved: ${dest}`);
            ok++;
        } catch (e) {
            console.error(`  ✗ ${demo.name} FAILED: ${e.message}`);
        }
    }
    console.log(`\nDone: ${ok}/${DEMOS.length} videos → ${OUT_DIR}`);
})();
