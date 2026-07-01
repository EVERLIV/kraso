
import fs from 'fs';
import path from 'path';

// 1. Configuration & Constants
const TEMPLATES = [
    // --- FORMULA 1 ---
    { id: 'f1-cockpit', prompt: 'Cinematic side profile shot of the person from the photo sitting inside a Formula 1 car cockpit. Camera angle from the side/three-quarters. Wearing a professional racing suit and helmet with visor open, revealing the face clearly. CRUCIAL: Preserve the facial features exactly. Photorealistic style, detailed natural skin texture. Hands gripping the steering wheel. Detailed car chassis, blurred racetrack background, high speed atmosphere.' },
    { id: 'f1-car-standing', prompt: 'Show the person from the photo standing confidently next to a sleek Formula 1 car in the pit lane. CRUCIAL: Maintain exact facial identity. Photorealistic style, detailed natural skin texture. Wearing team racing kit, sunglasses, mechanic crew busy in background.' },
    { id: 'f1-podium', prompt: 'Show the person from the photo standing on the 1st place podium, holding a giant gold trophy and spraying champagne. CRUCIAL: Keep the face exactly identical. Photorealistic style. Confetti raining down, cheering crowd below, wearing winner cap.' },
    { id: 'f1-racing', prompt: 'Action shot of a Formula 1 car speeding on the track. The person from the photo is driving, face visible through the open visor. CRUCIAL: Preserve facial identity. Photorealistic style. Motion blur background, sparks from under the car, intense speed.' },
    { id: 'f1-paddock', prompt: 'Show the person from the photo walking through the exclusive F1 Paddock area. CRUCIAL: Maintain exact facial identity. Photorealistic style. Wearing stylish VIP guest pass, sunglasses, luxury casual outfit, motorhomes in background.' },
    { id: 'f1-pitstop', prompt: 'Show the person from the photo as part of the pit crew, holding a wheel gun during a lightning-fast pit stop. CRUCIAL: Keep the face recognizable. Photorealistic style. Surrounded by mechanics in matching uniforms, smoke, intensity.' },
    { id: 'f1-garage', prompt: 'Show the person from the photo sitting in the team garage, looking at telemetry data on monitors with engineers. CRUCIAL: Preserve facial identity. Photorealistic style. Headset on, focused expression, high-tech environment.' },
    { id: 'f1-helmet', prompt: 'Close-up portrait of the person wearing a custom-designed colorful racing helmet with the visor open. CRUCIAL: Maintain exact facial identity. Photorealistic style, detailed skin texture. Track lights reflecting on the helmet, intense eyes.' },

    // --- DATING ---
    { id: 'dating-train', prompt: 'Show the person from the photo meeting a loved one at a vintage train station platform. CRUCIAL: Preserve facial identity. Photorealistic style. Steam, warm lighting, hugging or waiting with flowers, emotional reunion atmosphere.' },
    { id: 'dating-car', prompt: 'Show the person from the photo on a romantic date night by a luxury car. CRUCIAL: Keep the face exactly identical. Photorealistic style. Leaning on the car hood, city lights in background, evening street vibe, holding a rose.' },
    { id: 'dating-flowers', prompt: 'Show the person from the photo holding a giant luxury bouquet of red roses. CRUCIAL: Maintain exact facial identity. Photorealistic style. Happy expression, urban street background, romantic surprise.' },
    { id: 'dating-restaurant', prompt: 'Show the person from the photo having a romantic dinner date in a high-end restaurant. CRUCIAL: Preserve facial identity. Photorealistic style. Candlelight, wine glasses, holding hands across the table, intimate atmosphere.' },
    { id: 'dating-park', prompt: 'Show the person from the photo walking in a beautiful park with autumn leaves or spring blossoms. CRUCIAL: Keep the face exactly identical. Photorealistic style. Holding hands with partner, soft sunlight, romantic walk.' },
    { id: 'dating-rooftop', prompt: 'Show the person from the photo on a romantic date on a rooftop at sunset. CRUCIAL: Maintain exact facial identity. Photorealistic style. City skyline view, string lights, cozy blanket, drinking wine.' },
    { id: 'dating-picnic', prompt: 'Show the person from the photo having a romantic picnic on the grass. CRUCIAL: Preserve facial identity. Photorealistic style. Checkered blanket, fruit basket, wine, laughing, sunny day nature.' },
    { id: 'dating-beach', prompt: 'Show the person from the photo walking along the beach at sunset. CRUCIAL: Keep the face exactly identical. Photorealistic style. Barefoot, waves crashing, golden hour light, romantic silhouette.' },
    { id: 'dating-gift', prompt: 'Show the person from the photo holding a beautifully wrapped gift box with a bow. CRUCIAL: Maintain exact facial identity. Photorealistic style. Excited expression, party background or cozy home setting.' },
    { id: 'dating-cinema', prompt: 'Show the person from the photo on a date at the cinema. CRUCIAL: Preserve facial identity. Photorealistic style. Eating popcorn, watching a movie, cozy atmosphere, dim lighting.' },

    // --- PRANKS ---
    { id: 'prank-flood', prompt: 'Transform the room in the photo to look completely flooded with water. Reflections of furniture in the water, floating items, realistic disaster movie effect. Photorealistic.' },
    { id: 'prank-mistress', prompt: 'Add a mysterious silhouette of a sleeping woman under the blanket in the bed next to the viewer. Messy sheets, long hair visible on the pillow. Prank photo. Photorealistic.' },
    { id: 'prank-lover', prompt: 'Add a mysterious silhouette of a sleeping man under the blanket in the bed next to the viewer. Messy sheets, arm visible. Prank photo. Photorealistic.' },
    { id: 'prank-broken-screen', prompt: 'Add a realistic smashed screen effect with spiderweb cracks and glitching pixels to the TV or monitor screen in the photo. Photorealistic.' },
    { id: 'prank-arrest', prompt: 'Show the person from the photo in a police booking photo (mugshot). CRUCIAL: Preserve the facial features exactly. Photorealistic style, detailed natural skin texture. Holding a sign with numbers, height chart in the background, harsh lighting. Prank photo.' },
    { id: 'prank-bruises', prompt: 'Apply hyper-realistic Hollywood special effects makeup (SFX) to the person\'s face. Create a realistic black eye, bruises on the cheekbone, and a split lip effect. CRUCIAL: Preserve the underlying facial identity. Action movie aftermath style, detailed texture, cinematic lighting, visible pores.' },
    { id: 'prank-mess', prompt: 'Make the room look absolutely messy and chaotic. Clothes everywhere, spilled food, overturned chairs. "Party gone wrong" prank vibe. Photorealistic.' },
    { id: 'prank-animal-mess', prompt: 'Add a guilty-looking dog or cat sitting amidst a pile of torn white feathers from a destroyed pillow. Messy room prank. Photorealistic.' },
    { id: 'prank-kids-art', prompt: 'Add colorful crayon drawings and scribbles all over the walls and furniture. Messy kids playroom prank. Photorealistic.' },
    { id: 'prank-clown', prompt: 'Add a creepy clown face peering through the window or standing in a dark corner of the room. Spooky prank photo. Photorealistic.' },
    { id: 'prank-lottery', prompt: 'Show the person from the photo holding a giant lottery check with a huge amount of money written on it. CRUCIAL: Keep the face exactly identical. Photorealistic style. Confetti falling, excited expression, looking like a winner on TV.' },
    { id: 'prank-alien', prompt: 'Show the person from the photo being lifted off the ground by a bright green beam of light coming from a UFO saucer in the night sky. CRUCIAL: Keep the face recognizable. Sci-fi movie style, floating in air.' },
    { id: 'prank-ghost', prompt: 'Make the photo look spooky. Add a semi-transparent ghostly figure standing behind the person. Dim lighting, paranormal activity vibe, grainy horror movie texture.' },
    { id: 'prank-superpower', prompt: 'Show the person from the photo trying to use superpowers (like laser eyes or fire hands) but accidentally scorching their own clothes or the wall nearby. CRUCIAL: Keep the face recognizable. Funny superhero fail situation. smoke and char marks.' },
    { id: 'prank-time', prompt: 'Show the person from the photo stepping out of a glowing time travel portal or a futuristic DeLorean car. CRUCIAL: Keep the face exactly identical. Smoke, electricity sparks, wearing futuristic goggles or clothes mixed with normal ones.' },

    // --- MARKETPLACES ---
    { id: 'market-shopee-hero', prompt: 'Show the product from the input image standing prominently on a 3D podium in the center. Vibrant orange and yellow gradient background with flying 3D percent symbols, coins, and confetti. CRUCIAL: Preserve the product appearance exactly as in the original photo. Commercial studio lighting, 8k resolution, e-commerce sale style.' },
    { id: 'market-fb-minimal', prompt: 'Show the product from the input image placed on a clean minimalist surface. Soft pastel background colors (beige or sage green). Hard sunlight shadows (gobolight effect) of palm leaves falling on the product. CRUCIAL: Keep the product exactly identical. High-end lifestyle vibe.' },
    { id: 'market-insta-story', prompt: 'First-person POV shot. Show a hand holding the product from the input image against a blurred aesthetic coffee shop or city street background. CRUCIAL: Preserve the product exactly. Natural lighting, authentic influencer vibe, vertical composition.' },
    { id: 'market-cosmetic-water', prompt: 'Show the product from the input image floating in crystal clear water ripples or flowing silk texture. Soft pink or gold tones. Bokeh sparkles. CRUCIAL: Preserve the product appearance exactly. Fresh, hydrating, premium look. Commercial photography.' },
    { id: 'market-tech-neon', prompt: 'Show the product from the input image placed in a futuristic dark mode setting. Glowing neon blue and purple rim lighting on the product. Circuit board patterns or abstract geometric 3D shapes floating. CRUCIAL: Preserve the product exactly. Sleek, modern, high-tech vibe.' },
    { id: 'market-food-splash', prompt: 'Show the product from the input image surrounded by a fresh water or milk splash. Flying fresh fruits (lemon, strawberry, mint leaves) in the air around the product. CRUCIAL: Preserve the product exactly. Bright, energetic, juicy atmosphere. Solid bright color background.' },
    { id: 'market-glassmorphism', prompt: 'Show the product from the input image floating in front of frosted glass panels. Soft, multi-colored gradient orbs floating behind. CRUCIAL: Preserve the product exactly. Modern UI style, clean, 3D abstract art direction.' },
    { id: 'market-black-friday', prompt: 'Show the product from the input image on a dark black matte texture background. Glossy 3D black balloons and bold red neon lights around it. CRUCIAL: Preserve the product appearance exactly. Urgent, bold, premium discount vibe.' },
    { id: 'market-podium-nature', prompt: 'Show the product from the input image standing on a natural wooden log podium. Surrounded by real moss, stones, and ferns. CRUCIAL: Preserve the product exactly. Dappled forest sunlight. Organic, eco-friendly atmosphere.' },
    { id: 'market-fashion-studio', prompt: 'Show the product from the input image placed in a high-end fashion studio setting. Abstract architectural shapes (arches, stairs) in monochrome white or concrete. CRUCIAL: Preserve the product exactly. Soft diffused studio lighting, long shadows.' },
    { id: 'market-kitchen', prompt: 'Show the product from the input image placed on a clean marble kitchen countertop. Bright morning sunlight through the window, blurred modern kitchen interior in background. Fresh ingredients nearby. CRUCIAL: Preserve product details exactly. Photorealistic lifestyle photography.' },
    { id: 'market-bathroom', prompt: 'Show the product from the input image standing on a white ceramic bathroom sink shelf. Mirror reflection, soft steam, clean white towels in background. CRUCIAL: Preserve product details exactly. Spa atmosphere, fresh and clean.' },
    { id: 'market-office', prompt: 'Show the product from the input image placed on a wooden office desk next to a laptop and a cup of coffee. Warm desk lamp lighting, cozy productivity vibe. CRUCIAL: Preserve product details exactly. Photorealistic office setting.' },
    { id: 'market-gym', prompt: 'Show the product from the input image placed on a black rubber gym floor. Blurred gym equipment and dumbbells in the background. Dramatic sports lighting. CRUCIAL: Preserve product details exactly. Energetic, strong atmosphere.' },
    { id: 'market-silk', prompt: 'Show the product from the input image lying on luxurious draped red or champagne colored silk fabric. Soft elegant folds, expensive studio lighting. CRUCIAL: Preserve product details exactly. Jewelry store advertisement style.' },
    { id: 'market-autumn-cozy', prompt: 'Show the product from the input image placed on a soft knitted beige scarf. Red and orange autumn maple leaves falling around. Steam rising from the product (if appropriate). Warm golden hour backlight. Detailed texture. Marketplace card style.' },
    { id: 'market-fresh-avocado', prompt: 'Show the product from the input image centered, surrounded by fresh flying water splashes and green avocado slices. Tropical monstera leaves in the background. Bright gradient green background. Freshness and hydration concept. Commercial cosmetic photography.' },
    { id: 'market-tech-specs', prompt: 'Show the product from the input image in a high-tech setting. Dark background with glowing blue technical lines and floating HUD interface elements (battery icon, wifi icon, temperature). Sleek, modern, premium electronics presentation. 3D render style.' },
    { id: 'market-sale-banner', prompt: 'Show the product from the input image on a vibrant yellow and red background. 3D percent signs (%) and red "Sale" tags floating around. High contrast, bold commercial lighting. Attention grabbing design for clearance sales.' },
    { id: 'market-eco-bamboo', prompt: 'Show the product from the input image standing on a bamboo mat. Green bamboo stalks and smooth zen stones in the background. Soft daylight. Natural, organic, eco-friendly product presentation. Spa and wellness vibe.' },

    // --- RESTAURANTS ---
    { id: 'restaurant-michelin', prompt: 'Professional food photography, fine dining style. Elegant dark plating, tweezers precision, dramatic moody lighting, white tablecloth. Photorealistic.' },
    { id: 'restaurant-full', prompt: 'Show the dish on a table in a bustling, crowded restaurant. Blurred background of happy customers chatting and eating. Warm, lively atmosphere. Photorealistic.' },
    { id: 'restaurant-terrace', prompt: 'Food photography on an outdoor restaurant terrace. Bright sunlight, dappled shadows from trees, summer vibe, glass of lemonade nearby. Photorealistic.' },
    { id: 'restaurant-romantic', prompt: 'Romantic dinner setting. Dim warm lighting, candles on the table, two glasses of red wine, bokeh background. Intimate atmosphere. Photorealistic.' },
    { id: 'restaurant-chef', prompt: 'Close up of a professional chef in a white uniform holding the plate with the dish towards the camera. Commercial kitchen background. Photorealistic.' },
    { id: 'restaurant-steam', prompt: 'Appetizing food photography with visible steam rising from the hot dish. Fresh ingredients, macro shot, shallow depth of field. Photorealistic.' },
    { id: 'restaurant-burger', prompt: 'Juicy fast food photography. Dark wooden table, craft paper, neon sign in background. Greasy, delicious, dynamic angle. Photorealistic.' },
    { id: 'restaurant-breakfast', prompt: 'Morning breakfast setting. Bright airy light, cup of coffee with latte art, newspaper, fresh flowers on a white marble table. Photorealistic.' },
    { id: 'restaurant-asian', prompt: 'Asian cuisine styling. Slate plate, chopsticks, bamboo mat, steam, dark moody lighting with red accents. Photorealistic.' },
    { id: 'restaurant-flatlay', prompt: 'Flat lay top-down view of a table full of different dishes. Feast style, shared plates, beautiful composition for a menu cover. Photorealistic.' },

    // --- SPORTS ---
    { id: 'sports-karate', prompt: 'Show the person from the photo dressed in a clean white karate gi with a black belt, performing a dynamic martial arts kick. CRUCIAL: Keep the face exactly identical to the original photo. Photorealistic style, detailed skin texture. Background: traditional Japanese dojo with tatami mats.' },
    { id: 'sports-tennis', prompt: 'Show the person from the photo dressed in professional tennis sportswear holding a racket. CRUCIAL: Preserve the facial features exactly. Photorealistic style. Ready to serve on a clay tennis court. Sunny day, dynamic action pose.' },
    { id: 'sports-fit-girl', prompt: 'Enhance the physique of the person from the photo to look like a fitness model. Toned athletic body, defined abs, wearing stylish gym activewear. CRUCIAL: Keep the face completely unchanged and recognizable. Photorealistic style, detailed natural skin texture, visible pores. Professional fitness photography in a modern gym.' },
    { id: 'sports-fit-guy', prompt: 'Enhance the physique of the person from the photo to look like a fitness model. Muscular definition, broad shoulders, six-pack abs, athletic build. CRUCIAL: Maintain the exact facial identity. Photorealistic style, detailed skin texture. Gym setting with dramatic lighting.' },
    { id: 'sports-olympia', prompt: 'Transform the person from the photo into a Mr. Olympia bodybuilding champion body type while keeping the face exactly as is in the original photo. CRUCIAL: Preserve facial identity. Photorealistic style, detailed skin texture. Extreme muscle mass, veins, definition, stage tan, posing trunks, bright stage lighting.' },
    { id: 'sports-running', prompt: 'Show the person from the photo running in a park or on a track, wearing professional running gear. CRUCIAL: Preserve the face exactly. Photorealistic style. Motion blur background, athletic determination, morning sunlight.' },
    { id: 'sports-boxing', prompt: 'Show the person from the photo wearing boxing gloves and shorts, standing in a boxing ring. CRUCIAL: Keep the face exactly identical. Photorealistic style, detailed skin texture. Sweat on skin, intense look, dramatic arena lighting.' },
    { id: 'sports-yoga', prompt: 'Show the person from the photo doing a yoga pose on a mat in a peaceful studio or nature setting at sunset. CRUCIAL: Maintain exact facial identity. Photorealistic style. Flexibility, calm atmosphere, athletic yoga wear.' },
    { id: 'sports-swimming', prompt: 'Show the person from the photo as a swimmer in a pool wearing goggles and cap, emerging from the water. CRUCIAL: Preserve facial identity. Photorealistic style. Water droplets, athletic shoulders.' },
    { id: 'sports-soccer', prompt: 'Show the person from the photo wearing a soccer jersey and cleats, dribbling a ball on a large green stadium field at night. CRUCIAL: Keep the face unchanged. Photorealistic style. Floodlights background.' },

    // --- DOCUMENTS ---
    { id: 'passport', prompt: 'Generate a professional passport photo of the person from the uploaded image. CRUCIAL: Keep the face exactly identical to the original photo. Do not alter facial features. Apply a clean, even white background. Soft, balanced lighting, formal appearance. Photorealistic style, detailed skin texture.' },
    { id: 'resume-office', prompt: 'Show the person from the photo in a professional business suit. CRUCIAL: Maintain exact facial identity. Background: blurred modern office environment. Soft professional lighting, confident look. Photorealistic style, detailed skin texture.' },
    { id: 'resume-studio', prompt: 'Studio business portrait of the person from the photo. CRUCIAL: Do not change the face. Keep facial features exactly as in the original. Neutral grey gradient background. Rembrandt lighting. Photorealistic style, detailed skin texture.' },

    // --- KIDS ---
    { id: 'kids-roblox', prompt: 'Turn the person into a 3D Roblox character style. Plastic texture, blocky body, friendly face. Background: colorful obby parkour.' },
    { id: 'kids-lego', prompt: 'Turn the person into a realistic 3D LEGO minifigure. Plastic glossy texture, c-shaped hands. Background: lego city.' },
    { id: 'kids-minecraft', prompt: 'Turn the person into a Minecraft voxel character. Square head, pixelated texture. Background: blocky landscape with trees.' },
    { id: 'kids-stalcraft', prompt: 'Turn the person into a Stalcraft game character. Minecraft style cubic body but wearing tactical stalker gear, gas mask, dark atmosphere. Background: exclusion zone.' },
    { id: 'superhero', prompt: 'Turn child into a superhero. Cape, futuristic suit. Background: night city lights. CRUCIAL: Preserve facial identity. Photorealistic style.' },
    { id: 'fairy', prompt: 'Add transparent fairy wings. Background: magical forest with giant flowers and fireflies. CRUCIAL: Preserve facial identity. Photorealistic style.' },
    { id: 'astronaut', prompt: 'Dress child in astronaut space suit. Background: outer space, stars, planets. CRUCIAL: Keep the face recognizable. Photorealistic style.' },
    { id: 'harry-potter', prompt: 'Dress child as wizard student. Gryffindor scarf, wand. Background: magical castle. CRUCIAL: Preserve facial identity. Photorealistic style.' },
    { id: 'kids-dinosaur', prompt: 'Show the child from the photo wearing a cute green dinosaur costume (onesie). CRUCIAL: Preserve facial identity exactly. Photorealistic style. Background: prehistoric jungle with cartoon-style volcano. Happy expression.' },
    { id: 'kids-princess', prompt: 'Show the child from the photo wearing a beautiful sparkling princess dress and a tiara. CRUCIAL: Maintain exact facial identity. Photorealistic style. Background: magical fairy tale castle ballroom. Soft pink and gold lighting.' },
    { id: 'kids-chef', prompt: 'Show the child from the photo wearing a tiny chef uniform and hat, holding a wooden spoon. CRUCIAL: Keep the face recognizable. Photorealistic style. Background: messy kitchen with flour and dough. Cute and funny.' },
    { id: 'kids-pilot', prompt: 'Show the child from the photo wearing a vintage aviator hat and goggles, sitting in a cardboard or toy airplane. CRUCIAL: Preserve facial identity. Photorealistic style. Background: blue sky with fluffy clouds.' },
    { id: 'kids-firefighter', prompt: 'Show the child from the photo wearing a firefighter costume and helmet, holding a toy hose. CRUCIAL: Maintain exact facial identity. Photorealistic style. Background: fire station with red truck.' },
    { id: 'kids-explorer', prompt: 'Show the child from the photo dressed as a safari explorer with binoculars and a hat. CRUCIAL: Keep the face recognizable. Photorealistic style. Background: jungle with friendly animals (parrot, monkey).' },
    { id: 'kids-doctor', prompt: 'Show the child from the photo wearing a small white doctor coat and stethoscope. CRUCIAL: Preserve facial identity. Photorealistic style. Background: hospital or clinic setting with teddy bear patient.' },
    { id: 'kids-racer', prompt: 'Show the child from the photo wearing a racing suit and holding a helmet. CRUCIAL: Maintain exact facial identity. Photorealistic style. Background: race track with race cars.' },
    { id: 'kids-pirate', prompt: 'Show the child from the photo dressed as a pirate with a hat and eye patch (optional). CRUCIAL: Keep the face recognizable. Photorealistic style. Background: pirate ship deck, ocean, treasure chest.' },
    { id: 'kids-detective', prompt: 'Show the child from the photo wearing a trench coat and holding a magnifying glass. CRUCIAL: Preserve facial identity. Photorealistic style. Background: mystery library.' },
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
    console.log(`🚀 Starting Bulk Template Generation (${TEMPLATES.length} templates)...`);
    for (const template of TEMPLATES) {
        await generateAndSave(template);
    }
    console.log('🏁 Process Finished.');
})();
