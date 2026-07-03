export type ShortsAspect = '9:16' | '16:9';

export interface ShortsVisualPreset {
    id: string;
    title: string;
    description: string;
    /** Промпт стиля + движение для Veo */
    prompt: string;
    thumb: string;
}

const p = (name: string) => `/shorts/presets/${name}.webp`;

export const SHORTS_VISUAL_PRESETS: ShortsVisualPreset[] = [
    {
        id: 'bold_urban',
        title: 'Bold Urban',
        description: 'Городской стиль, крупная графика',
        prompt: 'Bold urban editorial short. Floating tech props, confident subject, green studio backdrop, kinetic typography overlays, smooth camera push-in. Vertical social ad energy.',
        thumb: p('bold-urban'),
    },
    {
        id: 'green_contrast',
        title: 'Green Contrast',
        description: 'Контрастный типографический кадр',
        prompt: 'High-contrast typographic short on deep red background. Bold white sans-serif text animations, punchy cuts, dramatic zoom. TikTok hook in first second.',
        thumb: p('green-contrast'),
    },
    {
        id: 'urban_serenity',
        title: 'Urban Serenity',
        description: 'Спокойный городской вайб',
        prompt: 'Calm urban serenity mood. Soft blue tones, laptop lifestyle scene, gentle parallax, ambient daylight, minimal motion.',
        thumb: p('urban-serenity'),
    },
    {
        id: 'warm_glow',
        title: 'Warm Glow',
        description: 'Тёплый свет лампы, уют',
        prompt: 'Warm glow cinematic short. Cozy lamp light, circular frame composition, soft orange highlights, intimate talking-head product moment.',
        thumb: p('warm-glow'),
    },
    {
        id: 'yellow_frame',
        title: 'Yellow Frame',
        description: 'Жёлтая рамка, pop-стиль',
        prompt: 'Pop art yellow window frame around subject on blue background. Playful graphic borders, snappy motion, cheerful product showcase.',
        thumb: p('yellow-frame'),
    },
    {
        id: 'monochrome_vibes',
        title: 'Monochrome Vibes',
        description: 'Монохром + UI-элементы',
        prompt: 'Monochrome blue-tinted short with floating chat bubbles and UI cards. Modern app promo aesthetic, smooth drift motion.',
        thumb: p('monochrome-vibes'),
    },
    {
        id: 'claymation',
        title: 'Claymation',
        description: 'Глиняный 3D-стиль',
        prompt: 'Claymation stop-motion style short. Soft 3D clay props, playful bounce animation, saturated blue-yellow palette.',
        thumb: p('claymation'),
    },
    {
        id: 'marker_scribble',
        title: 'Marker Scribble',
        description: 'Маркерные зарисовки',
        prompt: 'Hand-drawn marker scribble style. White background, green zig-zag doodles, retro computer sketch overlays, energetic motion.',
        thumb: p('marker-scribble'),
    },
    {
        id: 'sticker_type',
        title: 'Sticker Type',
        description: 'Стикер-вырезка на розовом',
        prompt: 'Sticker cutout subject on vibrant pink polka-dot background. Thick white outline, bouncy social-media motion, fun product reveal.',
        thumb: p('sticker-type'),
    },
    {
        id: 'retro_os',
        title: 'Retro OS',
        description: 'Ретро-интерфейс Windows',
        prompt: 'Retro Windows 95 OS aesthetic. Overlapping dialog windows, rainbow gradient desktop, nostalgic UI motion, tech nostalgia hook.',
        thumb: p('retro-os'),
    },
];

export const SHORTS_GEN_COST = 90;
export const SHORTS_MAX_DURATION_LABEL = '2 мин';

export function getShortsVisualPreset(id: string): ShortsVisualPreset | undefined {
    return SHORTS_VISUAL_PRESETS.find(p => p.id === id);
}

export function buildShortsPrompt(
    preset: ShortsVisualPreset | undefined,
    userPrompt: string,
    musicSuffix: string,
    voiceSuffix: string,
): string {
    const base = userPrompt.trim()
        || preset?.prompt
        || 'Animate this image with smooth natural movement for a vertical social short.';
    return `${base}${musicSuffix}${voiceSuffix}`;
}
