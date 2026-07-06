import path from 'path';
import { ATLAS_FLUX_SCHNELL, download, runAtlasImage } from './lib/atlas.mjs';

const OUT_DIR = 'public/marketing/pickers/style';

const jobs = [
    { name: 'ugc-2', prompt: 'Photorealistic UGC social media ad. Young attractive brunette woman in cozy living room, holding a white product cup at chest height, warm genuine smile looking directly at camera, iPhone handheld aesthetic, soft window light, natural grain, vibrant colours, lifestyle feel, 3:4 portrait' },
    { name: 'ugc-3', prompt: 'Photorealistic UGC social media content. Stylish young man outdoors at golden hour sunset, holding a tumbler product toward camera with big energetic smile, authentic urban street background, vibrant saturated colours, vertical 3:4 portrait, social media creator vibe, photorealistic' },
    { name: 'asmr-2', prompt: 'ASMR unboxing photography, overhead close-up of elegant manicured hands with nude nail polish slowly peeling back white tissue paper inside premium matte black gift box on clean white marble surface, soft warm bokeh background, ultra-detailed textures, satisfying aesthetic, 3:4 portrait, photorealistic' },
    { name: 'before-after-3', prompt: 'Before after split photo transformation, woman with messy hair on left half vs polished styled glowing look on right half, same person same cozy background, clean visual split, warm vs cool color contrast, vertical 3:4 portrait, photorealistic commercial photography' },
];

async function runSequential() {
    let success = 0;
    for (const job of jobs) {
        try {
            console.log(`Generating ${job.name}...`);
            const { url } = await runAtlasImage(ATLAS_FLUX_SCHNELL, {
                prompt: job.prompt,
                aspect_ratio: '3:4',
            }, { timeoutMs: 120_000 });
            const dest = path.join(OUT_DIR, `${job.name}.webp`);
            await download(url, dest);
            console.log(`OK: ${dest}`);
            success++;
        } catch (e) {
            console.error(`FAIL ${job.name}: ${e.message}`);
        }
        await new Promise(r => setTimeout(r, 1500));
    }
    console.log(`Done: ${success}/${jobs.length}`);
}

runSequential();
