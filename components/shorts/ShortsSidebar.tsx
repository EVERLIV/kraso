import React from 'react';
import { Video, Loader2, Sparkles, Pencil } from 'lucide-react';
import { ShortsAspect, SHORTS_GEN_COST, SHORTS_MAX_DURATION_LABEL } from '../../lib/shortsVisualPresets';

interface ShortsSidebarProps {
    attachedImage: string | null;
    onPickFile: () => void;
    aspect: ShortsAspect;
    onAspectChange: (a: ShortsAspect) => void;
    loading: boolean;
    status?: string;
    canGenerate: boolean;
    onGenerate: () => void;
    presetTitle?: string;
}

function ShortsSidebar({
    attachedImage, onPickFile, aspect, onAspectChange,
    loading, status, canGenerate, onGenerate, presetTitle,
}: ShortsSidebarProps) {
    const ratioBtn = (value: ShortsAspect, label: string) => (
        <button
            type="button"
            onClick={() => onAspectChange(value)}
            className={aspect === value ? 'ms-filter-active w-full text-center' : 'ms-filter-inactive w-full text-center'}
        >
            {label}
        </button>
    );

    return (
        <div className="flex flex-col gap-3 mt-auto">
            <div className="ss-sidebar-preview ms-slot overflow-hidden">
                {attachedImage ? (
                    <>
                        <img src={attachedImage} alt="" className="size-full object-cover" />
                        <button
                            type="button"
                            onClick={onPickFile}
                            aria-label="Изменить медиа"
                            className="absolute top-2 right-2 ms-btn-secondary inline-flex items-center gap-1 px-2 py-1 text-xs"
                        >
                            <Pencil className="size-3" />
                            Изменить
                        </button>
                        {presetTitle && (
                            <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-[8px] bg-black/55 text-xs font-semibold text-white truncate max-w-[calc(100%-16px)]">
                                {presetTitle}
                            </span>
                        )}
                    </>
                ) : (
                    <button
                        type="button"
                        onClick={onPickFile}
                        className="size-full flex flex-col items-center justify-center text-[var(--ms-dim)] gap-2"
                    >
                        <Video className="size-7" />
                        <span className="text-xs text-pretty">Превью</span>
                    </button>
                )}
            </div>

            <button type="button" onClick={onPickFile} className="ms-slot ms-slot--dashed flex flex-col items-center gap-2 py-5 px-4 text-center">
                <Video className="size-5 text-[var(--ms-dim)]" />
                <span className="text-sm font-semibold text-[var(--ms-text)] text-balance">Загрузите видео для монтажа</span>
                <span className="text-xs text-[var(--ms-muted)] text-pretty">Макс. длительность: {SHORTS_MAX_DURATION_LABEL}</span>
                <span className="text-[11px] text-[var(--ms-dim)] text-pretty">Также можно фото — мы оживим его</span>
            </button>

            <div>
                <p className="text-xs font-semibold text-[var(--ms-muted)] mb-2">Формат</p>
                <div className="grid grid-cols-2 gap-2">
                    {ratioBtn('9:16', 'Вертикальный')}
                    {ratioBtn('16:9', 'Горизонтальный')}
                </div>
            </div>

            {status && (
                <p className="text-xs text-[var(--ms-muted)] text-pretty" role="status" aria-live="polite">
                    {status}
                </p>
            )}

            <button
                type="button"
                onClick={onGenerate}
                disabled={loading || !canGenerate}
                className="w-full ms-btn-primary py-3 text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50"
            >
                {loading ? (
                    <>
                        <Loader2 className="size-4 motion-safe:animate-spin motion-reduce:animate-none" />
                        Генерация…
                    </>
                ) : (
                    <>
                        <Sparkles className="size-4" />
                        Сгенерировать · <span className="tabular-nums">{SHORTS_GEN_COST} кр</span>
                    </>
                )}
            </button>
        </div>
    );
}

export default ShortsSidebar;
