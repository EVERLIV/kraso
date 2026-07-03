import React from 'react';
import { Play } from 'lucide-react';
import { VIDEO_MOTION_PRESETS, VideoMotionPreset } from '../lib/videoPresets';

interface VideoPresetGridProps {
    onSelect: (preset: VideoMotionPreset) => void;
    selectedId?: string | null;
    compact?: boolean;
}

function VideoPresetGrid({ onSelect, selectedId, compact }: VideoPresetGridProps) {
    return (
        <div className={`grid gap-2 ${compact ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'}`}>
            {VIDEO_MOTION_PRESETS.map(preset => {
                const active = selectedId === preset.id;
                return (
                    <button
                        key={preset.id}
                        type="button"
                        onClick={() => onSelect(preset)}
                        className={`group relative aspect-[4/5] rounded-xl overflow-hidden border text-left transition-colors duration-100 ${
                            active ? 'border-primary ring-1 ring-primary' : 'border-[var(--border-color)] hover:border-ink-faint'
                        }`}
                    >
                        {preset.thumb ? (
                            <img src={preset.thumb} alt="" className="absolute inset-0 size-full object-cover opacity-70 group-hover:opacity-90 transition-opacity duration-100" loading="lazy" />
                        ) : (
                            <div className="absolute inset-0 bg-surface-muted" />
                        )}
                        <div className="absolute inset-0 bg-black/45" />
                        <div className="absolute inset-0 p-3 flex flex-col justify-end">
                            <span className="size-7 rounded-lg bg-black/50 flex items-center justify-center mb-2">
                                <Play className="size-3.5 text-white fill-white" />
                            </span>
                            <p className="text-sm font-bold text-white text-balance leading-tight">{preset.title}</p>
                            <p className="text-[11px] text-white/70 text-pretty line-clamp-2 mt-0.5">{preset.description}</p>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}

export default VideoPresetGrid;
