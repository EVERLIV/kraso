import React, { useRef, useState, useCallback } from 'react';
import { ChevronsLeftRight } from 'lucide-react';

interface BeforeAfterCompareProps {
    before: string;
    after: string;
    className?: string;
    initialPosition?: number;
    showLabels?: boolean;
}

function BeforeAfterCompare({
    before, after, className = '', initialPosition = 50, showLabels = true,
}: BeforeAfterCompareProps) {
    const [pos, setPos] = useState(initialPosition);
    const ref = useRef<HTMLDivElement>(null);
    const dragging = useRef(false);

    const move = useCallback((clientX: number) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const pct = ((clientX - rect.left) / rect.width) * 100;
        setPos(Math.max(0, Math.min(100, pct)));
    }, []);

    const onPointerDown = (clientX: number) => {
        dragging.current = true;
        move(clientX);
    };

    return (
        <div
            ref={ref}
            className={`up-compare relative w-full aspect-[3/4] max-h-[min(72dvh,520px)] rounded-[var(--ms-radius-panel)] overflow-hidden border border-[var(--ms-hairline)] select-none cursor-ew-resize bg-[var(--ms-raised)] ${className}`}
            onMouseDown={e => onPointerDown(e.clientX)}
            onMouseMove={e => dragging.current && move(e.clientX)}
            onMouseUp={() => { dragging.current = false; }}
            onMouseLeave={() => { dragging.current = false; }}
            onTouchStart={e => onPointerDown(e.touches[0].clientX)}
            onTouchMove={e => move(e.touches[0].clientX)}
            role="slider"
            aria-label="Сравнение до и после"
            aria-valuenow={Math.round(pos)}
            aria-valuemin={0}
            aria-valuemax={100}
        >
            <img src={after} alt="" className="absolute inset-0 size-full object-cover" draggable={false} />
            <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
                <img
                    src={before}
                    alt=""
                    className="absolute inset-0 h-full max-w-none object-cover"
                    style={{ width: ref.current?.offsetWidth ?? '100%' }}
                    draggable={false}
                />
            </div>

            {showLabels && (
                <>
                    <span className="absolute top-3 left-3 text-[11px] font-semibold text-white bg-black/55 px-2 py-1 rounded-md">До</span>
                    <span className="absolute top-3 right-3 text-[11px] font-semibold text-[var(--ms-on-lime)] bg-[var(--ms-lime)] px-2 py-1 rounded-md">После</span>
                </>
            )}

            <div
                className="absolute top-0 bottom-0 w-px bg-white/90 pointer-events-none"
                style={{ left: `${pos}%` }}
            >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-9 rounded-full bg-white text-[var(--ms-on-lime)] flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.35)]">
                    <ChevronsLeftRight className="size-4" strokeWidth={2.5} />
                </div>
            </div>
        </div>
    );
}

export default BeforeAfterCompare;
