import { cleanBase64, getMimeType } from './geminiService';

export interface MarketingProjectBrief {
    prompt: string;
    styleLabel: string;
    hook: string;
    setting: string;
    summary: string;
}

const MODEL = 'gemini-2.0-flash';

function getApiKey(): string {
    const key = import.meta.env.VITE_GEMINI_API_KEY;
    if (!key) throw new Error('API-ключ Gemini не настроен');
    return key;
}

async function callGeminiJson(
    systemText: string,
    images?: { dataUrl: string; label: string }[],
): Promise<MarketingProjectBrief> {
    const parts: { text?: string; inlineData?: { mimeType: string; data: string } }[] = [
        { text: systemText },
    ];

    for (const img of images ?? []) {
        parts.push({ text: `\n[${img.label}]` });
        parts.push({
            inlineData: {
                mimeType: getMimeType(img.dataUrl),
                data: cleanBase64(img.dataUrl),
            },
        });
    }

    const resp = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${getApiKey()}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ role: 'user', parts }],
                generationConfig: {
                    responseMimeType: 'application/json',
                    temperature: 0.7,
                },
            }),
        },
    );

    if (!resp.ok) {
        const err = await resp.text();
        throw new Error(err || `Ошибка анализа (${resp.status})`);
    }

    const data = await resp.json();
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!raw) throw new Error('Пустой ответ от ИИ');

    const parsed = JSON.parse(raw) as Partial<MarketingProjectBrief>;
    return {
        prompt: parsed.prompt || 'UGC-реклама товара, вертикальный 9:16, реалистичная съёмка на смартфон.',
        styleLabel: parsed.styleLabel || 'UGC',
        hook: parsed.hook || 'Сильный хук в первые 2 секунды',
        setting: parsed.setting || 'Домашняя обстановка, мягкий дневной свет',
        summary: parsed.summary || 'Проект создан на основе анализа',
    };
}

export async function analyzeProductUrl(
    url: string,
    productImage?: string | null,
): Promise<MarketingProjectBrief> {
    const normalized = url.trim().startsWith('http') ? url.trim() : `https://${url.trim()}`;

    const images = productImage ? [{ dataUrl: productImage, label: 'Фото товара пользователя' }] : [];

    return callGeminiJson(
        `Ты — креативный директор рекламных роликов для TikTok, Reels и Shorts.
Пользователь дал ссылку на товар: ${normalized}

Изучи URL (домен, путь, ключевые слова) и составь бриф для вертикальной видеорекламы 9:16 на русском языке.
Если есть фото товара — учти его в описании.

Верни JSON:
{
  "prompt": "детальный промпт для генерации кадра рекламы (2-4 предложения, русский)",
  "styleLabel": "короткий стиль: UGC / Коммерция / TikTok / ASMR",
  "hook": "текст хука для первых секунд",
  "setting": "сеттинг и атмосфера",
  "summary": "одно предложение — что ИИ понял о товаре"
}`,
        images,
    );
}

export async function analyzeAdReference(params: {
    videoUrl?: string;
    videoThumb?: string | null;
    productImage?: string | null;
    avatarImage?: string | null;
}): Promise<MarketingProjectBrief> {
    const images: { dataUrl: string; label: string }[] = [];
    if (params.videoThumb) images.push({ dataUrl: params.videoThumb, label: 'Кадр референс-рекламы' });
    if (params.productImage) images.push({ dataUrl: params.productImage, label: 'Товар пользователя' });
    if (params.avatarImage) images.push({ dataUrl: params.avatarImage, label: 'Аватар / креатор' });

    const videoCtx = params.videoUrl?.trim()
        ? `Ссылка на референс-видео: ${params.videoUrl.trim()}`
        : 'Референс загружен пользователем как файл.';

    return callGeminiJson(
        `Ты — креативный директор. Пользователь хочет повторить энергию вирусной рекламы для своего товара.
${videoCtx}

Проанализируй референс (кадр/ссылку) и приложенные материалы. Сохрани тот же хук, темп и формат, но адаптируй под товар пользователя.
Ответ строго на русском. Верни JSON:
{
  "prompt": "промпт для генерации похожей рекламы с товаром пользователя (2-4 предложения)",
  "styleLabel": "UGC / TikTok / Коммерция",
  "hook": "адаптированный хук",
  "setting": "сеттинг как в референсе",
  "summary": "что взято из референса и как адаптировано"
}`,
        images,
    );
}

export function extractVideoThumbnail(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const video = document.createElement('video');
        video.muted = true;
        video.playsInline = true;
        video.src = url;

        video.addEventListener('loadeddata', () => {
            video.currentTime = Math.min(1, video.duration * 0.1 || 0);
        });

        video.addEventListener('seeked', () => {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth || 720;
            canvas.height = video.videoHeight || 1280;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                URL.revokeObjectURL(url);
                reject(new Error('Не удалось обработать видео'));
                return;
            }
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            URL.revokeObjectURL(url);
            resolve(canvas.toDataURL('image/jpeg', 0.85));
        });

        video.addEventListener('error', () => {
            URL.revokeObjectURL(url);
            reject(new Error('Не удалось загрузить видео'));
        });
    });
}
