import React from 'react';
import {
    Home, Layers, Heart, Globe, Clapperboard, Plus, FolderPlus, FolderHeart, ArrowLeft,
} from 'lucide-react';
import MarketingIconTile from './MarketingIconTile';
import MarketingStudioSwitcher, { StudioId } from './MarketingStudioSwitcher';
import './marketingTheme.css';

export type MarketingNav = 'home' | 'generations' | 'favorites';
export type MarketingTool = 'url' | 'reference';

interface MarketingStudioShellProps {
    children: React.ReactNode;
    dockedComposer?: React.ReactNode;
    mainRef?: React.RefObject<HTMLElement | null>;
    credits: number;
    userPhoto?: string | null;
    onExit: () => void;
    onOpenCredits: () => void;
    onNav: (nav: MarketingNav) => void;
    onSwitchStudio: (studio: StudioId) => void;
    onOpenTool?: (tool: MarketingTool) => void;
    activeNav?: MarketingNav;
    showComposerDock?: boolean;
}

function MarketingStudioShell({
    children, dockedComposer, mainRef, credits, userPhoto, onExit, onOpenCredits,
    onNav, onSwitchStudio, onOpenTool, activeNav = 'home', showComposerDock = true,
}: MarketingStudioShellProps) {
    const navItem = (
        id: MarketingNav,
        tile: 'lime' | 'pink' | 'blue' | 'purple',
        label: string,
        icon: React.ReactNode,
        onClick: () => void,
    ) => (
        <button
            type="button"
            onClick={onClick}
            className={`ms-nav-item w-full ${activeNav === id ? 'ms-nav-item--active' : ''}`}
        >
            <MarketingIconTile variant={tile} size="nav">{icon}</MarketingIconTile>
            {label}
        </button>
    );

    return (
        <div className="ms h-dvh flex overflow-hidden">
            <aside className="hidden md:flex w-[260px] shrink-0 flex-col p-4">
                <div className="ms-panel p-[18px_14px] flex flex-col h-full shadow-[var(--ms-shadow-panel)]">
                    <MarketingStudioSwitcher
                        current="marketing"
                        onSelect={onSwitchStudio}
                    />

                    <nav className="flex flex-col gap-0.5">
                        {navItem('home', 'lime', 'Главная', <Home className="size-3 text-[var(--ms-on-lime)]" />, () => onNav('home'))}
                        {navItem('generations', 'pink', 'Все генерации', <Layers className="size-3 text-white" />, () => onNav('generations'))}
                        {navItem('favorites', 'pink', 'Избранное', <Heart className="size-3 text-white" />, () => onNav('favorites'))}
                    </nav>

                    <p className="ms-section-label">Инструменты</p>
                    <div className="flex flex-col gap-0.5">
                        <button type="button" className="ms-nav-item w-full" onClick={() => onOpenTool?.('url')}>
                            <MarketingIconTile variant="blue" size="nav">
                                <Globe className="size-3 text-white" />
                            </MarketingIconTile>
                            Ссылка в рекламу
                        </button>
                        <button type="button" className="ms-nav-item w-full" onClick={() => onOpenTool?.('reference')}>
                            <MarketingIconTile variant="purple" size="nav">
                                <Clapperboard className="size-3 text-white" />
                            </MarketingIconTile>
                            Референс рекламы
                        </button>
                    </div>

                    <p className="ms-section-label">Проекты</p>
                    <div className="flex flex-col gap-0.5 mt-auto">
                        <button type="button" className="ms-nav-item w-full">
                            <MarketingIconTile variant="empty" size="nav"><Plus className="size-3" /></MarketingIconTile>
                            Новый проект
                        </button>
                        <button type="button" className="ms-nav-item w-full">
                            <MarketingIconTile variant="empty" size="nav"><FolderPlus className="size-3" /></MarketingIconTile>
                            Новая папка
                        </button>
                    </div>
                </div>
            </aside>

            <div className="flex-1 flex flex-col min-w-0 relative">
                <div className="ms-hero-glow" aria-hidden />
                <div className="ms-grid-bg" aria-hidden />

                <header className="relative z-10 flex items-center gap-3 px-4 md:px-10 h-14 shrink-0">
                    <button
                        type="button"
                        onClick={onExit}
                        className="md:hidden ms-btn-ghost flex items-center justify-center size-9 shrink-0"
                        aria-label="Назад"
                    >
                        <ArrowLeft className="size-5" />
                    </button>
                    <p className="md:hidden flex-1 text-center text-xs font-bold uppercase tracking-widest truncate">
                        Маркетинг Студия
                    </p>
                    <div className="md:hidden size-9 shrink-0" aria-hidden />

                    <div className="hidden md:block flex-1" />

                    <div className="hidden md:flex items-center gap-2 ml-auto">
                        <button
                            type="button"
                            onClick={onOpenCredits}
                            className="relative ms-btn-ghost inline-flex items-center gap-2 px-3 py-2 text-sm"
                        >
                            <span className="size-3.5 rounded bg-[var(--ms-pink)] shrink-0" />
                            Улучшить
                            <span className="ms-badge-promo absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap">
                                −30%
                            </span>
                        </button>
                        <button
                            type="button"
                            onClick={() => onNav('generations')}
                            className="hidden sm:inline-flex ms-btn-secondary items-center gap-2 px-4 py-2.5 text-sm"
                        >
                            <FolderHeart className="size-3.5" />
                            Активы
                        </button>
                        <div className="size-9 rounded-full overflow-hidden border border-[var(--ms-hairline-strong)] bg-[var(--ms-raised)]">
                            {userPhoto ? (
                                <img src={userPhoto} alt="" className="size-full object-cover" />
                            ) : (
                                <div className="size-full flex items-center justify-center text-[11px] text-[var(--ms-dim)] tabular-nums">{credits}</div>
                            )}
                        </div>
                    </div>
                </header>

                <main ref={mainRef} className="relative z-10 flex-1 overflow-y-auto custom-scrollbar">
                    {children}
                </main>

                {showComposerDock && dockedComposer && (
                    <div className="absolute bottom-0 inset-x-0 z-30 px-4 md:px-10 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pointer-events-none">
                        <div className="pointer-events-auto max-w-[880px] mx-auto">
                            {dockedComposer}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MarketingStudioShell;
