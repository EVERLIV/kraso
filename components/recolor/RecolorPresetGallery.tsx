import React from 'react';
import { RECOLOR_PRESETS, RecolorPreset } from '../../lib/recolorPresets';

interface RecolorPresetGalleryProps {
    selectedId: string | null;
    onSelect: (preset: RecolorPreset) => void;
}

function RecolorPresetGallery({ selectedId, onSelect }: RecolorPresetGalleryProps) {
    return (
        <div className="is-preset-strip">
            <div className="flex gap-[18px] overflow-x-auto no-scrollbar pb-1 snap-x snap-mandatory">
                {RECOLOR_PRESETS.map(preset => (
                    <button
                        key={preset.id}
                        type="button"
                        onClick={() => onSelect(preset)}
                        className={`is-preset-card snap-start${selectedId === preset.id ? ' is-preset-card--active' : ''}`}
                        aria-pressed={selectedId === preset.id}
                    >
                        <div className="is-preset-thumb-wrap">
                            <img
                                src={preset.thumb}
                                alt=""
                                className="is-preset-thumb"
                                loading="lazy"
                            />
                            <div className="is-preset-ribbon" aria-hidden>
                                {preset.colors.map((c, i) => (
                                    <span key={i} style={{ backgroundColor: c }} />
                                ))}
                            </div>
                        </div>
                        <p className="is-preset-name">{preset.title}</p>
                    </button>
                ))}
            </div>
        </div>
    );
}

export default RecolorPresetGallery;
