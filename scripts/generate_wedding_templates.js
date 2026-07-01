
import fs from 'fs';
import path from 'path';

// 1. Configuration & Constants
const WEDDING_TEMPLATES = [
    {
        id: 'wedding-bride-groom',
        prompt: 'Show the person from the photo in wedding attire (suit or white dress) standing with a partner in a beautiful garden. CRUCIAL: Preserve the facial features exactly. Photorealistic style, detailed natural skin texture. Soft romantic lighting, love, happiness.'
    },
    {
        id: 'wedding-dress',
        prompt: 'Show the person from the photo wearing a luxurious, detailed white lace wedding dress, looking into a large vintage mirror in a bridal salon. CRUCIAL: Maintain exact facial identity. Photorealistic style, detailed natural skin texture. Soft lighting, elegance.'
    },
    {
        id: 'wedding-church',
        prompt: 'Show the person from the photo participating in a traditional orthodox wedding ceremony (Venchanie) inside a beautiful church. CRUCIAL: Keep the face exactly identical. Photorealistic style, detailed natural skin texture. Candles, gold icons, holding crowns, spiritual atmosphere.'
    },
    {
        id: 'wedding-zags',
        prompt: 'Show the person from the photo walking out of the Registry Office (ZAGS) doors, smiling happily. CRUCIAL: Preserve the facial features exactly. Photorealistic style. Guests are throwing white rose petals in the air. Joyful celebration moment.'
    },
    {
        id: 'wedding-ring',
        prompt: 'Close-up artistic shot focusing on the person\'s hand wearing a beautiful diamond wedding ring. Soft bokeh background, holding a bouquet or partner\'s hand. Photorealistic.'
    },
    {
        id: 'wedding-dance',
        prompt: 'Show the person from the photo dancing the first wedding dance. CRUCIAL: Maintain exact facial identity. Photorealistic style. Low floor fog (dry ice), spotlight, romantic evening atmosphere in a banquet hall.'
    },
    {
        id: 'wedding-cake',
        prompt: 'Show the person from the photo standing next to a giant multi-tier wedding cake, holding a knife ready to cut it. CRUCIAL: Keep the face exactly identical. Photorealistic style. Festive reception background.'
    },
    {
        id: 'wedding-party',
        prompt: 'Show the person from the photo at a lively wedding party, holding a glass of champagne, laughing with friends. CRUCIAL: Preserve facial identity. Photorealistic style. Sparklers, disco lights, fun vibe.'
    },
    {
        id: 'wedding-morning',
        prompt: 'Show the person from the photo in a silk white robe, sitting on a bed or chair, getting ready for the wedding. CRUCIAL: Maintain exact facial identity. Photorealistic style, detailed natural skin texture. Makeup, bouquet nearby, soft window light.'
    },
    {
        id: 'wedding-car',
        prompt: 'Show the person from the photo sitting in a decorated luxury retro wedding car or limousine. CRUCIAL: Keep the face exactly identical. Photorealistic style. Flowers on the car, waving out the window.'
    }
];

const DOWNLOAD_DIR = path.resolve('public', 'templates');

// 2. Setup Directory
if (!fs.existsSync(DOWNLOAD_DIR)) {
    fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
}

// 3. Helper to read .env manually
function getEnv(key) {
    try {
        const envPath = path.resolve('.env');
        if (!fs.existsSync(envPath)) return null;
        const content = fs.readFileSync(envPath, 'utf8');
        const lines = content.split('\n');
        for (const line of lines) {
            if (line.trim().startsWith(`${key}=`)) {
                return line.split('=')[1].trim().replace(/^["']|["']$/g, '');
            }
        }
    } catch (e) {
        console.error('Error reading .env:', e);
    }
    return null;
}

const API_KEY = getEnv('VITE_GEMINI_API_KEY');

if (!API_KEY) {
    console.error('❌ ERROR: VITE_GEMINI_API_KEY is not set in .env');
    console.log('Please add VITE_GEMINI_API_KEY=your_key to your .env file.');
    process.exit(1);
}

// 4. Gemini REST API Configuration
const modelName = "gemini-2.5-flash-image";

async function generateAndSave(template) {
    const filePath = path.join(DOWNLOAD_DIR, `${template.id}.jpg`);

    if (fs.existsSync(filePath)) {
        console.log(`⏩ Skipping ${template.id} (already exists)`);
        return;
    }

    console.log(`🎨 Generating ${template.id}...`);

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`;

        // Adding 3s delay to avoid burst limits
        await new Promise(r => setTimeout(r, 3000));

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            { text: template.prompt }
                        ]
                    }
                ]
            })
        });

        if (!response.ok) {
            const err = await response.text();
            throw new Error(`API Error: ${response.status} - ${err}`);
        }

        const data = await response.json();

        // Iterate through all parts to find the image data
        let base64Image = null;
        const parts = data.candidates?.[0]?.content?.parts || [];

        for (const part of parts) {
            if (part.inlineData?.data) {
                base64Image = part.inlineData.data;
                break;
            }
            if (part.data) {
                base64Image = part.data;
                break;
            }
        }

        if (base64Image) {
            fs.writeFileSync(filePath, Buffer.from(base64Image, 'base64'));
            console.log(`✅ Saved ${template.id}.jpg`);
        } else {
            console.error('Response Data Titles:', parts.map(p => p.text ? 'text' : 'data'));
            throw new Error('No image data found in response parts.');
        }
    } catch (error) {
        console.error(`❌ Failed to generate ${template.id}:`, error.message);
    }
}

// 5. Main Loop
(async () => {
    console.log('🚀 Starting Wedding Template Generation (REST API)...');
    for (const template of WEDDING_TEMPLATES) {
        await generateAndSave(template);
    }
    console.log('🏁 Process Finished.');
})();
