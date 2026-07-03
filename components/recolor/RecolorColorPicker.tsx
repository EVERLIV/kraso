import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

const DEFAULT_COLORS = ['#D6F520', '#FF3E8E', '#4DA3FF', '#E8D5B7', '#1A1A2E', '#FFFFFF', '#8B6914', '#2C0A1F'];

interface RecolorColorPickerProps {
    open: boolean;
    colors: string[];
    onChange: (colors: string[]) => void;
    onClose: () => void;
    onApply: () => void;
}

function RecolorColorPicker({ open, colors, onChange, onClose, onApply }: RecolorColorPickerProps) {
    useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = prev; };
    }, [open]);

    if (!open) return null;

    const slots = [...colors];
    while (slots.length < 8) slots.push(DEFAULT_COLORS[slots.length % DEFAULT_COLORS.length]);

    const updateColor = (index: number, hex: string) => {
        const next = [...colors];
        while (next.length <= index) next.push(DEFAULT_COLORS[next.length % DEFAULT_COLORS.length]);
        next[index] = hex;
        onChange(next.slice(0, 8));
    };

    const modal = (
        <div className="is is-overlay">
            <button type="button" className="is-overlay-backdrop" onClick={onClose} aria-label="Закрыть" />
            <div className="is-modal relative z-10 w-full max-w-md p-6" role="dialog" aria-modal="true">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="is-display text-lg">Палитра цветов</h2>
                    <button type="button" onClick={onClose} className="is-modal-close is-modal-close--inline" aria-label="Закрыть">
                        <X className="size-3.5" />
                    </button>
                </div>
                <p className="text-sm text-[var(--is-muted)] text-pretty mb-4">
                    Нажмите на ячейку, чтобы выбрать цвет.
                </p>
                <div className="grid grid-cols-4 gap-2 mb-4">
                    {slots.slice(0, 8).map((c, i) => (
                        <label
                            key={i}
                            className="aspect-square rounded-xl border border-[var(--is-hairline)] overflow-hidden relative cursor-pointer"
                            style={{ background: colors[i] ?? c }}
                        >
                            <input
                                type="color"
                                value={colors[i] ?? c}
                                onChange={e => updateColor(i, e.target.value)}
                                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                                aria-label={`Цвет ${i + 1}`}
                            />
                        </label>
                    ))}
                </div>
                <div className="is-preset-ribbon mb-5 rounded overflow-hidden">
                    {(colors.length ? colors : slots).slice(0, 8).map((c, i) => (
                        <span key={i} style={{ background: c }} />
                    ))}
                </div>
                <button type="button" onClick={onApply} className="is-btn-upload w-full justify-center">
                    Применить палитру
                </button>
            </div>
        </div>
    );

    return createPortal(modal, document.body);
}

export default RecolorColorPicker;
