import { formatDuration } from '../lib/videoModels';

export interface KlingVideoOptions {
    prompt: string;
    image_url: string;
    /** Duration in seconds (integer). The service formats it for the target model. */
    durationSeconds?: number;
    aspect_ratio?: string;
    resolution?: string;
    negative_prompt?: string;
    cfg_scale?: number;
    /** Atlas Cloud model endpoint ID (e.g. kwaivgi/kling-v3.0-pro/image-to-video) */
    videoModelId?: string;
    generateAudio?: boolean;
    /**
     * Duration string format expected by the model.
     * 'seconds' → "5", 'seconds-suffix' → "5s"  (Veo needs the suffix)
     */
    durationFormat?: 'seconds' | 'seconds-suffix';
    onProgress?: (status: string) => void;
}

const FUNCTION_URL =
    (import.meta.env.VITE_VIDEO_FUNCTION_URL as string | undefined) ||
    'https://us-central1-project-1285666415996898989.cloudfunctions.net/generateAtlasVideo';

/**
 * Generate video from a reference image via Cloud Function → Atlas Cloud.
 * Supports Wan 2.5, Kling 2.5 / 3.0, Seedance 1.5 Pro, Veo 3 / 3.1.
 */
export const generateKlingVideo = async (options: KlingVideoOptions): Promise<string> => {
    const {
        prompt,
        image_url,
        durationSeconds = 5,
        aspect_ratio = '16:9',
        resolution = '1080p',
        negative_prompt,
        videoModelId,
        generateAudio = true,
        durationFormat = 'seconds',
        onProgress,
    } = options;

    const durationStr = formatDuration(durationSeconds, durationFormat);

    onProgress?.('Подготовка запроса...');

    const modelLabel = videoModelId?.includes('veo') ? 'Veo' :
        videoModelId?.includes('kling') ? 'Kling' :
        videoModelId?.includes('seedance') ? 'Seedance' :
        videoModelId?.includes('wan') ? 'Wan' : 'модель';

    onProgress?.(`Генерация видео — ${modelLabel}…`);

    const response = await fetch(FUNCTION_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            prompt,
            image_urls: [image_url],
            aspect_ratio,
            duration: durationStr,
            resolution,
            generate_audio: generateAudio,
            auto_fix: true,
            model_id: videoModelId,
            ...(negative_prompt ? { negative_prompt } : {}),
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = errorText;
        try {
            const errorJson = JSON.parse(errorText);
            errorMessage = errorJson.error || errorJson.message || errorText;
        } catch {
            // keep plain text
        }
        throw new Error(errorMessage || `Ошибка генерации видео (${response.status})`);
    }

    const data = await response.json();

    if (!data.success || !data.video?.url) {
        throw new Error('Cloud Function не вернул URL видео: ' + JSON.stringify(data));
    }

    onProgress?.('Видео готово!');
    return data.video.url;
};
