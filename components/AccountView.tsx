import React, { useState } from 'react';
import { Check, Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { SubscriptionPlan, SubscriptionTier, GeneratedImage } from '../types';
import { createPaymentSession } from '../services/paymentService';

type AccountTab = 'profile' | 'subscription' | 'usage' | 'promocode';

interface AccountViewProps {
    credits: number;
    userTier: SubscriptionTier;
    generatedCount: number;
    history?: GeneratedImage[];
    initialTab?: AccountTab;
    onBack: () => void;
}

// Per-source cost + label used to derive usage rows (no per-item cost is stored).
const SOURCE_META: Record<string, { label: string; cost: number }> = {
    studio: { label: 'Студия', cost: 1 },
    chat: { label: 'AI-чат', cost: 1 },
    video: { label: 'Оживление фото', cost: 4 },
};

const formatDate = (createdAt: any): string => {
    let d: Date | null = null;
    if (createdAt?.toDate) d = createdAt.toDate();
    else if (createdAt?.seconds) d = new Date(createdAt.seconds * 1000);
    else if (createdAt) d = new Date(createdAt);
    if (!d || isNaN(d.getTime())) return '—';
    return d.toLocaleString('ru-RU', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const PLANS: SubscriptionPlan[] = [
    { id: 'free', name: 'Free', price: 0, credits: 45, features: ['45 кредитов при регистрации', 'Водяной знак', 'Стандартная скорость'], color: '', allowedQuality: ['1K'] },
    { id: 'creator', name: 'Creator', price: 245, credits: 350, features: ['350 кредитов / мес', 'Без водяного знака', 'Генерация HD', 'История 30 дней'], color: '', allowedQuality: ['1K', '2K'] },
    { id: 'pro', name: 'Pro', price: 450, credits: 750, isPopular: true, features: ['750 кредитов / мес', 'Все шаблоны', '4K Ultra HD', 'Коммерческие права'], color: '', allowedQuality: ['1K', '2K', '4K'] },
    { id: 'business', name: 'Business', price: 845, credits: 4000, features: ['4000 кредитов / мес', 'API доступ', 'Команда', 'НДС счёт-фактура'], color: '', allowedQuality: ['1K', '2K', '4K'] },
];

const formatRUB = (price: number) =>
    new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 }).format(price);

const TIER_LABEL: Record<SubscriptionTier, string> = { free: 'Free', creator: 'Creator', pro: 'Pro', business: 'Business' };

const NAV: { id: AccountTab; label: string }[] = [
    { id: 'profile', label: 'Профиль' },
    { id: 'subscription', label: 'Подписка' },
    { id: 'usage', label: 'Использование' },
    { id: 'promocode', label: 'Промокод' },
];

/** Strict, compact enterprise-style account page. No oversized cards or bold display type. */
function AccountView({ credits, userTier, generatedCount, history = [], initialTab = 'profile', onBack }: AccountViewProps) {
    const { user, logout } = useAuth();
    const [tab, setTab] = useState<AccountTab>(initialTab);

    React.useEffect(() => { setTab(initialTab); }, [initialTab]);
    const [processing, setProcessing] = useState<SubscriptionTier | null>(null);

    const handleSubscribe = async (plan: SubscriptionPlan) => {
        if (!user || plan.id === 'free') return;
        setProcessing(plan.id);
        try {
            const url = await createPaymentSession(user.uid, user.email || 'guest@photosmart.ru', plan.id, plan.price);
            window.location.href = url;
        } catch (e) {
            console.error(e);
            alert('Ошибка оплаты. Попробуйте снова.');
            setProcessing(null);
        }
    };

    const displayName = user?.displayName || user?.email?.split('@')[0] || 'Пользователь';

    // Compact key/value row.
    const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
        <div className="flex items-center justify-between py-2.5 border-b border-[var(--border-strong)] last:border-0">
            <span className="text-[13px] text-ink-muted">{label}</span>
            <span className="text-[13px] text-ink font-medium">{value}</span>
        </div>
    );

    return (
        <div className="flex flex-1 min-w-0 bg-background-light overflow-hidden">
            {/* Sidebar */}
            <aside className="hidden md:flex w-52 shrink-0 flex-col border-r border-[var(--border-strong)] py-3">
                <p className="text-[11px] text-ink-faint uppercase tracking-wider px-4 mb-2">Аккаунт</p>
                <nav>
                    {NAV.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setTab(item.id)}
                            className={`w-full text-left px-4 py-2 text-[13px] border-l-2 transition-colors ${tab === item.id ? 'border-primary text-ink bg-surface-muted/50' : 'border-transparent text-ink-muted hover:text-ink'}`}
                        >
                            {item.label}
                        </button>
                    ))}
                </nav>
                {/* Max community card */}
                <div className="mt-auto mx-3 mb-2 border border-[var(--border-color)] rounded-lg p-3">
                    <div className="text-[13px] font-medium text-ink mb-0.5">Сообщество Max</div>
                    <div className="text-[12px] text-ink-muted leading-snug mb-2.5">Вступайте в группу и пользуйтесь нашим ботом в Max.</div>
                    <a
                        href="https://max.ru/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-center text-[13px] font-medium rounded-md bg-primary text-on-primary py-1.5 hover:bg-primary-hover transition-colors"
                    >
                        Вступить
                    </a>
                </div>
                <button
                    onClick={() => logout()}
                    className="text-left px-4 py-2 text-[13px] text-ink-muted hover:text-red-400 transition-colors"
                >
                    Выйти
                </button>
            </aside>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="max-w-2xl mx-auto px-5 md:px-8 pt-6 pb-[88px] md:pb-10">
                    {/* Mobile back + tabs */}
                    <button onClick={onBack} className="md:hidden flex items-center gap-1.5 text-ink-muted text-[13px] mb-4">
                        <ArrowLeft className="w-4 h-4" /> Назад
                    </button>
                    <div className="md:hidden flex gap-4 border-b border-[var(--border-strong)] mb-5 overflow-x-auto">
                        {NAV.map(item => (
                            <button
                                key={item.id}
                                onClick={() => setTab(item.id)}
                                className={`shrink-0 pb-2 text-[13px] border-b-2 -mb-px transition-colors ${tab === item.id ? 'border-primary text-ink' : 'border-transparent text-ink-muted'}`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>

                    {/* PROFILE */}
                    {tab === 'profile' && (
                        <section>
                            <h1 className="text-base font-semibold text-ink mb-4">Профиль</h1>
                            <div className="flex items-center gap-3 mb-6">
                                <img
                                    src={user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`}
                                    alt=""
                                    className="w-12 h-12 rounded-full bg-surface-muted object-cover border border-[var(--border-color)]"
                                />
                                <div className="min-w-0">
                                    <div className="text-sm font-medium text-ink truncate">{displayName}</div>
                                    <div className="text-[13px] text-ink-muted truncate">{user?.email}</div>
                                </div>
                            </div>

                            <div className="border border-[var(--border-color)] rounded-lg px-4 divide-y divide-[var(--border-strong)]">
                                <Row label="Тариф" value={TIER_LABEL[userTier]} />
                                <Row label="Кредиты" value={`${credits}`} />
                                <Row label="Создано изображений" value={generatedCount} />
                                <Row label="Статус" value={<span className="text-primary">Активен</span>} />
                            </div>

                            <div className="flex gap-2 mt-4">
                                <button onClick={() => setTab('subscription')} className="px-3 py-1.5 text-[13px] font-medium rounded-md border border-primary text-primary hover:bg-primary/10 transition-colors">
                                    Пополнить кредиты
                                </button>
                            </div>
                        </section>
                    )}

                    {/* SUBSCRIPTION — current plan + credits + auto-refill + plans */}
                    {tab === 'subscription' && (() => {
                        const current = PLANS.find(p => p.id === userTier) || PLANS[0];
                        const maxCredits = current.credits || 1000;
                        const pct = Math.min(100, Math.round((credits / maxCredits) * 100));
                        return (
                            <section className="space-y-5">
                                <div>
                                    <h1 className="text-base font-semibold text-ink">Подписка</h1>
                                    <p className="text-[13px] text-ink-muted">Управление планом, кредитами и автопополнением.</p>
                                </div>

                                {/* Current plan */}
                                <div className="border border-[var(--border-color)] rounded-lg p-4">
                                    <p className="text-[11px] text-ink-faint uppercase tracking-wider mb-3">Текущий план</p>
                                    <div className="flex items-start justify-between gap-4 mb-4">
                                        <div>
                                            <div className="text-[15px] font-semibold text-ink">{current.name} Plan</div>
                                            <div className="text-[12px] text-ink-muted mt-0.5">{current.credits} кредитов в месяц</div>
                                        </div>
                                        <button
                                            onClick={() => { const next = PLANS.find(p => p.id === 'pro'); if (next) handleSubscribe(next); }}
                                            className="shrink-0 px-3.5 py-1.5 text-[13px] font-medium rounded-md bg-primary text-on-primary hover:bg-primary-hover transition-colors"
                                        >
                                            Улучшить план
                                        </button>
                                    </div>
                                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                                        {current.features.map((f, i) => (
                                            <li key={i} className="flex items-start gap-2 text-[12px] text-ink-body">
                                                <Check className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" /> {f}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Credits */}
                                <div className="border border-[var(--border-color)] rounded-lg p-4">
                                    <p className="text-[11px] text-ink-faint uppercase tracking-wider mb-3">Кредиты</p>
                                    <div className="flex items-end justify-between gap-4 mb-3">
                                        <div className="flex gap-8">
                                            <div>
                                                <div className="text-[11px] text-ink-muted mb-1">Осталось за месяц</div>
                                                <div className="text-[15px] font-semibold text-ink tabular-nums">{credits} <span className="text-ink-faint font-normal">/ {maxCredits}</span></div>
                                            </div>
                                            <div>
                                                <div className="text-[11px] text-ink-muted mb-1">Автопополнение</div>
                                                <div className="text-[15px] font-semibold text-ink tabular-nums">0</div>
                                            </div>
                                        </div>
                                        <button className="shrink-0 px-3.5 py-1.5 text-[13px] font-medium rounded-md border border-[var(--border-color)] text-ink hover:bg-surface-muted transition-colors">
                                            + Купить кредиты
                                        </button>
                                    </div>
                                    <div className="h-1 w-full bg-surface-muted rounded-full overflow-hidden">
                                        <div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                                    </div>
                                </div>

                                {/* Auto-refill */}
                                <div className="border border-[var(--border-color)] rounded-lg p-4 flex items-center justify-between gap-4">
                                    <div>
                                        <div className="text-[13px] font-medium text-ink">Автопополнение отключено</div>
                                        <div className="text-[12px] text-ink-muted mt-0.5">Включите, чтобы автоматически пополнять кредиты при нехватке.</div>
                                    </div>
                                    <button className="shrink-0 px-3.5 py-1.5 text-[13px] font-medium rounded-md bg-primary text-on-primary hover:bg-primary-hover transition-colors">
                                        Настроить
                                    </button>
                                </div>

                                {/* All plans */}
                                <div className="border border-[var(--border-color)] rounded-lg overflow-hidden">
                                    <div className="px-4 py-2.5 border-b border-[var(--border-strong)]">
                                        <p className="text-[13px] font-medium text-ink">Все тарифы</p>
                                    </div>
                                    {PLANS.map((plan, i) => {
                                        const isCurrent = plan.id === userTier;
                                        return (
                                            <div key={plan.id} className={`flex items-center gap-4 px-4 py-3 ${i > 0 ? 'border-t border-[var(--border-strong)]' : ''}`}>
                                                <div className="w-24 shrink-0">
                                                    <div className="text-[13px] font-medium text-ink">{plan.name}</div>
                                                    <div className="text-[12px] text-ink-faint">{plan.price === 0 ? 'Free' : `${formatRUB(plan.price)}/мес`}</div>
                                                </div>
                                                <div className="flex-1 min-w-0 text-[12px] text-ink-muted">
                                                    {plan.credits} кредитов{plan.price > 0 ? ' / мес' : ''}
                                                </div>
                                                <button
                                                    onClick={() => handleSubscribe(plan)}
                                                    disabled={isCurrent || processing === plan.id}
                                                    className={`shrink-0 px-3 py-1.5 text-[13px] font-medium rounded-md border transition-colors flex items-center gap-1.5 ${isCurrent ? 'border-[var(--border-color)] text-ink-muted cursor-default' : 'border-primary text-primary hover:bg-primary/10'}`}
                                                >
                                                    {processing === plan.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : isCurrent ? <><Check className="w-3.5 h-3.5" /> Текущий</> : plan.id === 'free' ? 'Free' : 'Выбрать'}
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        );
                    })()}

                    {/* USAGE — spend overview + breakdown + history table */}
                    {tab === 'usage' && (() => {
                        const rows = history.filter(h => h.generated);
                        const totalGen = rows.length;
                        const spent = rows.reduce((s, h) => s + (SOURCE_META[h.source || 'studio']?.cost || 1), 0);
                        // Breakdown by source
                        const bySource: Record<string, number> = {};
                        rows.forEach(h => { const k = h.source || 'studio'; bySource[k] = (bySource[k] || 0) + 1; });
                        const breakdown = Object.entries(bySource)
                            .map(([k, n]) => ({ label: SOURCE_META[k]?.label || k, n, pct: totalGen ? Math.round((n / totalGen) * 100) : 0 }))
                            .sort((a, b) => b.n - a.n);
                        const colors = ['bg-primary', 'bg-purple-500', 'bg-pink-500', 'bg-blue-500', 'bg-amber-500'];

                        return (
                            <section className="space-y-5">
                                <div>
                                    <h1 className="text-base font-semibold text-ink">Использование</h1>
                                    <p className="text-[13px] text-ink-muted">Статистика трат и история генераций.</p>
                                </div>

                                {/* Spend overview */}
                                <div className="border border-[var(--border-color)] rounded-lg p-4">
                                    <p className="text-[11px] text-ink-faint uppercase tracking-wider mb-3">Обзор расходов</p>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-[var(--border-strong)] rounded-md overflow-hidden">
                                        {[
                                            { v: spent, l: 'Кредитов потрачено' },
                                            { v: totalGen, l: 'Всего генераций' },
                                            { v: breakdown.length, l: 'Функций использовано' },
                                            { v: credits, l: 'Остаток кредитов' },
                                            { v: TIER_LABEL[userTier], l: 'Тариф' },
                                        ].map((m, i) => (
                                            <div key={i} className="bg-card-light px-3 py-3">
                                                <div className="text-lg font-semibold text-ink tabular-nums">{m.v}</div>
                                                <div className="text-[11px] text-ink-muted mt-0.5">{m.l}</div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Breakdown bar */}
                                    {breakdown.length > 0 && (
                                        <>
                                            <div className="flex h-2 rounded-full overflow-hidden mt-4">
                                                {breakdown.map((b, i) => (
                                                    <div key={b.label} className={colors[i % colors.length]} style={{ width: `${b.pct}%` }} title={`${b.label} ${b.pct}%`} />
                                                ))}
                                            </div>
                                            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
                                                {breakdown.map((b, i) => (
                                                    <span key={b.label} className="inline-flex items-center gap-1.5 text-[12px] text-ink-muted">
                                                        <span className={`w-2 h-2 rounded-full ${colors[i % colors.length]}`} />
                                                        {b.label} <span className="text-ink-faint">{b.pct}%</span>
                                                    </span>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* History table */}
                                <div className="border border-[var(--border-color)] rounded-lg overflow-hidden">
                                    <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--border-strong)]">
                                        <p className="text-[13px] font-medium text-ink">История</p>
                                        <span className="text-[12px] text-ink-faint">{totalGen}</span>
                                    </div>
                                    {totalGen === 0 ? (
                                        <p className="px-4 py-8 text-center text-[13px] text-ink-faint">Пока нет операций.</p>
                                    ) : (
                                        <div>
                                            <div className="hidden sm:grid grid-cols-[80px_1fr_90px_140px] gap-2 px-4 py-2 text-[11px] text-ink-faint uppercase tracking-wider border-b border-[var(--border-strong)]">
                                                <span>Кредиты</span><span>Функция</span><span>Действие</span><span>Дата</span>
                                            </div>
                                            {rows.slice(0, 50).map((h, i) => {
                                                const meta = SOURCE_META[h.source || 'studio'] || SOURCE_META.studio;
                                                return (
                                                    <div key={h.id || i} className="grid grid-cols-[80px_1fr_90px_140px] gap-2 px-4 py-2.5 text-[13px] border-b border-[var(--border-strong)] last:border-0 items-center">
                                                        <span className="text-ink font-medium tabular-nums">−{meta.cost}</span>
                                                        <span className="text-ink-body truncate">{meta.label}</span>
                                                        <span className="text-ink-muted">Потрачено</span>
                                                        <span className="text-ink-muted text-[12px]">{formatDate(h.createdAt)}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </section>
                        );
                    })()}

                    {/* PROMOCODE */}
                    {tab === 'promocode' && (
                        <section className="max-w-sm">
                            <h1 className="text-base font-semibold text-ink mb-1">Промокод</h1>
                            <p className="text-[13px] text-ink-muted mb-4">Введите код для начисления бонусных кредитов.</p>
                            <div className="flex gap-2">
                                <input
                                    placeholder="PROMO2026"
                                    className="flex-1 bg-card-light border border-[var(--border-color)] rounded-md px-3 py-2 text-[13px] text-ink placeholder:text-ink-faint outline-none focus:border-primary/60"
                                />
                                <button className="px-3 py-2 rounded-md border border-primary text-primary text-[13px] font-medium hover:bg-primary/10 transition-colors">
                                    Применить
                                </button>
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AccountView;
