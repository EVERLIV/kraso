// Video generation via FAL AI using Google Veo 3.1 model (through Cloud Function)

interface KlingVideoOptions {
    prompt: string;
    image_url: string;
    duration?: '5' | '10';
    aspect_ratio?: '16:9' | '9:16' | '1:1';
    negative_prompt?: string;
    cfg_scale?: number;
    onProgress?: (status: string) => void;
}

/**
 * Upload base64 image to Firebase Storage or return URL if already a URL
 * This is now handled on the client side before calling the Cloud Function
 */
export const uploadBase64ToUrl = async (base64Data: string): Promise<string> => {
    if (base64Data.startsWith('http')) return base64Data;
    // For data URLs, we'll pass them directly to Cloud Function which will handle upload
    return base64Data;
};

/**
 * Generate video from reference image using FAL Veo 3.1 via Cloud Function
 */
export const generateKlingVideo = async (options: KlingVideoOptions): Promise<string> => {
    const { prompt, image_url, duration = '10', aspect_ratio = '16:9', onProgress } = options;

    try {
        // Map duration: Veo only supports 8s
        const veoDuration = '8s';

        // Map aspect_ratio: Veo only supports 16:9 and 9:16
        let veoAspectRatio: '16:9' | '9:16' = '16:9';
        if (aspect_ratio === '9:16') {
            veoAspectRatio = '9:16';
        }

        onProgress?.('Подготовка запроса...');

        // Prepare image URLs array (Cloud Function will handle upload if needed)
        const imageUrls = [image_url];

        const functionUrl =
            import.meta.env.VITE_FAL_VEO_FUNCTION_URL ||
            "https://us-central1-project-1285666415996898989.cloudfunctions.net/generateFalVeoVideo";

        onProgress?.('Генерация видео через Veo 3.1...');

        const response = await fetch(functionUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                prompt,
                image_urls: imageUrls,
                aspect_ratio: veoAspectRatio,
                duration: veoDuration,
                resolution: "720p",
                generate_audio: true,
                auto_fix: true,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            let errorMessage = errorText;
            try {
                const errorJson = JSON.parse(errorText);
                errorMessage = errorJson.error || errorJson.message || errorText;
            } catch {
                // Keep text as is
            }
            throw new Error(errorMessage || `Ошибка генерации видео (${response.status})`);
        }

        const data = await response.json();
        
        if (!data.success || !data.video?.url) {
            throw new Error("Cloud Function не вернул URL видео: " + JSON.stringify(data));
        }

        onProgress?.('Видео готово!');
        return data.video.url;
    } catch (error: any) {
        console.error("FAL Veo video generation error:", error);
        onProgress?.('Ошибка: ' + (error.message || 'Неизвестная ошибка'));
        throw new Error(error.message || "Ошибка генерации видео через FAL Veo 3.1");
    }
};
