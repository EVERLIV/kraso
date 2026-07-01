// Единый справочник размеров фото на документы (визы, паспорта, онлайн-заявки).
// Используется на сайте и синхронизируется с functions/documentSpecs.json для бота.
// Размеры — реальные официальные требования. Промпт сохраняет лицо пользователя
// и приводит фон/кадрирование/выражение к требованиям конкретного документа.

export interface DocumentSpec {
    id: string;
    country: string;      // страна / регион
    flag: string;         // эмодзи-флаг для UI
    title: string;        // отображаемое название
    sizeMm: string;       // физический размер
    sizePx: string;       // рекомендуемое разрешение
    aspectRatio: string;  // official ratio (may be non-standard, e.g. 5:7); generation falls back to nearest supported
    bg: 'white' | 'light-grey' | 'off-white' | 'light-blue';
    hint: string;         // краткая подсказка пользователю
    prompt: string;       // промпт генерации
}

// Базовый шаблон промпта — единый стиль, различаются фон/формат/требования.
const p = (extra: string, bg = 'plain solid white background') =>
    `Official document ID photo. Keep the exact same person and face identity from the input image. Face strictly frontal, looking directly at camera, neutral expression, mouth closed, both eyes open, no smile. ${bg}, evenly lit, no shadows, no red-eye. Head and shoulders only, centered. No hats or head coverings (unless religious), no glasses, no reflections. Sharp focus, high resolution, photorealistic, print quality 300 dpi. ${extra}`;

export const DOCUMENT_SPECS: DocumentSpec[] = [
    // ——— Паспорта / внутренние документы ———
    { id: 'ru-passport', country: 'Россия', flag: '🇷🇺', title: 'Загранпаспорт РФ', sizeMm: '35×45 мм', sizePx: '413×531 px (300 dpi)', aspectRatio: '3:4', bg: 'white', hint: 'Белый фон, лицо 70–80% кадра, анфас, без очков и головных уборов.', prompt: p('Russian international passport standard, face occupies 70-80% of the frame, plain white background.') },
    { id: 'ru-internal', country: 'Россия', flag: '🇷🇺', title: 'Паспорт РФ (внутренний)', sizeMm: '35×45 мм', sizePx: '413×531 px', aspectRatio: '3:4', bg: 'white', hint: 'Белый фон, овал лица чёткий, деловой вид.', prompt: p('Russian internal passport photo, plain white background, formal look.') },
    { id: 'ru-medical', country: 'Россия', flag: '🇷🇺', title: 'Медкнижка / справка РФ', sizeMm: '30×40 мм', sizePx: '354×472 px', aspectRatio: '3:4', bg: 'white', hint: 'Матовый белый фон, допускается лёгкая улыбка.', prompt: p('Russian medical record photo 30x40mm, plain white background.') },

    // ——— Шенген / Европа ———
    { id: 'schengen', country: 'Шенген (ЕС)', flag: '🇪🇺', title: 'Виза Шенген', sizeMm: '35×45 мм', sizePx: '826×1062 px', aspectRatio: '3:4', bg: 'light-grey', hint: 'Светло-серый или белый фон, лицо 70–80%, тёмная одежда.', prompt: p('EU Schengen visa standard, face 70-80% of height, dark plain clothing.', 'plain light grey or white background') },
    { id: 'uk', country: 'Великобритания', flag: '🇬🇧', title: 'Виза/паспорт UK', sizeMm: '35×45 мм', sizePx: '600×750 px', aspectRatio: '3:4', bg: 'light-grey', hint: 'Светло-серый/кремовый фон, нейтральное выражение.', prompt: p('UK passport and visa standard, light grey or cream background, neutral expression.', 'plain light grey background') },
    { id: 'germany', country: 'Германия', flag: '🇩🇪', title: 'Виза/паспорт Германия', sizeMm: '35×45 мм', sizePx: '826×1062 px', aspectRatio: '3:4', bg: 'light-grey', hint: 'Светло-серый фон, биометрический стандарт.', prompt: p('German biometric passport standard, light grey background.', 'plain light grey background') },
    { id: 'france', country: 'Франция', flag: '🇫🇷', title: 'Виза/паспорт Франция', sizeMm: '35×45 мм', sizePx: '826×1062 px', aspectRatio: '3:4', bg: 'light-grey', hint: 'Светло-серый фон, нейтральное выражение.', prompt: p('French passport standard, light grey background.', 'plain light grey background') },
    { id: 'italy', country: 'Италия', flag: '🇮🇹', title: 'Виза/паспорт Италия', sizeMm: '35×45 мм', sizePx: '826×1062 px', aspectRatio: '3:4', bg: 'white', hint: 'Белый фон, лицо по центру.', prompt: p('Italian passport and Schengen visa standard, white background.') },
    { id: 'spain', country: 'Испания', flag: '🇪🇸', title: 'Виза/паспорт Испания', sizeMm: '32×26 мм голова / 35×45', sizePx: '826×1062 px', aspectRatio: '3:4', bg: 'white', hint: 'Белый фон, голова крупно.', prompt: p('Spanish passport and Schengen visa standard, white background.') },
    { id: 'poland', country: 'Польша', flag: '🇵🇱', title: 'Виза/паспорт Польша', sizeMm: '35×45 мм', sizePx: '492×633 px', aspectRatio: '3:4', bg: 'light-grey', hint: 'Светло-серый фон, лицо 70–80%.', prompt: p('Polish passport standard, light grey background.', 'plain light grey background') },
    { id: 'greece', country: 'Греция', flag: '🇬🇷', title: 'Виза Греция (Шенген)', sizeMm: '35×45 мм', sizePx: '826×1062 px', aspectRatio: '3:4', bg: 'white', hint: 'Белый фон, нейтральное выражение.', prompt: p('Greek Schengen visa standard, white background.') },
    { id: 'czech', country: 'Чехия', flag: '🇨🇿', title: 'Виза Чехия (Шенген)', sizeMm: '35×45 мм', sizePx: '826×1062 px', aspectRatio: '3:4', bg: 'white', hint: 'Белый фон.', prompt: p('Czech Schengen visa standard, white background.') },

    // ——— Америка ———
    { id: 'us-visa', country: 'США', flag: '🇺🇸', title: 'Виза США (2×2″)', sizeMm: '51×51 мм', sizePx: '600×600 px (мин.)', aspectRatio: '1:1', bg: 'white', hint: 'Квадрат 2×2″, белый фон, голова 50–69% высоты.', prompt: p('US visa and passport 2x2 inch square format, head 50-69% of photo height, off-white or white background.', 'plain white or off-white background') },
    { id: 'us-green-card', country: 'США', flag: '🇺🇸', title: 'Green Card / DV-лотерея', sizeMm: '51×51 мм', sizePx: '600×600 px', aspectRatio: '1:1', bg: 'white', hint: 'Квадрат 2×2″, свежее фото, белый фон.', prompt: p('US Green Card and DV lottery 2x2 inch square, white background, head centered.', 'plain white background') },
    { id: 'canada', country: 'Канада', flag: '🇨🇦', title: 'Виза/паспорт Канада', sizeMm: '50×70 мм', sizePx: '590×826 px', aspectRatio: '5:7', bg: 'white', hint: '50×70 мм, белый фон, голова 31–36 мм.', prompt: p('Canadian passport and visa 50x70mm, chin-to-crown 31-36mm, plain white background.', 'plain white background') },
    { id: 'brazil', country: 'Бразилия', flag: '🇧🇷', title: 'Виза Бразилия', sizeMm: '51×51 мм', sizePx: '600×600 px', aspectRatio: '1:1', bg: 'white', hint: 'Квадрат 2×2″, белый фон.', prompt: p('Brazil visa 2x2 inch square, white background.', 'plain white background') },
    { id: 'mexico', country: 'Мексика', flag: '🇲🇽', title: 'Виза Мексика', sizeMm: '35×45 мм', sizePx: '413×531 px', aspectRatio: '3:4', bg: 'white', hint: 'Белый фон, анфас.', prompt: p('Mexico visa standard, white background.') },

    // ——— Азия ———
    { id: 'china', country: 'Китай', flag: '🇨🇳', title: 'Виза Китай', sizeMm: '33×48 мм', sizePx: '354×472 px', aspectRatio: '2:3', bg: 'white', hint: '33×48 мм, белый фон, уши видны, без улыбки.', prompt: p('China visa 33x48mm, white background, ears visible, no smile.', 'plain white background') },
    { id: 'india', country: 'Индия', flag: '🇮🇳', title: 'Виза Индия (e-Visa)', sizeMm: '51×51 мм', sizePx: '600×600 px', aspectRatio: '1:1', bg: 'white', hint: 'Квадрат 2×2″, белый фон, лицо по центру.', prompt: p('India e-Visa 2x2 inch square, white background, face centered.', 'plain white background') },
    { id: 'japan', country: 'Япония', flag: '🇯🇵', title: 'Виза/паспорт Япония', sizeMm: '35×45 мм', sizePx: '413×531 px', aspectRatio: '3:4', bg: 'white', hint: 'Белый фон, голова 34±2 мм.', prompt: p('Japan passport and visa 35x45mm, chin-to-crown 34mm, plain white background.') },
    { id: 'korea', country: 'Ю. Корея', flag: '🇰🇷', title: 'Виза Ю. Корея', sizeMm: '35×45 мм', sizePx: '413×531 px', aspectRatio: '3:4', bg: 'white', hint: 'Белый фон, уши видны.', prompt: p('South Korea visa 35x45mm, white background, ears visible.') },
    { id: 'thailand', country: 'Таиланд', flag: '🇹🇭', title: 'Виза Таиланд', sizeMm: '40×60 мм', sizePx: '472×709 px', aspectRatio: '2:3', bg: 'white', hint: '40×60 мм, белый фон, деловая одежда.', prompt: p('Thailand visa 40x60mm, white background, formal attire.', 'plain white background') },
    { id: 'vietnam', country: 'Вьетнам', flag: '🇻🇳', title: 'Виза Вьетнам', sizeMm: '40×60 мм', sizePx: '472×709 px', aspectRatio: '2:3', bg: 'white', hint: '4×6 см, белый фон, без очков.', prompt: p('Vietnam visa 4x6cm, white background, no glasses.', 'plain white background') },
    { id: 'uae', country: 'ОАЭ', flag: '🇦🇪', title: 'Виза ОАЭ', sizeMm: '43×55 мм', sizePx: '300×369 px', aspectRatio: '3:4', bg: 'white', hint: 'Белый фон, лицо по центру, без улыбки.', prompt: p('UAE visa standard, white background, no smile.', 'plain white background') },
    { id: 'turkey', country: 'Турция', flag: '🇹🇷', title: 'Виза/паспорт Турция', sizeMm: '50×60 мм', sizePx: '591×709 px', aspectRatio: '5:6', bg: 'white', hint: '50×60 мм, белый фон.', prompt: p('Turkey visa and passport 50x60mm, white background.', 'plain white background') },
    { id: 'israel', country: 'Израиль', flag: '🇮🇱', title: 'Виза Израиль', sizeMm: '51×51 мм', sizePx: '600×600 px', aspectRatio: '1:1', bg: 'white', hint: 'Квадрат 2×2″, белый фон.', prompt: p('Israel visa 2x2 inch square, white background.', 'plain white background') },
    { id: 'indonesia', country: 'Индонезия', flag: '🇮🇩', title: 'Виза Индонезия (Бали)', sizeMm: '51×51 мм', sizePx: '600×600 px', aspectRatio: '1:1', bg: 'white', hint: 'Квадрат 2×2″, белый фон.', prompt: p('Indonesia (Bali) visa 2x2 inch square, white background.', 'plain white background') },

    // ——— Океания / прочее ———
    { id: 'australia', country: 'Австралия', flag: '🇦🇺', title: 'Виза/паспорт Австралия', sizeMm: '35×45 мм', sizePx: '826×1062 px', aspectRatio: '3:4', bg: 'white', hint: 'Белый/светлый фон, голова 32–36 мм.', prompt: p('Australian passport and visa 35x45mm, plain white or light background.') },
    { id: 'new-zealand', country: 'Н. Зеландия', flag: '🇳🇿', title: 'Виза Новая Зеландия', sizeMm: '35×45 мм', sizePx: '900×1200 px', aspectRatio: '3:4', bg: 'white', hint: 'Белый/серый фон.', prompt: p('New Zealand visa 35x45mm, plain light background.') },
    { id: 'egypt', country: 'Египет', flag: '🇪🇬', title: 'Виза Египет', sizeMm: '40×60 мм', sizePx: '472×709 px', aspectRatio: '2:3', bg: 'white', hint: 'Белый фон.', prompt: p('Egypt visa 40x60mm, white background.', 'plain white background') },

    // ——— Онлайн-заявки / прочее ———
    { id: 'resume', country: 'Универсально', flag: '💼', title: 'Резюме / CV', sizeMm: '35×45 мм', sizePx: '400×500 px', aspectRatio: '4:5', bg: 'light-grey', hint: 'Нейтральный фон, деловая одежда, лёгкая улыбка допустима.', prompt: 'Professional CV resume headshot. Keep the same person and face identity from the input image. Business attire, plain neutral light grey or white background, even soft lighting, no harsh shadows. Head and shoulders, face about 60% of the frame, slight natural friendly smile allowed. Corporate portrait, photorealistic, high quality.' },
    { id: 'linkedin', country: 'Универсально', flag: '💼', title: 'LinkedIn / соцсети', sizeMm: '400×400 px', sizePx: '400×400 px', aspectRatio: '1:1', bg: 'light-grey', hint: 'Квадрат, деловой портрет, дружелюбная улыбка.', prompt: 'Professional LinkedIn profile headshot, square format. Keep the same person and face identity. Business casual attire, softly blurred neutral background, warm even lighting, confident friendly smile. Head and shoulders. Photorealistic, high quality.' },
    { id: 'student', country: 'Универсально', flag: '🎓', title: 'Студенческий / пропуск', sizeMm: '30×40 мм', sizePx: '354×472 px', aspectRatio: '3:4', bg: 'white', hint: 'Белый фон, нейтральное выражение.', prompt: p('Student ID / access pass photo 30x40mm, white background.') },
    { id: 'driver', country: 'Универсально', flag: '🚗', title: 'Водительское удостоверение', sizeMm: '35×45 мм', sizePx: '413×531 px', aspectRatio: '3:4', bg: 'white', hint: 'Белый/светлый фон, нейтральное выражение.', prompt: p('Driver license photo 35x45mm, plain light background.') },
];

// Группировка по регионам для UI.
export const DOCUMENT_GROUPS: { region: string; ids: string[] }[] = [
    { region: 'Россия и СНГ', ids: ['ru-passport', 'ru-internal', 'ru-medical', 'driver', 'student'] },
    { region: 'Европа / Шенген', ids: ['schengen', 'uk', 'germany', 'france', 'italy', 'spain', 'poland', 'greece', 'czech'] },
    { region: 'Америка', ids: ['us-visa', 'us-green-card', 'canada', 'brazil', 'mexico'] },
    { region: 'Азия', ids: ['china', 'india', 'japan', 'korea', 'thailand', 'vietnam', 'uae', 'turkey', 'israel', 'indonesia'] },
    { region: 'Океания и Африка', ids: ['australia', 'new-zealand', 'egypt'] },
    { region: 'Онлайн-заявки', ids: ['resume', 'linkedin'] },
];

export const getDocumentSpec = (id: string): DocumentSpec | undefined =>
    DOCUMENT_SPECS.find(d => d.id === id);

// Preset ids for documents are prefixed with `doc-` (see TemplateGrid).
export const isDocumentPresetId = (presetId?: string | null): boolean =>
    !!presetId && presetId.startsWith('doc-');

// Map a supported UI aspect ratio for a document preset id (`doc-<specId>`).
// Non-standard official ratios (5:7, 5:6, 2:3…) snap to the nearest supported.
export const documentAspectRatio = (presetId: string): '1:1' | '3:4' | '4:5' => {
    const spec = DOCUMENT_SPECS.find(d => `doc-${d.id}` === presetId);
    if (!spec) return '3:4';
    if (spec.aspectRatio === '1:1') return '1:1';
    if (spec.aspectRatio === '4:5') return '4:5';
    // 3:4, 2:3, 5:7, 5:6, 7:9 → portrait document → 3:4
    return '3:4';
};
