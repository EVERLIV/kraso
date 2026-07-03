import React, { useRef, useState, useCallback } from 'react';
import { ChevronsLeftRight } from 'lucide-react';

interface BeforeAfterCompareProps {
    before: string;
    after: string;
    className?: string;
    initialPosition?: number;
}

function BeforeAfterCompare({
    before, after, className = '', initialPosition = 50,
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
            className={`it-compare select-none ${className}`}
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

            <div className="it-compare__handle" style={{ left: `${pos}%` }}>
                <div className="it-compare__knob">
                    <ChevronsLeftRight className="size-4" strokeWidth={2.5} />
                </div>
            </div>
        </div>
    );
}

export default BeforeAfterCompare;
