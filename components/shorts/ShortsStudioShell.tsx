import React from 'react';
import { Layers, HelpCircle, ArrowLeft, FolderHeart, LayoutGrid } from 'lucide-react';
import MarketingStudioSwitcher, { StudioId } from '../marketing/MarketingStudioSwitcher';
import MarketingIconTile from '../marketing/MarketingIconTile';
import '../marketing/marketingTheme.css';
import './shortsTheme.css';

export type ShortsTab = 'presets' | 'history' | 'how';

interface ShortsStudioShellProps {
    children: React.ReactNode;
    sidebar: React.ReactNode;
    tab: ShortsTab;
    onTabChange: (tab: ShortsTab) => void;
    credits: number;
    userPhoto?: string | null;
    onExit: () => void;
    onOpenCredits: () => void;
    onSwitchStudio: (studio: StudioId) => void;
}

function ShortsStudioShell({
    children, sidebar, tab, onTabChange,
    credits, userPhoto, onExit, onOpenCredits, onSwitchStudio,
}: ShortsStudioShellProps) {
    const navItem = (id: ShortsTab, tile: 'lime' | 'pink' | 'purple', label: string, icon: React.ReactNode) => (
        <button
            type="button"
            onClick={() => onTabChange(id)}
            className={`ms-nav-item w-full ${tab === id ? 'ms-nav-item--active' : ''}`}
        >
            <MarketingIconTile variant={tile} size="nav">{icon}</MarketingIconTile>
            {label}
        </button>
    );

    const mobileTab = (id: ShortsTab, label: string, icon: React.ReactNode) => (
        <button
            type="button"
            onClick={() => onTabChange(id)}
            className={`shrink-0 inline-flex items-center gap-1.5 ${
                tab === id ? 'ms-filter-active' : 'ms-filter-inactive'
            }`}
        >
            {icon}
            {label}
        </button>
    );

    return (
        <div className="ms h-dvh flex overflow-hidden">
            <aside className="hidden md:flex w-[260px] shrink-0 flex-col p-4">
                <div className="ms-panel p-[18px_14px] flex flex-col h-full shadow-[var(--ms-shadow-panel)]">
                    <MarketingStudioSwitcher current="shorts" onSelect={onSwitchStudio} />

                    <nav className="flex flex-col gap-0.5">
                        {navItem('presets', 'lime', 'Пресеты', <LayoutGrid className="size-3 text-[var(--ms-on-lime)]" />)}
                        {navItem('history', 'pink', 'История', <Layers className="size-3 text-white" />)}
                        {navItem('how', 'purple', 'Как это работает', <HelpCircle className="size-3 text-white" />)}
                    </nav>

                    <p className="ms-section-label">Создание</p>
                    <div className="flex flex-col gap-3 min-h-0 flex-1">
                        {sidebar}
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
                    <p className="md:hidden flex-1 text-center text-xs font-bold uppercase truncate">
                        Shorts Studio
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
                            onClick={() => onTabChange('history')}
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

                <div className="md:hidden flex gap-2 px-4 py-2 overflow-x-auto no-scrollbar">
                    {mobileTab('presets', 'Пресеты', null)}
                    {mobileTab('history', 'История', <Layers className="size-3.5" />)}
                    {mobileTab('how', 'Как', <HelpCircle className="size-3.5" />)}
                </div>

                <main className="relative z-10 flex-1 overflow-y-auto custom-scrollbar">
                    <div className="md:hidden px-4 pb-4">
                        <div className="ms-panel p-3.5 shadow-[var(--ms-shadow-panel)]">
                            <p className="ms-section-label !px-0 !pt-0 !pb-2">Создание</p>
                            {sidebar}
                        </div>
                    </div>
                    {children}
                </main>
            </div>
        </div>
    );
}

export default ShortsStudioShell;
