
import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream/promises';

const IMAGES_TO_CACHE = [
    {
        id: 'clay-3d',
        url: 'https://gen.pollinations.ai/image/cute%203d%20clay%20character%20portait?width=400&height=500&nologo=true&model=turbo&token=sk_gg1n2R2PpU9jHfqmpFgszJagRO2vZ3SF'
    },
    {
        id: 'gothic-fantasy',
        url: 'https://gen.pollinations.ai/image/dark%20gothic%20fantasy%20portrait?width=400&height=500&nologo=true&model=turbo&token=sk_gg1n2R2PpU9jHfqmpFgszJagRO2vZ3SF'
    }
];

const DOWNLOAD_DIR = path.resolve('public', 'templates');

if (!fs.existsSync(DOWNLOAD_DIR)) {
    fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
}

async function downloadImages() {
    for (const { id, url } of IMAGES_TO_CACHE) {
        const filePath = path.join(DOWNLOAD_DIR, `${id}.jpg`);
        console.log(`Downloading ${id} from ${url}...`);

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
            }

            const fileStream = fs.createWriteStream(filePath);
            // @ts-ignore - ReadableStream/Node stream mismatch in types but works in runtime
            await pipeline(response.body, fileStream);

            console.log(`${id} downloaded successfully to ${filePath}`);
        } catch (error) {
            console.error(`Error downloading ${id}:`, error);
        }
    }
}

downloadImages();
