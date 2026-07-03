import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Search, Maximize2, VolumeX } from 'lucide-react';
import { PickerConfig, PickerItem, PICKER_FALLBACK } from '../../lib/marketingPickers';

interface MarketingPickerModalProps {
    config: PickerConfig;
    onClose: () => void;
    onSelect: (item: PickerItem) => void;
}

function HeroImage({ src, className }: { src: string; className?: string }) {
    const [url, setUrl] = useState(src);
    return (
        <img
            src={url}
            alt=""
            className={className}
            loading="lazy"
            onError={() => { if (url !== PICKER_FALLBACK) setUrl(PICKER_FALLBACK); }}
        />
    );
}

function PickerCard({ item, onSelect }: { item: PickerItem; onSelect: () => void }) {
    const [url, setUrl] = useState(item.image);
    return (
        <button
            type="button"
            onClick={onSelect}
            className="shrink-0 w-[140px] sm:w-[160px] text-left group"
        >
            <div className="relative aspect-[3/4] rounded-[12px] overflow-hidden bg-[var(--ms-raised)] mb-2.5">
                <img
                    src={url}
                    alt=""
                    className="size-full object-cover group-hover:opacity-90 transition-opacity duration-100"
                    loading="lazy"
                    onError={() => { if (url !== PICKER_FALLBACK) setUrl(PICKER_FALLBACK); }}
                />
                <div className="absolute top-2 right-2 flex gap-1">
                    <span className="size-6 rounded-full bg-black/50 flex items-center justify-center text-white/80">
                        <Maximize2 className="size-3" />
                    </span>
                    <span className="size-6 rounded-full bg-black/50 flex items-center justify-center text-white/80">
                        <VolumeX className="size-3" />
                    </span>
                </div>
            </div>
            <p className="text-sm font-bold truncate">{item.title}</p>
            <p className="text-xs text-[var(--ms-muted)] line-clamp-2 text-pretty mt-0.5">{item.description}</p>
        </button>
    );
}

function MarketingPickerModal({ config, onClose, onSelect }: MarketingPickerModalProps) {
    const [filter, setFilter] = useState('all');
    const [query, setQuery] = useState('');

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return config.items.filter(item => {
            const matchFilter = filter === 'all' || item.category === filter;
            const matchQuery = !q
                || item.title.toLowerCase().includes(q)
                || item.description.toLowerCase().includes(q);
            return matchFilter && matchQuery;
        });
    }, [config.items, filter, query]);

    useEffect(() => {
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = prev; };
    }, []);

    const modal = (
        <div className="ms ms-modal-overlay">
            <button
                type="button"
                className="ms-modal-backdrop"
                onClick={onClose}
                aria-label="Закрыть"
            />
            <div
                className="relative w-full sm:max-w-3xl max-h-[92dvh] sm:max-h-[88dvh] rounded-t-[var(--ms-radius-panel)] sm:rounded-[var(--ms-radius-panel)] ms-panel border-[var(--ms-hairline-strong)] overflow-hidden flex flex-col shadow-[var(--ms-shadow-composer)]"
                role="dialog"
                aria-modal="true"
                aria-labelledby="picker-title"
            >
                <div className="ms-grid-bg opacity-50" aria-hidden />

                <div className="relative shrink-0 px-5 pt-4 pb-3 flex items-center justify-between">
                    <span id="picker-title" className="text-sm text-[var(--ms-muted)]">{config.title}</span>
                    <button
                        type="button"
                        onClick={onClose}
                        className="size-8 rounded-full bg-[var(--ms-raised)] flex items-center justify-center text-[var(--ms-muted)] hover:text-white transition-colors duration-100"
                        aria-label="Закрыть"
                    >
                        <X className="size-4" />
                    </button>
                </div>

                <div className="relative shrink-0 px-5 pb-4 flex gap-4 items-start">
                    <div className="flex-1 min-w-0">
                        <h2 className="ms-font-display-section text-lg sm:text-xl text-[var(--ms-lime)] text-balance leading-tight mb-2">
                            {config.headline}
                        </h2>
                        <p className="text-sm text-[var(--ms-muted)] text-pretty leading-relaxed">{config.subtitle}</p>
                    </div>
                    <div className="hidden sm:flex shrink-0 w-[120px] h-[80px] relative">
                        <HeroImage src={config.heroImages[0]} className="absolute left-0 top-2 size-14 rounded-full object-cover border-2 border-[var(--ms-panel)]" />
                        <HeroImage src={config.heroImages[1]} className="absolute left-8 top-0 w-12 h-[72px] rounded-2xl object-cover border-2 border-[var(--ms-panel)]" />
                        <HeroImage src={config.heroImages[2]} className="absolute left-16 top-3 w-11 h-[64px] rounded-2xl object-cover border-2 border-[var(--ms-panel)] rotate-6" />
                    </div>
                </div>

                <div className="relative shrink-0 px-5 pb-3 space-y-3">
                    <div className="flex flex-wrap gap-2">
                        {config.filters.map(f => (
                            <button
                                key={f.id}
                                type="button"
                                onClick={() => setFilter(f.id)}
                                className={filter === f.id ? 'ms-filter-active' : 'ms-filter-inactive'}
                            >
                                {f.label}
                                {f.badge && <span className="ms-badge-new ml-1.5">{f.badge}</span>}
                            </button>
                        ))}
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[var(--ms-dim)]" />
                        <input
                            type="search"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder="Поиск"
                            className="w-full h-10 pl-10 pr-4 ms-input text-sm outline-none"
                        />
                    </div>
                </div>

                <div className="relative flex-1 overflow-x-auto overflow-y-hidden px-5 pb-5 custom-scrollbar">
                    <div className="flex gap-3 min-w-min">
                        {filtered.map(item => (
                            <PickerCard key={item.id} item={item} onSelect={() => onSelect(item)} />
                        ))}
                        {filtered.length === 0 && (
                            <p className="text-sm text-[var(--ms-muted)] py-8 text-pretty">Ничего не найдено</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    return createPortal(modal, document.body);
}

export default MarketingPickerModal;
