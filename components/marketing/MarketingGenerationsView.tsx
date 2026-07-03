import React, { useCallback, useEffect, useState } from 'react';
import { ImageIcon, Heart, Download, Share2, X } from 'lucide-react';
import { GeneratedImage } from '../../types';
import { getUserHistory, toggleSavedStatus } from '../../services/firebaseService';
import { getDisplayPrompt } from '../../lib/promptUtils';
import { useAuth } from '../../contexts/AuthContext';

function isMarketingItem(item: GeneratedImage): boolean {
    return item.source === 'marketing' || (item.prompt?.startsWith('[MARKETING]') ?? false);
}

interface MarketingGenerationsViewProps {
    mode: 'all' | 'favorites';
    onGoHome: () => void;
}

function MarketingGenerationsView({ mode, onGoHome }: MarketingGenerationsViewProps) {
    const { user } = useAuth();
    const [items, setItems] = useState<GeneratedImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewer, setViewer] = useState<GeneratedImage | null>(null);

    const load = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            const all = await getUserHistory(user.uid);
            let marketing = all.filter(isMarketingItem);
            if (mode === 'favorites') {
                marketing = marketing.filter(i => i.isSaved);
            }
            setItems(marketing);
        } finally {
            setLoading(false);
        }
    }, [user, mode]);

    useEffect(() => { load(); }, [load]);

    const handleToggleSave = async (id: string) => {
        const item = items.find(i => i.id === id);
        if (!item?.id) return;
        const next = !item.isSaved;
        setItems(prev => prev.map(i => i.id === id ? { ...i, isSaved: next } : i));
        if (viewer?.id === id) setViewer(v => v ? { ...v, isSaved: next } : v);
        await toggleSavedStatus(id, next);
    };

    const handleDownload = (url: string) => {
        const a = document.createElement('a');
        a.href = url;
        a.download = 'marketing-ad.png';
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.click();
    };

    const title = mode === 'favorites' ? 'Избранное' : 'Все генерации';
    const subtitle = mode === 'favorites'
        ? 'Сохранённые рекламные кадры из Маркетинг Студии'
        : 'Только контент, созданный в Маркетинг Студии';

    return (
        <div className="relative px-4 md:px-10 pt-4 pb-[calc(5rem+env(safe-area-inset-bottom))] max-w-[1180px] mx-auto">
            <div className="mb-8">
                <p className="text-xs font-bold uppercase text-[var(--ms-lime)] mb-2" style={{ letterSpacing: '0.28em' }}>
                    Маркетинг Студия
                </p>
                <h1 className="ms-font-display text-2xl sm:text-3xl leading-[0.94] text-balance">{title}</h1>
                <p className="text-sm text-[var(--ms-muted)] mt-2 text-pretty">{subtitle}</p>
            </div>

            {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="aspect-[3/4] rounded-[12px] bg-[var(--ms-raised)] animate-pulse motion-reduce:animate-none" />
                    ))}
                </div>
            ) : items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="size-16 rounded-full bg-[var(--ms-raised)] flex items-center justify-center mb-4">
                        <ImageIcon className="size-7 text-[var(--ms-dim)]" />
                    </div>
                    <h3 className="text-base font-bold mb-1">Пока пусто</h3>
                    <p className="text-sm text-[var(--ms-muted)] mb-5 max-w-xs text-pretty">
                        {mode === 'favorites'
                            ? 'Добавьте рекламные кадры в избранное из галереи генераций.'
                            : 'Создайте первую рекламу на главной Маркетинг Студии.'}
                    </p>
                    <button type="button" onClick={onGoHome} className="ms-btn-primary px-5 py-2.5 text-sm rounded-[10px]">
                        {mode === 'favorites' ? 'К генерациям' : 'Создать рекламу'}
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                    {items.map((item, idx) => (
                        <button
                            key={item.id || idx}
                            type="button"
                            onClick={() => setViewer(item)}
                            className="group relative aspect-[3/4] rounded-[12px] overflow-hidden bg-[var(--ms-raised)] text-left"
                        >
                            <img
                                src={item.generated}
                                alt=""
                                loading="lazy"
                                className="size-full object-cover motion-safe:group-hover:scale-[1.02] motion-reduce:group-hover:scale-100 transition-transform duration-100"
                            />
                            {item.isSaved && (
                                <span className="absolute top-2 right-2 size-7 rounded-full bg-black/50 flex items-center justify-center">
                                    <Heart className="size-3.5 text-red-400 fill-red-400" />
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            )}

            {viewer && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85">
                    <button type="button" className="absolute inset-0" onClick={() => setViewer(null)} aria-label="Закрыть" />
                    <div className="relative max-w-lg w-full ms-panel p-4 shadow-[var(--ms-shadow-composer)]">
                        <button
                            type="button"
                            onClick={() => setViewer(null)}
                            className="absolute top-3 right-3 size-8 rounded-full bg-[var(--ms-raised)] flex items-center justify-center text-[var(--ms-muted)]"
                            aria-label="Закрыть"
                        >
                            <X className="size-4" />
                        </button>
                        <img src={viewer.generated} alt="" className="w-full rounded-[12px] aspect-[3/4] object-cover mb-3" />
                        {getDisplayPrompt(viewer) && (
                            <p className="text-sm text-[var(--ms-body)] text-pretty line-clamp-3 mb-3">{getDisplayPrompt(viewer)}</p>
                        )}
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => handleDownload(viewer.generated)}
                                className="ms-btn-secondary flex-1 flex items-center justify-center gap-2 py-2.5 text-sm"
                            >
                                <Download className="size-4" /> Скачать
                            </button>
                            {viewer.id && (
                                <button
                                    type="button"
                                    onClick={() => handleToggleSave(viewer.id!)}
                                    className={`ms-btn-secondary flex items-center justify-center gap-2 px-4 py-2.5 text-sm ${
                                        viewer.isSaved ? 'text-red-400' : ''
                                    }`}
                                    aria-label={viewer.isSaved ? 'Убрать из избранного' : 'В избранное'}
                                >
                                    <Heart className={`size-4 ${viewer.isSaved ? 'fill-current' : ''}`} />
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={() => {
                                    if (navigator.share) {
                                        navigator.share({ url: viewer.generated }).catch(() => {});
                                    }
                                }}
                                className="ms-btn-secondary px-4 py-2.5"
                                aria-label="Поделиться"
                            >
                                <Share2 className="size-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MarketingGenerationsView;
