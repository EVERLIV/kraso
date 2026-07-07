import React, { useState, useEffect } from 'react';
import {
    X, Heart, Download, Share2, Copy, MoreHorizontal,
    ImagePlus, Video, LayoutGrid, ExternalLink, ScanEye, Eraser, Globe,
} from 'lucide-react';
import { GeneratedImage } from '../types';
import { getDisplayPrompt } from '../lib/promptUtils';

interface HistoryMediaViewerProps {
    item: GeneratedImage;
    onClose: () => void;
    onDownload: (url: string) => void;
    onShare: (url: string) => void;
    onToggleSave: (id: string) => void;
    onUseAsReference: (url: string) => void;
    onAnimate: (url: string) => void;
    onUseInTemplates: (url: string) => void;
    onUpscale?: (url: string) => void;
    onRemoveBg?: (url: string) => void;
    onPublish?: (item: GeneratedImage) => void;
    isPublished?: boolean;
}

function HistoryMediaViewer({
    item,
    onClose,
    onDownload,
    onShare,
    onToggleSave,
    onUseAsReference,
    onAnimate,
    onUseInTemplates,
    onUpscale,
    onRemoveBg,
    onPublish,
    isPublished,
}: HistoryMediaViewerProps) {
    const [moreOpen, setMoreOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [onClose]);

    const isVideo = item.source === 'video' || item.source === 'shorts' || /\.mp4(\?|$)/i.test(item.generated || '');
    const url = item.generated;
    const displayPrompt = getDisplayPrompt(item);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            /* clipboard may be unavailable */
        }
        setMoreOpen(false);
    };

    const railBtn = 'size-10 rounded-full bg-black/60 border border-white/15 text-white flex items-center justify-center hover:bg-black/80 transition-colors duration-100';
    const pillBtn = 'inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-black/60 border border-white/15 text-white text-sm font-medium hover:bg-black/80 transition-colors duration-100';

    return (
        <div
            className="fixed inset-0 z-50 bg-black flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label="Просмотр медиа"
        >
            {/* Close */}
            <div className="absolute top-0 inset-x-0 z-20 flex justify-end p-3 pt-[calc(0.75rem+env(safe-area-inset-top))]">
                <button onClick={onClose} className={railBtn} aria-label="Закрыть">
                    <X className="size-5" />
                </button>
            </div>

            {/* Media — full size, no rounded corners */}
            <div className="flex-1 flex items-center justify-center min-h-0 px-4 pt-14 pb-32">
                {isVideo ? (
                    <video
                        src={url}
                        className="max-w-full max-h-full w-auto h-auto object-contain"
                        controls
                        autoPlay
                        loop
                        playsInline
                    />
                ) : (
                    <img
                        src={url}
                        alt={displayPrompt || 'Сгенерированное изображение'}
                        className="max-w-full max-h-full w-auto h-auto object-contain"
                    />
                )}
            </div>

            {/* Right action rail */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2">
                {item.id && (
                    <button
                        onClick={() => onToggleSave(item.id!)}
                        className={`${railBtn} ${item.isSaved ? 'text-red-400 border-red-400/40' : ''}`}
                        aria-label={item.isSaved ? 'Убрать из избранного' : 'В избранное'}
                    >
                        <Heart className={`size-4 ${item.isSaved ? 'fill-current' : ''}`} />
                    </button>
                )}
                <button onClick={() => onDownload(url)} className={railBtn} aria-label="Скачать">
                    <Download className="size-4" />
                </button>
                <button onClick={handleCopy} className={railBtn} aria-label="Копировать ссылку">
                    <Copy className="size-4" />
                </button>
                <div className="relative">
                    <button
                        onClick={() => setMoreOpen(v => !v)}
                        className={railBtn}
                        aria-label="Ещё"
                    >
                        <MoreHorizontal className="size-4" />
                    </button>
                    {moreOpen && (
                        <>
                            <div className="fixed inset-0 z-30" onClick={() => setMoreOpen(false)} aria-hidden="true" />
                            <div className="absolute right-full mr-2 top-0 z-40 w-48 rounded-xl bg-card-light border border-[var(--border-color)] shadow-lg py-1 overflow-hidden">
                                <button
                                    onClick={() => { onShare(url); setMoreOpen(false); }}
                                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-ink hover:bg-surface-muted transition-colors text-left"
                                >
                                    <Share2 className="size-4 text-ink-muted" /> Поделиться
                                </button>
                                <button
                                    onClick={() => { window.open(url, '_blank', 'noopener,noreferrer'); setMoreOpen(false); }}
                                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-ink hover:bg-surface-muted transition-colors text-left"
                                >
                                    <ExternalLink className="size-4 text-ink-muted" /> Открыть
                                </button>
                                {!isVideo && onUpscale && (
                                    <button
                                        onClick={() => { onUpscale(url); setMoreOpen(false); }}
                                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-ink hover:bg-surface-muted transition-colors text-left"
                                    >
                                        <ScanEye className="size-4 text-ink-muted" /> Улучшить
                                    </button>
                                )}
                                {!isVideo && onRemoveBg && (
                                    <button
                                        onClick={() => { onRemoveBg(url); setMoreOpen(false); }}
                                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-ink hover:bg-surface-muted transition-colors text-left"
                                    >
                                        <Eraser className="size-4 text-ink-muted" /> Убрать фон
                                    </button>
                                )}
                                {onPublish && (
                                    <button
                                        onClick={() => { onPublish(item); setMoreOpen(false); }}
                                        disabled={isPublished}
                                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-ink hover:bg-surface-muted transition-colors text-left disabled:opacity-50"
                                    >
                                        <Globe className="size-4 text-ink-muted" /> {isPublished ? 'Опубликовано' : 'Поделиться в сообществе'}
                                    </button>
                                )}
                                {!isVideo && (
                                    <button
                                        onClick={() => { onUseInTemplates(url); setMoreOpen(false); }}
                                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-ink hover:bg-surface-muted transition-colors text-left"
                                    >
                                        <LayoutGrid className="size-4 text-ink-muted" /> В шаблонах
                                    </button>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Bottom action pills */}
            <div className="absolute bottom-0 inset-x-0 z-20 flex justify-center gap-2 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
                {!isVideo && (
                    <>
                        <button
                            onClick={() => onUseAsReference(url)}
                            className={pillBtn}
                        >
                            <ImagePlus className="size-4 text-primary" />
                            Референс
                        </button>
                        <button
                            onClick={() => onAnimate(url)}
                            className={pillBtn}
                        >
                            <Video className="size-4 text-primary" />
                            Short
                        </button>
                    </>
                )}
                {!isVideo && (
                    <button
                        onClick={() => onUseInTemplates(url)}
                        className={pillBtn}
                    >
                        <LayoutGrid className="size-4 text-primary" />
                        Шаблоны
                    </button>
                )}
            </div>

            {copied && (
                <div className="absolute top-[calc(3.5rem+env(safe-area-inset-top))] left-1/2 -translate-x-1/2 z-30 px-3 py-1.5 rounded-full bg-card-light border border-[var(--border-color)] text-sm text-ink shadow-sm">
                    Ссылка скопирована
                </div>
            )}
        </div>
    );
}

export default HistoryMediaViewer;
