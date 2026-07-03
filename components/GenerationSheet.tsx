import React from 'react';
import { X, ArrowRight, Image as ImageIcon, Video as VideoIcon, LayoutGrid } from 'lucide-react';

interface GenerationSheetProps {
    open: boolean;
    onClose: () => void;
    onOpenTemplates: () => void;
    onOpenPhoto: () => void;
    onOpenVideo: () => void;
    onOpenShorts?: () => void;
    onOpenMarketing?: () => void;
    onOpenUpscale?: () => void;
    onOpenRecolor?: () => void;
    onOpenRestore?: () => void;
    onOpenRemoveBg?: () => void;
}

/**
 * Mobile FAB chooser (Higgsfield-style "Create"). Opens from the central "+" in the bottom nav
 * and simply routes to the same screens the home dashboard cards use — Templates / Photo / Video —
 * so the destination is identical no matter which entry point was tapped.
 */
function GenerationSheet({ open, onClose, onOpenTemplates, onOpenPhoto, onOpenVideo, onOpenShorts, onOpenMarketing, onOpenUpscale, onOpenRecolor, onOpenRestore, onOpenRemoveBg }: GenerationSheetProps) {
    if (!open) return null;

    const CHOICES = [
        { id: 'templates', label: 'Шаблоны КрасоМир', sub: 'Готовые стили и образы', icon: LayoutGrid, img: '/templates/soviet-gentlemen.webp', onClick: () => { onClose(); onOpenTemplates(); } },
        { id: 'photo', label: 'Генерация фото', sub: 'Создавайте изображения ИИ', icon: ImageIcon, img: '/templates/fashion-cyber.webp', onClick: () => { onClose(); onOpenPhoto(); } },
        { id: 'shorts', label: 'Shorts Studio', sub: 'Вертикальное видео 9:16', icon: VideoIcon, img: '/templates/f1-cockpit.webp', onClick: () => { onClose(); onOpenShorts!(); }, hidden: !onOpenShorts },
        { id: 'video', label: 'Генерация видео', sub: 'Оживите фото в видео', icon: VideoIcon, img: '/templates/f1-cockpit.webp', onClick: () => { onClose(); onOpenVideo(); }, hidden: !!onOpenShorts },
        { id: 'marketing', label: 'Marketing Studio', sub: 'Карточки для маркетплейсов', icon: LayoutGrid, img: '/templates/market-tech-neon.webp', onClick: () => { onClose(); onOpenMarketing?.(); }, hidden: !onOpenMarketing },
        { id: 'upscale', label: 'Upscale 4K', sub: 'Детализация и чёткость', icon: ImageIcon, img: '/landing/family-after.webp', onClick: () => { onClose(); onOpenUpscale?.(); }, hidden: !onOpenUpscale },
        { id: 'recolor', label: 'Палитра', sub: 'Moodboard и цвет', icon: ImageIcon, img: '/landing/kids-after.webp', onClick: () => { onClose(); onOpenRecolor?.(); }, hidden: !onOpenRecolor },
        { id: 'restore', label: 'Реставрация', sub: 'Старые и повреждённые фото', icon: ImageIcon, img: '/landing/docs-after.webp', onClick: () => { onClose(); onOpenRestore?.(); }, hidden: !onOpenRestore },
        { id: 'removebg', label: 'Убрать фон', sub: 'Для карточек товаров', icon: ImageIcon, img: '/templates/market-shopee-hero.webp', onClick: () => { onClose(); onOpenRemoveBg?.(); }, hidden: !onOpenRemoveBg },
    ].filter(c => !c.hidden);

    return (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col bg-background-light">
            <div className="h-14 shrink-0 flex items-center justify-between px-4 border-b border-[var(--border-strong)]">
                <span className="w-9" />
                <span className="text-sm font-bold text-ink text-balance">Создать</span>
                <button onClick={onClose} className="size-9 flex items-center justify-center text-ink-muted hover:text-ink rounded-full hover:bg-surface-muted" aria-label="Закрыть">
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
                {CHOICES.map(c => (
                    <button key={c.id} onClick={c.onClick} className="group relative w-full h-28 rounded-2xl overflow-hidden border border-[var(--border-color)] text-left">
                        <img src={c.img} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/55" />
                        <div className="absolute inset-0 p-4 flex flex-col justify-center">
                            <span className="flex items-center gap-2 mb-1">
                                <span className="size-8 rounded-lg bg-white/10 flex items-center justify-center"><c.icon className="w-4 h-4 text-primary" /></span>
                            </span>
                            <div className="text-white font-semibold text-base text-balance">{c.label}</div>
                            <div className="text-white/60 text-xs mt-0.5 text-pretty">{c.sub}</div>
                        </div>
                        <ArrowRight className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/70" />
                    </button>
                ))}
            </div>
        </div>
    );
}

export default GenerationSheet;
