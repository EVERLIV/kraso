export type MarketingFilter = 'all' | 'tiktok' | 'ugc' | 'commercial';

export type MsTileVariant = 'lime' | 'pink' | 'blue' | 'purple' | 'amber';

export interface MarketingTemplate {
    id: string;
    title: string;
    subtitle: string;
    categories: MarketingFilter[];
    previews: [string, string, string];
    prompt: string;
    chips: string[];
    tileVariant: MsTileVariant;
}

const v = (name: string) => `/marketing/videos/${name}.mp4`;
const t = (name: string) => `/templates/${name}.webp`;

export const MARKETING_TEMPLATES: MarketingTemplate[] = [
    {
        id: 'giant-figure',
        title: 'Гигантская фигура',
        subtitle: 'Огромный товар — останавливает скролл',
        categories: ['all', 'commercial', 'tiktok'],
        previews: [t('market-tech-neon'), t('market-shopee-hero'), t('market-eco-podium')],
        prompt: 'Гигантская фигура с товаром в городской среде: огромный продукт рядом с людьми, кинематографичный масштаб, вертикальный 9:16, эффект wow для соцсетей.',
        chips: ['Гигант', 'Хук', 'Сеттинг'],
        tileVariant: 'blue',
    },
    {
        id: 'unboxing-tryon',
        title: 'Распаковка и виртуальная примерка',
        subtitle: 'Распаковка и примерка в одном кадре',
        categories: ['all', 'ugc', 'tiktok'],
        previews: [t('market-cosmetics-lux'), t('market-fashion-studio'), t('fashion-cyber')],
        prompt: 'UGC-ролик: креатор распаковывает товар и сразу примеряет/использует его, естественный свет, вертикальный 9:16, реалистичная эстетика смартфона.',
        chips: ['Распаковка', 'Хук', 'Примерка'],
        tileVariant: 'pink',
    },
    {
        id: 'unboxing-asmr',
        title: 'Распаковка ASMR',
        subtitle: 'Распаковка товара в стиле ASMR',
        categories: ['all', 'tiktok', 'ugc'],
        previews: [t('market-kitchen'), t('market-glassmorphism'), t('market-black-friday')],
        prompt: 'Аутентичная ASMR-распаковка на iPhone: спокойный креатор 20+ лет сидит за столом в ярком лофте, шепчет в микрофон, крупный план рук, мягкий свет, вертикальный 9:16.',
        chips: ['Распаковка ASMR', 'Хук', 'Сеттинг'],
        tileVariant: 'amber',
    },
    {
        id: 'ugc-social',
        title: 'UGC для соцсетей',
        subtitle: 'Реалистичные видео от креатора',
        categories: ['all', 'ugc', 'tiktok'],
        previews: [v('ugc-1'), v('ugc-2'), v('ugc-3')],
        prompt: 'Аутентичная UGC-реклама: креатор демонстрирует товар дома, мягкий дневной свет, вертикальный 9:16, реалистичная эстетика смартфонного видео.',
        chips: ['UGC', 'Хук', 'Лайфстайл'],
        tileVariant: 'blue',
    },
    {
        id: 'gadget-review',
        title: 'Этот гаджет спас меня',
        subtitle: 'Рекомендация с демонстрацией товара',
        categories: ['all', 'ugc', 'tiktok'],
        previews: [v('gadget-1'), v('gadget-2'), v('gadget-3')],
        prompt: 'Креатор рекомендует гаджет: демонстрирует функции, восторженная мимика, чистый современный фон, вертикальный рекламный формат.',
        chips: ['Обзор', 'Хук', 'Демо'],
        tileVariant: 'purple',
    },
    {
        id: 'marketplace-card',
        title: 'Карточка маркетплейса',
        subtitle: 'Ozon / Wildberries — hero shot',
        categories: ['all', 'commercial'],
        previews: [t('market-tech-neon'), t('market-eco-podium'), t('market-glassmorphism')],
        prompt: 'Профессиональная карточка маркетплейса: товар на чистом белом фоне, чёткие детали, место для промо-бейджа, e-commerce hero shot.',
        chips: ['Товар', 'Бейдж', 'Студия'],
        tileVariant: 'lime',
    },
];

export const MARKETING_FILTERS: { id: MarketingFilter; label: string; badge?: string }[] = [
    { id: 'all', label: 'Все' },
    { id: 'tiktok', label: 'TikTok', badge: 'NEW' },
    { id: 'ugc', label: 'UGC' },
    { id: 'commercial', label: 'Коммерческое' },
];

export const DEFAULT_MARKETING_PROMPT =
    'Аутентичная ASMR-распаковка на iPhone: спокойный креатор 20+ лет с тёмными волнистыми волосами в оверсайз-футболке сидит за столом в ярком лофте, шепчет в настольный микрофон, крупный план рук, мягкий свет, вертикальный 9:16.';

export const DEFAULT_MARKETING_CHIPS = ['Распаковка ASMR', 'Хук', 'Сеттинг'];

export const MARKETING_GEN_COST = 100;
export const MARKETING_GEN_COST_OLD = 150;
