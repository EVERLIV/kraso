export type ImageToolId = 'upscale' | 'recolor' | 'restore';

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
    buildPrompt: (recolorNote?: string) => string;
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
    demoBefore: '/landing/family-before.webp',
    demoAfter: '/landing/family-after.webp',
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
    demoBefore: '/landing/docs-before.webp',
    demoAfter: '/landing/docs-after.webp',
    buildPrompt: () =>
        'Restore this old photo. Remove scratches, fix tears, improve clarity and face details. Make it look like a modern high-resolution photo.',
};

export const IMAGE_TOOLS: ImageToolConfig[] = [UPSCALE_TOOL, RECOLOR_TOOL, RESTORE_TOOL];

export function getImageToolConfig(id: ImageToolId): ImageToolConfig {
    return IMAGE_TOOLS.find(t => t.id === id) ?? UPSCALE_TOOL;
}
