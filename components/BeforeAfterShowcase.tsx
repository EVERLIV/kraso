import React, { useRef, useState, useCallback } from 'react';

interface ShowcaseItem {
    title: string;
    subtitle: string;
    before: string;
    after: string;
}

const ITEMS: ShowcaseItem[] = [
    {
        title: 'Семейная фотосессия',
        subtitle: 'Студийный кадр из обычного домашнего фото — за секунды.',
        before: '/landing/family-before.webp',
        after: '/landing/family-after.webp',
    },
    {
        title: 'Фото на документы',
        subtitle: 'Ровный фон, свет и деловой вид — без похода в студию.',
        before: '/landing/docs-before.webp',
        after: '/landing/docs-after.webp',
    },
    {
        title: 'Детская фотосессия',
        subtitle: 'Яркие, живые портреты детей в профессиональном качестве.',
        before: '/landing/kids-before.webp',
        after: '/landing/kids-after.webp',
    },
];

function Slider({ item }: { item: ShowcaseItem }) {
    const [pos, setPos] = useState(50);
    const ref = useRef<HTMLDivElement>(null);
    const dragging = useRef(false);

    const move = useCallback((clientX: number) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const pct = ((clientX - rect.left) / rect.width) * 100;
        setPos(Math.max(0, Math.min(100, pct)));
    }, []);

    return (
        <div
            ref={ref}
            className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden border border-[var(--border-color)] select-none cursor-ew-resize bg-surface-muted"
            onMouseDown={(e) => { dragging.current = true; move(e.clientX); }}
            onMouseMove={(e) => dragging.current && move(e.clientX)}
            onMouseUp={() => (dragging.current = false)}
            onMouseLeave={() => (dragging.current = false)}
            onTouchStart={(e) => move(e.touches[0].clientX)}
            onTouchMove={(e) => move(e.touches[0].clientX)}
        >
            {/* After (full) */}
            <img src={item.after} alt="После" className="absolute inset-0 w-full h-full object-cover" draggable={false} />
            {/* Before (clipped) */}
            <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
                <img src={item.before} alt="До" className="absolute inset-0 h-full object-cover" style={{ width: ref.current?.offsetWidth || '100%', maxWidth: 'none' }} draggable={false} />
            </div>

            {/* Labels */}
            <span className="absolute top-3 left-3 text-[11px] font-semibold text-white bg-black/55 px-2 py-1 rounded-md">До</span>
            <span className="absolute top-3 right-3 text-[11px] font-semibold text-on-primary bg-primary px-2 py-1 rounded-md">После</span>

            {/* Handle */}
            <div className="absolute top-0 bottom-0 w-0.5 bg-primary pointer-events-none" style={{ left: `${pos}%` }}>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-primary border-2 border-white/80 flex items-center justify-center shadow-lg">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--on-primary)" strokeWidth="2.5"><path d="M8 7l-5 5 5 5M16 7l5 5-5 5" /></svg>
                </div>
            </div>
        </div>
    );
}

/** Landing "before / after" showcase — Семейная, Документы, Детские. */
function BeforeAfterShowcase() {
    return (
        <section className="max-w-shell mx-auto px-6 py-16 md:py-24">
            <div className="text-center mb-10 md:mb-14">
                <h2 className="text-[27px] md:text-4xl font-extrabold tracking-[-0.025em] text-ink mb-3">
                    Одно фото — <span className="text-primary">студийный результат</span>
                </h2>
                <p className="text-ink-muted text-[15px] max-w-xl mx-auto">
                    Реалистичная нейрообработка. Двигайте ползунок, чтобы сравнить до и после.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
                {ITEMS.map(item => (
                    <div key={item.title}>
                        <Slider item={item} />
                        <h3 className="text-[15px] font-semibold text-ink mt-4">{item.title}</h3>
                        <p className="text-[13px] text-ink-muted mt-1 leading-snug">{item.subtitle}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default BeforeAfterShowcase;
