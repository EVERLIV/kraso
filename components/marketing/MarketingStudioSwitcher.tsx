import React, { useEffect, useRef, useState } from 'react';
import { ChevronsUpDown, Check, Sparkles, Clapperboard } from 'lucide-react';
import MarketingIconTile from './MarketingIconTile';
import { SHORTS_STUDIO_ENABLED } from '../../lib/featureFlags';

export type StudioId = 'shorts' | 'marketing' | 'krasomir';

const ALL_STUDIOS: { id: StudioId; label: string; tile: 'lime' | 'blue' | 'purple' }[] = [
    { id: 'shorts', label: 'Shorts Studio', tile: 'purple' },
    { id: 'marketing', label: 'Маркетинг Студия', tile: 'lime' },
    { id: 'krasomir', label: 'КрасоМир Студия', tile: 'blue' },
];

const STUDIOS = ALL_STUDIOS.filter(s => SHORTS_STUDIO_ENABLED || s.id !== 'shorts');

interface MarketingStudioSwitcherProps {
    current: StudioId;
    onSelect: (id: StudioId) => void;
}

function MarketingStudioSwitcher({ current, onSelect }: MarketingStudioSwitcherProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const currentStudio = STUDIOS.find(s => s.id === current) ?? STUDIOS[0];

    useEffect(() => {
        if (!open) return;
        const onClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', onClick);
        return () => document.removeEventListener('mousedown', onClick);
    }, [open]);

    return (
        <div ref={ref} className="relative mb-4">
            <button
                type="button"
                onClick={() => setOpen(v => !v)}
                className="flex items-center gap-2.5 w-full px-2 py-1.5 rounded-lg hover:bg-[var(--ms-raised)] transition-colors duration-100"
                aria-expanded={open}
                aria-haspopup="listbox"
            >
                <MarketingIconTile variant={currentStudio.tile} size="brand">
                    {current === 'shorts' ? (
                        <Clapperboard className="size-3 text-white" />
                    ) : current === 'marketing' ? (
                        <Sparkles className="size-3 text-[var(--ms-on-lime)]" />
                    ) : (
                        <span className="text-[9px] font-black text-white">К</span>
                    )}
                </MarketingIconTile>
                <span className="font-bold text-sm truncate">{currentStudio.label}</span>
                <ChevronsUpDown className="size-4 text-[var(--ms-dim)] ml-auto shrink-0" />
            </button>

            {open && (
                <div
                    className="absolute left-0 right-0 top-full mt-1 z-40 ms-panel p-1.5 shadow-[var(--ms-shadow-panel)]"
                    role="listbox"
                >
                    {STUDIOS.map(studio => (
                        <button
                            key={studio.id}
                            type="button"
                            role="option"
                            aria-selected={studio.id === current}
                            onClick={() => {
                                setOpen(false);
                                if (studio.id !== current) onSelect(studio.id);
                            }}
                            className={`flex items-center gap-2.5 w-full px-2.5 py-2 rounded-lg text-sm transition-colors duration-100 ${
                                studio.id === current
                                    ? 'bg-[var(--ms-raised)] font-semibold'
                                    : 'hover:bg-[var(--ms-raised)] text-[var(--ms-body)]'
                            }`}
                        >
                            <MarketingIconTile variant={studio.tile} size="nav">
                                {studio.id === 'shorts' ? (
                                    <Clapperboard className="size-2.5 text-white" />
                                ) : studio.id === 'marketing' ? (
                                    <Sparkles className="size-2.5 text-[var(--ms-on-lime)]" />
                                ) : (
                                    <span className="text-[9px] font-black text-white">К</span>
                                )}
                            </MarketingIconTile>
                            <span className="truncate">{studio.label}</span>
                            {studio.id === current && (
                                <Check className="size-3.5 text-[var(--ms-lime)] ml-auto shrink-0" />
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MarketingStudioSwitcher;
