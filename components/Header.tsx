import React, { useEffect, useRef, useState } from 'react';
import {
    Bell, Glasses, ArrowLeft, FolderHeart, Globe,
    Zap, User as UserIcon, CreditCard, LogOut, Menu, Rocket,
} from 'lucide-react';
import PricingModal, { PLANS } from './PricingModal';
import { SubscriptionTier, ViewMode } from '../types';
import { SHORTS_STUDIO_ENABLED } from '../lib/featureFlags';
import { useAuth } from '../contexts/AuthContext';

type AccountTab = 'profile' | 'subscription' | 'usage' | 'promocode';
type HistoryTab = 'history' | 'community';

interface HeaderProps {
    credits: number;
    onOpenAccountTab: (tab: AccountTab) => void;
    onOpenCredits: (tab: 'upgrade' | 'topup') => void;
    userTier: SubscriptionTier;
    showBackOnMobile?: boolean;
    onBack?: () => void;
    currentView?: ViewMode;
    onChangeView?: (view: ViewMode) => void;
    /** Second row: История / Сообщество */
    showSubNav?: boolean;
    historyTab?: HistoryTab;
    onHistoryTab?: (tab: HistoryTab) => void;
    showDensitySlider?: boolean;
    historyColumns?: number;
    onHistoryColumnsChange?: (columns: number) => void;
    historyCount?: number;
    subNavExtra?: React.ReactNode;
}

const RING_SIZE = 40;
const RING_RADIUS = 18;
const RING_STROKE = 3;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
const CREDIT_SEGMENTS = 10;

const MAIN_NAV: { view: ViewMode; label: string }[] = [
    { view: 'dashboard', label: 'Главная' },
    { view: 'templates', label: 'Шаблоны' },
    { view: 'chat', label: 'Фото' },
    { view: 'shorts', label: 'Shorts' },
    { view: 'video', label: 'Видео' },
    { view: 'upscale', label: 'Upscale' },
    { view: 'recolor', label: 'Палитра' },
    { view: 'restore', label: 'Реставрация' },
    { view: 'marketing', label: 'Маркетинг' },
];

const TIER_LABELS: Record<SubscriptionTier, string> = {
    free: 'Free',
    creator: 'Creator',
    pro: 'Pro',
    business: 'Business',
};

function Header({
    credits,
    onOpenAccountTab,
    onOpenCredits,
    userTier,
    showBackOnMobile,
    onBack,
    currentView,
    onChangeView,
    showSubNav,
    historyTab = 'history',
    onHistoryTab,
    showDensitySlider,
    historyColumns = 8,
    onHistoryColumnsChange,
    historyCount = 0,
    subNavExtra,
}: HeaderProps) {
    const [showPricing, setShowPricing] = useState(false);
    const [isAccountCardOpen, setIsAccountCardOpen] = useState(false);
    const accountCardRef = useRef<HTMLDivElement>(null);
    const { user, logout } = useAuth();

    useEffect(() => {
        if (!isAccountCardOpen) return;
        const handleClickOutside = (e: MouseEvent) => {
            if (accountCardRef.current && !accountCardRef.current.contains(e.target as Node)) {
                setIsAccountCardOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isAccountCardOpen]);

    const goToAccountTab = (tab: AccountTab) => {
        setIsAccountCardOpen(false);
        onOpenAccountTab(tab);
    };

    const totalCredits = PLANS.find(p => p.id === userTier)?.credits || credits || 1;
    const creditRatio = Math.max(0, Math.min(1, credits / totalCredits));
    const ringColor = creditRatio > 0.5 ? 'var(--primary)' : creditRatio > 0.15 ? '#f97316' : '#ef4444';
    const ringTrackColor = 'var(--border-color)';
    const ringOffset = RING_CIRCUMFERENCE * (1 - creditRatio);
    const filledSegments = Math.round(creditRatio * CREDIT_SEGMENTS);

    const navLinkClass = (active: boolean) =>
        `shrink-0 px-2.5 py-1.5 text-sm font-medium whitespace-nowrap rounded-[6px] transition-colors duration-100 ${
            active
                ? 'text-ink bg-surface-raised'
                : 'text-ink-muted hover:text-ink hover:bg-surface-raised'
        }`;

    const goHistory = (tab: HistoryTab) => {
        onHistoryTab?.(tab);
        onChangeView?.('history');
    };

    const toggleAccountMenu = () => setIsAccountCardOpen(o => !o);
    const closeAccountMenu = () => setIsAccountCardOpen(false);

    const accountMenuPanel = (
        <div className="w-[min(calc(100vw-1.5rem),20rem)] rounded-xl border border-[var(--border-color)] bg-card-light shadow-lg overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-4 lg:py-3.5">
                <div className="size-10 rounded-full bg-primary p-[2px] shrink-0">
                    <img src={user?.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'} alt="" className="size-full rounded-full bg-card-light object-cover" />
                </div>
                <div className="min-w-0">
                    <p className="text-sm font-bold text-ink truncate">{user?.displayName || user?.email || 'Гость'}</p>
                    <p className="text-xs text-ink-faint">{TIER_LABELS[userTier]} план</p>
                </div>
            </div>

            <div className="h-px bg-[var(--border-strong)]" />

            <div className="px-4 py-4 lg:py-3.5">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-ink-muted uppercase">Кредиты</span>
                    <span className="text-sm font-bold text-ink tabular-nums">{credits} <span className="text-ink-faint font-medium">осталось</span></span>
                </div>
                <div className="flex items-center gap-1">
                    {Array.from({ length: CREDIT_SEGMENTS }).map((_, i) => (
                        <span
                            key={i}
                            className="h-1.5 flex-1 rounded-full"
                            style={{ backgroundColor: i < filledSegments ? ringColor : 'var(--border-color)' }}
                        />
                    ))}
                </div>
            </div>

            <div className="h-px bg-[var(--border-strong)]" />

            <div className="py-2 lg:py-1.5">
                <button type="button" onClick={() => { closeAccountMenu(); onOpenCredits('topup'); }} className="w-full flex items-center justify-between gap-2.5 px-4 py-3 lg:py-2.5 text-sm font-semibold text-ink hover:bg-surface-muted transition-colors duration-100">
                    <span className="flex items-center gap-2.5">
                        <Zap className="size-4 text-primary" />
                        Пополнить кредиты
                    </span>
                    <span className="text-xs font-bold text-on-primary bg-primary px-2 py-0.5 rounded-full">Открыть</span>
                </button>
                <button type="button" onClick={() => goToAccountTab('profile')} className="w-full flex items-center gap-2.5 px-4 py-3 lg:py-2.5 text-sm font-semibold text-ink hover:bg-surface-muted transition-colors duration-100">
                    <UserIcon className="size-4 text-ink-muted" />
                    Профиль
                </button>
                <button type="button" onClick={() => { closeAccountMenu(); onOpenCredits('upgrade'); }} className="w-full flex items-center gap-2.5 px-4 py-3 lg:py-2.5 text-sm font-semibold text-ink hover:bg-surface-muted transition-colors duration-100">
                    <CreditCard className="size-4 text-ink-muted" />
                    Управление подпиской
                </button>
            </div>

            <div className="h-px bg-[var(--border-strong)]" />

            <div className="py-2 lg:py-1.5">
                <button type="button" onClick={() => { closeAccountMenu(); logout(); }} className="w-full flex items-center gap-2.5 px-4 py-3 lg:py-2.5 text-sm font-semibold text-red-400 hover:bg-surface-muted transition-colors duration-100">
                    <LogOut className="size-4" />
                    Выйти
                </button>
            </div>
        </div>
    );

    return (
        <>
            <PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} onSuccess={() => { }} currentTier={userTier} />

            <header className="sticky top-0 z-40 bg-background-light border-b border-[var(--border-strong)] shrink-0">
                {/* Row 1 — logo · nav · utilities */}
                <div className="min-h-[52px] py-3 lg:h-11 lg:py-0 flex items-center gap-2 px-3 lg:px-5">
                    {showBackOnMobile && (
                        <button
                            type="button"
                            onClick={onBack}
                            className="lg:hidden size-8 flex items-center justify-center text-ink-muted hover:text-ink rounded-[6px] hover:bg-surface-raised transition-colors duration-100"
                            aria-label="Назад"
                        >
                            <ArrowLeft className="size-4" />
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={() => onChangeView?.('dashboard')}
                        className="flex items-center gap-2 shrink-0 min-w-0"
                        aria-label="КрасоМир — на главную"
                    >
                        <span className="size-8 flex items-center justify-center rounded-lg bg-ink-faint text-ink lg:bg-primary lg:text-on-primary hover:opacity-90 transition-opacity duration-100 shrink-0">
                            <Glasses className="size-4" />
                        </span>
                        <span className="lg:hidden text-sm font-semibold text-ink truncate">КрасоМир</span>
                    </button>

                    {onChangeView && (
                        <nav className="hidden lg:flex items-center gap-0.5 sm:gap-1 min-w-0 flex-1">
                            {(SHORTS_STUDIO_ENABLED ? MAIN_NAV : MAIN_NAV.filter(t => t.view !== 'shorts')).map(t => (
                                <button
                                    key={t.view}
                                    type="button"
                                    onClick={() => onChangeView(t.view)}
                                    className={navLinkClass(currentView === t.view)}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </nav>
                    )}

                    <div className="flex-1 lg:flex-none" />

                    <div className="flex items-center gap-1.5 shrink-0">
                        <button
                            type="button"
                            onClick={() => onOpenCredits('upgrade')}
                            className="flex items-center gap-1.5 h-9 lg:h-8 px-2.5 sm:px-3 rounded-md bg-surface-muted border border-[var(--border-color)] text-sm font-bold text-ink hover:bg-[var(--border-soft)] transition-colors duration-100"
                        >
                            <Rocket className="size-3.5 text-ink-muted shrink-0" />
                            <span>Улучшить</span>
                        </button>

                        <a
                            href="https://max.ru/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="lg:hidden size-9 flex items-center justify-center rounded-lg hover:bg-surface-muted transition-colors duration-100"
                            aria-label="Max"
                        >
                            <img
                                src="/icons/max-icon.webp"
                                alt=""
                                width={16}
                                height={16}
                                className="size-4 object-contain"
                                loading="lazy"
                                decoding="async"
                            />
                        </a>

                        <button
                            type="button"
                            onClick={() => onChangeView?.('history')}
                            className="hidden lg:flex items-center gap-1.5 h-8 px-2.5 text-sm font-medium text-ink-muted hover:text-ink rounded-[6px] hover:bg-surface-raised transition-colors duration-100"
                        >
                            <FolderHeart className="size-4" />
                            <span>Библиотека</span>
                        </button>

                        <button
                            type="button"
                            className="hidden lg:flex size-8 items-center justify-center text-ink-muted hover:text-ink rounded-[6px] hover:bg-surface-raised transition-colors duration-100 relative"
                            aria-label="Уведомления"
                        >
                            <Bell className="size-4" />
                            <span className="absolute top-1.5 right-1.5 size-1.5 bg-red-500 rounded-full" />
                        </button>

                        <div className="relative" ref={accountCardRef}>
                            <button
                                type="button"
                                className="hidden lg:flex relative items-center justify-center shrink-0 hover:opacity-90 transition-opacity duration-100"
                                style={{ width: RING_SIZE, height: RING_SIZE }}
                                onClick={toggleAccountMenu}
                                aria-label={`${credits} кредитов`}
                                aria-expanded={isAccountCardOpen}
                            >
                                <svg width={RING_SIZE} height={RING_SIZE} viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`} className="absolute inset-0 -rotate-90">
                                    <circle cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={RING_RADIUS} fill="none" stroke={ringTrackColor} strokeWidth={RING_STROKE} />
                                    <circle
                                        cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={RING_RADIUS} fill="none"
                                        stroke={ringColor} strokeWidth={RING_STROKE} strokeLinecap="round"
                                        strokeDasharray={RING_CIRCUMFERENCE}
                                        strokeDashoffset={ringOffset}
                                    />
                                </svg>
                                <div className="size-[34px] rounded-full overflow-hidden bg-card-light">
                                    <img
                                        src={user?.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'}
                                        alt="Профиль"
                                        className="size-full object-cover"
                                    />
                                </div>
                            </button>

                            <button
                                type="button"
                                className="lg:hidden size-9 flex items-center justify-center text-ink-muted hover:text-ink transition-colors duration-100"
                                onClick={toggleAccountMenu}
                                aria-label="Меню"
                                aria-expanded={isAccountCardOpen}
                            >
                                <Menu className="size-5" />
                            </button>

                            <div className={`absolute top-full right-0 pt-2.5 lg:pt-2 transition-opacity transition-transform duration-150 ease-out z-50 ${isAccountCardOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-1 pointer-events-none'}`}>
                                {accountMenuPanel}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Row 2 — История / Сообщество */}
                {showSubNav && (
                    <div className="flex items-center justify-between gap-3 px-3 lg:px-5 py-3.5 lg:py-2.5 border-t border-[var(--border-strong)]">
                        <div className="flex items-center gap-2 min-w-0">
                            <button
                                type="button"
                                onClick={() => goHistory('history')}
                                className={`inline-flex items-center gap-1.5 h-9 lg:h-8 px-3.5 rounded-[6px] text-sm font-medium transition-colors duration-100 ${
                                    currentView === 'history' && historyTab === 'history'
                                        ? 'bg-surface-raised text-ink'
                                        : 'text-ink-muted hover:text-ink hover:bg-surface-raised'
                                }`}
                            >
                                <FolderHeart className="size-4" />
                                История
                            </button>
                            <button
                                type="button"
                                onClick={() => goHistory('community')}
                                className={`inline-flex items-center gap-1.5 h-9 lg:h-8 px-3 rounded-[6px] text-sm font-medium transition-colors duration-100 ${
                                    currentView === 'history' && historyTab === 'community'
                                        ? 'bg-surface-raised text-ink'
                                        : 'text-ink-muted hover:text-ink hover:bg-surface-raised'
                                }`}
                            >
                                <Globe className="size-4" />
                                Сообщество
                            </button>
                            {subNavExtra && (
                                <>
                                    <div className="h-4 w-px bg-[var(--border-color)] mx-0.5 shrink-0" />
                                    {subNavExtra}
                                </>
                            )}
                        </div>

                        {showDensitySlider && currentView === 'history' && historyTab === 'history' && historyCount > 0 && onHistoryColumnsChange && (
                            <input
                                type="range"
                                min={6}
                                max={12}
                                step={1}
                                value={18 - historyColumns}
                                onChange={(e) => onHistoryColumnsChange(18 - Number(e.target.value))}
                                aria-label="Размер превью"
                                className="hidden sm:block w-24 h-4 shrink-0 appearance-none bg-transparent cursor-pointer
                                    [&::-webkit-slider-runnable-track]:h-0.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-[var(--border-color)]
                                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-2.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-ink-muted [&::-webkit-slider-thumb]:mt-[-4px] [&::-webkit-slider-thumb]:hover:bg-ink
                                    [&::-moz-range-track]:h-0.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-[var(--border-color)]
                                    [&::-moz-range-thumb]:size-2.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-ink-muted [&::-moz-range-thumb]:border-0"
                            />
                        )}
                    </div>
                )}
            </header>
        </>
    );
}

export default Header;
