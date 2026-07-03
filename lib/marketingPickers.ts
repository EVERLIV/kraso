export type PickerType = 'hook' | 'setting' | 'style';

export interface PickerItem {
    id: string;
    title: string;
    description: string;
    prompt: string;
    image: string;
    category: string;
}

export interface PickerConfig {
    type: PickerType;
    title: string;
    headline: string;
    subtitle: string;
    filters: { id: string; label: string; badge?: string }[];
    heroImages: [string, string, string];
    items: PickerItem[];
}

const p = (folder: string, name: string) => `/marketing/pickers/${folder}/${name}.png`;
const t = (name: string) => `/templates/${name}.webp`;

export const HOOK_PICKER: PickerConfig = {
    type: 'hook',
    title: 'Хук',
    headline: 'Хуки, которые останавливают скролл',
    subtitle: 'Первые 3 секунды решают — посмотрят рекламу или пролистнут. Выберите проверенное начало.',
    filters: [
        { id: 'all', label: 'Все' },
        { id: 'stunt', label: 'Эффектные' },
        { id: 'subtle', label: 'Тонкие' },
    ],
    heroImages: [p('hook', 'hero-1'), p('hook', 'hero-2'), p('hook', 'hero-3')],
    items: [
        {
            id: 'spicy',
            title: 'Острый кадр',
            description: 'Экстремальный крупный план ключицы и шеи, мягкий свет, интригующий первый кадр.',
            prompt: 'Экстремальный крупный план ключицы и шеи, мягкий рассеянный свет, интригующий первый кадр UGC-рекламы, вертикальный 9:16.',
            image: p('hook', 'spicy'),
            category: 'subtle',
        },
        {
            id: 'interview',
            title: 'Интервью',
            description: 'Креатор смотрит в камеру и говорит «подождите, это реально работает» — доверительный тон.',
            prompt: 'Креатор смотрит прямо в камеру смартфона и говорит с удивлением, доверительный UGC-тон, крупный план лица, вертикальный 9:16.',
            image: p('hook', 'interview'),
            category: 'subtle',
        },
        {
            id: 'crash',
            title: 'Товар в кадре',
            description: 'Резкий вход: товар падает на стол или появляется в руках — мгновенное внимание.',
            prompt: 'Динамичный вход: товар резко появляется в кадре на столе, быстрый зум, энергичный хук для TikTok, вертикальный 9:16.',
            image: p('hook', 'crash'),
            category: 'stunt',
        },
        {
            id: 'whisper',
            title: 'Шёпот ASMR',
            description: 'Креатор шепчет «смотри, что пришло» — идеально для распаковки.',
            prompt: 'Креатор шепчет в камеру «смотри, что пришло», ASMR-атмосфера, близкий микрофон, интимный первый кадр, вертикальный 9:16.',
            image: p('hook', 'whisper'),
            category: 'subtle',
        },
    ],
};

export const SETTING_PICKER: PickerConfig = {
    type: 'setting',
    title: 'Настройки',
    headline: 'Настройки, которые задают сцену',
    subtitle: 'Локация и атмосфера определяют настроение ролика. Выберите окружение для вашего товара.',
    filters: [
        { id: 'all', label: 'Все' },
        { id: 'realistic', label: 'Реалистичные' },
        { id: 'unrealistic', label: 'Сюрреалистичные' },
    ],
    heroImages: [p('setting', 'hero-1'), p('setting', 'hero-2'), p('setting', 'hero-3')],
    items: [
        {
            id: 'bedroom',
            title: 'Спальня',
            description: 'На кровати или с подушками — уютный домашний UGC без студийного ощущения.',
            prompt: 'Уютная спальня: креатор на кровати с подушками, мягкий утренний свет из окна, домашний UGC-стиль, вертикальный 9:16.',
            image: p('setting', 'bedroom'),
            category: 'realistic',
        },
        {
            id: 'airplane',
            title: 'Крыло самолёта',
            description: 'Драматичный закат за иллюминатором — премиальный lifestyle-кадр.',
            prompt: 'Вид из иллюминатора самолёта на закатное небо, креатор держит товар у окна, кинематографичный lifestyle, вертикальный 9:16.',
            image: p('setting', 'airplane'),
            category: 'realistic',
        },
        {
            id: 'loft',
            title: 'Яркий лофт',
            description: 'Цветной лофт с постерами — энергичная молодёжная эстетика.',
            prompt: 'Яркий лофт с цветными постерами на стенах, креатор за столом, насыщенные цвета, молодёжная эстетика TikTok, вертикальный 9:16.',
            image: p('setting', 'loft'),
            category: 'realistic',
        },
        {
            id: 'volcano',
            title: 'Вулкан',
            description: 'Сюрреалистичный фон с дымящимся вулканом — wow-эффект для соцсетей.',
            prompt: 'Сюрреалистичная сцена: креатор на фоне дымящегося вулкана, драматичное небо, scroll-stopping визуал, вертикальный 9:16.',
            image: p('setting', 'volcano'),
            category: 'unrealistic',
        },
    ],
};

export const STYLE_PICKER: PickerConfig = {
    type: 'style',
    title: 'Стиль',
    headline: 'Выберите стиль, который цепляет',
    subtitle: 'От распаковки до UGC — выберите тип видео, который подходит вашему товару и аудитории.',
    filters: [
        { id: 'all', label: 'Все' },
        { id: 'tiktok', label: 'TikTok', badge: 'NEW' },
        { id: 'ugc', label: 'UGC' },
        { id: 'commercial', label: 'Коммерческое' },
    ],
    heroImages: [p('style', 'hero-1'), p('style', 'hero-2'), p('style', 'hero-3')],
    items: [
        {
            id: 'unboxing-asmr',
            title: 'Распаковка ASMR',
            description: 'Аутентичная тихая распаковка с шёпотом и крупными планами рук.',
            prompt: 'Аутентичная ASMR-распаковка: спокойный креатор шепчет в микрофон, крупный план рук, мягкий свет, вертикальный 9:16.',
            image: p('style', 'unboxing-asmr'),
            category: 'tiktok',
        },
        {
            id: 'ugc-bathroom',
            title: 'UGC в ванной',
            description: 'Реалистичное видео для соцсетей — креатор в домашней обстановке.',
            prompt: 'Реалистичное UGC-видео: креатор в ванной комнате демонстрирует косметику, естественный свет, смартфонная эстетика, вертикальный 9:16.',
            image: p('style', 'ugc-bathroom'),
            category: 'ugc',
        },
        {
            id: 'gadget-saved',
            title: 'Этот гаджет спас меня',
            description: 'Креатор с энтузиазмом рекомендует товар — формат вирусного обзора.',
            prompt: 'Креатор с восторгом демонстрирует гаджет, энергичная рекомендация, чистый фон, вирусный формат обзора, вертикальный 9:16.',
            image: p('style', 'gadget'),
            category: 'tiktok',
        },
        {
            id: 'giant-figure',
            title: 'Гигантская фигура',
            description: 'Огромный товар рядом с человеком — останавливает скролл.',
            prompt: 'Гигантская фигура товара рядом с человеком в городе, кинематографичный масштаб, коммерческий wow-кадр, вертикальный 9:16.',
            image: p('style', 'giant'),
            category: 'commercial',
        },
    ],
};

export const PICKER_BY_TYPE: Record<PickerType, PickerConfig> = {
    hook: HOOK_PICKER,
    setting: SETTING_PICKER,
    style: STYLE_PICKER,
};

/** Чипы композера — клик открывает попап */
export const COMPOSER_CHIP_DEFS = [
    { id: 'style', label: 'Распаковка ASMR', picker: 'style' as PickerType },
    { id: 'hook', label: 'Хук', picker: 'hook' as PickerType },
    { id: 'setting', label: 'Сеттинг', picker: 'setting' as PickerType },
] as const;

export type ComposerChipId = typeof COMPOSER_CHIP_DEFS[number]['id'];

export const PICKER_FALLBACK = t('market-tech-neon');
