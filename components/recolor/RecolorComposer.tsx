import React, { useState } from 'react';
import {
    Loader2, Plus, Pencil, ChevronRight, Check, X,
    Sparkles, Smartphone, Gem, Minus, Palette,
} from 'lucide-react';
import { AspectRatio, ImageResolution } from '../../types';
import { PhotoStyle } from '../../lib/recolorPresets';
import { KrasoModelId, getKrasoModel, KRASO_MODELS } from '../../lib/krasoModels';

const RATIOS: AspectRatio[] = ['9:16', '3:4', '4:5', '1:1', '4:3', '16:9'];
const RESOLUTIONS: ImageResolution[] = ['1K', '2K', '4K'];

function formatResolution(r: ImageResolution): string {
    return r.toLowerCase();
}

interface RecolorComposerProps {
    prompt: string;
    onPromptChange: (v: string) => void;
    promptReferences: string[];
    onRemovePromptReference: (index: number) => void;
    characterImage: string | null;
    selectedStyle: PhotoStyle | null;
    krasoModelId: KrasoModelId;
    onKrasoModelChange: (id: KrasoModelId) => void;
    colorLabel: string | null;
    colorActive: boolean;
    colorSwatches: string[];
    onOpenStyles: () => void;
    onOpenPalette: () => void;
    onPickCharacter: () => void;
    onRemoveCharacter: () => void;
    onPickPromptReference: () => void;
    aspectRatio: AspectRatio;
    onAspectRatioChange: (r: AspectRatio) => void;
    resolution: ImageResolution;
    onResolutionChange: (r: ImageResolution) => void;
    batchCount: number;
    onBatchChange: (n: number) => void;
    loading: boolean;
    error: string | null;
    credits: number;
    onGenerate: () => void;
    canGenerate: boolean;
}

function RecolorComposer({
    prompt, onPromptChange, promptReferences, onRemovePromptReference,
    characterImage, selectedStyle, krasoModelId, onKrasoModelChange, colorLabel, colorActive, colorSwatches, onOpenStyles, onOpenPalette,
    onPickCharacter, onRemoveCharacter, onPickPromptReference,
    aspectRatio, onAspectRatioChange, resolution, onResolutionChange,
    batchCount, onBatchChange, loading, error, credits, onGenerate, canGenerate,
}: RecolorComposerProps) {
    const [ratioOpen, setRatioOpen] = useState(false);
    const [resolutionOpen, setResolutionOpen] = useState(false);
    const [modelOpen, setModelOpen] = useState(false);
    const activeModel = getKrasoModel(krasoModelId);

    const closeMenus = () => {
        setRatioOpen(false);
        setResolutionOpen(false);
        setModelOpen(false);
    };

    const removeCharacter = (e: React.MouseEvent) => {
        e.stopPropagation();
        onRemoveCharacter();
    };

    const removePromptRef = (e: React.MouseEvent, index: number) => {
        e.stopPropagation();
        onRemovePromptReference(index);
    };

    return (
        <div className="is-prompt-bar">
            <div className="is-prompt-bar__body">
                <div className="is-prompt-bar__main">
                    <div className="is-prompt-row">
                        <div className="is-prompt-refs" aria-label="Референсы">
                            {promptReferences.slice(0, 4).map((src, i) => (
                                <div key={`${src}-${i}`} className="is-prompt-ref">
                                    <img src={src} alt="" />
                                    <button
                                        type="button"
                                        onClick={e => removePromptRef(e, i)}
                                        className="is-media-remove"
                                        aria-label="Убрать референс"
                                    >
                                        <X className="size-2.5" strokeWidth={3} />
                                    </button>
                                </div>
                            ))}
                            {promptReferences.length < 4 && (
                                <button
                                    type="button"
                                    onClick={onPickPromptReference}
                                    className="is-add-tile"
                                    aria-label="Добавить референс в промпт"
                                >
                                    <Plus className="size-5" strokeWidth={1.75} />
                                </button>
                            )}
                        </div>
                        <input
                            type="text"
                            value={prompt}
                            onChange={e => onPromptChange(e.target.value)}
                            placeholder="Опишите сцену, которую представляете…"
                            aria-label="Промпт для генерации"
                            enterKeyHint="send"
                            autoComplete="off"
                            className="is-prompt-input"
                        />
                    </div>

                    <div className="is-controls-row">
                        <div className="is-controls-left">
                    <div className="relative shrink-0">
                        <button
                            type="button"
                            onClick={() => { setModelOpen(v => !v); setRatioOpen(false); setResolutionOpen(false); }}
                            className="is-chip"
                            aria-expanded={modelOpen}
                            aria-haspopup="listbox"
                            aria-label={`Модель ${activeModel.label}`}
                        >
                            <Sparkles className="size-3.5 text-[var(--is-lime)]" strokeWidth={2} />
                            <span className="truncate max-w-[8rem]">{activeModel.label}</span>
                            <ChevronRight className={`size-3.5 text-[var(--is-muted)] transition-transform ${modelOpen ? 'rotate-90' : ''}`} strokeWidth={2} />
                        </button>
                        {modelOpen && (
                            <>
                                <button type="button" className="is-menu-backdrop" onClick={closeMenus} aria-label="Закрыть меню" />
                                <div className="is-menu" role="listbox" aria-label="Модель">
                                    <p className="is-menu__label">Модель</p>
                                    {KRASO_MODELS.map(m => (
                                        <button
                                            key={m.id}
                                            type="button"
                                            role="option"
                                            aria-selected={krasoModelId === m.id}
                                            title={m.description}
                                            onClick={() => { onKrasoModelChange(m.id); setModelOpen(false); }}
                                            className={`is-menu__item${krasoModelId === m.id ? ' is-menu__item--active' : ''}`}
                                        >
                                            <Sparkles className="size-3.5 shrink-0" strokeWidth={2} />
                                            <span className="flex-1 text-left truncate">{m.label}</span>
                                            {m.badge && (
                                                <span className="is-menu__badge">{m.badge}</span>
                                            )}
                                            {krasoModelId === m.id && <Check className="size-4 shrink-0" strokeWidth={3} />}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    <div className="relative shrink-0">
                        <button
                            type="button"
                            onClick={() => { setRatioOpen(v => !v); setResolutionOpen(false); }}
                            className="is-chip"
                            aria-expanded={ratioOpen}
                            aria-haspopup="listbox"
                            aria-label={`Формат ${aspectRatio}`}
                        >
                            <Smartphone className="size-3.5 text-[var(--is-muted)]" strokeWidth={2} />
                            <span className="tabular-nums">{aspectRatio}</span>
                        </button>
                        {ratioOpen && (
                            <>
                                <button type="button" className="is-menu-backdrop" onClick={closeMenus} aria-label="Закрыть меню" />
                                <div className="is-menu" role="listbox" aria-label="Формат">
                                    <p className="is-menu__label">Формат</p>
                                    {RATIOS.map(r => (
                                        <button
                                            key={r}
                                            type="button"
                                            role="option"
                                            aria-selected={aspectRatio === r}
                                            onClick={() => { onAspectRatioChange(r); setRatioOpen(false); }}
                                            className={`is-menu__item${aspectRatio === r ? ' is-menu__item--active' : ''}`}
                                        >
                                            <Smartphone className="size-3.5 shrink-0" strokeWidth={2} />
                                            <span className="flex-1 text-left tabular-nums">{r}</span>
                                            {aspectRatio === r && <Check className="size-4 shrink-0" strokeWidth={3} />}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    <div className="relative shrink-0">
                        <button
                            type="button"
                            onClick={() => { setResolutionOpen(v => !v); setRatioOpen(false); }}
                            className="is-chip"
                            aria-expanded={resolutionOpen}
                            aria-haspopup="listbox"
                            aria-label={`Разрешение ${formatResolution(resolution)}`}
                        >
                            <Gem className="size-3.5 text-[var(--is-muted)]" strokeWidth={2} />
                            <span className="tabular-nums">{formatResolution(resolution)}</span>
                        </button>
                        {resolutionOpen && (
                            <>
                                <button type="button" className="is-menu-backdrop" onClick={closeMenus} aria-label="Закрыть меню" />
                                <div className="is-menu is-menu--narrow" role="listbox" aria-label="Разрешение">
                                    <p className="is-menu__label">Разрешение</p>
                                    {RESOLUTIONS.map(r => (
                                        <button
                                            key={r}
                                            type="button"
                                            role="option"
                                            aria-selected={resolution === r}
                                            onClick={() => { onResolutionChange(r); setResolutionOpen(false); }}
                                            className={`is-menu__item${resolution === r ? ' is-menu__item--active' : ''}`}
                                        >
                                            <Gem className="size-3.5 shrink-0" strokeWidth={2} />
                                            <span className="flex-1 text-left tabular-nums">{formatResolution(r)}</span>
                                            {resolution === r && <Check className="size-4 shrink-0" strokeWidth={3} />}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    <div className="is-stepper tabular-nums" role="group" aria-label="Количество в пакете">
                        <button type="button" onClick={() => onBatchChange(Math.max(1, batchCount - 1))} aria-label="Уменьшить">
                            <Minus className="size-4" strokeWidth={2} />
                        </button>
                        <span>{batchCount}<span className="text-[var(--is-muted)]">/4</span></span>
                        <button type="button" onClick={() => onBatchChange(Math.min(4, batchCount + 1))} aria-label="Увеличить">
                            <Plus className="size-4" strokeWidth={2} />
                        </button>
                    </div>

                    <button
                        type="button"
                        onClick={onOpenPalette}
                        className={`is-chip${colorActive ? ' is-chip--active' : ''}`}
                        aria-pressed={colorActive}
                        aria-label={colorActive ? `Палитра: ${colorLabel}` : 'Перенос цвета'}
                    >
                        {colorActive && colorSwatches.length ? (
                            <span className="is-chip__swatches" aria-hidden>
                                {colorSwatches.slice(0, 6).map((c, i) => (
                                    <span key={i} style={{ backgroundColor: c }} />
                                ))}
                            </span>
                        ) : (
                            <Palette className="size-3.5" strokeWidth={2} />
                        )}
                        {colorActive && colorLabel ? colorLabel : 'Перенос цвета'}
                    </button>
                        </div>
                    </div>
                </div>

                <aside className="is-controls-right" aria-label="Персонаж и генерация">
                    <div className="is-char-tile-wrap">
                        <button
                            type="button"
                            onClick={onPickCharacter}
                            className={`is-char-tile${characterImage ? ' is-char-tile--filled' : ''}`}
                            aria-label={characterImage ? 'Заменить персонажа' : 'Добавить персонажа'}
                        >
                            {!characterImage && (
                                <span className="is-char-tile__add" aria-hidden>
                                    <Plus className="size-3.5" strokeWidth={2} />
                                </span>
                            )}
                            {characterImage && (
                                <img src={characterImage} alt="" className="is-char-tile__img" />
                            )}
                            <span className="is-char-label">Персонаж</span>
                        </button>
                        {characterImage && (
                            <button
                                type="button"
                                onClick={removeCharacter}
                                className="is-media-remove is-media-remove--char"
                                aria-label="Удалить персонажа"
                            >
                                <X className="size-2.5" strokeWidth={3} />
                            </button>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={onOpenStyles}
                        className={`is-avatar-card${selectedStyle ? '' : ' is-avatar-card--empty'}`}
                        aria-label={selectedStyle ? `Шаблон: ${selectedStyle.title}` : 'Выбрать шаблон'}
                    >
                        {selectedStyle?.thumb && (
                            <img src={selectedStyle.thumb} alt="" className="is-avatar-card__img" />
                        )}
                        <span className="is-avatar-card__change">
                            <Pencil className="size-2.5" strokeWidth={2} aria-hidden /> Изменить
                        </span>
                        <span className="is-avatar-card__tag">
                            {(selectedStyle?.title || 'Базовый').toUpperCase()}
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={onGenerate}
                        disabled={loading || !canGenerate}
                        className="is-btn-generate"
                    >
                        {loading ? (
                            <Loader2 className="size-5 motion-safe:animate-spin motion-reduce:animate-none" aria-label="Генерация" />
                        ) : (
                            <>Создать</>
                        )}
                    </button>
                </aside>
            </div>

            {error && (
                <p className="is-prompt-bar__error text-pretty" role="alert">{error}</p>
            )}
        </div>
    );
}

export default RecolorComposer;
