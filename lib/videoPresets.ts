import type { VideoVariantId } from './videoModels';
import {
    DEFAULT_I2V_MOTION_PROMPT,
    VIDEO_STUDIO_NEGATIVE_KLING,
    VIDEO_STUDIO_NEGATIVE_SEEDANCE,
    wrapCinematicViralScene,
    wrapSeedanceMultishot,
    wrapWanPreset,
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
        id: 'wan_rpg_levelup',
        title: 'RPG Level Up',
        description: 'Аватар из вашего фото — левел-ап и легендарный лут',
        prompt: wrapWanPreset(
            'Character stands on stone platform in fantasy arena.',
            'XP bar fills with golden light. Level-up flash. {input} materializes in hands with particle burst. Victory pose with squash-and-stretch jump.',
        ),
        defaultFill: 'legendary sword',
        inputHint: 'Оружие или класс? напр. меч, лук, маг…',
        category: 'viral',
        previewVideo: '/video/presets/wan_rpg_levelup.mp4',
    },
    {
        id: 'wan_platformer_run',
        title: 'Платформер',
        description: 'Бег по платформам в мультяшном игровом мире',
        prompt: wrapWanPreset(
            'Character likeness as cartoon hero in {input}.',
            'Runs across floating platforms, coins sparkle and spin. Misses a gap, comedic mid-air flail, lands in roll. Playful game UI hearts in corner.',
        ),
        defaultFill: 'candy kingdom',
        inputHint: 'Какой мир? напр. candy kingdom, lava world…',
        category: 'viral',
        previewVideo: '/video/presets/wan_platformer_run.mp4',
    },
    {
        id: 'wan_boss_intro',
        title: 'Босс-битва',
        description: 'Эпичное появление босса — вы в доспехах',
        prompt: wrapWanPreset(
            'Character in stylized armor faces giant {input}.',
            'Camera orbits low angle. Health bars slide in. Boss roars, shockwave dust. Character draws weapon, hair and cape whip in wind. Dramatic purple-orange sky. Cel-shaded 3D, no gore.',
        ),
        defaultFill: 'Shadow Dragon',
        inputHint: 'Имя босса? напр. Shadow Dragon, Ice Titan…',
        category: 'viral',
        previewVideo: '/video/presets/wan_boss_intro.mp4',
    },
    {
        id: 'wan_anime_powerup',
        title: 'Аниме-трансформация',
        description: 'Пауэр-ап в стиле аниме — аура и энергия',
        prompt: wrapWanPreset(
            'Character in school-style outfit, crouches on cracked ground.',
            '{input} spirals upward. Hair rises, eyes glow. Energy sphere expands, leaves swirl. Slow-motion 3D anime render.',
        ),
        defaultFill: 'lightning aura',
        inputHint: 'Стихия? напр. lightning, fire, ice aura…',
        category: 'viral',
        previewVideo: '/video/presets/wan_anime_powerup.mp4',
    },
    {
        id: 'wan_arcade_highscore',
        title: 'Аркада High Score',
        description: 'Рекорд в ретро-аркаде — конфетти и радость',
        prompt: wrapWanPreset(
            'Character at stand-up arcade cabinet playing {input}.',
            'Screen flashes HIGH SCORE. Character jumps, pixel confetti, friends cheer in background. Neon pink-cyan palette, scanline hint, joyful slapstick.',
        ),
        defaultFill: 'NEON RACER',
        inputHint: 'Название игры? напр. NEON RACER, SPACE INVADERS…',
        category: 'social',
        previewVideo: '/video/presets/wan_arcade_highscore.mp4',
    },
];

/** Viral realistic presets — Seedance 1.5 Pro (cinematic i2v) */
const SEEDANCE_NEGATIVE = { negativePrompt: VIDEO_STUDIO_NEGATIVE_SEEDANCE };

export const SEEDANCE_VIDEO_PRESETS: VideoMotionPreset[] = [
    {
        id: 'sd_grocery_paparazzi',
        title: 'Папарацци в супермаркете',
        description: 'Ночная улица — вспышки поймали в капюшоне',
        prompt: wrapCinematicViralScene(
            'Night outside a club on a wet city sidewalk. The person wears a dark hoodie up and oversized glasses, ' +
            'trying to slip past unnoticed with a can of {input} in one hand. ' +
            'Paparazzi swarm erupts — strobes pop, lenses thrust forward. They shield their face with a forearm, ' +
            'step back against a brick wall, then laugh at the absurdity while still clutching the can.',
            'Handheld tabloid chase — wide street establish, push through photographers, settle on tight face in flash glare',
            'shutter clicks, camera flashes popping, startled laugh, distant club bass',
        ),
        defaultFill: 'energy drink',
        inputHint: 'Какой продукт? напр. энергетик, чипсы…',
        category: 'viral',
        previewVideo: '/video/presets/sd_grocery_paparazzi.mp4',
        ...SEEDANCE_NEGATIVE,
    },
    {
        id: 'sd_gym_mirror',
        title: 'Зеркало в зале',
        description: 'Флекс в зеркале — и внезапный стыд',
        prompt: wrapCinematicViralScene(
            'Busy commercial gym, fluorescent overhead light. The person walks to the wall mirror between dumbbell racks, ' +
            'plants feet, flexes both biceps with a dead-serious gym face. ' +
            'In the mirror reflection a stranger passes behind — they instantly drop the pose, ' +
            'roll a shoulder like a stretch, crack an embarrassed half-smile.',
            'Mirror POV — wide gym floor, drift to medium reflection, hold on face in the glass',
            'gym ambience, weights clinking, muffled footsteps',
        ),
        category: 'viral',
        previewVideo: '/video/presets/sd_gym_mirror.mp4',
        ...SEEDANCE_NEGATIVE,
    },
    {
        id: 'sd_airport_sprint',
        title: 'Опаздываю на рейс',
        description: 'Спринт по терминалу с чемоданом',
        prompt: wrapCinematicViralScene(
            'Bright airport terminal, polished floor reflections. The person sprints full speed dragging a bouncing rolling suitcase, ' +
            'boarding pass crushed in one fist showing {input}. ' +
            'They skid to a stop at the gate door, chest heaving, hair stuck to forehead, relieved grin breaking through.',
            'Tracking follow from behind — wide terminal sprint, push to medium at the gate door',
            'rolling suitcase wheels, terminal PA muffled, heavy breath at the gate',
        ),
        defaultFill: 'Gate B24',
        inputHint: 'Номер гейта? напр. Gate B24, A12…',
        category: 'viral',
        previewVideo: '/video/presets/sd_airport_sprint.mp4',
        ...SEEDANCE_NEGATIVE,
    },
    {
        id: 'sd_cafe_rain',
        title: 'Дождь за окном',
        description: 'Уютное кафе — капли на стекле и латте',
        prompt: wrapCinematicViralScene(
            'Rainy afternoon in a warm corner cafe. The person sits by the window in a knit sweater, cradling a {input}, steam curling up. ' +
            'Raindrops race down the glass; city lights blur outside. ' +
            'They watch the storm, then draw one fingertip through condensation on the pane.',
            'Exterior push-in through rain-streaked window — wide street bokeh, settle on profile inside',
            'rain on glass, soft cafe murmur, distant city traffic',
        ),
        defaultFill: 'latte with heart foam',
        inputHint: 'Напиток? напр. latte, matcha, espresso…',
        category: 'emotional',
        previewVideo: '/video/presets/sd_cafe_rain.mp4',
        ...SEEDANCE_NEGATIVE,
    },
    {
        id: 'sd_rooftop_wind',
        title: 'Крыша и ветер',
        description: 'Ночной город на фоне — ветер и уверенный взгляд',
        prompt: wrapSeedanceMultishot(
            'Kinetic rooftop viral. Night city {input} skyline bokeh behind.\n' +
            'Shot 1: Wide — on rooftop edge, wind catches hair and jacket.\n' +
            'Cut to. Shot 2: Slow-motion hair whip, city lights streak.\n' +
            'Cut to. Shot 3: Turns to camera, confident half-smile.',
        ),
        defaultFill: 'Tokyo at night',
        inputHint: 'Какой город? напр. Tokyo, NYC, Dubai…',
        category: 'social',
        previewVideo: '/video/presets/sd_rooftop_wind.mp4',
        ...SEEDANCE_NEGATIVE,
    },
    {
        id: 'sd_dino_sprint',
        title: 'Бег от T-Rex',
        description: 'T-Rex на пятках — спринт по городу',
        prompt: wrapCinematicViralScene(
            'Daylight downtown sidewalk, realistic urban color grade. The person breaks into a desperate sprint in casual streetwear, ' +
            'coffee cup spinning from their hand. They glance back — a full-scale T-Rex stomps two blocks away, ' +
            'asphalt shudders, parked cars alarm. They dive behind a black SUV, press their back to the tire, gasping.',
            'Kinetic handheld chase — wide sprint down sidewalk, low angle ground rumble, tight over-shoulder at the SUV',
            'pounding footsteps, distant T-Rex roar, car alarms, panicked breathing',
        ),
        category: 'cinematic',
        previewVideo: '/video/presets/sd_dino_sprint.mp4',
        ...SEEDANCE_NEGATIVE,
    },
    {
        id: 'sd_spire_banner',
        title: 'Баннер на шпиле',
        description: 'На вершине небоскрёба — чёрный баннер с текстом',
        prompt: wrapCinematicViralScene(
            'Art-deco skyscraper spire above a hazy city grid. The person stands on a narrow metal antenna platform in a harness, ' +
            'gripping a long black banner — white hand-painted letters "{input}" whip in the wind as they unfurl another meter, ' +
            'knuckles white, squinting into the gust, city far below.',
            'Drone slow push-in — wide tower peak, arc to medium on person and banner',
            'high-altitude wind roar, fabric flapping, distant traffic far below',
            'Same spire platform throughout. Exactly two hands gripping banner edges.',
        ),
        defaultFill: 'WHEN LOVE WINS THE WORLD KNOWS PEACE',
        inputHint: 'Текст на баннере (белые буквы на чёрном)…',
        category: 'viral',
        previewVideo: '/video/presets/sd_spire_banner.mp4',
        ...SEEDANCE_NEGATIVE,
    },
];

const KLING_VARIANTS: VideoVariantId[] = ['kling-2.5-turbo', 'kling-3'];
const WAN_VARIANTS: VideoVariantId[] = ['wan-2.5'];
const SEEDANCE_VARIANTS: VideoVariantId[] = ['seedance-1.5-pro'];

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
