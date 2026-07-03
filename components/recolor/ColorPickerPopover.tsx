import React from 'react';
import { createPortal } from 'react-dom';
import { HexColorPicker, HexColorInput } from 'react-colorful';
import { Pipette } from 'lucide-react';

declare global {
    interface Window {
        EyeDropper?: new () => { open: () => Promise<{ sRGBHex: string }> };
    }
}

interface ColorPickerPopoverProps {
    color: string;
    isBackground: boolean;
    anchorRect: DOMRect;
    onChange: (hex: string) => void;
    onToggleBackground: (value: boolean) => void;
    onClose: () => void;
}

const CARD_WIDTH = 320;
const GAP = 10;

function ColorPickerPopover({
    color, isBackground, anchorRect, onChange, onToggleBackground, onClose,
}: ColorPickerPopoverProps) {
    const supportsEyeDropper = typeof window !== 'undefined' && 'EyeDropper' in window;

    const pickFromScreen = async () => {
        if (!window.EyeDropper) return;
        try {
            const result = await new window.EyeDropper().open();
            onChange(result.sRGBHex);
        } catch {
            /* user cancelled */
        }
    };

    const left = Math.min(
        Math.max(anchorRect.left + anchorRect.width / 2 - CARD_WIDTH / 2, 8),
        window.innerWidth - CARD_WIDTH - 8,
    );
    const bottom = window.innerHeight - anchorRect.top + GAP;

    return createPortal(
        <>
            <button
                type="button"
                className="is-cpick-backdrop"
                onClick={onClose}
                aria-label="Закрыть выбор цвета"
            />
            <div
                className="is-cpick"
                role="dialog"
                aria-label="Выбор цвета"
                style={{ left, bottom, width: CARD_WIDTH }}
            >
                <div className="is-cpick__canvas">
                    <HexColorPicker color={color} onChange={onChange} />
                </div>

                <div className="is-cpick__row">
                    <div className="is-cpick__hex">
                        <HexColorInput
                            color={color}
                            onChange={onChange}
                            prefixed
                            className="is-cpick__hex-input"
                            aria-label="HEX-код цвета"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={pickFromScreen}
                        disabled={!supportsEyeDropper}
                        className="is-cpick__eyedropper"
                        aria-label="Взять цвет с экрана"
                    >
                        <Pipette className="size-4" strokeWidth={1.75} />
                    </button>
                </div>

                <label className="is-cpick__toggle">
                    <span className="is-cpick__toggle-label">Использовать как фон</span>
                    <input
                        type="checkbox"
                        role="switch"
                        checked={isBackground}
                        onChange={e => onToggleBackground(e.target.checked)}
                        className="is-cpick__switch-input"
                    />
                    <span className="is-cpick__switch" aria-hidden />
                </label>
            </div>
        </>,
        document.body,
    );
}

export default ColorPickerPopover;
