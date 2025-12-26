
import React from 'react';
import { Preset, CategoryId } from '../types';
import { Sparkles, ArrowRight } from 'lucide-react';

interface TemplateGridProps {
  category: CategoryId;
  onSelect: (preset: Preset) => void;
}

// Fallback images map in case generation fails
const FALLBACK_IMAGES: Record<string, string> = {
  formula1: 'https://images.unsplash.com/photo-1574786198875-49f5d09fd272?auto=format&fit=crop&w=400&q=60',
  christmas: 'https://images.unsplash.com/photo-1543589077-47d81606c1bf?auto=format&fit=crop&w=400&q=60',
  tet: 'https://images.unsplash.com/photo-1548625361-1eb84c9f6d1d?auto=format&fit=crop&w=400&q=60',
  wedding: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=60',
  family: 'https://images.unsplash.com/photo-1609220136736-443140cffec6?auto=format&fit=crop&w=400&q=60',
  kids: 'https://images.unsplash.com/photo-1519456264917-42d0aa2e0625?auto=format&fit=crop&w=400&q=60',
  documents: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=60',
  ecommerce: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=60',
  fashion: 'https://images.unsplash.com/photo-1509631179647-b849389274e9?auto=format&fit=crop&w=400&q=60',
  makeup: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=400&q=60',
  business: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=60',
  ugc: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?auto=format&fit=crop&w=400&q=60',
  bloggers: 'https://images.unsplash.com/photo-1478737270239-2f02b77ac6d5?auto=format&fit=crop&w=400&q=60',
  rich_life: 'https://images.unsplash.com/photo-1559523161-0fc0d8b3c6b7?auto=format&fit=crop&w=400&q=60',
  restaurants: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=60',
  marketplaces: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=60',
  sports: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=400&q=60',
  dating: 'https://images.unsplash.com/photo-1516585427167-9f4af9627e6c?auto=format&fit=crop&w=400&q=60',
  pranks: 'https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?auto=format&fit=crop&w=400&q=60',
  style_trends: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=400&q=60',
  business_print: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=400&q=60',
  default: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=60'
};

// Helper to generate safe, encoded URLs for AI previews
const getPreviewUrl = (prompt: string, seed: number) => {
  const encodedPrompt = encodeURIComponent(prompt);
  // Using turbo for speed and reliability, v=5 for cache busting
  return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=400&height=500&seed=${seed}&nologo=true&model=turbo&v=5`;
};

// Data source for all templates with specific visual descriptions for previews
export const ALL_PRESETS: Preset[] = [
  // --- MARKETPLACES & SOCIAL ADS (UPDATED PROMPTS FOR BETTER PRODUCT PLACEMENT) ---
  {
    id: 'market-shopee-hero',
    category: 'marketplaces',
    title: 'Маркетплейс (Подиум)',
    description: '3D презентация товара',
    prompt: 'Show the product from the input image standing prominently on a 3D podium in the center. Vibrant orange and yellow gradient background with flying 3D percent symbols, coins, and confetti. CRUCIAL: Preserve the product appearance exactly as in the original photo. Commercial studio lighting, 8k resolution, e-commerce sale style.',
    image: getPreviewUrl('shopee product background 3d podium orange vibrant coins', 1201)
  },
  {
    id: 'market-fb-minimal',
    category: 'marketplaces',
    title: 'Facebook Реклама',
    description: 'Минимализм',
    prompt: 'Show the product from the input image placed on a clean minimalist surface. Soft pastel background colors (beige or sage green). Hard sunlight shadows (gobolight effect) of palm leaves falling on the product. CRUCIAL: Keep the product exactly identical. High-end lifestyle vibe.',
    image: getPreviewUrl('minimalist product background sunlight leaf shadows pastel', 1202)
  },
  {
    id: 'market-insta-story',
    category: 'marketplaces',
    title: 'Instagram Stories',
    description: 'POV в руке',
    prompt: 'First-person POV shot. Show a hand holding the product from the input image against a blurred aesthetic coffee shop or city street background. CRUCIAL: Preserve the product exactly. Natural lighting, authentic influencer vibe, vertical composition.',
    image: getPreviewUrl('hand holding invisible product blurred city background pov', 1203)
  },
  {
    id: 'market-cosmetic-water',
    category: 'marketplaces',
    title: 'Косметика (Luxury)',
    description: 'Текстура воды/шелка',
    prompt: 'Show the product from the input image floating in crystal clear water ripples or flowing silk texture. Soft pink or gold tones. Bokeh sparkles. CRUCIAL: Preserve the product appearance exactly. Fresh, hydrating, premium look. Commercial photography.',
    image: getPreviewUrl('luxury cosmetic background water ripples silk pink gold', 1204)
  },
  {
    id: 'market-tech-neon',
    category: 'marketplaces',
    title: 'Техно Неон',
    description: 'Cyberpunk & Игры',
    prompt: 'Show the product from the input image placed in a futuristic dark mode setting. Glowing neon blue and purple rim lighting on the product. Circuit board patterns or abstract geometric 3D shapes floating. CRUCIAL: Preserve the product exactly. Sleek, modern, high-tech vibe.',
    image: getPreviewUrl('tech product background dark neon blue circuit', 1205)
  },
  {
    id: 'market-food-splash',
    category: 'marketplaces',
    title: 'Еда и Напитки',
    description: 'Свежесть и брызги',
    prompt: 'Show the product from the input image surrounded by a fresh water or milk splash. Flying fresh fruits (lemon, strawberry, mint leaves) in the air around the product. CRUCIAL: Preserve the product exactly. Bright, energetic, juicy atmosphere. Solid bright color background.',
    image: getPreviewUrl('food advertising background water splash flying fruit', 1206)
  },
  {
    id: 'market-glassmorphism',
    category: 'marketplaces',
    title: 'Стекломорфизм',
    description: 'Современный UI фон',
    prompt: 'Show the product from the input image floating in front of frosted glass panels. Soft, multi-colored gradient orbs floating behind. CRUCIAL: Preserve the product exactly. Modern UI style, clean, 3D abstract art direction.',
    image: getPreviewUrl('glassmorphism background frosted glass gradient orbs 3d', 1207)
  },
  {
    id: 'market-black-friday',
    category: 'marketplaces',
    title: 'Черная Пятница',
    description: 'Распродажа',
    prompt: 'Show the product from the input image on a dark black matte texture background. Glossy 3D black balloons and bold red neon lights around it. CRUCIAL: Preserve the product appearance exactly. Urgent, bold, premium discount vibe.',
    image: getPreviewUrl('black friday sale background balloons red neon', 1208)
  },
  {
    id: 'market-podium-nature',
    category: 'marketplaces',
    title: 'Эко Подиум',
    description: 'Дерево и зелень',
    prompt: 'Show the product from the input image standing on a natural wooden log podium. Surrounded by real moss, stones, and ferns. CRUCIAL: Preserve the product exactly. Dappled forest sunlight. Organic, eco-friendly atmosphere.',
    image: getPreviewUrl('nature product podium wood moss forest sunlight', 1209)
  },
  {
    id: 'market-fashion-studio',
    category: 'marketplaces',
    title: 'Фэшн Студия',
    description: 'Абстрактный фон',
    prompt: 'Show the product from the input image placed in a high-end fashion studio setting. Abstract architectural shapes (arches, stairs) in monochrome white or concrete. CRUCIAL: Preserve the product exactly. Soft diffused studio lighting, long shadows.',
    image: getPreviewUrl('fashion studio background abstract architecture white concrete', 1210)
  },
  
  // --- NEW MARKETPLACE PRESETS (General) ---
  {
    id: 'market-kitchen',
    category: 'marketplaces',
    title: 'На кухне',
    description: 'Уютный интерьер',
    prompt: 'Show the product from the input image placed on a clean marble kitchen countertop. Bright morning sunlight through the window, blurred modern kitchen interior in background. Fresh ingredients nearby. CRUCIAL: Preserve product details exactly. Photorealistic lifestyle photography.',
    image: getPreviewUrl('product on kitchen counter marble sunny', 1211)
  },
  {
    id: 'market-bathroom',
    category: 'marketplaces',
    title: 'Ванная / SPA',
    description: 'Для ухода',
    prompt: 'Show the product from the input image standing on a white ceramic bathroom sink shelf. Mirror reflection, soft steam, clean white towels in background. CRUCIAL: Preserve product details exactly. Spa atmosphere, fresh and clean.',
    image: getPreviewUrl('bathroom sink product shelf spa towels', 1212)
  },
  {
    id: 'market-office',
    category: 'marketplaces',
    title: 'Рабочий стол',
    description: 'Офис и Гаджеты',
    prompt: 'Show the product from the input image placed on a wooden office desk next to a laptop and a cup of coffee. Warm desk lamp lighting, cozy productivity vibe. CRUCIAL: Preserve product details exactly. Photorealistic office setting.',
    image: getPreviewUrl('office desk product laptop coffee', 1213)
  },
  {
    id: 'market-gym',
    category: 'marketplaces',
    title: 'Фитнес зал',
    description: 'Спорт товары',
    prompt: 'Show the product from the input image placed on a black rubber gym floor. Blurred gym equipment and dumbbells in the background. Dramatic sports lighting. CRUCIAL: Preserve product details exactly. Energetic, strong atmosphere.',
    image: getPreviewUrl('gym floor product dumbbells background', 1214)
  },
  {
    id: 'market-silk',
    category: 'marketplaces',
    title: 'Шелк и Роскошь',
    description: 'Ювелирный стиль',
    prompt: 'Show the product from the input image lying on luxurious draped red or champagne colored silk fabric. Soft elegant folds, expensive studio lighting. CRUCIAL: Preserve product details exactly. Jewelry store advertisement style.',
    image: getPreviewUrl('luxury silk fabric product background red', 1215)
  },

  // --- NEW: MARKETPLACE INFOGRAPHICS & SPECIFIC STYLES ---
  {
    id: 'market-autumn-cozy',
    category: 'marketplaces',
    title: 'Осенний Уют',
    description: 'Тепло и стиль',
    prompt: 'Show the product from the input image placed on a soft knitted beige scarf. Red and orange autumn maple leaves falling around. Steam rising from the product (if appropriate). Warm golden hour backlight. Detailed texture. Marketplace card style. Ideal for thermos, mugs, warm clothing.',
    image: getPreviewUrl('thermos on knitted scarf autumn leaves steam', 1216)
  },
  {
    id: 'market-fresh-avocado',
    category: 'marketplaces',
    title: 'Свежесть & Авокадо',
    description: 'Бьюти инфографика',
    prompt: 'Show the product from the input image centered, surrounded by fresh flying water splashes and green avocado slices. Tropical monstera leaves in the background. Bright gradient green background. Freshness and hydration concept. Commercial cosmetic photography.',
    image: getPreviewUrl('cosmetic jar water splash avocado monstera green', 1217)
  },
  {
    id: 'market-tech-specs',
    category: 'marketplaces',
    title: 'Умный Гаджет',
    description: 'Технический стиль',
    prompt: 'Show the product from the input image in a high-tech setting. Dark background with glowing blue technical lines and floating HUD interface elements (battery icon, wifi icon, temperature). Sleek, modern, premium electronics presentation. 3D render style.',
    image: getPreviewUrl('smart gadget dark background blue neon hud icons', 1218)
  },
  {
    id: 'market-sale-banner',
    category: 'marketplaces',
    title: 'Супер Цена',
    description: 'Яркий акцент',
    prompt: 'Show the product from the input image on a vibrant yellow and red background. 3D percent signs (%) and red "Sale" tags floating around. High contrast, bold commercial lighting. Attention grabbing design for clearance sales.',
    image: getPreviewUrl('product on yellow red background sale tags 3d', 1219)
  },
  {
    id: 'market-eco-bamboo',
    category: 'marketplaces',
    title: 'Эко Бамбук',
    description: 'Натуральность',
    prompt: 'Show the product from the input image standing on a bamboo mat. Green bamboo stalks and smooth zen stones in the background. Soft daylight. Natural, organic, eco-friendly product presentation. Spa and wellness vibe.',
    image: getPreviewUrl('product on bamboo mat zen stones green', 1220)
  },

  // --- KIDS CATEGORY ---
  {
    id: 'kids-roblox',
    category: 'kids',
    title: 'Стиль Roblox',
    description: 'Мир блоков',
    prompt: 'Turn the person into a 3D Roblox character style. Plastic texture, blocky body, friendly face. Background: colorful obby parkour.',
    image: getPreviewUrl('roblox character 3d avatar', 410)
  },
  {
    id: 'kids-lego',
    category: 'kids',
    title: 'LEGO',
    description: 'Конструктор',
    prompt: 'Turn the person into a realistic 3D LEGO minifigure. Plastic glossy texture, c-shaped hands. Background: lego city.',
    image: getPreviewUrl('lego minifigure toy person', 411)
  },
  {
    id: 'kids-minecraft',
    category: 'kids',
    title: 'Minecraft',
    description: 'Пиксели',
    prompt: 'Turn the person into a Minecraft voxel character. Square head, pixelated texture. Background: blocky landscape with trees.',
    image: getPreviewUrl('minecraft character steve 3d voxel', 412)
  },
  {
    id: 'kids-stalcraft',
    category: 'kids',
    title: 'Stalcraft',
    description: 'Кубический воин',
    prompt: 'Turn the person into a Stalcraft game character. Minecraft style cubic body but wearing tactical stalker gear, gas mask, dark atmosphere. Background: exclusion zone.',
    image: getPreviewUrl('minecraft soldier gas mask stalker', 413)
  },
  {
    id: 'superhero',
    category: 'kids',
    title: 'Супергерой',
    description: 'Плащ и маска',
    prompt: 'Turn child into a superhero. Cape, futuristic suit. Background: night city lights. CRUCIAL: Preserve facial identity. Photorealistic style.',
    image: getPreviewUrl('kid superhero cape night city', 401)
  },
  {
    id: 'fairy',
    category: 'kids',
    title: 'Фея',
    description: 'Волшебный лес',
    prompt: 'Add transparent fairy wings. Background: magical forest with giant flowers and fireflies. CRUCIAL: Preserve facial identity. Photorealistic style.',
    image: getPreviewUrl('little girl fairy wings magic forest', 402)
  },
  {
    id: 'astronaut',
    category: 'kids',
    title: 'Космонавт',
    description: 'Открытый космос',
    prompt: 'Dress child in astronaut space suit. Background: outer space, stars, planets. CRUCIAL: Keep the face recognizable. Photorealistic style.',
    image: getPreviewUrl('kid astronaut space suit stars', 403)
  },
  {
    id: 'harry-potter',
    category: 'kids',
    title: 'Волшебник',
    description: 'Хогвартс',
    prompt: 'Dress child as wizard student. Gryffindor scarf, wand. Background: magical castle. CRUCIAL: Preserve facial identity. Photorealistic style.',
    image: getPreviewUrl('boy wizard glasses magic wand', 404)
  },
  {
    id: 'kids-dinosaur',
    category: 'kids',
    title: 'Динозаврик',
    description: 'Веселый костюм',
    prompt: 'Show the child from the photo wearing a cute green dinosaur costume (onesie). CRUCIAL: Preserve facial identity exactly. Photorealistic style. Background: prehistoric jungle with cartoon-style volcano. Happy expression.',
    image: getPreviewUrl('kid in dinosaur costume jungle', 420)
  },
  {
    id: 'kids-princess',
    category: 'kids',
    title: 'Принцесса',
    description: 'Сказочный замок',
    prompt: 'Show the child from the photo wearing a beautiful sparkling princess dress and a tiara. CRUCIAL: Maintain exact facial identity. Photorealistic style. Background: magical fairy tale castle ballroom. Soft pink and gold lighting.',
    image: getPreviewUrl('little girl princess dress castle', 421)
  },
  {
    id: 'kids-chef',
    category: 'kids',
    title: 'Шеф-повар',
    description: 'Готовим',
    prompt: 'Show the child from the photo wearing a tiny chef uniform and hat, holding a wooden spoon. CRUCIAL: Keep the face recognizable. Photorealistic style. Background: messy kitchen with flour and dough. Cute and funny.',
    image: getPreviewUrl('kid chef cooking kitchen mess', 422)
  },
  {
    id: 'kids-pilot',
    category: 'kids',
    title: 'Пилот',
    description: 'Самолет',
    prompt: 'Show the child from the photo wearing a vintage aviator hat and goggles, sitting in a cardboard or toy airplane. CRUCIAL: Preserve facial identity. Photorealistic style. Background: blue sky with fluffy clouds.',
    image: getPreviewUrl('kid pilot aviator goggles airplane', 423)
  },
  {
    id: 'kids-firefighter',
    category: 'kids',
    title: 'Пожарный',
    description: 'Герой',
    prompt: 'Show the child from the photo wearing a firefighter costume and helmet, holding a toy hose. CRUCIAL: Maintain exact facial identity. Photorealistic style. Background: fire station with red truck.',
    image: getPreviewUrl('kid firefighter costume red truck', 424)
  },
  {
    id: 'kids-explorer',
    category: 'kids',
    title: 'Исследователь',
    description: 'Джунгли',
    prompt: 'Show the child from the photo dressed as a safari explorer with binoculars and a hat. CRUCIAL: Keep the face recognizable. Photorealistic style. Background: jungle with friendly animals (parrot, monkey).',
    image: getPreviewUrl('kid safari explorer jungle animals', 425)
  },
  {
    id: 'kids-doctor',
    category: 'kids',
    title: 'Доктор',
    description: 'Будущее',
    prompt: 'Show the child from the photo wearing a small white doctor coat and stethoscope. CRUCIAL: Preserve facial identity. Photorealistic style. Background: hospital or clinic setting with teddy bear patient.',
    image: getPreviewUrl('kid doctor stethoscope teddy bear', 426)
  },
  {
    id: 'kids-racer',
    category: 'kids',
    title: 'Гонщик',
    description: 'Болид',
    prompt: 'Show the child from the photo wearing a racing suit and holding a helmet. CRUCIAL: Maintain exact facial identity. Photorealistic style. Background: race track with race cars.',
    image: getPreviewUrl('kid race car driver track', 427)
  },
  {
    id: 'kids-pirate',
    category: 'kids',
    title: 'Пират',
    description: 'Остров сокровищ',
    prompt: 'Show the child from the photo dressed as a pirate with a hat and eye patch (optional). CRUCIAL: Keep the face recognizable. Photorealistic style. Background: pirate ship deck, ocean, treasure chest.',
    image: getPreviewUrl('kid pirate costume ship treasure', 428)
  },
  {
    id: 'kids-detective',
    category: 'kids',
    title: 'Детектив',
    description: 'Расследование',
    prompt: 'Show the child from the photo wearing a trench coat and holding a magnifying glass. CRUCIAL: Preserve facial identity. Photorealistic style. Background: mystery library.',
    image: getPreviewUrl('kid detective magnifying glass', 429)
  },

  // --- MAKEUP CATEGORY ---
  {
    id: 'makeup-nude',
    category: 'makeup',
    title: 'Естественный',
    description: 'Нюд макияж',
    prompt: 'Apply a natural "no-makeup" makeup look to the person. Glowing skin, light mascara, clear gloss, neat eyebrows, soft peach blush. CRUCIAL: Keep the face completely recognizable. Photorealistic style, detailed skin texture.',
    image: getPreviewUrl('woman face natural makeup glow skin', 701)
  },
  {
    id: 'makeup-hollywood',
    category: 'makeup',
    title: 'Голливуд',
    description: 'Красная помада',
    prompt: 'Apply classic Hollywood makeup. Bright red lipstick, black winged eyeliner, perfect matte skin, defined lashes. CRUCIAL: Preserve the facial features exactly. Photorealistic style, detailed skin texture.',
    image: getPreviewUrl('woman face red lipstick hollywood style', 702)
  },
  {
    id: 'makeup-smokey',
    category: 'makeup',
    title: 'Smokey Eyes',
    description: 'Вечерний',
    prompt: 'Apply dramatic black smokey eye makeup, nude matte lips, and defined cheekbone contouring. CRUCIAL: Maintain exact facial identity. Photorealistic style.',
    image: getPreviewUrl('woman face smokey eyes makeup', 703)
  },
  {
    id: 'makeup-euphoria',
    category: 'makeup',
    title: 'Эйфория',
    description: 'Стразы и блестки',
    prompt: 'Apply creative Euphoria-style makeup with glitter, face gems near eyes, and purple/blue eyeshadows. CRUCIAL: Keep the face exactly identical. Photorealistic style.',
    image: getPreviewUrl('woman face glitter makeup euphoria style', 704)
  },
  {
    id: 'makeup-kbeauty',
    category: 'makeup',
    title: 'K-Beauty',
    description: 'Корейский стиль',
    prompt: 'Apply Korean beauty style makeup. Glass skin effect, gradient fruit-colored lips, soft straight brows, coral blush. CRUCIAL: Preserve facial identity. Photorealistic style.',
    image: getPreviewUrl('korean woman face glass skin makeup', 705)
  },
  {
    id: 'makeup-goth',
    category: 'makeup',
    title: 'Готика',
    description: 'Темный стиль',
    prompt: 'Apply gothic makeup style. Dark burgundy or black lipstick, pale skin, heavy black eyeliner, grunge aesthetic. CRUCIAL: Maintain exact facial identity. Photorealistic style.',
    image: getPreviewUrl('woman goth makeup black lipstick', 706)
  },
  {
    id: 'makeup-instaglam',
    category: 'makeup',
    title: 'Инста Глэм',
    description: 'Контуринг',
    prompt: 'Apply full glam Instagram makeup. Heavy contouring, baking, cut crease eyeshadow, matte liquid lipstick, long false lashes. CRUCIAL: Keep the face recognizable. Photorealistic style.',
    image: getPreviewUrl('woman heavy contour makeup instagram style', 707)
  },
  {
    id: 'makeup-cyberpunk',
    category: 'makeup',
    title: 'Киберпанк',
    description: 'Неон',
    prompt: 'Apply futuristic cyberpunk makeup. Neon graphic eyeliner, metallic highlighter on cheekbones, silver lip gloss. CRUCIAL: Preserve facial identity. Photorealistic style.',
    image: getPreviewUrl('woman face neon eyeliner cyberpunk makeup', 708)
  },
  {
    id: 'makeup-sunkissed',
    category: 'makeup',
    title: 'Поцелуй солнца',
    description: 'Веснушки',
    prompt: 'Apply a sunkissed makeup look. Bronzer, warm blush across nose, faux freckles, golden highlighter. CRUCIAL: Maintain exact facial identity. Photorealistic style.',
    image: getPreviewUrl('woman face freckles sunkissed makeup', 709)
  },
  {
    id: 'makeup-vamp',
    category: 'makeup',
    title: 'Вамп',
    description: 'Соблазн',
    prompt: 'Apply a dark seductive vamp look. Sharp contour, dark red lips, intense gaze, slight smokey eye. CRUCIAL: Keep the face exactly identical. Photorealistic style.',
    image: getPreviewUrl('woman vampire makeup dark red lips', 710)
  },
  {
    id: 'makeup-bridal',
    category: 'makeup',
    title: 'Невеста',
    description: 'Свадебный',
    prompt: 'Apply soft, romantic bridal makeup to the person. Glowing skin, soft pink blush, defined lashes, nude glossy lips. CRUCIAL: Preserve facial identity exactly. Photorealistic style, detailed natural skin texture. White veil background hint.',
    image: getPreviewUrl('bridal makeup woman soft glow veil', 711)
  },
  {
    id: 'makeup-festival',
    category: 'makeup',
    title: 'Фестиваль',
    description: 'Коачелла',
    prompt: 'Apply colorful festival makeup. Face jewels, glitter on cheeks, bright eyeshadow accents. CRUCIAL: Maintain exact facial identity. Photorealistic style. Boho chic vibe.',
    image: getPreviewUrl('festival makeup coachella glitter', 712)
  },
  {
    id: 'makeup-retro-50s',
    category: 'makeup',
    title: 'Ретро 50-е',
    description: 'Пин-ап',
    prompt: 'Apply 1950s pin-up style makeup. Defined brows, winged eyeliner, bold matte red lipstick. CRUCIAL: Keep the face recognizable. Photorealistic style. Vintage aesthetic.',
    image: getPreviewUrl('50s pinup makeup red lip winged liner', 713)
  },
  {
    id: 'makeup-neon-graphic',
    category: 'makeup',
    title: 'Неон Графика',
    description: 'Арт-макияж',
    prompt: 'Apply graphic neon eyeliner designs in bright green or pink. Minimalist skin, bold eyes. CRUCIAL: Preserve facial identity. Photorealistic style. Edgy modern look.',
    image: getPreviewUrl('graphic neon eyeliner makeup artistic', 714)
  },
  {
    id: 'makeup-soft-glam',
    category: 'makeup',
    title: 'Софт Глэм',
    description: 'Легкий вечерний',
    prompt: 'Apply soft glam makeup. Neutral eyeshadow tones, shimmery lid, glossy lips, soft contour. CRUCIAL: Maintain exact facial identity. Photorealistic style. Perfect for date night.',
    image: getPreviewUrl('soft glam makeup neutral tones', 715)
  },
  {
    id: 'makeup-fantasy-mermaid',
    category: 'makeup',
    title: 'Русалка',
    description: 'Фэнтези',
    prompt: 'Apply fantasy mermaid makeup. Iridescent scales on cheekbones, blue and purple hues, wet look skin. CRUCIAL: Keep the face recognizable. Photorealistic style. Aquatic vibe.',
    image: getPreviewUrl('mermaid makeup scales iridescent', 716)
  },
  {
    id: 'makeup-editorial-avantgarde',
    category: 'makeup',
    title: 'Авангард',
    description: 'Высокая мода',
    prompt: 'Apply avant-garde editorial makeup. Unique shapes, bold colors, artistic expression. CRUCIAL: Preserve facial identity. Photorealistic style. High fashion magazine look.',
    image: getPreviewUrl('avant garde makeup artistic high fashion', 717)
  },
  {
    id: 'makeup-grunge-90s',
    category: 'makeup',
    title: 'Гранж 90-х',
    description: 'Рок-стиль',
    prompt: 'Apply 90s grunge makeup. Smudged black eyeliner, matte brown lipstick, matte skin. CRUCIAL: Maintain exact facial identity. Photorealistic style. Rock chic vibe.',
    image: getPreviewUrl('90s grunge makeup smudged liner', 718)
  },
  {
    id: 'makeup-glass-skin',
    category: 'makeup',
    title: 'Glass Skin',
    description: 'Сияние',
    prompt: 'Focus on perfect "Glass Skin" makeup. Ultra-hydrated, dewy, reflective skin texture, minimal eye makeup. CRUCIAL: Keep the face recognizable. Photorealistic style.',
    image: getPreviewUrl('glass skin makeup dewy glow', 719)
  },
  {
    id: 'makeup-glitter-tears',
    category: 'makeup',
    title: 'Блестящие слезы',
    description: 'Арт-образ',
    prompt: 'Apply glitter tears makeup. Glitter trails falling from eyes like tears. Emotional and artistic. CRUCIAL: Preserve facial identity. Photorealistic style.',
    image: getPreviewUrl('glitter tears makeup euphoria style', 720)
  },

  // --- BUSINESS PRINT CATEGORY ---
  {
    id: 'print-menu',
    category: 'business_print',
    title: 'Меню Ресторана',
    description: 'Премиум дизайн',
    prompt: 'Create a high-end restaurant menu background design. Dark marble texture, elegant gold lines, soft ambient lighting. Leave empty space in the center for text. Place a gourmet dish on the bottom corner. Photorealistic style.',
    image: getPreviewUrl('restaurant menu background dark marble gourmet', 2001)
  },
  {
    id: 'print-spa-pricelist',
    category: 'business_print',
    title: 'Прайс SPA',
    description: 'Релакс и стиль',
    prompt: 'Create a luxury spa price list background. Soft beige tones, orchid flowers, white stones, and bamboo. Zen atmosphere. Clean space for service list text. Photorealistic.',
    image: getPreviewUrl('spa price list background orchids zen', 2002)
  },
  {
    id: 'print-coffee-poster',
    category: 'business_print',
    title: 'Постер Кофейни',
    description: 'Реклама напитков',
    prompt: 'Create a coffee shop promotional poster background. Close-up of coffee beans and a steaming cup. Warm, cozy lighting. Text space at the top. Photorealistic.',
    image: getPreviewUrl('coffee shop poster background steaming cup', 2003)
  },
  {
    id: 'print-sale-flyer',
    category: 'business_print',
    title: 'Флаер Распродажи',
    description: 'Яркое промо',
    prompt: 'Create a dynamic sale flyer background. Vibrant red and yellow geometric shapes, confetti, "Big Sale" energy. Space for product images and text. Photorealistic.',
    image: getPreviewUrl('sale flyer background red yellow confetti', 2004)
  },
  {
    id: 'print-business-card',
    category: 'business_print',
    title: 'Визитка',
    description: 'Деловой стиль',
    prompt: 'Create a minimalist modern business card background design. Dark blue and silver gradient. Abstract geometric lines. Professional look. Photorealistic.',
    image: getPreviewUrl('business card background modern geometric', 2005)
  },
  {
    id: 'print-billboard',
    category: 'business_print',
    title: 'Билборд',
    description: 'Наружная реклама',
    prompt: 'Create a mockup of a large outdoor billboard on a city building. The billboard surface is blank white for your design. Blue sky background. Photorealistic.',
    image: getPreviewUrl('outdoor billboard mockup city', 2006)
  },
  {
    id: 'print-event-banner',
    category: 'business_print',
    title: 'Баннер События',
    description: 'Конференция / Гала',
    prompt: 'Create a corporate event banner background. Blue stage curtains, spotlights, gold sparkles. Celebration atmosphere. Space for event title. Photorealistic.',
    image: getPreviewUrl('corporate event banner background stage lights', 2007)
  },
  {
    id: 'print-voucher',
    category: 'business_print',
    title: 'Ваучер',
    description: 'Подарочный сертификат',
    prompt: 'Create a luxury gift voucher background design. Gold ribbon, silky texture background, elegant typography elements. Photorealistic.',
    image: getPreviewUrl('gift voucher background gold ribbon', 2008)
  },
  {
    id: 'print-real-estate',
    category: 'business_print',
    title: 'Недвижимость',
    description: 'Листовка риелтора',
    prompt: 'Create a real estate flyer background. Modern home interior in background (blurred), bright airy lighting. Blue and white color scheme. Space for property details. Photorealistic.',
    image: getPreviewUrl('real estate flyer background modern home', 2009)
  },
  {
    id: 'print-roll-up',
    category: 'business_print',
    title: 'Ролл-ап',
    description: 'Стенд для офиса',
    prompt: 'Create a blank roll-up standee mockup standing in a modern office lobby. Clean canvas for your design. Professional lighting. Photorealistic.',
    image: getPreviewUrl('roll up banner standee mockup office', 2010)
  },

  // --- TET (LUNAR NEW YEAR) VIETNAMESE CATEGORY ---
  {
    id: 'tet-traditional-yellow',
    category: 'tet',
    title: 'Аозай и Цветы Мая',
    description: 'Золотой Новый год',
    prompt: 'Show the person from the photo wearing a luxurious traditional yellow and red Ao Dai, standing next to a large blooming yellow Ochna Integerrima tree (Hoa Mai). CRUCIAL: Preserve the facial features exactly. Photorealistic style, detailed natural skin texture, visible pores, no plastic smoothing. Festive Vietnamese Lunar New Year atmosphere, soft sunlight, happy expression.',
    image: getPreviewUrl('Vietnamese woman yellow ao dai ochna flowers tet', 2001)
  },
  {
    id: 'tet-traditional-pink',
    category: 'tet',
    title: 'Персиковый Сад',
    description: 'Северный стиль',
    prompt: 'Show the person from the photo wearing a pink silk Ao Dai standing in a garden of blooming peach blossoms (Hoa Dao). CRUCIAL: Maintain exact facial identity. Photorealistic style, detailed natural skin texture. Traditional Northern Vietnamese Tet celebration style. Gentle, elegant, spring vibes.',
    image: getPreviewUrl('Vietnamese woman pink ao dai peach blossoms tet', 2002)
  },
  {
    id: 'tet-hoi-an',
    category: 'tet',
    title: 'Хойан Ночью',
    description: 'Фонарики',
    prompt: 'Show the person from the photo in Hoi An ancient town at night, surrounded by hundreds of colorful glowing silk lanterns. Wearing a traditional Ao Dai. CRUCIAL: Keep the face exactly identical. Photorealistic style, detailed natural skin texture. Magical, cinematic lighting, river background.',
    image: getPreviewUrl('Hoi An lanterns night vietnamese woman ao dai', 2003)
  },
  {
    id: 'tet-temple',
    category: 'tet',
    title: 'Храм',
    description: 'Молитва на удачу',
    prompt: 'Show the person from the photo visiting a traditional Vietnamese temple or pagoda to pray for luck. CRUCIAL: Preserve facial identity. Photorealistic style, detailed natural skin texture. Burning incense sticks, smoke swirling, peaceful spiritual atmosphere. Wearing modest traditional clothing.',
    image: getPreviewUrl('Vietnamese temple praying incense smoke', 2004)
  },
  {
    id: 'tet-calligraphy',
    category: 'tet',
    title: 'Каллиграфия',
    description: 'Мастер Ong Do',
    prompt: 'Show the person from the photo sitting with a Vietnamese calligraphy master (Ong Do) on a street corner, holding a red paper with lucky characters. CRUCIAL: Maintain exact facial identity. Photorealistic style, detailed natural skin texture. Old Quarter background, red paper decorations.',
    image: getPreviewUrl('Vietnamese calligraphy red paper street tet', 2005)
  },
  {
    id: 'tet-lucky-money',
    category: 'tet',
    title: 'Ли Си (Конверты)',
    description: 'Красные конверты удачи',
    prompt: 'Show the person from the photo holding many red lucky money envelopes (Li Xi) with a big smile. CRUCIAL: Keep the face exactly identical. Photorealistic style, detailed natural skin texture. Background decorated with Tet couplets and flowers. Wealth and prosperity vibe.',
    image: getPreviewUrl('holding red envelopes li xi vietnamese tet', 2006)
  },
  {
    id: 'tet-banh-chung',
    category: 'tet',
    title: 'Бань Чунг',
    description: 'Готовим пироги',
    prompt: 'Show the person from the photo wrapping traditional sticky rice cakes (Banh Chung) with green leaves. CRUCIAL: Preserve facial identity. Photorealistic style, detailed natural skin texture. Rustic kitchen setting, cozy family atmosphere, preparing for Tet.',
    image: getPreviewUrl('wrapping banh chung vietnamese food tet', 2007)
  },
  {
    id: 'tet-flower-market',
    category: 'tet',
    title: 'Цветочный Рынок',
    description: 'Суета праздника',
    prompt: 'Show the person from the photo walking through a bustling Tet flower market filled with kumquat trees and chrysanthemums. CRUCIAL: Maintain exact facial identity. Photorealistic style, detailed natural skin texture. Motorbikes carrying flowers in the background. Authentic street life.',
    image: getPreviewUrl('vietnamese flower market tet motorbike', 2008)
  },
  {
    id: 'tet-family-tray',
    category: 'tet',
    title: 'Праздничный Стол',
    description: 'Пять фруктов',
    prompt: 'Show the person from the photo sitting at a traditional Tet tea table with a tray of five fruits (Mam Ngu Qua) and candied fruits. CRUCIAL: Keep the face exactly identical. Photorealistic style, detailed natural skin texture. Wearing nice clothes, welcoming guests.',
    image: getPreviewUrl('vietnamese tet tea table five fruit tray', 2009)
  },
  {
    id: 'tet-modern-chic',
    category: 'tet',
    title: 'Современный Тет',
    description: 'Модный Аозай',
    prompt: 'Show the person from the photo wearing a modern, stylized fashion Ao Dai (Ao Dai Cach Tan) with trendy accessories. CRUCIAL: Preserve facial identity. Photorealistic style, detailed natural skin texture. Studio photography with red background and artistic props.',
    image: getPreviewUrl('modern fashion ao dai studio red background', 2010)
  },
  {
    id: 'tet-fireworks-hcm',
    category: 'tet',
    title: 'Салют Landmark 81',
    description: 'Сайгон в Новый год',
    prompt: 'Show the person from the photo standing on a luxury rooftop bar in Ho Chi Minh City, with the illuminated Landmark 81 tower in the background. Colorful Tet fireworks exploding in the night sky. CRUCIAL: Preserve facial identity exactly. Photorealistic style, detailed natural skin texture, visible pores, no plastic smoothing. Festive elegant atmosphere, holding a glass of wine.',
    image: getPreviewUrl('person rooftop bar landmark 81 fireworks vietnam', 2011)
  },
  {
    id: 'tet-dragon-dance',
    category: 'tet',
    title: 'Танец Льва',
    description: 'Праздничное шествие',
    prompt: 'Show the person from the photo standing next to a vibrant red and yellow Lion Dance (Mua Lan) performance on a busy street. CRUCIAL: Maintain exact facial identity. Photorealistic style, detailed natural skin texture, deep depth of field. Drums, confetti, energetic festive atmosphere.',
    image: getPreviewUrl('person next to vietnamese lion dance mua lan', 2012)
  },
  {
    id: 'tet-vintage-retro',
    category: 'tet',
    title: 'Ретро Сайгон',
    description: 'Ностальгия 90-х',
    prompt: 'Vintage 90s film photography style. Show the person from the photo sitting on an old Honda Cub motorbike decorated with Tet flowers. CRUCIAL: Keep the face exactly identical. Photorealistic film grain, warm nostalgic colors. Vietnamese street corner background.',
    image: getPreviewUrl('vintage saigon tet 90s style motorbike', 2013)
  },
  {
    id: 'tet-flower-street',
    category: 'tet',
    title: 'Улица Цветов',
    description: 'Прогулка Нгуен Хюэ',
    prompt: 'Show the person from the photo walking down the famous Nguyen Hue Flower Street in Ho Chi Minh City. CRUCIAL: Preserve facial identity. Photorealistic style, detailed natural skin texture. Surrounded by elaborate floral displays and Tet mascots. Sunny bright day.',
    image: getPreviewUrl('walking nguyen hue flower street vietnam', 2014)
  },
  {
    id: 'tet-countryside',
    category: 'tet',
    title: 'Деревенский Тет',
    description: 'Уют и спокойствие',
    prompt: 'Show the person from the photo in a peaceful Vietnamese countryside setting. Standing in front of a traditional wooden house with banana trees and a red flag. CRUCIAL: Maintain exact facial identity. Photorealistic style, detailed natural skin texture. Rustic, warm, homecoming vibe.',
    image: getPreviewUrl('vietnamese countryside tet wooden house', 2015)
  },
  {
    id: 'tet-cyclo',
    category: 'tet',
    title: 'Велорикша',
    description: 'Прогулка по городу',
    prompt: 'Show the person from the photo sitting on a traditional Vietnamese Cyclo (Xich Lo) decorated with marigold flowers. CRUCIAL: Keep the face exactly identical. Photorealistic style, detailed natural skin texture. Riding through a sunny street with colonial architecture.',
    image: getPreviewUrl('person sitting on vietnamese cyclo xich lo', 2016)
  },
  {
    id: 'tet-watermelon',
    category: 'tet',
    title: 'Арбуз Удачи',
    description: 'Резьба по арбузу',
    prompt: 'Show the person from the photo holding a carved red watermelon with lucky calligraphy characters (Tai Loc). CRUCIAL: Preserve facial identity. Photorealistic style, detailed natural skin texture. Bright red and green colors, festive background.',
    image: getPreviewUrl('holding carved watermelon vietnamese tet', 2017)
  },
  {
    id: 'tet-non-la',
    category: 'tet',
    title: 'Нон Ла и Лотос',
    description: 'Традиционная красота',
    prompt: 'Show the person from the photo wearing a white Ao Dai and a traditional Conical Hat (Non La), standing by a lotus pond. CRUCIAL: Maintain exact facial identity. Photorealistic style, detailed natural skin texture. Soft, poetic, serene atmosphere.',
    image: getPreviewUrl('vietnamese woman non la conical hat lotus', 2018)
  },
  {
    id: 'tet-incense-spiral',
    category: 'tet',
    title: 'Благовония',
    description: 'Спирали в храме',
    prompt: 'Show the person from the photo standing under hundreds of hanging spiral incense coils in an atmospheric temple (like Ba Thien Hau). CRUCIAL: Keep the face exactly identical. Photorealistic style, detailed natural skin texture. Shafts of light cutting through the smoke, cinematic.',
    image: getPreviewUrl('person under spiral incense coils temple', 2019)
  },
  {
    id: 'tet-kitchen-god',
    category: 'tet',
    title: 'У Очага',
    description: 'Готовим ночью',
    prompt: 'Show the person from the photo sitting by a warm wood fire, cooking a large pot of Banh Chung at night. CRUCIAL: Preserve facial identity. Photorealistic style, detailed natural skin texture. Glowing warm light from the fire, cozy anticipation of New Year.',
    image: getPreviewUrl('cooking banh chung wood fire night', 2020)
  },

  // --- FASHION CATEGORY ---
  {
    id: 'fashion-runway',
    category: 'fashion',
    title: 'Подиум',
    description: 'Модный показ',
    prompt: 'Show the person from the photo walking on a high-fashion runway during a fashion week show. CRUCIAL: Preserve facial identity exactly. Wearing avant-garde designer couture. Dramatic spotlights, audience in darkness, flashing cameras. Photorealistic 8k, detailed skin texture.',
    image: getPreviewUrl('fashion model walking runway catwalk spotlight', 601)
  },
  {
    id: 'fashion-editorial',
    category: 'fashion',
    title: 'Обложка Журнала',
    description: 'Стиль Vogue',
    prompt: 'High-end fashion editorial portrait shot for a magazine cover like Vogue. CRUCIAL: Maintain exact facial identity. Artistic lighting, bold makeup, stylish haute couture outfit. Studio background with geometric shadows. 8k resolution, detailed skin texture.',
    image: getPreviewUrl('fashion editorial magazine cover portrait', 602)
  },
  {
    id: 'fashion-street-paris',
    category: 'fashion',
    title: 'Парижский Шик',
    description: 'У Эйфелевой башни',
    prompt: 'Show the person from the photo walking in Paris near the Eiffel Tower. CRUCIAL: Preserve facial identity. Wearing a trench coat, beret, and holding a baguette or coffee. Cloudy chic atmosphere, street style photography. Photorealistic.',
    image: getPreviewUrl('parisian chic fashion street style eiffel tower', 603)
  },
  {
    id: 'fashion-old-money-winter',
    category: 'fashion',
    title: 'Old Money Зима',
    description: 'Лыжный курорт',
    prompt: 'Show the person from the photo on a balcony of a luxury ski chalet in the Alps. CRUCIAL: Keep the face exactly identical. Wearing expensive cashmere beige sweater, fur hat, sipping hot chocolate. Snowy mountain background. Wealthy aesthetic, detailed skin.',
    image: getPreviewUrl('old money winter fashion ski resort alps', 604)
  },
  {
    id: 'fashion-urban',
    category: 'fashion',
    title: 'Урбан Стритвир',
    description: 'Уличный стиль',
    prompt: 'Show the person from the photo in a trendy urban streetwear outfit (hoodie, bomber jacket, sneakers). CRUCIAL: Preserve facial identity. Graffiti wall background, neon city lights reflections, dynamic angle. Hypebeast style. Photorealistic.',
    image: getPreviewUrl('urban streetwear fashion graffiti wall', 605)
  },
  {
    id: 'fashion-red-carpet',
    category: 'fashion',
    title: 'Красная Дорожка',
    description: 'Гала-вечер',
    prompt: 'Show the person from the photo standing on a red carpet at a movie premiere or Met Gala. CRUCIAL: Maintain exact facial identity. Wearing a glamorous evening gown or tuxedo. Paparazzi flashes, velvet ropes, luxury event atmosphere. Photorealistic.',
    image: getPreviewUrl('celebrity red carpet fashion gala dress', 606)
  },
  {
    id: 'fashion-summer-resort',
    category: 'fashion',
    title: 'Летний Курорт',
    description: 'Средиземноморье',
    prompt: 'Show the person from the photo in a luxury summer resort outfit (linen shirt/dress, sunglasses). CRUCIAL: Keep the face exactly identical. Amalfi coast background, blue sea, lemon trees, sunny bright lighting. Photorealistic.',
    image: getPreviewUrl('summer resort fashion amalfi coast sunny', 607)
  },
  {
    id: 'fashion-cyber',
    category: 'fashion',
    title: 'Кибер Мода',
    description: 'Футуризм',
    prompt: 'Show the person from the photo in futuristic cyber fashion clothing. Holographic fabrics, neon glowing accessories. CRUCIAL: Preserve facial identity. Night city futuristic background, rain, blue and pink neon lighting. Photorealistic.',
    image: getPreviewUrl('cyberpunk fashion futuristic clothing neon', 608)
  },
  {
    id: 'fashion-denim',
    category: 'fashion',
    title: 'Деним',
    description: 'Джинсовый стиль',
    prompt: 'Show the person from the photo wearing a stylish all-denim outfit (jean jacket and jeans). CRUCIAL: Maintain exact facial identity. Studio blue background or industrial loft setting. Cool, edgy fashion vibe. Photorealistic.',
    image: getPreviewUrl('denim on denim fashion portrait studio', 609)
  },
  {
    id: 'fashion-minimal',
    category: 'fashion',
    title: 'Минимализм',
    description: 'Студийный портрет',
    prompt: 'Minimalist fashion photography. Show the person from the photo in a sleek monochrome outfit against a plain concrete or beige wall. CRUCIAL: Keep the face exactly identical. Soft natural shadow, clean lines, Zara/Uniqlo lookbook style. Photorealistic.',
    image: getPreviewUrl('minimalist fashion photography beige wall', 610)
  },

  // --- STYLE TRENDS & MOODBOARDS CATEGORY ---
  {
    id: 'style-old-money',
    category: 'style_trends',
    title: 'Old Money',
    description: 'Роскошная сдержанность',
    prompt: 'Dress the person from the photo in the "Old Money" aesthetic. Polo shirt, beige trousers or tennis skirt, cashmere sweater over shoulders, loafers. CRUCIAL: Preserve facial identity exactly. Background: A luxury yacht deck or a private mansion garden. Wealthy, understated elegance. Photorealistic, detailed skin.',
    image: getPreviewUrl('old money aesthetic fashion beige polo yacht', 1801)
  },
  {
    id: 'style-y2k',
    category: 'style_trends',
    title: 'Стиль Y2K',
    description: 'Нулевые',
    prompt: 'Dress the person from the photo in Y2K fashion (Year 2000 style). Low-rise jeans, baby tee, butterfly clips, rimless sunglasses. CRUCIAL: Maintain exact facial identity. Background: Glossy futuristic purple and pink gradient with digital abstract shapes. Photorealistic.',
    image: getPreviewUrl('y2k fashion style 2000s outfit pink purple', 1802)
  },
  {
    id: 'style-streetwear',
    category: 'style_trends',
    title: 'Стритвир Премиум',
    description: 'Уличная мода',
    prompt: 'Dress the person from the photo in premium streetwear. Oversized graphic hoodie, cargo pants, chunky sneakers, beanie. CRUCIAL: Keep the face exactly identical. Background: Urban city street with graffiti art and neon signs. Photorealistic.',
    image: getPreviewUrl('streetwear fashion oversized hoodie urban', 1803)
  },
  {
    id: 'style-minimalist',
    category: 'style_trends',
    title: 'Минимализм',
    description: 'Элегантность',
    prompt: 'Dress the person from the photo in a clean Minimalist fashion style. Monochromatic outfit (all black or all white), sleek lines, trench coat. CRUCIAL: Preserve facial identity. Background: Modern concrete architectural wall or art gallery. Photorealistic.',
    image: getPreviewUrl('minimalist fashion all white outfit architecture', 1804)
  },
  {
    id: 'style-coquette',
    category: 'style_trends',
    title: 'Coquette',
    description: 'Банты и кружева',
    prompt: 'Dress the person from the photo in Coquette aesthetic. Lace dress, pink bows in hair, pearls, soft lighting. CRUCIAL: Maintain exact facial identity. Background: Vintage bedroom with flowers and soft pastel colors. Photorealistic.',
    image: getPreviewUrl('coquette aesthetic fashion bows lace pink', 1805)
  },
  {
    id: 'style-cyberpunk',
    category: 'style_trends',
    title: 'Techwear / Cyberpunk',
    description: 'Техно-мода',
    prompt: 'Dress the person from the photo in futuristic Techwear. Black tactical straps, mask hanging on neck, waterproof fabrics, neon accents. CRUCIAL: Keep the face recognizable. Background: Rainy night city in Tokyo cyberpunk style. Photorealistic.',
    image: getPreviewUrl('techwear fashion cyberpunk neon rain', 1806)
  },
  {
    id: 'style-vintage-90s',
    category: 'style_trends',
    title: 'Винтаж 90-х',
    description: 'Гранж и деним',
    prompt: 'Dress the person from the photo in 90s vintage style. Denim jacket, flannel shirt tied around waist, combat boots. CRUCIAL: Preserve facial identity. Background: Retro record store or diner. Photorealistic.',
    image: getPreviewUrl('90s vintage fashion denim flannel grunge', 1807)
  },
  {
    id: 'style-moodboard-1',
    category: 'style_trends',
    title: 'Мудборд 1',
    description: 'Образ + Раскладка',
    prompt: 'Create a fashion moodboard composition. Split the image into two sections. On the Left: The person from the photo wearing a stylish chic outfit (CRUCIAL: Preserve facial identity exactly, photorealistic). On the Right: A neat flatlay arrangement of the matching accessories, shoes, and bag on a marble background. High fashion magazine layout style.',
    image: getPreviewUrl('fashion moodboard split screen person and flatlay', 1808)
  },
  {
    id: 'style-moodboard-2',
    category: 'style_trends',
    title: 'Мудборд 2',
    description: 'Коллаж',
    prompt: 'Create a trendy fashion collage. Main visual is the person from the photo wearing a casual trendy outfit (CRUCIAL: Maintain exact facial identity, photorealistic). Surrounding the person are floating aesthetic elements: a coffee cup, sunglasses, a magazine, and a pair of sneakers arranged artistically. Beige aesthetic background.',
    image: getPreviewUrl('fashion collage aesthetic beige coffee sneakers', 1809)
  },
  {
    id: 'style-boho',
    category: 'style_trends',
    title: 'Бохо (Boho)',
    description: 'Свобода стиля',
    prompt: 'Dress the person from the photo in Bohemian style. Flowy patterned dress or linen shirt, wide-brimmed hat, leather accessories. CRUCIAL: Keep the face exactly identical. Background: Sunset desert or festival grounds. Photorealistic.',
    image: getPreviewUrl('boho fashion bohemian style sunset festival', 1810)
  },

  // --- FORMULA 1 CATEGORY ---
  {
    id: 'f1-cockpit',
    category: 'formula1',
    title: 'Вид пилота',
    description: 'В кокпите (Профиль)',
    prompt: 'Cinematic side profile shot of the person from the photo sitting inside a Formula 1 car cockpit. Camera angle from the side/three-quarters. Wearing a professional racing suit and helmet with visor open, revealing the face clearly. CRUCIAL: Preserve the facial features exactly. Photorealistic style, detailed natural skin texture. Hands gripping the steering wheel. Detailed car chassis, blurred racetrack background, high speed atmosphere.',
    image: getPreviewUrl('f1 driver cockpit side profile helmet visor up', 1701)
  },
  {
    id: 'f1-car-standing',
    category: 'formula1',
    title: 'У болида',
    description: 'Пит-лейн',
    prompt: 'Show the person from the photo standing confidently next to a sleek Formula 1 car in the pit lane. CRUCIAL: Maintain exact facial identity. Photorealistic style, detailed natural skin texture. Wearing team racing kit, sunglasses, mechanic crew busy in background.',
    image: getPreviewUrl('driver standing next to f1 car pit lane', 1702)
  },
  {
    id: 'f1-podium',
    category: 'formula1',
    title: 'Подиум',
    description: 'Шампанское',
    prompt: 'Show the person from the photo standing on the 1st place podium, holding a giant gold trophy and spraying champagne. CRUCIAL: Keep the face exactly identical. Photorealistic style. Confetti raining down, cheering crowd below, wearing winner cap.',
    image: getPreviewUrl('f1 podium celebration champagne trophy', 1703)
  },
  {
    id: 'f1-racing',
    category: 'formula1',
    title: 'Гонка',
    description: 'На трассе',
    prompt: 'Action shot of a Formula 1 car speeding on the track. The person from the photo is driving, face visible through the open visor. CRUCIAL: Preserve facial identity. Photorealistic style. Motion blur background, sparks from under the car, intense speed.',
    image: getPreviewUrl('f1 car racing track motion blur driver face', 1704)
  },
  {
    id: 'f1-paddock',
    category: 'formula1',
    title: 'Паддок VIP',
    description: 'Стиль звезды',
    prompt: 'Show the person from the photo walking through the exclusive F1 Paddock area. CRUCIAL: Maintain exact facial identity. Photorealistic style. Wearing stylish VIP guest pass, sunglasses, luxury casual outfit, motorhomes in background.',
    image: getPreviewUrl('f1 paddock vip guest walking', 1705)
  },
  {
    id: 'f1-pitstop',
    category: 'formula1',
    title: 'Пит-стоп',
    description: 'Механик',
    prompt: 'Show the person from the photo as part of the pit crew, holding a wheel gun during a lightning-fast pit stop. CRUCIAL: Keep the face recognizable. Photorealistic style. Surrounded by mechanics in matching uniforms, smoke, intensity.',
    image: getPreviewUrl('f1 pit stop crew mechanic wheel gun', 1706)
  },
  {
    id: 'f1-garage',
    category: 'formula1',
    title: 'Гараж',
    description: 'Телеметрия',
    prompt: 'Show the person from the photo sitting in the team garage, looking at telemetry data on monitors with engineers. CRUCIAL: Preserve facial identity. Photorealistic style. Headset on, focused expression, high-tech environment.',
    image: getPreviewUrl('f1 driver garage telemetry monitors headset', 1707)
  },
  {
    id: 'f1-helmet',
    category: 'formula1',
    title: 'Шлем',
    description: 'Крупный план',
    prompt: 'Close-up portrait of the person wearing a custom-designed colorful racing helmet with the visor open. CRUCIAL: Maintain exact facial identity. Photorealistic style, detailed skin texture. Track lights reflecting on the helmet, intense eyes.',
    image: getPreviewUrl('f1 driver helmet close up portrait', 1708)
  },

  // --- PRANKS CATEGORY ---
  {
    id: 'prank-flood',
    category: 'pranks',
    title: 'Наводнение',
    description: 'Затопленная комната',
    prompt: 'Transform the room in the photo to look completely flooded with water. Reflections of furniture in the water, floating items, realistic disaster movie effect. Photorealistic.',
    image: getPreviewUrl('flooded room interior water disaster', 3001)
  },
  {
    id: 'prank-mistress',
    category: 'pranks',
    title: 'Кто-то в постели (Ж)',
    description: 'Пранк с девушкой',
    prompt: 'Add a mysterious silhouette of a sleeping woman under the blanket in the bed next to the viewer. Messy sheets, long hair visible on the pillow. Prank photo. Photorealistic.',
    image: getPreviewUrl('sleeping woman in bed under blanket pov', 3002)
  },
  {
    id: 'prank-lover',
    category: 'pranks',
    title: 'Кто-то в постели (М)',
    description: 'Пранк с парнем',
    prompt: 'Add a mysterious silhouette of a sleeping man under the blanket in the bed next to the viewer. Messy sheets, arm visible. Prank photo. Photorealistic.',
    image: getPreviewUrl('sleeping man in bed under blanket pov', 3003)
  },
  {
    id: 'prank-broken-screen',
    category: 'pranks',
    title: 'Разбитый экран',
    description: 'Трещины на мониторе',
    prompt: 'Add a realistic smashed screen effect with spiderweb cracks and glitching pixels to the TV or monitor screen in the photo. Photorealistic.',
    image: getPreviewUrl('broken tv screen cracks glitch', 3004)
  },
  {
    id: 'prank-arrest',
    category: 'pranks',
    title: 'Арест',
    description: 'Полицейское фото',
    prompt: 'Show the person from the photo in a police booking photo (mugshot). CRUCIAL: Preserve the facial features exactly. Photorealistic style, detailed natural skin texture. Holding a sign with numbers, height chart in the background, harsh lighting. Prank photo.',
    image: getPreviewUrl('mugshot police booking photo holding sign', 3005)
  },
  {
    id: 'prank-bruises',
    category: 'pranks',
    title: 'Драка',
    description: 'Грим побоев',
    prompt: 'Apply hyper-realistic Hollywood special effects makeup (SFX) to the person\'s face. Create a realistic black eye, bruises on the cheekbone, and a split lip effect. CRUCIAL: Preserve the underlying facial identity. Action movie aftermath style, detailed texture, cinematic lighting, visible pores.',
    image: getPreviewUrl('realistic bruised face makeup sfx action movie', 3006)
  },
  {
    id: 'prank-mess',
    category: 'pranks',
    title: 'Беспорядок',
    description: 'Хаос в комнате',
    prompt: 'Make the room look absolutely messy and chaotic. Clothes everywhere, spilled food, overturned chairs. "Party gone wrong" prank vibe. Photorealistic.',
    image: getPreviewUrl('messy room chaos clothes everywhere', 3007)
  },
  {
    id: 'prank-animal-mess',
    category: 'pranks',
    title: 'Питомец нашкодил',
    description: 'Порванная подушка',
    prompt: 'Add a guilty-looking dog or cat sitting amidst a pile of torn white feathers from a destroyed pillow. Messy room prank. Photorealistic.',
    image: getPreviewUrl('dog feathers messy room torn pillow', 3008)
  },
  {
    id: 'prank-kids-art',
    category: 'pranks',
    title: 'Детские рисунки',
    description: 'Разрисованные стены',
    prompt: 'Add colorful crayon drawings and scribbles all over the walls and furniture. Messy kids playroom prank. Photorealistic.',
    image: getPreviewUrl('crayon drawings on wall messy room', 3009)
  },
  {
    id: 'prank-clown',
    category: 'pranks',
    title: 'Жуткий клоун',
    description: 'В окне',
    prompt: 'Add a creepy clown face peering through the window or standing in a dark corner of the room. Spooky prank photo. Photorealistic.',
    image: getPreviewUrl('creepy clown in window dark', 3010)
  },
  {
    id: 'prank-lottery',
    category: 'pranks',
    title: 'Джекпот',
    description: 'Чек лотереи',
    prompt: 'Show the person from the photo holding a giant lottery check with a huge amount of money written on it. CRUCIAL: Keep the face exactly identical. Photorealistic style. Confetti falling, excited expression, looking like a winner on TV.',
    image: getPreviewUrl('person holding giant lottery winner check confetti', 3011)
  },
  {
    id: 'prank-alien',
    category: 'pranks',
    title: 'Пришельцы',
    description: 'Похищение НЛО',
    prompt: 'Show the person from the photo being lifted off the ground by a bright green beam of light coming from a UFO saucer in the night sky. CRUCIAL: Keep the face recognizable. Sci-fi movie style, floating in air.',
    image: getPreviewUrl('person being abducted by ufo green beam night', 3012)
  },
  {
    id: 'prank-ghost',
    category: 'pranks',
    title: 'Призрак',
    description: 'Паранормальное',
    prompt: 'Make the photo look spooky. Add a semi-transparent ghostly figure standing behind the person. Dim lighting, paranormal activity vibe, grainy horror movie texture.',
    image: getPreviewUrl('ghost figure behind person spooky photo horror', 3013)
  },
  {
    id: 'prank-superpower',
    category: 'pranks',
    title: 'Суперсила (Фейл)',
    description: 'Лазер из глаз',
    prompt: 'Show the person from the photo trying to use superpowers (like laser eyes or fire hands) but accidentally scorching their own clothes or the wall nearby. CRUCIAL: Keep the face recognizable. Funny superhero fail situation. smoke and char marks.',
    image: getPreviewUrl('superhero powers fail smoke funny', 3014)
  },
  {
    id: 'prank-time',
    category: 'pranks',
    title: 'Путешественник',
    description: 'Из будущего',
    prompt: 'Show the person from the photo stepping out of a glowing time travel portal or a futuristic DeLorean car. CRUCIAL: Keep the face exactly identical. Smoke, electricity sparks, wearing futuristic goggles or clothes mixed with normal ones.',
    image: getPreviewUrl('person stepping out of time portal sci-fi', 3015)
  },

  // --- WEDDING CATEGORY ---
  {
    id: 'wedding-bride-groom',
    category: 'wedding',
    title: 'Жених и Невеста',
    description: 'Классический портрет',
    prompt: 'Show the person from the photo in wedding attire (suit or white dress) standing with a partner in a beautiful garden. CRUCIAL: Preserve the facial features exactly. Photorealistic style, detailed natural skin texture. Soft romantic lighting, love, happiness.',
    image: getPreviewUrl('wedding bride groom romantic garden', 1601)
  },
  {
    id: 'wedding-dress',
    category: 'wedding',
    title: 'Примерка платья',
    description: 'Идеальный выбор',
    prompt: 'Show the person from the photo wearing a luxurious, detailed white lace wedding dress, looking into a large vintage mirror in a bridal salon. CRUCIAL: Maintain exact facial identity. Photorealistic style, detailed natural skin texture. Soft lighting, elegance.',
    image: getPreviewUrl('bride wedding dress fitting mirror', 1602)
  },
  {
    id: 'wedding-church',
    category: 'wedding',
    title: 'Венчание',
    description: 'Церемония в церкви',
    prompt: 'Show the person from the photo participating in a traditional orthodox wedding ceremony (Venchanie) inside a beautiful church. CRUCIAL: Keep the face exactly identical. Photorealistic style, detailed natural skin texture. Candles, gold icons, holding crowns, spiritual atmosphere.',
    image: getPreviewUrl('orthodox wedding ceremony church candles', 1603)
  },
  {
    id: 'wedding-zags',
    category: 'wedding',
    title: 'ЗАГС',
    description: 'Лепестки роз',
    prompt: 'Show the person from the photo walking out of the Registry Office (ZAGS) doors, smiling happily. CRUCIAL: Preserve the facial features exactly. Photorealistic style. Guests are throwing white rose petals in the air. Joyful celebration moment.',
    image: getPreviewUrl('wedding couple leaving building rose petals confetti', 1604)
  },
  {
    id: 'wedding-ring',
    category: 'wedding',
    title: 'Кольца',
    description: 'Символ верности',
    prompt: 'Close-up artistic shot focusing on the person\'s hand wearing a beautiful diamond wedding ring. Soft bokeh background, holding a bouquet or partner\'s hand. Photorealistic.',
    image: getPreviewUrl('wedding ring close up hand diamond', 1605)
  },
  {
    id: 'wedding-dance',
    category: 'wedding',
    title: 'Первый танец',
    description: 'Дым и свет',
    prompt: 'Show the person from the photo dancing the first wedding dance. CRUCIAL: Maintain exact facial identity. Photorealistic style. Low floor fog (dry ice), spotlight, romantic evening atmosphere in a banquet hall.',
    image: getPreviewUrl('wedding couple first dance fog spotlight', 1606)
  },
  {
    id: 'wedding-cake',
    category: 'wedding',
    title: 'Свадебный торт',
    description: 'Разрезание торта',
    prompt: 'Show the person from the photo standing next to a giant multi-tier wedding cake, holding a knife ready to cut it. CRUCIAL: Keep the face exactly identical. Photorealistic style. Festive reception background.',
    image: getPreviewUrl('wedding couple cutting cake', 1607)
  },
  {
    id: 'wedding-party',
    category: 'wedding',
    title: 'Вечеринка',
    description: 'Шампанское и веселье',
    prompt: 'Show the person from the photo at a lively wedding party, holding a glass of champagne, laughing with friends. CRUCIAL: Preserve facial identity. Photorealistic style. Sparklers, disco lights, fun vibe.',
    image: getPreviewUrl('wedding party celebration champagne friends', 1608)
  },
  {
    id: 'wedding-morning',
    category: 'wedding',
    title: 'Утро невесты',
    description: 'Сборы',
    prompt: 'Show the person from the photo in a silk white robe, sitting on a bed or chair, getting ready for the wedding. CRUCIAL: Maintain exact facial identity. Photorealistic style, detailed natural skin texture. Makeup, bouquet nearby, soft window light.',
    image: getPreviewUrl('bride morning preparation robe silk', 1609)
  },
  {
    id: 'wedding-car',
    category: 'wedding',
    title: 'Свадебное авто',
    description: 'Лимузин или ретро',
    prompt: 'Show the person from the photo sitting in a decorated luxury retro wedding car or limousine. CRUCIAL: Keep the face exactly identical. Photorealistic style. Flowers on the car, waving out the window.',
    image: getPreviewUrl('wedding retro car decorated flowers', 1610)
  },

  // --- CHRISTMAS CATEGORY ---
  {
    id: 'card-kremlin',
    category: 'christmas',
    title: 'Красная Площадь',
    description: 'С Новым Годом!',
    prompt: 'Create a festive New Year postcard featuring the person from the photo. CRUCIAL: Preserve the facial features of the person exactly. Photorealistic style. They are standing on a snowy Red Square in Moscow with the Kremlin and St. Basil\'s Cathedral in the background. Fireworks in the night sky. The person is wearing a cozy Christmas sweater and holding a glass of champagne. The image should feature the text "С Новым Годом!" in a festive gold font.',
    image: getPreviewUrl('moscow kremlin new year postcard fireworks', 230)
  },
  {
    id: 'card-christmas-tree',
    category: 'christmas',
    title: 'Елка',
    description: 'Уютный праздник',
    prompt: 'Create a magical Christmas greeting card. Show the person from the photo smiling warmly, wearing a red sweater and Santa hat, holding a sparkler next to a beautifully decorated Christmas tree. CRUCIAL: Maintain the person\'s exact face. Photorealistic style. Add elegant text "С Рождеством!" in Russian. Golden bokeh and sparkles.',
    image: getPreviewUrl('christmas tree postcard russian text', 231)
  },
  {
    id: 'card-champagne',
    category: 'christmas',
    title: 'Тост',
    description: 'Бокал шампанского',
    prompt: 'A celebratory New Year postcard. Show the person from the photo in formal evening wear (suit or dress) raising a glass of champagne for a toast. CRUCIAL: Keep the face exactly identical. Photorealistic style. Background: festive party with confetti and golden balloons. Text overlay: "Happy New Year!".',
    image: getPreviewUrl('person raising champagne glass new year toast', 232)
  },
  {
    id: 'card-snow-forest',
    category: 'christmas',
    title: 'Зимний Лес',
    description: 'Сказка',
    prompt: 'A winter fairytale postcard. Show the person from the photo in a warm fur coat in a magical snowy forest with glowing lights on trees. CRUCIAL: Maintain exact facial identity. Photorealistic style. Soft falling snow. Text "Happy New Year!" written in a magical glowing style.',
    image: getPreviewUrl('winter forest postcard magical snow', 233)
  },
  {
    id: 'christmas-market',
    category: 'christmas',
    title: 'Ярмарка',
    description: 'Глинтвейн и огни',
    prompt: 'Place the person from the photo in a European Christmas market at night. Wooden stalls, dazzling fairy lights, drinking mulled wine, snow falling, festive bokeh atmosphere. CRUCIAL: Keep the face exactly identical. Photorealistic style.',
    image: getPreviewUrl('christmas market night lights mulled wine', 212)
  },
  {
    id: 'christmas-morning',
    category: 'christmas',
    title: 'Утро Рождества',
    description: 'Подарки',
    prompt: 'Show the person from the photo opening gifts on a cozy Christmas morning under a large decorated tree, wearing pajamas, happy expressions, warm sunlight. CRUCIAL: Maintain exact facial identity. Photorealistic style.',
    image: getPreviewUrl('family opening christmas gifts morning pajamas', 213)
  },
  {
    id: 'christmas-hygge',
    category: 'christmas',
    title: 'У камина',
    description: 'Стиль Хюгге',
    prompt: 'Show the person from the photo sitting by a crackling fireplace wrapped in a knitted blanket, holding hot cocoa, warm soft lighting, hygge style winter portrait. CRUCIAL: Preserve facial identity. Photorealistic style.',
    image: getPreviewUrl('girl by fireplace drinking cocoa hygge', 214)
  },
  {
    id: 'christmas-grinch',
    category: 'christmas',
    title: 'Гринч',
    description: 'Похититель Рождества',
    prompt: 'Show the person from the photo styled as the Grinch. Apply green skin tone and Grinch makeup, but keep the person\'s face recognizable. Wearing a red Santa coat. Mischievous expression, festive background. Photorealistic style.',
    image: getPreviewUrl('grinch style christmas portrait green', 215)
  },
  {
    id: 'christmas-rink',
    category: 'christmas',
    title: 'Каток',
    description: 'Коньки и лед',
    prompt: 'Show the person from the photo ice skating at a beautiful outdoor rink (like Central Park). Scarf fluttering, falling snow, city lights in background, motion blur. CRUCIAL: Keep the face exactly identical. Photorealistic style.',
    image: getPreviewUrl('couple ice skating central park christmas', 216)
  },
  {
    id: 'christmas-reindeer',
    category: 'christmas',
    title: 'Сани Санты',
    description: 'Полет с оленями',
    prompt: 'Show the person from the photo riding a magical sleigh with reindeer flying over a snowy forest. Moonlight, magical sparkles, epic fantasy christmas vibes. CRUCIAL: Keep the face recognizable. Photorealistic style.',
    image: getPreviewUrl('santa sleigh reindeer flying moon', 217)
  },
  {
    id: 'christmas-gingerbread',
    category: 'christmas',
    title: 'Пряничный домик',
    description: 'Готовка',
    prompt: 'Show the person from the photo decorating a gingerbread house in a messy flour-covered kitchen. Chef hat, apron, frosting, warm bakery lighting. CRUCIAL: Maintain exact facial identity. Photorealistic style.',
    image: getPreviewUrl('making gingerbread house kitchen mess', 218)
  },
  {
    id: 'christmas-fireworks',
    category: 'christmas',
    title: 'Фейерверк',
    description: 'Новогодняя ночь',
    prompt: 'Show the person from the photo watching bright colorful fireworks in the night sky, holding sparklers, champagne toast. New Year Eve celebration. CRUCIAL: Preserve facial identity. Photorealistic style.',
    image: getPreviewUrl('watching fireworks new year eve', 219)
  },
  {
    id: 'christmas-elf',
    category: 'christmas',
    title: 'Эльф',
    description: 'Помощник Санты',
    prompt: 'Transform the person from the photo into a cute Christmas elf with pointy ears and green hat. Working in Santa\'s toy workshop, surrounded by toys. CRUCIAL: Keep the face recognizable. Photorealistic style.',
    image: getPreviewUrl('cute christmas elf in toy workshop', 220)
  },
  {
    id: 'christmas-nyc',
    category: 'christmas',
    title: 'Нью-Йорк',
    description: 'Один дома',
    prompt: 'Place the person from the photo in a snowy New York City street during Christmas. Yellow taxi, Rockefeller center tree in background, festive city lights. CRUCIAL: Maintain exact facial identity. Photorealistic style.',
    image: getPreviewUrl('christmas in new york city snow taxi', 221)
  },
  {
    id: 'ded-moroz',
    category: 'christmas',
    title: 'Дед Мороз',
    description: 'Русский стиль',
    prompt: 'Turn the person into Ded Moroz (Russian Santa) in a long blue fur coat with silver embroidery. Background: snowy forest. CRUCIAL: Preserve facial identity. Photorealistic style.',
    image: getPreviewUrl('Ded Moroz russian santa blue coat', 201)
  },
  {
    id: 'snegurochka',
    category: 'christmas',
    title: 'Снегурочка',
    description: 'В кокошнике',
    prompt: 'Turn the person into Snegurochka (Snow Maiden). Wear a blue fur coat and kokoshnik headdress. Winter background. CRUCIAL: Keep the face exactly identical. Photorealistic style.',
    image: getPreviewUrl('Snegurochka Snow Maiden blue coat kokoshnik', 202)
  },

  // --- DATING CATEGORY ---
  {
    id: 'dating-train',
    category: 'dating',
    title: 'Вокзал',
    description: 'Долгожданная встреча',
    prompt: 'Show the person from the photo meeting a loved one at a vintage train station platform. CRUCIAL: Preserve facial identity. Photorealistic style. Steam, warm lighting, hugging or waiting with flowers, emotional reunion atmosphere.',
    image: getPreviewUrl('couple meeting train station romantic hug', 1501)
  },
  {
    id: 'dating-car',
    category: 'dating',
    title: 'Свидание в авто',
    description: 'Огни города',
    prompt: 'Show the person from the photo on a romantic date night by a luxury car. CRUCIAL: Keep the face exactly identical. Photorealistic style. Leaning on the car hood, city lights in background, evening street vibe, holding a rose.',
    image: getPreviewUrl('couple leaning on car night city lights', 1502)
  },
  {
    id: 'dating-flowers',
    category: 'dating',
    title: 'Букет роз',
    description: 'Сюрприз',
    prompt: 'Show the person from the photo holding a giant luxury bouquet of red roses. CRUCIAL: Maintain exact facial identity. Photorealistic style. Happy expression, urban street background, romantic surprise.',
    image: getPreviewUrl('woman holding giant red roses bouquet street', 1503)
  },
  {
    id: 'dating-restaurant',
    category: 'dating',
    title: 'Ужин при свечах',
    description: 'Романтика',
    prompt: 'Show the person from the photo having a romantic dinner date in a high-end restaurant. CRUCIAL: Preserve facial identity. Photorealistic style. Candlelight, wine glasses, holding hands across the table, intimate atmosphere.',
    image: getPreviewUrl('romantic dinner couple holding hands candles', 1504)
  },
  {
    id: 'dating-park',
    category: 'dating',
    title: 'Прогулка в парке',
    description: 'Осень/Весна',
    prompt: 'Show the person from the photo walking in a beautiful park with autumn leaves or spring blossoms. CRUCIAL: Keep the face exactly identical. Photorealistic style. Holding hands with partner, soft sunlight, romantic walk.',
    image: getPreviewUrl('couple walking park holding hands autumn', 1505)
  },
  {
    id: 'dating-rooftop',
    category: 'dating',
    title: 'На крыше',
    description: 'Вид на город',
    prompt: 'Show the person from the photo on a romantic date on a rooftop at sunset. CRUCIAL: Maintain exact facial identity. Photorealistic style. City skyline view, string lights, cozy blanket, drinking wine.',
    image: getPreviewUrl('couple on rooftop sunset wine', 1506)
  },
  {
    id: 'dating-picnic',
    category: 'dating',
    title: 'Пикник',
    description: 'Отдых на природе',
    prompt: 'Show the person from the photo having a romantic picnic on the grass. CRUCIAL: Preserve facial identity. Photorealistic style. Checkered blanket, fruit basket, wine, laughing, sunny day nature.',
    image: getPreviewUrl('couple picnic grass nature sunny', 1507)
  },
  {
    id: 'dating-beach',
    category: 'dating',
    title: 'Пляж',
    description: 'Закат у моря',
    prompt: 'Show the person from the photo walking along the beach at sunset. CRUCIAL: Keep the face exactly identical. Photorealistic style. Barefoot, waves crashing, golden hour light, romantic silhouette.',
    image: getPreviewUrl('couple walking beach sunset', 1508)
  },
  {
    id: 'dating-gift',
    category: 'dating',
    title: 'Подарок',
    description: 'Радость',
    prompt: 'Show the person from the photo holding a beautifully wrapped gift box with a bow. CRUCIAL: Maintain exact facial identity. Photorealistic style. Excited expression, party background or cozy home setting.',
    image: getPreviewUrl('woman holding gift box happy', 1509)
  },
  {
    id: 'dating-cinema',
    category: 'dating',
    title: 'Кинотеатр',
    description: 'Просмотр фильма',
    prompt: 'Show the person from the photo on a date at the cinema. CRUCIAL: Preserve facial identity. Photorealistic style. Eating popcorn, watching a movie, cozy atmosphere, dim lighting.',
    image: getPreviewUrl('couple in cinema eating popcorn', 1510)
  },

  // --- SPORTS CATEGORY ---
  {
    id: 'sports-karate',
    category: 'sports',
    title: 'Каратэ',
    description: 'Единоборства',
    prompt: 'Show the person from the photo dressed in a clean white karate gi with a black belt, performing a dynamic martial arts kick. CRUCIAL: Keep the face exactly identical to the original photo. Photorealistic style, detailed skin texture. Background: traditional Japanese dojo with tatami mats.',
    image: getPreviewUrl('karate martial arts kick dojo', 1401)
  },
  {
    id: 'sports-tennis',
    category: 'sports',
    title: 'Теннис',
    description: 'Корт',
    prompt: 'Show the person from the photo dressed in professional tennis sportswear holding a racket. CRUCIAL: Preserve the facial features exactly. Photorealistic style. Ready to serve on a clay tennis court. Sunny day, dynamic action pose.',
    image: getPreviewUrl('tennis player clay court sunny', 1402)
  },
  {
    id: 'sports-fit-girl',
    category: 'sports',
    title: 'Фитнес (Ж)',
    description: 'Спортивное тело',
    prompt: 'Enhance the physique of the person from the photo to look like a fitness model. Toned athletic body, defined abs, wearing stylish gym activewear. CRUCIAL: Keep the face completely unchanged and recognizable. Photorealistic style, detailed natural skin texture, visible pores. Professional fitness photography in a modern gym.',
    image: getPreviewUrl('fitness model woman gym abs', 1403)
  },
  {
    id: 'sports-fit-guy',
    category: 'sports',
    title: 'Фитнес (М)',
    description: 'Рельефные мышцы',
    prompt: 'Enhance the physique of the person from the photo to look like a fitness model. Muscular definition, broad shoulders, six-pack abs, athletic build. CRUCIAL: Maintain the exact facial identity. Photorealistic style, detailed skin texture. Gym setting with dramatic lighting.',
    image: getPreviewUrl('fitness model man muscular gym', 1404)
  },
  {
    id: 'sports-olympia',
    category: 'sports',
    title: 'Бодибилдинг',
    description: 'Мистер Олимпия',
    prompt: 'Transform the person from the photo into a Mr. Olympia bodybuilding champion body type while keeping the face exactly as is in the original photo. CRUCIAL: Preserve facial identity. Photorealistic style, detailed skin texture. Extreme muscle mass, veins, definition, stage tan, posing trunks, bright stage lighting.',
    image: getPreviewUrl('bodybuilder mr olympia muscle stage', 1405)
  },
  {
    id: 'sports-running',
    category: 'sports',
    title: 'Бег',
    description: 'Марафон',
    prompt: 'Show the person from the photo running in a park or on a track, wearing professional running gear. CRUCIAL: Preserve the face exactly. Photorealistic style. Motion blur background, athletic determination, morning sunlight.',
    image: getPreviewUrl('runner sprinting track motion blur', 1406)
  },
  {
    id: 'sports-boxing',
    category: 'sports',
    title: 'Бокс',
    description: 'На ринге',
    prompt: 'Show the person from the photo wearing boxing gloves and shorts, standing in a boxing ring. CRUCIAL: Keep the face exactly identical. Photorealistic style, detailed skin texture. Sweat on skin, intense look, dramatic arena lighting.',
    image: getPreviewUrl('boxer in ring gloves dramatic lighting', 1407)
  },
  {
    id: 'sports-yoga',
    category: 'sports',
    title: 'Йога',
    description: 'Гибкость',
    prompt: 'Show the person from the photo doing a yoga pose on a mat in a peaceful studio or nature setting at sunset. CRUCIAL: Maintain exact facial identity. Photorealistic style. Flexibility, calm atmosphere, athletic yoga wear.',
    image: getPreviewUrl('yoga pose sunset nature flexibility', 1408)
  },
  {
    id: 'sports-swimming',
    category: 'sports',
    title: 'Плавание',
    description: 'Бассейн',
    prompt: 'Show the person from the photo as a swimmer in a pool wearing goggles and cap, emerging from the water. CRUCIAL: Preserve facial identity. Photorealistic style. Water droplets, athletic shoulders.',
    image: getPreviewUrl('swimmer pool goggles water splash', 1409)
  },
  {
    id: 'sports-soccer',
    category: 'sports',
    title: 'Футбол',
    description: 'Стадион',
    prompt: 'Show the person from the photo wearing a soccer jersey and cleats, dribbling a ball on a large green stadium field at night. CRUCIAL: Keep the face unchanged. Photorealistic style. Floodlights background.',
    image: getPreviewUrl('soccer player stadium night floodlights', 1410)
  },

  // --- RESTAURANTS CATEGORY ---
  {
    id: 'restaurant-michelin',
    category: 'restaurants',
    title: 'Мишлен',
    description: 'Высокая кухня',
    prompt: 'Professional food photography, fine dining style. Elegant dark plating, tweezers precision, dramatic moody lighting, white tablecloth. Photorealistic.',
    image: getPreviewUrl('michelin star food plating fine dining', 1301)
  },
  {
    id: 'restaurant-full',
    category: 'restaurants',
    title: 'Полная посадка',
    description: 'Атмосфера ресторана',
    prompt: 'Show the dish on a table in a bustling, crowded restaurant. Blurred background of happy customers chatting and eating. Warm, lively atmosphere. Photorealistic.',
    image: getPreviewUrl('bustling restaurant crowd background food', 1302)
  },
  {
    id: 'restaurant-terrace',
    category: 'restaurants',
    title: 'Терраса',
    description: 'На свежем воздухе',
    prompt: 'Food photography on an outdoor restaurant terrace. Bright sunlight, dappled shadows from trees, summer vibe, glass of lemonade nearby. Photorealistic.',
    image: getPreviewUrl('restaurant summer terrace food sunny', 1303)
  },
  {
    id: 'restaurant-romantic',
    category: 'restaurants',
    title: 'Романтический ужин',
    description: 'Свечи и вино',
    prompt: 'Romantic dinner setting. Dim warm lighting, candles on the table, two glasses of red wine, bokeh background. Intimate atmosphere. Photorealistic.',
    image: getPreviewUrl('romantic dinner food candles wine', 1304)
  },
  {
    id: 'restaurant-chef',
    category: 'restaurants',
    title: 'Шеф-повар',
    description: 'Презентация блюда',
    prompt: 'Close up of a professional chef in a white uniform holding the plate with the dish towards the camera. Commercial kitchen background. Photorealistic.',
    image: getPreviewUrl('chef holding plate of food', 1305)
  },
  {
    id: 'restaurant-steam',
    category: 'restaurants',
    title: 'Горячее блюдо',
    description: 'Пар и свежесть',
    prompt: 'Appetizing food photography with visible steam rising from the hot dish. Fresh ingredients, macro shot, shallow depth of field. Photorealistic.',
    image: getPreviewUrl('hot food steam appetizing macro', 1306)
  },
  {
    id: 'restaurant-burger',
    category: 'restaurants',
    title: 'Бургер',
    description: 'Крафт и Неон',
    prompt: 'Juicy fast food photography. Dark wooden table, craft paper, neon sign in background. Greasy, delicious, dynamic angle. Photorealistic.',
    image: getPreviewUrl('juicy burger neon background craft', 1307)
  },
  {
    id: 'restaurant-breakfast',
    category: 'restaurants',
    title: 'Завтрак',
    description: 'Утренний кофе',
    prompt: 'Morning breakfast setting. Bright airy light, cup of coffee with latte art, newspaper, fresh flowers on a white marble table. Photorealistic.',
    image: getPreviewUrl('breakfast food coffee morning light', 1308)
  },
  {
    id: 'restaurant-asian',
    category: 'restaurants',
    title: 'Азия',
    description: 'Вок и палочки',
    prompt: 'Asian cuisine styling. Slate plate, chopsticks, bamboo mat, steam, dark moody lighting with red accents. Photorealistic.',
    image: getPreviewUrl('asian food sushi ramen chopsticks', 1309)
  },
  {
    id: 'restaurant-flatlay',
    category: 'restaurants',
    title: 'Меню (Сверху)',
    description: 'Раскладка блюд',
    prompt: 'Flat lay top-down view of a table full of different dishes. Feast style, shared plates, beautiful composition for a menu cover. Photorealistic.',
    image: getPreviewUrl('table full of food flat lay top view', 1310)
  },

  // --- BLOGGERS CATEGORY ---
  {
    id: 'blogger-photoshoot',
    category: 'bloggers',
    title: 'Фотосессия',
    description: 'Бэкстейдж',
    prompt: 'Show the person from the photo as a model in a professional fashion photoshoot backstage. CRUCIAL: Keep the face exactly identical. Posing, photographer in background, bright studio lighting equipment, flashes firing, busy creative atmosphere. Photorealistic style, detailed skin texture.',
    image: getPreviewUrl('fashion photoshoot backstage studio flash', 1011)
  },
  {
    id: 'blogger-autograph',
    category: 'bloggers',
    title: 'Автограф-сессия',
    description: 'Встреча с фанатами',
    prompt: 'Show the person from the photo as a famous influencer signing autographs for fans. CRUCIAL: Preserve facial identity. Photorealistic style, detailed skin texture. Crowded event, holding a marker, happy fans in background, posters, paparazzi style flashes.',
    image: getPreviewUrl('celebrity signing autographs fans', 1012)
  },
  {
    id: 'blogger-stream-star',
    category: 'bloggers',
    title: 'Стрим со звездой',
    description: 'В эфире',
    prompt: 'Show the person from the photo as a streamer sitting next to a famous celebrity guest. CRUCIAL: Maintain exact facial identity. Photorealistic style, detailed skin texture. High energy live stream setup, wide angle shot of a room with LED lights, laughing, microphone arms, crazy atmosphere.',
    image: getPreviewUrl('streamer with celebrity guest energetic room', 1013)
  },
  {
    id: 'blogger-podcast',
    category: 'bloggers',
    title: 'Подкаст',
    description: 'Интервью',
    prompt: 'Show the person from the photo in a professional podcast studio with microphone and headphones, neon sign in background. CRUCIAL: Keep the face exactly identical. Photorealistic style.',
    image: getPreviewUrl('man speaking into podcast microphone studio', 1001)
  },
  {
    id: 'blogger-gaming',
    category: 'bloggers',
    title: 'Геймер',
    description: 'Игровая комната',
    prompt: 'Show the person from the photo in a gaming room with RGB lighting, gaming chair, and multiple monitors. CRUCIAL: Preserve facial identity. Photorealistic style.',
    image: getPreviewUrl('gamer in rgb room headset', 1002)
  },
  {
    id: 'blogger-coffee',
    category: 'bloggers',
    title: 'Кофейня',
    description: 'Работа за ноутом',
    prompt: 'Aesthetic photo of the person from the photo working on laptop in a stylish minimalist coffee shop. CRUCIAL: Maintain exact facial identity. Photorealistic style.',
    image: getPreviewUrl('girl working laptop coffee shop', 1003)
  },
  {
    id: 'blogger-travel',
    category: 'bloggers',
    title: 'Тревел-блог',
    description: 'Тропики',
    prompt: 'Travel blogger style. Show the person from the photo holding a coconut on a tropical beach with palm trees. CRUCIAL: Keep the face exactly identical. Photorealistic style.',
    image: getPreviewUrl('girl on tropical beach coconut', 1004)
  },
  {
    id: 'blogger-fashion',
    category: 'bloggers',
    title: 'Стритстайл',
    description: 'Городская мода',
    prompt: 'Fashion blogger street style photo. Show the person from the photo walking down a city street, holding a coffee cup, stylish outfit. CRUCIAL: Preserve facial identity. Photorealistic style.',
    image: getPreviewUrl('fashion blogger walking city street', 1005)
  },
  {
    id: 'blogger-fitness',
    category: 'bloggers',
    title: 'Йога Блог',
    description: 'ЗОЖ',
    prompt: 'Fitness blogger. Show the person from the photo doing yoga in a bright studio with plants. Athletic wear. CRUCIAL: Maintain exact facial identity. Photorealistic style.',
    image: getPreviewUrl('girl doing yoga bright studio', 1006)
  },
  {
    id: 'blogger-food',
    category: 'bloggers',
    title: 'Фуд-блог',
    description: 'Обзор еды',
    prompt: 'Show the person from the photo sitting at a table full of delicious brunch food, holding a fork, smiling. CRUCIAL: Keep the face exactly identical. Photorealistic style.',
    image: getPreviewUrl('girl eating brunch cafe', 1007)
  },
  {
    id: 'blogger-car',
    category: 'bloggers',
    title: 'Авто-блог',
    description: 'За рулем',
    prompt: 'Car vlogger style. Show the person from the photo sitting in the driver seat of a luxury car, hands on steering wheel. CRUCIAL: Preserve facial identity. Photorealistic style.',
    image: getPreviewUrl('man driving luxury car interior', 1008)
  },
  {
    id: 'blogger-minimal',
    category: 'bloggers',
    title: 'Рабочее место',
    description: 'Минимализм',
    prompt: 'Minimalist aesthetic lifestyle shot. Show the person from the photo sitting at a clean white desk with a macbook and plant. CRUCIAL: Maintain exact facial identity. Photorealistic style.',
    image: getPreviewUrl('minimalist home office white desk', 1009)
  },
  {
    id: 'blogger-party',
    category: 'bloggers',
    title: 'Вечеринка',
    description: 'Ночная жизнь',
    prompt: 'Lifestyle party shot. Show the person from the photo on a rooftop bar at night with city lights, holding a drink. CRUCIAL: Keep the face exactly identical. Photorealistic style.',
    image: getPreviewUrl('rooftop party night city lights', 1010)
  },

  // --- RICH LIFE CATEGORY ---
  {
    id: 'rich-jet',
    category: 'rich_life',
    title: 'Частный Джет',
    description: 'Первый класс',
    prompt: 'Place the person in a luxury private jet cabin with leather cream seats and champagne. CRUCIAL: Preserve the facial features exactly. Photorealistic style, detailed skin texture.',
    image: getPreviewUrl('luxury private jet interior leather seats', 1101)
  },
  {
    id: 'rich-yacht',
    category: 'rich_life',
    title: 'Яхта',
    description: 'Океан',
    prompt: 'Place the person on the deck of a luxury superyacht in the ocean. White clothes, sunglasses, blue water. CRUCIAL: Maintain exact facial identity. Photorealistic style.',
    image: getPreviewUrl('man on luxury yacht deck ocean', 1102)
  },
  {
    id: 'rich-villa',
    category: 'rich_life',
    title: 'Вилла',
    description: 'Инфинити бассейн',
    prompt: 'Place the person in a luxury infinity pool at a modern villa overlooking the sea at sunset. CRUCIAL: Keep the face exactly identical. Photorealistic style.',
    image: getPreviewUrl('infinity pool luxury villa sunset', 1103)
  },
  {
    id: 'rich-supercar',
    category: 'rich_life',
    title: 'Суперкар',
    description: 'Lamborghini',
    prompt: 'Person leaning against a bright lime green Lamborghini supercar. Urban background. CRUCIAL: Preserve facial identity. Photorealistic style.',
    image: getPreviewUrl('man leaning on green lamborghini', 1104)
  },
  {
    id: 'rich-penthouse',
    category: 'rich_life',
    title: 'Пентхаус',
    description: 'Вид на город',
    prompt: 'Person standing near floor-to-ceiling windows in a luxury penthouse apartment with night city skyline view. CRUCIAL: Maintain exact facial identity. Photorealistic style.',
    image: getPreviewUrl('luxury penthouse night city view', 1105)
  },
  {
    id: 'rich-shopping',
    category: 'rich_life',
    title: 'Шопинг',
    description: 'Брендовые пакеты',
    prompt: 'Person walking carrying many luxury brand shopping bags (Gucci, LV, Prada). High-end street. CRUCIAL: Keep the face exactly identical. Photorealistic style.',
    image: getPreviewUrl('woman with luxury shopping bags', 1106)
  },
  {
    id: 'rich-champagne',
    category: 'rich_life',
    title: 'Шампанское',
    description: 'Бокал Crystal',
    prompt: 'Close up of person holding a crystal glass of expensive champagne at a gala dinner. CRUCIAL: Preserve facial identity. Photorealistic style.',
    image: getPreviewUrl('hand holding champagne glass party', 1107)
  },
  {
    id: 'rich-helicopter',
    category: 'rich_life',
    title: 'Вертолет',
    description: 'Полет над городом',
    prompt: 'Person sitting in a helicopter with headsets on, looking out the window at the view. CRUCIAL: Maintain exact facial identity. Photorealistic style.',
    image: getPreviewUrl('person in helicopter headset', 1108)
  },
  {
    id: 'rich-golf',
    category: 'rich_life',
    title: 'Гольф',
    description: 'Закрытый клуб',
    prompt: 'Person posing on a pristine golf course with a golf club. Country club atmosphere. CRUCIAL: Keep the face exactly identical. Photorealistic style.',
    image: getPreviewUrl('man playing golf country club', 1109)
  },
  {
    id: 'rich-watch',
    category: 'rich_life',
    title: 'Часы',
    description: 'Rolex на руке',
    prompt: 'Focus on a luxury gold watch on the person\'s wrist. Driving a luxury car or in a suit. Photorealistic style.',
    image: getPreviewUrl('luxury gold watch on wrist', 1110)
  },

  // --- FAMILY CATEGORY (REFINED PROMPTS) ---
  {
    id: 'family-addams',
    category: 'family',
    title: 'Семейка Аддамс',
    description: 'Готический стиль',
    prompt: 'Transform the specific family/group from the uploaded photo into a dark, elegant gothic masterpiece. High-contrast cinematic lighting. Everyone dressed in high-quality black velvet and lace formal wear. CRUCIAL: Each person in the output must have a 100% identical face to their counterpart in the original photo. No AI face genericizing. Detailed skin texture, photorealistic, professional dark studio atmosphere. Maintain individual heights and positions.',
    image: getPreviewUrl('gothic family portrait elegant black clothes cinematic', 101)
  },
  {
    id: 'family-wild-west',
    category: 'family',
    title: 'Дикий Запад',
    description: 'Ковбои',
    prompt: 'CRUCIAL: Preserve facial identity exactly. Dress the group as cowboys and sheriffs. Hats, leather vests, boots. Background: old western saloon. Photorealistic style.',
    image: getPreviewUrl('cowboy family portrait western hats', 102)
  },
  {
    id: 'family-vikings',
    category: 'family',
    title: 'Викинги',
    description: 'Воины севера',
    prompt: 'CRUCIAL: Preserve facial identity exactly. Dress everyone as fierce vikings with furs, leather armor, and horned helmets. Background: misty fjord. Photorealistic style.',
    image: getPreviewUrl('viking family portrait fur armor helmets', 103)
  },
  {
    id: 'family-royal',
    category: 'family',
    title: 'Королевская семья',
    description: 'Ренессанс',
    prompt: 'CRUCIAL: Preserve facial identity exactly. Dress everyone in luxurious renaissance royal clothes, velvet robes, crowns. Background: palace throne room. Photorealistic style.',
    image: getPreviewUrl('royal family portrait king queen crowns', 104)
  },
  {
    id: 'family-pajamas',
    category: 'family',
    title: 'Пижамная вечеринка',
    description: 'Кигуруми',
    prompt: 'CRUCIAL: Preserve facial identity exactly. Dress everyone in matching funny colorful animal onesies (kigurumi). Background: cozy bedroom. Photorealistic style.',
    image: getPreviewUrl('family in colorful animal onesies pajamas', 105)
  },
  {
    id: 'family-space',
    category: 'family',
    title: 'Космос',
    description: 'Экипаж корабля',
    prompt: 'CRUCIAL: Preserve facial identity exactly. Dress everyone in futuristic sci-fi space uniforms. Background: spaceship bridge with stars. Photorealistic style.',
    image: getPreviewUrl('family in sci-fi space uniforms spaceship', 106)
  },
  {
    id: 'family-cavemen',
    category: 'family',
    title: 'Пещерные люди',
    description: 'Каменный век',
    prompt: 'CRUCIAL: Preserve facial identity exactly. Dress everyone in leopard prints and animal furs, holding wooden clubs. Background: stone cave. Photorealistic style.',
    image: getPreviewUrl('caveman family portrait leopard fur', 107)
  },
  {
    id: 'family-sweaters',
    category: 'family',
    title: 'Свитеры',
    description: 'Смешные рождественские',
    prompt: 'Show the family/group from the uploaded photo wearing matching hilarious, highly detailed ugly Christmas sweaters. CRUCIAL: All individuals must retain 100% identical facial features and expressions from the original photo. No plastic smoothing. Realistic wool textures. Background: a cozy wooden cabin with a warm fireplace and holiday lights. Photorealistic 8k.',
    image: getPreviewUrl('family in ugly christmas sweaters cozy cabin', 108)
  },
  {
    id: 'family-zombies',
    category: 'family',
    title: 'Зомби',
    description: 'Апокалипсис',
    prompt: 'CRUCIAL: Preserve facial identity exactly. Turn the family into funny green zombies. Background: abandoned city.',
    image: getPreviewUrl('cartoon zombie family green skin', 109)
  },
  {
    id: 'family-cartoon',
    category: 'family',
    title: 'Симпсоны',
    description: 'Мультфильм',
    prompt: 'Transform the image into a famous 2D cartoon style with yellow skin. Background: suburban living room.',
    image: getPreviewUrl('cartoon family yellow skin sitting on couch', 110)
  },

  // --- DOCUMENTS CATEGORY ---
  {
    id: 'passport',
    category: 'documents',
    title: 'На паспорт',
    description: 'Белый фон, официально',
    prompt: 'Generate a professional passport photo of the person from the uploaded image. CRUCIAL: Keep the face exactly identical to the original photo. Do not alter facial features. Apply a clean, even white background. Soft, balanced lighting, formal appearance. Photorealistic style, detailed skin texture.',
    image: getPreviewUrl('man face passport photo white background', 301)
  },
  {
    id: 'resume-office',
    category: 'documents',
    title: 'Для резюме',
    description: 'Офисный стиль',
    prompt: 'Show the person from the photo in a professional business suit. CRUCIAL: Maintain exact facial identity. Background: blurred modern office environment. Soft professional lighting, confident look. Photorealistic style, detailed skin texture.',
    image: getPreviewUrl('business woman portrait office background', 302)
  },
  {
    id: 'resume-studio',
    category: 'documents',
    title: 'Деловой портрет',
    description: 'Серый фон',
    prompt: 'Studio business portrait of the person from the photo. CRUCIAL: Do not change the face. Keep facial features exactly as in the original. Neutral grey gradient background. Rembrandt lighting. Photorealistic style, detailed skin texture.',
    image: getPreviewUrl('man studio portrait grey background', 303)
  },

  // --- ECOMMERCE CATEGORY ---
  {
    id: 'product-podium',
    category: 'ecommerce',
    title: '3D Подиум',
    description: 'Минимализм',
    prompt: 'Place product on stylish minimalist 3D podium. Pastel colors, soft shadows. Photorealistic product photography.',
    image: getPreviewUrl('product podium pastel 3d render', 501)
  },
  {
    id: 'product-nature',
    category: 'ecommerce',
    title: 'Природа',
    description: 'Камни и мох',
    prompt: 'Product photography on nature. Mossy stones, sunlight, bokeh. Organic vibe. Photorealistic.',
    image: getPreviewUrl('product bottle on mossy stone nature', 502)
  },
  {
    id: 'product-luxury',
    category: 'ecommerce',
    title: 'Премиум',
    description: 'Черное и золото',
    prompt: 'Luxury product photography. Black background with golden accents and dramatic lighting, premium look. Photorealistic.',
    image: getPreviewUrl('luxury product black gold background', 503)
  },

  // --- BUSINESS CATEGORY ---
  {
    id: 'business-startup',
    category: 'business',
    title: 'Стартап',
    description: 'Современный офис',
    prompt: 'Business portrait in a modern startup office. Glass walls, casual professional attire, confident smile. CRUCIAL: Keep the face exactly identical. Photorealistic style, detailed skin texture.',
    image: getPreviewUrl('startup founder modern office', 801)
  },
  {
    id: 'business-speech',
    category: 'business',
    title: 'Выступление',
    description: 'На сцене',
    prompt: 'Person giving a business presentation on stage. Ted talk style, spotlight, screen in background. CRUCIAL: Preserve facial identity. Photorealistic style.',
    image: getPreviewUrl('person giving business presentation stage', 802)
  },

  // --- UGC CATEGORY ---
  {
    id: 'ugc-unboxing',
    category: 'ugc',
    title: 'Анпакинг',
    description: 'Распаковка',
    prompt: 'UGC style photo of person unboxing a package. Excited expression, hands visible, living room background. CRUCIAL: Keep the face exactly identical. Photorealistic style.',
    image: getPreviewUrl('person unboxing package excited', 901)
  },
  {
    id: 'ugc-review',
    category: 'ugc',
    title: 'Отзыв',
    description: 'Лайк товару',
    prompt: 'UGC product review. Person holding a product close to camera, thumbs up, domestic setting. CRUCIAL: Preserve facial identity. Photorealistic style.',
    image: getPreviewUrl('person reviewing product thumbs up', 902)
  }
];

const TemplateGrid: React.FC<TemplateGridProps> = ({ category, onSelect }) => {
  const filteredPresets = ALL_PRESETS.filter(preset => {
    if (category === 'all') return true;
    if (category === 'trending') return ['christmas-grinch', 'tet-traditional-yellow', 'market-shopee-hero', 'kids-dinosaur', 'makeup-bridal'].includes(preset.id);
    if (category === 'new') return ['market-fb-minimal', 'market-insta-story', 'tet-hoi-an', 'kids-chef', 'makeup-festival'].includes(preset.id);
    if (category === 'saved') return false; 
    return preset.category === category;
  });

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {filteredPresets.map((preset) => (
        <button
          key={preset.id}
          onClick={() => onSelect(preset)}
          className="group relative aspect-[3/4] rounded-xl overflow-hidden border border-brand-border bg-brand-card hover:border-brand-accent transition-all duration-300 text-left"
        >
          {/* Image */}
          <div className="absolute inset-0 bg-black">
             <img 
               src={preset.image || FALLBACK_IMAGES[preset.category] || FALLBACK_IMAGES.default}
               alt={preset.title}
               className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
               loading="lazy"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent group-hover:from-black/80 transition-all" />
          </div>

          {/* Content */}
          <div className="absolute inset-0 p-4 flex flex-col justify-end">
            <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
               <h3 className="text-white font-bold text-sm md:text-base leading-tight mb-1 group-hover:text-brand-accent transition-colors">
                 {preset.title}
               </h3>
               <p className="text-xs text-brand-muted line-clamp-2 opacity-80 group-hover:opacity-100 transition-opacity">
                 {preset.description}
               </p>
            </div>
            
            {/* Hover Action */}
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
               <div className="w-8 h-8 rounded-full bg-brand-accent flex items-center justify-center text-white shadow-lg">
                  <ArrowRight className="w-4 h-4" />
               </div>
            </div>
          </div>
        </button>
      ))}
      
      {filteredPresets.length === 0 && (
        <div className="col-span-full flex flex-col items-center justify-center py-12 text-center text-brand-muted">
           <Sparkles className="w-12 h-12 mb-4 opacity-20" />
           <p>В этой категории пока нет шаблонов.</p>
           <p className="text-xs mt-1 opacity-50">Загляните позже.</p>
        </div>
      )}
    </div>
  );
};

export default TemplateGrid;
