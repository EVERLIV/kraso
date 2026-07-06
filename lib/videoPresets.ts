import type { VideoVariantId } from './videoModels';
import {
    DEFAULT_I2V_MOTION_PROMPT,
    VIDEO_STUDIO_NEGATIVE_KLING,
    VIDEO_STUDIO_NEGATIVE_SEEDANCE,
    wrapSeedanceSingleScene,
    wrapWanPreset,
    wrapWanAtmospherePreset,
} from './videoPromptRules';

export interface VideoMotionPreset {
    id: string;
    title: string;
    description: string;
    /**
     * Hidden prompt template. May contain a single `{input}` slot that gets
     * replaced by the user's extra text (or `defaultFill` when they leave it empty).
     */
    prompt: string;
    category: 'viral' | 'cinematic' | 'emotional' | 'social';
    thumb?: string;
    previewVideo?: string;
    defaultFill?: string;
    inputHint?: string;
    /** Kling negative_prompt API field */
    negativePrompt?: string;
}

const INPUT_SLOT = '{input}';

export function buildVideoPresetPrompt(
    preset: VideoMotionPreset | null,
    userText: string,
): string {
    const extra = userText.trim();

    if (!preset) {
        return extra || DEFAULT_I2V_MOTION_PROMPT;
    }

    if (preset.prompt.includes(INPUT_SLOT)) {
        const fill = extra || preset.defaultFill || '';
        return preset.prompt.replaceAll(INPUT_SLOT, fill).replace(/\s{2,}/g, ' ').trim();
    }

    return [preset.prompt, extra].filter(Boolean).join(' ').trim();
}

export function getVideoPresetNegativePrompt(preset: VideoMotionPreset | null): string | undefined {
    return preset?.negativePrompt;
}

/** Default preset — available for every video model. */
export const DEFAULT_VIDEO_PRESET: VideoMotionPreset = {
    id: 'general',
    title: 'Обычная Генерация',
    description: 'Чистая генерация — качество модели',
    prompt: DEFAULT_I2V_MOTION_PROMPT,
    category: 'cinematic',
    inputHint: 'Опишите движение (необязательно)…',
    negativePrompt: VIDEO_STUDIO_NEGATIVE_KLING,
};

/** Viral stylized presets — Wan 2.5 */
export const WAN_VIDEO_PRESETS: VideoMotionPreset[] = [
    {
        id: 'wan_dark_anime',
        title: 'Мрачное Аниме',
        description: 'Готическая атмосфера — свечи, тени, меланхолия',
        prompt: wrapWanAtmospherePreset(
            'Character in dark Victorian-style coat stands in a candlelit gothic library. Dust motes float in shafts of pale moonlight through tall arched windows. Bookshelves tower into shadow. A single rose lies on an open book.',
            'Close-up: candle flame wavers, casting slow-moving shadows across the character\'s face. A single petal from the rose drifts down. Camera drifts left with a gentle parallax — shelves recede into darkness behind. Soft embers rise from a dying fireplace in the background. No sudden movements, no cuts. Melancholic violet-and-amber palette, deep blacks, soft rim light.',
        ),
        category: 'emotional',
        previewVideo: '/video/presets/wan_dark_anime.mp4',
        inputHint: 'Деталь сцены (необязательно)…',
    },
    {
        id: 'wan_disney_magic',
        title: 'Мир Диснея',
        description: 'Волшебный сказочный мир — светлячки, сияние, чудо',
        prompt: wrapWanAtmospherePreset(
            'Character in fairy-tale attire stands at the edge of an enchanted forest clearing. Giant glowing mushrooms pulse with soft blue light. Fireflies drift in lazy spirals. A crystal-clear stream reflects the starry sky above an opening canopy.',
            'Slow push-in across the clearing. Light particles rise from the mushrooms like breath. Fireflies orbit lazily, one lands on the character\'s outstretched hand — they look down with quiet wonder. Stream water catches starlight, ripples spread in slow motion. Warm fairy-tale palette — lavender, teal, soft gold. No cuts, one continuous breath of a scene.',
        ),
        category: 'cinematic',
        previewVideo: '/video/presets/wan_disney_magic.mp4',
        inputHint: 'Волшебный элемент (необязательно)…',
    },
    {
        id: 'wan_robots',
        title: 'Роботы',
        description: 'Научно-фантастический мир — механика, свет, металл',
        prompt: wrapWanAtmospherePreset(
            'Character as a biomechanical being in a rain-soaked neon-lit hangar. Blue and orange holographic schematics flicker on translucent screens around them. Rain runs down a massive window revealing a futuristic city silhouette. Cables snake across the floor, pulsing with light.',
            'Camera slowly tracks around the character — rain streaks catch neon light on their metallic plating. A holographic blueprint rotates gently beside them. Servos hum, a single droplet falls from an overhead pipe and hits a metal surface — the ripple reflects light across the floor. Slow, deliberate, meditative. Cyberpunk palette — teal, magenta, deep indigo. No abrupt motion, no cuts.',
        ),
        category: 'cinematic',
        previewVideo: '/video/presets/wan_robots.mp4',
        inputHint: 'Деталь вселенной (необязательно)…',
    },
];

/** Viral realistic presets — Seedance 2.0 Fast (single-take i2v) */
const SEEDANCE_NEGATIVE = { negativePrompt: VIDEO_STUDIO_NEGATIVE_SEEDANCE };

export const SEEDANCE_VIDEO_PRESETS: VideoMotionPreset[] = [
    {
        id: 'sd_dino_puppies',
        title: 'Бег от щенят',
        description: 'Спринт по городу — за человеком бежит стая щенят',
        prompt: wrapSeedanceSingleScene(
            'Daylight city sidewalk in one continuous chase. The person sprints forward in panic, glancing back over one shoulder. ' +
            'Only a pack of small excited puppies runs after them on the same sidewalk — no dinosaur, no giant animal, no other pursuers. ' +
            'The puppies are visible from the opening frame and keep chasing at ground level the whole time. ' +
            'The person dodges a lamppost without stopping, while the puppy pack stays behind in the same street and same daylight. ' +
            'Nothing new appears mid-shot.',
            'Handheld tracking shot following the runner from the side — one smooth chase move, no cuts',
            'pounding footsteps, playful puppy yaps, panicked breathing',
        ),
        category: 'viral',
        previewVideo: '/video/presets/sd_dino_puppies.mp4',
        ...SEEDANCE_NEGATIVE,
    },
    {
        id: 'sd_kung_fu_punch',
        title: 'Kung Fu Hit',
        description: 'Крупный план удара в лицо — брызги воды, волна кожи',
        prompt: wrapSeedanceSingleScene(
            'Extreme close-up martial arts impact in a dojo. Two fighters already in frame — ' +
            'one fist drives into the other\'s cheek in slow motion. Water droplets spray from the impact point, ' +
            'skin ripples outward in a shockwave, micro sweat particles catch the light. ' +
            'Both faces and the striking hand stay in the same tight composition throughout. One punch only.',
            'Locked macro close-up on the impact zone — subtle slow push-in, no reframing',
            'sharp impact thud, breath rush, water droplet spray',
        ),
        category: 'cinematic',
        previewVideo: '/video/presets/sd_kung_fu_punch.mp4',
        ...SEEDANCE_NEGATIVE,
    },
    {
        id: 'sd_frozen_world',
        title: 'Застывший мир',
        description: 'Всё замерло — только человек движется',
        prompt: wrapSeedanceSingleScene(
            'Busy city plaza completely frozen in time. Every pedestrian is perfectly motionless mid-step. ' +
            'Fountain water is suspended in the air like glass. A bird hangs frozen with wings fully raised and never flaps. ' +
            'Traffic, clothing, hair, flags, smoke, and all background movement stay absolutely still. ' +
            'Only the main person moves, walking calmly through the frozen tableau. ' +
            'No one else moves even slightly. Same plaza, same golden hour light throughout.',
            'Steadicam dolly following the walker at medium height — one continuous path through the frozen crowd',
            'eerie silence, single set of footsteps, distant muffled city hum',
        ),
        category: 'cinematic',
        previewVideo: '/video/presets/sd_frozen_world.mp4',
        ...SEEDANCE_NEGATIVE,
    },
    {
        id: 'sd_superflight',
        title: 'Superfast Flight',
        description: 'Полёт супергероя — камера спереди, экшен',
        prompt: wrapSeedanceSingleScene(
            'The person flies like a superhero toward the camera above a city canyon. ' +
            'Hair and jacket whip in the wind, exhilarated expression, arms slightly out for balance. ' +
            'Buildings blur past on both sides. The flyer and skyline stay in one continuous forward flight — ' +
            'no teleporting, no background swap.',
            'Front-facing retreating camera matching the flyer\'s speed — locked on face, city streaking behind',
            'rushing wind, fabric flutter, distant city air',
        ),
        category: 'viral',
        previewVideo: '/video/presets/sd_superflight.mp4',
        ...SEEDANCE_NEGATIVE,
    },
];

const KLING_VARIANTS: VideoVariantId[] = ['kling-2.5-turbo', 'kling-3'];
const WAN_VARIANTS: VideoVariantId[] = ['wan-2.5'];
const SEEDANCE_VARIANTS: VideoVariantId[] = ['seedance-2.0-fast'];

export function isKlingVariant(variant: VideoVariantId | null): boolean {
    return variant != null && KLING_VARIANTS.includes(variant);
}

export function isWanVariant(variant: VideoVariantId | null): boolean {
    return variant != null && WAN_VARIANTS.includes(variant);
}

export function isSeedanceVariant(variant: VideoVariantId | null): boolean {
    return variant != null && SEEDANCE_VARIANTS.includes(variant);
}

/** Presets for a model: default + model-specific viral templates. */
export function getPresetsForModel(variant: VideoVariantId | null): VideoMotionPreset[] {
    if (isKlingVariant(variant)) {
        return [DEFAULT_VIDEO_PRESET];
    }
    if (isWanVariant(variant)) {
        return [DEFAULT_VIDEO_PRESET, ...WAN_VIDEO_PRESETS];
    }
    if (isSeedanceVariant(variant)) {
        return [DEFAULT_VIDEO_PRESET, ...SEEDANCE_VIDEO_PRESETS];
    }
    return [DEFAULT_VIDEO_PRESET];
}

export function getDefaultPresetForModel(_variant: VideoVariantId | null): VideoMotionPreset {
    return DEFAULT_VIDEO_PRESET;
}

export function isPresetAvailableForModel(presetId: string, variant: VideoVariantId | null): boolean {
    return getPresetsForModel(variant).some((p) => p.id === presetId);
}

/** Legacy flat list — Shorts / old grids. */
export const VIDEO_MOTION_PRESETS: VideoMotionPreset[] = [
    DEFAULT_VIDEO_PRESET,
    ...WAN_VIDEO_PRESETS,
    ...SEEDANCE_VIDEO_PRESETS,
];

export function getVideoPreset(id: string): VideoMotionPreset | undefined {
    return ID_INDEX[id];
}

const ID_INDEX: Record<string, VideoMotionPreset> = Object.fromEntries(
    VIDEO_MOTION_PRESETS.map((p) => [p.id, p]),
);
