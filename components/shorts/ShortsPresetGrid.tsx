import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { SHORTS_VISUAL_PRESETS, ShortsVisualPreset } from '../../lib/shortsVisualPresets';

const FALLBACK = '/templates/market-tech-neon.webp';

interface ShortsPresetGridProps {
    selectedId: string | null;
    onSelect: (preset: ShortsVisualPreset) => void;
    onCreatePreset?: () => void;
    query?: string;
    onSearchChange?: (v: string) => void;
}

function PresetThumb({ src, className }: { src: string; className?: string }) {
    const [url, setUrl] = useState(src);
    return (
        <img
            src={url}
            alt=""
            className={className}
            loading="lazy"
            onError={() => { if (url !== FALLBACK) setUrl(FALLBACK); }}
        />
    );
}

function ShortsPresetGrid({ selectedId, onSelect, onCreatePreset, query = '', onSearchChange }: ShortsPresetGridProps) {
    const q = query.trim().toLowerCase();
    const filtered = SHORTS_VISUAL_PRESETS.filter(p =>
        !q || p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q),
    );

    return (
        <div className="relative px-4 md:px-10 pt-2 pb-[calc(5rem+env(safe-area-inset-bottom))] max-w-[1180px] mx-auto">
            <div className="mb-6 md:mb-8">
                <p className="text-xs font-bold uppercase text-[var(--ms-lime)] mb-2" style={{ letterSpacing: '0.28em' }}>
                    Shorts Studio
                </p>
                <h1 className="ms-font-display text-2xl sm:text-3xl leading-[0.94] text-balance">Визуальные пресеты</h1>
                <p className="text-sm text-[var(--ms-muted)] mt-2 text-pretty">Выберите стиль монтажа для вашего Short</p>
            </div>

            {onSearchChange && (
                <div className="relative max-w-sm mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[var(--ms-dim)]" />
                    <input
                        type="search"
                        value={query}
                        onChange={e => onSearchChange(e.target.value)}
                        placeholder="Поиск пресетов"
                        className="w-full h-10 pl-9 pr-3 ms-input text-sm outline-none"
                    />
                </div>
            )}

            <div className="ss-preset-grid !p-0">
                <button
                    type="button"
                    onClick={onCreatePreset}
                    className="ss-preset-card ss-preset-card--create ms-panel ms-slot--dashed shadow-[var(--ms-shadow-panel)]"
                >
                    <Plus className="size-7 text-[var(--ms-dim)]" />
                    <span className="text-xs font-bold uppercase text-center text-[var(--ms-body)] text-balance leading-tight">
                        Создать пресет из референсов
                    </span>
                    <span className="ms-btn-secondary px-4 py-2 text-xs">
                        Создать пресет
                    </span>
                </button>

                {filtered.map(preset => (
                    <button
                        key={preset.id}
                        type="button"
                        onClick={() => onSelect(preset)}
                        className={`ss-preset-card ${selectedId === preset.id ? 'ss-preset-card--active' : ''}`}
                    >
                        <PresetThumb src={preset.thumb} className="ss-preset-card__img" />
                        <span className="ss-preset-card__label">{preset.title}</span>
                    </button>
                ))}

                {filtered.length === 0 && (
                    <div className="col-span-full ms-panel p-8 text-center">
                        <p className="text-sm text-[var(--ms-muted)] text-pretty mb-4">Пресеты не найдены</p>
                        <button
                            type="button"
                            onClick={() => onSearchChange?.('')}
                            className="ms-btn-secondary px-4 py-2 text-sm"
                        >
                            Сбросить поиск
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ShortsPresetGrid;
