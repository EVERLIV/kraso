
import React, { useState } from 'react';
import { Bell, Zap, Menu, Sparkles, Glasses, ArrowLeft, LayoutGrid, Image as ImageIcon, Video, Home } from 'lucide-react';
import PricingModal from './PricingModal'; // Import pricing
import { SubscriptionTier, ViewMode } from '../types';

interface HeaderProps {
  toggleSidebar: () => void;
  credits: number;
  onOpenProfile: () => void;
  userTier: SubscriptionTier;
  /** На мобильном в режиме чата/оживления показывать «Назад» вместо меню */
  showBackOnMobile?: boolean;
  onBack?: () => void;
  currentView?: ViewMode;
  onChangeView?: (view: ViewMode) => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, credits, onOpenProfile, userTier, showBackOnMobile, onBack, currentView, onChangeView }) => {
  const [showPricing, setShowPricing] = useState(false);

  // Tier display names
  const TIER_LABELS: Record<SubscriptionTier, string> = {
    'free': 'Free',
    'creator': 'Creator',
    'pro': 'Pro',
    'business': 'Business'
  };

  return (
    <>
      <PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} onSuccess={() => { }} currentTier={userTier} />

      <header className="h-14 bg-background-light border-b border-[var(--border-strong)] flex items-center justify-between px-4 lg:px-6 sticky top-0 z-40 text-ink shrink-0">

        <div className="flex items-center gap-4">
          {showBackOnMobile ? (
            <button
              onClick={onBack}
              className="lg:hidden p-2 text-ink hover:bg-surface-muted rounded-lg transition-colors"
              aria-label="Назад"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 text-ink-muted hover:text-ink transition-colors"
              aria-label="Меню"
            >
              <Menu className="w-5 h-5" />
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

          {/* Nav tabs — Главная · Шаблоны · Генерация фото · Генерация видео */}
          {onChangeView && (
            <nav className="flex items-center gap-0.5 md:gap-1 ml-1 md:ml-2 overflow-x-auto no-scrollbar">
              {([
                { view: 'dashboard', icon: Home, label: 'Главная', short: 'Главная' },
                { view: 'templates', icon: LayoutGrid, label: 'Шаблоны', short: 'Шаблоны' },
                { view: 'chat', icon: ImageIcon, label: 'Генерация фото', short: 'Фото' },
                { view: 'video', icon: Video, label: 'Генерация видео', short: 'Видео' },
              ] as const).map(t => (
                <button
                  key={t.view}
                  onClick={() => onChangeView(t.view)}
                  className={`flex items-center gap-1.5 text-[13px] md:text-sm font-semibold px-2.5 md:px-3 py-2 rounded-[9px] whitespace-nowrap transition-colors ${currentView === t.view ? 'text-ink bg-surface-muted' : 'text-ink-muted hover:text-ink hover:bg-surface-muted/60'}`}
                >
                  <t.icon className="w-[15px] h-[15px]" />
                  <span className="hidden md:inline">{t.label}</span>
                  <span className="md:hidden">{t.short}</span>
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

          {/* Credits Badge */}
          <div
            onClick={() => onChangeView ? onChangeView('profile') : setShowPricing(true)}
            className="flex items-center gap-[7px] bg-card-light border border-[var(--border-color)] px-[13px] py-[7px] rounded-full hover:bg-surface-muted transition-colors cursor-pointer group"
          >
            <span className="w-[18px] h-[18px] rounded-full bg-amber-100 flex items-center justify-center">
              <Zap className="w-[11px] h-[11px] text-amber-500" fill="currentColor" />
            </span>
            <span className="text-[13px] font-bold text-ink tabular-nums">
              {credits} <span className="text-ink-faint font-medium ml-0.5">кр.</span>
            </span>
          </div>

          {/* Tariff CTA (Desktop) — goes to Account → Subscription */}
          <button
            onClick={() => onChangeView ? onChangeView('profile') : setShowPricing(true)}
            className="hidden sm:flex items-center gap-[7px] text-on-primary text-sm font-bold px-[18px] py-[9px] rounded-full shadow-cta active:scale-95 transition-all bg-primary hover:bg-primary-hover"
          >
            <Sparkles className="w-[15px] h-[15px]" />
            <span>Тариф {TIER_LABELS[userTier]}</span>
          </button>

          {/* User Avatar */}
          <button
            className="flex items-center cursor-pointer hover:opacity-90 transition-opacity"
            onClick={onOpenProfile}
          >
            <div className="w-[38px] h-[38px] rounded-full bg-brand-grad p-[2px] shadow-md relative">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="w-full h-full rounded-full bg-card-light object-cover border-2 border-background-light" />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-background-light rounded-full"></div>
            </div>
          </button>
        </div>
      </header>
    </>
  );
};

export default Header;
