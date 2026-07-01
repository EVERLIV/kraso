
import React, { useEffect, useRef, useState } from 'react';
import { Bell, Sparkles, Glasses, ArrowLeft, LayoutGrid, Image as ImageIcon, Video, Home, Zap, User as UserIcon, CreditCard, LogOut } from 'lucide-react';
import PricingModal, { PLANS } from './PricingModal'; // Import pricing
import { SubscriptionTier, ViewMode } from '../types';
import { useAuth } from '../contexts/AuthContext';

type AccountTab = 'profile' | 'subscription' | 'usage' | 'promocode';

interface HeaderProps {
  credits: number;
  onOpenAccountTab: (tab: AccountTab) => void;
  onOpenCredits: (tab: 'upgrade' | 'topup') => void;
  userTier: SubscriptionTier;
  /** На мобильном в режиме чата/оживления показывать «Назад» вместо меню */
  showBackOnMobile?: boolean;
  onBack?: () => void;
  currentView?: ViewMode;
  onChangeView?: (view: ViewMode) => void;
}

// Credit ring geometry — a progress ring drawn around the avatar
const RING_SIZE = 46;
const RING_RADIUS = 21;
const RING_STROKE = 4;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
const CREDIT_SEGMENTS = 10;

const Header: React.FC<HeaderProps> = ({ credits, onOpenAccountTab, onOpenCredits, userTier, showBackOnMobile, onBack, currentView, onChangeView }) => {
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

  // Tier display names
  const TIER_LABELS: Record<SubscriptionTier, string> = {
    'free': 'Free',
    'creator': 'Creator',
    'pro': 'Pro',
    'business': 'Business'
  };

  // Credits as a ring around the avatar: starts as a full lime circle at 100%, the lime arc
  // shrinks as credits are spent (the spent portion reads as a neutral gray), and it only
  // turns red once the balance is nearly gone.
  const totalCredits = PLANS.find(p => p.id === userTier)?.credits || credits || 1;
  const creditRatio = Math.max(0, Math.min(1, credits / totalCredits));
  const ringColor = creditRatio > 0.5 ? 'var(--primary)' : creditRatio > 0.15 ? '#f97316' : '#ef4444';
  const ringTrackColor = 'var(--border-color)';
  const ringOffset = RING_CIRCUMFERENCE * (1 - creditRatio);
  const filledSegments = Math.round(creditRatio * CREDIT_SEGMENTS);

  return (
    <>
      <PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} onSuccess={() => { }} currentTier={userTier} />

      <header className="h-14 bg-background-light border-b border-[var(--border-strong)] flex items-center justify-between px-4 lg:px-6 sticky top-0 z-40 text-ink shrink-0">

        <div className="flex items-center gap-4">
          {showBackOnMobile && (
            <button
              onClick={onBack}
              className="lg:hidden p-2 text-ink hover:bg-surface-muted rounded-lg transition-colors"
              aria-label="Назад"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          {/* Logo Area - Studio Style */}
          <div className="flex items-center gap-3 select-none cursor-pointer group">
            <div className="w-[38px] h-[38px] bg-brand-grad rounded-[11px] flex items-center justify-center shadow-[0_6px_16px_-6px_rgba(168,85,247,.5)] group-hover:scale-105 transition-transform duration-300 relative overflow-hidden">
              {/* Glossy Effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/35 to-transparent"></div>
              <Glasses className="w-5 h-5 text-white relative z-10 drop-shadow-md" />
            </div>
            <div className="flex flex-col justify-center leading-none">
              <div className="flex items-center gap-[7px]">
                <span className="font-extrabold text-ink text-lg leading-none tracking-[-0.02em] font-sans">КрасоМир</span>
                <span className="hidden sm:inline-flex items-center px-[5px] py-0.5 rounded-[5px] bg-ai-badge text-on-primary text-[9px] font-extrabold uppercase tracking-[0.08em] shadow-sm">
                  AI
                </span>
              </div>
              <span className="hidden lg:block text-[10.5px] text-ink-faint font-medium tracking-wide mt-[3px]">
                Умная фотостудия
              </span>
            </div>
          </div>

          {/* Nav tabs — Главная · Шаблоны · Генерация фото · Генерация видео (desktop only; mobile uses the bottom tab bar) */}
          {onChangeView && (
            <nav className="hidden lg:flex items-center gap-1 ml-2 overflow-x-auto no-scrollbar">
              {([
                { view: 'dashboard', icon: Home, label: 'Главная' },
                { view: 'templates', icon: LayoutGrid, label: 'Шаблоны' },
                { view: 'chat', icon: ImageIcon, label: 'Генерация фото' },
                { view: 'video', icon: Video, label: 'Генерация видео' },
              ] as const).map(t => (
                <button
                  key={t.view}
                  onClick={() => onChangeView(t.view)}
                  className={`flex items-center gap-1.5 text-sm font-semibold px-3 py-2 rounded-[9px] whitespace-nowrap transition-colors ${currentView === t.view ? 'text-ink bg-surface-muted' : 'text-ink-muted hover:text-ink hover:bg-surface-muted/60'}`}
                >
                  <t.icon className="w-[15px] h-[15px]" />
                  <span>{t.label}</span>
                </button>
              ))}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          {/* Desktop Helper Icons */}
          <div className="hidden md:flex items-center gap-1">
            <button className="p-2 text-ink-muted hover:text-ink hover:bg-surface-muted rounded-full transition-colors relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
            </button>
          </div>

          <div className="h-6 w-px bg-[var(--border-color)] hidden md:block"></div>

          {/* Tariff CTA (Desktop) — goes to the tariff upgrade page */}
          <button
            onClick={() => onOpenCredits('upgrade')}
            className="hidden sm:flex items-center gap-[7px] text-on-primary text-sm font-bold px-[18px] py-[9px] rounded-full shadow-cta active:scale-95 transition-all bg-primary hover:bg-primary-hover"
          >
            <Sparkles className="w-[15px] h-[15px]" />
            <span>Тариф {TIER_LABELS[userTier]}</span>
          </button>

          {/* User Avatar — doubles as the credits indicator via a progress ring; click opens the account card */}
          <div className="relative" ref={accountCardRef}>
            <button
              className="relative flex items-center justify-center shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
              style={{ width: RING_SIZE, height: RING_SIZE }}
              onClick={() => setIsAccountCardOpen(o => !o)}
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
                  style={{ transition: 'stroke-dashoffset 0.4s ease, stroke 0.4s ease' }}
                />
              </svg>

              <div className="w-[38px] h-[38px] rounded-full shadow-md overflow-hidden">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="w-full h-full rounded-full bg-card-light object-cover" />
              </div>
            </button>

            {/* Account card — toggled by clicking the avatar, closes on outside click or menu selection */}
            <div className={`absolute top-full right-0 pt-2 transition-all duration-150 z-50 ${isAccountCardOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-1 pointer-events-none'}`}>
              <div className="w-[280px] rounded-xl border border-[var(--border-color)] bg-card-light shadow-toast overflow-hidden">

                {/* Identity */}
                <div className="flex items-center gap-3 px-4 py-3.5">
                  <div className="w-10 h-10 rounded-full bg-brand-grad p-[2px] shrink-0">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="w-full h-full rounded-full bg-card-light object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-ink truncate">{user?.displayName || user?.email || 'Гость'}</p>
                    <p className="text-xs text-ink-faint">{TIER_LABELS[userTier]} план</p>
                  </div>
                </div>

                <div className="h-px bg-[var(--border-strong)]" />

                {/* Credits */}
                <div className="px-4 py-3.5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-ink-muted uppercase tracking-wide">Кредиты</span>
                    <span className="text-sm font-bold text-ink tabular-nums">{credits} <span className="text-ink-faint font-medium">осталось</span></span>
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: CREDIT_SEGMENTS }).map((_, i) => (
                      <span
                        key={i}
                        className="h-1.5 flex-1 rounded-full transition-colors"
                        style={{ backgroundColor: i < filledSegments ? ringColor : 'var(--border-color)' }}
                      />
                    ))}
                  </div>
                </div>

                <div className="h-px bg-[var(--border-strong)]" />

                {/* Actions */}
                <div className="py-1.5">
                  <button
                    onClick={() => { setIsAccountCardOpen(false); onOpenCredits('topup'); }}
                    className="w-full flex items-center justify-between gap-2.5 px-4 py-2.5 text-sm font-semibold text-ink hover:bg-surface-muted transition-colors"
                  >
                    <span className="flex items-center gap-2.5 whitespace-nowrap">
                      <Zap className="w-4 h-4 text-primary" />
                      <span>Пополнить кредиты</span>
                    </span>
                    <span className="shrink-0 text-[11px] font-bold text-on-primary bg-primary px-2.5 py-1 rounded-full">Открыть</span>
                  </button>
                  <button
                    onClick={() => goToAccountTab('profile')}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-ink hover:bg-surface-muted transition-colors"
                  >
                    <UserIcon className="w-4 h-4 text-ink-muted" />
                    <span>Профиль</span>
                  </button>
                  <button
                    onClick={() => { setIsAccountCardOpen(false); onOpenCredits('upgrade'); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-ink hover:bg-surface-muted transition-colors"
                  >
                    <CreditCard className="w-4 h-4 text-ink-muted" />
                    <span>Управление подпиской</span>
                  </button>
                </div>

                <div className="h-px bg-[var(--border-strong)]" />

                <div className="py-1.5">
                  <button
                    onClick={() => { setIsAccountCardOpen(false); logout(); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-red-400 hover:bg-surface-muted transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Выйти</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
