
import fs from 'fs';
import path from 'path';

// 1. Configuration & Constants
const TEMPLATES = [
    // --- FAMILY ---
    { id: 'family-addams', prompt: 'Transform the specific family/group from the uploaded photo into a dark, elegant gothic masterpiece. High-contrast cinematic lighting. Everyone dressed in high-quality black velvet and lace formal wear. CRUCIAL: Each person in the output must have a 100% identical face to their counterpart in the original photo. No AI face genericizing. Detailed skin texture, photorealistic, professional dark studio atmosphere. Maintain individual heights and positions.' },
    { id: 'family-wild-west', prompt: 'CRUCIAL: Preserve facial identity exactly. Dress the group as cowboys and sheriffs. Hats, leather vests, boots. Background: old western saloon. Photorealistic style.' },
    { id: 'family-vikings', prompt: 'CRUCIAL: Preserve facial identity exactly. Dress everyone as fierce vikings with furs, leather armor, and horned helmets. Background: misty fjord. Photorealistic style.' },
    { id: 'family-royal', prompt: 'CRUCIAL: Preserve facial identity exactly. Dress everyone in luxurious renaissance royal clothes, velvet robes, crowns. Background: palace throne room. Photorealistic style.' },
    { id: 'family-pajamas', prompt: 'CRUCIAL: Preserve facial identity exactly. Dress everyone in matching funny colorful animal onesies (kigurumi). Background: cozy bedroom. Photorealistic style.' },
    { id: 'family-space', prompt: 'CRUCIAL: Preserve facial identity exactly. Dress everyone in futuristic sci-fi space uniforms. Background: spaceship bridge with stars. Photorealistic style.' },
    { id: 'family-cavemen', prompt: 'CRUCIAL: Preserve facial identity exactly. Dress everyone in leopard prints and animal furs, holding wooden clubs. Background: stone cave. Photorealistic style.' },
    { id: 'family-classic', prompt: 'Professional classic family portrait in a studio setting. Neutral background, elegant but casual attire, warm smiles, soft lighting. CRUCIAL: All individuals must retain 100% identical facial features and expressions from the original photo. Photorealistic 8k.' },
    { id: 'family-zombies', prompt: 'CRUCIAL: Preserve facial identity exactly. Turn the family into funny green zombies. Background: abandoned city.' },
    { id: 'family-cartoon', prompt: 'Transform the image into a famous 2D cartoon style with yellow skin. Background: suburban living room.' },

    // --- ECOMMERCE (GOODS) ---
    { id: 'product-podium', prompt: 'Place product on stylish minimalist 3D podium. Pastel colors, soft shadows. Photorealistic product photography.' },
    { id: 'product-nature', prompt: 'Product photography on nature. Mossy stones, sunlight, bokeh. Organic vibe. Photorealistic.' },
    { id: 'product-luxury', prompt: 'Luxury product photography. Black background with golden accents and dramatic lighting, premium look. Photorealistic.' },

    // --- FASHION ---
    { id: 'fashion-runway', prompt: 'Show the person from the photo walking on a high-fashion runway during a fashion week show. CRUCIAL: Preserve facial identity exactly. Wearing avant-garde designer couture. Dramatic spotlights, audience in darkness, flashing cameras. Photorealistic 8k, detailed skin texture.' },
    { id: 'fashion-editorial', prompt: 'High-end fashion editorial portrait shot for a magazine cover like Vogue. CRUCIAL: Maintain exact facial identity. Artistic lighting, bold makeup, stylish haute couture outfit. Studio background with geometric shadows. 8k resolution, detailed skin texture.' },
    { id: 'fashion-street-paris', prompt: 'Show the person from the photo walking in Paris near the Eiffel Tower. CRUCIAL: Preserve facial identity. Wearing a trench coat, beret, and holding a baguette or coffee. Cloudy chic atmosphere, street style photography. Photorealistic.' },
    { id: 'fashion-old-money-winter', prompt: 'Show the person from the photo on a balcony of a luxury ski chalet in the Alps. CRUCIAL: Keep the face exactly identical. Wearing expensive cashmere beige sweater, fur hat, sipping hot chocolate. Snowy mountain background. Wealthy aesthetic, detailed skin.' },
    { id: 'fashion-urban', prompt: 'Show the person from the photo in a trendy urban streetwear outfit (hoodie, bomber jacket, sneakers). CRUCIAL: Preserve facial identity. Graffiti wall background, neon city lights reflections, dynamic angle. Hypebeast style. Photorealistic.' },
    { id: 'fashion-red-carpet', prompt: 'Show the person from the photo standing on a red carpet at a movie premiere or Met Gala. CRUCIAL: Maintain exact facial identity. Wearing a glamorous evening gown or tuxedo. Paparazzi flashes, velvet ropes, luxury event atmosphere. Photorealistic.' },
    { id: 'fashion-summer-resort', prompt: 'Show the person from the photo in a luxury summer resort outfit (linen shirt/dress, sunglasses). CRUCIAL: Keep the face exactly identical. Amalfi coast background, blue sea, lemon trees, sunny bright lighting. Photorealistic.' },
    { id: 'fashion-cyber', prompt: 'Show the person from the photo in futuristic cyber fashion clothing. Holographic fabrics, neon glowing accessories. CRUCIAL: Preserve facial identity. Night city futuristic background, rain, blue and pink neon lighting. Photorealistic.' },
    { id: 'fashion-denim', prompt: 'Show the person from the photo wearing a stylish all-denim outfit (jean jacket and jeans). CRUCIAL: Maintain exact facial identity. Studio blue background or industrial loft setting. Cool, edgy fashion vibe. Photorealistic.' },
    { id: 'fashion-minimal', prompt: 'Minimalist fashion photography. Show the person from the photo in a sleek monochrome outfit against a plain concrete or beige wall. CRUCIAL: Keep the face exactly identical. Soft natural shadow, clean lines, Zara/Uniqlo lookbook style. Photorealistic.' },

    // --- MAKEUP ---
    { id: 'makeup-nude', prompt: 'Apply a natural "no-makeup" makeup look to the person. Glowing skin, light mascara, clear gloss, neat eyebrows, soft peach blush. CRUCIAL: Keep the face completely recognizable. Photorealistic style, detailed skin texture.' },
    { id: 'makeup-hollywood', prompt: 'Apply classic Hollywood makeup. Bright red lipstick, black winged eyeliner, perfect matte skin, defined lashes. CRUCIAL: Preserve the facial features exactly. Photorealistic style, detailed skin texture.' },
    { id: 'makeup-smokey', prompt: 'Apply dramatic black smokey eye makeup, nude matte lips, and defined cheekbone contouring. CRUCIAL: Maintain exact facial identity. Photorealistic style.' },
    { id: 'makeup-euphoria', prompt: 'Apply creative Euphoria-style makeup with glitter, face gems near eyes, and purple/blue eyeshadows. CRUCIAL: Keep the face exactly identical. Photorealistic style.' },
    { id: 'makeup-kbeauty', prompt: 'Apply Korean beauty style makeup. Glass skin effect, gradient fruit-colored lips, soft straight brows, coral blush. CRUCIAL: Preserve facial identity. Photorealistic style.' },
    { id: 'makeup-goth', prompt: 'Apply gothic makeup style. Dark burgundy or black lipstick, pale skin, heavy black eyeliner, grunge aesthetic. CRUCIAL: Maintain exact facial identity. Photorealistic style.' },
    { id: 'makeup-instaglam', prompt: 'Apply full glam Instagram makeup. Heavy contouring, baking, cut crease eyeshadow, matte liquid lipstick, long false lashes. CRUCIAL: Keep the face recognizable. Photorealistic style.' },
    { id: 'makeup-cyberpunk', prompt: 'Apply futuristic cyberpunk makeup. Neon graphic eyeliner, metallic highlighter on cheekbones, silver lip gloss. CRUCIAL: Preserve facial identity. Photorealistic style.' },
    { id: 'makeup-sunkissed', prompt: 'Apply a sunkissed makeup look. Bronzer, warm blush across nose, faux freckles, golden highlighter. CRUCIAL: Maintain exact facial identity. Photorealistic style.' },
    { id: 'makeup-vamp', prompt: 'Apply a dark seductive vamp look. Sharp contour, dark red lips, intense gaze, slight smokey eye. CRUCIAL: Keep the face exactly identical. Photorealistic style.' },
    { id: 'makeup-bridal', prompt: 'Apply soft, romantic bridal makeup to the person. Glowing skin, soft pink blush, defined lashes, nude glossy lips. CRUCIAL: Preserve facial identity exactly. Photorealistic style, detailed natural skin texture. White veil background hint.' },
    { id: 'makeup-festival', prompt: 'Apply colorful festival makeup. Face jewels, glitter on cheeks, bright eyeshadow accents. CRUCIAL: Maintain exact facial identity. Photorealistic style. Boho chic vibe.' },
    { id: 'makeup-retro-50s', prompt: 'Apply 1950s pin-up style makeup. Defined brows, winged eyeliner, bold matte red lipstick. CRUCIAL: Keep the face recognizable. Photorealistic style. Vintage aesthetic.' },
    { id: 'makeup-neon-graphic', prompt: 'Apply graphic neon eyeliner designs in bright green or pink. Minimalist skin, bold eyes. CRUCIAL: Preserve facial identity. Photorealistic style. Edgy modern look.' },
    { id: 'makeup-soft-glam', prompt: 'Apply soft glam makeup. Neutral eyeshadow tones, shimmery lid, glossy lips, soft contour. CRUCIAL: Maintain exact facial identity. Photorealistic style. Perfect for date night.' },
    { id: 'makeup-fantasy-mermaid', prompt: 'Apply fantasy mermaid makeup. Iridescent scales on cheekbones, blue and purple hues, wet look skin. CRUCIAL: Keep the face recognizable. Photorealistic style. Aquatic vibe.' },
    { id: 'makeup-editorial-avantgarde', prompt: 'Apply avant-garde editorial makeup. Unique shapes, bold colors, artistic expression. CRUCIAL: Preserve facial identity. Photorealistic style. High fashion magazine look.' },
    { id: 'makeup-grunge-90s', prompt: 'Apply 90s grunge makeup. Smudged black eyeliner, matte brown lipstick, matte skin. CRUCIAL: Maintain exact facial identity. Photorealistic style. Rock chic vibe.' },
    { id: 'makeup-glass-skin', prompt: 'Focus on perfect "Glass Skin" makeup. Ultra-hydrated, dewy, reflective skin texture, minimal eye makeup. CRUCIAL: Keep the face recognizable. Photorealistic style.' },
    { id: 'makeup-glitter-tears', prompt: 'Apply glitter tears makeup. Glitter trails falling from eyes like tears. Emotional and artistic. CRUCIAL: Preserve facial identity. Photorealistic style.' },

    // --- BUSINESS ---
    { id: 'business-startup', prompt: 'Business portrait in a modern startup office. Glass walls, casual professional attire, confident smile. CRUCIAL: Keep the face exactly identical. Photorealistic style, detailed skin texture.' },
    { id: 'business-speech', prompt: 'Person giving a business presentation on stage. Ted talk style, spotlight, screen in background. CRUCIAL: Preserve facial identity. Photorealistic style.' },

    // --- UGC CONTENT ---
    { id: 'ugc-unboxing', prompt: 'UGC style photo of person unboxing a package. Excited expression, hands visible, living room background. CRUCIAL: Keep the face exactly identical. Photorealistic style.' },
    { id: 'ugc-review', prompt: 'UGC product review. Person holding a product close to camera, thumbs up, domestic setting. CRUCIAL: Preserve facial identity. Photorealistic style.' },

    // --- BLOGGERS ---
    { id: 'blogger-photoshoot', prompt: 'Show the person from the photo as a model in a professional fashion photoshoot backstage. CRUCIAL: Keep the face exactly identical. Posing, photographer in background, bright studio lighting equipment, flashes firing, busy creative atmosphere. Photorealistic style, detailed skin texture.' },
    { id: 'blogger-autograph', prompt: 'Show the person from the photo as a famous influencer signing autographs for fans. CRUCIAL: Preserve facial identity. Photorealistic style, detailed skin texture. Crowded event, holding a marker, happy fans in background, posters, paparazzi style flashes.' },
    { id: 'blogger-stream-star', prompt: 'Show the person from the photo as a streamer sitting next to a famous celebrity guest. CRUCIAL: Maintain exact facial identity. Photorealistic style, detailed skin texture. High energy live stream setup, wide angle shot of a room with LED lights, laughing, microphone arms, crazy atmosphere.' },
    { id: 'blogger-podcast', prompt: 'Show the person from the photo in a professional podcast studio with microphone and headphones, neon sign in background. CRUCIAL: Keep the face exactly identical. Photorealistic style.' },
    { id: 'blogger-gaming', prompt: 'Show the person from the photo in a gaming room with RGB lighting, gaming chair, and multiple monitors. CRUCIAL: Preserve facial identity. Photorealistic style.' },
    { id: 'blogger-coffee', prompt: 'Aesthetic photo of the person from the photo working on laptop in a stylish minimalist coffee shop. CRUCIAL: Maintain exact facial identity. Photorealistic style.' },
    { id: 'blogger-travel', prompt: 'Travel blogger style. Show the person from the photo holding a coconut on a tropical beach with palm trees. CRUCIAL: Keep the face exactly identical. Photorealistic style.' },
    { id: 'blogger-fashion', prompt: 'Fashion blogger street style photo. Show the person from the photo walking down a city street, holding a coffee cup, stylish outfit. CRUCIAL: Preserve facial identity. Photorealistic style.' },
    { id: 'blogger-fitness', prompt: 'Fitness blogger. Show the person from the photo doing yoga in a bright studio with plants. Athletic wear. CRUCIAL: Maintain exact facial identity. Photorealistic style.' },
    { id: 'blogger-food', prompt: 'Show the person from the photo sitting at a table full of delicious brunch food, holding a fork, smiling. CRUCIAL: Keep the face exactly identical. Photorealistic style.' },
    { id: 'blogger-car', prompt: 'Car vlogger style. Show the person from the photo sitting in the driver seat of a luxury car, hands on steering wheel. CRUCIAL: Preserve facial identity. Photorealistic style.' },
    { id: 'blogger-minimal', prompt: 'Minimalist aesthetic lifestyle shot. Show the person from the photo sitting at a clean white desk with a macbook and plant. CRUCIAL: Maintain exact facial identity. Photorealistic style.' },
    { id: 'blogger-party', prompt: 'Lifestyle party shot. Show the person from the photo on a rooftop bar at night with city lights, holding a drink. CRUCIAL: Keep the face exactly identical. Photorealistic style.' },

    // --- RICH LIFE ---
    { id: 'rich-jet', prompt: 'Place the person in a luxury private jet cabin with leather cream seats and champagne. CRUCIAL: Preserve the facial features exactly. Photorealistic style, detailed skin texture.' },
    { id: 'rich-yacht', prompt: 'Place the person on the deck of a luxury superyacht in the ocean. White clothes, sunglasses, blue water. CRUCIAL: Maintain exact facial identity. Photorealistic style.' },
    { id: 'rich-villa', prompt: 'Place the person in a luxury infinity pool at a modern villa overlooking the sea at sunset. CRUCIAL: Keep the face exactly identical. Photorealistic style.' },
    { id: 'rich-supercar', prompt: 'Person leaning against a bright lime green Lamborghini supercar. Urban background. CRUCIAL: Preserve facial identity. Photorealistic style.' },
    { id: 'rich-penthouse', prompt: 'Person standing near floor-to-ceiling windows in a luxury penthouse apartment with night city skyline view. CRUCIAL: Maintain exact facial identity. Photorealistic style.' },
    { id: 'rich-shopping', prompt: 'Person walking carrying many luxury brand shopping bags (Gucci, LV, Prada). High-end street. CRUCIAL: Keep the face exactly identical. Photorealistic style.' },
    { id: 'rich-champagne', prompt: 'Close up of person holding a crystal glass of expensive champagne at a gala dinner. CRUCIAL: Preserve facial identity. Photorealistic style.' },
    { id: 'rich-helicopter', prompt: 'Person sitting in a helicopter with headsets on, looking out the window at the view. CRUCIAL: Maintain exact facial identity. Photorealistic style.' },
    { id: 'rich-golf', prompt: 'Person posing on a pristine golf course with a golf club. Country club atmosphere. CRUCIAL: Keep the face exactly identical. Photorealistic style.' },
    { id: 'rich-watch', prompt: 'Focus on a luxury gold watch on the person\'s wrist. Driving a luxury car or in a suit. Photorealistic style.' }
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

        // Adding 2s delay to avoid burst limits
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
    console.log(`🚀 Starting Final Batch Template Generation (${TEMPLATES.length} templates)...`);
    for (const template of TEMPLATES) {
        await generateAndSave(template);
    }
    console.log('🏁 Process Finished.');
})();
