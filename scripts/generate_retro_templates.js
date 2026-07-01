
import fs from 'fs';
import path from 'path';

// 1. Configuration & Constants
const RETRO_TEMPLATES = [
    {
        id: 'retro-polaroid-classic',
        prompt: 'Authentic vintage Polaroid photo. Square white border, slightly washed out colors, high contrast flash lighting, chemical texture. Photorealistic. 1:1 aspect ratio.'
    },
    {
        id: 'retro-kodachrome-50s',
        prompt: '1950s Kodachrome color film photography. Rich saturated reds and blues, fine grain, cinematic lighting, mid-century fashion. Photorealistic.'
    },
    {
        id: 'retro-film-noir',
        prompt: 'Classic 1940s film noir black and white photography. Dramatic low-key lighting, deep shadows, smoke, fedora hat, hard light. High contrast monochrome.'
    },
    {
        id: 'retro-flash-90s',
        prompt: 'Retro 90s party photography. Direct camera flash, red-eye effect, high saturation, messy background, vintage fashion. Photorealistic.'
    },
    {
        id: 'retro-vhs-grain',
        prompt: '80s VHS home video screen capture. Magnetic tape distortion, tracking lines, color bleeding, low resolution, date stamp in corner.'
    },
    {
        id: 'retro-daguerreotype',
        prompt: 'Antique 19th-century daguerreotype portrait. Silver plate texture, scratches, sepia tones, long exposure blur, Victorian clothing.'
    },
    {
        id: 'retro-technicolor',
        prompt: 'Golden Age of Hollywood Technicolor photography. Vibrant surreal colors, perfect studio lighting, glamorous makeup, sharp details. Photorealistic.'
    },
    {
        id: 'retro-seventies-dream',
        prompt: '1970s soft focus film photography. Warm golden hour lighting, flared lens, faded edges, bohemian style, grainy. Photorealistic.'
    },
    {
        id: 'retro-magazine-80s',
        prompt: '1980s fashion magazine cover style. Bright colors, hairspray volume, bold makeup, hazy background, high grain. Photorealistic.'
    },
    {
        id: 'retro-western-sepia',
        prompt: 'Old Wild West wanted poster style. Heavy paper texture, sepia monochrome, rough edges, weathered look.'
    },
    {
        id: 'retro-candid-film',
        prompt: 'Modern candid film photography (Leica style). Natural grain, everyday setting, authentic expression, soft contrast. Photorealistic.'
    },
    {
        id: 'retro-album-cover',
        prompt: 'Vintage vinyl album cover aesthetic. Artistic composition, muted color palette, grain, high-end retro styling.'
    },
    {
        id: 'soviet-irony-fate',
        prompt: 'Cinematic portrait in the style of the movie "Irony of Fate" (1975). Retro Soviet apartment interior. Soft film grain, warm nostalgic lighting.'
    },
    {
        id: 'soviet-carnival-night',
        prompt: 'Portrait in the style of "Carnival Night" (1956). 50s musical vibe, bright stage lights, festive clock background.'
    },
    {
        id: 'soviet-morozko',
        prompt: 'Fairy tale portrait in the style of "Morozko" (1964). Russian winter folklore costume, kokoshnik, snowy magical forest background.'
    },
    {
        id: 'soviet-charodei',
        prompt: 'Portrait in the style of "Charodei" (1982). Soviet institute corridor, magic wand, sparkles, 80s Soviet aesthetic.'
    },
    {
        id: 'soviet-ivan-vasilievich',
        prompt: 'Portrait in the style of "Ivan Vasilievich Changes Profession" (1973). Royal red kaftan, Kremlin chambers background.'
    },
    {
        id: 'soviet-gentlemen',
        prompt: 'Portrait in the style of "Gentlemen of Fortune" (1971). Winter setting, sheepskin coat, snowy Soviet street background.'
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

        // Adding 5s delay to avoid burst limits
        await new Promise(r => setTimeout(r, 5000));

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
    console.log('🚀 Starting Retro Template Generation (REST API)...');
    for (const template of RETRO_TEMPLATES) {
        await generateAndSave(template);
    }
    console.log('🏁 Process Finished.');
})();
