import {
    ANTI_SLOP_CONTINUITY,
    ANTI_SLOP_HANDS,
    ANTI_SLOP_MULTI_CHARACTER,
    ANTI_SLOP_TRANSFORM,
    ANTI_SLOP_ANATOMY,
    CINEMATIC_REALISM,
    I2V_CHARACTER_FROM_REF,
    SEEDANCE_ANTI_MUSH,
    VIDEO_STUDIO_NEGATIVE_SEEDANCE,
    getDefaultNegativeForModel,
} from './videoPromptRules';

export type MarketingFilter = 'all' | 'tiktok' | 'ugc' | 'commercial';

export type MsTileVariant = 'lime' | 'pink' | 'blue' | 'purple' | 'amber';

/** Recommended video model per template */
export type MarketingVideoModel = 'kling-3.0-pro' | 'veo-3.1' | 'seedance-1.5-pro';

export interface MarketingTemplate {
    id: string;
    title: string;
    subtitle: string;
    categories: MarketingFilter[];
    previews: [string, string, string];
    /** Poster PNG per slot — shown while video loads or if mp4 is missing */
    previewPosters: [string, string, string];
    /**
     * Image prompt template with {{HOOK}} and {{SCENE}} slots.
     * Use resolveMarketingPrompt() to get the final image prompt.
     */
    promptTemplate: string;
    defaultHook: string;
    defaultScene: string;
    /**
     * Video prompt template (English, Kling 3.0 / Veo / Seedance syntax).
     * Uses the same {{HOOK}} and {{SCENE}} slots.
     * Use resolveMarketingVideoPrompt() to get the final video prompt.
     */
    videoPromptTemplate: string;
    /** Recommended model for this video template */
    videoModel: MarketingVideoModel;
    /** Kling negative_prompt field — separate from prose */
    negativePrompt?: string;
    chips: string[];
    tileVariant: MsTileVariant;
}

/**
 * Substitute {{HOOK}} and {{SCENE}} slots in an image template.
 */
export function resolveMarketingPrompt(
    tpl: MarketingTemplate,
    hook?: string,
    scene?: string,
): string {
    return tpl.promptTemplate
        .replace(/\{\{HOOK\}\}/g, hook || tpl.defaultHook)
        .replace(/\{\{SCENE\}\}/g, scene || tpl.defaultScene);
}

/**
 * Substitute {{HOOK}} and {{SCENE}} slots in the video prompt template.
 */
export function resolveMarketingVideoPrompt(
    tpl: MarketingTemplate,
    hook?: string,
    scene?: string,
): string {
    return tpl.videoPromptTemplate
        .replace(/\{\{HOOK\}\}/g, hook || tpl.defaultHook)
        .replace(/\{\{SCENE\}\}/g, scene || tpl.defaultScene);
}

export function resolveMarketingNegativePrompt(tpl: MarketingTemplate): string {
    return tpl.negativePrompt ?? getDefaultNegativeForModel(tpl.videoModel);
}

/** 5s silent Seedance demo prompt for homepage card previews (batch gen only). */
export function resolveMarketingDemoVideoPrompt(
    tpl: MarketingTemplate,
    hook?: string,
    scene?: string,
): string {
    const body = resolveMarketingVideoPrompt(tpl, hook, scene)
        .replace(/\n\nAudio:[\s\S]*$/i, '')
        .replace(/\nAudio:[\s\S]*$/i, '')
        .replace(/\s*Says:[^\n]*/gi, '')
        .replace(/Character A (?:says|shouts|whispers)[^\n]*/gi, '')
        .replace(/Presenter says[^\n]*/gi, '')
        .replace(/Duration:\s*\d+\s*seconds\.?/gi, '')
        .replace(/--resolution[^\n]*/g, '')
        .replace(/Cut to\.\s*/gi, '')
        .replace(/Shot \d+[^(]*\([\d.–-]+s\)\.?/gi, '')
        .replace(/Important direction: clearly edited multi-shot sequence[\s\S]*?framing\.\s*/i, '')
        .trim();

    return (
        `${I2V_CHARACTER_FROM_REF}\n` +
        `${CINEMATIC_REALISM}\n` +
        'Silent marketing demo clip. 5 seconds. 9:16 vertical. Single continuous take — one clear product action, no dialogue, no voiceover, no subtitles.\n' +
        `${ANTI_SLOP_ANATOMY}\n\n` +
        body
    );
}

/** Negative prompt for Seedance demo batch generation. */
export const MARKETING_DEMO_NEGATIVE = VIDEO_STUDIO_NEGATIVE_SEEDANCE;

const v = (name: string) => `/marketing/videos/${name}.mp4`;
const demo = (id: string, n: 1 | 2 | 3) => v(`${id}-${n}`);
const p = (folder: string, name: string) => `/marketing/pickers/${folder}/${name}.png`;

function msPreviews(
    id: string,
    posterNames: [string, string, string],
): Pick<MarketingTemplate, 'previews' | 'previewPosters'> {
    return {
        previews: [demo(id, 1), demo(id, 2), demo(id, 3)],
        previewPosters: posterNames.map((name) => p('style', name)) as [string, string, string],
    };
}

export const MARKETING_TEMPLATES: MarketingTemplate[] = [
    {
        id: 'ugc',
        title: 'UGC — Соцсети',
        subtitle: 'Реалистичное видео от лица обычного пользователя',
        categories: ['all', 'ugc', 'tiktok'],
        ...msPreviews('ugc', ['ugc-bathroom', 'ugc-2', 'ugc-3']),
        promptTemplate:
            'Фотореалистичный кадр из UGC-рекламы, снятый как на iPhone. ' +
            '{{HOOK}} ' +
            'Товар — точная копия из референсного изображения 1, в руках человека из референсного изображения 2. ' +
            'Локация: {{SCENE}}. ' +
            'Натуральная нестудийная съёмка, лёгкое зерно, живая мимика, взгляд в камеру, ' +
            'вертикальная 9:16, товар чётко виден и хорошо освещён.',
        defaultHook: 'Человек смотрит в камеру с искренней улыбкой, держа товар на уровне груди.',
        defaultScene: 'уютная гостиная, мягкий дневной свет из окна',
        videoModel: 'kling-3.0-pro',
        negativePrompt: getDefaultNegativeForModel('kling-3.0-pro'),
        videoPromptTemplate:
            '[Character A: content creator — match reference character image exactly: face, hair, outfit]\n' +
            '[Product A: hero product — match reference product image exactly: packaging, label, color]\n\n' +
            ANTI_SLOP_CONTINUITY + '\n\n' +
            'Master intent: authentic UGC social ad. 9:16 vertical. Handheld smartphone aesthetic. {{HOOK}}.\n\n' +
            'Shot 1 (0-3s). Shaky medium-close 35mm. Character A holds phone at arm\'s length; thumb visible at frame edge. ' +
            'Eyes lock lens; faint window hum. {{SCENE}}, warm natural sidelight, slight hand tremor.\n' +
            'Shot 2 (3-7s). Rack focus medium 50mm. Character A reveals Product A at chest height — ' +
            'both hands grip box, label readable, knuckles relax. Genuine half-smile, direct address.\n' +
            'Shot 3 (7-10s). Macro close-up 85mm on Product A face. One finger tilts packaging; warm side light catches texture. ' +
            'Same {{SCENE}} background softly blurred.\n\n' +
            'Audio: ambient room tone, faint natural hum, authentic social-media feel.',
        chips: ['UGC', 'Хук', 'Сеттинг'],
        tileVariant: 'blue',
    },
    {
        id: 'unboxing-asmr',
        title: 'Распаковка ASMR',
        subtitle: 'Тихая распаковка с крупным планом рук',
        categories: ['all', 'tiktok', 'ugc'],
        ...msPreviews('unboxing-asmr', ['unboxing-asmr', 'asmr-2', 'asmr-3']),
        promptTemplate:
            'Фотореалистичный кадр ASMR-распаковки с крупным планом рук на деревянном столе. ' +
            '{{HOOK}} ' +
            'Коробка с товаром — точная копия из референсного изображения 1; ' +
            'руки из референсного изображения 2, ухоженные, без украшений. ' +
            'Сцена: {{SCENE}}. ' +
            'Мягкий тёплый свет, детальная текстура упаковки, тихая атмосфера, ' +
            'никакого текста на экране, вертикальная 9:16.',
        defaultHook: 'Руки медленно раскрывают верхнюю крышку коробки, обнажая товар внутри.',
        defaultScene: 'чистый деревянный стол с мягким боковым светом, минималистичный фон',
        videoModel: 'seedance-1.5-pro',
        negativePrompt: '',
        videoPromptTemplate:
            SEEDANCE_ANTI_MUSH +
            'ASMR unboxing, 9:16 vertical, locked camera, extreme close-up of manicured hands on clean wooden table. ' +
            'Reference image 1: product packaging — match brand, color, label exactly. ' +
            'Reference image 2: creator hands — preserve nail style.\n' +
            ANTI_SLOP_HANDS + '\n\n' +
            'Shot 1, 0.0–2.0s: Top-down macro. Two hands lift pristine box lid. {{HOOK}}. ' +
            'Soft tissue paper crinkle. Warm diffused side light.\n' +
            'Cut to. Shot 2, 2.0–4.0s: Fingers peel tissue in slow deliberate motion. ' +
            'Product A emerges — label preserved. {{SCENE}}.\n' +
            'Cut to. Shot 3, 4.0–6.0s: Product A rotated 45°, label facing camera, macro focus. ' +
            'Gentle ambient light on packaging texture.\n\n' +
            'Audio: ultra-quiet paper crinkle, cardboard tap, calm breathing. No music.\n' +
            '--resolution 1080p --duration 6 --camerafixed true',
        chips: ['Распаковка ASMR', 'Хук', 'Сеттинг'],
        tileVariant: 'amber',
    },
    {
        id: 'unboxing-tryon',
        title: 'Распаковка и Примерка',
        subtitle: 'Распаковка и мгновенная примерка в одном кадре',
        categories: ['all', 'ugc', 'tiktok'],
        ...msPreviews('unboxing-tryon', ['unboxing-tryon', 'unboxing-tryon-2', 'unboxing-tryon-3']),
        promptTemplate:
            'Фотореалистичный двухчастный UGC-кадр: слева — открытая коробка с товаром ' +
            '(точная копия из референсного изображения 1), справа — тот же человек уже использует или носит товар. ' +
            '{{HOOK}} ' +
            'Человек — точная копия из референсного изображения 2, энергичная реакция. ' +
            'Сцена: {{SCENE}}. ' +
            'Смартфонная эстетика, натуральный свет, вертикальная 9:16.',
        defaultHook: 'Мгновенный переход: в одной руке упаковка, другой рукой человек уже примеряет товар.',
        defaultScene: 'светлая спальня, зеркало в полный рост на фоне',
        videoModel: 'kling-3.0-pro',
        negativePrompt: getDefaultNegativeForModel('kling-3.0-pro'),
        videoPromptTemplate:
            '[Character A: creator — match reference character image exactly: face, hair, outfit]\n' +
            '[Product A: hero item — match reference product image exactly: shape, color, brand details]\n\n' +
            ANTI_SLOP_CONTINUITY + '\n\n' +
            'Master intent: unbox-to-try-on transition. High energy. 9:16 vertical. Same {{SCENE}} throughout. {{HOOK}}.\n\n' +
            'Shot 1 (0-3s). Medium-close 35mm handheld. Character A holds Product A box toward camera; eyes widen. ' +
            '{{SCENE}}, bright natural window light, slight shake.\n' +
            'Shot 2 (3-6s). Whip-pan same location. Character A opens box — tissue lifts, Product A revealed, label readable. ' +
            'Sharp inhale, shoulders lift with excitement.\n' +
            'Shot 3 (6-10s). Full-body medium 50mm. Character A now wearing Product A, turns to mirror, ' +
            'same outfit otherwise, triumphant smile back to camera. Identical lighting direction.\n\n' +
            'Audio: upbeat ambient energy, real gasp, cardboard rustle. No voiceover.',
        chips: ['Распаковка', 'Хук', 'Примерка'],
        tileVariant: 'pink',
    },
    {
        id: 'selfie-testimonial',
        title: 'Selfie Testimonial',
        subtitle: 'Честный отзыв в стиле селфи на вытянутую руку',
        categories: ['all', 'ugc', 'tiktok'],
        ...msPreviews('selfie-testimonial', ['selfie-testimonial', 'selfie-2', 'selfie-3']),
        promptTemplate:
            'Фотореалистичный селфи-кадр: человек держит камеру на вытянутой руке, ' +
            'смотрит прямо в объектив с искренним выражением. ' +
            '{{HOOK}} ' +
            'Человек — точная копия из референсного изображения 2; ' +
            'товар из референсного изображения 1 виден в руке или используется. ' +
            'Сцена: {{SCENE}}. ' +
            'Лёгкая нестабилизация, зернистость смартфона, естественное освещение, вертикальная 9:16.',
        defaultHook: 'Человек открывает рот, как будто только что собирается сказать что-то важное о товаре.',
        defaultScene: 'улица или кафе, яркий дневной свет, слегка размытый боке-фон',
        videoModel: 'kling-3.0-pro',
        negativePrompt: getDefaultNegativeForModel('kling-3.0-pro'),
        videoPromptTemplate:
            '[Character A: creator — match reference character image exactly: face, skin, hair, casual outfit]\n' +
            '[Product A: product — match reference product image exactly]\n\n' +
            ANTI_SLOP_CONTINUITY + '\n\n' +
            'Master intent: authentic selfie testimonial. Real-talk energy. 9:16 vertical. {{HOOK}}.\n\n' +
            'Shot 1 (0-3s). Wide selfie 24mm handheld. Character A holds phone at arm\'s length; thumb at frame edge. ' +
            'Eyes lock lens; jaw relaxes; faint street hum. {{SCENE}} background stable.\n' +
            'Shot 2 (3-7s). Character A raises Product A beside cheek — both hands visible, label readable. ' +
            'Character A leans toward lens and says in a warm conversational voice: "Okay I have to tell you about this."\n' +
            'Shot 3 (7-10s). Same framing. Single slow nod; Product A steady in frame. Warm daylight unchanged.\n\n' +
            'Audio: real conversational voice, ambient location tone. No studio VO.',
        chips: ['Selfie', 'Хук', 'Сеттинг'],
        tileVariant: 'lime',
    },
    {
        id: 'direct-to-camera',
        title: 'Direct to Camera',
        subtitle: 'Уверенная подача прямо в объектив',
        categories: ['all', 'ugc', 'tiktok'],
        ...msPreviews('direct-to-camera', ['direct-to-camera', 'direct-to-camera-2', 'direct-to-camera-3']),
        promptTemplate:
            'Фотореалистичный крупный план: человек смотрит прямо в камеру, уверенный взгляд, ' +
            'нейтральная поза презентатора. ' +
            '{{HOOK}} ' +
            'Человек — точная копия из референсного изображения 2, товар из референсного изображения 1 ' +
            'держит двумя руками перед собой или демонстрирует рядом с лицом. ' +
            'Сцена: {{SCENE}}. ' +
            'Чистый кадр, правило третей, мягкий студийный свет, вертикальная 9:16.',
        defaultHook: 'Человек поднимает товар на уровень плеч, взгляд прямо в камеру, лёгкая полуулыбка.',
        defaultScene: 'светлый минималистичный фон (белый или мягко-серый), небольшой кольцевой блик в глазах',
        videoModel: 'veo-3.1',
        negativePrompt: '',
        videoPromptTemplate:
            '[Subject: confident presenter — match reference character image exactly: face, outfit, posture]\n' +
            '[Product: hero product — match reference product image exactly: label, packaging, shape]\n\n' +
            ANTI_SLOP_CONTINUITY + '\n\n' +
            'Medium-close shot 50mm. Presenter stands against {{SCENE}}, eyes directly into camera. ' +
            '9:16 vertical. Soft diffused key from frame-left, ring catch-light in eyes.\n\n' +
            '{{HOOK}} Presenter lifts Product with both hands at shoulder height — label faces camera, fingers separated cleanly.\n\n' +
            'Says: Presenter says in a clear confident voice: "This is the one thing I use every single day."\n\n' +
            'Slow push-in to medium close-up as Product moves slightly closer. Same background, same wardrobe.\n\n' +
            'Audio: clear voice sync, subtle ambient room tone, no music.\n' +
            'Duration: 8 seconds.',
        chips: ['Direct', 'Хук', 'Сеттинг'],
        tileVariant: 'blue',
    },
    {
        id: 'before-after',
        title: 'До и После',
        subtitle: 'Трансформация результата в одном кадре',
        categories: ['all', 'ugc', 'commercial'],
        ...msPreviews('before-after', ['before-after', 'before-after-2', 'before-after-3']),
        promptTemplate:
            'Фотореалистичный сплит-кадр "до и после": левая половина — проблема или исходное состояние, ' +
            'правая — результат после применения товара. ' +
            '{{HOOK}} ' +
            'Один и тот же человек из референсного изображения 2 в обеих половинах; ' +
            'товар из референсного изображения 1 виден только в правой части как атрибут результата. ' +
            'Сцена: {{SCENE}}. ' +
            'Чёткое визуальное разделение, одинаковое кадрирование обеих половин, вертикальная 9:16.',
        defaultHook: 'Тонкая вертикальная белая линия делит кадр ровно пополам, обе половины освещены одинаково.',
        defaultScene: 'нейтральный светлый фон, подчёркивающий изменение',
        videoModel: 'kling-3.0-pro',
        negativePrompt: getDefaultNegativeForModel('kling-3.0-pro'),
        videoPromptTemplate:
            '[Character A: subject — match reference character image exactly: face, skin tone, hair]\n' +
            '[Product A: product — match reference product image exactly]\n\n' +
            ANTI_SLOP_TRANSFORM + '\n\n' +
            'Master intent: before-after transformation ad. 9:16 vertical. Same {{SCENE}} room, same camera axis.\n\n' +
            'Shot 1 (0-3s). Medium 50mm. Character A in before state — tired expression, desaturated cool key light. ' +
            '{{HOOK}} Slow push-in on face; shallow breath audible.\n' +
            'Shot 2 (3-6s). Macro insert. Product A slides into frame — two hands place it on surface, label readable. ' +
            'Warm golden rim light begins on Product A only.\n' +
            'Shot 3 (6-10s). Same medium framing as Shot 1. Character A after state — energized smile, warm fill light, ' +
            'holding Product A. Background unchanged, only grade shifts cool to warm.\n\n' +
            'Audio: soft whoosh at transition, uplifting ambient hum. No voiceover.',
        chips: ['До/После', 'Хук', 'Сеттинг'],
        tileVariant: 'purple',
    },
    {
        id: 'product-review',
        title: 'Обзор Товара',
        subtitle: 'Детальная демонстрация с вовлечённым разбором',
        categories: ['all', 'ugc', 'tiktok'],
        ...msPreviews('product-review', ['product-review', 'product-review-2', 'product-review-3']),
        promptTemplate:
            'Фотореалистичный кадр обзора: человек за столом держит товар обеими руками и рассматривает его, ' +
            'взгляд чуть опущен на продукт, затем поднимается к камере. ' +
            '{{HOOK}} ' +
            'Человек — точная копия из референсного изображения 2; ' +
            'товар — точная копия из референсного изображения 1, детально виден. ' +
            'Сцена: {{SCENE}}. ' +
            'Тёплый мягкий свет, тщательная детализация товара, атмосфера честного обзора, вертикальная 9:16.',
        defaultHook: 'Человек поворачивает товар, чтобы показать его со всех сторон — первая сторона, самая эффектная.',
        defaultScene: 'аккуратный стол с одним нейтральным аксессуаром, тёплое боковое освещение',
        videoModel: 'kling-3.0-pro',
        negativePrompt: getDefaultNegativeForModel('kling-3.0-pro'),
        videoPromptTemplate:
            '[Character A: reviewer — match reference character image exactly: face, casual outfit, seated posture]\n' +
            '[Product A: reviewed product — match reference product image exactly: all details preserved]\n\n' +
            ANTI_SLOP_CONTINUITY + '\n\n' +
            'Master intent: honest product review. Warm. Credible. 9:16 vertical.\n\n' +
            'Shot 1 (0-3s). Medium-close 50mm. Character A seated at {{SCENE}}, Product A in both hands. ' +
            '{{HOOK}} Gaze drops to product, then rises to camera. Warm side light from frame-right.\n' +
            'Shot 2 (3-7s). Rack focus close-up 85mm. Character A rotates Product A slowly — label readable each side. ' +
            'Character A exhales and says: "Look at the quality on this."\n' +
            'Shot 3 (7-10s). Medium same angle. Product A set on table; Character A leans forward, direct eye contact. ' +
            'Same {{SCENE}} background.\n\n' +
            'Audio: conversational voice, mild desk surface tap, no background music.',
        chips: ['Обзор', 'Хук', 'Сеттинг'],
        tileVariant: 'amber',
    },
    {
        id: 'couple-sharing',
        title: 'Пара Дома',
        subtitle: 'Пара делится продуктом в домашней обстановке',
        categories: ['all', 'ugc', 'tiktok'],
        ...msPreviews('couple-sharing', ['couple-1', 'couple-2', 'couple-3']),
        promptTemplate:
            'Фотореалистичный кадр: двое людей (пара) в домашней обстановке вместе рассматривают или пробуют товар, ' +
            'оба смотрят на него с искренней реакцией — удивление, радость, смех. ' +
            '{{HOOK}} ' +
            'Люди — точные копии из референсных изображений; ' +
            'товар — точная копия из референсного изображения 1. ' +
            'Сцена: {{SCENE}}. ' +
            'Тёплое домашнее освещение, уютная атмосфера, вертикальная 9:16, фотореалистично.',
        defaultHook: 'Один партнёр показывает товар другому, оба смеются и реагируют с восторгом.',
        defaultScene: 'уютная современная гостиная, мягкий вечерний свет, диван на фоне',
        videoModel: 'kling-3.0-pro',
        negativePrompt: getDefaultNegativeForModel('kling-3.0-pro'),
        videoPromptTemplate:
            '[Character A: Person 1 — match reference character image exactly: face, hair, casual home outfit]\n' +
            '[Character B: Person 2 — match reference character image 2 exactly]\n' +
            '[Product A: hero product — match reference product image exactly: packaging, label, color]\n\n' +
            ANTI_SLOP_MULTI_CHARACTER + '\n\n' +
            'Master intent: authentic couple sharing moment. 9:16 vertical. Same {{SCENE}} sofa and lighting. {{HOOK}}.\n\n' +
            'Shot 1 (0-3s). Medium-wide 35mm. Character A and B on sofa; Character A holds Product A between them. ' +
            'Both lean in; soft ambient home light, fabric rustle.\n' +
            'Shot 2 (3-6s). Rack focus close-up. Product A foreground, both faces softly behind, label readable. ' +
            'Character B\'s eyebrows lift with delight.\n' +
            'Shot 3 (6-10s). Medium two-shot. Character A demonstrates Product A; Character B laughs, ' +
            'then both glance at camera. Same location, no background change.\n\n' +
            'Audio: natural home ambient, soft mutual laughter, no music.',
        chips: ['Пара', 'Хук', 'Сеттинг'],
        tileVariant: 'pink',
    },
    {
        id: 'secret-hack',
        title: 'Секретный Лайфхак',
        subtitle: 'Неожиданное применение — вирусное раскрытие',
        categories: ['all', 'ugc', 'tiktok'],
        ...msPreviews('secret-hack', ['hack-1', 'hack-2', 'hack-3']),
        promptTemplate:
            'Фотореалистичный кадр: человек с заговорщическим видом показывает неожиданное применение товара. ' +
            '{{HOOK}} ' +
            'Человек — точная копия из референсного изображения 2; ' +
            'товар — точная копия из референсного изображения 1, хорошо виден в кадре. ' +
            'Сцена: {{SCENE}}. ' +
            'Динамичная крупноплановая съёмка момента «ах вот в чём трюк», вертикальная 9:16.',
        defaultHook: 'Человек прикрывает рот рукой с выражением «я не должен это рассказывать», затем подмигивает.',
        defaultScene: 'кухня или рабочий стол, хорошее освещение, чистый фон',
        videoModel: 'kling-3.0-pro',
        negativePrompt: getDefaultNegativeForModel('kling-3.0-pro'),
        videoPromptTemplate:
            '[Character A: creator — match reference character image exactly: face, casual outfit]\n' +
            '[Product A: hero product — match reference product image exactly]\n\n' +
            ANTI_SLOP_CONTINUITY + '\n\n' +
            'Master intent: secret hack reveal. Conspiratorial whisper-to-wow. 9:16 vertical. {{HOOK}}.\n\n' +
            'Shot 1 (0-2s). Medium-close 50mm. Character A leans toward lens at {{SCENE}}, cupped hand near mouth. ' +
            'Eyes dart left-right; quiet room tone.\n' +
            'Shot 2 (2-6s). Character A pulls Product A up from below frame — two hands, label readable. ' +
            'Character A whispers then demonstrates hack with deliberate finger motion.\n' +
            'Shot 3 (6-10s). Medium same angle. Character A points at result, triumphant grin to camera. ' +
            '{{SCENE}} unchanged behind.\n\n' +
            'Audio: suspenseful quiet then upbeat payoff, real conversational voice.',
        chips: ['Лайфхак', 'Хук', 'Сеттинг'],
        tileVariant: 'purple',
    },
    {
        id: 'camera-pov',
        title: 'Camera POV',
        subtitle: 'Эффект погружения — вид от первого лица',
        categories: ['all', 'tiktok', 'commercial'],
        ...msPreviews('camera-pov', ['pov-1', 'pov-2', 'pov-3']),
        promptTemplate:
            'Фотореалистичный POV-кадр от первого лица: руки держат товар на уровне глаз, ' +
            'фон — это то, что видит зритель сам. ' +
            '{{HOOK}} ' +
            'Товар — точная копия из референсного изображения 1, занимает центр кадра. ' +
            'Руки — точная копия из референсного изображения 2. ' +
            'Сцена: {{SCENE}}. ' +
            'Эффект погружения, широкоугольная линза, движение камеры, 9:16.',
        defaultHook: 'Руки медленно поднимают товар к глазам, как будто зритель сам держит его впервые.',
        defaultScene: 'городская улица или кафе, яркий дневной свет, движение на фоне',
        videoModel: 'veo-3.1',
        negativePrompt: '',
        videoPromptTemplate:
            '[Character POV: first-person — match reference hand skin tone exactly]\n' +
            '[Product A: hero product — match reference product image exactly: label, packaging]\n\n' +
            ANTI_SLOP_HANDS + '\n\n' +
            'Master intent: immersive first-person POV. Viewer IS the character. 9:16 vertical. No face visible. {{HOOK}}.\n\n' +
            'Shot 1 (0-3s). True POV 24mm. Two hands rise holding Product A; {{SCENE}} behind. ' +
            'Slight camera sway; footsteps faint.\n' +
            'Shot 2 (3-6s). Hands rotate Product A — label readable, packaging texture in macro. ' +
            'Background same location, softly blurred.\n' +
            'Shot 3 (6-9s). Product A moves toward viewer — extreme close-up, one feature demonstrated. ' +
            'Same hands, same lighting.\n' +
            'Shot 4 (9-10s). Pull back to full product in both hands, {{SCENE}} backdrop stable.\n\n' +
            'Audio: ambient environment from POV location — footsteps, breeze, urban hum.\n' +
            'Duration: 8 seconds.',
        chips: ['POV', 'Хук', 'Сеттинг'],
        tileVariant: 'blue',
    },
    {
        id: 'classic-modern',
        title: 'Классика + Современность',
        subtitle: 'Соединение вечного стиля и актуального продукта',
        categories: ['all', 'tiktok', 'commercial'],
        ...msPreviews('classic-modern', ['classic-1', 'classic-2', 'classic-3']),
        promptTemplate:
            'Фотореалистичный кадр в двойном стиле: одна половина — классическая, винтажная эстетика ' +
            '(приглушённые тона, архивная текстура), другая — современная, яркая (чистые линии, насыщенные цвета). ' +
            '{{HOOK}} ' +
            'Товар из референсного изображения 1 присутствует в обоих мирах как связующий элемент; ' +
            'человек из референсного изображения 2 выглядит в каждой половине соответственно эпохе. ' +
            'Сцена: {{SCENE}}. ' +
            'Высококонтрастный fashion-лук, вертикальная 9:16.',
        defaultHook: 'Вертикальная линия делит кадр: слева — сепия и винтаж, справа — яркие неоновые цвета наших дней.',
        defaultScene: 'архитектурный фасад здания или интерьер с контрастным декором',
        videoModel: 'kling-3.0-pro',
        negativePrompt: getDefaultNegativeForModel('kling-3.0-pro'),
        videoPromptTemplate:
            '[Character A: fashion subject — match reference character image exactly: face, replicate in two era styles]\n' +
            '[Product A: hero product — match reference product image exactly]\n\n' +
            ANTI_SLOP_TRANSFORM + ' Character A face identity locked across both style halves.\n\n' +
            'Master intent: Classic Meets Modern style contrast. 9:16 vertical. Same pose axis.\n\n' +
            'Shot 1 (0-3s). Left half vintage styling — sepia tones, period outfit, Product A in hand. ' +
            '{{SCENE}} classic architecture. {{HOOK}}\n' +
            'Shot 2 (3-6s). Center wipe same framing: Character A same face, contemporary streetwear, saturated neons. ' +
            'Same Product A, same pose, modern side of {{SCENE}}.\n' +
            'Shot 3 (6-10s). Full frame centered. Character A holds Product A, direct to camera. ' +
            'Blended grade, confident stillness.\n\n' +
            'Audio: vintage crackle transitions to crisp modern ambient. No voiceover.',
        chips: ['Стиль', 'Хук', 'Эра'],
        tileVariant: 'amber',
    },
    {
        id: 'mess-to-fresh',
        title: 'Беспорядок → Свежесть',
        subtitle: 'Мгновенная трансформация от хаоса к идеальному порядку',
        categories: ['all', 'ugc', 'tiktok'],
        ...msPreviews('mess-to-fresh', ['mess-fresh-1', 'mess-fresh-2', 'mess-fresh-3']),
        promptTemplate:
            'Фотореалистичный кадр трансформации: слева — хаотичная, грязная ситуация, ' +
            'справа — та же сцена чистая, ухоженная, свежая благодаря товару. ' +
            '{{HOOK}} ' +
            'Человек из референсного изображения 2 присутствует в обоих состояниях с контрастной мимикой; ' +
            'товар из референсного изображения 1 — герой правой «свежей» стороны. ' +
            'Сцена: {{SCENE}}. ' +
            'Высокий контраст, яркие насыщенные цвета в «свежей» части, 9:16.',
        defaultHook: 'Человек выглядит измотанным и смотрит на беспорядок, затем подмигивает в камеру, держа товар.',
        defaultScene: 'кухня, ванная или рабочий стол — любое место, где применяется товар',
        videoModel: 'kling-3.0-pro',
        negativePrompt: getDefaultNegativeForModel('kling-3.0-pro'),
        videoPromptTemplate:
            '[Character A: creator — match reference character image exactly: face, casual relatable outfit]\n' +
            '[Product A: hero product — match reference product image exactly]\n\n' +
            ANTI_SLOP_TRANSFORM + '\n\n' +
            'Master intent: mess-to-fresh transformation. 9:16 vertical. Same {{SCENE}} camera position.\n\n' +
            'Shot 1 (0-3s). Wide medium. Character A at messy {{SCENE}} — frustrated gesture, desaturated light, clutter visible.\n' +
            'Shot 2 (3-5s). Close-up. Character A holds Product A — label readable, confident smirk. {{HOOK}}\n' +
            'Shot 3 (5-8s). Fast-motion same angle. Product A in use — hands energetic, saturation rises progressively.\n' +
            'Shot 4 (8-10s). Same wide as Shot 1 — scene clean, warm light, Character A triumphant with Product A.\n\n' +
            'Audio: chaotic ambient to satisfying swoosh to upbeat payoff.',
        chips: ['До/После', 'Хук', 'Сеттинг'],
        tileVariant: 'lime',
    },
    {
        id: 'gadget-saved-me',
        title: 'Этот гаджет спас меня',
        subtitle: 'Восторженная рекомендация — вирусный формат',
        categories: ['all', 'ugc', 'tiktok'],
        ...msPreviews('gadget-saved-me', ['gadget', 'gadget', 'gadget']),
        promptTemplate:
            'Фотореалистичный вирусный кадр: человек с широко открытыми глазами и восторженной мимикой ' +
            'указывает на товар рядом с собой или держит его на уровне груди. ' +
            '{{HOOK}} ' +
            'Человек — точная копия из референсного изображения 2; ' +
            'товар — точная копия из референсного изображения 1, логотип и форма чётко различимы. ' +
            'Сцена: {{SCENE}}. ' +
            'Яркие насыщенные цвета, высокий контраст, энергичная атмосфера TikTok, вертикальная 9:16.',
        defaultHook: 'Человек делает большие удивлённые глаза и открывает рот, как будто только что обнаружил нечто невероятное.',
        defaultScene: 'современная кухня или рабочее место, яркий дневной свет, чистый фон',
        videoModel: 'kling-3.0-pro',
        negativePrompt: getDefaultNegativeForModel('kling-3.0-pro'),
        videoPromptTemplate:
            '[Character A: energetic creator — match reference character image exactly: face, outfit, body language]\n' +
            '[Product A: hero product — match reference product image exactly: logo, shape, color]\n\n' +
            ANTI_SLOP_CONTINUITY + '\n\n' +
            'Master intent: viral Gadget Saved Me format. Maximum energy. 9:16 vertical. {{HOOK}}.\n\n' +
            'Shot 1 (0-2s). Fast zoom medium-close 35mm. Character A at {{SCENE}} — eyes wide, finger points off-frame. ' +
            'Sharp inhale audible.\n' +
            'Shot 2 (2-5s). Character A thrusts Product A toward camera — both hands, label readable. ' +
            'Character A shouts excitedly: "Where has this been my whole life?!" Same background.\n' +
            'Shot 3 (5-8s). Close-up demo. Quick hands demonstrate one feature; bright saturated grade.\n' +
            'Shot 4 (8-10s). Medium. Product A held triumphantly, huge smile to camera.\n\n' +
            'Audio: real excited voice, punchy ambient energy, no music bed.',
        chips: ['Гаджет', 'Хук', 'Демо'],
        tileVariant: 'purple',
    },
];

export const MARKETING_FILTERS: { id: MarketingFilter; label: string; badge?: string }[] = [
    { id: 'all', label: 'Все' },
    { id: 'tiktok', label: 'TikTok', badge: 'NEW' },
    { id: 'ugc', label: 'UGC' },
    { id: 'commercial', label: 'Коммерческое' },
];

const _defaultUgc = MARKETING_TEMPLATES.find(t => t.id === 'ugc')!;
export const DEFAULT_MARKETING_PROMPT = resolveMarketingPrompt(_defaultUgc);
export const DEFAULT_MARKETING_CHIPS = _defaultUgc.chips.slice();

export const MARKETING_GEN_COST = 100;
export const MARKETING_GEN_COST_OLD = 150;
/** Cost in credits for marketing video generation (Kling 3.0 / Veo 3.1) */
export const MARKETING_VIDEO_GEN_COST = 600;
export const MARKETING_VIDEO_GEN_COST_OLD = 800;
