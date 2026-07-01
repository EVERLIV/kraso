
import fs from 'fs';
import path from 'path';
import https from 'https';

const IMAGES_TO_CACHE = [
    {
        id: 'clay-3d',
        prompt: 'cute 3d clay character portait made of plasticine. visible fingerprints, stop motion animation style, soft lighting, vibrant colors. '
    },
    {
        id: 'gothic-fantasy',
        prompt: 'dark gothic fantasy portrait. pale skin, dramatic black lace dress, mysterious ancient castle background, candle lighting, melancholic atmosphere. photorealistic.'
    },
    {
        id: 'pop-art',
        prompt: 'Pop Art style portrait. Bright contrasting colors, halftone dots, comic book style outlines. Andy Warhol style.'
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
    // Using gen.pollinations.ai because we have a token
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
                // consumes response data to free up memory
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
