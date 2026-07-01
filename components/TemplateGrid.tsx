
import React from 'react';
import { Preset, CategoryId } from '../types';
import { Sparkles, Plus, Check } from 'lucide-react';

interface TemplateGridProps {
  category: CategoryId;
  onSelect: (preset: Preset) => void;
  selectedId?: string | null;
  sort?: 'popular' | 'new' | 'az';
}

// Ids considered "popular" (surface first when sorting by popularity) and "new" (recent additions).
const POPULAR_IDS = new Set([
  'retro-polaroid-classic', 'tet-traditional-yellow', 'market-shopee-hero', 'kids-dinosaur', 'makeup-bridal',
  'fashion-cyber', 'business-startup', 'soviet-gentlemen', 'rich-penthouse', 'dating-restaurant', 'sports-olympia',
]);
const NEW_IDS = new Set([
  'retro-vhs-grain', 'market-fb-minimal', 'market-insta-story', 'tet-hoi-an', 'kids-chef', 'makeup-festival',
  'doc-schengen', 'doc-us-visa', 'doc-canada', 'doc-uk',
]);

// Fallback images map in case generation fails
const FALLBACK_IMAGES: Record<string, string> = {
  formula1: 'https://images.unsplash.com/photo-1574786198875-49f5d09fd272?auto=format&fit=crop&w=400&q=60',
  retro: 'https://images.unsplash.com/photo-1495707902641-75cac588d2e9?auto=format&fit=crop&w=400&q=60',
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
  // Reverting to image.pollinations.ai (Legacy/Stable) as per user request to "make it as before".
  // This endpoint often overrides rate limits or caches better for public usage.
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
    image: '/templates/market-shopee-hero.webp'
  },
  {
    id: 'market-fb-minimal',
    category: 'marketplaces',
    title: 'Facebook Реклама',
    description: 'Минимализм',
    prompt: 'Show the product from the input image placed on a clean minimalist surface. Soft pastel background colors (beige or sage green). Hard sunlight shadows (gobolight effect) of palm leaves falling on the product. CRUCIAL: Keep the product exactly identical. High-end lifestyle vibe.',
    image: '/templates/market-fb-minimal.webp'
  },
  {
    id: 'market-insta-story',
    category: 'marketplaces',
    title: 'Instagram Stories',
    description: 'POV в руке',
    prompt: 'First-person POV shot. Show a hand holding the product from the input image against a blurred aesthetic coffee shop or city street background. CRUCIAL: Preserve the product exactly. Natural lighting, authentic influencer vibe, vertical composition.',
    image: '/templates/market-insta-story.webp'
  },
  {
    id: 'market-cosmetic-water',
    category: 'marketplaces',
    title: 'Косметика (Luxury)',
    description: 'Текстура воды/шелка',
    prompt: 'Show the product from the input image floating in crystal clear water ripples or flowing silk texture. Soft pink or gold tones. Bokeh sparkles. CRUCIAL: Preserve the product appearance exactly. Fresh, hydrating, premium look. Commercial photography.',
    image: '/templates/market-cosmetic-water.webp'
  },
  {
    id: 'market-tech-neon',
    category: 'marketplaces',
    title: 'Техно Неон',
    description: 'Cyberpunk & Игры',
    prompt: 'Show the product from the input image placed in a futuristic dark mode setting. Glowing neon blue and purple rim lighting on the product. Circuit board patterns or abstract geometric 3D shapes floating. CRUCIAL: Preserve the product exactly. Sleek, modern, high-tech vibe.',
    image: '/templates/market-tech-neon.webp'
  },
  {
    id: 'market-food-splash',
    category: 'marketplaces',
    title: 'Еда и Напитки',
    description: 'Свежесть и брызги',
    prompt: 'Show the product from the input image surrounded by a fresh water or milk splash. Flying fresh fruits (lemon, strawberry, mint leaves) in the air around the product. CRUCIAL: Preserve the product exactly. Bright, energetic, juicy atmosphere. Solid bright color background.',
    image: '/templates/market-food-splash.webp'
  },
  {
    id: 'market-glassmorphism',
    category: 'marketplaces',
    title: 'Стекломорфизм',
    description: 'Современный UI фон',
    prompt: 'Show the product from the input image floating in front of frosted glass panels. Soft, multi-colored gradient orbs floating behind. CRUCIAL: Preserve the product exactly. Modern UI style, clean, 3D abstract art direction.',
    image: '/templates/market-glassmorphism.webp'
  },
  {
    id: 'market-black-friday',
    category: 'marketplaces',
    title: 'Черная Пятница',
    description: 'Распродажа',
    prompt: 'Show the product from the input image on a dark black matte texture background. Glossy 3D black balloons and bold red neon lights around it. CRUCIAL: Preserve the product appearance exactly. Urgent, bold, premium discount vibe.',
    image: '/templates/market-black-friday.webp'
  },
  {
    id: 'market-podium-nature',
    category: 'marketplaces',
    title: 'Эко Подиум',
    description: 'Дерево и зелень',
    prompt: 'Show the product from the input image standing on a natural wooden log podium. Surrounded by real moss, stones, and ferns. CRUCIAL: Preserve the product exactly. Dappled forest sunlight. Organic, eco-friendly atmosphere.',
    image: '/templates/market-podium-nature.webp'
  },
  {
    id: 'market-fashion-studio',
    category: 'marketplaces',
    title: 'Фэшн Студия',
    description: 'Абстрактный фон',
    prompt: 'Show the product from the input image placed in a high-end fashion studio setting. Abstract architectural shapes (arches, stairs) in monochrome white or concrete. CRUCIAL: Preserve the product exactly. Soft diffused studio lighting, long shadows.',
    image: '/templates/market-fashion-studio.webp'
  },

  // --- NEW MARKETPLACE PRESETS (General) ---
  {
    id: 'market-kitchen',
    category: 'marketplaces',
    title: 'На кухне',
    description: 'Уютный интерьер',
    prompt: 'Show the product from the input image placed on a clean marble kitchen countertop. Bright morning sunlight through the window, blurred modern kitchen interior in background. Fresh ingredients nearby. CRUCIAL: Preserve product details exactly. Photorealistic lifestyle photography.',
    image: '/templates/market-kitchen.webp'
  },
  {
    id: 'market-bathroom',
    category: 'marketplaces',
    title: 'Ванная / SPA',
    description: 'Для ухода',
    prompt: 'Show the product from the input image standing on a white ceramic bathroom sink shelf. Mirror reflection, soft steam, clean white towels in background. CRUCIAL: Preserve product details exactly. Spa atmosphere, fresh and clean.',
    image: '/templates/market-bathroom.webp'
  },
  {
    id: 'market-office',
    category: 'marketplaces',
    title: 'Рабочий стол',
    description: 'Офис и Гаджеты',
    prompt: 'Show the product from the input image placed on a wooden office desk next to a laptop and a cup of coffee. Warm desk lamp lighting, cozy productivity vibe. CRUCIAL: Preserve product details exactly. Photorealistic office setting.',
    image: '/templates/market-office.webp'
  },
  {
    id: 'market-gym',
    category: 'marketplaces',
    title: 'Фитнес зал',
    description: 'Спорт товары',
    prompt: 'Show the product from the input image placed on a black rubber gym floor. Blurred gym equipment and dumbbells in the background. Dramatic sports lighting. CRUCIAL: Preserve product details exactly. Energetic, strong atmosphere.',
    image: '/templates/market-gym.webp'
  },
  {
    id: 'market-silk',
    category: 'marketplaces',
    title: 'Шелк и Роскошь',
    description: 'Ювелирный стиль',
    prompt: 'Show the product from the input image lying on luxurious draped red or champagne colored silk fabric. Soft elegant folds, expensive studio lighting. CRUCIAL: Preserve product details exactly. Jewelry store advertisement style.',
    image: '/templates/market-silk.webp'
  },

  // --- NEW: MARKETPLACE INFOGRAPHICS & SPECIFIC STYLES ---
  {
    id: 'market-autumn-cozy',
    category: 'marketplaces',
    title: 'Осенний Уют',
    description: 'Тепло и стиль',
    prompt: 'Show the product from the input image placed on a soft knitted beige scarf. Red and orange autumn maple leaves falling around. Steam rising from the product (if appropriate). Warm golden hour backlight. Detailed texture. Marketplace card style. Ideal for thermos, mugs, warm clothing.',
    image: '/templates/market-autumn-cozy.webp'
  },
  {
    id: 'market-fresh-avocado',
    category: 'marketplaces',
    title: 'Свежесть & Авокадо',
    description: 'Бьюти инфографика',
    prompt: 'Show the product from the input image centered, surrounded by fresh flying water splashes and green avocado slices. Tropical monstera leaves in the background. Bright gradient green background. Freshness and hydration concept. Commercial cosmetic photography.',
    image: '/templates/market-fresh-avocado.webp'
  },
  {
    id: 'market-tech-specs',
    category: 'marketplaces',
    title: 'Умный Гаджет',
    description: 'Технический стиль',
    prompt: 'Show the product from the input image in a high-tech setting. Dark background with glowing blue technical lines and floating HUD interface elements (battery icon, wifi icon, temperature). Sleek, modern, premium electronics presentation. 3D render style.',
    image: '/templates/market-tech-specs.webp'
  },
  {
    id: 'market-sale-banner',
    category: 'marketplaces',
    title: 'Супер Цена',
    description: 'Яркий акцент',
    prompt: 'Show the product from the input image on a vibrant yellow and red background. 3D percent signs (%) and red "Sale" tags floating around. High contrast, bold commercial lighting. Attention grabbing design for clearance sales.',
    image: '/templates/market-sale-banner.webp'
  },
  {
    id: 'market-eco-bamboo',
    category: 'marketplaces',
    title: 'Эко Бамбук',
    description: 'Натуральность',
    prompt: 'Show the product from the input image standing on a bamboo mat. Green bamboo stalks and smooth zen stones in the background. Soft daylight. Natural, organic, eco-friendly product presentation. Spa and wellness vibe.',
    image: '/templates/market-eco-bamboo.webp'
  },

  // --- KIDS CATEGORY ---
  {
    id: 'kids-roblox',
    category: 'kids',
    title: 'Стиль Roblox',
    description: 'Мир блоков',
    prompt: 'Turn the person into a 3D Roblox character style. Plastic texture, blocky body, friendly face. Background: colorful obby parkour.',
    image: '/templates/kids-roblox.webp'
  },
  {
    id: 'kids-lego',
    category: 'kids',
    title: 'LEGO',
    description: 'Конструктор',
    prompt: 'Turn the person into a realistic 3D LEGO minifigure. Plastic glossy texture, c-shaped hands. Background: lego city.',
    image: '/templates/kids-lego.webp'
  },
  {
    id: 'kids-minecraft',
    category: 'kids',
    title: 'Minecraft',
    description: 'Пиксели',
    prompt: 'Turn the person into a Minecraft voxel character. Square head, pixelated texture. Background: blocky landscape with trees.',
    image: '/templates/kids-minecraft.webp'
  },
  {
    id: 'kids-stalcraft',
    category: 'kids',
    title: 'Stalcraft',
    description: 'Кубический воин',
    prompt: 'Turn the person into a Stalcraft game character. Minecraft style cubic body but wearing tactical stalker gear, gas mask, dark atmosphere. Background: exclusion zone.',
    image: '/templates/kids-stalcraft.webp'
  },
  {
    id: 'superhero',
    category: 'kids',
    title: 'Супергерой',
    description: 'Плащ и маска',
    prompt: 'Turn child into a superhero. Cape, futuristic suit. Background: night city lights. CRUCIAL: Preserve facial identity. Photorealistic style.',
    image: '/templates/superhero.webp'
  },
  {
    id: 'fairy',
    category: 'kids',
    title: 'Фея',
    description: 'Волшебный лес',
    prompt: 'Add transparent fairy wings. Background: magical forest with giant flowers and fireflies. CRUCIAL: Preserve facial identity. Photorealistic style.',
    image: '/templates/fairy.webp'
  },
  {
    id: 'astronaut',
    category: 'kids',
    title: 'Космонавт',
    description: 'Открытый космос',
    prompt: 'Dress child in astronaut space suit. Background: outer space, stars, planets. CRUCIAL: Keep the face recognizable. Photorealistic style.',
    image: '/templates/astronaut.webp'
  },
  {
    id: 'harry-potter',
    category: 'kids',
    title: 'Волшебник',
    description: 'Хогвартс',
    prompt: 'Dress child as wizard student. Gryffindor scarf, wand. Background: magical castle. CRUCIAL: Preserve facial identity. Photorealistic style.',
    image: '/templates/harry-potter.webp'
  },
  {
    id: 'kids-dinosaur',
    category: 'kids',
    title: 'Динозаврик',
    description: 'Веселый костюм',
    prompt: 'Show the child from the photo wearing a cute green dinosaur costume (onesie). CRUCIAL: Preserve facial identity exactly. Photorealistic style. Background: prehistoric jungle with cartoon-style volcano. Happy expression.',
    image: '/templates/kids-dinosaur.webp'
  },
  {
    id: 'kids-princess',
    category: 'kids',
    title: 'Принцесса',
    description: 'Сказочный замок',
    prompt: 'Show the child from the photo wearing a beautiful sparkling princess dress and a tiara. CRUCIAL: Maintain exact facial identity. Photorealistic style. Background: magical fairy tale castle ballroom. Soft pink and gold lighting.',
    image: '/templates/kids-princess.webp'
  },
  {
    id: 'kids-chef',
    category: 'kids',
    title: 'Шеф-повар',
    description: 'Готовим',
    prompt: 'Show the child from the photo wearing a tiny chef uniform and hat, holding a wooden spoon. CRUCIAL: Keep the face recognizable. Photorealistic style. Background: messy kitchen with flour and dough. Cute and funny.',
    image: '/templates/kids-chef.webp'
  },
  {
    id: 'kids-pilot',
    category: 'kids',
    title: 'Пилот',
    description: 'Самолет',
    prompt: 'Show the child from the photo wearing a vintage aviator hat and goggles, sitting in a cardboard or toy airplane. CRUCIAL: Preserve facial identity. Photorealistic style. Background: blue sky with fluffy clouds.',
    image: '/templates/kids-pilot.webp'
  },
  {
    id: 'kids-firefighter',
    category: 'kids',
    title: 'Пожарный',
    description: 'Герой',
    prompt: 'Show the child from the photo wearing a firefighter costume and helmet, holding a toy hose. CRUCIAL: Maintain exact facial identity. Photorealistic style. Background: fire station with red truck.',
    image: '/templates/kids-firefighter.webp'
  },
  {
    id: 'kids-explorer',
    category: 'kids',
    title: 'Исследователь',
    description: 'Джунгли',
    prompt: 'Show the child from the photo dressed as a safari explorer with binoculars and a hat. CRUCIAL: Keep the face recognizable. Photorealistic style. Background: jungle with friendly animals (parrot, monkey).',
    image: '/templates/kids-explorer.webp'
  },
  {
    id: 'kids-doctor',
    category: 'kids',
    title: 'Доктор',
    description: 'Будущее',
    prompt: 'Show the child from the photo wearing a small white doctor coat and stethoscope. CRUCIAL: Preserve facial identity. Photorealistic style. Background: hospital or clinic setting with teddy bear patient.',
    image: '/templates/kids-doctor.webp'
  },
  {
    id: 'kids-racer',
    category: 'kids',
    title: 'Гонщик',
    description: 'Болид',
    prompt: 'Show the child from the photo wearing a racing suit and holding a helmet. CRUCIAL: Maintain exact facial identity. Photorealistic style. Background: race track with race cars.',
    image: '/templates/kids-racer.webp'
  },
  {
    id: 'kids-pirate',
    category: 'kids',
    title: 'Пират',
    description: 'Остров сокровищ',
    prompt: 'Show the child from the photo dressed as a pirate with a hat and eye patch (optional). CRUCIAL: Keep the face recognizable. Photorealistic style. Background: pirate ship deck, ocean, treasure chest.',
    image: '/templates/kids-pirate.webp'
  },
  {
    id: 'kids-detective',
    category: 'kids',
    title: 'Детектив',
    description: 'Расследование',
    prompt: 'Show the child from the photo wearing a trench coat and holding a magnifying glass. CRUCIAL: Preserve facial identity. Photorealistic style. Background: mystery library.',
    image: '/templates/kids-detective.webp'
  },



  // --- BUSINESS PRINT CATEGORY ---
  {
    id: 'print-menu',
    category: 'business_print',
    title: 'Меню Ресторана',
    description: 'Премиум дизайн',
    prompt: 'Create a high-end restaurant menu background design. Dark marble texture, elegant gold lines, soft ambient lighting. Leave empty space in the center for text. Place a gourmet dish on the bottom corner. Photorealistic style.',
    image: '/templates/print-menu.webp'
  },
  {
    id: 'print-spa-pricelist',
    category: 'business_print',
    title: 'Прайс SPA',
    description: 'Релакс и стиль',
    prompt: 'Create a luxury spa price list background. Soft beige tones, orchid flowers, white stones, and bamboo. Zen atmosphere. Clean space for service list text. Photorealistic.',
    image: '/templates/print-spa-pricelist.webp'
  },
  {
    id: 'print-coffee-poster',
    category: 'business_print',
    title: 'Постер Кофейни',
    description: 'Реклама напитков',
    prompt: 'Create a coffee shop promotional poster background. Close-up of coffee beans and a steaming cup. Warm, cozy lighting. Text space at the top. Photorealistic.',
    image: '/templates/print-coffee-poster.webp'
  },
  {
    id: 'print-sale-flyer',
    category: 'business_print',
    title: 'Флаер Распродажи',
    description: 'Яркое промо',
    prompt: 'Create a dynamic sale flyer background. Vibrant red and yellow geometric shapes, confetti, "Big Sale" energy. Space for product images and text. Photorealistic.',
    image: '/templates/print-sale-flyer.webp'
  },
  {
    id: 'print-business-card',
    category: 'business_print',
    title: 'Визитка',
    description: 'Деловой стиль',
    prompt: 'Create a minimalist modern business card background design. Dark blue and silver gradient. Abstract geometric lines. Professional look. Photorealistic.',
    image: '/templates/print-business-card.webp'
  },
  {
    id: 'print-billboard',
    category: 'business_print',
    title: 'Билборд',
    description: 'Наружная реклама',
    prompt: 'Create a mockup of a large outdoor billboard on a city building. The billboard surface is blank white for your design. Blue sky background. Photorealistic.',
    image: '/templates/print-billboard.webp'
  },
  {
    id: 'print-event-banner',
    category: 'business_print',
    title: 'Баннер События',
    description: 'Конференция / Гала',
    prompt: 'Create a corporate event banner background. Blue stage curtains, spotlights, gold sparkles. Celebration atmosphere. Space for event title. Photorealistic.',
    image: '/templates/print-event-banner.webp'
  },
  {
    id: 'print-voucher',
    category: 'business_print',
    title: 'Ваучер',
    description: 'Подарочный сертификат',
    prompt: 'Create a luxury gift voucher background design. Gold ribbon, silky texture background, elegant typography elements. Photorealistic.',
    image: '/templates/print-voucher.webp'
  },
  {
    id: 'print-real-estate',
    category: 'business_print',
    title: 'Недвижимость',
    description: 'Листовка риелтора',
    prompt: 'Create a real estate flyer background. Modern home interior in background (blurred), bright airy lighting. Blue and white color scheme. Space for property details. Photorealistic.',
    image: '/templates/print-real-estate.webp'
  },
  {
    id: 'print-roll-up',
    category: 'business_print',
    title: 'Ролл-ап',
    description: 'Стенд для офиса',
    prompt: 'Create a blank roll-up standee mockup standing in a modern office lobby. Clean canvas for your design. Professional lighting. Photorealistic.',
    image: '/templates/print-roll-up.webp'
  },

  // --- TET (LUNAR NEW YEAR) VIETNAMESE CATEGORY ---
  {
    id: 'tet-traditional-yellow',
    category: 'tet',
    title: 'Аозай и Цветы Мая',
    description: 'Золотой Новый год',
    prompt: 'Show the person from the photo wearing a luxurious traditional yellow and red Ao Dai, standing next to a large blooming yellow Ochna Integerrima tree (Hoa Mai). CRUCIAL: Preserve the facial features exactly. Photorealistic style, detailed natural skin texture, visible pores, no plastic smoothing. Festive Vietnamese Lunar New Year atmosphere, soft sunlight, happy expression.',
    image: '/templates/tet-traditional-yellow.webp'
  },
  {
    id: 'tet-traditional-pink',
    category: 'tet',
    title: 'Персиковый Сад',
    description: 'Северный стиль',
    prompt: 'Show the person from the photo wearing a pink silk Ao Dai standing in a garden of blooming peach blossoms (Hoa Dao). CRUCIAL: Maintain exact facial identity. Photorealistic style, detailed natural skin texture. Traditional Northern Vietnamese Tet celebration style. Gentle, elegant, spring vibes.',
    image: '/templates/tet-traditional-pink.webp'
  },
  {
    id: 'tet-hoi-an',
    category: 'tet',
    title: 'Хойан Ночью',
    description: 'Фонарики',
    prompt: 'Show the person from the photo in Hoi An ancient town at night, surrounded by hundreds of colorful glowing silk lanterns. Wearing a traditional Ao Dai. CRUCIAL: Keep the face exactly identical. Photorealistic style, detailed natural skin texture. Magical, cinematic lighting, river background.',
    image: '/templates/tet-hoi-an.webp'
  },
  {
    id: 'tet-temple',
    category: 'tet',
    title: 'Храм',
    description: 'Молитва на удачу',
    prompt: 'Show the person from the photo visiting a traditional Vietnamese temple or pagoda to pray for luck. CRUCIAL: Preserve facial identity. Photorealistic style, detailed natural skin texture. Burning incense sticks, smoke swirling, peaceful spiritual atmosphere. Wearing modest traditional clothing.',
    image: '/templates/tet-temple.webp'
  },
  {
    id: 'tet-calligraphy',
    category: 'tet',
    title: 'Каллиграфия',
    description: 'Мастер Ong Do',
    prompt: 'Show the person from the photo sitting with a Vietnamese calligraphy master (Ong Do) on a street corner, holding a red paper with lucky characters. CRUCIAL: Maintain exact facial identity. Photorealistic style, detailed natural skin texture. Old Quarter background, red paper decorations.',
    image: '/templates/tet-calligraphy.webp'
  },
  {
    id: 'tet-lucky-money',
    category: 'tet',
    title: 'Ли Си (Конверты)',
    description: 'Красные конверты удачи',
    prompt: 'Show the person from the photo holding many red lucky money envelopes (Li Xi) with a big smile. CRUCIAL: Keep the face exactly identical. Photorealistic style, detailed natural skin texture. Background decorated with Tet couplets and flowers. Wealth and prosperity vibe.',
    image: '/templates/tet-lucky-money.webp'
  },
  {
    id: 'tet-banh-chung',
    category: 'tet',
    title: 'Бань Чунг',
    description: 'Готовим пироги',
    prompt: 'Show the person from the photo wrapping traditional sticky rice cakes (Banh Chung) with green leaves. CRUCIAL: Preserve facial identity. Photorealistic style, detailed natural skin texture. Rustic kitchen setting, cozy family atmosphere, preparing for Tet.',
    image: '/templates/tet-banh-chung.webp'
  },
  {
    id: 'tet-flower-market',
    category: 'tet',
    title: 'Цветочный Рынок',
    description: 'Суета праздника',
    prompt: 'Show the person from the photo walking through a bustling Tet flower market filled with kumquat trees and chrysanthemums. CRUCIAL: Maintain exact facial identity. Photorealistic style, detailed natural skin texture. Motorbikes carrying flowers in the background. Authentic street life.',
    image: '/templates/tet-flower-market.webp'
  },
  {
    id: 'tet-family-tray',
    category: 'tet',
    title: 'Праздничный Стол',
    description: 'Пять фруктов',
    prompt: 'Show the person from the photo sitting at a traditional Tet tea table with a tray of five fruits (Mam Ngu Qua) and candied fruits. CRUCIAL: Keep the face exactly identical. Photorealistic style, detailed natural skin texture. Wearing nice clothes, welcoming guests.',
    image: '/templates/tet-family-tray.webp'
  },
  {
    id: 'tet-modern-chic',
    category: 'tet',
    title: 'Современный Тет',
    description: 'Модный Аозай',
    prompt: 'Show the person from the photo wearing a modern, stylized fashion Ao Dai (Ao Dai Cach Tan) with trendy accessories. CRUCIAL: Preserve facial identity. Photorealistic style, detailed natural skin texture. Studio photography with red background and artistic props.',
    image: '/templates/tet-modern-chic.webp'
  },
  {
    id: 'tet-fireworks-hcm',
    category: 'tet',
    title: 'Салют Landmark 81',
    description: 'Сайгон в Новый год',
    prompt: 'Show the person from the photo standing on a luxury rooftop bar in Ho Chi Minh City, with the illuminated Landmark 81 tower in the background. Colorful Tet fireworks exploding in the night sky. CRUCIAL: Preserve facial identity exactly. Photorealistic style, detailed natural skin texture, visible pores, no plastic smoothing. Festive elegant atmosphere, holding a glass of wine.',
    image: '/templates/tet-fireworks-hcm.webp'
  },
  {
    id: 'tet-dragon-dance',
    category: 'tet',
    title: 'Танец Льва',
    description: 'Праздничное шествие',
    prompt: 'Show the person from the photo standing next to a vibrant red and yellow Lion Dance (Mua Lan) performance on a busy street. CRUCIAL: Maintain exact facial identity. Photorealistic style, detailed natural skin texture, deep depth of field. Drums, confetti, energetic festive atmosphere.',
    image: '/templates/tet-dragon-dance.webp'
  },
  {
    id: 'tet-vintage-retro',
    category: 'tet',
    title: 'Ретро Сайгон',
    description: 'Ностальгия 90-х',
    prompt: 'Vintage 90s film photography style. Show the person from the photo sitting on an old Honda Cub motorbike decorated with Tet flowers. CRUCIAL: Keep the face exactly identical. Photorealistic film grain, warm nostalgic colors. Vietnamese street corner background.',
    image: '/templates/tet-vintage-retro.webp'
  },
  {
    id: 'tet-flower-street',
    category: 'tet',
    title: 'Улица Цветов',
    description: 'Прогулка Нгуен Хюэ',
    prompt: 'Show the person from the photo walking down the famous Nguyen Hue Flower Street in Ho Chi Minh City. CRUCIAL: Preserve facial identity. Photorealistic style, detailed natural skin texture. Surrounded by elaborate floral displays and Tet mascots. Sunny bright day.',
    image: '/templates/tet-flower-street.webp'
  },
  {
    id: 'tet-countryside',
    category: 'tet',
    title: 'Деревенский Тет',
    description: 'Уют и спокойствие',
    prompt: 'Show the person from the photo in a peaceful Vietnamese countryside setting. Standing in front of a traditional wooden house with banana trees and a red flag. CRUCIAL: Maintain exact facial identity. Photorealistic style, detailed natural skin texture. Rustic, warm, homecoming vibe.',
    image: '/templates/tet-countryside.webp'
  },
  {
    id: 'tet-cyclo',
    category: 'tet',
    title: 'Велорикша',
    description: 'Прогулка по городу',
    prompt: 'Show the person from the photo sitting on a traditional Vietnamese Cyclo (Xich Lo) decorated with marigold flowers. CRUCIAL: Keep the face exactly identical. Photorealistic style, detailed natural skin texture. Riding through a sunny street with colonial architecture.',
    image: '/templates/tet-cyclo.webp'
  },
  {
    id: 'tet-watermelon',
    category: 'tet',
    title: 'Арбуз Удачи',
    description: 'Резьба по арбузу',
    prompt: 'Show the person from the photo holding a carved red watermelon with lucky calligraphy characters (Tai Loc). CRUCIAL: Preserve facial identity. Photorealistic style, detailed natural skin texture. Bright red and green colors, festive background.',
    image: '/templates/tet-watermelon.webp'
  },
  {
    id: 'tet-non-la',
    category: 'tet',
    title: 'Нон Ла и Лотос',
    description: 'Традиционная красота',
    prompt: 'Show the person from the photo wearing a white Ao Dai and a traditional Conical Hat (Non La), standing by a lotus pond. CRUCIAL: Maintain exact facial identity. Photorealistic style, detailed natural skin texture. Soft, poetic, serene atmosphere.',
    image: '/templates/tet-non-la.webp'
  },
  {
    id: 'tet-incense-spiral',
    category: 'tet',
    title: 'Благовония',
    description: 'Спирали в храме',
    prompt: 'Show the person from the photo standing under hundreds of hanging spiral incense coils in an atmospheric temple (like Ba Thien Hau). CRUCIAL: Keep the face exactly identical. Photorealistic style, detailed natural skin texture. Shafts of light cutting through the smoke, cinematic.',
    image: '/templates/tet-incense-spiral.webp'
  },
  {
    id: 'tet-kitchen-god',
    category: 'tet',
    title: 'У Очага',
    description: 'Готовим ночью',
    prompt: 'Show the person from the photo sitting by a warm wood fire, cooking a large pot of Banh Chung at night. CRUCIAL: Preserve facial identity. Photorealistic style, detailed natural skin texture. Glowing warm light from the fire, cozy anticipation of New Year.',
    image: '/templates/tet-kitchen-god.webp'
  },

  // --- FASHION CATEGORY ---

  {
    id: 'fashion-urban',
    category: 'fashion',
    title: 'Урбан Стритвир',
    description: 'Уличный стиль',
    prompt: 'Show the person from the photo in a trendy urban streetwear outfit (hoodie, bomber jacket, sneakers). CRUCIAL: Preserve facial identity. Graffiti wall background, neon city lights reflections, dynamic angle. Hypebeast style. Photorealistic.',
    image: '/templates/fashion-urban.webp'
  },
  {
    id: 'fashion-red-carpet',
    category: 'fashion',
    title: 'Красная Дорожка',
    description: 'Гала-вечер',
    prompt: 'Show the person from the photo standing on a red carpet at a movie premiere or Met Gala. CRUCIAL: Maintain exact facial identity. Wearing a glamorous evening gown or tuxedo. Paparazzi flashes, velvet ropes, luxury event atmosphere. Photorealistic.',
    image: '/templates/fashion-red-carpet.webp'
  },
  {
    id: 'fashion-summer-resort',
    category: 'fashion',
    title: 'Летний Курорт',
    description: 'Средиземноморье',
    prompt: 'Show the person from the photo in a luxury summer resort outfit (linen shirt/dress, sunglasses). CRUCIAL: Keep the face exactly identical. Amalfi coast background, blue sea, lemon trees, sunny bright lighting. Photorealistic.',
    image: '/templates/fashion-summer-resort.webp'
  },
  {
    id: 'fashion-cyber',
    category: 'fashion',
    title: 'Кибер Мода',
    description: 'Футуризм',
    prompt: 'Show the person from the photo in futuristic cyber fashion clothing. Holographic fabrics, neon glowing accessories. CRUCIAL: Preserve facial identity. Night city futuristic background, rain, blue and pink neon lighting. Photorealistic.',
    image: '/templates/fashion-cyber.webp'
  },
  {
    id: 'fashion-denim',
    category: 'fashion',
    title: 'Деним',
    description: 'Джинсовый стиль',
    prompt: 'Show the person from the photo wearing a stylish all-denim outfit (jean jacket and jeans). CRUCIAL: Maintain exact facial identity. Studio blue background or industrial loft setting. Cool, edgy fashion vibe. Photorealistic.',
    image: '/templates/fashion-denim.webp'
  },
  {
    id: 'fashion-minimal',
    category: 'fashion',
    title: 'Минимализм',
    description: 'Студийный портрет',
    prompt: 'Minimalist fashion photography. Show the person from the photo in a sleek monochrome outfit against a plain concrete or beige wall. CRUCIAL: Keep the face exactly identical. Soft natural shadow, clean lines, Zara/Uniqlo lookbook style. Photorealistic.',
    image: '/templates/fashion-minimal.webp'
  },


  {
    id: 'fashion-runway',
    category: 'fashion',
    title: 'Подиум',
    description: 'Показ мод',
    prompt: 'Show the person from the photo walking on a high-fashion runway during a fashion week show. CRUCIAL: Preserve facial identity exactly. Wearing avant-garde designer couture. Dramatic spotlights, audience in darkness, flashing cameras. Photorealistic 8k, detailed skin texture.',
    image: '/templates/fashion-runway.webp'
  },
  {
    id: 'fashion-editorial',
    category: 'fashion',
    title: 'Обложка журнала',
    description: 'Vogue стиль',
    prompt: 'High-end fashion editorial portrait shot for a magazine cover like Vogue. CRUCIAL: Maintain exact facial identity. Artistic lighting, bold makeup, stylish haute couture outfit. Studio background with geometric shadows. 8k resolution, detailed skin texture.',
    image: '/templates/fashion-editorial.webp'
  },
  {
    id: 'fashion-street-paris',
    category: 'fashion',
    title: 'Париж',
    description: 'У Эйфелевой башни',
    prompt: 'Show the person from the photo walking in Paris near the Eiffel Tower. CRUCIAL: Preserve facial identity. Wearing a trench coat, beret, and holding a baguette or coffee. Cloudy chic atmosphere, street style photography. Photorealistic.',
    image: '/templates/fashion-street-paris.webp'
  },
  {
    id: 'fashion-old-money-winter',
    category: 'fashion',
    title: 'Альпы',
    description: 'Зимний люкс',
    prompt: 'Show the person from the photo on a balcony of a luxury ski chalet in the Alps. CRUCIAL: Keep the face exactly identical. Wearing expensive cashmere beige sweater, fur hat, sipping hot chocolate. Snowy mountain background. Wealthy aesthetic, detailed skin.',
    image: '/templates/fashion-old-money-winter.webp'
  },

  // --- STYLE TRENDS & MOODBOARDS CATEGORY ---
  {
    id: 'style-old-money',
    category: 'style_trends',
    title: 'Old Money',
    description: 'Роскошная сдержанность',
    prompt: 'Dress the person from the photo in the "Old Money" aesthetic. Polo shirt, beige trousers or tennis skirt, cashmere sweater over shoulders, loafers. CRUCIAL: Preserve facial identity exactly. Background: A luxury yacht deck or a private mansion garden. Wealthy, understated elegance. Photorealistic, detailed skin.',
    image: '/templates/style-old-money.webp'
  },
  {
    id: 'style-y2k',
    category: 'style_trends',
    title: 'Стиль Y2K',
    description: 'Нулевые',
    prompt: 'Dress the person from the photo in Y2K fashion (Year 2000 style). Low-rise jeans, baby tee, butterfly clips, rimless sunglasses. CRUCIAL: Maintain exact facial identity. Background: Glossy futuristic purple and pink gradient with digital abstract shapes. Photorealistic.',
    image: '/templates/style-y2k.webp'
  },
  {
    id: 'style-streetwear',
    category: 'style_trends',
    title: 'Стритвир Премиум',
    description: 'Уличная мода',
    prompt: 'Dress the person from the photo in premium streetwear. Oversized graphic hoodie, cargo pants, chunky sneakers, beanie. CRUCIAL: Keep the face exactly identical. Background: Urban city street with graffiti art and neon signs. Photorealistic.',
    image: '/templates/style-streetwear.webp'
  },
  {
    id: 'style-minimalist',
    category: 'style_trends',
    title: 'Минимализм',
    description: 'Элегантность',
    prompt: 'Dress the person from the photo in a clean Minimalist fashion style. Monochromatic outfit (all black or all white), sleek lines, trench coat. CRUCIAL: Preserve facial identity. Background: Modern concrete architectural wall or art gallery. Photorealistic.',
    image: '/templates/style-minimalist.webp'
  },
  {
    id: 'style-coquette',
    category: 'style_trends',
    title: 'Coquette',
    description: 'Банты и кружева',
    prompt: 'Dress the person from the photo in Coquette aesthetic. Lace dress, pink bows in hair, pearls, soft lighting. CRUCIAL: Maintain exact facial identity. Background: Vintage bedroom with flowers and soft pastel colors. Photorealistic.',
    image: '/templates/style-coquette.webp'
  },
  {
    id: 'style-cyberpunk',
    category: 'style_trends',
    title: 'Techwear / Cyberpunk',
    description: 'Техно-мода',
    prompt: 'Dress the person from the photo in futuristic Techwear. Black tactical straps, mask hanging on neck, waterproof fabrics, neon accents. CRUCIAL: Keep the face recognizable. Background: Rainy night city in Tokyo cyberpunk style. Photorealistic.',
    image: '/templates/style-cyberpunk.webp'
  },
  {
    id: 'style-vintage-90s',
    category: 'style_trends',
    title: 'Винтаж 90-х',
    description: 'Гранж и деним',
    prompt: 'Dress the person from the photo in 90s vintage style. Denim jacket, flannel shirt tied around waist, combat boots. CRUCIAL: Preserve facial identity. Background: Retro record store or diner. Photorealistic.',
    image: '/templates/style-vintage-90s.webp'
  },
  {
    id: 'style-moodboard-1',
    category: 'style_trends',
    title: 'Мудборд 1',
    description: 'Образ + Раскладка',
    prompt: 'Create a fashion moodboard composition. Split the image into two sections. On the Left: The person from the photo wearing a stylish chic outfit (CRUCIAL: Preserve facial identity exactly, photorealistic). On the Right: A neat flatlay arrangement of the matching accessories, shoes, and bag on a marble background. High fashion magazine layout style.',
    image: '/templates/style-moodboard-1.webp'
  },
  {
    id: 'style-moodboard-2',
    category: 'style_trends',
    title: 'Мудборд 2',
    description: 'Коллаж',
    prompt: 'Create a trendy fashion collage. Main visual is the person from the photo wearing a casual trendy outfit (CRUCIAL: Maintain exact facial identity, photorealistic). Surrounding the person are floating aesthetic elements: a coffee cup, sunglasses, a magazine, and a pair of sneakers arranged artistically. Beige aesthetic background.',
    image: '/templates/style-moodboard-2.webp'
  },
  {
    id: 'style-boho',
    category: 'style_trends',
    title: 'Бохо (Boho)',
    description: 'Свобода стиля',
    prompt: 'Dress the person from the photo in Bohemian style. Flowy patterned dress or linen shirt, wide-brimmed hat, leather accessories. CRUCIAL: Keep the face exactly identical. Background: Sunset desert or festival grounds. Photorealistic.',
    image: '/templates/style-boho.webp'
  },

  // --- FORMULA 1 CATEGORY ---
  {
    id: 'f1-cockpit',
    category: 'formula1',
    title: 'Вид пилота',
    description: 'В кокпите (Профиль)',
    prompt: 'Cinematic side profile shot of the person from the photo sitting inside a Formula 1 car cockpit. Camera angle from the side/three-quarters. Wearing a professional racing suit and helmet with visor open, revealing the face clearly. CRUCIAL: Preserve the facial features exactly. Photorealistic style, detailed natural skin texture. Hands gripping the steering wheel. Detailed car chassis, blurred racetrack background, high speed atmosphere.',
    image: '/templates/f1-cockpit.webp'
  },
  {
    id: 'f1-car-standing',
    category: 'formula1',
    title: 'У болида',
    description: 'Пит-лейн',
    prompt: 'Show the person from the photo standing confidently next to a sleek Formula 1 car in the pit lane. CRUCIAL: Maintain exact facial identity. Photorealistic style, detailed natural skin texture. Wearing team racing kit, sunglasses, mechanic crew busy in background.',
    image: '/templates/f1-car-standing.webp'
  },
  {
    id: 'f1-podium',
    category: 'formula1',
    title: 'Подиум',
    description: 'Шампанское',
    prompt: 'Show the person from the photo standing on the 1st place podium, holding a giant gold trophy and spraying champagne. CRUCIAL: Keep the face exactly identical. Photorealistic style. Confetti raining down, cheering crowd below, wearing winner cap.',
    image: '/templates/f1-podium.webp'
  },
  {
    id: 'f1-racing',
    category: 'formula1',
    title: 'Гонка',
    description: 'На трассе',
    prompt: 'Action shot of a Formula 1 car speeding on the track. The person from the photo is driving, face visible through the open visor. CRUCIAL: Preserve facial identity. Photorealistic style. Motion blur background, sparks from under the car, intense speed.',
    image: '/templates/f1-racing.webp'
  },
  {
    id: 'f1-paddock',
    category: 'formula1',
    title: 'Паддок VIP',
    description: 'Стиль звезды',
    prompt: 'Show the person from the photo walking through the exclusive F1 Paddock area. CRUCIAL: Maintain exact facial identity. Photorealistic style. Wearing stylish VIP guest pass, sunglasses, luxury casual outfit, motorhomes in background.',
    image: '/templates/f1-paddock.webp'
  },
  {
    id: 'f1-pitstop',
    category: 'formula1',
    title: 'Пит-стоп',
    description: 'Механик',
    prompt: 'Show the person from the photo as part of the pit crew, holding a wheel gun during a lightning-fast pit stop. CRUCIAL: Keep the face recognizable. Photorealistic style. Surrounded by mechanics in matching uniforms, smoke, intensity.',
    image: '/templates/f1-pitstop.webp'
  },
  {
    id: 'f1-garage',
    category: 'formula1',
    title: 'Гараж',
    description: 'Телеметрия',
    prompt: 'Show the person from the photo sitting in the team garage, looking at telemetry data on monitors with engineers. CRUCIAL: Preserve facial identity. Photorealistic style. Headset on, focused expression, high-tech environment.',
    image: '/templates/f1-garage.webp'
  },
  {
    id: 'f1-helmet',
    category: 'formula1',
    title: 'Шлем',
    description: 'Крупный план',
    prompt: 'Close-up portrait of the person wearing a custom-designed colorful racing helmet with the visor open. CRUCIAL: Maintain exact facial identity. Photorealistic style, detailed skin texture. Track lights reflecting on the helmet, intense eyes.',
    image: '/templates/f1-helmet.webp'
  },

  // --- PRANKS CATEGORY ---
  {
    id: 'prank-flood',
    category: 'pranks',
    title: 'Наводнение',
    description: 'Затопленная комната',
    prompt: 'Transform the room in the photo to look completely flooded with water. Reflections of furniture in the water, floating items, realistic disaster movie effect. Photorealistic.',
    image: '/templates/prank-flood.webp'
  },
  {
    id: 'prank-mistress',
    category: 'pranks',
    title: 'Кто-то в постели (Ж)',
    description: 'Пранк с девушкой',
    prompt: 'Add a mysterious silhouette of a sleeping woman under the blanket in the bed next to the viewer. Messy sheets, long hair visible on the pillow. Prank photo. Photorealistic.',
    image: '/templates/prank-mistress.webp'
  },
  {
    id: 'prank-lover',
    category: 'pranks',
    title: 'Кто-то в постели (М)',
    description: 'Пранк с парнем',
    prompt: 'Add a mysterious silhouette of a sleeping man under the blanket in the bed next to the viewer. Messy sheets, arm visible. Prank photo. Photorealistic.',
    image: '/templates/prank-lover.webp'
  },
  {
    id: 'prank-broken-screen',
    category: 'pranks',
    title: 'Разбитый экран',
    description: 'Трещины на мониторе',
    prompt: 'Add a realistic smashed screen effect with spiderweb cracks and glitching pixels to the TV or monitor screen in the photo. Photorealistic.',
    image: '/templates/prank-broken-screen.webp'
  },
  {
    id: 'prank-arrest',
    category: 'pranks',
    title: 'Арест',
    description: 'Полицейское фото',
    prompt: 'Show the person from the photo in a police booking photo (mugshot). CRUCIAL: Preserve the facial features exactly. Photorealistic style, detailed natural skin texture. Holding a sign with numbers, height chart in the background, harsh lighting. Prank photo.',
    image: '/templates/prank-arrest.webp'
  },
  {
    id: 'prank-bruises',
    category: 'pranks',
    title: 'Драка',
    description: 'Грим побоев',
    prompt: 'Apply hyper-realistic Hollywood special effects makeup (SFX) to the person\'s face. Create a realistic black eye, bruises on the cheekbone, and a split lip effect. CRUCIAL: Preserve the underlying facial identity. Action movie aftermath style, detailed texture, cinematic lighting, visible pores.',
    image: '/templates/prank-bruises.webp'
  },
  {
    id: 'prank-mess',
    category: 'pranks',
    title: 'Беспорядок',
    description: 'Хаос в комнате',
    prompt: 'Make the room look absolutely messy and chaotic. Clothes everywhere, spilled food, overturned chairs. "Party gone wrong" prank vibe. Photorealistic.',
    image: '/templates/prank-mess.webp'
  },
  {
    id: 'prank-animal-mess',
    category: 'pranks',
    title: 'Питомец нашкодил',
    description: 'Порванная подушка',
    prompt: 'Add a guilty-looking dog or cat sitting amidst a pile of torn white feathers from a destroyed pillow. Messy room prank. Photorealistic.',
    image: '/templates/prank-animal-mess.webp'
  },
  {
    id: 'prank-kids-art',
    category: 'pranks',
    title: 'Детские рисунки',
    description: 'Разрисованные стены',
    prompt: 'Add colorful crayon drawings and scribbles all over the walls and furniture. Messy kids playroom prank. Photorealistic.',
    image: '/templates/prank-kids-art.webp'
  },
  {
    id: 'prank-clown',
    category: 'pranks',
    title: 'Жуткий клоун',
    description: 'В окне',
    prompt: 'Add a creepy clown face peering through the window or standing in a dark corner of the room. Spooky prank photo. Photorealistic.',
    image: '/templates/prank-clown.webp'
  },
  {
    id: 'prank-lottery',
    category: 'pranks',
    title: 'Джекпот',
    description: 'Чек лотереи',
    prompt: 'Show the person from the photo holding a giant lottery check with a huge amount of money written on it. CRUCIAL: Keep the face exactly identical. Photorealistic style. Confetti falling, excited expression, looking like a winner on TV.',
    image: '/templates/prank-lottery.webp'
  },
  {
    id: 'prank-alien',
    category: 'pranks',
    title: 'Пришельцы',
    description: 'Похищение НЛО',
    prompt: 'Show the person from the photo being lifted off the ground by a bright green beam of light coming from a UFO saucer in the night sky. CRUCIAL: Keep the face recognizable. Sci-fi movie style, floating in air.',
    image: '/templates/prank-alien.webp'
  },
  {
    id: 'prank-ghost',
    category: 'pranks',
    title: 'Призрак',
    description: 'Паранормальное',
    prompt: 'Make the photo look spooky. Add a semi-transparent ghostly figure standing behind the person. Dim lighting, paranormal activity vibe, grainy horror movie texture.',
    image: '/templates/prank-ghost.webp'
  },
  {
    id: 'prank-superpower',
    category: 'pranks',
    title: 'Суперсила (Фейл)',
    description: 'Лазер из глаз',
    prompt: 'Show the person from the photo trying to use superpowers (like laser eyes or fire hands) but accidentally scorching their own clothes or the wall nearby. CRUCIAL: Keep the face recognizable. Funny superhero fail situation. smoke and char marks.',
    image: '/templates/prank-superpower.webp'
  },
  {
    id: 'prank-time',
    category: 'pranks',
    title: 'Путешественник',
    description: 'Из будущего',
    prompt: 'Show the person from the photo stepping out of a glowing time travel portal or a futuristic DeLorean car. CRUCIAL: Keep the face exactly identical. Smoke, electricity sparks, wearing futuristic goggles or clothes mixed with normal ones.',
    image: '/templates/prank-time.webp'
  },

  // --- WEDDING CATEGORY ---
  {
    id: 'wedding-bride-groom',
    category: 'wedding',
    title: 'Жених и Невеста',
    description: 'Классический портрет',
    prompt: 'Show the person from the photo in wedding attire (suit or white dress) standing with a partner in a beautiful garden. CRUCIAL: Preserve the facial features exactly. Photorealistic style, detailed natural skin texture. Soft romantic lighting, love, happiness.',
    image: '/templates/wedding-bride-groom.webp'
  },
  {
    id: 'wedding-dress',
    category: 'wedding',
    title: 'Примерка платья',
    description: 'Идеальный выбор',
    prompt: 'Show the person from the photo wearing a luxurious, detailed white lace wedding dress, looking into a large vintage mirror in a bridal salon. CRUCIAL: Maintain exact facial identity. Photorealistic style, detailed natural skin texture. Soft lighting, elegance.',
    image: '/templates/wedding-dress.webp'
  },
  {
    id: 'wedding-church',
    category: 'wedding',
    title: 'Венчание',
    description: 'Церемония в церкви',
    prompt: 'Show the person from the photo participating in a traditional orthodox wedding ceremony (Venchanie) inside a beautiful church. CRUCIAL: Keep the face exactly identical. Photorealistic style, detailed natural skin texture. Candles, gold icons, holding crowns, spiritual atmosphere.',
    image: '/templates/wedding-church.webp'
  },
  {
    id: 'wedding-zags',
    category: 'wedding',
    title: 'ЗАГС',
    description: 'Лепестки роз',
    prompt: 'Show the person from the photo walking out of the Registry Office (ZAGS) doors, smiling happily. CRUCIAL: Preserve the facial features exactly. Photorealistic style. Guests are throwing white rose petals in the air. Joyful celebration moment.',
    image: '/templates/wedding-zags.webp'
  },
  {
    id: 'wedding-ring',
    category: 'wedding',
    title: 'Кольца',
    description: 'Символ верности',
    prompt: 'Close-up artistic shot focusing on the person\'s hand wearing a beautiful diamond wedding ring. Soft bokeh background, holding a bouquet or partner\'s hand. Photorealistic.',
    image: '/templates/wedding-ring.webp'
  },
  {
    id: 'wedding-dance',
    category: 'wedding',
    title: 'Первый танец',
    description: 'Дым и свет',
    prompt: 'Show the person from the photo dancing the first wedding dance. CRUCIAL: Maintain exact facial identity. Photorealistic style. Low floor fog (dry ice), spotlight, romantic evening atmosphere in a banquet hall.',
    image: '/templates/wedding-dance.webp'
  },
  {
    id: 'wedding-cake',
    category: 'wedding',
    title: 'Свадебный торт',
    description: 'Разрезание торта',
    prompt: 'Show the person from the photo standing next to a giant multi-tier wedding cake, holding a knife ready to cut it. CRUCIAL: Keep the face exactly identical. Photorealistic style. Festive reception background.',
    image: '/templates/wedding-cake.webp'
  },
  {
    id: 'wedding-party',
    category: 'wedding',
    title: 'Вечеринка',
    description: 'Шампанское и веселье',
    prompt: 'Show the person from the photo at a lively wedding party, holding a glass of champagne, laughing with friends. CRUCIAL: Preserve facial identity. Photorealistic style. Sparklers, disco lights, fun vibe.',
    image: '/templates/wedding-party.webp'
  },
  {
    id: 'wedding-morning',
    category: 'wedding',
    title: 'Утро невесты',
    description: 'Сборы',
    prompt: 'Show the person from the photo in a silk white robe, sitting on a bed or chair, getting ready for the wedding. CRUCIAL: Maintain exact facial identity. Photorealistic style, detailed natural skin texture. Makeup, bouquet nearby, soft window light.',
    image: '/templates/wedding-morning.webp'
  },
  {
    id: 'wedding-car',
    category: 'wedding',
    title: 'Свадебное авто',
    description: 'Лимузин или ретро',
    prompt: 'Show the person from the photo sitting in a decorated luxury retro wedding car or limousine. CRUCIAL: Keep the face exactly identical. Photorealistic style. Flowers on the car, waving out the window.',
    image: '/templates/wedding-car.webp'
  },

  // --- DATING CATEGORY ---
  {
    id: 'dating-train',
    category: 'dating',
    title: 'Вокзал',
    description: 'Долгожданная встреча',
    prompt: 'Show the person from the photo meeting a loved one at a vintage train station platform. CRUCIAL: Preserve facial identity. Photorealistic style. Steam, warm lighting, hugging or waiting with flowers, emotional reunion atmosphere.',
    image: '/templates/dating-train.webp'
  },
  {
    id: 'dating-car',
    category: 'dating',
    title: 'Свидание в авто',
    description: 'Огни города',
    prompt: 'Show the person from the photo on a romantic date night by a luxury car. CRUCIAL: Keep the face exactly identical. Photorealistic style. Leaning on the car hood, city lights in background, evening street vibe, holding a rose.',
    image: '/templates/dating-car.webp'
  },
  {
    id: 'dating-flowers',
    category: 'dating',
    title: 'Букет роз',
    description: 'Сюрприз',
    prompt: 'Show the person from the photo holding a giant luxury bouquet of red roses. CRUCIAL: Maintain exact facial identity. Photorealistic style. Happy expression, urban street background, romantic surprise.',
    image: '/templates/dating-flowers.webp'
  },
  {
    id: 'dating-restaurant',
    category: 'dating',
    title: 'Ужин при свечах',
    description: 'Романтика',
    prompt: 'Show the person from the photo having a romantic dinner date in a high-end restaurant. CRUCIAL: Preserve facial identity. Photorealistic style. Candlelight, wine glasses, holding hands across the table, intimate atmosphere.',
    image: '/templates/dating-restaurant.webp'
  },
  {
    id: 'dating-park',
    category: 'dating',
    title: 'Прогулка в парке',
    description: 'Осень/Весна',
    prompt: 'Show the person from the photo walking in a beautiful park with autumn leaves or spring blossoms. CRUCIAL: Keep the face exactly identical. Photorealistic style. Holding hands with partner, soft sunlight, romantic walk.',
    image: '/templates/dating-park.webp'
  },
  {
    id: 'dating-rooftop',
    category: 'dating',
    title: 'На крыше',
    description: 'Вид на город',
    prompt: 'Show the person from the photo on a romantic date on a rooftop at sunset. CRUCIAL: Maintain exact facial identity. Photorealistic style. City skyline view, string lights, cozy blanket, drinking wine.',
    image: '/templates/dating-rooftop.webp'
  },
  {
    id: 'dating-picnic',
    category: 'dating',
    title: 'Пикник',
    description: 'Отдых на природе',
    prompt: 'Show the person from the photo having a romantic picnic on the grass. CRUCIAL: Preserve facial identity. Photorealistic style. Checkered blanket, fruit basket, wine, laughing, sunny day nature.',
    image: '/templates/dating-picnic.webp'
  },
  {
    id: 'dating-beach',
    category: 'dating',
    title: 'Пляж',
    description: 'Закат у моря',
    prompt: 'Show the person from the photo walking along the beach at sunset. CRUCIAL: Keep the face exactly identical. Photorealistic style. Barefoot, waves crashing, golden hour light, romantic silhouette.',
    image: '/templates/dating-beach.webp'
  },
  {
    id: 'dating-gift',
    category: 'dating',
    title: 'Подарок',
    description: 'Радость',
    prompt: 'Show the person from the photo holding a beautifully wrapped gift box with a bow. CRUCIAL: Maintain exact facial identity. Photorealistic style. Excited expression, party background or cozy home setting.',
    image: '/templates/dating-gift.webp'
  },
  {
    id: 'dating-cinema',
    category: 'dating',
    title: 'Кинотеатр',
    description: 'Просмотр фильма',
    prompt: 'Show the person from the photo on a date at the cinema. CRUCIAL: Preserve facial identity. Photorealistic style. Eating popcorn, watching a movie, cozy atmosphere, dim lighting.',
    image: '/templates/dating-cinema.webp'
  },

  // --- SPORTS CATEGORY ---
  {
    id: 'sports-karate',
    category: 'sports',
    title: 'Каратэ',
    description: 'Единоборства',
    prompt: 'Show the person from the photo dressed in a clean white karate gi with a black belt, performing a dynamic martial arts kick. CRUCIAL: Keep the face exactly identical to the original photo. Photorealistic style, detailed skin texture. Background: traditional Japanese dojo with tatami mats.',
    image: '/templates/sports-karate.webp'
  },
  {
    id: 'sports-tennis',
    category: 'sports',
    title: 'Теннис',
    description: 'Корт',
    prompt: 'Show the person from the photo dressed in professional tennis sportswear holding a racket. CRUCIAL: Preserve the facial features exactly. Photorealistic style. Ready to serve on a clay tennis court. Sunny day, dynamic action pose.',
    image: '/templates/sports-tennis.webp'
  },
  {
    id: 'sports-fit-girl',
    category: 'sports',
    title: 'Фитнес (Ж)',
    description: 'Спортивное тело',
    prompt: 'Enhance the physique of the person from the photo to look like a fitness model. Toned athletic body, defined abs, wearing stylish gym activewear. CRUCIAL: Keep the face completely unchanged and recognizable. Photorealistic style, detailed natural skin texture, visible pores. Professional fitness photography in a modern gym.',
    image: '/templates/sports-fit-girl.webp'
  },
  {
    id: 'sports-fit-guy',
    category: 'sports',
    title: 'Фитнес (М)',
    description: 'Рельефные мышцы',
    prompt: 'Enhance the physique of the person from the photo to look like a fitness model. Muscular definition, broad shoulders, six-pack abs, athletic build. CRUCIAL: Maintain the exact facial identity. Photorealistic style, detailed skin texture. Gym setting with dramatic lighting.',
    image: '/templates/sports-fit-guy.webp'
  },
  {
    id: 'sports-olympia',
    category: 'sports',
    title: 'Бодибилдинг',
    description: 'Мистер Олимпия',
    prompt: 'Transform the person from the photo into a Mr. Olympia bodybuilding champion body type while keeping the face exactly as is in the original photo. CRUCIAL: Preserve facial identity. Photorealistic style, detailed skin texture. Extreme muscle mass, veins, definition, stage tan, posing trunks, bright stage lighting.',
    image: '/templates/sports-olympia.webp'
  },
  {
    id: 'sports-running',
    category: 'sports',
    title: 'Бег',
    description: 'Марафон',
    prompt: 'Show the person from the photo running in a park or on a track, wearing professional running gear. CRUCIAL: Preserve the face exactly. Photorealistic style. Motion blur background, athletic determination, morning sunlight.',
    image: '/templates/sports-running.webp'
  },
  {
    id: 'sports-boxing',
    category: 'sports',
    title: 'Бокс',
    description: 'На ринге',
    prompt: 'Show the person from the photo wearing boxing gloves and shorts, standing in a boxing ring. CRUCIAL: Keep the face exactly identical. Photorealistic style, detailed skin texture. Sweat on skin, intense look, dramatic arena lighting.',
    image: '/templates/sports-boxing.webp'
  },
  {
    id: 'sports-yoga',
    category: 'sports',
    title: 'Йога',
    description: 'Гибкость',
    prompt: 'Show the person from the photo doing a yoga pose on a mat in a peaceful studio or nature setting at sunset. CRUCIAL: Maintain exact facial identity. Photorealistic style. Flexibility, calm atmosphere, athletic yoga wear.',
    image: '/templates/sports-yoga.webp'
  },
  {
    id: 'sports-swimming',
    category: 'sports',
    title: 'Плавание',
    description: 'Бассейн',
    prompt: 'Show the person from the photo as a swimmer in a pool wearing goggles and cap, emerging from the water. CRUCIAL: Preserve facial identity. Photorealistic style. Water droplets, athletic shoulders.',
    image: '/templates/sports-swimming.webp'
  },
  {
    id: 'sports-soccer',
    category: 'sports',
    title: 'Футбол',
    description: 'Стадион',
    prompt: 'Show the person from the photo wearing a soccer jersey and cleats, dribbling a ball on a large green stadium field at night. CRUCIAL: Keep the face unchanged. Photorealistic style. Floodlights background.',
    image: '/templates/sports-soccer.webp'
  },

  // --- RESTAURANTS CATEGORY ---
  {
    id: 'restaurant-michelin',
    category: 'restaurants',
    title: 'Мишлен',
    description: 'Высокая кухня',
    prompt: 'Professional food photography, fine dining style. Elegant dark plating, tweezers precision, dramatic moody lighting, white tablecloth. Photorealistic.',
    image: '/templates/restaurant-michelin.webp'
  },
  {
    id: 'restaurant-full',
    category: 'restaurants',
    title: 'Полная посадка',
    description: 'Атмосфера ресторана',
    prompt: 'Show the dish on a table in a bustling, crowded restaurant. Blurred background of happy customers chatting and eating. Warm, lively atmosphere. Photorealistic.',
    image: '/templates/restaurant-full.webp'
  },
  {
    id: 'restaurant-terrace',
    category: 'restaurants',
    title: 'Терраса',
    description: 'На свежем воздухе',
    prompt: 'Food photography on an outdoor restaurant terrace. Bright sunlight, dappled shadows from trees, summer vibe, glass of lemonade nearby. Photorealistic.',
    image: '/templates/restaurant-terrace.webp'
  },
  {
    id: 'restaurant-romantic',
    category: 'restaurants',
    title: 'Романтический ужин',
    description: 'Свечи и вино',
    prompt: 'Romantic dinner setting. Dim warm lighting, candles on the table, two glasses of red wine, bokeh background. Intimate atmosphere. Photorealistic.',
    image: '/templates/restaurant-romantic.webp'
  },
  {
    id: 'restaurant-chef',
    category: 'restaurants',
    title: 'Шеф-повар',
    description: 'Презентация блюда',
    prompt: 'Close up of a professional chef in a white uniform holding the plate with the dish towards the camera. Commercial kitchen background. Photorealistic.',
    image: '/templates/restaurant-chef.webp'
  },
  {
    id: 'restaurant-steam',
    category: 'restaurants',
    title: 'Горячее блюдо',
    description: 'Пар и свежесть',
    prompt: 'Appetizing food photography with visible steam rising from the hot dish. Fresh ingredients, macro shot, shallow depth of field. Photorealistic.',
    image: '/templates/restaurant-steam.webp'
  },
  {
    id: 'restaurant-burger',
    category: 'restaurants',
    title: 'Бургер',
    description: 'Крафт и Неон',
    prompt: 'Juicy fast food photography. Dark wooden table, craft paper, neon sign in background. Greasy, delicious, dynamic angle. Photorealistic.',
    image: '/templates/restaurant-burger.webp'
  },
  {
    id: 'restaurant-breakfast',
    category: 'restaurants',
    title: 'Завтрак',
    description: 'Утренний кофе',
    prompt: 'Morning breakfast setting. Bright airy light, cup of coffee with latte art, newspaper, fresh flowers on a white marble table. Photorealistic.',
    image: '/templates/restaurant-breakfast.webp'
  },
  {
    id: 'restaurant-asian',
    category: 'restaurants',
    title: 'Азия',
    description: 'Вок и палочки',
    prompt: 'Asian cuisine styling. Slate plate, chopsticks, bamboo mat, steam, dark moody lighting with red accents. Photorealistic.',
    image: '/templates/restaurant-asian.webp'
  },
  {
    id: 'restaurant-flatlay',
    category: 'restaurants',
    title: 'Меню (Сверху)',
    description: 'Раскладка блюд',
    prompt: 'Flat lay top-down view of a table full of different dishes. Feast style, shared plates, beautiful composition for a menu cover. Photorealistic.',
    image: '/templates/restaurant-flatlay.webp'
  },

  // --- BLOGGERS CATEGORY ---
  {
    id: 'blogger-photoshoot',
    category: 'bloggers',
    title: 'Фотосессия',
    description: 'Бэкстейдж',
    prompt: 'Show the person from the photo as a model in a professional fashion photoshoot backstage. CRUCIAL: Keep the face exactly identical. Posing, photographer in background, bright studio lighting equipment, flashes firing, busy creative atmosphere. Photorealistic style, detailed skin texture.',
    image: '/templates/blogger-photoshoot.webp'
  },
  {
    id: 'blogger-autograph',
    category: 'bloggers',
    title: 'Автограф-сессия',
    description: 'Встреча с фанатами',
    prompt: 'Show the person from the photo as a famous influencer signing autographs for fans. CRUCIAL: Preserve facial identity. Photorealistic style, detailed skin texture. Crowded event, holding a marker, happy fans in background, posters, paparazzi style flashes.',
    image: '/templates/blogger-autograph.webp'
  },
  {
    id: 'blogger-stream-star',
    category: 'bloggers',
    title: 'Стрим со звездой',
    description: 'В эфире',
    prompt: 'Show the person from the photo as a streamer sitting next to a famous celebrity guest. CRUCIAL: Maintain exact facial identity. Photorealistic style, detailed skin texture. High energy live stream setup, wide angle shot of a room with LED lights, laughing, microphone arms, crazy atmosphere.',
    image: '/templates/blogger-stream-star.webp'
  },
  {
    id: 'blogger-podcast',
    category: 'bloggers',
    title: 'Подкаст',
    description: 'Интервью',
    prompt: 'Show the person from the photo in a professional podcast studio with microphone and headphones, neon sign in background. CRUCIAL: Keep the face exactly identical. Photorealistic style.',
    image: '/templates/blogger-podcast.webp'
  },
  {
    id: 'blogger-gaming',
    category: 'bloggers',
    title: 'Геймер',
    description: 'Игровая комната',
    prompt: 'Show the person from the photo in a gaming room with RGB lighting, gaming chair, and multiple monitors. CRUCIAL: Preserve facial identity. Photorealistic style.',
    image: '/templates/blogger-gaming.webp'
  },
  {
    id: 'blogger-coffee',
    category: 'bloggers',
    title: 'Кофейня',
    description: 'Работа за ноутом',
    prompt: 'Aesthetic photo of the person from the photo working on laptop in a stylish minimalist coffee shop. CRUCIAL: Maintain exact facial identity. Photorealistic style.',
    image: '/templates/blogger-coffee.webp'
  },
  {
    id: 'blogger-travel',
    category: 'bloggers',
    title: 'Тревел-блог',
    description: 'Тропики',
    prompt: 'Travel blogger style. Show the person from the photo holding a coconut on a tropical beach with palm trees. CRUCIAL: Keep the face exactly identical. Photorealistic style.',
    image: '/templates/blogger-travel.webp'
  },
  {
    id: 'blogger-fashion',
    category: 'bloggers',
    title: 'Стритстайл',
    description: 'Городская мода',
    prompt: 'Fashion blogger street style photo. Show the person from the photo walking down a city street, holding a coffee cup, stylish outfit. CRUCIAL: Preserve facial identity. Photorealistic style.',
    image: '/templates/blogger-fashion.webp'
  },
  {
    id: 'blogger-fitness',
    category: 'bloggers',
    title: 'Йога Блог',
    description: 'ЗОЖ',
    prompt: 'Fitness blogger. Show the person from the photo doing yoga in a bright studio with plants. Athletic wear. CRUCIAL: Maintain exact facial identity. Photorealistic style.',
    image: '/templates/blogger-fitness.webp'
  },
  {
    id: 'blogger-food',
    category: 'bloggers',
    title: 'Фуд-блог',
    description: 'Обзор еды',
    prompt: 'Show the person from the photo sitting at a table full of delicious brunch food, holding a fork, smiling. CRUCIAL: Keep the face exactly identical. Photorealistic style.',
    image: '/templates/blogger-food.webp'
  },
  {
    id: 'blogger-car',
    category: 'bloggers',
    title: 'Авто-блог',
    description: 'За рулем',
    prompt: 'Car vlogger style. Show the person from the photo sitting in the driver seat of a luxury car, hands on steering wheel. CRUCIAL: Preserve facial identity. Photorealistic style.',
    image: '/templates/blogger-car.webp'
  },
  {
    id: 'blogger-minimal',
    category: 'bloggers',
    title: 'Рабочее место',
    description: 'Минимализм',
    prompt: 'Minimalist aesthetic lifestyle shot. Show the person from the photo sitting at a clean white desk with a macbook and plant. CRUCIAL: Maintain exact facial identity. Photorealistic style.',
    image: '/templates/blogger-minimal.webp'
  },
  {
    id: 'blogger-party',
    category: 'bloggers',
    title: 'Вечеринка',
    description: 'Ночная жизнь',
    prompt: 'Lifestyle party shot. Show the person from the photo on a rooftop bar at night with city lights, holding a drink. CRUCIAL: Keep the face exactly identical. Photorealistic style.',
    image: '/templates/blogger-party.webp'
  },

  // --- RICH LIFE CATEGORY ---
  {
    id: 'rich-jet',
    category: 'rich_life',
    title: 'Частный Джет',
    description: 'Первый класс',
    prompt: 'Place the person in a luxury private jet cabin with leather cream seats and champagne. CRUCIAL: Preserve the facial features exactly. Photorealistic style, detailed skin texture.',
    image: '/templates/rich-jet.webp'
  },
  {
    id: 'rich-yacht',
    category: 'rich_life',
    title: 'Яхта',
    description: 'Океан',
    prompt: 'Place the person on the deck of a luxury superyacht in the ocean. White clothes, sunglasses, blue water. CRUCIAL: Maintain exact facial identity. Photorealistic style.',
    image: '/templates/rich-yacht.webp'
  },
  {
    id: 'rich-villa',
    category: 'rich_life',
    title: 'Вилла',
    description: 'Инфинити бассейн',
    prompt: 'Place the person in a luxury infinity pool at a modern villa overlooking the sea at sunset. CRUCIAL: Keep the face exactly identical. Photorealistic style.',
    image: '/templates/rich-villa.webp'
  },
  {
    id: 'rich-supercar',
    category: 'rich_life',
    title: 'Суперкар',
    description: 'Lamborghini',
    prompt: 'Person leaning against a bright lime green Lamborghini supercar. Urban background. CRUCIAL: Preserve facial identity. Photorealistic style.',
    image: '/templates/rich-supercar.webp'
  },
  {
    id: 'rich-penthouse',
    category: 'rich_life',
    title: 'Пентхаус',
    description: 'Вид на город',
    prompt: 'Person standing near floor-to-ceiling windows in a luxury penthouse apartment with night city skyline view. CRUCIAL: Maintain exact facial identity. Photorealistic style.',
    image: '/templates/rich-penthouse.webp'
  },
  {
    id: 'rich-shopping',
    category: 'rich_life',
    title: 'Шопинг',
    description: 'Брендовые пакеты',
    prompt: 'Person walking carrying many luxury brand shopping bags (Gucci, LV, Prada). High-end street. CRUCIAL: Keep the face exactly identical. Photorealistic style.',
    image: '/templates/rich-shopping.webp'
  },
  {
    id: 'rich-champagne',
    category: 'rich_life',
    title: 'Шампанское',
    description: 'Бокал Crystal',
    prompt: 'Close up of person holding a crystal glass of expensive champagne at a gala dinner. CRUCIAL: Preserve facial identity. Photorealistic style.',
    image: '/templates/rich-champagne.webp'
  },
  {
    id: 'rich-helicopter',
    category: 'rich_life',
    title: 'Вертолет',
    description: 'Полет над городом',
    prompt: 'Person sitting in a helicopter with headsets on, looking out the window at the view. CRUCIAL: Maintain exact facial identity. Photorealistic style.',
    image: '/templates/rich-helicopter.webp'
  },
  {
    id: 'rich-golf',
    category: 'rich_life',
    title: 'Гольф',
    description: 'Закрытый клуб',
    prompt: 'Person posing on a pristine golf course with a golf club. Country club atmosphere. CRUCIAL: Keep the face exactly identical. Photorealistic style.',
    image: '/templates/rich-golf.webp'
  },
  {
    id: 'rich-watch',
    category: 'rich_life',
    title: 'Часы',
    description: 'Rolex на руке',
    prompt: 'Focus on a luxury gold watch on the person\'s wrist. Driving a luxury car or in a suit. Photorealistic style.',
    image: '/templates/rich-watch.webp'
  },

  // --- FAMILY CATEGORY (REFINED PROMPTS) ---
  {
    id: 'family-addams',
    category: 'family',
    title: 'Семейка Аддамс',
    description: 'Готический стиль',
    prompt: 'Transform the specific family/group from the uploaded photo into a dark, elegant gothic masterpiece. High-contrast cinematic lighting. Everyone dressed in high-quality black velvet and lace formal wear. CRUCIAL: Each person in the output must have a 100% identical face to their counterpart in the original photo. No AI face genericizing. Detailed skin texture, photorealistic, professional dark studio atmosphere. Maintain individual heights and positions.',
    image: '/templates/family-addams.webp'
  },
  {
    id: 'family-wild-west',
    category: 'family',
    title: 'Дикий Запад',
    description: 'Ковбои',
    prompt: 'CRUCIAL: Preserve facial identity exactly. Dress the group as cowboys and sheriffs. Hats, leather vests, boots. Background: old western saloon. Photorealistic style.',
    image: '/templates/family-wild-west.webp'
  },
  {
    id: 'family-vikings',
    category: 'family',
    title: 'Викинги',
    description: 'Воины севера',
    prompt: 'CRUCIAL: Preserve facial identity exactly. Dress everyone as fierce vikings with furs, leather armor, and horned helmets. Background: misty fjord. Photorealistic style.',
    image: '/templates/family-vikings.webp'
  },
  {
    id: 'family-royal',
    category: 'family',
    title: 'Королевская семья',
    description: 'Ренессанс',
    prompt: 'CRUCIAL: Preserve facial identity exactly. Dress everyone in luxurious renaissance royal clothes, velvet robes, crowns. Background: palace throne room. Photorealistic style.',
    image: '/templates/family-royal.webp'
  },
  {
    id: 'family-pajamas',
    category: 'family',
    title: 'Пижамная вечеринка',
    description: 'Кигуруми',
    prompt: 'CRUCIAL: Preserve facial identity exactly. Dress everyone in matching funny colorful animal onesies (kigurumi). Background: cozy bedroom. Photorealistic style.',
    image: '/templates/family-pajamas.webp'
  },
  {
    id: 'family-space',
    category: 'family',
    title: 'Космос',
    description: 'Экипаж корабля',
    prompt: 'CRUCIAL: Preserve facial identity exactly. Dress everyone in futuristic sci-fi space uniforms. Background: spaceship bridge with stars. Photorealistic style.',
    image: '/templates/family-space.webp'
  },
  {
    id: 'family-cavemen',
    category: 'family',
    title: 'Пещерные люди',
    description: 'Каменный век',
    prompt: 'CRUCIAL: Preserve facial identity exactly. Dress everyone in leopard prints and animal furs, holding wooden clubs. Background: stone cave. Photorealistic style.',
    image: '/templates/family-cavemen.webp'
  },
  {
    id: 'family-classic',
    category: 'family',
    title: 'Классика',
    description: 'Семейная студия',
    prompt: 'Professional classic family portrait in a studio setting. Neutral background, elegant but casual attire, warm smiles, soft lighting. CRUCIAL: All individuals must retain 100% identical facial features and expressions from the original photo. Photorealistic 8k.',
    image: '/templates/family-classic.webp'
  },
  {
    id: 'family-zombies',
    category: 'family',
    title: 'Зомби',
    description: 'Апокалипсис',
    prompt: 'CRUCIAL: Preserve facial identity exactly. Turn the family into funny green zombies. Background: abandoned city.',
    image: '/templates/family-zombies.webp'
  },
  {
    id: 'family-cartoon',
    category: 'family',
    title: 'Симпсоны',
    description: 'Мультфильм',
    prompt: 'Transform the image into a famous 2D cartoon style with yellow skin. Background: suburban living room.',
    image: '/templates/family-cartoon.webp'
  },

  // --- DOCUMENTS CATEGORY ---
  {
    id: 'doc-ru-passport',
    category: 'documents',
    title: '🇷🇺 Загранпаспорт РФ',
    description: '35×45 мм',
    prompt: 'Official document ID photo. Keep the exact same person and face identity from the input image. Face strictly frontal, looking directly at camera, neutral expression, mouth closed, both eyes open, no smile. plain solid white background, evenly lit, no shadows, no red-eye. Head and shoulders only, centered. No hats or head coverings (unless religious), no glasses, no reflections. Sharp focus, high resolution, photorealistic, print quality 300 dpi. Russian international passport standard, face occupies 70-80% of the frame, plain white background.',
    image: '/templates/doc-white.webp'
  },
  {
    id: 'doc-ru-internal',
    category: 'documents',
    title: '🇷🇺 Паспорт РФ (внутренний)',
    description: '35×45 мм',
    prompt: 'Official document ID photo. Keep the exact same person and face identity from the input image. Face strictly frontal, looking directly at camera, neutral expression, mouth closed, both eyes open, no smile. plain solid white background, evenly lit, no shadows, no red-eye. Head and shoulders only, centered. No hats or head coverings (unless religious), no glasses, no reflections. Sharp focus, high resolution, photorealistic, print quality 300 dpi. Russian internal passport photo, plain white background, formal look.',
    image: '/templates/doc-white.webp'
  },
  {
    id: 'doc-ru-medical',
    category: 'documents',
    title: '🇷🇺 Медкнижка / справка РФ',
    description: '30×40 мм',
    prompt: 'Official document ID photo. Keep the exact same person and face identity from the input image. Face strictly frontal, looking directly at camera, neutral expression, mouth closed, both eyes open, no smile. plain solid white background, evenly lit, no shadows, no red-eye. Head and shoulders only, centered. No hats or head coverings (unless religious), no glasses, no reflections. Sharp focus, high resolution, photorealistic, print quality 300 dpi. Russian medical record photo 30x40mm, plain white background.',
    image: '/templates/doc-white.webp'
  },
  {
    id: 'doc-schengen',
    category: 'documents',
    title: '🇪🇺 Виза Шенген',
    description: '35×45 мм',
    prompt: 'Official document ID photo. Keep the exact same person and face identity from the input image. Face strictly frontal, looking directly at camera, neutral expression, mouth closed, both eyes open, no smile. plain light grey or white background, evenly lit, no shadows, no red-eye. Head and shoulders only, centered. No hats or head coverings (unless religious), no glasses, no reflections. Sharp focus, high resolution, photorealistic, print quality 300 dpi. EU Schengen visa standard, face 70-80% of height, dark plain clothing.',
    image: '/templates/doc-grey.webp'
  },
  {
    id: 'doc-uk',
    category: 'documents',
    title: '🇬🇧 Виза/паспорт UK',
    description: '35×45 мм',
    prompt: 'Official document ID photo. Keep the exact same person and face identity from the input image. Face strictly frontal, looking directly at camera, neutral expression, mouth closed, both eyes open, no smile. plain light grey background, evenly lit, no shadows, no red-eye. Head and shoulders only, centered. No hats or head coverings (unless religious), no glasses, no reflections. Sharp focus, high resolution, photorealistic, print quality 300 dpi. UK passport and visa standard, light grey or cream background, neutral expression.',
    image: '/templates/doc-grey.webp'
  },
  {
    id: 'doc-germany',
    category: 'documents',
    title: '🇩🇪 Виза/паспорт Германия',
    description: '35×45 мм',
    prompt: 'Official document ID photo. Keep the exact same person and face identity from the input image. Face strictly frontal, looking directly at camera, neutral expression, mouth closed, both eyes open, no smile. plain light grey background, evenly lit, no shadows, no red-eye. Head and shoulders only, centered. No hats or head coverings (unless religious), no glasses, no reflections. Sharp focus, high resolution, photorealistic, print quality 300 dpi. German biometric passport standard, light grey background.',
    image: '/templates/doc-grey.webp'
  },
  {
    id: 'doc-france',
    category: 'documents',
    title: '🇫🇷 Виза/паспорт Франция',
    description: '35×45 мм',
    prompt: 'Official document ID photo. Keep the exact same person and face identity from the input image. Face strictly frontal, looking directly at camera, neutral expression, mouth closed, both eyes open, no smile. plain light grey background, evenly lit, no shadows, no red-eye. Head and shoulders only, centered. No hats or head coverings (unless religious), no glasses, no reflections. Sharp focus, high resolution, photorealistic, print quality 300 dpi. French passport standard, light grey background.',
    image: '/templates/doc-grey.webp'
  },
  {
    id: 'doc-italy',
    category: 'documents',
    title: '🇮🇹 Виза/паспорт Италия',
    description: '35×45 мм',
    prompt: 'Official document ID photo. Keep the exact same person and face identity from the input image. Face strictly frontal, looking directly at camera, neutral expression, mouth closed, both eyes open, no smile. plain solid white background, evenly lit, no shadows, no red-eye. Head and shoulders only, centered. No hats or head coverings (unless religious), no glasses, no reflections. Sharp focus, high resolution, photorealistic, print quality 300 dpi. Italian passport and Schengen visa standard, white background.',
    image: '/templates/doc-white.webp'
  },
  {
    id: 'doc-spain',
    category: 'documents',
    title: '🇪🇸 Виза/паспорт Испания',
    description: '32×26 мм голова / 35×45',
    prompt: 'Official document ID photo. Keep the exact same person and face identity from the input image. Face strictly frontal, looking directly at camera, neutral expression, mouth closed, both eyes open, no smile. plain solid white background, evenly lit, no shadows, no red-eye. Head and shoulders only, centered. No hats or head coverings (unless religious), no glasses, no reflections. Sharp focus, high resolution, photorealistic, print quality 300 dpi. Spanish passport and Schengen visa standard, white background.',
    image: '/templates/doc-white.webp'
  },
  {
    id: 'doc-poland',
    category: 'documents',
    title: '🇵🇱 Виза/паспорт Польша',
    description: '35×45 мм',
    prompt: 'Official document ID photo. Keep the exact same person and face identity from the input image. Face strictly frontal, looking directly at camera, neutral expression, mouth closed, both eyes open, no smile. plain light grey background, evenly lit, no shadows, no red-eye. Head and shoulders only, centered. No hats or head coverings (unless religious), no glasses, no reflections. Sharp focus, high resolution, photorealistic, print quality 300 dpi. Polish passport standard, light grey background.',
    image: '/templates/doc-grey.webp'
  },
  {
    id: 'doc-greece',
    category: 'documents',
    title: '🇬🇷 Виза Греция (Шенген)',
    description: '35×45 мм',
    prompt: 'Official document ID photo. Keep the exact same person and face identity from the input image. Face strictly frontal, looking directly at camera, neutral expression, mouth closed, both eyes open, no smile. plain solid white background, evenly lit, no shadows, no red-eye. Head and shoulders only, centered. No hats or head coverings (unless religious), no glasses, no reflections. Sharp focus, high resolution, photorealistic, print quality 300 dpi. Greek Schengen visa standard, white background.',
    image: '/templates/doc-white.webp'
  },
  {
    id: 'doc-czech',
    category: 'documents',
    title: '🇨🇿 Виза Чехия (Шенген)',
    description: '35×45 мм',
    prompt: 'Official document ID photo. Keep the exact same person and face identity from the input image. Face strictly frontal, looking directly at camera, neutral expression, mouth closed, both eyes open, no smile. plain solid white background, evenly lit, no shadows, no red-eye. Head and shoulders only, centered. No hats or head coverings (unless religious), no glasses, no reflections. Sharp focus, high resolution, photorealistic, print quality 300 dpi. Czech Schengen visa standard, white background.',
    image: '/templates/doc-white.webp'
  },
  {
    id: 'doc-us-visa',
    category: 'documents',
    title: '🇺🇸 Виза США (2×2″)',
    description: '51×51 мм',
    prompt: 'Official document ID photo. Keep the exact same person and face identity from the input image. Face strictly frontal, looking directly at camera, neutral expression, mouth closed, both eyes open, no smile. plain white or off-white background, evenly lit, no shadows, no red-eye. Head and shoulders only, centered. No hats or head coverings (unless religious), no glasses, no reflections. Sharp focus, high resolution, photorealistic, print quality 300 dpi. US visa and passport 2x2 inch square format, head 50-69% of photo height, off-white or white background.',
    image: '/templates/doc-square.webp'
  },
  {
    id: 'doc-us-green-card',
    category: 'documents',
    title: '🇺🇸 Green Card / DV-лотерея',
    description: '51×51 мм',
    prompt: 'Official document ID photo. Keep the exact same person and face identity from the input image. Face strictly frontal, looking directly at camera, neutral expression, mouth closed, both eyes open, no smile. plain white background, evenly lit, no shadows, no red-eye. Head and shoulders only, centered. No hats or head coverings (unless religious), no glasses, no reflections. Sharp focus, high resolution, photorealistic, print quality 300 dpi. US Green Card and DV lottery 2x2 inch square, white background, head centered.',
    image: '/templates/doc-square.webp'
  },
  {
    id: 'doc-canada',
    category: 'documents',
    title: '🇨🇦 Виза/паспорт Канада',
    description: '50×70 мм',
    prompt: 'Official document ID photo. Keep the exact same person and face identity from the input image. Face strictly frontal, looking directly at camera, neutral expression, mouth closed, both eyes open, no smile. plain white background, evenly lit, no shadows, no red-eye. Head and shoulders only, centered. No hats or head coverings (unless religious), no glasses, no reflections. Sharp focus, high resolution, photorealistic, print quality 300 dpi. Canadian passport and visa 50x70mm, chin-to-crown 31-36mm, plain white background.',
    image: '/templates/doc-white.webp'
  },
  {
    id: 'doc-brazil',
    category: 'documents',
    title: '🇧🇷 Виза Бразилия',
    description: '51×51 мм',
    prompt: 'Official document ID photo. Keep the exact same person and face identity from the input image. Face strictly frontal, looking directly at camera, neutral expression, mouth closed, both eyes open, no smile. plain white background, evenly lit, no shadows, no red-eye. Head and shoulders only, centered. No hats or head coverings (unless religious), no glasses, no reflections. Sharp focus, high resolution, photorealistic, print quality 300 dpi. Brazil visa 2x2 inch square, white background.',
    image: '/templates/doc-square.webp'
  },
  {
    id: 'doc-mexico',
    category: 'documents',
    title: '🇲🇽 Виза Мексика',
    description: '35×45 мм',
    prompt: 'Official document ID photo. Keep the exact same person and face identity from the input image. Face strictly frontal, looking directly at camera, neutral expression, mouth closed, both eyes open, no smile. plain solid white background, evenly lit, no shadows, no red-eye. Head and shoulders only, centered. No hats or head coverings (unless religious), no glasses, no reflections. Sharp focus, high resolution, photorealistic, print quality 300 dpi. Mexico visa standard, white background.',
    image: '/templates/doc-white.webp'
  },
  {
    id: 'doc-china',
    category: 'documents',
    title: '🇨🇳 Виза Китай',
    description: '33×48 мм',
    prompt: 'Official document ID photo. Keep the exact same person and face identity from the input image. Face strictly frontal, looking directly at camera, neutral expression, mouth closed, both eyes open, no smile. plain white background, evenly lit, no shadows, no red-eye. Head and shoulders only, centered. No hats or head coverings (unless religious), no glasses, no reflections. Sharp focus, high resolution, photorealistic, print quality 300 dpi. China visa 33x48mm, white background, ears visible, no smile.',
    image: '/templates/doc-white.webp'
  },
  {
    id: 'doc-india',
    category: 'documents',
    title: '🇮🇳 Виза Индия (e-Visa)',
    description: '51×51 мм',
    prompt: 'Official document ID photo. Keep the exact same person and face identity from the input image. Face strictly frontal, looking directly at camera, neutral expression, mouth closed, both eyes open, no smile. plain white background, evenly lit, no shadows, no red-eye. Head and shoulders only, centered. No hats or head coverings (unless religious), no glasses, no reflections. Sharp focus, high resolution, photorealistic, print quality 300 dpi. India e-Visa 2x2 inch square, white background, face centered.',
    image: '/templates/doc-square.webp'
  },
  {
    id: 'doc-japan',
    category: 'documents',
    title: '🇯🇵 Виза/паспорт Япония',
    description: '35×45 мм',
    prompt: 'Official document ID photo. Keep the exact same person and face identity from the input image. Face strictly frontal, looking directly at camera, neutral expression, mouth closed, both eyes open, no smile. plain solid white background, evenly lit, no shadows, no red-eye. Head and shoulders only, centered. No hats or head coverings (unless religious), no glasses, no reflections. Sharp focus, high resolution, photorealistic, print quality 300 dpi. Japan passport and visa 35x45mm, chin-to-crown 34mm, plain white background.',
    image: '/templates/doc-white.webp'
  },
  {
    id: 'doc-korea',
    category: 'documents',
    title: '🇰🇷 Виза Ю. Корея',
    description: '35×45 мм',
    prompt: 'Official document ID photo. Keep the exact same person and face identity from the input image. Face strictly frontal, looking directly at camera, neutral expression, mouth closed, both eyes open, no smile. plain solid white background, evenly lit, no shadows, no red-eye. Head and shoulders only, centered. No hats or head coverings (unless religious), no glasses, no reflections. Sharp focus, high resolution, photorealistic, print quality 300 dpi. South Korea visa 35x45mm, white background, ears visible.',
    image: '/templates/doc-white.webp'
  },
  {
    id: 'doc-thailand',
    category: 'documents',
    title: '🇹🇭 Виза Таиланд',
    description: '40×60 мм',
    prompt: 'Official document ID photo. Keep the exact same person and face identity from the input image. Face strictly frontal, looking directly at camera, neutral expression, mouth closed, both eyes open, no smile. plain white background, evenly lit, no shadows, no red-eye. Head and shoulders only, centered. No hats or head coverings (unless religious), no glasses, no reflections. Sharp focus, high resolution, photorealistic, print quality 300 dpi. Thailand visa 40x60mm, white background, formal attire.',
    image: '/templates/doc-white.webp'
  },
  {
    id: 'doc-vietnam',
    category: 'documents',
    title: '🇻🇳 Виза Вьетнам',
    description: '40×60 мм',
    prompt: 'Official document ID photo. Keep the exact same person and face identity from the input image. Face strictly frontal, looking directly at camera, neutral expression, mouth closed, both eyes open, no smile. plain white background, evenly lit, no shadows, no red-eye. Head and shoulders only, centered. No hats or head coverings (unless religious), no glasses, no reflections. Sharp focus, high resolution, photorealistic, print quality 300 dpi. Vietnam visa 4x6cm, white background, no glasses.',
    image: '/templates/doc-white.webp'
  },
  {
    id: 'doc-uae',
    category: 'documents',
    title: '🇦🇪 Виза ОАЭ',
    description: '43×55 мм',
    prompt: 'Official document ID photo. Keep the exact same person and face identity from the input image. Face strictly frontal, looking directly at camera, neutral expression, mouth closed, both eyes open, no smile. plain white background, evenly lit, no shadows, no red-eye. Head and shoulders only, centered. No hats or head coverings (unless religious), no glasses, no reflections. Sharp focus, high resolution, photorealistic, print quality 300 dpi. UAE visa standard, white background, no smile.',
    image: '/templates/doc-white.webp'
  },
  {
    id: 'doc-turkey',
    category: 'documents',
    title: '🇹🇷 Виза/паспорт Турция',
    description: '50×60 мм',
    prompt: 'Official document ID photo. Keep the exact same person and face identity from the input image. Face strictly frontal, looking directly at camera, neutral expression, mouth closed, both eyes open, no smile. plain white background, evenly lit, no shadows, no red-eye. Head and shoulders only, centered. No hats or head coverings (unless religious), no glasses, no reflections. Sharp focus, high resolution, photorealistic, print quality 300 dpi. Turkey visa and passport 50x60mm, white background.',
    image: '/templates/doc-white.webp'
  },
  {
    id: 'doc-israel',
    category: 'documents',
    title: '🇮🇱 Виза Израиль',
    description: '51×51 мм',
    prompt: 'Official document ID photo. Keep the exact same person and face identity from the input image. Face strictly frontal, looking directly at camera, neutral expression, mouth closed, both eyes open, no smile. plain white background, evenly lit, no shadows, no red-eye. Head and shoulders only, centered. No hats or head coverings (unless religious), no glasses, no reflections. Sharp focus, high resolution, photorealistic, print quality 300 dpi. Israel visa 2x2 inch square, white background.',
    image: '/templates/doc-square.webp'
  },
  {
    id: 'doc-indonesia',
    category: 'documents',
    title: '🇮🇩 Виза Индонезия (Бали)',
    description: '51×51 мм',
    prompt: 'Official document ID photo. Keep the exact same person and face identity from the input image. Face strictly frontal, looking directly at camera, neutral expression, mouth closed, both eyes open, no smile. plain white background, evenly lit, no shadows, no red-eye. Head and shoulders only, centered. No hats or head coverings (unless religious), no glasses, no reflections. Sharp focus, high resolution, photorealistic, print quality 300 dpi. Indonesia (Bali) visa 2x2 inch square, white background.',
    image: '/templates/doc-square.webp'
  },
  {
    id: 'doc-australia',
    category: 'documents',
    title: '🇦🇺 Виза/паспорт Австралия',
    description: '35×45 мм',
    prompt: 'Official document ID photo. Keep the exact same person and face identity from the input image. Face strictly frontal, looking directly at camera, neutral expression, mouth closed, both eyes open, no smile. plain solid white background, evenly lit, no shadows, no red-eye. Head and shoulders only, centered. No hats or head coverings (unless religious), no glasses, no reflections. Sharp focus, high resolution, photorealistic, print quality 300 dpi. Australian passport and visa 35x45mm, plain white or light background.',
    image: '/templates/doc-white.webp'
  },
  {
    id: 'doc-new-zealand',
    category: 'documents',
    title: '🇳🇿 Виза Новая Зеландия',
    description: '35×45 мм',
    prompt: 'Official document ID photo. Keep the exact same person and face identity from the input image. Face strictly frontal, looking directly at camera, neutral expression, mouth closed, both eyes open, no smile. plain solid white background, evenly lit, no shadows, no red-eye. Head and shoulders only, centered. No hats or head coverings (unless religious), no glasses, no reflections. Sharp focus, high resolution, photorealistic, print quality 300 dpi. New Zealand visa 35x45mm, plain light background.',
    image: '/templates/doc-white.webp'
  },
  {
    id: 'doc-egypt',
    category: 'documents',
    title: '🇪🇬 Виза Египет',
    description: '40×60 мм',
    prompt: 'Official document ID photo. Keep the exact same person and face identity from the input image. Face strictly frontal, looking directly at camera, neutral expression, mouth closed, both eyes open, no smile. plain white background, evenly lit, no shadows, no red-eye. Head and shoulders only, centered. No hats or head coverings (unless religious), no glasses, no reflections. Sharp focus, high resolution, photorealistic, print quality 300 dpi. Egypt visa 40x60mm, white background.',
    image: '/templates/doc-white.webp'
  },
  {
    id: 'doc-resume',
    category: 'documents',
    title: '💼 Резюме / CV',
    description: '35×45 мм',
    prompt: 'Professional CV resume headshot. Keep the same person and face identity from the input image. Business attire, plain neutral light grey or white background, even soft lighting, no harsh shadows. Head and shoulders, face about 60% of the frame, slight natural friendly smile allowed. Corporate portrait, photorealistic, high quality.',
    image: '/templates/doc-resume.webp'
  },
  {
    id: 'doc-linkedin',
    category: 'documents',
    title: '💼 LinkedIn / соцсети',
    description: '400×400 px',
    prompt: 'Professional LinkedIn profile headshot, square format. Keep the same person and face identity. Business casual attire, softly blurred neutral background, warm even lighting, confident friendly smile. Head and shoulders. Photorealistic, high quality.',
    image: '/templates/doc-square.webp'
  },
  {
    id: 'doc-student',
    category: 'documents',
    title: '🎓 Студенческий / пропуск',
    description: '30×40 мм',
    prompt: 'Official document ID photo. Keep the exact same person and face identity from the input image. Face strictly frontal, looking directly at camera, neutral expression, mouth closed, both eyes open, no smile. plain solid white background, evenly lit, no shadows, no red-eye. Head and shoulders only, centered. No hats or head coverings (unless religious), no glasses, no reflections. Sharp focus, high resolution, photorealistic, print quality 300 dpi. Student ID / access pass photo 30x40mm, white background.',
    image: '/templates/doc-white.webp'
  },
  {
    id: 'doc-driver',
    category: 'documents',
    title: '🚗 Водительское удостоверение',
    description: '35×45 мм',
    prompt: 'Official document ID photo. Keep the exact same person and face identity from the input image. Face strictly frontal, looking directly at camera, neutral expression, mouth closed, both eyes open, no smile. plain solid white background, evenly lit, no shadows, no red-eye. Head and shoulders only, centered. No hats or head coverings (unless religious), no glasses, no reflections. Sharp focus, high resolution, photorealistic, print quality 300 dpi. Driver license photo 35x45mm, plain light background.',
    image: '/templates/doc-white.webp'
  },

  // --- ECOMMERCE CATEGORY ---
  {
    id: 'product-podium',
    category: 'ecommerce',
    title: '3D Подиум',
    description: 'Минимализм',
    prompt: 'Place product on stylish minimalist 3D podium. Pastel colors, soft shadows. Photorealistic product photography.',
    image: '/templates/product-podium.webp'
  },
  {
    id: 'product-nature',
    category: 'ecommerce',
    title: 'Природа',
    description: 'Камни и мох',
    prompt: 'Product photography on nature. Mossy stones, sunlight, bokeh. Organic vibe. Photorealistic.',
    image: '/templates/product-nature.webp'
  },
  {
    id: 'product-luxury',
    category: 'ecommerce',
    title: 'Премиум',
    description: 'Черное и золото',
    prompt: 'Luxury product photography. Black background with golden accents and dramatic lighting, premium look. Photorealistic.',
    image: '/templates/product-luxury.webp'
  },

  // --- BUSINESS CATEGORY ---
  {
    id: 'business-startup',
    category: 'business',
    title: 'Стартап',
    description: 'Современный офис',
    prompt: 'Business portrait in a modern startup office. Glass walls, casual professional attire, confident smile. CRUCIAL: Keep the face exactly identical. Photorealistic style, detailed skin texture.',
    image: '/templates/business-startup.webp'
  },
  {
    id: 'business-speech',
    category: 'business',
    title: 'Выступление',
    description: 'На сцене',
    prompt: 'Person giving a business presentation on stage. Ted talk style, spotlight, screen in background. CRUCIAL: Preserve facial identity. Photorealistic style.',
    image: '/templates/business-speech.webp'
  },

  // --- UGC CATEGORY ---
  {
    id: 'ugc-unboxing',
    category: 'ugc',
    title: 'Анпакинг',
    description: 'Распаковка',
    prompt: 'UGC style photo of person unboxing a package. Excited expression, hands visible, living room background. CRUCIAL: Keep the face exactly identical. Photorealistic style.',
    image: '/templates/ugc-unboxing.webp'
  },
  {
    id: 'ugc-review',
    category: 'ugc',
    title: 'Отзыв',
    description: 'Лайк товару',
    prompt: 'UGC product review. Person holding a product close to camera, thumbs up, domestic setting. CRUCIAL: Preserve facial identity. Photorealistic style.',
    image: '/templates/ugc-review.webp'
  },

  // --- STYLE TRENDS & ARTISTIC (NEW ADDITIONS) ---
  {
    id: 'soviet-retro',
    category: 'retro',
    title: 'Советское Ретро',
    description: 'Ностальгия',
    prompt: 'Vintage Soviet era portrait photography style. Warm nostalgic colors, subtle film grain, authentic 70s-80s apparel. Soft natural lighting. CRUCIAL: Preserve facial identity exactly. Photorealistic style.',
    image: getPreviewUrl('vintage soviet portrait photography 70s 80s', 3001)
  },
  {
    id: 'cyberpunk-city',
    category: 'style_trends',
    title: 'Cyberpunk',
    description: 'Неон и Город',
    prompt: 'Futuristic cyberpunk city portrait. Neon lights, rain, high-tech clothing, mechanical enhancements. Night atmosphere. CRUCIAL: Preserve facial identity. High contrast, cinematic.',
    image: '/templates/cyberpunk-city.webp'
  },
  {
    id: 'watercolor-art',
    category: 'style_trends',
    title: 'Акварель',
    description: 'Нежный арт',
    prompt: 'Soft watercolor painting portrait. Pastel colors, paper texture, artistic brush strokes. Dreamy and romantic. CRUCIAL: Keep the face recognizable but artistic.',
    image: '/templates/watercolor-art.webp'
  },
  {
    id: 'pencil-sketch',
    category: 'style_trends',
    title: 'Карандаш',
    description: 'Набросок',
    prompt: 'Realistic graphite pencil sketch on textured paper. Detailed shading, cross-hatching. Artistic monochrome. CRUCIAL: Preserve facial identity.',
    image: '/templates/pencil-sketch.webp'
  },
  {
    id: 'oil-painting',
    category: 'style_trends',
    title: 'Масло',
    description: 'Классика',
    prompt: 'Classic oil painting portrait. Visible brushstrokes, rich colors, canvas texture. Renaissance or classical art style. CRUCIAL: Keep the face recognizable.',
    image: '/templates/oil-painting.webp'
  },
  {
    id: 'polaroid-vintage',
    category: 'style_trends',
    title: 'Полароид',
    description: '90-е вайб',
    prompt: 'Vintage Polaroid photo style. Flash photography, slightly washed out colors, vignetting, retro vibe. CRUCIAL: Preserve facial identity.',
    image: '/templates/polaroid-vintage.webp'
  },
  {
    id: 'neon-noir',
    category: 'style_trends',
    title: 'Неон Нуар',
    description: 'Мистика',
    prompt: 'Cinematic neon noir portrait. Dark shadows, contrasting blue and pink neon lighting, moody atmosphere. Mystery thriller vibe. CRUCIAL: Preserve facial identity.',
    image: '/templates/neon-noir.webp'
  },
  {
    id: 'studio-bw',
    category: 'style_trends',
    title: 'Ч/Б Портрет',
    description: 'Студия',
    prompt: 'Professional black and white studio photography. High contrast, dramatic lighting, sharp details. Elegant and timeless. CRUCIAL: Preserve facial identity.',
    image: '/templates/studio-bw.webp'
  },
  {
    id: 'double-exposure',
    category: 'style_trends',
    title: 'Double Exposure',
    description: 'Сюрреализм',
    prompt: 'Artistic double exposure portrait combining face with a forest or city landscape. Surreal and dreamy. Silhouette effect. CRUCIAL: Keep the face recognizable.',
    image: '/templates/double-exposure.webp'
  },
  {
    id: 'pop-art',
    category: 'style_trends',
    title: 'Поп-арт',
    description: 'Уорхол',
    prompt: 'Pop Art style portrait. Bright contrasting colors, halftone dots, comic book style outlines. Andy Warhol style. CRUCIAL: Keep the face recognizable.',
    image: '/templates/pop-art.webp'
  },
  {
    id: 'cinematic-film',
    category: 'style_trends',
    title: 'Кинокадр',
    description: 'Фильм',
    prompt: 'Cinematic film still. Wide aspect ratio, teal and orange color grading, grain, depth of field. Movie scene look. CRUCIAL: Preserve facial identity.',
    image: '/templates/cinematic-film.webp'
  },
  {
    id: 'anime-style',
    category: 'style_trends',
    title: 'Аниме',
    description: 'Япония',
    prompt: 'High quality anime style portrait. Vibrant colors, big expressive eyes, cel shading. Makoto Shinkai background style. CRUCIAL: Keep key facial features recognizable.',
    image: '/templates/anime-style.webp'
  },
  {
    id: 'clay-3d',
    category: 'style_trends',
    title: '3D Пластилин',
    description: 'Claymorphism',
    prompt: 'cute 3d clay character portait made of plasticine. visible fingerprints, stop motion animation style, soft lighting, vibrant colors. CRUCIAL: recognizable facial features adapted to clay style.',
    image: '/templates/clay-3d.webp'
  },
  {
    id: 'pixel-art',
    category: 'style_trends',
    title: 'Пиксель Арт',
    description: 'Ретро игры',
    prompt: 'Pixel art portrait. 16-bit retro game style. Limited color palette, blocky pixels. CRUCIAL: Recognizable features in pixel form.',
    image: '/templates/pixel-art.webp'
  },
  {
    id: 'gothic-fantasy',
    category: 'style_trends',
    title: 'Готика',
    description: 'Темная магия',
    prompt: 'dark gothic fantasy portrait. pale skin, dramatic black lace dress, mysterious ancient castle background, candle lighting, melancholic atmosphere. photorealistic.',
    image: '/templates/gothic-fantasy.webp'
  },

  // --- RETRO PHOTO COLLECTION ---
  {
    id: 'retro-polaroid-classic',
    category: 'retro',
    title: 'Classic Polaroid',
    description: '600 Series',
    prompt: 'Authentic vintage Polaroid photo. Square white border, slightly washed out colors, high contrast flash lighting, chemical texture. CRUCIAL: Preserve facial identity. Photorealistic.',
    image: '/templates/retro-polaroid-classic.webp'
  },
  {
    id: 'retro-kodachrome-50s',
    category: 'retro',
    title: 'Kodachrome',
    description: '1950s Style',
    prompt: '1950s Kodachrome color film photography. Rich saturated reds and blues, fine grain, cinematic lighting, mid-century fashion. CRUCIAL: Preserve facial identity. Photorealistic.',
    image: '/templates/retro-kodachrome-50s.webp'
  },
  {
    id: 'retro-film-noir',
    category: 'retro',
    title: 'Film Noir',
    description: '1940s Monochrome',
    prompt: 'Classic 1940s film noir black and white photography. Dramatic low-key lighting, deep shadows, smoke, fedora hat, hard light. CRUCIAL: Preserve facial identity. High contrast monochrome.',
    image: '/templates/retro-film-noir.webp'
  },
  {
    id: 'retro-flash-90s',
    category: 'retro',
    title: '90s Party',
    description: 'Night Flash',
    prompt: 'Retro 90s party photography. Direct camera flash, red-eye effect, high saturation, messy background, vintage fashion. CRUCIAL: Preserve facial identity. Photorealistic.',
    image: '/templates/retro-flash-90s.webp'
  },
  {
    id: 'retro-vhs-grain',
    category: 'retro',
    title: 'VHS Aesthetic',
    description: '80s Home Video',
    prompt: '80s VHS home video screen capture. Magnetic tape distortion, tracking lines, color bleeding, low resolution, date stamp in corner. CRUCIAL: Preserve facial identity.',
    image: '/templates/retro-vhs-grain.webp'
  },
  {
    id: 'retro-daguerreotype',
    category: 'retro',
    title: 'Daguerreotype',
    description: '19th Century',
    prompt: 'Antique 19th-century daguerreotype portrait. Silver plate texture, scratches, sepia tones, long exposure blur, Victorian clothing. CRUCIAL: Preserve facial identity in antique style.',
    image: '/templates/retro-daguerreotype.webp'
  },
  {
    id: 'retro-technicolor',
    category: 'retro',
    title: 'Technicolor',
    description: 'Golden Age',
    prompt: 'Golden Age of Hollywood Technicolor photography. Vibrant surreal colors, perfect studio lighting, glamorous makeup, sharp details. CRUCIAL: Preserve facial identity. Photorealistic.',
    image: '/templates/retro-technicolor.webp'
  },
  {
    id: 'retro-seventies-dream',
    category: 'retro',
    title: '70s Dream',
    description: 'Soft & Warm',
    prompt: '1970s soft focus film photography. Warm golden hour lighting, flared lens, faded edges, bohemian style, grainy. CRUCIAL: Preserve facial identity. Photorealistic.',
    image: '/templates/retro-seventies-dream.webp'
  },
  {
    id: 'retro-magazine-80s',
    category: 'retro',
    title: '80s Magazine',
    description: 'Pop Style',
    prompt: '1980s fashion magazine cover style. Bright colors, hairspray volume, bold makeup, hazy background, high grain. CRUCIAL: Preserve facial identity. Photorealistic.',
    image: '/templates/retro-magazine-80s.webp'
  },
  {
    id: 'retro-western-sepia',
    category: 'retro',
    title: 'Wild West',
    description: 'Sepia Print',
    prompt: 'Old Wild West wanted poster style. Heavy paper texture, sepia monochrome, rough edges, weathered look. CRUCIAL: Preserve facial identity.',
    image: '/templates/retro-western-sepia.webp'
  },
  {
    id: 'retro-candid-film',
    category: 'retro',
    title: 'Candid Film',
    description: 'Everyday Life',
    prompt: 'Modern candid film photography (Leica style). Natural grain, everyday setting, authentic expression, soft contrast. CRUCIAL: Preserve facial identity. Photorealistic.',
    image: '/templates/retro-candid-film.webp'
  },
  {
    id: 'retro-album-cover',
    category: 'retro',
    title: 'Album Cover',
    description: 'Artistic Retro',
    prompt: 'Vintage vinyl album cover aesthetic. Artistic composition, muted color palette, grain, high-end retro styling. CRUCIAL: Preserve facial identity.',
    image: '/templates/retro-album-cover.webp'
  },


  // --- SOVIET MOVIES SPECIAL ---
  {
    id: 'soviet-irony-fate',
    category: 'retro',
    title: 'Ирония Судьбы',
    description: 'Надя / Женя',
    prompt: 'Cinematic portrait in the style of the movie "Irony of Fate" (1975). Retro Soviet apartment interior. Wearing a fur hat or beige dress. Soft film grain, warm nostalgic lighting. Group compatible. Preserve identity of ALL faces in the reference. High fidelity face swap.',
    image: '/templates/soviet-irony-fate.webp'
  },
  {
    id: 'soviet-carnival-night',
    category: 'retro',
    title: 'Карнавальная Ночь',
    description: 'Леночка Крылова',
    prompt: 'Portrait in the style of "Carnival Night" (1956). Wearing a black dress with white muff/collar, standing on a stage with festive clock background. 50s musical vibe, bright stage lights. Group compatible. Preserve identity of ALL faces in the reference. High fidelity face swap.',
    image: '/templates/soviet-carnival-night.webp'
  },
  {
    id: 'soviet-morozko',
    category: 'retro',
    title: 'Морозко',
    description: 'Сказка',
    prompt: 'Fairy tale portrait in the style of "Morozko" (1964). Russian winter folklore costume, Kokoshnik or warm shawl. Snowy magical forest background. Frosty cheeks. Magical atmosphere. Group compatible. Preserve identity of ALL faces in the reference. High fidelity face swap.',
    image: '/templates/soviet-morozko.webp'
  },
  {
    id: 'soviet-charodei',
    category: 'retro',
    title: 'Чародеи',
    description: 'НУИНУ',
    prompt: 'Portrait in the style of "Charodei" (1982). White suit or sweater, Soviet institute corridor/hall. Sparkles and mystery. 80s Soviet aesthetic. Group compatible. Preserve identity of ALL faces in the reference. High fidelity face swap.',
    image: '/templates/soviet-charodei.webp'
  },
  {
    id: 'soviet-ivan-vasilievich',
    category: 'retro',
    title: 'Иван Васильевич',
    description: 'Царские палаты',
    prompt: 'Portrait in the style of "Ivan Vasilievich Changes Profession" (1973). Wearing a royal red kaftan and Monomakh\'s Cap (or boyar clothes). Kremlin chambers background. Cinematic comedy style. Group compatible. Preserve identity of ALL faces in the reference. High fidelity face swap.',
    image: '/templates/soviet-ivan-vasilievich.webp'
  },
  {
    id: 'soviet-gentlemen',
    category: 'retro',
    title: 'Джентльмены',
    description: 'Удачи',
    prompt: 'Portrait in the style of "Gentlemen of Fortune" (1971). Winter setting, wearing a sheepskin coat or heavy fur hat. Snowy Soviet street background. Comedy film aesthetic. Group compatible. Preserve identity of ALL faces in the reference. High fidelity face swap.',
    image: '/templates/soviet-gentlemen.webp'
  },

  // --- MAKEUP CATEGORY ---
  {
    id: 'makeup-nude',
    category: 'makeup',
    title: 'Нюд (Nude)',
    description: 'Без макияжа',
    prompt: 'Apply a natural "no-makeup" makeup look to the person. Glowing skin, light mascara, clear gloss, neat eyebrows, soft peach blush. CRUCIAL: Keep the face completely recognizable. Photorealistic style, detailed skin texture.',
    image: '/templates/makeup-nude.webp'
  },
  {
    id: 'makeup-hollywood',
    category: 'makeup',
    title: 'Голливуд',
    description: 'Красная помада',
    prompt: 'Apply classic Hollywood makeup. Bright red lipstick, black winged eyeliner, perfect matte skin, defined lashes. CRUCIAL: Preserve the facial features exactly. Photorealistic style, detailed skin texture.',
    image: '/templates/makeup-hollywood.webp'
  },
  {
    id: 'makeup-smokey',
    category: 'makeup',
    title: 'Смоки Айс',
    description: 'Вечерний',
    prompt: 'Apply dramatic black smokey eye makeup, nude matte lips, and defined cheekbone contouring. CRUCIAL: Maintain exact facial identity. Photorealistic style.',
    image: '/templates/makeup-smokey.webp'
  },
  {
    id: 'makeup-euphoria',
    category: 'makeup',
    title: 'Эйфория',
    description: 'Стразы и блеск',
    prompt: 'Apply creative Euphoria-style makeup with glitter, face gems near eyes, and purple/blue eyeshadows. CRUCIAL: Keep the face exactly identical. Photorealistic style.',
    image: '/templates/makeup-euphoria.webp'
  },
  {
    id: 'makeup-kbeauty',
    category: 'makeup',
    title: 'K-Beauty',
    description: 'Корейский стиль',
    prompt: 'Apply Korean beauty style makeup. Glass skin effect, gradient fruit-colored lips, soft straight brows, coral blush. CRUCIAL: Preserve facial identity. Photorealistic style.',
    image: '/templates/makeup-kbeauty.webp'
  },
  {
    id: 'makeup-goth',
    category: 'makeup',
    title: 'Готика',
    description: 'Темные губы',
    prompt: 'Apply gothic makeup style. Dark burgundy or black lipstick, pale skin, heavy black eyeliner, grunge aesthetic. CRUCIAL: Maintain exact facial identity. Photorealistic style.',
    image: '/templates/makeup-goth.webp'
  },
  {
    id: 'makeup-instaglam',
    category: 'makeup',
    title: 'Insta Glam',
    description: 'Контуринг',
    prompt: 'Apply full glam Instagram makeup. Heavy contouring, baking, cut crease eyeshadow, matte liquid lipstick, long false lashes. CRUCIAL: Keep the face recognizable. Photorealistic style.',
    image: '/templates/makeup-instaglam.webp'
  },
  {
    id: 'makeup-cyberpunk',
    category: 'makeup',
    title: 'Киберпанк',
    description: 'Неон',
    prompt: 'Apply futuristic cyberpunk makeup. Neon graphic eyeliner, metallic highlighter on cheekbones, silver lip gloss. CRUCIAL: Preserve facial identity. Photorealistic style.',
    image: '/templates/makeup-cyberpunk.webp'
  },
  {
    id: 'makeup-sunkissed',
    category: 'makeup',
    title: 'Поцелуй солнца',
    description: 'Загар и веснушки',
    prompt: 'Apply a sunkissed makeup look. Bronzer, warm blush across nose, faux freckles, golden highlighter. CRUCIAL: Maintain exact facial identity. Photorealistic style.',
    image: '/templates/makeup-sunkissed.webp'
  },
  {
    id: 'makeup-vamp',
    category: 'makeup',
    title: 'Вамп',
    description: 'Роковая',
    prompt: 'Apply a dark seductive vamp look. Sharp contour, dark red lips, intense gaze, slight smokey eye. CRUCIAL: Keep the face exactly identical. Photorealistic style.',
    image: '/templates/makeup-vamp.webp'
  },
  {
    id: 'makeup-bridal',
    category: 'makeup',
    title: 'Свадебный',
    description: 'Нежный образ',
    prompt: 'Apply soft, romantic bridal makeup to the person. Glowing skin, soft pink blush, defined lashes, nude glossy lips. CRUCIAL: Preserve facial identity exactly. Photorealistic style, detailed natural skin texture. White veil background hint.',
    image: '/templates/makeup-bridal.webp'
  },
  {
    id: 'makeup-festival',
    category: 'makeup',
    title: 'Фестиваль',
    description: 'Бохо шик',
    prompt: 'Apply colorful festival makeup. Face jewels, glitter on cheeks, bright eyeshadow accents. CRUCIAL: Maintain exact facial identity. Photorealistic style. Boho chic vibe.',
    image: '/templates/makeup-festival.webp'
  },
  {
    id: 'makeup-retro-50s',
    category: 'makeup',
    title: 'Ретро 50-х',
    description: 'Пин-ап',
    prompt: 'Apply 1950s pin-up style makeup. Defined brows, winged eyeliner, bold matte red lipstick. CRUCIAL: Keep the face recognizable. Photorealistic style. Vintage aesthetic.',
    image: '/templates/makeup-retro-50s.webp'
  },
  {
    id: 'makeup-neon-graphic',
    category: 'makeup',
    title: 'Графика',
    description: 'Яркие стрелки',
    prompt: 'Apply graphic neon eyeliner designs in bright green or pink. Minimalist skin, bold eyes. CRUCIAL: Preserve facial identity. Photorealistic style. Edgy modern look.',
    image: '/templates/makeup-neon-graphic.webp'
  },
  {
    id: 'makeup-soft-glam',
    category: 'makeup',
    title: 'Soft Glam',
    description: 'Мягкий гламур',
    prompt: 'Apply soft glam makeup. Neutral eyeshadow tones, shimmery lid, glossy lips, soft contour. CRUCIAL: Maintain exact facial identity. Photorealistic style. Perfect for date night.',
    image: '/templates/makeup-soft-glam.webp'
  },
  {
    id: 'makeup-fantasy-mermaid',
    category: 'makeup',
    title: 'Русалка',
    description: 'Фэнтези',
    prompt: 'Apply fantasy mermaid makeup. Iridescent scales on cheekbones, blue and purple hues, wet look skin. CRUCIAL: Keep the face recognizable. Photorealistic style. Aquatic vibe.',
    image: '/templates/makeup-fantasy-mermaid.webp'
  },
  {
    id: 'makeup-editorial-avantgarde',
    category: 'makeup',
    title: 'Авангард',
    description: 'Арт-макияж',
    prompt: 'Apply avant-garde editorial makeup. Unique shapes, bold colors, artistic expression. CRUCIAL: Preserve facial identity. Photorealistic style. High fashion magazine look.',
    image: '/templates/makeup-editorial-avantgarde.webp'
  },
  {
    id: 'makeup-grunge-90s',
    category: 'makeup',
    title: 'Гранж 90-х',
    description: 'Небрежность',
    prompt: 'Apply 90s grunge makeup. Smudged black eyeliner, matte brown lipstick, matte skin. CRUCIAL: Maintain exact facial identity. Photorealistic style. Rock chic vibe.',
    image: '/templates/makeup-grunge-90s.webp'
  },
  {
    id: 'makeup-glass-skin',
    category: 'makeup',
    title: 'Glass Skin',
    description: 'Сияние',
    prompt: 'Focus on perfect "Glass Skin" makeup. Ultra-hydrated, dewy, reflective skin texture, minimal eye makeup. CRUCIAL: Keep the face recognizable. Photorealistic style.',
    image: '/templates/makeup-glass-skin.webp'
  },
  {
    id: 'makeup-glitter-tears',
    category: 'makeup',
    title: 'Глиттер',
    description: 'Блестящие слезы',
    prompt: 'Apply glitter tears makeup. Glitter trails falling from eyes like tears. Emotional and artistic. CRUCIAL: Preserve facial identity. Photorealistic style.',
    image: '/templates/makeup-glitter-tears.webp'
  }
];





const TemplateGrid: React.FC<TemplateGridProps> = ({ category, onSelect, selectedId, sort = 'popular' }) => {
  const filtered = ALL_PRESETS.filter(preset => {
    if (category === 'all') return true;
    if (category === 'trending') return ['retro-polaroid-classic', 'tet-traditional-yellow', 'market-shopee-hero', 'kids-dinosaur', 'makeup-bridal'].includes(preset.id);
    if (category === 'new') return ['retro-vhs-grain', 'market-fb-minimal', 'market-insta-story', 'tet-hoi-an', 'kids-chef', 'makeup-festival'].includes(preset.id);
    if (category === 'saved') return false;
    return preset.category === category;
  });

  // Apply sort (does not mutate ALL_PRESETS).
  const filteredPresets = [...filtered].sort((a, b) => {
    if (sort === 'az') return a.title.localeCompare(b.title, 'ru');
    if (sort === 'new') return (NEW_IDS.has(b.id) ? 1 : 0) - (NEW_IDS.has(a.id) ? 1 : 0);
    // popular
    return (POPULAR_IDS.has(b.id) ? 1 : 0) - (POPULAR_IDS.has(a.id) ? 1 : 0);
  });

  if (filteredPresets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center text-ink-muted">
        <Sparkles className="w-12 h-12 mb-4 opacity-20" />
        <p>В этой категории пока нет шаблонов.</p>
        <p className="text-xs mt-1 opacity-50">Загляните позже.</p>
      </div>
    );
  }

  // Masonry: CSS columns, compact tiles with accent outline on hover/selection.
  return (
    <div className="[column-gap:12px] [columns:200px] max-[640px]:[columns:160px]">
      {filteredPresets.map((preset) => {
        const isActive = selectedId === preset.id;
        return (
        <button
          key={preset.id}
          onClick={() => onSelect(preset)}
          aria-pressed={isActive}
          className={`group relative w-full mb-3 break-inside-avoid rounded-xl overflow-hidden bg-card-light border-2 transition-colors duration-200 text-left ${isActive ? 'border-primary ring-2 ring-primary/40' : 'border-[var(--border-color)] hover:border-primary'}`}
        >
          <div className="relative overflow-hidden aspect-[3/4]">
            <img
              src={preset.image || FALLBACK_IMAGES[preset.category] || FALLBACK_IMAGES.default}
              alt={preset.title}
              className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-500"
              loading="lazy"
            />
            {/* Bottom gradient for legible caption */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none" />

            {/* Top-right badge: checkmark when active, + on hover otherwise */}
            <div className={`absolute top-2 right-2 w-7 h-7 rounded-full bg-primary flex items-center justify-center transition-opacity pointer-events-none ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
              {isActive ? <Check className="w-4 h-4 text-on-primary" strokeWidth={3} /> : <Plus className="w-4 h-4 text-on-primary" />}
            </div>

            {/* Active label chip */}
            {isActive && (
              <div className="absolute top-2 left-2 text-[10px] font-extrabold uppercase tracking-wider text-on-primary bg-primary px-2 py-0.5 rounded-md pointer-events-none">
                Выбрано
              </div>
            )}

            {/* Caption */}
            <div className="absolute left-2.5 right-2.5 bottom-2.5 pointer-events-none">
              <div className="text-white font-bold text-[13px] tracking-[-0.01em] drop-shadow-[0_1px_6px_rgba(0,0,0,.5)] leading-tight line-clamp-1">
                {preset.title}
              </div>
              <div className="text-white/70 text-[10.5px] font-medium mt-0.5 line-clamp-1">
                {preset.description}
              </div>
            </div>
          </div>
        </button>
        );
      })}
    </div>
  );
};

export default TemplateGrid;
