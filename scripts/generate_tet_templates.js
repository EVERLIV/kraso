
import fs from 'fs';
import path from 'path';


// 1. Configuration & Constants
const TET_TEMPLATES = [
    {
        id: 'tet-traditional-yellow',
        prompt: 'Show the person from the photo wearing a luxurious traditional yellow and red Ao Dai, standing next to a large blooming yellow Ochna Integerrima tree (Hoa Mai). CRUCIAL: Preserve the facial features exactly. Photorealistic style, detailed natural skin texture, visible pores, no plastic smoothing. Festive Vietnamese Lunar New Year atmosphere, soft sunlight, happy expression.'
    },
    {
        id: 'tet-traditional-pink',
        prompt: 'Show the person from the photo wearing a pink silk Ao Dai standing in a garden of blooming peach blossoms (Hoa Dao). CRUCIAL: Maintain exact facial identity. Photorealistic style, detailed natural skin texture. Traditional Northern Vietnamese Tet celebration style. Gentle, elegant, spring vibes.'
    },
    {
        id: 'tet-hoi-an',
        prompt: 'Show the person from the photo in Hoi An ancient town at night, surrounded by hundreds of colorful glowing silk lanterns. Wearing a traditional Ao Dai. CRUCIAL: Keep the face exactly identical. Photorealistic style, detailed natural skin texture. Magical, cinematic lighting, river background.'
    },
    {
        id: 'tet-temple',
        prompt: 'Show the person from the photo visiting a traditional Vietnamese temple or pagoda to pray for luck. CRUCIAL: Preserve facial identity. Photorealistic style, detailed natural skin texture. Burning incense sticks, smoke swirling, peaceful spiritual atmosphere. Wearing modest traditional clothing.'
    },
    {
        id: 'tet-calligraphy',
        prompt: 'Show the person from the photo sitting with a Vietnamese calligraphy master (Ong Do) on a street corner, holding a red paper with lucky characters. CRUCIAL: Maintain exact facial identity. Photorealistic style, detailed natural skin texture. Old Quarter background, red paper decorations.'
    },
    {
        id: 'tet-lucky-money',
        prompt: 'Show the person from the photo holding many red lucky money envelopes (Li Xi) with a big smile. CRUCIAL: Keep the face exactly identical. Photorealistic style, detailed natural skin texture. Background decorated with Tet couplets and flowers. Wealth and prosperity vibe.'
    },
    {
        id: 'tet-banh-chung',
        prompt: 'Show the person from the photo wrapping traditional sticky rice cakes (Banh Chung) with green leaves. CRUCIAL: Preserve facial identity. Photorealistic style, detailed natural skin texture. Rustic kitchen setting, cozy family atmosphere, preparing for Tet.'
    },
    {
        id: 'tet-flower-market',
        prompt: 'Show the person from the photo walking through a bustling Tet flower market filled with kumquat trees and chrysanthemums. CRUCIAL: Maintain exact facial identity. Photorealistic style, detailed natural skin texture. Motorbikes carrying flowers in the background. Authentic street life.'
    },
    {
        id: 'tet-family-tray',
        prompt: 'Show the person from the photo sitting at a traditional Tet tea table with a tray of five fruits (Mam Ngu Qua) and candied fruits. CRUCIAL: Keep the face exactly identical. Photorealistic style, detailed natural skin texture. Wearing nice clothes, welcoming guests.'
    },
    {
        id: 'tet-modern-chic',
        prompt: 'Show the person from the photo wearing a modern, stylized fashion Ao Dai (Ao Dai Cach Tan) with trendy accessories. CRUCIAL: Preserve facial identity. Photorealistic style, detailed natural skin texture. Studio photography with red background and artistic props.'
    },
    {
        id: 'tet-fireworks-hcm',
        prompt: 'Show the person from the photo standing on a luxury rooftop bar in Ho Chi Minh City, with the illuminated Landmark 81 tower in the background. Colorful Tet fireworks exploding in the night sky. CRUCIAL: Preserve facial identity exactly. Photorealistic style, detailed natural skin texture, visible pores, no plastic smoothing. Festive elegant atmosphere, holding a glass of wine.'
    },
    {
        id: 'tet-dragon-dance',
        prompt: 'Show the person from the photo standing next to a vibrant red and yellow Lion Dance (Mua Lan) performance on a busy street. CRUCIAL: Maintain exact facial identity. Photorealistic style, detailed natural skin texture, deep depth of field. Drums, confetti, energetic festive atmosphere.'
    },
    {
        id: 'tet-vintage-retro',
        prompt: 'Vintage 90s film photography style. Show the person from the photo sitting on an old Honda Cub motorbike decorated with Tet flowers. CRUCIAL: Keep the face exactly identical. Photorealistic film grain, warm nostalgic colors. Vietnamese street corner background.'
    },
    {
        id: 'tet-flower-street',
        prompt: 'Show the person from the photo walking down the famous Nguyen Hue Flower Street in Ho Chi Minh City. CRUCIAL: Preserve facial identity. Photorealistic style, detailed natural skin texture. Surrounded by elaborate floral displays and Tet mascots. Sunny bright day.'
    },
    {
        id: 'tet-countryside',
        prompt: 'Show the person from the photo in a peaceful Vietnamese countryside setting. Standing in front of a traditional wooden house with banana trees and a red flag. CRUCIAL: Maintain exact facial identity. Photorealistic style, detailed natural skin texture. Rustic, warm, homecoming vibe.'
    },
    {
        id: 'tet-cyclo',
        prompt: 'Show the person from the photo sitting on a traditional Vietnamese Cyclo (Xich Lo) decorated with marigold flowers. CRUCIAL: Keep the face exactly identical. Photorealistic style, detailed natural skin texture. Riding through a sunny street with colonial architecture.'
    },
    {
        id: 'tet-watermelon',
        prompt: 'Show the person from the photo holding a carved red watermelon with lucky calligraphy characters (Tai Loc). CRUCIAL: Preserve facial identity. Photorealistic style, detailed natural skin texture. Bright red and green colors, festive background.'
    },
    {
        id: 'tet-non-la',
        prompt: 'Show the person from the photo wearing a white Ao Dai and a traditional Conical Hat (Non La), standing by a lotus pond. CRUCIAL: Maintain exact facial identity. Photorealistic style, detailed natural skin texture. Soft, poetic, serene atmosphere.'
    },
    {
        id: 'tet-incense-spiral',
        prompt: 'Show the person from the photo standing under hundreds of hanging spiral incense coils in an atmospheric temple (like Ba Thien Hau). CRUCIAL: Keep the face exactly identical. Photorealistic style, detailed natural skin texture. Shafts of light cutting through the smoke, cinematic.'
    },
    {
        id: 'tet-kitchen-god',
        prompt: 'Show the person from the photo sitting by a warm wood fire, cooking a large pot of Banh Chung at night. CRUCIAL: Preserve facial identity. Photorealistic style, detailed natural skin texture. Glowing warm light from the fire, cozy anticipation of New Year.'
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
    console.log('🚀 Starting Tet Template Generation (REST API)...');
    for (const template of TET_TEMPLATES) {
        await generateAndSave(template);
    }
    console.log('🏁 Process Finished.');
})();
