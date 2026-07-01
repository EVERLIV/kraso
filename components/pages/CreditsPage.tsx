
import React, { useState } from 'react';
import { Check, Zap, Crown, Briefcase, User, Loader2, ShieldCheck, Sparkles } from 'lucide-react';
import { SubscriptionPlan, SubscriptionTier } from '../../types';
import { PLANS } from '../PricingModal';

export interface CreditPack {
    id: string;
    credits: number;
    price: number;
    oldPrice: number;
    badge?: string;
    description: string;
}

// One-off top-ups — cheaper per credit the bigger the pack, same idea as our monthly tariffs.
export const CREDIT_PACKS: CreditPack[] = [
    { id: 'credits_4000', credits: 4000, price: 2490, oldPrice: 4490, badge: 'Топ выгода', description: 'Максимум кредитов за рубль · для команд и агентств' },
    { id: 'credits_1500', credits: 1500, price: 1190, oldPrice: 1890, badge: 'Популярно', description: 'Для активных проектов и частых генераций' },
    { id: 'credits_750', credits: 750, price: 690, oldPrice: 990, description: 'Выгоднее разового тарифа Pro' },
    { id: 'credits_300', credits: 300, price: 349, oldPrice: 549, description: 'Хватит на месяц активной работы' },
    { id: 'credits_100', credits: 100, price: 149, oldPrice: 199, description: '~100 генераций в HD' },
];

const formatRUB = (price: number) => new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 }).format(price);

const PLAN_ICON: Record<SubscriptionTier, React.ElementType> = {
    free: User,
    creator: Zap,
    pro: Crown,
    business: Briefcase,
};

// The same pressed-in "3D" button used for the mobile FAB — chunky, glossy, springs back on click.
const BUTTON_3D = `relative flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-xl font-extrabold text-[13px] text-on-primary whitespace-nowrap
  bg-gradient-to-b from-[#d4ff3a] to-[#9bdd04] border-t border-white/40
  shadow-[0_4px_0_0_#6fa000,0_6px_14px_-4px_rgba(0,0,0,0.6)]
  active:translate-y-[3px] active:shadow-[0_1px_0_0_#6fa000,0_2px_6px_-2px_rgba(0,0,0,0.5)]
  transition-all duration-100 disabled:opacity-60 disabled:pointer-events-none`;

interface CreditsPageProps {
    userTier: SubscriptionTier;
    initialTab?: 'upgrade' | 'topup';
    onUpgrade: (plan: SubscriptionPlan) => void;
    onBuyCredits: (pack: CreditPack) => void;
    processingId?: string | null;
}

const CreditsPage: React.FC<CreditsPageProps> = ({ userTier, initialTab = 'upgrade', onUpgrade, onBuyCredits, processingId }) => {
    const [tab, setTab] = useState<'upgrade' | 'topup'>(initialTab);

    return (
        <div className="min-h-screen bg-background-light text-ink pb-20">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-10">
                {/* Tabs */}
                <div className="flex justify-center mb-8">
                    <div className="inline-flex items-center gap-1 p-1 rounded-full bg-card-light border border-[var(--border-color)]">
                        <button
                            onClick={() => setTab('upgrade')}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-bold transition-colors ${tab === 'upgrade' ? 'bg-primary text-on-primary' : 'text-ink-muted hover:text-ink'}`}
                        >
                            <Sparkles className="w-3.5 h-3.5" />
                            Обновить тариф
                        </button>
                        <button
                            onClick={() => setTab('topup')}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-bold transition-colors ${tab === 'topup' ? 'bg-primary text-on-primary' : 'text-ink-muted hover:text-ink'}`}
                        >
                            <Zap className="w-3.5 h-3.5" />
                            Пополнить кредиты
                        </button>
                    </div>
                </div>

                <div className="text-center mb-8">
                    <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight mb-2 uppercase">
                        {tab === 'upgrade' ? 'Обновите тариф' : 'Пополните кредиты'}
                    </h1>
                    <p className="text-ink-muted text-sm max-w-lg mx-auto">
                        {tab === 'upgrade'
                            ? 'Выберите план побольше — или докупите кредиты отдельным пакетом.'
                            : '1 кредит = 1 генерация. Кредиты из пакета не сгорают и складываются с тарифом.'}
                    </p>
                </div>

                {tab === 'upgrade' ? (
                    <div className="space-y-3">
                        {PLANS.map((plan) => {
                            const isCurrent = plan.id === userTier;
                            const Icon = PLAN_ICON[plan.id];
                            return (
                                <div
                                    key={plan.id}
                                    className={`relative rounded-2xl border p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 transition-all ${plan.isPopular ? 'border-primary bg-primary/[0.04] shadow-[0_0_0_1px_var(--primary)]' : 'border-[var(--border-color)] bg-card-light'}`}
                                >
                                    {plan.isPopular && (
                                        <div className="absolute -top-2.5 left-4 bg-primary text-on-primary text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-widest whitespace-nowrap shadow-[0_3px_10px_-2px_rgba(198,248,6,0.6)]">
                                            Хит продаж
                                        </div>
                                    )}

                                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center shrink-0 shadow-md`}>
                                        <Icon className="w-5 h-5 text-white" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-base font-extrabold text-ink mb-1.5">{plan.name}</h3>
                                        <div className="flex flex-wrap gap-x-4 gap-y-1">
                                            {plan.features.map((f, idx) => (
                                                <div key={idx} className="flex items-center gap-1.5 text-[12px] text-ink-body">
                                                    <Check className="w-3 h-3 text-primary shrink-0" />
                                                    <span>{f}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between sm:justify-end gap-4 sm:w-[220px] shrink-0">
                                        <div className="text-right sm:text-right">
                                            <span className="text-xl font-extrabold text-ink">{formatRUB(plan.price)}</span>
                                            {plan.price > 0 && <span className="text-ink-faint text-[11px] font-semibold ml-1">/мес</span>}
                                        </div>
                                        {isCurrent ? (
                                            <span className="px-4 py-2.5 rounded-xl font-bold text-[13px] bg-surface-muted text-ink-faint flex items-center gap-1.5 shrink-0">
                                                <Check className="w-3.5 h-3.5" /> Ваш тариф
                                            </span>
                                        ) : (
                                            <button onClick={() => onUpgrade(plan)} disabled={processingId === plan.id} className={BUTTON_3D}>
                                                {processingId === plan.id ? <Loader2 className="w-4 h-4 animate-spin" /> : plan.id === 'free' ? 'Бесплатно' : 'Выбрать'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {CREDIT_PACKS.map((pack) => {
                            const discount = Math.round((1 - pack.price / pack.oldPrice) * 100);
                            const highlighted = !!pack.badge;
                            return (
                                <div
                                    key={pack.id}
                                    className={`relative rounded-2xl border p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 transition-all ${highlighted ? 'border-primary bg-primary/[0.04] shadow-[0_0_0_1px_var(--primary)]' : 'border-[var(--border-color)] bg-card-light'}`}
                                >
                                    <div className="w-10 h-10 rounded-xl bg-ai-badge flex items-center justify-center shrink-0 shadow-md">
                                        <Zap className="w-5 h-5 text-on-primary" fill="currentColor" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                            <h3 className="text-base font-extrabold text-ink whitespace-nowrap">{pack.credits.toLocaleString('ru-RU')} кредитов</h3>
                                            <span className="text-[10.5px] font-bold text-white bg-gradient-to-br from-rose-500 to-pink-600 px-2 py-0.5 rounded-full shadow-sm">-{discount}%</span>
                                            {pack.badge && (
                                                <span className="text-[9px] font-extrabold text-on-primary bg-primary px-2 py-0.5 rounded-full uppercase tracking-widest">{pack.badge}</span>
                                            )}
                                        </div>
                                        <p className="text-[12px] text-ink-muted">{pack.description}</p>
                                    </div>

                                    <div className="flex items-center justify-between sm:justify-end gap-4 sm:w-[220px] shrink-0">
                                        <div className="text-right">
                                            <div className="flex items-baseline gap-1.5 justify-end">
                                                <span className="text-ink-faint text-[12px] line-through">{formatRUB(pack.oldPrice)}</span>
                                                <span className="text-xl font-extrabold text-ink">{formatRUB(pack.price)}</span>
                                            </div>
                                        </div>
                                        <button onClick={() => onBuyCredits(pack)} disabled={processingId === pack.id} className={BUTTON_3D}>
                                            {processingId === pack.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Купить'}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                <div className="text-center mt-10">
                    <div className="inline-flex items-center gap-2 text-ink-faint text-[11px] bg-card-light px-4 py-2.5 rounded-full border border-[var(--border-color)]">
                        <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                        <span>Безопасная оплата через АО «Альфа-Банк». Юр. лицо: «Два А — Цифровые Решения».</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreditsPage;
