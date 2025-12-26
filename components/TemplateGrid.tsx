
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
  // --- NEW YEAR EXCLUSIVE ---
  {
    id: 'new-year-blue-magic',
    category: 'christmas',
    title: 'Синий Иней',
    description: 'Магия ледяного сияния',
    prompt: 'Transform the person from the photo into a magical winter scene with a deep blue aesthetic. Surround them with crystalline frost patterns, glowing neon blue snowflakes, and soft cinematic cool lighting. Background: enchanted snowy pine forest at twilight with aurora borealis hints. CRUCIAL: Preserve the facial features exactly. Photorealistic style, high detail, 8k resolution.',
    image: getPreviewUrl('woman in magical blue winter frost snowflakes aurora background', 2025)
  },
  // --- MARKETPLACES & SOCIAL ADS ---
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
  
  // --- NEW MARKETPLACE PRESETS ---
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

  // --- BUSINESS PRINT CATEGORY ---
  {
    id: 'print-menu',
    category: 'business_print',
    title: 'Меню Ресторана',
    description: 'Премиум дизайн',
    prompt: 'Create a high-end restaurant menu background design. Dark marble texture, elegant gold lines, soft ambient lighting. Leave empty space in the center for text. Place a gourmet dish on the bottom corner. Photorealistic style.',
    image: getPreviewUrl('restaurant menu background dark marble gourmet', 2001)
  },

  // --- TET (LUNAR NEW YEAR) VIETNAMESE ---
  {
    id: 'tet-traditional-yellow',
    category: 'tet',
    title: 'Аозай и Цветы Мая',
    description: 'Золотой Новый год',
    prompt: 'Show the person from the photo wearing a luxurious traditional yellow and red Ao Dai, standing next to a large blooming yellow Ochna Integerrima tree (Hoa Mai). CRUCIAL: Preserve the facial features exactly. Photorealistic style, detailed natural skin texture. Festive Vietnamese Lunar New Year atmosphere, soft sunlight, happy expression.',
    image: getPreviewUrl('Vietnamese woman yellow ao dai ochna flowers tet', 2001)
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
    id: 'christmas-grinch',
    category: 'christmas',
    title: 'Гринч',
    description: 'Похититель Рождества',
    prompt: 'Show the person from the photo styled as the Grinch. Apply green skin tone and Grinch makeup, but keep the person\'s face recognizable. Wearing a red Santa coat. Mischievous expression, festive background. Photorealistic style.',
    image: getPreviewUrl('grinch style christmas portrait green', 215)
  },
  {
    id: 'ded-moroz',
    category: 'christmas',
    title: 'Дед Мороз',
    description: 'Русский стиль',
    prompt: 'Turn the person into Ded Moroz (Russian Santa) in a long blue fur coat with silver embroidery. Background: snowy forest. CRUCIAL: Preserve facial identity. Photorealistic style.',
    image: getPreviewUrl('Ded Moroz russian santa blue coat', 201)
  }
];

const TemplateGrid: React.FC<TemplateGridProps> = ({ category, onSelect }) => {
  const filteredPresets = ALL_PRESETS.filter(preset => {
    if (category === 'all') return true;
    if (category === 'trending') return ['new-year-blue-magic', 'christmas-grinch', 'tet-traditional-yellow', 'market-shopee-hero', 'kids-roblox'].includes(preset.id);
    if (category === 'new') return ['new-year-blue-magic', 'market-fb-minimal', 'market-insta-story', 'tet-traditional-yellow'].includes(preset.id);
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
