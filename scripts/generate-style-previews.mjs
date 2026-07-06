import fs from 'fs';
import path from 'path';
import { ATLAS_FLUX_SCHNELL, download, runAtlasImage } from './lib/atlas.mjs';

const OUT_DIR = 'public/marketing/pickers/style';

const jobs = [
    { name: 'ugc-2', prompt: 'Photorealistic UGC social media ad. Young attractive brunette woman in cozy living room, holding a white product cup at chest height, warm genuine smile looking directly at camera, iPhone handheld aesthetic, soft window light, natural grain, vibrant colours, lifestyle feel, 3:4 portrait' },
    { name: 'ugc-3', prompt: 'Photorealistic UGC social media content. Stylish young man outdoors at golden hour sunset, holding a tumbler product toward camera with big energetic smile, authentic urban street background, vibrant saturated colours, vertical 3:4 portrait, social media creator vibe, photorealistic' },
    { name: 'asmr-2', prompt: 'ASMR unboxing photography, overhead close-up of elegant manicured hands with nude nail polish slowly peeling back white tissue paper inside premium matte black gift box on clean white marble surface, soft warm bokeh background, ultra-detailed textures, satisfying aesthetic, 3:4 portrait, photorealistic' },
    { name: 'asmr-3', prompt: 'ASMR unboxing flat lay, close-up feminine hands with pastel nails gently pulling a satin ribbon on a luxury cream gift box, scattered rose petals, warm amber candlelight, wooden table surface, whisper aesthetic, 3:4 portrait, photorealistic product photography' },
    { name: 'unboxing-tryon-2', prompt: 'Excited young woman holding open product box in one hand wearing matching fashion item in the other, surprised joyful expression, bright modern apartment, large mirror in background, vertical 3:4, vibrant colours, photorealistic UGC social media ad' },
    { name: 'unboxing-tryon-3', prompt: 'Fashion-forward woman doing unbox-to-try-on content, holding sleek packaging showing product reveal, energetic expression, stylish loft apartment with warm ambient light, vertical 3:4 portrait, vibrant social media aesthetic, photorealistic' },
    { name: 'selfie-2', prompt: 'Authentic selfie testimonial, beautiful young woman holding phone at arm length outdoors in park, golden sunshine bokeh, genuine bright smile, holding skincare product beside face, warm natural light, vertical 3:4, photorealistic UGC social media style, vibrant warm colours' },
    { name: 'selfie-3', prompt: 'Authentic selfie video testimonial, young man outdoors in urban setting holding phone at arm length selfie style, enthusiastic expressive face, holding product close to face, soft natural daylight, vertical 3:4 portrait, photorealistic, vibrant social media aesthetic' },
    { name: 'direct-to-camera-2', prompt: 'Confident young woman direct-to-camera content creator, looking straight into lens with calm authority and slight smile, holding sleek product at shoulder height with both hands, clean light grey studio background, soft ring light catchlight, vertical 3:4 portrait, commercial quality, vibrant' },
    { name: 'direct-to-camera-3', prompt: 'Professional content creator, attractive man in smart casual outfit speaking directly to camera, minimal white background, holding a product confidently at chest height, ring light catchlight in eyes, vertical 3:4 commercial portrait, vibrant colours, photorealistic' },
    { name: 'before-after-2', prompt: 'Dramatic before and after transformation split photo, same young woman: left half tired no makeup cool desaturated blue light, right half radiant glowing energized warm golden amber light, identical framing same neutral background, clean vertical dividing line, 3:4 portrait, photorealistic, high contrast' },
    { name: 'before-after-3', prompt: 'Before after split photo transformation, woman with messy hair on left half vs polished styled glowing look on right half, same person same cozy background, clean visual split, warm vs cool color contrast, vertical 3:4 portrait, photorealistic commercial photography' },
    { name: 'product-review-2', prompt: 'Honest product review photo, young attractive woman sitting at cozy wooden desk carefully rotating a skincare product with both hands to show all sides, thoughtful engaged expression, warm side window light, bookshelves in background, vertical 3:4, photorealistic, vibrant warm colours' },
    { name: 'product-review-3', prompt: 'Product review photography, young man seated at table demonstrating a tech product, leaning forward with engaged direct expression, warm home office setting, natural side light, vertical 3:4 portrait, photorealistic, vibrant lifestyle colours' },
];

async function generate(job) {
    const { url } = await runAtlasImage(ATLAS_FLUX_SCHNELL, {
        prompt: job.prompt,
        aspect_ratio: '3:4',
    }, { timeoutMs: 120_000 });
    if (!url) throw new Error(`No URL for ${job.name}`);
    return { name: job.name, url };
}

(async () => {
    console.log(`Generating ${jobs.length} images via Atlas Cloud...`);
    const results = await Promise.allSettled(jobs.map(generate));
    let success = 0;
    for (const r of results) {
        if (r.status === 'fulfilled') {
            const { name, url } = r.value;
            const dest = path.join(OUT_DIR, `${name}.webp`);
            try {
                await download(url, dest);
                console.log(`OK: ${dest}`);
                success++;
            } catch (e) {
                console.error(`DL FAIL ${name}: ${e.message}`);
            }
        } else {
            console.error(`GEN FAIL: ${r.reason?.message}`);
        }
    }
    console.log(`Done: ${success}/${jobs.length}`);
})();
