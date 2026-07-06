import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Download, Share2, Trash2, Heart } from 'lucide-react';
import { GeneratedImage } from '../../types';
import { getDisplayPrompt } from '../../lib/promptUtils';

interface VideoResultViewerProps {
    item: GeneratedImage;
    onClose: () => void;
    onDownload: (url: string) => void;
    onShare: (url: string) => void;
    onDelete: (item: GeneratedImage) => void;
    onToggleSave?: (id: string) => void;
}

function VideoResultViewer({
    item,
    onClose,
    onDownload,
    onShare,
    onDelete,
    onToggleSave,
}: VideoResultViewerProps) {
    const [confirmDelete, setConfirmDelete] = useState(false);
    const url = item.generated;
    const displayPrompt = getDisplayPrompt(item) || 'Видео';

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', onKey);
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = prevOverflow;
        };
    }, [onClose]);

    const railBtn =
        'size-10 rounded-full bg-black/60 border border-white/15 text-white flex items-center justify-center hover:bg-black/80 transition-colors duration-100';
    const pillBtn =
        'inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-black/60 border border-white/15 text-white text-sm font-medium hover:bg-black/80 transition-colors duration-100';

    const handleDelete = () => {
        if (!confirmDelete) {
            setConfirmDelete(true);
            return;
        }
        onDelete(item);
    };

    return createPortal(
        <div
            className="fixed inset-0 z-[9999] bg-black flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label="Просмотр видео"
        >
            <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between gap-3 p-3 pt-[calc(0.75rem+env(safe-area-inset-top))]">
                <p className="text-sm text-white/80 truncate max-w-[min(70vw,28rem)] px-1">{displayPrompt}</p>
                <button type="button" onClick={onClose} className={railBtn} aria-label="Закрыть">
                    <X className="size-5" />
                </button>
            </div>

            <div className="flex-1 flex items-center justify-center min-h-0 px-4 pt-14 pb-28">
                <video
                    src={url}
                    className="max-w-full max-h-full w-auto h-auto object-contain"
                    controls
                    autoPlay
                    loop
                    playsInline
                />
            </div>

            {item.id && onToggleSave && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20">
                    <button
                        type="button"
                        onClick={() => onToggleSave(item.id!)}
                        className={`${railBtn} ${item.isSaved ? 'text-red-400 border-red-400/40' : ''}`}
                        aria-label={item.isSaved ? 'Убрать из избранного' : 'В избранное'}
                    >
                        <Heart className={`size-4 ${item.isSaved ? 'fill-current' : ''}`} />
                    </button>
                </div>
            )}

            <div className="absolute bottom-0 inset-x-0 z-20 flex flex-col items-center gap-2 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
                {confirmDelete && (
                    <p className="text-xs text-white/70 text-center text-pretty">
                        Нажмите «Удалить» ещё раз, чтобы убрать из истории
                    </p>
                )}
                <div className="flex flex-wrap justify-center gap-2">
                    <button type="button" onClick={() => onDownload(url)} className={pillBtn}>
                        <Download className="size-4 text-primary" />
                        Скачать
                    </button>
                    <button type="button" onClick={() => onShare(url)} className={pillBtn}>
                        <Share2 className="size-4 text-primary" />
                        Отправить
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        className={`${pillBtn} ${confirmDelete ? 'border-red-400/50 text-red-300' : ''}`}
                    >
                        <Trash2 className="size-4" />
                        {confirmDelete ? 'Подтвердить' : 'Удалить'}
                    </button>
                </div>
            </div>
        </div>,
        document.body,
    );
}

export default VideoResultViewer;
