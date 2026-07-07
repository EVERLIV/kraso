import React from 'react';
import { ArrowRight, Sparkles, Users, FileText, Baby, Briefcase, Camera, ShoppingBag, Wand2, Palette } from 'lucide-react';

interface HiggsHomeProps {
    onStart: () => void;
}

const tpl = (name: string) => `/templates/${name}.webp`;

// Top category row (uses existing template art).
const CATEGORIES = [
    { label: 'Ретро', img: 'retro-polaroid-classic', icon: Camera },
    { label: 'Мода', img: 'fashion-cyber', icon: Sparkles },
    { label: 'Бизнес', img: 'business-startup', icon: Briefcase },
    { label: 'Маркетплейс', img: 'market-tech-neon', icon: ShoppingBag },
    { label: 'Дети', img: 'kids-explorer', icon: Baby },
    { label: 'Свидания', img: 'dating-restaurant', icon: Users },
];

// "What we can do" feature blocks.
const FEATURES = [
    { label: 'Семейная фотосессия', sub: 'Студийный кадр из обычного фото', img: 'family-addams', icon: Users, badge: 'HIT' },
    { label: 'Фото на документы', sub: 'Ровный фон и деловой вид', img: 'resume-studio', icon: FileText },
    { label: 'Детская фотосессия', sub: 'Яркие живые портреты детей', img: 'kids-explorer', icon: Baby, badge: 'NEW' },
    { label: 'Бизнес-портрет', sub: 'LinkedIn и резюме', img: 'business-startup', icon: Briefcase },
    { label: 'Макияж и бьюти', sub: 'Студийная ретушь кожи', img: 'makeup-glass-skin', icon: Palette },
    { label: 'Маркетплейс', sub: 'Карточки товаров с 3D-светом', img: 'market-tech-neon', icon: ShoppingBag },
];

// Masonry gallery — varied examples.
const GALLERY = [
    'soviet-gentlemen', 'fashion-cyber', 'makeup-glass-skin',
    'rich-penthouse', 'f1-cockpit', 'family-addams',
    'sports-olympia', 'restaurant-chef', 'style-y2k',
    'retro-polaroid-classic', 'watercolor-art', 'pop-art',
    'blogger-fashion', 'print-brochure-trifold', 'cyberpunk-city',
    'dating-restaurant', 'business-startup', 'kids-explorer',
];

function HiggsHome({ onStart }: HiggsHomeProps) {
    return (
        <div className="max-w-shell mx-auto px-3 md:px-5 pb-20">

            {/* Category row */}
            <div className="flex gap-3 overflow-x-auto custom-scrollbar pt-5 pb-2">
                {CATEGORIES.map(c => (
                    <button key={c.label} onClick={onStart} className="group relative shrink-0 w-40 h-24 rounded-xl overflow-hidden border border-[var(--border-color)]">
                        <img src={tpl(c.img)} alt={c.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/10" />
                        <div className="absolute left-3 bottom-2.5 flex items-center gap-1.5">
                            <c.icon className="w-3.5 h-3.5 text-primary" />
                            <span className="text-[13px] font-semibold text-white">{c.label}</span>
                        </div>
                    </button>
                ))}
            </div>

            {/* Feature blocks */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                {FEATURES.map(f => (
                    <button key={f.label} onClick={onStart} className="group relative h-28 md:h-32 rounded-xl overflow-hidden border border-[var(--border-color)] text-left">
                        <img src={tpl(f.img)} alt={f.label} className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" />
                        <div className="absolute inset-0 p-3.5 flex flex-col justify-between">
                            <div className="flex items-center gap-2">
                                <span className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
                                    <f.icon className="w-4 h-4 text-primary" />
                                </span>
                                {f.badge && <span className="text-[9px] font-extrabold uppercase tracking-wider text-on-primary bg-primary px-1.5 py-0.5 rounded">{f.badge}</span>}
                            </div>
                            <div>
                                <div className="text-[14px] font-semibold text-white leading-tight">{f.label}</div>
                                <div className="text-[11px] text-white/60 mt-0.5">{f.sub}</div>
                            </div>
                        </div>
                    </button>
                ))}
            </div>

            {/* Hero banner */}
            <div className="relative mt-4 rounded-2xl overflow-hidden border border-[var(--border-color)]">
                <img src={tpl('cyberpunk-city')} alt="" className="w-full h-[280px] md:h-[380px] object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20" />
                <div className="absolute top-4 right-4 text-[11px] font-extrabold text-on-primary bg-primary px-2 py-1 rounded">4K · РЕАЛИЗМ</div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                    <h1 className="text-4xl md:text-6xl font-black tracking-[-0.03em] text-white drop-shadow-xl">
                        Одно фото — <span className="text-primary">150+ стилей</span>
                    </h1>
                    <p className="text-white/80 mt-3 text-sm md:text-base max-w-md">Нейросеть сохраняет лицо. Реалистичная студийная обработка за секунды.</p>
                    <button onClick={onStart} className="mt-6 inline-flex items-center gap-2 bg-primary text-on-primary font-bold text-sm md:text-base px-6 py-3 rounded-full
                                   bg-gradient-to-b from-[#d4ff3a] to-[#9bdd04] border-t border-white/40
                                   shadow-[0_5px_0_0_#6fa000,0_8px_16px_-4px_rgba(0,0,0,0.6)]
                                   active:translate-y-[3px] active:shadow-[0_2px_0_0_#6fa000] transition-all duration-100">
                        <Wand2 className="w-5 h-5" /> Попробовать бесплатно
                    </button>
                </div>
            </div>

            {/* Masonry gallery */}
            <div className="mt-6 [column-gap:12px] [columns:160px] sm:[columns:200px] md:[columns:236px]">
                {GALLERY.map((g, i) => (
                    <button key={g + i} onClick={onStart} aria-label="Открыть шаблоны" className="group relative w-full mb-3 break-inside-avoid rounded-xl overflow-hidden border border-[var(--border-color)] hover:border-primary transition-colors">
                        <img src={tpl(g)} alt="" loading="lazy" className="w-full h-auto object-cover group-hover:scale-[1.04] transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                ))}
            </div>

            {/* Bottom CTA */}
            <div className="mt-8 text-center">
                <button onClick={onStart} className="inline-flex items-center gap-2 text-primary text-sm font-semibold hover:underline">
                    Смотреть все стили <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

export default HiggsHome;
