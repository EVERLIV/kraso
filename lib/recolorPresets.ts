import type { AspectRatio, ImageResolution } from '../types';

export interface PalettePreset {
    id: string;
    title: string;
    thumb: string;
    colors: string[];
    prompt: string;
}

const p = (name: string) => `/palette/${name}.webp`;

/** 12 curated moodboard presets — editorial color grading styles */
export const PALETTE_PRESETS: PalettePreset[] = [
    {
        id: 'general',
        title: 'General',
        thumb: p('general'),
        colors: ['#2A2A2E', '#8A7A72', '#C4B5A8', '#E8DDD4', '#5A4A42', '#1A1A1C'],
        prompt: 'Neutral balanced color grading, natural skin tones, soft contrast, versatile editorial portrait look.',
    },
    {
        id: 'warm_ambient',
        title: 'Warm ambient',
        thumb: p('warm-ambient'),
        colors: ['#FFB6C8', '#E8A0B0', '#D4788A', '#F5D0D8', '#8A4A5A', '#3A2028'],
        prompt: 'Warm ambient interior lighting, soft pink and peach tones, cozy lifestyle mood, gentle shadows.',
    },
    {
        id: 'y2k_studio',
        title: 'Y2K studio',
        thumb: p('y2k-studio'),
        colors: ['#4A8AD0', '#88C0F0', '#D0E8FF', '#F0A0D0', '#C060A0', '#1A2848'],
        prompt: 'Y2K studio aesthetic, cool blue backdrop, playful pop colors, glossy highlights, early 2000s fashion editorial.',
    },
    {
        id: 'swag_era',
        title: 'Swag era',
        thumb: p('swag-era'),
        colors: ['#E8C878', '#D4A850', '#8AB0C8', '#F0E8D0', '#6A5030', '#2A3848'],
        prompt: 'Swag era beach and street style, sun-bleached denim tones, golden sand, casual cool attitude.',
    },
    {
        id: 'theatrical_light',
        title: 'Theatrical light',
        thumb: p('theatrical-light'),
        colors: ['#1A1A22', '#4A4A58', '#C8B8A8', '#F0E8E0', '#8A3030', '#0A0A10'],
        prompt: 'Theatrical dramatic lighting, high contrast chiaroscuro, deep shadows, spotlight mood, cinematic stage.',
    },
    {
        id: 'y2k_street',
        title: 'Y2K street',
        thumb: p('y2k-street'),
        colors: ['#F0D030', '#4A90D0', '#E8E8E8', '#2A3A50', '#C0A020', '#1A2030'],
        prompt: 'Y2K street photography, urban outdoor, yellow accents, casual youth culture, bright daylight.',
    },
    {
        id: 'moody_film',
        title: 'Moody film',
        thumb: p('moody-film'),
        colors: ['#1E1810', '#4A3A28', '#8A7060', '#C4A888', '#2A3848', '#0A0806'],
        prompt: 'Moody analog film look, lifted blacks, warm grain, nostalgic 35mm aesthetic, muted earth tones.',
    },
    {
        id: 'neon_night',
        title: 'Neon night',
        thumb: p('neon-night'),
        colors: ['#FF3E8E', '#D6F520', '#4A2080', '#0A0A18', '#00D4FF', '#1A1030'],
        prompt: 'Neon night city colors, magenta and cyan accents, dark backgrounds, cyberpunk nightlife glow.',
    },
    {
        id: 'desert_sun',
        title: 'Desert sun',
        thumb: p('desert-sun'),
        colors: ['#E8A848', '#D08030', '#F5D8A0', '#8A5030', '#C4B090', '#3A2818'],
        prompt: 'Desert golden hour, warm amber and terracotta, sun-drenched highlights, arid landscape tones.',
    },
    {
        id: 'cool_minimal',
        title: 'Cool minimal',
        thumb: p('cool-minimal'),
        colors: ['#E8ECF0', '#B8C0C8', '#889098', '#485058', '#D0D8E0', '#283038'],
        prompt: 'Cool minimal palette, desaturated greys and soft blues, clean Scandinavian aesthetic, airy whites.',
    },
    {
        id: 'vintage_wash',
        title: 'Vintage wash',
        thumb: p('vintage-wash'),
        colors: ['#C8A888', '#A08060', '#E8D8C8', '#6A5848', '#D0B8A0', '#3A3028'],
        prompt: 'Vintage washed colors, faded sepia undertones, retro photo album feel, soft vignette.',
    },
    {
        id: 'editorial_gloss',
        title: 'Editorial gloss',
        thumb: p('editorial-gloss'),
        colors: ['#0A0A0C', '#FFFFFF', '#C9C9CE', '#FF3E8E', '#2A2A30', '#E8E8EC'],
        prompt: 'High-fashion editorial gloss, punchy contrast, specular highlights, magazine cover polish.',
    },
];

export const PALETTE_GEN_COST = 20;

/** @deprecated use PALETTE_PRESETS */
export const RECOLOR_PRESETS = PALETTE_PRESETS;
export type RecolorPreset = PalettePreset;
export const RECOLOR_GEN_COST = PALETTE_GEN_COST;

export function getPalettePreset(id: string): PalettePreset | undefined {
    return PALETTE_PRESETS.find(p => p.id === id);
}

export function getRecolorPreset(id: string): PalettePreset | undefined {
    return getPalettePreset(id);
}

export function buildPalettePrompt(opts: {
    preset?: PalettePreset;
    manualColors?: string[];
    backgroundColor?: string;
    userPrompt: string;
    hasColorReference?: boolean;
}): string {
    const parts: string[] = [
        'Keep the image composition and subject exactly the same. Apply professional color grading and recoloring.',
    ];
    if (opts.preset) {
        parts.push(`Moodboard style: ${opts.preset.prompt} Palette: ${opts.preset.colors.join(', ')}.`);
    }
    if (opts.manualColors?.length) {
        parts.push(`Use this exact color palette: ${opts.manualColors.join(', ')}.`);
    }
    if (opts.backgroundColor) {
        parts.push(`Use ${opts.backgroundColor} as the dominant background color.`);
    }
    if (opts.hasColorReference) {
        parts.push('Transfer the color mood from the reference images while preserving the main subject structure.');
    }
    if (opts.userPrompt.trim()) {
        parts.push(`Scene context: ${opts.userPrompt.trim()}`);
    }
    parts.push('Photorealistic, high quality, natural skin tones where applicable.');
    return parts.join(' ');
}

export const buildRecolorPrompt = buildPalettePrompt;

export const DEFAULT_MANUAL_COLORS = ['#3BA55D', '#FFFFFF', '#D6F520', '#222222'];
export const MAX_PALETTE_COLORS = 8;

function hslToHex(h: number, s: number, l: number): string {
    const sat = s / 100;
    const light = l / 100;
    const c = (1 - Math.abs(2 * light - 1)) * sat;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = light - c / 2;
    let r = 0;
    let g = 0;
    let b = 0;
    if (h < 60) { r = c; g = x; }
    else if (h < 120) { r = x; g = c; }
    else if (h < 180) { g = c; b = x; }
    else if (h < 240) { g = x; b = c; }
    else if (h < 300) { r = x; b = c; }
    else { r = c; b = x; }
    const toHex = (v: number) => Math.round((v + m) * 255).toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

/** Generate one harmonious palette using a random base hue. */
export function generateRandomPalette(size = 6): string[] {
    const baseHue = Math.floor(Math.random() * 360);
    const step = Math.random() > 0.5 ? 42 : 26;
    return Array.from({ length: size }, (_, i) => {
        const hue = (baseHue + i * step + (Math.random() * 18 - 9) + 360) % 360;
        const sat = 52 + Math.random() * 36;
        const light = 44 + Math.random() * 26;
        return hslToHex(hue, sat, light);
    });
}

export function generateRandomPalettes(count = 4, size = 6): string[][] {
    return Array.from({ length: count }, () => generateRandomPalette(size));
}

/* ------------------------------------------------------------------ */
/*  Photo style templates (ШАБЛОНЫ для фото) — shown in the General    */
/*  card / StyleTemplatePanel. Each is a people-photoshoot look.       */
/* ------------------------------------------------------------------ */

export interface PhotoStyle {
    id: string;
    title: string;
    thumb: string;
    prompt: string;
}

const s = (name: string) => `/styles/${name}.png`;

export const PHOTO_STYLES: PhotoStyle[] = [
    {
        id: 'studio-beauty',
        title: 'Studio beauty',
        thumb: s('style-studio-beauty'),
        prompt: 'clean high-end studio beauty portrait, soft butterfly key light, seamless neutral backdrop, glossy flawless skin, minimal natural makeup, sharp editorial focus',
    },
    {
        id: 'golden-hour',
        title: 'Golden hour',
        thumb: s('style-golden-hour'),
        prompt: 'warm outdoor golden-hour portrait, low sun backlight with gentle lens flare, dreamy background bokeh, sun-kissed warm skin tones',
    },
    {
        id: 'street-style',
        title: 'Street style',
        thumb: s('style-street-style'),
        prompt: 'candid urban street-style fashion portrait, blurred city background, natural daylight, effortless editorial cool',
    },
    {
        id: 'editorial',
        title: 'Editorial',
        thumb: s('style-editorial-fashion'),
        prompt: 'high-fashion magazine editorial portrait, dramatic confident pose, bold avant-garde styling, controlled studio lighting, glossy cover polish',
    },
    {
        id: 'film-35mm',
        title: '35mm film',
        thumb: s('style-film-35mm'),
        prompt: 'analog 35mm film portrait, soft visible film grain, muted faded warm tones, nostalgic natural window light',
    },
    {
        id: 'mono-bw',
        title: 'B&W classic',
        thumb: s('style-mono-bw'),
        prompt: 'timeless black-and-white portrait, high-contrast dramatic side lighting, deep shadows, rich detailed tonality',
    },
    {
        id: 'neon-night',
        title: 'Neon night',
        thumb: s('style-neon-night'),
        prompt: 'night portrait under colorful neon city lights, magenta and cyan glow on skin, cyberpunk nightlife mood, wet-street bokeh',
    },
    {
        id: 'cinematic',
        title: 'Cinematic',
        thumb: s('style-cinematic'),
        prompt: 'cinematic film-still portrait, teal-and-orange color grade, moody atmospheric lighting, shallow depth of field, anamorphic feel',
    },
    {
        id: 'beach',
        title: 'Beach lifestyle',
        thumb: s('style-beach-lifestyle'),
        prompt: 'sunny beach lifestyle portrait, breezy hair, ocean and sky backdrop, bright natural sunlight, relaxed summer glow',
    },
    {
        id: 'corporate',
        title: 'Corporate',
        thumb: s('style-corporate'),
        prompt: 'professional corporate headshot, soft blurred modern office background, clean even lighting, confident approachable expression',
    },
    {
        id: 'vintage-90s',
        title: 'Vintage 90s',
        thumb: s('style-vintage-90s'),
        prompt: 'retro 1990s look with harsh disposable-camera flash, slight overexposure, nostalgic saturated colors, candid party energy',
    },
    {
        id: 'athletic',
        title: 'Athletic',
        thumb: s('style-athletic'),
        prompt: 'dynamic athletic portrait, dramatic moody gym lighting, sportswear, energetic determined mood, subtle sweat sheen',
    },
    {
        id: 'cafe',
        title: 'Café candid',
        thumb: s('style-cafe-candid'),
        prompt: 'cozy café lifestyle portrait, warm ambient window light, gentle background bokeh, relaxed candid mood',
    },
    {
        id: 'y2k-pop',
        title: 'Y2K pop',
        thumb: s('style-y2k-pop'),
        prompt: 'early-2000s Y2K pop studio portrait, vivid colorful gradient backdrop, glossy playful styling, direct flash, fun energetic pose',
    },
    {
        id: 'nature-soft',
        title: 'Nature soft',
        thumb: s('style-nature-soft'),
        prompt: 'soft dreamy outdoor portrait in nature among wildflowers, pastel tones, gentle diffused sunlight, romantic cottagecore mood',
    },
];

export const DEFAULT_STYLE_ID = 'studio-beauty';

export function getPhotoStyle(id: string): PhotoStyle | undefined {
    return PHOTO_STYLES.find(x => x.id === id);
}

/* ------------------------------------------------------------------ */
/*  Color palettes (Палитра) — curated color swatches shown in the     */
/*  Color Transfer chip / PalettePanel presets step.                   */
/* ------------------------------------------------------------------ */

export interface ColorPalette {
    id: string;
    title: string;
    colors: string[];
}

export const COLOR_PALETTES: ColorPalette[] = [
    { id: 'neutral', title: 'Нейтральная', colors: ['#2A2A2E', '#8A7A72', '#C4B5A8', '#E8DDD4', '#5A4A42', '#1A1A1C'] },
    { id: 'warm-blush', title: 'Тёплый бланш', colors: ['#FFB6C8', '#E8A0B0', '#D4788A', '#F5D0D8', '#8A4A5A', '#3A2028'] },
    { id: 'cool-pop', title: 'Прохладный поп', colors: ['#4A8AD0', '#88C0F0', '#D0E8FF', '#F0A0D0', '#C060A0', '#1A2848'] },
    { id: 'sun-denim', title: 'Солнце и деним', colors: ['#E8C878', '#D4A850', '#8AB0C8', '#F0E8D0', '#6A5030', '#2A3848'] },
    { id: 'noir', title: 'Нуар', colors: ['#1A1A22', '#4A4A58', '#C8B8A8', '#F0E8E0', '#8A3030', '#0A0A10'] },
    { id: 'street-yellow', title: 'Уличный жёлтый', colors: ['#F0D030', '#4A90D0', '#E8E8E8', '#2A3A50', '#C0A020', '#1A2030'] },
    { id: 'film-earth', title: 'Плёнка земля', colors: ['#1E1810', '#4A3A28', '#8A7060', '#C4A888', '#2A3848', '#0A0806'] },
    { id: 'neon', title: 'Неон', colors: ['#FF3E8E', '#D6F520', '#4A2080', '#0A0A18', '#00D4FF', '#1A1030'] },
    { id: 'desert', title: 'Пустыня', colors: ['#E8A848', '#D08030', '#F5D8A0', '#8A5030', '#C4B090', '#3A2818'] },
    { id: 'minimal', title: 'Минимал', colors: ['#E8ECF0', '#B8C0C8', '#889098', '#485058', '#D0D8E0', '#283038'] },
    { id: 'vintage', title: 'Винтаж', colors: ['#C8A888', '#A08060', '#E8D8C8', '#6A5848', '#D0B8A0', '#3A3028'] },
    { id: 'gloss', title: 'Глянец', colors: ['#0A0A0C', '#FFFFFF', '#C9C9CE', '#FF3E8E', '#2A2A30', '#E8E8EC'] },
];

export function getColorPalette(id: string): ColorPalette | undefined {
    return COLOR_PALETTES.find(x => x.id === id);
}

export type StudioColorMode = 'none' | 'preset' | 'manual';

export interface StudioGenerationInput {
    userPrompt: string;
    style: PhotoStyle | null;
    colorMode: StudioColorMode;
    colorPalette: ColorPalette | null;
    manualColors?: string[];
    backgroundColor?: string | null;
    promptReferenceCount: number;
    aspectRatio: AspectRatio;
    resolution: ImageResolution;
    batchIndex?: number;
    batchTotal?: number;
}

/**
 * Build a structured prompt that encodes every user choice from the studio UI.
 */
export function buildStudioPrompt(input: StudioGenerationInput): string {
    const sections: string[] = [
        'IMAGE-TO-IMAGE PORTRAIT RESTYLE.',
        'Preserve the exact face, facial features, skin texture, body proportions and identity from the first attached image (Character). Do not change who the person is.',
    ];

    if (input.style) {
        sections.push(
            `PHOTO STYLE TEMPLATE — "${input.style.title}":`,
            input.style.prompt,
            'Apply this photoshoot look to lighting, wardrobe mood, camera angle and atmosphere while keeping the same person.',
        );
    }

    if (input.colorMode === 'preset' && input.colorPalette) {
        sections.push(
            `COLOR PALETTE — "${input.colorPalette.title}":`,
            `Grade the image using exactly these HEX colors: ${input.colorPalette.colors.join(', ')}.`,
            'Match saturation, shadows and highlights to this palette.',
        );
    } else if (input.colorMode === 'manual' && input.manualColors?.length) {
        sections.push(
            'CUSTOM COLOR PALETTE:',
            `Grade the image using exactly these HEX colors: ${input.manualColors.join(', ')}.`,
        );
        if (input.backgroundColor) {
            sections.push(`Use ${input.backgroundColor} as the dominant background color.`);
        }
    }

    if (input.promptReferenceCount > 0) {
        sections.push(
            `ADDITIONAL REFERENCE IMAGES (${input.promptReferenceCount} attached after Character):`,
            'Transfer color mood, lighting and stylistic cues from these references while preserving the Character identity.',
        );
    }

    if (input.userPrompt.trim()) {
        sections.push(`USER SCENE / DETAILS: ${input.userPrompt.trim()}`);
    }

    const output: string[] = [];
    output.push(`Output aspect ratio: ${input.aspectRatio}.`);
    output.push(`Target resolution quality: ${input.resolution}.`);
    if (input.batchTotal && input.batchTotal > 1 && input.batchIndex) {
        output.push(`Variant ${input.batchIndex} of ${input.batchTotal}.`);
    }
    sections.push('OUTPUT:', ...output);
    sections.push('Photorealistic, high quality, natural skin tones, no text overlays, no watermarks.');

    return sections.join('\n');
}
