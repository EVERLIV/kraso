import React, { useState } from 'react';
import {
    Sparkles, Type, Palette, MousePointer2, Layout, Filter,
    Plus, ArrowRight, Play, Moon, Sun, Zap, Star, Image as ImageIcon,
} from 'lucide-react';
import VideoStudioDesignSection from './design-system/VideoStudioDesignSection';

/**
 * DesignSystemView — живая витрина дизайн-системы КрасоМир.
 * Все значения берутся из токенов в index.html (CSS-переменные + Tailwind).
 * Video Studio: docs/design-system/video-studio.md
 * Используйте этот экран как справочник при перевёрстке остальных экранов.
 */

const ACCENTS = [
    { name: 'Primary', hex: '#4B7CFE', soft: '#EEF3FF' },
    { name: 'Purple', hex: '#A855F7', soft: '#F5EBFF' },
    { name: 'Pink', hex: '#EC4899', soft: '#FCE7F3' },
    { name: 'Green', hex: '#1F8A5B', soft: '#E3F5EC' },
];

const INK_SCALE = [
    { name: 'Ink', hex: '#0F172A' },
    { name: 'Strong', hex: '#334155' },
    { name: 'Body', hex: '#475569' },
    { name: 'Muted', hex: '#64748B' },
    { name: 'Faint', hex: '#94A3B8' },
];

const SectionTitle: React.FC<{ icon: React.ReactNode; children: React.ReactNode }> = ({ icon, children }) => (
    <div className="flex items-center gap-3 border-b border-[var(--border-strong)] pb-4">
        <span className="text-primary">{icon}</span>
        <h2 className="text-sm font-bold text-ink uppercase tracking-widest">{children}</h2>
    </div>
);

const DesignSystemView: React.FC = () => {
    const [isDark, setIsDark] = useState(false);
    const [accent, setAccent] = useState(ACCENTS[0]);
    const [ratio, setRatio] = useState('1:1');

    // Inline accent override so the showcase reacts to the accent picker.
    const accentVars = { ['--primary' as any]: accent.hex } as React.CSSProperties;

    return (
        <div
            className={`flex-1 overflow-y-auto custom-scrollbar transition-colors duration-300 ${isDark ? 'dark bg-background-light' : 'bg-background-light'}`}
            style={accentVars}
        >
            {/* Header */}
            <header className="sticky top-0 z-40 bg-card-light/82 backdrop-blur-[14px] border-b border-[var(--border-strong)] px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[11px] bg-brand-grad flex items-center justify-center shadow-[0_6px_16px_-6px_rgba(168,85,247,.5)]">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div className="leading-none">
                        <div className="flex items-center gap-2">
                            <h1 className="font-extrabold text-lg text-ink tracking-tight">КрасоМир</h1>
                            <span className="text-[9px] font-extrabold tracking-[0.08em] text-on-primary bg-ai-badge px-1.5 py-0.5 rounded-[5px]">DS</span>
                        </div>
                        <p className="text-[10.5px] text-ink-faint font-medium mt-1">Дизайн-система · v2.0</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsDark(v => !v)}
                    className="p-3 rounded-btn bg-surface-muted text-ink-body hover:scale-110 active:scale-95 transition-all"
                    aria-label="Переключить тему"
                >
                    {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
                </button>
            </header>

            <main className="max-w-hero mx-auto px-6 py-10 space-y-16 pb-32">

                {/* Accent picker */}
                <section className="space-y-4">
                    <SectionTitle icon={<Palette className="w-5 h-5" />}>Accent</SectionTitle>
                    <div className="flex items-center gap-3 flex-wrap">
                        {ACCENTS.map(a => (
                            <button
                                key={a.name}
                                onClick={() => setAccent(a)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all ${accent.name === a.name ? 'text-white shadow-pill-active' : 'bg-card-light text-ink-body border-[var(--border-color)]'}`}
                                style={accent.name === a.name ? { background: a.hex, borderColor: a.hex } : undefined}
                            >
                                <span className="w-3.5 h-3.5 rounded-full" style={{ background: a.hex }} />
                                {a.name}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Typography */}
                <section className="space-y-6">
                    <SectionTitle icon={<Type className="w-5 h-5" />}>Typography · Inter</SectionTitle>
                    <div className="bg-card-light border border-[var(--border-soft)] p-6 rounded-xl shadow-sm space-y-6">
                        <div>
                            <p className="text-[10px] font-bold text-ink-faint mb-2 uppercase tracking-wider">H1 Hero · 900</p>
                            <h1 className="text-[44px] leading-[1.04] font-black tracking-[-0.035em] text-ink">
                                Одно фото — <span className="text-transparent bg-clip-text bg-brand-grad-text">сотни стилей</span>
                            </h1>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-ink-faint mb-2 uppercase tracking-wider">H2 Section · 800</p>
                            <h2 className="text-[27px] font-extrabold tracking-[-0.025em] text-ink">Библиотека стилей</h2>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-ink-faint mb-2 uppercase tracking-wider">Body · 450 / 1.55</p>
                            <p className="text-[19px] leading-[1.55] text-ink-muted max-w-xl">
                                Загрузите селфи или товар — нейросеть КрасоМир создаст портреты, карточки маркетплейса, моду и оживит фото в видео.
                            </p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-ink-faint mb-2 uppercase tracking-wider">Eyebrow · 700 uppercase</p>
                            <span className="text-xs font-bold tracking-[0.04em] text-ink-body uppercase">Генерация фото ИИ за 5 секунд</span>
                        </div>
                    </div>
                </section>

                {/* Colors */}
                <section className="space-y-6">
                    <SectionTitle icon={<Palette className="w-5 h-5" />}>Colors</SectionTitle>
                    <div>
                        <p className="text-[10px] font-bold text-ink-faint mb-3 uppercase tracking-wider">Accent options</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {ACCENTS.map(c => (
                                <div key={c.name} className="space-y-2">
                                    <div className="h-20 rounded-tile shadow-sm" style={{ background: c.hex }} />
                                    <div className="h-8 rounded-lg border border-[var(--border-soft)]" style={{ background: c.soft }} />
                                    <div>
                                        <span className="text-xs font-bold text-ink block">{c.name}</span>
                                        <span className="text-[10px] font-mono text-ink-faint uppercase">{c.hex}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-ink-faint mb-3 uppercase tracking-wider">Ink scale</p>
                        <div className="flex flex-wrap gap-3">
                            {INK_SCALE.map(c => (
                                <div key={c.name} className="flex items-center gap-2 bg-card-light border border-[var(--border-soft)] rounded-lg px-3 py-2">
                                    <span className="w-5 h-5 rounded" style={{ background: c.hex }} />
                                    <span className="text-xs font-semibold text-ink">{c.name}</span>
                                    <span className="text-[10px] font-mono text-ink-faint">{c.hex}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Buttons */}
                <section className="space-y-6">
                    <SectionTitle icon={<MousePointer2 className="w-5 h-5" />}>Buttons</SectionTitle>
                    <div className="bg-card-light border border-[var(--border-soft)] p-6 rounded-xl flex flex-wrap items-center gap-4">
                        <button className="flex items-center gap-2 text-white text-sm font-bold px-[18px] py-[9px] rounded-full shadow-cta" style={{ background: accent.hex }}>
                            <Sparkles className="w-[15px] h-[15px]" /> Создать
                        </button>
                        <button className="flex items-center gap-2 text-white text-base font-bold px-7 py-[15px] rounded-btn shadow-cta-lg" style={{ background: accent.hex }}>
                            <Sparkles className="w-[18px] h-[18px]" /> Создать бесплатно
                        </button>
                        <button className="flex items-center gap-2 bg-card-light border border-[var(--border-color)] text-ink text-base font-semibold px-6 py-[15px] rounded-btn shadow-sm">
                            <Play className="w-4 h-4 fill-ink" /> Примеры работ
                        </button>
                        <button className="flex items-center gap-2 bg-surface-muted border border-[var(--border-soft)] text-ink-body text-sm font-semibold px-[13px] py-[9px] rounded-full">
                            <Plus className="w-[15px] h-[15px]" /> Фото
                        </button>
                        <button className="flex items-center gap-2 bg-surface-muted border border-[var(--border-soft)] text-ink-body text-sm font-semibold px-[13px] py-[9px] rounded-full">
                            <Filter className="w-[15px] h-[15px]" /> Популярные
                        </button>
                    </div>
                </section>

                {/* Pills + badges */}
                <section className="space-y-6">
                    <SectionTitle icon={<Layout className="w-5 h-5" />}>Category pills</SectionTitle>
                    <div className="bg-card-light border border-[var(--border-soft)] p-6 rounded-xl flex flex-wrap items-center gap-[9px]">
                        <button className="flex items-center gap-2 px-4 py-[9px] rounded-full text-sm font-semibold text-white shadow-pill-active" style={{ background: accent.hex, borderColor: accent.hex }}>
                            Все
                        </button>
                        {['Тренды', 'Маркетплейсы', 'Мода', 'Свадьба', 'Ретро'].map((c, i) => (
                            <button key={c} className="flex items-center gap-2 px-4 py-[9px] rounded-full text-sm font-semibold bg-card-light text-ink-body border border-[var(--border-color)] shadow-sm">
                                {c}
                                {i < 2 && <span className="text-[8.5px] font-extrabold tracking-[0.05em] text-accent-pink bg-accent-pink-soft px-1.5 py-0.5 rounded-[5px]">HOT</span>}
                                {i === 3 && <span className="text-[8.5px] font-extrabold tracking-[0.05em] text-accent-pink bg-accent-pink-soft px-1.5 py-0.5 rounded-[5px]">NEW</span>}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Gallery tile */}
                <section className="space-y-6">
                    <SectionTitle icon={<ImageIcon className="w-5 h-5" />}>Gallery tile</SectionTitle>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {[
                            { t: 'Гламур-портрет', s: 'Editorial', badge: 'NEW', ar: '3 / 4' },
                            { t: 'Маркетплейс', s: '3D витрина', badge: 'HOT', ar: '1 / 1' },
                            { t: 'Оживить фото', s: 'Видео 4K', badge: '', ar: '4 / 5', video: true },
                        ].map(t => (
                            <div key={t.t} className="group relative rounded-tile overflow-hidden bg-card-light border border-[var(--border-soft)] shadow-sm hover:shadow-tile-hover hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                                <div className="relative overflow-hidden" style={{ aspectRatio: t.ar }}>
                                    <div className="w-full h-full bg-gradient-to-br from-slate-300 to-slate-500 group-hover:scale-105 transition-transform duration-700" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[rgba(15,23,42,.76)] via-[rgba(15,23,42,.04)] to-transparent" />
                                    {t.badge && (
                                        <span className="absolute top-2.5 left-2.5 text-[9.5px] font-extrabold tracking-[0.06em] text-white bg-[rgba(15,23,42,.55)] backdrop-blur px-2 py-1 rounded-[7px]">{t.badge}</span>
                                    )}
                                    <div className="absolute top-2.5 right-2.5 w-[30px] h-[30px] rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow">
                                        <Plus className="w-[15px] h-[15px] text-ink" />
                                    </div>
                                    {t.video && (
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[46px] h-[46px] rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-lg">
                                            <Play className="w-[18px] h-[18px] text-ink fill-ink" />
                                        </div>
                                    )}
                                    <div className="absolute left-3 right-3 bottom-3">
                                        <div className="text-white font-bold text-[15px] tracking-[-0.015em] drop-shadow">{t.t}</div>
                                        <div className="text-white/75 text-[11.5px] font-medium mt-0.5">{t.s}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Generation bar */}
                <section className="space-y-6">
                    <SectionTitle icon={<Sparkles className="w-5 h-5" />}>Generation bar</SectionTitle>
                    <div className="bg-card-light border border-[var(--border-color)] rounded-full shadow-gen-bar flex items-center gap-2.5 pl-4 pr-2 py-2">
                        <button className="flex items-center gap-1.5 shrink-0 bg-surface-muted border border-[var(--border-soft)] text-ink-body text-[13px] font-semibold px-3 py-2 rounded-full">
                            <Plus className="w-[15px] h-[15px]" /> Фото
                        </button>
                        <input
                            placeholder="Опишите идею или выберите стиль выше…"
                            className="flex-1 min-w-0 bg-transparent outline-none text-[15px] font-medium text-ink placeholder:text-ink-faint"
                        />
                        <div className="flex items-center gap-0.5 bg-surface-muted p-1 rounded-[10px] shrink-0">
                            {['1:1', '4:5', '9:16', '16:9'].map(r => (
                                <button
                                    key={r}
                                    onClick={() => setRatio(r)}
                                    className={`px-3 py-[7px] rounded-[7px] text-[12.5px] font-semibold transition-all ${ratio === r ? 'bg-ink text-white' : 'text-ink-muted'}`}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-ink-faint px-1 shrink-0">
                            <Sparkles className="w-[13px] h-[13px] text-accent-purple" /> v3
                        </div>
                        <button className="flex items-center gap-2 shrink-0 text-white text-[15px] font-bold px-6 py-3 rounded-full shadow-cta" style={{ background: accent.hex }}>
                            Создать <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </section>

                {/* Video Studio */}
                <VideoStudioDesignSection />

                {/* Trust row + shadows reference */}
                <section className="space-y-6">
                    <SectionTitle icon={<Star className="w-5 h-5" />}>Trust row</SectionTitle>
                    <div className="flex items-center gap-[22px] text-[13.5px] font-semibold text-ink-faint flex-wrap">
                        <span><b className="text-ink-strong">1M+</b> генераций</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        <span><b className="text-ink-strong">500K+</b> авторов</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        <span><b className="text-ink-strong">150+</b> стилей</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        <span className="inline-flex items-center gap-1"><b className="text-ink-strong">4.9</b><Star className="w-3 h-3 text-amber-500 fill-amber-500" /></span>
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        <span className="inline-flex items-center gap-1 bg-card-light border border-[var(--border-color)] px-3 py-1.5 rounded-full"><Zap className="w-3 h-3 text-amber-500" fill="currentColor" /><b className="text-ink">120</b> кр.</span>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default DesignSystemView;
