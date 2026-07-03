import React, { useEffect, useState } from 'react';

export const MARKETING_PREVIEW_FALLBACK = '/templates/market-tech-neon.webp';

export function isMarketingVideo(src: string): boolean {
    return /\.(mp4|webm|mov)(\?.*)?$/i.test(src);
}

interface MarketingPreviewMediaProps {
    src: string;
    className?: string;
    fallback?: string;
    autoPlay?: boolean;
}

function MarketingPreviewMedia({
    src,
    className = '',
    fallback = MARKETING_PREVIEW_FALLBACK,
    autoPlay = true,
}: MarketingPreviewMediaProps) {
    const [url, setUrl] = useState(src);

    useEffect(() => {
        setUrl(src);
    }, [src]);

    const onError = () => {
        if (url !== fallback) setUrl(fallback);
    };

    if (isMarketingVideo(url)) {
        return (
            <video
                src={url}
                className={className}
                autoPlay={autoPlay}
                muted
                loop
                playsInline
                preload="metadata"
                onError={onError}
            />
        );
    }

    return (
        <img
            src={url}
            alt=""
            className={className}
            loading="lazy"
            onError={onError}
        />
    );
}

export default MarketingPreviewMedia;
