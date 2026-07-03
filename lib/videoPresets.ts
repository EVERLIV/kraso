export interface VideoMotionPreset {
    id: string;
    title: string;
    description: string;
    prompt: string;
    category: 'viral' | 'cinematic' | 'emotional' | 'social';
    thumb?: string;
}

/** Motion presets — shared by Shorts Studio, Video studio, and Telegram bot. */
export const VIDEO_MOTION_PRESETS: VideoMotionPreset[] = [
    {
        id: 'animate_default',
        title: 'Лёгкое движение',
        description: 'Плавная естественная анимация',
        prompt: 'Animate this image with smooth, natural movement. Subtle motion.',
        category: 'cinematic',
    },
    {
        id: 'animate_wind',
        title: 'Ветер в волосах',
        description: 'Ветер, кинематографично',
        prompt: 'Gentle wind moving through hair and clothes. Natural, cinematic.',
        category: 'cinematic',
        thumb: '/templates/fashion-cyber.webp',
    },
    {
        id: 'animate_zoom',
        title: 'Камера наезд',
        description: 'Плавный zoom к объекту',
        prompt: 'Smooth camera zoom in toward the subject. Cinematic, professional.',
        category: 'cinematic',
    },
    {
        id: 'animate_hug',
        title: 'Улыбка и объятие',
        description: 'Тёплая эмоциональная сцена',
        prompt: 'Person smiling warmly and giving a gentle hug. Heartwarming, natural movement. Cinematic, emotional.',
        category: 'emotional',
    },
    {
        id: 'red_carpet',
        title: 'Красная дорожка',
        description: 'Гламур, вспышки камер',
        prompt: 'Red carpet premiere atmosphere. Camera flashes, slow confident walk, glamorous cinematic lighting.',
        category: 'viral',
        thumb: '/templates/business-startup.webp',
    },
    {
        id: 'snow_moscow',
        title: 'Снежная Москва',
        description: 'Зимний город, снегопад',
        prompt: 'Snow falling gently in a Moscow winter street. Soft bokeh lights, cozy cinematic mood.',
        category: 'viral',
        thumb: '/templates/retro-polaroid-classic.webp',
    },
    {
        id: 'summer_dacha',
        title: 'Лето на даче',
        description: 'Солнечный отдых, природа',
        prompt: 'Sunny summer dacha vibes. Warm golden hour light, gentle breeze, peaceful countryside.',
        category: 'viral',
    },
    {
        id: 'neon_tokyo',
        title: 'Неон Токио',
        description: 'Киберпанк, неоновые огни',
        prompt: 'Neon Tokyo night street. Vibrant cyberpunk lights reflecting, cinematic rain atmosphere.',
        category: 'viral',
        thumb: '/templates/market-tech-neon.webp',
    },
    {
        id: 'wedding_clip',
        title: 'Свадебный клип',
        description: 'Романтика, slow motion',
        prompt: 'Wedding cinematic slow motion. Soft romantic lighting, dreamy atmosphere, elegant movement.',
        category: 'emotional',
        thumb: '/templates/family-addams.webp',
    },
    {
        id: 'slow_reveal',
        title: 'Zoom out reveal',
        description: 'Открытие сцены',
        prompt: 'Smooth camera zoom out revealing the full scene. Dramatic cinematic reveal.',
        category: 'social',
    },
];

export function getVideoPreset(id: string): VideoMotionPreset | undefined {
    return VIDEO_MOTION_PRESETS.find(p => p.id === id);
}
