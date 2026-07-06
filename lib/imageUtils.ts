
/**
 * Utility to compress/resize base64 images using Canvas to speed up transmission
 */
export const compressImage = async (base64: string, maxWidth = 1024, quality = 0.8): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous'; // Important for cross-origin URLs
        img.src = base64;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            if (width > maxWidth) {
                height = (maxWidth / width) * height;
                width = maxWidth;
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                resolve(base64);
                return;
            }

            ctx.drawImage(img, 0, 0, width, height);
            const compressed = canvas.toDataURL('image/jpeg', quality);
            resolve(compressed);
        };
        img.onerror = (e) => reject(e);
    });
};

/**
 * Adds a watermark to the image
 */
export const addWatermark = async (imageUrl: string, text: string = "smartphotos.ru"): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = imageUrl;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                resolve(imageUrl); // Fallback if context fails
                return;
            }

            // Draw original image
            ctx.drawImage(img, 0, 0);

            // Configure watermark text
            const fontSize = 25; // 25px as requested
            ctx.font = `bold ${fontSize}px sans-serif`;
            ctx.textAlign = 'right';
            ctx.textBaseline = 'bottom';

            // Add slight shadow for better visibility on all backgrounds
            ctx.shadowColor = 'rgba(0,0,0,0.5)';
            ctx.shadowBlur = 4;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;

            // Set opacity to "slightly noticeable"
            ctx.globalAlpha = 0.5;
            ctx.fillStyle = 'white';

            // Draw text at bottom right with some padding
            const padding = 20;
            ctx.fillText(text, canvas.width - padding, canvas.height - padding);

            // Export
            try {
                const watermarked = canvas.toDataURL('image/jpeg', 0.9);
                resolve(watermarked);
            } catch (e) {
                console.error("Watermark export failed", e);
                resolve(imageUrl);
            }
        };
        img.onerror = (e) => {
            console.error("Watermark load failed", e);
                resolve(imageUrl); // Return original if load fails
        };
    });
};

/** External CDN URLs (Atlas, legacy FAL, etc.) that should be re-persisted to Firebase Storage on load failure. */
export function isEphemeralCdnUrl(url: string | undefined): boolean {
    if (!url?.startsWith('http')) return false;
    if (url.includes('firebasestorage.googleapis.com')) return false;
    if (url.includes('storage.googleapis.com') && url.includes('/users/')) return false;
    return true;
}
