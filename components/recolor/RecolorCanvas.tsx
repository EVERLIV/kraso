import React from 'react';
import { Loader2, MessageSquarePlus } from 'lucide-react';
import { GeneratedImage } from '../../types';
import { getDisplayPrompt } from '../../lib/promptUtils';

interface RecolorCanvasProps {
    items: GeneratedImage[];
    loading?: boolean;
    onAddPromptReference: (url: string) => void;
}

function RecolorCanvas({ items, loading, onAddPromptReference }: RecolorCanvasProps) {
    const validItems = items.filter(item => {
        const url = item.generated;
        return url && (url.startsWith('http') || url.startsWith('data:image') || url.startsWith('blob:'));
    });

    if (!loading && validItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center px-4 min-h-[50dvh]">
                <p className="text-sm font-medium text-[var(--is-muted)] text-pretty max-w-xs">
                    Здесь появятся ваши работы. Загрузите фото в <strong className="text-[var(--is-text)]">Character</strong>, выберите <strong className="text-[var(--is-text)]">Палитру</strong> и нажмите Generate.
                </p>
            </div>
        );
    }

    return (
        <div className="is-canvas-grid">
            {loading && (
                <div className="is-canvas-cell relative" aria-busy="true" aria-label="Генерация">
                    <div className="is-skeleton-cell absolute inset-0" aria-hidden />
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/40">
                        <Loader2 className="size-6 motion-safe:animate-spin motion-reduce:animate-none text-[var(--is-lime)]" />
                        <span className="text-xs text-[var(--is-muted)] text-pretty">Генерация…</span>
                    </div>
                </div>
            )}

            {validItems.map((item, i) => {
                const displayPrompt = getDisplayPrompt(item);
                return (
                    <div key={item.id || i} className="is-canvas-cell group">
                        <img
                            src={item.generated}
                            alt={displayPrompt || 'Результат'}
                            className="is-canvas-cell__img"
                            loading="lazy"
                        />
                        {displayPrompt && (
                            <div className="absolute inset-x-0 bottom-0 p-2 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none motion-reduce:transition-none">
                                <p className="text-white text-xs line-clamp-2 text-pretty">{displayPrompt}</p>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-start justify-end p-2 opacity-0 group-hover:opacity-100 motion-reduce:transition-none">
                            <button
                                type="button"
                                onClick={() => onAddPromptReference(item.generated)}
                                className="size-8 rounded-lg bg-black/70 text-white flex items-center justify-center hover:bg-[var(--is-lime)] hover:text-[var(--is-on-lime)] transition-colors duration-100"
                                aria-label="Добавить в промпт как референс"
                            >
                                <MessageSquarePlus className="size-4" />
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default RecolorCanvas;
