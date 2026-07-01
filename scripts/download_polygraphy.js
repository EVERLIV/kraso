
import fs from 'fs';
import path from 'path';
import https from 'https';

const IMAGES_TO_CACHE = [
    {
        id: 'print-menu',
        prompt: 'Create a high-end restaurant menu background design. Dark marble texture, elegant gold lines, soft ambient lighting. Leave empty space in the center for text. Place a gourmet dish on the bottom corner. Photorealistic style.'
    },
    {
        id: 'print-spa-pricelist',
        prompt: 'Create a luxury spa price list background. Soft beige tones, orchid flowers, white stones, and bamboo. Zen atmosphere. Clean space for service list text. Photorealistic.'
    },
    {
        id: 'print-coffee-poster',
        prompt: 'Create a coffee shop promotional poster background. Close-up of coffee beans and a steaming cup. Warm, cozy lighting. Text space at the top. Photorealistic.'
    },
    {
        id: 'print-sale-flyer',
        prompt: 'Create a dynamic sale flyer background. Vibrant red and yellow geometric shapes, confetti, "Big Sale" energy. Space for product images and text. Photorealistic.'
    },
    {
        id: 'print-business-card',
        prompt: 'Create a minimalist modern business card background design. Dark blue and silver gradient. Abstract geometric lines. Professional look. Photorealistic.'
    },
    {
        id: 'print-billboard',
        prompt: 'Create a mockup of a large outdoor billboard on a city building. The billboard surface is blank white for your design. Blue sky background. Photorealistic.'
    },
    {
        id: 'print-event-banner',
        prompt: 'Create a corporate event banner background. Blue stage curtains, spotlights, gold sparkles. Celebration atmosphere. Space for event title. Photorealistic.'
    },
    {
        id: 'print-voucher',
        prompt: 'Create a luxury gift voucher background design. Gold ribbon, silky texture background, elegant typography elements. Photorealistic.'
    },
    {
        id: 'print-real-estate',
        prompt: 'Create a real estate flyer background. Modern home interior in background (blurred), bright airy lighting. Blue and white color scheme. Space for property details. Photorealistic.'
    },
    {
        id: 'print-roll-up',
        prompt: 'Create a blank roll-up standee mockup standing in a modern office lobby. Clean canvas for your design. Professional lighting. Photorealistic.'
    }
];

const DOWNLOAD_DIR = path.resolve('public', 'templates');
const TOKEN = 'sk_gg1n2R2PpU9jHfqmpFgszJagRO2vZ3SF';

if (!fs.existsSync(DOWNLOAD_DIR)) {
    fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
}

async function downloadImage(id, prompt) {
    const seed = Math.floor(Math.random() * 10000);
    const encodedPrompt = encodeURIComponent(prompt);
    const url = `https://gen.pollinations.ai/image/${encodedPrompt}?width=400&height=500&seed=${seed}&nologo=true&model=turbo`;
    const filePath = path.join(DOWNLOAD_DIR, `${id}.jpg`);

    console.log(`Downloading ${id}...`);

    const options = {
        headers: {
            'Authorization': `Bearer ${TOKEN}`
        }
    };

    return new Promise((resolve, reject) => {
        https.get(url, options, (res) => {
            if (res.statusCode !== 200) {
                res.resume();
                reject(new Error(`Status ${res.statusCode}`));
                return;
            }

            const fileStream = fs.createWriteStream(filePath);
            res.pipe(fileStream);

            fileStream.on('finish', () => {
                fileStream.close();
                console.log(`Saved ${id}.jpg`);
                resolve();
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
}

(async () => {
    for (const item of IMAGES_TO_CACHE) {
        try {
            await downloadImage(item.id, item.prompt);
        } catch (e) {
            console.error(`Failed to download ${item.id}:`, e.message);
        }
    }
})();
