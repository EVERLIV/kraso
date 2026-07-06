export type PickerType = 'hook' | 'setting' | 'style';

export interface PickerItem {
    id: string;
    title: string;
    description: string;
    /**
     * For hook/setting pickers: a short phrase intended to be embedded in the
     * middle of a sentence via {{HOOK}} / {{SCENE}} substitution.
     * No leading capital, no trailing period.
     */
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
    heroImages: [p('hook', 'spicy'), p('hook', 'interview'), p('hook', 'whisper')],
    items: [
        {
            id: 'spicy',
            title: 'Острый кадр',
            description: 'Экстремальный крупный план ключицы и шеи — интригующий первый кадр.',
            prompt: 'экстремальный крупный план ключицы и шеи, мягкий рассеянный свет, интригующий первый кадр',
            image: p('hook', 'spicy'),
            category: 'subtle',
        },
        {
            id: 'interview',
            title: 'Интервью',
            description: 'Человек смотрит в камеру и говорит «подождите, это реально работает».',
            prompt: 'человек смотрит прямо в камеру смартфона с удивлёнными глазами, открытый рот, доверительный UGC-тон, крупный план лица',
            image: p('hook', 'interview'),
            category: 'subtle',
        },
        {
            id: 'crash',
            title: 'Товар в кадре',
            description: 'Товар резко появляется в руках — мгновенное внимание.',
            prompt: 'товар резко появляется в кадре на столе или в руках, динамичный вход, быстрый зум',
            image: p('hook', 'crash'),
            category: 'stunt',
        },
        {
            id: 'whisper',
            title: 'Шёпот ASMR',
            description: 'Человек шепчет «смотри, что пришло» — идеально для распаковки.',
            prompt: 'человек шепчет в камеру «смотри, что пришло», ASMR-атмосфера, близкий микрофон, интимный первый кадр',
            image: p('hook', 'whisper'),
            category: 'subtle',
        },
        {
            id: 'point',
            title: 'Указывает на товар',
            description: 'Уверенный жест — палец указывает на товар рядом с лицом.',
            prompt: 'человек указывает пальцем на товар рядом с собой, широко открытые глаза, восторженная мимика',
            image: p('hook', 'point'),
            category: 'stunt',
        },
        {
            id: 'double-take',
            title: 'Double Take',
            description: 'Реакция «не может поверить глазам своим».',
            prompt: 'человек делает двойной взгляд на товар — сначала мимо, потом резко назад с удивлённым лицом',
            image: p('hook', 'double-take'),
            category: 'stunt',
        },
    ],
};

export const SETTING_PICKER: PickerConfig = {
    type: 'setting',
    title: 'Сеттинг',
    headline: 'Сеттинг, который задаёт атмосферу',
    subtitle: 'Локация и освещение определяют настроение ролика. Выберите окружение для вашего товара.',
    filters: [
        { id: 'all', label: 'Все' },
        { id: 'realistic', label: 'Реалистичные' },
        { id: 'unrealistic', label: 'Сюрреалистичные' },
    ],
    heroImages: [p('setting', 'bedroom'), p('setting', 'airplane'), p('setting', 'loft')],
    items: [
        {
            id: 'bedroom',
            title: 'Спальня',
            description: 'Уютная спальня — домашний UGC без студийного ощущения.',
            prompt: 'уютная спальня, мягкий утренний свет из окна, постельные подушки на фоне, домашний UGC-стиль',
            image: p('setting', 'bedroom'),
            category: 'realistic',
        },
        {
            id: 'airplane',
            title: 'Крыло самолёта',
            description: 'Драматичный закат за иллюминатором — премиальный lifestyle.',
            prompt: 'вид из иллюминатора самолёта на закатное небо, тёплые оранжевые оттенки, кинематографичный lifestyle',
            image: p('setting', 'airplane'),
            category: 'realistic',
        },
        {
            id: 'loft',
            title: 'Яркий лофт',
            description: 'Цветной лофт с постерами — молодёжная TikTok-эстетика.',
            prompt: 'яркий лофт с цветными постерами на стенах, насыщенные цвета, молодёжная TikTok-эстетика',
            image: p('setting', 'loft'),
            category: 'realistic',
        },
        {
            id: 'kitchen',
            title: 'Современная кухня',
            description: 'Чистая светлая кухня — лучший фон для товаров FMCG.',
            prompt: 'современная светлая кухня, белые столешницы, мягкий дневной свет из окна, чистая минималистичная атмосфера',
            image: p('setting', 'kitchen'),
            category: 'realistic',
        },
        {
            id: 'studio-white',
            title: 'Белая студия',
            description: 'Минималистичный белый фон — товар в центре внимания.',
            prompt: 'чистый белый студийный фон, мягкий рассеянный свет, нет теней, профессиональная продуктовая съёмка',
            image: p('setting', 'studio-white'),
            category: 'realistic',
        },
        {
            id: 'volcano',
            title: 'Вулкан',
            description: 'Сюрреалистичный фон с дымящимся вулканом — wow-эффект.',
            prompt: 'сюрреалистичная сцена с дымящимся вулканом на фоне, драматичное небо, scroll-stopping визуал',
            image: p('setting', 'volcano'),
            category: 'unrealistic',
        },
    ],
};

export const STYLE_PICKER: PickerConfig = {
    type: 'style',
    title: 'Стиль',
    headline: 'Выберите стиль, который цепляет',
    subtitle: 'От UGC до вирусных обзоров — выберите формат, который работает для вашего товара.',
    filters: [
        { id: 'all', label: 'Все' },
        { id: 'tiktok', label: 'TikTok', badge: 'NEW' },
        { id: 'ugc', label: 'UGC' },
        { id: 'commercial', label: 'Коммерческое' },
    ],
    heroImages: [p('style', 'ugc-bathroom'), p('style', 'gadget'), p('style', 'giant')],
    items: [
        {
            id: 'ugc',
            title: 'UGC — Соцсети',
            description: 'Реалистичное видео от лица обычного пользователя.',
            prompt: 'ugc',
            image: p('style', 'ugc-bathroom'),
            category: 'ugc',
        },
        {
            id: 'unboxing-asmr',
            title: 'Распаковка ASMR',
            description: 'Тихая распаковка с крупным планом рук.',
            prompt: 'unboxing-asmr',
            image: p('style', 'unboxing-asmr'),
            category: 'tiktok',
        },
        {
            id: 'unboxing-tryon',
            title: 'Распаковка и Примерка',
            description: 'Распаковка и мгновенная примерка в одном кадре.',
            prompt: 'unboxing-tryon',
            image: p('style', 'unboxing-tryon'),
            category: 'tiktok',
        },
        {
            id: 'selfie-testimonial',
            title: 'Selfie Testimonial',
            description: 'Честный отзыв в стиле селфи.',
            prompt: 'selfie-testimonial',
            image: p('style', 'selfie-testimonial'),
            category: 'ugc',
        },
        {
            id: 'direct-to-camera',
            title: 'Direct to Camera',
            description: 'Уверенная подача прямо в объектив.',
            prompt: 'direct-to-camera',
            image: p('style', 'direct-to-camera'),
            category: 'ugc',
        },
        {
            id: 'before-after',
            title: 'До и После',
            description: 'Трансформация результата в одном кадре.',
            prompt: 'before-after',
            image: p('style', 'before-after'),
            category: 'commercial',
        },
        {
            id: 'product-review',
            title: 'Обзор Товара',
            description: 'Детальная демонстрация с вовлечённым разбором.',
            prompt: 'product-review',
            image: p('style', 'product-review'),
            category: 'tiktok',
        },
        {
            id: 'gadget-saved-me',
            title: 'Этот гаджет спас меня',
            description: 'Восторженная рекомендация — вирусный формат.',
            prompt: 'gadget-saved-me',
            image: p('style', 'gadget'),
            category: 'tiktok',
        },
    ],
};

export const PICKER_BY_TYPE: Record<PickerType, PickerConfig> = {
    hook: HOOK_PICKER,
    setting: SETTING_PICKER,
    style: STYLE_PICKER,
};

/** Chips shown in the composer — clicking opens the corresponding picker */
export const COMPOSER_CHIP_DEFS = [
    { id: 'style', label: 'Распаковка ASMR', picker: 'style' as PickerType },
    { id: 'hook', label: 'Хук', picker: 'hook' as PickerType },
    { id: 'setting', label: 'Сеттинг', picker: 'setting' as PickerType },
] as const;

export type ComposerChipId = typeof COMPOSER_CHIP_DEFS[number]['id'];

export const PICKER_FALLBACK = '/marketing/pickers/style/ugc-bathroom.png';
