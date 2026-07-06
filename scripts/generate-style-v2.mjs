import fs from 'fs';
import path from 'path';
import { ATLAS_FLUX_SCHNELL, download, runAtlasImage } from './lib/atlas.mjs';

const OUT_DIR = 'public/marketing/pickers/style';

// Completely different visual concepts per slot — no same-face repeats
const jobs = [
    // UGC — different ethnicity + outdoor context
    {
        name: 'ugc-2',
        prompt: 'UGC social media ad, stylish Black woman with curly natural hair outdoors at café terrace, holding a pastel-coloured tumbler drink product close to camera, warm sunny day, bright colourful background, energetic smile, iPhone aesthetic vertical 3:4, photorealistic',
    },
    {
        name: 'ugc-3',
        prompt: 'UGC social media ad, young Asian woman with long straight hair in a bright colorful bedroom, sitting on bed holding a product box up excitedly toward camera, pastel room decor, soft natural window light, playful energetic expression, 3:4 portrait, photorealistic',
    },

    // ASMR — NO FACES, only hands + product close-ups
    {
        name: 'asmr-2',
        prompt: 'ASMR macro product photography, top-down view of manicured hands with pastel pink nails carefully lifting lid off a matte white luxury box on grey slate surface, soft tissue paper visible inside, soft diffused light, no faces, product-focused, satisfying textures, 3:4, photorealistic',
    },
    {
        name: 'asmr-3',
        prompt: 'ASMR close-up product shot, elegant hands with deep red nail polish gently pulling a satin cream ribbon tied around a small premium kraft box on a wooden table, scattered dried flower petals, warm candle-style light, no faces, ultra-detailed macro, 3:4, photorealistic',
    },

    // Unboxing+Tryon — different settings + full-body moments
    {
        name: 'unboxing-tryon-2',
        prompt: 'Unboxing try-on moment, young Latina woman in chic apartment holding open product packaging box in one hand and modelling the item on the other hand, joyful surprised face, large floor mirror visible behind her, bright modern interior, vertical 3:4, vibrant colours, photorealistic',
    },
    {
        name: 'unboxing-tryon-3',
        prompt: 'Fashion try-on social content, full body vertical shot of a tall woman in front of a white wardrobe door, open delivery box on the floor beside her, she is wearing the just-unpacked item and posing confidently, bright white studio apartment, 3:4 portrait, photorealistic, vibrant',
    },

    // Selfie — different people, different settings
    {
        name: 'selfie-2',
        prompt: 'Selfie-style UGC ad, sporty young man with athletic build outdoors on a rooftop, holding phone at arm length, genuine excited smile, holding a product can near his face, city skyline background, warm golden hour light, vertical 3:4, photorealistic, vibrant social media',
    },
    {
        name: 'selfie-3',
        prompt: 'Authentic selfie testimonial, Asian woman in a bright colourful street market, arm-length selfie, warm smile, holding product beside her face, colourful market stalls in bokeh background, vibrant colours, vertical 3:4, photorealistic UGC',
    },

    // Direct to Camera — different genders + clean studio looks
    {
        name: 'direct-to-camera-2',
        prompt: 'Direct to camera product presentation, young Black man in smart navy outfit looking directly into camera with confident charming expression, holding a tech product at chest height, clean soft grey studio background, professional ring light, vertical 3:4 portrait, commercial photography',
    },
    {
        name: 'direct-to-camera-3',
        prompt: 'Direct to camera content creator, confident Latina woman in bold red blouse, looking straight into camera with authority, holding a skincare product up at shoulder level, minimal white background, soft beauty lighting, vertical 3:4 commercial portrait, photorealistic, vibrant',
    },

    // Before/After — product-focused split compositions, NO repeated portraits
    {
        name: 'before-after-2',
        prompt: 'Before after split composition photo, left half shows a dull dry plant on wooden table in blue-grey desaturated light, right half shows same plant lush and thriving with bright green leaves in warm golden light after product use, clean vertical dividing line in centre, 3:4 portrait, photorealistic',
    },
    {
        name: 'before-after-3',
        prompt: 'Hair transformation before and after side by side, left half: dull frizzy dry hair close-up in cool flat light, right half: same hair glossy smooth shiny in warm golden light after treatment, same framing, vertical split photo 3:4, photorealistic, high detail',
    },

    // Product Review — focus on product interaction variety
    {
        name: 'product-review-2',
        prompt: 'Product review photo, young South Asian woman with warm smile at a wooden desk, holding a beauty product in both hands and turning it to show the label, engaged reviewer expression, cozy home office with warm lamp light, vertical 3:4 portrait, photorealistic, vibrant',
    },
    {
        name: 'product-review-3',
        prompt: 'Flat lay product review aesthetic, overhead shot of a sleek tech gadget surrounded by review notes on yellow sticky notes, a cup of coffee, and a smartphone, clean white desk background, vibrant editorial style, 3:4 portrait orientation, photorealistic product photography',
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

// Run in batches of 8 to avoid concurrent limit
async function runBatched(jobs, batchSize = 8) {
    let success = 0;
    for (let i = 0; i < jobs.length; i += batchSize) {
        const batch = jobs.slice(i, i + batchSize);
        console.log(`Batch ${Math.floor(i/batchSize)+1}: generating ${batch.map(j=>j.name).join(', ')}...`);
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
