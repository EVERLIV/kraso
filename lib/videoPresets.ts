import type { VideoVariantId } from './videoModels';

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
}

const INPUT_SLOT = '{input}';

export function buildVideoPresetPrompt(
    preset: VideoMotionPreset | null,
    userText: string,
): string {
    const extra = userText.trim();

    if (!preset) {
        return extra || 'Animate this image with smooth, cinematic camera movement.';
    }

    if (preset.prompt.includes(INPUT_SLOT)) {
        const fill = extra || preset.defaultFill || '';
        return preset.prompt.replace(INPUT_SLOT, fill).replace(/\s{2,}/g, ' ').trim();
    }

    return [preset.prompt, extra].filter(Boolean).join(' ').trim();
}

/** Default preset — available for every video model. */
export const DEFAULT_VIDEO_PRESET: VideoMotionPreset = {
    id: 'general',
    title: 'Обычная Генерация',
    description: 'Чистая генерация — качество модели',
    prompt: 'Animate this image with smooth, natural motion and subtle cinematic camera movement.',
    category: 'cinematic',
    inputHint: 'Опишите движение (необязательно)…',
};

/** Extra motion presets — only for Seedance models. */
export const SEEDANCE_VIDEO_PRESETS: VideoMotionPreset[] = [
    {
        id: 'animal_ride',
        title: 'Поездка на звере',
        description: 'Персонаж верхом на животном',
        prompt: 'The person is riding {input} through a cinematic landscape. Dynamic motion, dust and wind, epic wide shot, natural fur and muscle movement, professional film look.',
        defaultFill: 'a large brown bear',
        inputHint: 'На каком животном? напр. на льве, на волке…',
        category: 'viral',
    },
    {
        id: 'animal_chase',
        title: 'Погоня зверя',
        description: 'Животное бежит за героем',
        prompt: 'A {input} is chasing the person, who runs toward the camera. High-speed cinematic tracking shot, motion blur, dramatic tension, dust flying.',
        defaultFill: 'a wild tiger',
        inputHint: 'Какое животное? напр. медведь, стая волков…',
        category: 'viral',
    },
    {
        id: 'pet_transform',
        title: 'Я и мой питомец',
        description: 'Превращение / объятие с питомцем',
        prompt: 'The person hugs and transforms alongside {input}. Warm magical transition, glowing particles, heartwarming cinematic moment, smooth morph.',
        defaultFill: 'a fluffy golden retriever',
        inputHint: 'Какой питомец? напр. кот, хаски…',
        category: 'emotional',
    },
    {
        id: 'disintegration',
        title: 'Распад',
        description: 'Частицы, эффект Таноса',
        prompt: 'The subject slowly disintegrates into flying ash and glowing particles, drifting away in the wind. Dramatic cinematic slow-motion, volumetric light.',
        category: 'viral',
    },
    {
        id: 'earth_zoom_out',
        title: 'Zoom из космоса',
        description: 'Отдаление до вида Земли',
        prompt: 'Camera zooms out continuously from the subject up into the sky, through clouds, into orbit revealing the Earth from space. Epic seamless cinematic pull-back.',
        category: 'social',
    },
    {
        id: 'earth_zoom_in',
        title: 'Zoom из космоса к герою',
        description: 'Наезд от Земли к объекту',
        prompt: 'Camera zooms in continuously from Earth seen from space, down through clouds, streets, straight to the subject. Epic seamless cinematic push-in.',
        category: 'social',
    },
    {
        id: 'sd_paparazzi',
        title: 'Папарацци 2000-х',
        description: 'Вспышки, папарацци, гламур',
        prompt: 'Early 2000s paparazzi scene: aggressive camera flashes, the subject walking confidently, motion blur, tabloid celebrity energy, cinematic.',
        category: 'viral',
    },
    {
        id: 'sd_red_carpet',
        title: 'Красная дорожка',
        description: 'Премьера, вспышки камер',
        prompt: 'Red carpet premiere: slow confident walk, camera flashes firing, glamorous lighting, elegant cinematic movement.',
        category: 'viral',
    },
    {
        id: 'sd_race_winner',
        title: 'Победитель гонки',
        description: 'Финиш, флаги, эйфория',
        prompt: 'The subject crosses the race finish line as the winner, arms raised, confetti and flags, crowd cheering, triumphant cinematic slow-motion.',
        category: 'viral',
    },
    {
        id: 'sd_office_cctv',
        title: 'Офисное CCTV',
        description: 'Съёмка камерой наблюдения',
        prompt: 'Grainy office CCTV security-camera footage of the subject, timestamp overlay, slightly low frame rate, wide corner angle, realistic surveillance look.',
        category: 'viral',
    },
];

const SEEDANCE_VARIANTS: VideoVariantId[] = ['seedance-1.5-pro', 'seedance-2'];

export function isSeedanceVariant(variant: VideoVariantId | null): boolean {
    return variant != null && SEEDANCE_VARIANTS.includes(variant);
}

/** Presets for a model: default + Seedance extras when applicable. */
export function getPresetsForModel(variant: VideoVariantId | null): VideoMotionPreset[] {
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
    ...SEEDANCE_VIDEO_PRESETS,
];

export function getVideoPreset(id: string): VideoMotionPreset | undefined {
    return ID_INDEX[id];
}

const ID_INDEX: Record<string, VideoMotionPreset> = Object.fromEntries(
    VIDEO_MOTION_PRESETS.map((p) => [p.id, p]),
);
