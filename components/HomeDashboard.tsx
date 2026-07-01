import React from 'react';
import { ArrowRight, ImageIcon, Video, LayoutGrid, Camera, Sparkles, Briefcase, ShoppingBag, Baby, Users, FileText } from 'lucide-react';
import { CategoryId } from '../types';

interface HomeDashboardProps {
    onOpenTemplates: (category?: CategoryId) => void;
    onOpenPhoto: () => void;
    onOpenVideo: () => void;
    userName?: string;
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

function HomeDashboard({ onOpenTemplates, onOpenPhoto, onOpenVideo, userName }: HomeDashboardProps) {
    return (
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-background-light">
            <div className="max-w-shell mx-auto px-4 md:px-6 pt-5 pb-28 lg:pb-10">
                {/* Greeting */}
                <div className="mb-5">
                    <h1 className="text-xl md:text-2xl font-bold text-ink">
                        {userName ? `Привет, ${userName}` : 'Что создадим сегодня?'}
                    </h1>
                    <p className="text-[13px] text-ink-muted mt-0.5">Выберите режим или начните с готового стиля.</p>
                </div>

                {/* 3 primary action cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
                    <button onClick={() => onOpenTemplates()} className="group relative h-40 rounded-2xl overflow-hidden border border-[var(--border-color)] text-left">
                        <img src={tpl('soviet-gentlemen')} alt="" className="w-full h-full object-cover opacity-65 group-hover:opacity-85 group-hover:scale-105 transition-all duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                        <div className="absolute inset-0 p-4 flex flex-col justify-end">
                            <span className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center mb-2"><LayoutGrid className="w-5 h-5 text-on-primary" /></span>
                            <div className="text-white font-bold text-[16px]">Шаблоны КрасоМир</div>
                            <div className="text-white/65 text-[12px] mt-0.5">Готовые стили и образы</div>
                        </div>
                    </button>
                    <button onClick={onOpenPhoto} className="group relative h-40 rounded-2xl overflow-hidden border border-[var(--border-color)] text-left">
                        <img src={tpl('fashion-cyber')} alt="" className="w-full h-full object-cover opacity-65 group-hover:opacity-85 group-hover:scale-105 transition-all duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                        <div className="absolute inset-0 p-4 flex flex-col justify-end">
                            <span className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center mb-2"><ImageIcon className="w-5 h-5 text-on-primary" /></span>
                            <div className="text-white font-bold text-[16px]">Генерация фото</div>
                            <div className="text-white/65 text-[12px] mt-0.5">Создавайте изображения ИИ</div>
                        </div>
                    </button>
                    <button onClick={onOpenVideo} className="group relative h-40 rounded-2xl overflow-hidden border border-[var(--border-color)] text-left">
                        <img src={tpl('f1-cockpit')} alt="" className="w-full h-full object-cover opacity-65 group-hover:opacity-85 group-hover:scale-105 transition-all duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                        <div className="absolute inset-0 p-4 flex flex-col justify-end">
                            <span className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center mb-2"><Video className="w-5 h-5 text-on-primary" /></span>
                            <div className="text-white font-bold text-[16px]">Генерация видео</div>
                            <div className="text-white/65 text-[12px] mt-0.5">Оживите фото в видео</div>
                        </div>
                    </button>
                </div>

                {/* Popular categories */}
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-base font-semibold text-ink">Популярные категории</h2>
                    <button onClick={() => onOpenTemplates()} className="flex items-center gap-1 text-[13px] text-primary font-semibold hover:underline">
                        Все шаблоны <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {CATEGORIES.map(c => (
                        <button key={c.id} onClick={() => onOpenTemplates(c.id)} className="group relative h-28 rounded-xl overflow-hidden border border-[var(--border-color)] hover:border-primary transition-colors text-left">
                            <img src={tpl(c.img)} alt={c.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/10" />
                            <div className="absolute left-3 bottom-2.5 flex items-center gap-1.5">
                                <c.icon className="w-3.5 h-3.5 text-primary" />
                                <span className="text-[13px] font-semibold text-white">{c.label}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default HomeDashboard;
