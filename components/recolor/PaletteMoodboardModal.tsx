import React, { useState } from 'react';
import { X, ChevronLeft, Plus, Blend, Shuffle, ImagePlus } from 'lucide-react';
import {
    DEFAULT_MANUAL_COLORS, MAX_PALETTE_COLORS, generateRandomPalettes,
    COLOR_PALETTES, ColorPalette,
} from '../../lib/recolorPresets';
import ColorPickerPopover from './ColorPickerPopover';

type Step = 'presets' | 'choose' | 'manual';

interface PalettePanelProps {
    initialColors: string[];
    selectedPaletteId: string | null;
    onSelectPalette: (palette: ColorPalette) => void;
    onReset: () => void;
    onClose: () => void;
    onUploadReference: () => void;
    onApplyManual: (colors: string[], backgroundColor: string | null) => void;
}

function PalettePanel({
    initialColors, selectedPaletteId, onSelectPalette, onReset, onClose, onUploadReference, onApplyManual,
}: PalettePanelProps) {
    const [step, setStep] = useState<Step>('presets');
    const [colors, setColors] = useState<string[]>(
        initialColors.length ? initialColors.slice(0, MAX_PALETTE_COLORS) : DEFAULT_MANUAL_COLORS,
    );
    const [bgIndex, setBgIndex] = useState<number | null>(null);
    const [randomPalettes, setRandomPalettes] = useState<string[][]>(() => generateRandomPalettes(4));
    const [picker, setPicker] = useState<{ index: number; rect: DOMRect } | null>(null);

    const updateColor = (index: number, hex: string) => {
        setColors(prev => prev.map((c, i) => (i === index ? hex.toUpperCase() : c)));
    };

    const addColor = () => {
        setColors(prev => (prev.length >= MAX_PALETTE_COLORS ? prev : [...prev, '#FFFFFF']));
    };

    const removeColor = (index: number) => {
        setColors(prev => prev.filter((_, i) => i !== index));
        setBgIndex(prev => (prev === null ? null : prev === index ? null : prev > index ? prev - 1 : prev));
        setPicker(null);
    };

    const backgroundColor = bgIndex !== null ? colors[bgIndex] ?? null : null;

    const subtitle = step === 'presets'
        ? 'Выберите палитру или создайте свою'
        : step === 'choose'
            ? 'Загрузите фото или создайте палитру вручную'
            : 'Соберите палитру вручную';

    return (
        <div className="is-hex" role="dialog" aria-labelledby="hex-title">
            <header className="is-hex__head">
                {step === 'presets' ? (
                    <span className="is-hex__nav-spacer" aria-hidden />
                ) : (
                    <button
                        type="button"
                        className="is-hex__nav"
                        onClick={() => setStep(step === 'manual' ? 'choose' : 'presets')}
                        aria-label="Назад"
                    >
                        <ChevronLeft className="size-4" strokeWidth={2} />
                    </button>
                )}

                <div className="is-hex__titles">
                    <h2 id="hex-title" className="is-hex__title text-balance">Цветовая палитра</h2>
                    <p className="is-hex__subtitle text-pretty">{subtitle}</p>
                </div>

                {step === 'manual' ? (
                    <button
                        type="button"
                        className="is-hex__save"
                        onClick={() => onApplyManual(colors, backgroundColor)}
                        disabled={colors.length === 0}
                    >
                        Сохранить
                    </button>
                ) : (
                    <button type="button" className="is-hex__nav" onClick={onClose} aria-label="Закрыть">
                        <X className="size-4" strokeWidth={2} />
                    </button>
                )}
            </header>

            {step === 'presets' && (
                <div className="is-hex__presets">
                    <div className="is-hex__presets-bar">
                        <span className="is-hex__presets-label">Пресеты</span>
                        <button type="button" className="is-hex__create" onClick={() => setStep('choose')}>
                            <Plus className="size-3.5" strokeWidth={2.25} />
                            Создать свою палитру
                        </button>
                    </div>
                    <div className="is-swatch-grid">
                        <button
                            type="button"
                            onClick={() => { onReset(); onClose(); }}
                            className={`is-swatch-card is-swatch-card--reset${selectedPaletteId === null ? ' is-swatch-card--active' : ''}`}
                            aria-pressed={selectedPaletteId === null}
                        >
                            <span className="is-swatch-card__reset-icon" aria-hidden>
                                <X className="size-4" strokeWidth={2} />
                            </span>
                            <span className="is-swatch-card__name">Оригинал</span>
                        </button>
                        {COLOR_PALETTES.map(palette => (
                            <button
                                key={palette.id}
                                type="button"
                                onClick={() => { onSelectPalette(palette); onClose(); }}
                                className={`is-swatch-card${selectedPaletteId === palette.id ? ' is-swatch-card--active' : ''}`}
                                aria-pressed={selectedPaletteId === palette.id}
                            >
                                <span className="is-swatch-card__ribbon" aria-hidden>
                                    {palette.colors.map((c, i) => (
                                        <span key={i} style={{ backgroundColor: c }} />
                                    ))}
                                </span>
                                <span className="is-swatch-card__name">{palette.title}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {step === 'choose' && (
                <div className="is-hex__choices">
                    <button
                        type="button"
                        className="is-hex__choice"
                        onClick={() => { onUploadReference(); onClose(); }}
                    >
                        <span className="is-hex__choice-icon" aria-hidden>
                            <ImagePlus className="size-5" strokeWidth={1.75} />
                        </span>
                        <span className="is-hex__choice-title">Загрузить с устройства</span>
                        <span className="is-hex__choice-sub text-pretty">
                            Распознаем палитру с вашего фото
                        </span>
                    </button>

                    <button type="button" className="is-hex__choice" onClick={() => setStep('manual')}>
                        <span className="is-hex__choice-icon" aria-hidden>
                            <Blend className="size-5" strokeWidth={1.75} />
                        </span>
                        <span className="is-hex__choice-title">Выбрать цвета вручную</span>
                        <span className="is-hex__choice-sub text-pretty">
                            Соберите свою палитру из цветов
                        </span>
                    </button>
                </div>
            )}

            {step === 'manual' && (
                <div className="is-hex__manual">
                    <section className="is-hex__card">
                        <div className="is-hex__card-head">
                            <h3 className="is-hex__card-title">Текущая палитра</h3>
                            <button
                                type="button"
                                className="is-hex__clear"
                                onClick={() => setColors([])}
                                disabled={colors.length === 0}
                            >
                                Очистить всё
                            </button>
                        </div>
                        <div className="is-hex__swatches">
                            <button
                                type="button"
                                className="is-hex__swatch-add"
                                onClick={addColor}
                                disabled={colors.length >= MAX_PALETTE_COLORS}
                                aria-label="Добавить цвет"
                            >
                                <Plus className="size-4" strokeWidth={2} />
                            </button>
                            {colors.map((color, i) => (
                                <div key={i} className="is-hex__swatch">
                                    <button
                                        type="button"
                                        className="is-hex__swatch-btn"
                                        style={{ backgroundColor: color }}
                                        onClick={e => setPicker({ index: i, rect: e.currentTarget.getBoundingClientRect() })}
                                        aria-label={`Цвет ${i + 1}: ${color}. Нажмите, чтобы изменить`}
                                    >
                                        {bgIndex === i && <span className="is-hex__swatch-bg">BG</span>}
                                    </button>
                                    <button
                                        type="button"
                                        className="is-hex__swatch-remove"
                                        onClick={() => removeColor(i)}
                                        aria-label={`Удалить цвет ${i + 1}`}
                                    >
                                        <X className="size-3" strokeWidth={2.5} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <p className="is-hex__hint text-pretty">
                            {colors.length === 0
                                ? 'Палитра пуста — нажмите «＋», чтобы добавить цвет.'
                                : 'Нажмите на кружок, чтобы открыть пикер, или «×», чтобы удалить.'}
                        </p>
                    </section>

                    <section className="is-hex__card">
                        <div className="is-hex__card-head">
                            <h3 className="is-hex__card-title">Случайные палитры</h3>
                            <button
                                type="button"
                                className="is-hex__nav is-hex__nav--sm"
                                onClick={() => setRandomPalettes(generateRandomPalettes(4))}
                                aria-label="Сгенерировать заново"
                            >
                                <Shuffle className="size-4" strokeWidth={2} />
                            </button>
                        </div>
                        <div className="is-hex__random">
                            {randomPalettes.map((palette, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    className="is-hex__random-row"
                                    onClick={() => { setColors(palette.slice(0, MAX_PALETTE_COLORS)); setBgIndex(null); }}
                                    aria-label={`Применить палитру ${i + 1}`}
                                >
                                    {palette.map((color, j) => (
                                        <span key={j} style={{ backgroundColor: color }} />
                                    ))}
                                </button>
                            ))}
                        </div>
                    </section>
                </div>
            )}

            {picker && colors[picker.index] !== undefined && (
                <ColorPickerPopover
                    color={colors[picker.index]}
                    isBackground={bgIndex === picker.index}
                    anchorRect={picker.rect}
                    onChange={hex => updateColor(picker.index, hex)}
                    onToggleBackground={value => setBgIndex(value ? picker.index : null)}
                    onClose={() => setPicker(null)}
                />
            )}
        </div>
    );
}

export default PalettePanel;
