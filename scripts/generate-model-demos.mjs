/**
 * Generates 6 demo videos for the video studio model picker via Atlas Cloud.
 * Output → public/video/demos/
 */
import fs from 'fs';
import path from 'path';
import { download, runAtlasVideo } from './lib/atlas.mjs';

const OUT_DIR = 'public/video/demos';
fs.mkdirSync(OUT_DIR, { recursive: true });

const DEMOS = [
    {
        name: 'demo-veo3',
        model: 'google/veo-3/image-to-video',
        payload: {
            prompt: `Inside the cockpit of a Formula 1 car blasting down a long straight at 320 km/h. Gloved hands grip the carbon-fiber steering wheel, helmet visor reflects the track and blurring grandstands. Camera: tight over-shoulder shot behind the helmet, 50mm, slight vibration from downforce. The car dives into a hairpin — frame tilts with visible g-force, rear catches and snaps back. Golden hour sidelight rakes across the cockpit. Hyper-realistic, shallow depth of field, 1080p.

Audio: V6 turbo wail at 12,000 RPM, two crisp downshift pops, tire squeal as the car bites the apex, crowd roar muffled through the helmet.
Duration: 6 seconds.`,
            aspect_ratio: '16:9',
            duration: 6,
        },
    },
    {
        name: 'demo-veo3-1',
        model: 'google/veo-3.1/image-to-video',
        payload: {
            prompt: `A base jumper in a red wingsuit stands on a snow-dusted alpine cliff edge at sunrise, breath forming visible clouds in the cold air. Camera: wide 24mm establishing shot, slightly low angle showing the fjord far below. He leans forward and drops — cut to freefall, mountain wall rushing past meters to the right, speed lines and wind-torn fabric. The parachute deploys with a violent jerk, canopy snaps open against pink-amber morning sky. Camera pulls back to reveal a gliding silhouette over a cerulean fjord. Photorealistic, cinematic 4K aerial cinematography.

Audio: biting alpine wind at the cliff, the sharp fabric CRACK of the parachute deploying at 3.5 seconds, sudden silence, then one distant bird call over the fjord.
Duration: 6 seconds.`,
            aspect_ratio: '16:9',
            duration: 6,
        },
    },
    {
        name: 'demo-kling3',
        model: 'kwaivgi/kling-v3.0-pro/image-to-video',
        payload: {
            prompt: `[Character A: rider — black leather one-piece racing suit, blacked-out full-face helmet, athletic build]

Master intent: high-speed motorcycle chase through a rain-soaked neon city at night. Blade Runner colour palette. Ultra-realistic physics.

Shot 1 (0-2s). Low rear tracking shot. Motorcycle blasts through a rain-drenched intersection, rear wheel kicking a rooster-tail of spray. Neon pink and cyan signs reflect in the wet asphalt below.
Shot 2 (2-3.5s). Dynamic swing to a side angle: bike leans deep into a corner, Character A's knee slider grazes the ground, sparks skitter across the puddle.
Shot 3 (3.5-5s). Dutch angle chase shot mounted low on the fairing. Rain droplets streak across the lens, visor reflects the wet road rushing underneath.

Camera. Anamorphic 40mm, shallow DOF. Motion blur on background, crisp focus on rider.
Lighting. Neon spill from storefronts and reflections in wet asphalt as dominant light source.
Audio. Screaming inline-four exhaust, rain on tarmac, tire chirp mid-corner.

Negative field. cartoon physics, dry road, daylight, text overlay, watermark.`,
            duration: 5,
            aspect_ratio: '16:9',
        },
    },
    {
        name: 'demo-kling2-5',
        model: 'kwaivgi/kling-v2.5-turbo-pro/image-to-video',
        payload: {
            prompt: `Professional surfer rides inside the hollow barrel of a massive turquoise wave at Teahupoo. The wave ceiling curves overhead. Slow-motion water texture: spray and foam, sunlight piercing through the wave wall creating god rays. The surfer's trailing hand drags along the face leaving a white water line. Camera tracks at water level from the side, salt-water droplets hit the lens. Bright tropical daylight, hyper-detailed water simulation, 120fps slow-motion feel, documentary sports cinematography.`,
            duration: 5,
            aspect_ratio: '16:9',
        },
    },
    {
        name: 'demo-seedance',
        model: 'bytedance/seedance-v1.5-pro/image-to-video',
        payload: {
            prompt: `Important direction:
This must be a clearly edited multi-shot sequence with visible cuts between shots.
Do not generate a single continuous take. Each shot must have a different camera angle and different framing. Tone: kinetic urban action documentary.

Generate a 5-second multi-shot parkour sequence with fast escalating editing.

Story: A free runner in a grey hoodie sprints across Hong Kong rooftops at dusk, launches across a gap, grips a ledge and pulls up, lands a precision jump on a narrow railing, and pauses at the roof edge looking over the neon skyline below.

Visual style: Cinematic cool-blue-gold colour grade, neon bokeh in background, sharp subject, motion-blurred background, realistic fabric physics on hoodie.

Camera style: Handheld urgent documentary. 24mm drone for wide, 50mm for mid, 85mm for landing close-up. Visible hard cuts between shots.

Audio: Heavy footfall on concrete, wind rush of a leap, hands slapping a ledge, crunch of landing, then wind and distant city hum.`,
            resolution: '1080p',
            duration: 5,
            aspect_ratio: '16:9',
        },
    },
    {
        name: 'demo-wan2-5',
        model: 'alibaba/wan-2.5/image-to-video',
        payload: {
            prompt: `3D animated cartoon style, Pixar-quality rendering: a short round knight in comically oversized shiny silver armor swings an enormous broadsword at a tall skinny knight in battered dented armor in a sunny castle courtyard. The round knight misses, spins completely around, and topples backward into a hay cart. Chickens explode outward in all directions in panic. The tall knight laughs — then his own helmet visor slams shut and he stumbles sideways into a rain barrel. Exaggerated squash-and-stretch animation, bright warm saturated colours, soft global illumination, family-friendly slapstick comedy.`,
            image: 'https://storage.googleapis.com/falserverless/gallery/an-image-of-a-lush-green-forest-with-sunlight-peeking-through-the-trees.webp',
            duration: 5,
            resolution: '720p',
        },
    },
];

async function generateOne(demo) {
    console.log(`\n[${demo.name}] Submitting to ${demo.model}...`);
    const { url: videoUrl } = await runAtlasVideo(demo.model, demo.payload, { timeoutMs: 480_000 });
    const dest = path.join(OUT_DIR, `${demo.name}.mp4`);
    console.log(`  Downloading from ${videoUrl.slice(0, 80)}...`);
    await download(videoUrl, dest);
    console.log(`  ✓ Saved: ${dest}`);
    return dest;
}

(async () => {
    let ok = 0;
    for (const demo of DEMOS) {
        try {
            await generateOne(demo);
            ok++;
        } catch (e) {
            console.error(`  ✗ ${demo.name} FAILED: ${e.message}`);
        }
    }
    console.log(`\nDone: ${ok}/${DEMOS.length} videos generated → ${OUT_DIR}`);
})();
