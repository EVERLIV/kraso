import React, { useMemo, useState } from 'react';
import { X, Search, Check, Sparkles } from 'lucide-react';
import { PHOTO_STYLES, PhotoStyle } from '../../lib/recolorPresets';

interface StyleTemplatePanelProps {
    selectedStyleId: string | null;
    onSelectStyle: (style: PhotoStyle) => void;
    onClose: () => void;
}

type Tab = 'curated' | 'mine';

function StyleTemplatePanel({ selectedStyleId, onSelectStyle, onClose }: StyleTemplatePanelProps) {
    const [tab, setTab] = useState<Tab>('curated');
    const [query, setQuery] = useState('');

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return PHOTO_STYLES;
        return PHOTO_STYLES.filter(style => style.title.toLowerCase().includes(q));
    }, [query]);

    return (
        <div className="is-styles" role="dialog" aria-labelledby="styles-title">
            <div className="is-styles__hero">
                <div className="is-styles__hero-copy">
                    <h2 id="styles-title" className="is-styles__hero-title is-display">
                        Шаблоны для фото
                    </h2>
                    <p className="is-styles__hero-sub text-pretty">
                        Выберите готовый стиль фотосессии — свет, тон и настроение применятся к вашему фото.
                    </p>
                </div>
                <button type="button" className="is-styles__close" onClick={onClose} aria-label="Закрыть шаблоны">
                    <X className="size-4" strokeWidth={2} />
                </button>
            </div>

            <div className="is-styles__toolbar">
                <nav className="is-styles__tabs" aria-label="Категории">
                    <button
                        type="button"
                        className={`is-styles__tab${tab === 'curated' ? ' is-styles__tab--active' : ''}`}
                        onClick={() => setTab('curated')}
                        aria-pressed={tab === 'curated'}
                    >
                        Curated
                    </button>
                    <button
                        type="button"
                        className={`is-styles__tab${tab === 'mine' ? ' is-styles__tab--active' : ''}`}
                        onClick={() => setTab('mine')}
                        aria-pressed={tab === 'mine'}
                    >
                        Мои
                    </button>
                </nav>

                <div className="is-styles__search">
                    <Search className="is-styles__search-icon size-3.5" strokeWidth={2} aria-hidden />
                    <input
                        type="search"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Поиск шаблонов…"
                        className="is-styles__search-input"
                        aria-label="Поиск шаблонов"
                    />
                </div>
            </div>

            {tab === 'mine' ? (
                <div className="is-styles__empty">
                    <span className="is-styles__empty-icon" aria-hidden>
                        <Sparkles className="size-5" strokeWidth={1.75} />
                    </span>
                    <p className="is-styles__empty-title">Пока пусто</p>
                    <p className="is-styles__empty-sub text-pretty">
                        Здесь появятся стили, которые вы соберёте сами.
                    </p>
                </div>
            ) : (
                <div className="is-styles__grid custom-scrollbar">
                    {filtered.map(style => {
                        const active = selectedStyleId === style.id;
                        return (
                            <div key={style.id} className="is-styles__item">
                                <button
                                    type="button"
                                    className={`is-styles__card${active ? ' is-styles__card--active' : ''}`}
                                    onClick={() => onSelectStyle(style)}
                                    aria-pressed={active}
                                    aria-label={`Стиль: ${style.title}`}
                                >
                                    <img src={style.thumb} alt="" className="is-styles__thumb" loading="lazy" />
                                    {active && (
                                        <span className="is-styles__check" aria-hidden>
                                            <Check className="size-4" strokeWidth={3} />
                                        </span>
                                    )}
                                </button>
                                <span className="is-styles__name">{style.title}</span>
                            </div>
                        );
                    })}
                    {filtered.length === 0 && (
                        <p className="is-styles__noresult text-pretty">Ничего не найдено по запросу «{query}».</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default StyleTemplatePanel;
