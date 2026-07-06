import React, { useEffect, useRef, useState } from 'react';

export const MARKETING_PREVIEW_FALLBACK = '/marketing/pickers/style/ugc-bathroom.png';

export function isMarketingVideo(src: string): boolean {
    return /\.(mp4|webm|mov)(\?.*)?$/i.test(src);
}

interface MarketingPreviewMediaProps {
    src: string;
    className?: string;
    fallback?: string;
    poster?: string;
    autoPlay?: boolean;
}

function MarketingPreviewMedia({
    src,
    className = '',
    fallback = MARKETING_PREVIEW_FALLBACK,
    poster,
    autoPlay = true,
}: MarketingPreviewMediaProps) {
    const [url, setUrl] = useState(src);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        setUrl(src);
    }, [src]);

    // Programmatically call play() to overcome browser autoplay restrictions
    useEffect(() => {
        if (!autoPlay || !videoRef.current) return;
        const video = videoRef.current;
        const tryPlay = () => {
            video.play().catch(() => {
                // Autoplay blocked — leave paused (shows first frame as thumbnail)
            });
        };
        if (video.readyState >= 2) {
            tryPlay();
        } else {
            video.addEventListener('loadeddata', tryPlay, { once: true });
            return () => video.removeEventListener('loadeddata', tryPlay);
        }
    }, [url, autoPlay]);

    const onError = () => {
        if (url !== fallback) setUrl(fallback);
    };

    if (isMarketingVideo(url)) {
        return (
            <video
                key={url}
                ref={videoRef}
                src={url}
                poster={poster ?? fallback}
                className={className}
                style={{ objectFit: 'cover' }}
                muted
                loop
                playsInline
                preload="auto"
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
