import React from 'react';
import { ArrowRight, ImageIcon, Video, LayoutGrid, Camera, Sparkles, Briefcase, ShoppingBag, Baby, Users, FileText, ScanEye, Eraser, Clapperboard, Palette, RefreshCcw } from 'lucide-react';
import { CategoryId } from '../types';
import Footer from './Footer';

interface HomeDashboardProps {
    onOpenTemplates: (category?: CategoryId) => void;
    onOpenPhoto: () => void;
    onOpenVideo: () => void;
    onOpenShorts?: () => void;
    onOpenMarketing?: () => void;
    onOpenUpscale?: () => void;
    onOpenRecolor?: () => void;
    onOpenRestore?: () => void;
    onOpenRemoveBg?: () => void;
    userName?: string;
    onFooterNavigate: (page: string) => void;
    onFooterProductClick: (destination?: string) => void;
}

const tpl = (name: string) => `/templates/${name}.webp`;

// Popular categories → deep-link into templates gallery with that category.
const CATEGORIES: { id: CategoryId; label: string; img: string; icon: React.ElementType }[] = [
    { id: 'documents', label: 'Документы', img: 'passport', icon: FileText },
    { id: 'retro', label: 'Ретро', img: 'retro-polaroid-classic', icon: Camera },
    { id: 'fashion', label: 'Мода', img: 'fashion-cyber', icon: Sparkles },
    { id: 'business', label: 'Бизнес', img: 'business-startup', icon: Briefcase },
    { id: 'marketplaces', label: 'Маркетплейс', img: 'market-tech-neon', icon: ShoppingBag },
    { id: 'kids', label: 'Дети', img: 'kids-explorer', icon: Baby },
    { id: 'family', label: 'Семья', img: 'family-addams', icon: Users },
];

function HomeDashboard({ onOpenTemplates, onOpenPhoto, onOpenVideo, onOpenShorts, onOpenMarketing, onOpenUpscale, onOpenRecolor, onOpenRestore, onOpenRemoveBg, userName, onFooterNavigate, onFooterProductClick }: HomeDashboardProps) {
    return (
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-background-light">
            <div className="max-w-shell mx-auto px-4 md:px-6 pt-5 pb-28 lg:pb-10">
                {/* Greeting */}
                <div className="mb-5">
                    <h1 className="text-xl md:text-2xl font-bold text-ink text-balance">
                        {userName ? `Привет, ${userName}` : 'Что создадим сегодня?'}
                    </h1>
                    <p className="text-sm text-ink-muted mt-0.5 text-pretty">Выберите режим или начните с готового стиля.</p>
                </div>

                {/* 3 primary action cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
                    <button onClick={() => onOpenTemplates()} className="group relative h-40 rounded-2xl overflow-hidden border border-[var(--border-color)] text-left">
                        <img src={tpl('soviet-gentlemen')} alt="" className="w-full h-full object-cover motion-safe:group-hover:scale-[1.02] motion-reduce:group-hover:scale-100 transition-transform duration-150 ease-out motion-reduce:transition-none" />
                        <div className="absolute inset-0 bg-black/55" />
                        <div className="absolute inset-0 p-4 flex flex-col justify-end">
                            <span className="size-9 rounded-xl bg-primary flex items-center justify-center mb-2"><LayoutGrid className="w-5 h-5 text-on-primary" /></span>
                            <div className="text-white font-bold text-base text-balance">Шаблоны КрасоМир</div>
                            <div className="text-white/65 text-xs mt-0.5 text-pretty">Готовые стили и образы</div>
                        </div>
                    </button>
                    <button onClick={onOpenPhoto} className="group relative h-40 rounded-2xl overflow-hidden border border-[var(--border-color)] text-left">
                        <img src={tpl('fashion-cyber')} alt="" className="w-full h-full object-cover motion-safe:group-hover:scale-[1.02] motion-reduce:group-hover:scale-100 transition-transform duration-150 ease-out motion-reduce:transition-none" />
                        <div className="absolute inset-0 bg-black/55" />
                        <div className="absolute inset-0 p-4 flex flex-col justify-end">
                            <span className="size-9 rounded-xl bg-primary flex items-center justify-center mb-2"><ImageIcon className="w-5 h-5 text-on-primary" /></span>
                            <div className="text-white font-bold text-base text-balance">Генерация фото</div>
                            <div className="text-white/65 text-xs mt-0.5 text-pretty">Создавайте изображения ИИ</div>
                        </div>
                    </button>
                    <button onClick={onOpenShorts || onOpenVideo} className="group relative h-40 rounded-2xl overflow-hidden border border-[var(--border-color)] text-left">
                        <img src={tpl('f1-cockpit')} alt="" className="w-full h-full object-cover motion-safe:group-hover:scale-[1.02] motion-reduce:group-hover:scale-100 transition-transform duration-150 ease-out motion-reduce:transition-none" />
                        <div className="absolute inset-0 bg-black/55" />
                        <div className="absolute inset-0 p-4 flex flex-col justify-end">
                            <span className="size-9 rounded-xl bg-primary flex items-center justify-center mb-2">
                                {onOpenShorts ? <Clapperboard className="w-5 h-5 text-on-primary" /> : <Video className="w-5 h-5 text-on-primary" />}
                            </span>
                            <div className="text-white font-bold text-base text-balance">{onOpenShorts ? 'Shorts Studio' : 'Генерация видео'}</div>
                            <div className="text-white/65 text-xs mt-0.5 text-pretty">{onOpenShorts ? 'Вертикальное видео 9:16' : 'Оживите фото в видео'}</div>
                        </div>
                    </button>
                </div>

                {/* AI Tools */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-8">
                    {onOpenUpscale && (
                        <button type="button" onClick={onOpenUpscale} className="flex items-center gap-2 p-3 rounded-xl border border-[var(--border-color)] bg-card-light hover:bg-surface-muted transition-colors duration-100 text-left">
                            <ScanEye className="size-4 text-ink-muted shrink-0" />
                            <span className="text-sm font-semibold text-ink">Upscale 4K</span>
                        </button>
                    )}
                    {onOpenRecolor && (
                        <button type="button" onClick={onOpenRecolor} className="flex items-center gap-2 p-3 rounded-xl border border-[var(--border-color)] bg-card-light hover:bg-surface-muted transition-colors duration-100 text-left">
                            <Palette className="size-4 text-ink-muted shrink-0" />
                            <span className="text-sm font-semibold text-ink">Палитра</span>
                        </button>
                    )}
                    {onOpenRestore && (
                        <button type="button" onClick={onOpenRestore} className="flex items-center gap-2 p-3 rounded-xl border border-[var(--border-color)] bg-card-light hover:bg-surface-muted transition-colors duration-100 text-left">
                            <RefreshCcw className="size-4 text-ink-muted shrink-0" />
                            <span className="text-sm font-semibold text-ink">Реставрация</span>
                        </button>
                    )}
                    {onOpenRemoveBg && (
                        <button type="button" onClick={onOpenRemoveBg} className="flex items-center gap-2 p-3 rounded-xl border border-[var(--border-color)] bg-card-light hover:bg-surface-muted transition-colors duration-100 text-left">
                            <Eraser className="size-4 text-ink-muted shrink-0" />
                            <span className="text-sm font-semibold text-ink">Убрать фон</span>
                        </button>
                    )}
                    {onOpenMarketing && (
                        <button type="button" onClick={onOpenMarketing} className="flex items-center gap-2 p-3 rounded-xl border border-[var(--border-color)] bg-card-light hover:bg-surface-muted transition-colors duration-100 text-left">
                            <ShoppingBag className="size-4 text-ink-muted shrink-0" />
                            <span className="text-sm font-semibold text-ink">Маркетинг</span>
                        </button>
                    )}
                    <button type="button" onClick={onOpenVideo} className="flex items-center gap-2 p-3 rounded-xl border border-[var(--border-color)] bg-card-light hover:bg-surface-muted transition-colors duration-100 text-left">
                        <Video className="size-4 text-ink-muted shrink-0" />
                        <span className="text-sm font-semibold text-ink">Видео</span>
                    </button>
                </div>

                {/* Popular categories */}
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-base font-semibold text-ink text-balance">Популярные категории</h2>
                    <button onClick={() => onOpenTemplates()} className="flex items-center gap-1 text-sm text-primary font-semibold hover:underline">
                        Все шаблоны <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {CATEGORIES.map(c => (
                        <button key={c.id} onClick={() => onOpenTemplates(c.id)} className="group relative h-28 rounded-xl overflow-hidden border border-[var(--border-color)] hover:border-primary transition-colors text-left">
                            <img src={tpl(c.img)} alt={c.label} className="w-full h-full object-cover motion-safe:group-hover:scale-[1.02] motion-reduce:group-hover:scale-100 transition-transform duration-150 ease-out motion-reduce:transition-none" />
                            <div className="absolute inset-0 bg-black/50" />
                            <div className="absolute left-3 bottom-2.5 flex items-center gap-1.5">
                                <c.icon className="w-3.5 h-3.5 text-primary" />
                                <span className="text-sm font-semibold text-white">{c.label}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Site footer — desktop only, mobile stays focused on the generation flow */}
            <div className="hidden lg:block mt-6">
                <Footer onNavigate={onFooterNavigate} onProductClick={onFooterProductClick} />
            </div>
        </div>
    );
}

export default HomeDashboard;
