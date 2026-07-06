export type ImageToolId = 'upscale' | 'recolor' | 'restore' | 'remove-bg';

export interface ImageToolBgTypeOption {
    id: string;
    label: string;
}

export interface ImageToolConfig {
    id: ImageToolId;
    title: string;
    description: string;
    actionLabel: string;
    downloadPrefix: string;
    historyTag: string;
    source: ImageToolId;
    cost: number;
    demoBefore: string;
    demoAfter: string;
    showRecolorInput?: boolean;
    /** Segmented control (e.g. background type for Remove BG) shown once an image is loaded. */
    bgTypeOptions?: ImageToolBgTypeOption[];
    /** When true, the empty state shows a single static demo image instead of a before/after slider. */
    singleDemo?: boolean;
    buildPrompt: (note?: string) => string;
}

export const UPSCALE_TOOL: ImageToolConfig = {
    id: 'upscale',
    title: 'Upscale',
    description: 'Загрузите изображение — повысьте разрешение и качество с помощью ИИ.',
    actionLabel: 'Улучшить',
    downloadPrefix: 'upscale',
    historyTag: '[UPSCALE]',
    source: 'upscale',
    cost: 20,
    demoBefore: '/upscale-demo-before.png',
    demoAfter: '/upscale-demo-after.png',
    buildPrompt: () =>
        'Upscale this image to 4K resolution. Enhance details, sharpen textures, remove noise, and improve lighting while keeping the original content exactly the same. Photorealistic high quality.',
};

export const RECOLOR_TOOL: ImageToolConfig = {
    id: 'recolor',
    title: 'Палитра',
    description: 'Выберите moodboard-пресет и перекрасьте фото в его стиле.',
    actionLabel: 'Перекрасить',
    downloadPrefix: 'recolor',
    historyTag: '[RECOLOR]',
    source: 'recolor',
    cost: 20,
    demoBefore: '/landing/kids-before.webp',
    demoAfter: '/landing/kids-after.webp',
    showRecolorInput: true,
    buildPrompt: (note) =>
        `Keep the image composition exactly the same, but recolor it based on this instruction: ${note || 'Vibrant colors'}. High quality, photorealistic.`,
};

export const RESTORE_TOOL: ImageToolConfig = {
    id: 'restore',
    title: 'Реставрация',
    description: 'Загрузите старое или повреждённое фото — восстановите чёткость и детали.',
    actionLabel: 'Восстановить',
    downloadPrefix: 'restore',
    historyTag: '[RESTORE]',
    source: 'restore',
    cost: 20,
    demoBefore: '/restore-demo-before.png',
    demoAfter: '/restore-demo-after.png',
    buildPrompt: () =>
        'Restore this old photo. Remove scratches, fix tears, improve clarity and face details. Make it look like a modern high-resolution photo.',
};

const REMOVE_BG_PROMPTS: Record<string, string> = {
    white: 'Isolate the main subject of this image on a pure solid white background. Product photography style. High quality, sharp edges.',
    green: 'Isolate the main subject on a solid bright green screen background for chroma key. High quality.',
    studio: 'Place the main subject of this image in a professional dark grey studio background with soft rim lighting. Product photography.',
};

export const REMOVE_BG_TOOL: ImageToolConfig = {
    id: 'remove-bg',
    title: 'Удаление Фона',
    description: 'Изолируйте объект от фона — идеально для карточек товаров и коллажей.',
    actionLabel: 'Удалить фон',
    downloadPrefix: 'removebg',
    historyTag: '[REMOVE_BG]',
    source: 'remove-bg',
    cost: 15,
    demoBefore: '/removebg-demo-cat.png',
    demoAfter: '/removebg-demo-cat.png',
    singleDemo: true,
    bgTypeOptions: [
        { id: 'white', label: 'Белый фон' },
        { id: 'green', label: 'Хромакей' },
        { id: 'studio', label: 'Студия' },
    ],
    buildPrompt: (bgType) => REMOVE_BG_PROMPTS[bgType || 'white'] ?? REMOVE_BG_PROMPTS.white,
};

export const IMAGE_TOOLS: ImageToolConfig[] = [UPSCALE_TOOL, RECOLOR_TOOL, RESTORE_TOOL, REMOVE_BG_TOOL];

export function getImageToolConfig(id: ImageToolId): ImageToolConfig {
    return IMAGE_TOOLS.find(t => t.id === id) ?? UPSCALE_TOOL;
}
