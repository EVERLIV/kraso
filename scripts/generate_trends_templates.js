
import fs from 'fs';
import path from 'path';

// --- CONFIGURATION ---
const TRENDS_PRESETS = [
    {
        id: 'style-old-money',
        prompt: 'Dress the person from the photo in the "Old Money" aesthetic. Polo shirt, beige trousers or tennis skirt, cashmere sweater over shoulders, loafers. CRUCIAL: Preserve facial identity exactly. Background: A luxury yacht deck or a private mansion garden. Wealthy, understated elegance. Photorealistic, detailed skin.'
    },
    {
        id: 'style-y2k',
        prompt: 'Dress the person from the photo in Y2K fashion (Year 2000 style). Low-rise jeans, baby tee, butterfly clips, rimless sunglasses. CRUCIAL: Maintain exact facial identity. Background: Glossy futuristic purple and pink gradient with digital abstract shapes. Photorealistic.'
    },
    {
        id: 'style-streetwear',
        prompt: 'Dress the person from the photo in premium streetwear. Oversized graphic hoodie, cargo pants, chunky sneakers, beanie. CRUCIAL: Keep the face exactly identical. Background: Urban city street with graffiti art and neon signs. Photorealistic.'
    },
    {
        id: 'style-minimalist',
        prompt: 'Dress the person from the photo in a clean Minimalist fashion style. Monochromatic outfit (all black or all white), sleek lines, trench coat. CRUCIAL: Preserve facial identity. Background: Modern concrete architectural wall or art gallery. Photorealistic.'
    },
    {
        id: 'style-coquette',
        prompt: 'Dress the person from the photo in Coquette aesthetic. Lace dress, pink bows in hair, pearls, soft lighting. CRUCIAL: Maintain exact facial identity. Background: Vintage bedroom with flowers and soft pastel colors. Photorealistic.'
    },
    {
        id: 'style-cyberpunk',
        prompt: 'Dress the person from the photo in futuristic Techwear. Black tactical straps, mask hanging on neck, waterproof fabrics, neon accents. CRUCIAL: Keep the face recognizable. Background: Rainy night city in Tokyo cyberpunk style. Photorealistic.'
    },
    {
        id: 'style-vintage-90s',
        prompt: 'Dress the person from the photo in 90s vintage style. Denim jacket, flannel shirt tied around waist, combat boots. CRUCIAL: Preserve facial identity. Background: Retro record store or diner. Photorealistic.'
    },
    {
        id: 'style-moodboard-1',
        prompt: 'Create a fashion moodboard composition. Split the image into two sections. On the Left: The person from the photo wearing a stylish chic outfit (CRUCIAL: Preserve facial identity exactly, photorealistic). On the Right: A neat flatlay arrangement of the matching accessories, shoes, and bag on a marble background. High fashion magazine layout style.'
    },
    {
        id: 'style-moodboard-2',
        prompt: 'Create a trendy fashion collage. Main visual is the person from the photo wearing a casual trendy outfit (CRUCIAL: Maintain exact facial identity, photorealistic). Surrounding the person are floating aesthetic elements: a coffee cup, sunglasses, a magazine, and a pair of sneakers arranged artistically. Beige aesthetic background.'
    },
    {
        id: 'style-boho',
        prompt: 'Dress the person from the photo in Bohemian style. Flowy patterned dress or linen shirt, wide-brimmed hat, leather accessories. CRUCIAL: Keep the face exactly identical. Background: Sunset desert or festival grounds. Photorealistic.'
    },
    {
        id: 'cyberpunk-city',
        prompt: 'Futuristic cyberpunk city portrait. Neon lights, rain, high-tech clothing, mechanical enhancements. Night atmosphere. CRUCIAL: Preserve facial identity. High contrast, cinematic.'
    },
    {
        id: 'watercolor-art',
        prompt: 'Soft watercolor painting portrait. Pastel colors, paper texture, artistic brush strokes. Dreamy and romantic. CRUCIAL: Keep the face recognizable but artistic.'
    },
    {
        id: 'pencil-sketch',
        prompt: 'Realistic graphite pencil sketch on textured paper. Detailed shading, cross-hatching. Artistic monochrome. CRUCIAL: Preserve facial identity.'
    },
    {
        id: 'oil-painting',
        prompt: 'Classic oil painting portrait. Visible brushstrokes, rich colors, canvas texture. Renaissance or classical art style. CRUCIAL: Keep the face recognizable.'
    },
    {
        id: 'polaroid-vintage',
        prompt: 'Vintage Polaroid photo style. Flash photography, slightly washed out colors, vignetting, retro vibe. CRUCIAL: Preserve facial identity.'
    },
    {
        id: 'neon-noir',
        prompt: 'Cinematic neon noir portrait. Dark shadows, contrasting blue and pink neon lighting, moody atmosphere. Mystery thriller vibe. CRUCIAL: Preserve facial identity.'
    },
    {
        id: 'studio-bw',
        prompt: 'Professional black and white studio photography. High contrast, dramatic lighting, sharp details. Elegant and timeless. CRUCIAL: Preserve facial identity.'
    },
    {
        id: 'double-exposure',
        prompt: 'Artistic double exposure portrait combining face with a forest or city landscape. Surreal and dreamy. Silhouette effect. CRUCIAL: Keep the face recognizable.'
    },
    {
        id: 'pop-art',
        prompt: 'Pop Art style portrait. Bright contrasting colors, halftone dots, comic book style outlines. Andy Warhol style. CRUCIAL: Keep the face recognizable.'
    },
    {
        id: 'cinematic-film',
        prompt: 'Cinematic film still. Wide aspect ratio, teal and orange color grading, grain, depth of field. Movie scene look. CRUCIAL: Preserve facial identity.'
    },
    {
        id: 'anime-style',
        prompt: 'High quality anime style portrait. Vibrant colors, big expressive eyes, cel shading. Makoto Shinkai background style. CRUCIAL: Keep key facial features recognizable.'
    },
    {
        id: 'clay-3d',
        prompt: 'cute 3d clay character portait made of plasticine. visible fingerprints, stop motion animation style, soft lighting, vibrant colors. CRUCIAL: recognizable facial features adapted to clay style.'
    },
    {
        id: 'pixel-art',
        prompt: 'Pixel art portrait. 16-bit retro game style. Limited color palette, blocky pixels. CRUCIAL: Recognizable features in pixel form.'
    },
    {
        id: 'gothic-fantasy',
        prompt: 'dark gothic fantasy portrait. pale skin, dramatic black lace dress, mysterious ancient castle background, candle lighting, melancholic atmosphere. photorealistic.'
    }
];

const DOWNLOAD_DIR = path.resolve('public', 'templates');

// Helper to read .env manually
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
    process.exit(1);
}

// Gemini REST API Configuration
// Using gemini-2.5-flash-image as found in the previous working script
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

        // Adding delay to avoid burst limits
        await new Promise(r => setTimeout(r, 2000));

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            { text: template.prompt + " --aspect 3:4" }
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
            // Sometimes it might come as bytes?
        }

        if (base64Image) {
            fs.writeFileSync(filePath, Buffer.from(base64Image, 'base64'));
            console.log(`✅ Saved ${template.id}.jpg`);
        } else {
            // If no image, maybe it refused?
            console.error('Response candidate parts:', JSON.stringify(parts, null, 2));
            // If safety ratings blocked it?
            if (data.promptFeedback) {
                console.error('Prompt Feedback:', JSON.stringify(data.promptFeedback, null, 2));
            }
            throw new Error('No image data found in response parts.');
        }
    } catch (error) {
        console.error(`❌ Failed to generate ${template.id}:`, error.message);
    }
}

// Main Loop
(async () => {
    if (!fs.existsSync(DOWNLOAD_DIR)) {
        fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
    }

    console.log(`🚀 Starting Trends Batch Template Generation (${TRENDS_PRESETS.length} templates)...`);
    for (const template of TRENDS_PRESETS) {
        await generateAndSave(template);
    }
    console.log('🏁 Process Finished.');
})();
