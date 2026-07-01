
// Service to interact with Pollinations.ai API

interface PollinationsOptions {
    width?: number;
    height?: number;
    seed?: number;
    model?: string;
    nologo?: boolean;
}

const BASE_URL = 'https://gen.pollinations.ai';

// Images can be generated via GET directly
export const generatePollinationsImage = (prompt: string, options: PollinationsOptions = {}): string => {
    const { width = 1024, height = 1024, seed = Math.floor(Math.random() * 10000), model = 'turbo', nologo = true } = options;
    const encodedPrompt = encodeURIComponent(prompt);
    const token = import.meta.env.VITE_POLLINATIONS_TOKEN;

    let url = `${BASE_URL}/image/${encodedPrompt}?width=${width}&height=${height}&seed=${seed}&model=${model}`;
    if (nologo) url += '&nologo=true';
    if (token) url += `&token=${token}`;

    return url;
};

// Video Generation using Veo (or other video models)
// Based on docs: POST request might be needed for video generation if it takes time, OR it works similar to GET but returns video bytes.
// Documentation says: "Veo 3.1 Fast - Google's video generation model"
// "Output modalities: video"
// "Input modalities: text, image"
export const generatePollinationsVideo = async (prompt: string, imageUrl?: string, model: string = 'veo'): Promise<string> => {
    const token = import.meta.env.VITE_POLLINATIONS_TOKEN;

    // Construct the POST payload
    const payload: any = {
        prompt,
        model,
        ...(imageUrl ? { image: imageUrl } : {})
    };

    // If we can use the same generic endpoint structure:
    // Usually Pollinations allows POST to / generate or specific endpoints.
    // Given their "Universal" structure, let's try the standard OpenAI-compatible implementation OR specific endpoint.
    // But simplistic usage often supports GET /image/..., maybe /video/...?

    // Let's assume POST to root with model='veo' or similar.
    // Docs say: "Server-side ... fetch(url, { headers: { Authorization: Bearer sk_... } })"
    // Let's try to hit the root generation endpoint.

    // Fallback/Standard Endpoint guess based on recent Pollinations patterns:
    const endpoint = `${BASE_URL}/`;

    // However, Pollinations often just works by prompt URL for simple cases.
    // But video takes time. 
    // Let's try the POST method to "https://gen.pollinations.ai/" which usually acts as an orchestration point.

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Pollinations API Error: ${response.status} ${errText}`);
        }

        // The response might be the video blob directly or a JSON with URL.
        const contentType = response.headers.get('content-type');

        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            return data.url || data.output || data[0]; // Adapt based on actual response
        } else {
            // It returned the video/image bytes directly
            const blob = await response.blob();
            return URL.createObjectURL(blob);
        }
    } catch (e: any) {
        console.error("Pollinations Video Error:", e);
        throw e;
    }
};
