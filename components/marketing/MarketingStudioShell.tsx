import React, { useRef, useState } from 'react';
import {
    Home, Layers, Heart, Globe, Clapperboard, Plus, FolderPlus, FolderHeart, ArrowLeft,
    Zap, Coins, User, LogOut, Settings, ChevronUp,
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
    onOpenAccount?: () => void;
    onNav: (nav: MarketingNav) => void;
    onSwitchStudio: (studio: StudioId) => void;
    onOpenTool?: (tool: MarketingTool) => void;
    activeNav?: MarketingNav;
    showComposerDock?: boolean;
}

function MarketingStudioShell({
    children, dockedComposer, mainRef, credits, userPhoto, onExit, onOpenCredits, onOpenAccount,
    onNav, onSwitchStudio, onOpenTool, activeNav = 'home', showComposerDock = true,
}: MarketingStudioShellProps) {
    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

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
            {/* Desktop sidebar */}
            <aside className="hidden md:flex w-[240px] shrink-0 flex-col p-3">
                <div className="ms-sidebar flex flex-col h-full">
                    {/* Switcher */}
                    <div className="px-1 pt-1 pb-3">
                        <MarketingStudioSwitcher
                            current="marketing"
                            onSelect={onSwitchStudio}
                        />
                    </div>

                    {/* Main nav */}
                    <nav className="flex flex-col gap-0.5 px-1">
                        {navItem('home', 'lime', 'Главная', <Home className="size-3 text-[var(--ms-on-lime)]" />, () => onNav('home'))}
                        {navItem('generations', 'pink', 'Все генерации', <Layers className="size-3 text-white" />, () => onNav('generations'))}
                        {navItem('favorites', 'pink', 'Избранное', <Heart className="size-3 text-white" />, () => onNav('favorites'))}
                    </nav>

                    {/* Tools */}
                    <p className="ms-section-label px-2">Инструменты</p>
                    <div className="flex flex-col gap-0.5 px-1">
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

                    {/* Projects */}
                    <p className="ms-section-label px-2">Проекты</p>
                    <div className="flex flex-col gap-0.5 px-1">
                        <button type="button" className="ms-nav-item w-full">
                            <MarketingIconTile variant="empty" size="nav"><Plus className="size-3" /></MarketingIconTile>
                            Новый проект
                        </button>
                        <button type="button" className="ms-nav-item w-full">
                            <MarketingIconTile variant="empty" size="nav"><FolderPlus className="size-3" /></MarketingIconTile>
                            Новая папка
                        </button>
                    </div>

                    {/* Bottom — profile & upgrade */}
                    <div className="mt-auto px-1 pt-4 flex flex-col gap-2">
                        {/* Credits / Tariff CTA */}
                        <button
                            type="button"
                            onClick={onOpenCredits}
                            className="ms-sidebar-upgrade w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[12px]"
                        >
                            <span className="ms-sidebar-upgrade__icon flex items-center justify-center size-7 rounded-[8px] shrink-0">
                                <Zap className="size-3.5" />
                            </span>
                            <span className="flex-1 text-left">
                                <span className="block text-[11px] font-semibold leading-tight opacity-60 mb-0.5">Баланс</span>
                                <span className="block text-[14px] font-bold leading-tight">
                                    <Coins className="size-3 inline mr-1 opacity-70" />
                                    {credits.toLocaleString()} кр.
                                </span>
                            </span>
                            <span className="ms-badge-promo shrink-0">+</span>
                        </button>

                        {/* Profile row with dropdown */}
                        <div className="relative" ref={profileRef}>
                            {profileOpen && (
                                <div
                                    className="absolute bottom-full left-0 right-0 mb-1.5 rounded-[14px] overflow-hidden z-50"
                                    style={{
                                        background: 'var(--ms-panel-bg)',
                                        border: '1px solid var(--ms-border)',
                                        boxShadow: 'var(--ms-shadow-panel)',
                                    }}
                                >
                                    <button
                                        type="button"
                                        className="ms-nav-item w-full !rounded-none"
                                        onClick={() => { setProfileOpen(false); onOpenAccount?.(); }}
                                    >
                                        <User className="size-3.5 text-[var(--ms-dim)]" />
                                        Профиль и аккаунт
                                    </button>
                                    <button
                                        type="button"
                                        className="ms-nav-item w-full !rounded-none"
                                        onClick={() => { setProfileOpen(false); onOpenCredits(); }}
                                    >
                                        <Coins className="size-3.5 text-[var(--ms-dim)]" />
                                        Тарифы и кредиты
                                    </button>
                                    <button
                                        type="button"
                                        className="ms-nav-item w-full !rounded-none"
                                        onClick={() => { setProfileOpen(false); onNav('generations'); }}
                                    >
                                        <FolderHeart className="size-3.5 text-[var(--ms-dim)]" />
                                        Мои генерации
                                    </button>
                                    <div style={{ height: 1, background: 'var(--ms-border)', margin: '2px 0' }} />
                                    <button
                                        type="button"
                                        className="ms-nav-item w-full !rounded-none"
                                        onClick={() => { setProfileOpen(false); onExit(); }}
                                    >
                                        <LogOut className="size-3.5 text-[var(--ms-dim)]" />
                                        Выйти из студии
                                    </button>
                                </div>
                            )}
                            <button
                                type="button"
                                className="ms-nav-item w-full !py-2"
                                onClick={() => setProfileOpen(v => !v)}
                                aria-expanded={profileOpen}
                            >
                                {userPhoto ? (
                                    <span className="size-6 rounded-full overflow-hidden shrink-0 flex-none">
                                        <img src={userPhoto} alt="" className="size-full object-cover" />
                                    </span>
                                ) : (
                                    <span className="ms-sidebar-avatar shrink-0 size-6 flex items-center justify-center">
                                        <User className="size-3 text-[var(--ms-dim)]" />
                                    </span>
                                )}
                                <span className="flex-1 text-left text-[13px] truncate">Аккаунт</span>
                                <ChevronUp
                                    className="size-3.5 text-[var(--ms-dim)] transition-transform"
                                    style={{ transform: profileOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            <div className="flex-1 flex flex-col min-w-0 relative">
                <div className="ms-hero-glow" aria-hidden />
                <div className="ms-grid-bg" aria-hidden />

                {/* Mobile-only top bar */}
                <header className="md:hidden relative z-10 flex items-center gap-3 px-4 h-14 shrink-0">
                    <button
                        type="button"
                        onClick={onExit}
                        className="ms-btn-ghost flex items-center justify-center size-9 shrink-0"
                        aria-label="Назад"
                    >
                        <ArrowLeft className="size-5" />
                    </button>
                    <p className="flex-1 text-center text-xs font-bold uppercase tracking-widest truncate">
                        Маркетинг Студия
                    </p>
                    <div className="size-9 shrink-0" aria-hidden />
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
