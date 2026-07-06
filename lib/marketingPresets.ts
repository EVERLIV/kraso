import {
    ANTI_SLOP_CONTINUITY,
    ANTI_SLOP_HANDS,
    ANTI_SLOP_MULTI_CHARACTER,
    ANTI_SLOP_TRANSFORM,
    ANTI_SLOP_ANATOMY,
    CINEMATIC_REALISM,
    I2V_CHARACTER_FROM_REF,
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

/** 8s Kling 3.0 Pro demo prompt for homepage card previews. */
export function resolveMarketingDemoVideoPrompt(
    tpl: MarketingTemplate,
    hook?: string,
    scene?: string,
): string {
    const body = resolveMarketingVideoPrompt(tpl, hook, scene)
        .replace(/\n\nAudio:[\s\S]*$/i, '')
        .replace(/\nAudio:[\s\S]*$/i, '')
        .replace(/Duration:\s*\d+\s*seconds\.?/gi, '')
        .trim();

    return (
        `${I2V_CHARACTER_FROM_REF}\n` +
        `${CINEMATIC_REALISM}\n` +
        'Single continuous take — one clear product action, no dialogue, no voiceover, no subtitles. 8 seconds.\n' +
        `${ANTI_SLOP_ANATOMY}\n\n` +
        body
    );
}

/** Negative prompt for Seedance demo batch generation. */
export const MARKETING_DEMO_NEGATIVE = VIDEO_STUDIO_NEGATIVE_SEEDANCE;

const v = (name: string) => `/marketing/videos/${name}.mp4`;
const p = (folder: string, name: string) => `/marketing/pickers/${folder}/${name}.png`;

function msPreviews(
    id: string,
    posterNames: [string, string, string],
    videoNames?: [string, string, string],
): Pick<MarketingTemplate, 'previews' | 'previewPosters'> {
    const videos = videoNames ?? [`${id}-1`, `${id}-2`, `${id}-3`];
    return {
        previews: videos.map((name) => v(name)) as [string, string, string],
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
            'вертикальная 9:16, товар чётко виден и хорошо освещён. ' +
            'ВАЖНО: у человека ровно две руки — одна держит товар, вторая свободна. Без лишних рук.',
        defaultHook: 'Человек смотрит в камеру с искренней улыбкой, держа товар на уровне груди.',
        defaultScene: 'уютная гостиная, мягкий дневной свет из окна',
        videoModel: 'kling-3.0-pro',
        negativePrompt: getDefaultNegativeForModel('kling-3.0-pro'),
        videoPromptTemplate:
            '[Character A: content creator — match reference character image exactly: face, hair, outfit]\n' +
            '[Product A: hero product — match reference product image exactly: packaging, label, color]\n\n' +
            ANTI_SLOP_CONTINUITY + '\n\n' +
            'Master intent: authentic UGC social ad. 9:16 vertical. Handheld smartphone aesthetic. {{HOOK}}.\n\n' +
            'One continuous take. The scene opens on Character A in {{SCENE}}, holding Product A naturally at chest height. ' +
            'Camera gently pushes in from a medium shot to a close-up over 8 seconds. ' +
            'Character A looks at the product, then raises it slightly toward the lens — label stays readable, ' +
            'both hands visible on the packaging. A natural half-smile forms. ' +
            'The background remains {{SCENE}} throughout, warm window light consistent. ' +
            'No cuts, no angle changes. One smooth organic movement.',
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
            'Фотореалистичный макро-кадр ASMR-распаковки: крупный план рук на столе, ' +
            'медленное раскрытие упаковки с фокусом на деталях. ' +
            '{{HOOK}} ' +
            'Коробка с товаром — точная копия из референсного изображения 1; ' +
            'руки из референсного изображения 2, ухоженные, без украшений. ' +
            'Сцена: {{SCENE}}. ' +
            'Мягкий тёплый свет, детальная текстура упаковки, ' +
            'атмосфера спокойствия и внимания к деталям, вертикальная 9:16.',
        defaultHook: 'Руки медленно раскрывают верхнюю крышку коробки, обнажая товар внутри — пальцы аккуратно ощупывают текстуру.',
        defaultScene: 'чистый деревянный стол с мягким боковым светом, минималистичный фон, тихая атмосфера',
        videoModel: 'seedance-1.5-pro',
        negativePrompt: '',
        videoPromptTemplate:
            '[Hands: manicured hands — match reference hand skin tone and nail style exactly]\n' +
            '[Product A: product packaging — match reference product image exactly: brand, color, label, texture]\n\n' +
            'ASMR unboxing, 9:16 vertical. Single continuous take — locked camera top-down macro angle on a clean wooden table. {{SCENE}}.\n\n' +
            'Scene opens on two hands resting at the edges of a closed box. Fingers slowly trace the edges of the packaging — ' +
            'feeling the texture. The lid lifts millimeter by millimeter, revealing tissue paper underneath. ' +
            'One hand carefully peels the tissue aside, fingertips brushing the surface. ' +
            'Product A emerges into frame — the other hand rotates it in slow motion, ' +
            'fingers gliding over every detail: the label, the seam, the cap. ' +
            'Both hands hold the product steadily, turning it 360 degrees for a detailed review. ' +
            'Gentle diffused side light across the packaging. Every motion is slow, deliberate, meticulous. ' +
            'No cuts, no angle changes. One slow, detailed unboxing and product review sequence from lid lift to full product examination.',
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
            'Смартфонная эстетика, натуральный свет, вертикальная 9:16. ' +
            'ВАЖНО: у человека ровно две руки. Без лишних рук.',
        defaultHook: 'Мгновенный переход: в одной руке упаковка, другой рукой человек уже примеряет товар.',
        defaultScene: 'светлая спальня, зеркало в полный рост на фоне',
        videoModel: 'kling-3.0-pro',
        negativePrompt: getDefaultNegativeForModel('kling-3.0-pro'),
        videoPromptTemplate:
            '[Character A: creator — match reference character image exactly: face, hair, outfit]\n' +
            '[Product A: hero item — match reference product image exactly: shape, color, brand details]\n\n' +
            ANTI_SLOP_CONTINUITY + '\n\n' +
            'Master intent: unbox-to-try-on transition. 9:16 vertical. Same {{SCENE}} throughout. {{HOOK}}.\n\n' +
            'One continuous take. Character A sits in {{SCENE}} holding the closed box at waist level. Camera stays at a medium-close angle. ' +
            'Hands open the box — tissue lifts, Product A becomes visible. Character A lifts Product A with both hands, label facing camera. ' +
            'Elbows bend, Product A rises to chest height. One smooth motion from box to product display. ' +
            'Natural window light, single continuous frame, no cuts.',
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
            'Фотореалистичный POV кадр от передней камеры смартфона: камера направлена на лицо человека. ' +
            'В углу кадра видна часть телефона — объектив снимает лицо того, кто говорит. ' +
            '{{HOOK}} ' +
            'Человек — точная копия из референсного изображения 2 — крупным планом, ' +
            'товар из референсного изображения 1 виден рядом с лицом. ' +
            'Сцена: {{SCENE}}. ' +
            'Эффект передней камеры, лёгкое виньетирование, естественный свет, вертикальная 9:16. ' +
            'ВАЖНО: у человека ровно две руки — одна держит телефон, вторая держит товар. Без лишних рук.',
        defaultHook: 'Человек смотрит в объектив передней камеры, искренняя улыбка, товар поднесён к лицу.',
        defaultScene: 'комната с естественным дневным освещением, размытый фон',
        videoModel: 'kling-3.0-pro',
        negativePrompt: getDefaultNegativeForModel('kling-3.0-pro'),
        videoPromptTemplate:
            '[Character A: creator — match reference character image exactly: face, skin, hair, casual outfit]\n' +
            '[Product A: product — match reference product image exactly]\n\n' +
            'One continuous take, 9:16 vertical. POV from front-facing smartphone camera facing the speaker.\n\n' +
            'The frame shows the view from the front camera of a phone held at arm\'s length — ' +
            'Character A\'s face fills most of the frame. The edge of the phone body is visible in the corner. ' +
            'Character A looks directly at the front camera lens with an authentic expression. ' +
            'Product A enters frame from the side — Character A brings it next to their face. ' +
            'Background {{SCENE}} stays constant. Natural front-camera quality, slight vignette. ' +
            'No cuts, no angle changes. One continuous POV motion from eye contact to product display.',
        chips: ['Selfie', 'Хук', 'Сеттинг'],
        tileVariant: 'lime',
    },
    {
        id: 'before-after',
        title: 'До и После',
        subtitle: 'Трансформация результата в одном кадре',
        categories: ['all', 'ugc', 'commercial'],
        ...msPreviews('before-after', ['before-after', 'before-after-2', 'before-after-3']),
        promptTemplate:
            'Фотореалистичный крупный план лица: до и после нанесения косметического продукта. ' +
            '{{HOOK}} ' +
            'Человек из референсного изображения 2 — левая половина лица без макияжа, ' +
            'правая половина с продуктом (помада, тени, тональное). ' +
            'Товар из референсного изображения 1 виден в руке в правой половине. ' +
            'Сцена: {{SCENE}}. ' +
            'Одинаковое освещение по всему лицу, чёткая детализация макияжа, 9:16. ' +
            'ВАЖНО: у человека ровно две руки — одна наносит макияж, вторая держит продукт. Без лишних рук.',
        defaultHook: 'Женщина без макияжа в левой части лица — правая часть с нанесённой помадой, держит продукт в руке.',
        defaultScene: 'нейтральный светлый фон, равномерное дневное освещение',
        videoModel: 'kling-3.0-pro',
        negativePrompt: getDefaultNegativeForModel('kling-3.0-pro'),
        videoPromptTemplate:
            '[Character A: person — match reference character image exactly: face, skin, hair, bare makeup]\n' +
            '[Product A: makeup product — match reference product image exactly: packaging, color, applicator]\n\n' +
            'One continuous take, 9:16 vertical. Makeup transformation video.\n\n' +
            'Character A sits in {{SCENE}} facing the camera, initially without makeup (bare face). ' +
            'Two hands enter frame holding Product A — one hand opens the product, the other hand applies it to the lips. ' +
            'As the product touches the skin, the lips transform into a vibrant color. ' +
            'Character A\'s expression shifts from neutral to confident and satisfied. ' +
            'The camera stays in a close-up framing throughout. Same background, same lighting. ' +
            'No cuts, no split screen, no time split. One continuous application motion that reveals the transformation.',
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
            'Тёплый мягкий свет, тщательная детализация товара, атмосфера честного обзора, вертикальная 9:16. ' +
            'ВАЖНО: у человека ровно две руки. Без лишних рук.',
        defaultHook: 'Человек поворачивает товар, чтобы показать его со всех сторон — первая сторона, самая эффектная.',
        defaultScene: 'аккуратный стол с одним нейтральным аксессуаром, тёплое боковое освещение',
        videoModel: 'kling-3.0-pro',
        negativePrompt: getDefaultNegativeForModel('kling-3.0-pro'),
        videoPromptTemplate:
            '[Character A: reviewer — match reference character image exactly: face, casual outfit, seated posture]\n' +
            '[Product A: reviewed product — match reference product image exactly: all details preserved]\n\n' +
            ANTI_SLOP_CONTINUITY + '\n\n' +
            'Master intent: honest product review. 9:16 vertical. Warm. Credible.\n\n' +
            'One continuous take. Character A is seated at {{SCENE}} with Product A held in both hands at table height. ' +
            'Camera stays in a medium-close framing. ' +
            'Character A slowly rotates Product A in their hands — the label passes across the frame naturally. ' +
            'One finger traces a detail on the surface. ' +
            'Warm side light from frame-right across the product. Background {{SCENE}} unchanged throughout. ' +
            'No cuts. One continuous motion from product display to detail examination.',
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
            'Тёплое домашнее освещение, уютная атмосфера, вертикальная 9:16, фотореалистично. ' +
            'ВАЖНО: у каждого человека ровно две руки. Без лишних рук.',
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
            'One continuous take. Character A and B sit together on the sofa in {{SCENE}}, Product A between them ' +
            'held by Character A. Camera is in a medium wide shot. ' +
            'Character A shows Product A to Character B — both look at it together. ' +
            'Character B\'s face lights up with a genuine reaction. ' +
            'Camera slowly pushes in as Character A hands Product A to Character B. ' +
            'The background {{SCENE}} stays constant. Natural home ambient light. No cuts, no separate shots.',
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
            'Динамичная крупноплановая съёмка момента «ах вот в чём трюк», вертикальная 9:16. ' +
            'ВАЖНО: у человека ровно две руки. Без лишних рук.',
        defaultHook: 'Человек прикрывает рот рукой с выражением «я не должен это рассказывать», затем подмигивает.',
        defaultScene: 'кухня или рабочий стол, хорошее освещение, чистый фон',
        videoModel: 'kling-3.0-pro',
        negativePrompt: getDefaultNegativeForModel('kling-3.0-pro'),
        videoPromptTemplate:
            '[Character A: creator — match reference character image exactly: face, casual outfit]\n' +
            '[Product A: hero product — match reference product image exactly]\n\n' +
            ANTI_SLOP_CONTINUITY + '\n\n' +
            'Master intent: secret hack reveal. 9:16 vertical. {{HOOK}}.\n\n' +
            'One continuous take. Character A is in {{SCENE}}, leaning slightly toward the lens at a medium-close angle. ' +
            'Product A is already in their hands below frame, then rises naturally into view — ' +
            'both hands visible, label readable. Character A demonstrates the hack with deliberate finger motion ' +
            'on the product. Camera stays stable. Background {{SCENE}} unchanged. ' +
            'No cuts. One smooth motion from suspenseful reveal to product demonstration.',
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
            'Эффект погружения, широкоугольная линза, движение камеры, 9:16. ' +
            'ВАЖНО: видны только две руки. Без лишних рук.',
        defaultHook: 'Руки медленно поднимают товар к глазам, как будто зритель сам держит его впервые.',
        defaultScene: 'городская улица или кафе, яркий дневной свет, движение на фоне',
        videoModel: 'veo-3.1',
        negativePrompt: '',
        videoPromptTemplate:
            '[Character POV: first-person — match reference hand skin tone exactly]\n' +
            '[Product A: hero product — match reference product image exactly: label, packaging]\n\n' +
            ANTI_SLOP_HANDS + '\n\n' +
            'Master intent: immersive first-person POV. Viewer IS the character. 9:16 vertical. No face visible. {{HOOK}}.\n\n' +
            'One continuous POV take. Two hands rise into frame holding Product A — the {{SCENE}} is visible behind. ' +
            'Hands slowly rotate Product A so the label faces the lens, then bring it slightly closer for detail. ' +
            'A slight natural camera sway. The product stays in frame throughout. ' +
            'Same hands, same lighting, same background behind. No cuts.',
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
            'Фотореалистичное произведение искусства: классическая фреска или историческая картина, ' +
            'в которую вписан современный продукт. ' +
            '{{HOOK}} ' +
            'Товар из референсного изображения 1 аккуратно интегрирован в сцену из прошлого — ' +
            'его держит историческая фигура или он размещён среди античных предметов. ' +
            'Сцена: {{SCENE}}. ' +
            'Художественный стиль эпохи (фреска, масло, гравюра), вертикальная 9:16. ' +
            'ВАЖНО: у фигуры ровно две руки. Без лишних рук.',
        defaultHook: 'Древнеримская фреска: богиня или патриций держит современный продукт как священный артефакт.',
        defaultScene: 'античный храм или дворец, фресковый стиль, приглушённые землистые тона',
        videoModel: 'kling-3.0-pro',
        negativePrompt: getDefaultNegativeForModel('kling-3.0-pro'),
        videoPromptTemplate:
            '[Character A: figure from classical art — match reference character image exactly: face, styled as period figure]\n' +
            '[Product A: hero product — match reference product image exactly: shape, color, details]\n\n' +
            'One continuous take, 9:16 vertical. Classical painting aesthetic — fresco or oil painting style.\n\n' +
            'Scene opens on {{SCENE}} — a classical artwork. A figure dressed in period attire holds Product A ' +
            'as if it were a sacred or luxury object, naturally integrated into the scene. ' +
            'Camera slowly pushes in over 8 seconds. The product sits naturally in the figure\'s hands or beside them. ' +
            'Warm earthy palette, fresco texture, soft chiaroscuro lighting. ' +
            'No cuts, no style transitions. One continuous classical composition with modern product.',
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
            'Фотореалистичный кадр уборки: человек использует чистящее средство в комнате. ' +
            '{{HOOK}} ' +
            'Человек — точная копия из референсного изображения 2, ' +
            'товар — точная копия из референсного изображения 1, хорошо виден в руке. ' +
            'Сцена: {{SCENE}}. ' +
            'Яркий контраст до/после, насыщенные цвета, 9:16. ' +
            'ВАЖНО: у человека ровно две руки — одна держит средство, вторая свободна. Без лишних рук.',
        defaultHook: 'Человек выглядит измотанным и смотрит на беспорядок, затем подмигивает в камеру, держа товар.',
        defaultScene: 'кухня, ванная или рабочий стол — любое место, где применяется товар',
        videoModel: 'kling-3.0-pro',
        negativePrompt: getDefaultNegativeForModel('kling-3.0-pro'),
        videoPromptTemplate:
            '[Character A: person in casual home outfit — match reference character image exactly: face, hair, body]\n' +
            '[Product A: cleaning product — match reference product image exactly: bottle shape, label, color]\n\n' +
            ANTI_SLOP_CONTINUITY + '\n\n' +
            'Master intent: cleaning product demonstration. One continuous take, 9:16 vertical.\n\n' +
            'Character A stands in {{SCENE}} — a slightly messy room with clutter visible. They hold Product A in one hand, ' +
            'spray or apply it to the surface. As the product is used, the space visibly becomes cleaner — ' +
            'warm light fills the room. The camera stays fixed at medium-wide angle throughout. ' +
            'Same background, same framing. Only the cleanliness and lighting evolve. No cuts, no split screen, no before/after division.',
        chips: ['До/После', 'Хук', 'Сеттинг'],
        tileVariant: 'lime',
    },
    {
        id: 'gadget-saved-me',
        title: 'Этот гаджет спас меня',
        subtitle: 'Восторженная рекомендация — вирусный формат',
        categories: ['all', 'ugc', 'tiktok'],
        ...msPreviews('gadget-saved-me', ['gadget-1', 'gadget-2', 'gadget-3'], ['gadget-1', 'gadget-2', 'gadget-3']),
        promptTemplate:
            'Фотореалистичный вирусный кадр: человек с широко открытыми глазами и восторженной мимикой ' +
            'указывает на товар рядом с собой или держит его на уровне груди. ' +
            '{{HOOK}} ' +
            'Человек — точная копия из референсного изображения 2; ' +
            'товар — точная копия из референсного изображения 1, логотип и форма чётко различимы. ' +
            'Сцена: {{SCENE}}. ' +
            'Яркие насыщенные цвета, высокий контраст, энергичная атмосфера TikTok, вертикальная 9:16. ' +
            'ВАЖНО: у человека ровно две руки. Без лишних рук.',
        defaultHook: 'Человек делает большие удивлённые глаза и открывает рот, как будто только что обнаружил нечто невероятное.',
        defaultScene: 'современная кухня или рабочее место, яркий дневной свет, чистый фон',
        videoModel: 'kling-3.0-pro',
        negativePrompt: getDefaultNegativeForModel('kling-3.0-pro'),
        videoPromptTemplate:
            '[Character A: energetic creator — match reference character image exactly: face, outfit, body language]\n' +
            '[Product A: hero product — match reference product image exactly: logo, shape, color]\n\n' +
            ANTI_SLOP_CONTINUITY + '\n\n' +
            'Master intent: product discovery moment. 9:16 vertical. {{HOOK}}.\n\n' +
            'One continuous take. Character A stands in {{SCENE}}, Product A already in their hands at chest height. ' +
            'Camera is at a medium-close angle throughout. ' +
            'Character A looks at Product A with an expression of pleasant surprise, then lifts it slightly toward the lens — ' +
            'both hands visible, label readable. Background {{SCENE}} constant. ' +
            'Natural lighting unchanged. One smooth motion from discovery expression to product display. No cuts.',
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
