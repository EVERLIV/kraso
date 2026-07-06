import fs from 'fs';
import path from 'path';
import { ATLAS_FLUX_SCHNELL, download, runAtlasImage } from './lib/atlas.mjs';

const OUT_DIR = 'public/marketing/pickers/style';

const jobs = [
    // Couple Sharing
    {
        name: 'couple-1',
        prompt: 'Cute young couple sitting on a cozy sofa at home, both smiling and looking at a product together, warm evening lamp light, woman holds product up showing it to partner, genuine authentic reaction, vertical 3:4, photorealistic UGC social media',
    },
    {
        name: 'couple-2',
        prompt: 'Young couple in modern kitchen, man surprises woman with a product they try together, woman laughs with joy, bright natural daylight, warm home atmosphere, vertical 3:4 portrait, photorealistic, vibrant lifestyle colours',
    },
    {
        name: 'couple-3',
        prompt: 'Couple on a comfortable bed reviewing a product package together, both leaning in closely examining it, cozy bedroom, soft morning light through curtains, genuine natural smiles, vertical 3:4, photorealistic UGC style',
    },

    // Secret Hack Reveal
    {
        name: 'hack-1',
        prompt: 'Young woman leaning toward camera with exaggerated conspiratorial whisper expression, finger to lips, holding a product to the side, clean bright kitchen background, vertical 3:4 portrait, vibrant, photorealistic UGC TikTok style',
    },
    {
        name: 'hack-2',
        prompt: 'Man with surprised aha-moment expression demonstrating unexpected clever use of a product, pointing at the result excitedly, bright home background, vertical 3:4, photorealistic social media ad, vibrant energetic',
    },
    {
        name: 'hack-3',
        prompt: 'Close-up of hands demonstrating a surprising product hack on a kitchen counter, before-state visible on left side, amazing result on right side, overhead camera angle, warm light, no faces, product-focused, 3:4 portrait, photorealistic',
    },

    // Camera POV
    {
        name: 'pov-1',
        prompt: 'First-person POV shot, hands holding a product out in front at eye level, outdoor park background blurred in bokeh, warm daylight, slight camera movement, immersive vertical 3:4, photorealistic',
    },
    {
        name: 'pov-2',
        prompt: 'First person POV, looking down at hands holding a sleek tech or cosmetic product, urban street background, golden hour light, cinematic depth of field, vertical 3:4, photorealistic, vibrant',
    },
    {
        name: 'pov-3',
        prompt: 'Immersive POV shot, hands unwrap and reveal a product toward the camera, luxurious packaging, soft indoor light, extreme close-up detail of label and packaging, no faces visible, vertical 3:4 portrait, photorealistic macro',
    },

    // Classic Meets Modern
    {
        name: 'classic-1',
        prompt: 'Split aesthetic fashion photo, left half vintage sepia retro style woman in 1960s outfit holding product, right half same woman in bold modern neon streetwear with same product, clean vertical dividing line, 3:4 portrait, photorealistic',
    },
    {
        name: 'classic-2',
        prompt: 'Fashion editorial contrast, woman in classic timeless elegant white dress on one side of frame, modern colorful streetwear on the other, holding same product in both, dramatic lighting contrast, vertical 3:4, photorealistic, high fashion',
    },
    {
        name: 'classic-3',
        prompt: 'Dual aesthetic product shot, classic film-grain warm toned background on left with product styled vintage, crisp clean minimalist modern background on right with same product contemporary styling, 3:4 portrait, photorealistic',
    },

    // Mess to Fresh
    {
        name: 'mess-fresh-1',
        prompt: 'Before-after transformation split, left half messy chaotic kitchen counter with clutter, right half same counter sparkling clean and fresh with product visible, dramatic contrast, vibrant colours on right side, 3:4 portrait, photorealistic',
    },
    {
        name: 'mess-fresh-2',
        prompt: 'Young woman with dramatic before-after expression, left half dishevelled overwhelmed in messy room, right half same woman glowing confident in clean fresh space holding product, vertical split photo, 3:4 portrait, photorealistic',
    },
    {
        name: 'mess-fresh-3',
        prompt: 'Satisfying cleaning transformation overhead shot, messy desk with papers and clutter on left half, pristine organised minimalist desk on right half after using product, clean vertical dividing line, warm vs cool light contrast, 3:4 portrait, photorealistic',
    },
];

async function generate(job) {
    const { url } = await runAtlasImage(ATLAS_FLUX_SCHNELL, {
        prompt: job.prompt,
        aspect_ratio: '3:4',
    }, { timeoutMs: 120_000 });
    if (!url) throw new Error(`No URL for ${job.name}`);
    return { name: job.name, url };
}

async function runBatched(jobs, batchSize = 8) {
    let success = 0;
    for (let i = 0; i < jobs.length; i += batchSize) {
        const batch = jobs.slice(i, i + batchSize);
        console.log(`Batch ${Math.floor(i / batchSize) + 1}: ${batch.map(j => j.name).join(', ')}`);
        const results = await Promise.allSettled(batch.map(generate));
        for (const r of results) {
            if (r.status === 'fulfilled') {
                const { name, url } = r.value;
                const dest = path.join(OUT_DIR, `${name}.png`);
                try {
                    await download(url, dest);
                    console.log(`  OK: ${name}.png`);
                    success++;
                } catch (e) {
                    console.error(`  DL FAIL ${name}: ${e.message}`);
                }
            } else {
                console.error(`  GEN FAIL: ${r.reason?.message}`);
            }
        }
        if (i + batchSize < jobs.length) await new Promise(r => setTimeout(r, 2000));
    }
    console.log(`\nDone: ${success}/${jobs.length}`);
}

runBatched(jobs, 8);
