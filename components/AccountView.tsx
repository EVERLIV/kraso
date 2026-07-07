import React, { useState } from 'react';
import { Check, Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { SubscriptionPlan, SubscriptionTier, GeneratedImage, CommunityPreferences } from '../types';
import { createPaymentSession } from '../services/paymentService';
import { updateCommunityPreferences } from '../services/firebaseService';

type AccountTab = 'profile' | 'subscription' | 'usage' | 'promocode';

interface AccountViewProps {
    credits: number;
    userTier: SubscriptionTier;
    generatedCount: number;
    history?: GeneratedImage[];
    communityPreferences?: CommunityPreferences | null;
    onCommunityPreferencesChange?: (value: CommunityPreferences) => void;
    onHideCommunityPosts?: () => Promise<number>;
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
function AccountView({
    credits,
    userTier,
    generatedCount,
    history = [],
    communityPreferences,
    onCommunityPreferencesChange,
    onHideCommunityPosts,
    initialTab = 'profile',
    onBack,
}: AccountViewProps) {
    const { user, logout } = useAuth();
    const [tab, setTab] = useState<AccountTab>(initialTab);

    React.useEffect(() => { setTab(initialTab); }, [initialTab]);
    const [processing, setProcessing] = useState<SubscriptionTier | null>(null);
    const [paymentError, setPaymentError] = useState<string | null>(null);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [promocodeError, setPromocodeError] = useState<string | null>(null);
    const [promocode, setPromocode] = useState('');
    const [publicNickname, setPublicNickname] = useState(communityPreferences?.publicNickname || '');
    const [communityHidden, setCommunityHidden] = useState(Boolean(communityPreferences?.communityHidden));
    const [communityShowPromptSettings, setCommunityShowPromptSettings] = useState(Boolean(communityPreferences?.communityShowPromptSettings));
    const [communitySaving, setCommunitySaving] = useState(false);
    const [communityMessage, setCommunityMessage] = useState<string | null>(null);
    const [communityDirty, setCommunityDirty] = useState(false);

    const handleSubscribe = async (plan: SubscriptionPlan) => {
        if (!user || plan.id === 'free') return;
        setPaymentError(null);
        setProcessing(plan.id);
        try {
            const url = await createPaymentSession(user.uid, user.email || 'guest@photosmart.ru', plan.id, plan.price);
            window.location.href = url;
        } catch (e) {
            console.error(e);
            setPaymentError('Ошибка оплаты. Попробуйте снова.');
            setProcessing(null);
        }
    };

    const displayName = user?.displayName || user?.email?.split('@')[0] || 'Пользователь';

    React.useEffect(() => {
        if (communityDirty) return;
        setPublicNickname(communityPreferences?.publicNickname || user?.displayName || user?.email?.split('@')[0] || 'Пользователь');
        setCommunityHidden(Boolean(communityPreferences?.communityHidden));
        setCommunityShowPromptSettings(Boolean(communityPreferences?.communityShowPromptSettings));
    }, [communityPreferences, communityDirty, user?.displayName, user?.email]);

    const handleSaveCommunitySettings = async () => {
        if (!user) return;
        setCommunitySaving(true);
        setCommunityMessage(null);
        try {
            const trimmedNickname = publicNickname.trim() || displayName;
            const next = await updateCommunityPreferences(user.uid, {
                publicNickname: trimmedNickname,
                communityHidden,
                communityShowPromptSettings,
            });
            if (!next) {
                throw new Error('save-failed');
            }
            onCommunityPreferencesChange?.(next);
            if (communityHidden) {
                const hiddenCount = await onHideCommunityPosts?.();
                setCommunityMessage(
                    typeof hiddenCount === 'number' && hiddenCount > 0
                        ? `Настройки сохранены. Скрыто публикаций: ${hiddenCount}.`
                        : 'Настройки сохранены. Новые фото будут скрыты, старые уже убраны из сообщества.'
                );
            } else {
                setCommunityMessage('Настройки сообщества сохранены.');
            }
            setCommunityDirty(false);
        } catch (error) {
            console.error(error);
            setCommunityMessage('Не удалось сохранить настройки сообщества.');
        } finally {
            setCommunitySaving(false);
        }
    };

    // Compact key/value row.
    const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
        <div className="flex items-center justify-between py-2.5 border-b border-[var(--border-strong)] last:border-0">
            <span className="text-sm text-ink-muted">{label}</span>
            <span className="text-sm text-ink font-medium tabular-nums">{value}</span>
        </div>
    );

    return (
        <div className="flex flex-1 min-w-0 bg-background-light overflow-hidden">
            {showLogoutConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
                    <div
                        role="alertdialog"
                        aria-labelledby="logout-title"
                        aria-describedby="logout-desc"
                        className="bg-card-light border border-[var(--border-color)] rounded-lg p-5 max-w-sm w-full shadow-lg"
                    >
                        <h2 id="logout-title" className="text-base font-semibold text-ink text-balance mb-2">Выйти из аккаунта?</h2>
                        <p id="logout-desc" className="text-sm text-ink-muted text-pretty mb-4">Вы будете перенаправлены на страницу входа.</p>
                        <div className="flex gap-2 justify-end">
                            <button
                                onClick={() => setShowLogoutConfirm(false)}
                                className="px-3 py-1.5 text-sm font-medium rounded-md border border-[var(--border-color)] text-ink hover:bg-surface-muted transition-colors"
                            >
                                Отмена
                            </button>
                            <button
                                onClick={() => { setShowLogoutConfirm(false); logout(); }}
                                className="px-3 py-1.5 text-sm font-medium rounded-md bg-red-600 text-white hover:bg-red-500 transition-colors"
                            >
                                Выйти
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Sidebar */}
            <aside className="hidden md:flex w-52 shrink-0 flex-col border-r border-[var(--border-strong)] py-3">
                <p className="text-xs text-ink-faint uppercase px-4 mb-2">Аккаунт</p>
                <nav>
                    {NAV.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setTab(item.id)}
                            className={`w-full text-left px-4 py-2 text-sm border-l-2 transition-colors ${tab === item.id ? 'border-primary text-ink bg-surface-muted/50' : 'border-transparent text-ink-muted hover:text-ink'}`}
                        >
                            {item.label}
                        </button>
                    ))}
                </nav>
                {/* Max community card */}
                <div className="mt-auto mx-3 mb-2 border border-[var(--border-color)] rounded-lg p-3">
                    <div className="text-sm font-medium text-ink mb-0.5">Сообщество Max</div>
                    <div className="text-xs text-ink-muted leading-snug mb-2.5 text-pretty">Вступайте в группу и пользуйтесь нашим ботом в Max.</div>
                    <a
                        href="https://max.ru/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-center text-sm font-medium rounded-md bg-primary text-on-primary py-1.5 hover:bg-primary-hover transition-colors"
                    >
                        Вступить
                    </a>
                </div>
                <button
                    onClick={() => setShowLogoutConfirm(true)}
                    className="text-left px-4 py-2 text-sm text-ink-muted hover:text-red-400 transition-colors"
                >
                    Выйти
                </button>
            </aside>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="max-w-2xl mx-auto px-5 md:px-8 pt-6 pb-[88px] md:pb-10">
                    {/* Mobile back + tabs */}
                    <button onClick={onBack} className="md:hidden flex items-center gap-1.5 text-ink-muted text-sm mb-4">
                        <ArrowLeft className="w-4 h-4" /> Назад
                    </button>
                    <div className="md:hidden flex gap-4 border-b border-[var(--border-strong)] mb-5 overflow-x-auto overflow-y-hidden no-scrollbar">
                        {NAV.map(item => (
                            <button
                                key={item.id}
                                onClick={() => setTab(item.id)}
                                className={`shrink-0 pb-2 text-sm border-b-2 -mb-px transition-colors ${tab === item.id ? 'border-primary text-ink' : 'border-transparent text-ink-muted'}`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>

                    {/* PROFILE */}
                    {tab === 'profile' && (
                        <section>
                            <h1 className="text-base font-semibold text-ink text-balance mb-4">Профиль</h1>
                            <div className="flex items-center gap-3 mb-6">
                                <img
                                    src={user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`}
                                    alt={`Аватар ${displayName}`}
                                    className="size-12 rounded-full bg-surface-muted object-cover border border-[var(--border-color)]"
                                />
                                <div className="min-w-0">
                                    <div className="text-sm font-medium text-ink truncate">{displayName}</div>
                                    <div className="text-sm text-ink-muted truncate">{user?.email}</div>
                                </div>
                            </div>

                            <div className="border border-[var(--border-color)] rounded-lg px-4 divide-y divide-[var(--border-strong)]">
                                <Row label="Тариф" value={TIER_LABEL[userTier]} />
                                <Row label="Кредиты" value={credits} />
                                <Row label="Создано изображений" value={generatedCount} />
                                <Row label="Статус" value={<span className="text-primary">Активен</span>} />
                            </div>

                            <div className="flex gap-2 mt-4">
                                <button onClick={() => setTab('subscription')} className="px-3 py-1.5 text-sm font-medium rounded-md border border-primary text-primary hover:bg-primary/10 transition-colors">
                                    Пополнить кредиты
                                </button>
                            </div>

                            <div className="mt-6 border border-[var(--border-color)] rounded-lg p-4 space-y-4">
                                <div>
                                    <h2 className="text-sm font-semibold text-ink">Сообщество</h2>
                                    <p className="text-sm text-ink-muted mt-1 text-pretty">
                                        Управляйте публичным никнеймом, видимостью публикаций и тем, что увидят другие пользователи.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="publicNickname" className="text-xs font-medium text-ink-muted">Публичный никнейм</label>
                                    <input
                                        id="publicNickname"
                                        value={publicNickname}
                                        onChange={(e) => {
                                            setPublicNickname(e.target.value);
                                            setCommunityDirty(true);
                                        }}
                                        placeholder={displayName}
                                        className="w-full bg-card-light border border-[var(--border-color)] rounded-md px-3 py-2 text-sm text-ink placeholder:text-ink-faint outline-none focus:border-primary/60"
                                    />
                                    <p className="text-xs text-ink-faint">Этот никнейм будет виден под фото в сообществе.</p>
                                </div>

                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={communityHidden}
                                        onChange={(e) => {
                                            setCommunityHidden(e.target.checked);
                                            setCommunityDirty(true);
                                        }}
                                        className="mt-1 size-4 rounded border-[var(--border-color)] text-primary focus:ring-primary/30"
                                    />
                                    <span className="min-w-0">
                                        <span className="block text-sm font-medium text-ink">Скрыть все фото из сообщества</span>
                                        <span className="block text-xs text-ink-muted mt-1 text-pretty">
                                            Уже опубликованные фото будут скрыты. Новые фото не попадут в общий пул, пока вы сами не поделитесь ими из истории.
                                        </span>
                                    </span>
                                </label>

                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={communityShowPromptSettings}
                                        onChange={(e) => {
                                            setCommunityShowPromptSettings(e.target.checked);
                                            setCommunityDirty(true);
                                        }}
                                        className="mt-1 size-4 rounded border-[var(--border-color)] text-primary focus:ring-primary/30"
                                    />
                                    <span className="min-w-0">
                                        <span className="block text-sm font-medium text-ink">Показывать промт и настройки</span>
                                        <span className="block text-xs text-ink-muted mt-1 text-pretty">
                                            Разрешите другим видеть ваш промт и краткую информацию об инструменте, которым было создано фото.
                                        </span>
                                    </span>
                                </label>

                                {communityMessage && (
                                    <p className={`text-sm text-pretty ${communityMessage.includes('Не удалось') ? 'text-red-600' : 'text-primary'}`}>
                                        {communityMessage}
                                    </p>
                                )}

                                <div className="flex gap-2">
                                    <button
                                        onClick={handleSaveCommunitySettings}
                                        disabled={communitySaving}
                                        className="px-3 py-1.5 text-sm font-medium rounded-md bg-primary text-on-primary hover:bg-primary-hover transition-colors disabled:opacity-60 inline-flex items-center gap-2"
                                    >
                                        {communitySaving ? <Loader2 className="w-4 h-4 animate-spin motion-reduce:animate-none" /> : null}
                                        Сохранить настройки сообщества
                                    </button>
                                </div>
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
                                    <h1 className="text-base font-semibold text-ink text-balance">Подписка</h1>
                                    <p className="text-sm text-ink-muted text-pretty">Управление планом, кредитами и автопополнением.</p>
                                </div>

                                {paymentError && (
                                    <p role="alert" className="text-sm text-red-600 text-pretty">{paymentError}</p>
                                )}

                                {/* Current plan */}
                                <div className="border border-[var(--border-color)] rounded-lg p-4">
                                    <p className="text-xs text-ink-faint uppercase mb-3">Текущий план</p>
                                    <div className="flex items-start justify-between gap-4 mb-4">
                                        <div>
                                            <div className="text-base font-semibold text-ink text-balance">{current.name} Plan</div>
                                            <div className="text-xs text-ink-muted mt-0.5 text-pretty">{current.credits} кредитов в месяц</div>
                                        </div>
                                        <button
                                            onClick={() => { const next = PLANS.find(p => p.id === 'pro'); if (next) handleSubscribe(next); }}
                                            className="shrink-0 px-3.5 py-1.5 text-sm font-medium rounded-md bg-primary text-on-primary hover:bg-primary-hover transition-colors"
                                        >
                                            Улучшить план
                                        </button>
                                    </div>
                                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                                        {current.features.map((f, i) => (
                                            <li key={i} className="flex items-start gap-2 text-xs text-ink-body text-pretty">
                                                <Check className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" /> {f}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Credits */}
                                <div className="border border-[var(--border-color)] rounded-lg p-4">
                                    <p className="text-xs text-ink-faint uppercase mb-3">Кредиты</p>
                                    <div className="flex items-end justify-between gap-4 mb-3">
                                        <div className="flex gap-8">
                                            <div>
                                                <div className="text-xs text-ink-muted mb-1">Осталось за месяц</div>
                                                <div className="text-base font-semibold text-ink tabular-nums">{credits} <span className="text-ink-faint font-normal">/ {maxCredits}</span></div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-ink-muted mb-1">Автопополнение</div>
                                                <div className="text-base font-semibold text-ink tabular-nums">0</div>
                                            </div>
                                        </div>
                                        <button className="shrink-0 px-3.5 py-1.5 text-sm font-medium rounded-md border border-[var(--border-color)] text-ink hover:bg-surface-muted transition-colors">
                                            + Купить кредиты
                                        </button>
                                    </div>
                                    <div className="h-1 w-full bg-surface-muted rounded-full overflow-hidden">
                                        <div className="h-full w-full bg-primary origin-left" style={{ transform: `scaleX(${pct / 100})` }} />
                                    </div>
                                </div>

                                {/* Auto-refill */}
                                <div className="border border-[var(--border-color)] rounded-lg p-4 flex items-center justify-between gap-4">
                                    <div>
                                        <div className="text-sm font-medium text-ink">Автопополнение отключено</div>
                                        <div className="text-xs text-ink-muted mt-0.5 text-pretty">Включите, чтобы автоматически пополнять кредиты при нехватке.</div>
                                    </div>
                                    <button className="shrink-0 px-3.5 py-1.5 text-sm font-medium rounded-md bg-primary text-on-primary hover:bg-primary-hover transition-colors">
                                        Настроить
                                    </button>
                                </div>

                                {/* All plans */}
                                <div className="border border-[var(--border-color)] rounded-lg overflow-hidden">
                                    <div className="px-4 py-2.5 border-b border-[var(--border-strong)]">
                                        <p className="text-sm font-medium text-ink">Все тарифы</p>
                                    </div>
                                    {PLANS.map((plan, i) => {
                                        const isCurrent = plan.id === userTier;
                                        return (
                                            <div key={plan.id} className={`flex items-center gap-4 px-4 py-3 ${i > 0 ? 'border-t border-[var(--border-strong)]' : ''}`}>
                                                <div className="w-24 shrink-0">
                                                    <div className="text-sm font-medium text-ink">{plan.name}</div>
                                                    <div className="text-xs text-ink-faint tabular-nums">{plan.price === 0 ? 'Free' : `${formatRUB(plan.price)}/мес`}</div>
                                                </div>
                                                <div className="flex-1 min-w-0 text-xs text-ink-muted tabular-nums">
                                                    {plan.credits} кредитов{plan.price > 0 ? ' / мес' : ''}
                                                </div>
                                                <button
                                                    onClick={() => handleSubscribe(plan)}
                                                    disabled={isCurrent || processing === plan.id}
                                                    className={`shrink-0 px-3 py-1.5 text-sm font-medium rounded-md border transition-colors flex items-center gap-1.5 ${isCurrent ? 'border-[var(--border-color)] text-ink-muted cursor-default' : 'border-primary text-primary hover:bg-primary/10'}`}
                                                >
                                                    {processing === plan.id ? <Loader2 className="w-3.5 h-3.5 animate-spin motion-reduce:animate-none" /> : isCurrent ? <><Check className="w-3.5 h-3.5" /> Текущий</> : plan.id === 'free' ? 'Free' : 'Выбрать'}
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
                        const colors = ['bg-primary', 'bg-primary/70', 'bg-primary/50', 'bg-primary/35', 'bg-primary/20'];

                        return (
                            <section className="space-y-5">
                                <div>
                                    <h1 className="text-base font-semibold text-ink text-balance">Использование</h1>
                                    <p className="text-sm text-ink-muted text-pretty">Статистика трат и история генераций.</p>
                                </div>

                                {/* Spend overview */}
                                <div className="border border-[var(--border-color)] rounded-lg p-4">
                                    <p className="text-xs text-ink-faint uppercase mb-3">Обзор расходов</p>
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
                                                <div className="text-xs text-ink-muted mt-0.5 text-pretty">{m.l}</div>
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
                                                    <span key={b.label} className="inline-flex items-center gap-1.5 text-xs text-ink-muted">
                                                        <span className={`size-2 rounded-full ${colors[i % colors.length]}`} />
                                                        {b.label} <span className="text-ink-faint tabular-nums">{b.pct}%</span>
                                                    </span>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* History table */}
                                <div className="border border-[var(--border-color)] rounded-lg overflow-hidden">
                                    <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--border-strong)]">
                                        <p className="text-sm font-medium text-ink">История</p>
                                        <span className="text-xs text-ink-faint tabular-nums">{totalGen}</span>
                                    </div>
                                    {totalGen === 0 ? (
                                        <div className="px-4 py-8 text-center">
                                            <p className="text-sm text-ink-faint text-pretty mb-4">Пока нет операций.</p>
                                            <button
                                                onClick={onBack}
                                                className="text-sm font-medium text-primary hover:underline"
                                            >
                                                Создать первое изображение
                                            </button>
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="hidden sm:grid grid-cols-[80px_1fr_90px_140px] gap-2 px-4 py-2 text-xs text-ink-faint uppercase border-b border-[var(--border-strong)]">
                                                <span>Кредиты</span><span>Функция</span><span>Действие</span><span>Дата</span>
                                            </div>
                                            {rows.slice(0, 50).map((h, i) => {
                                                const meta = SOURCE_META[h.source || 'studio'] || SOURCE_META.studio;
                                                return (
                                                    <div key={h.id || i} className="grid grid-cols-[80px_1fr_90px_140px] gap-2 px-4 py-2.5 text-sm border-b border-[var(--border-strong)] last:border-0 items-center">
                                                        <span className="text-ink font-medium tabular-nums">−{meta.cost}</span>
                                                        <span className="text-ink-body truncate">{meta.label}</span>
                                                        <span className="text-ink-muted">Потрачено</span>
                                                        <span className="text-ink-muted text-xs tabular-nums">{formatDate(h.createdAt)}</span>
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
                            <h1 className="text-base font-semibold text-ink text-balance mb-1">Промокод</h1>
                            <p className="text-sm text-ink-muted text-pretty mb-4">Введите код для начисления бонусных кредитов.</p>
                            <div className="flex gap-2">
                                <input
                                    value={promocode}
                                    onChange={(e) => { setPromocode(e.target.value); setPromocodeError(null); }}
                                    placeholder="PROMO2026"
                                    className="flex-1 bg-card-light border border-[var(--border-color)] rounded-md px-3 py-2 text-sm text-ink placeholder:text-ink-faint outline-none focus:border-primary/60"
                                />
                                <button
                                    onClick={() => {
                                        if (!promocode.trim()) {
                                            setPromocodeError('Введите промокод.');
                                            return;
                                        }
                                        setPromocodeError('Промокод не найден или уже использован.');
                                    }}
                                    className="px-3 py-2 rounded-md border border-primary text-primary text-sm font-medium hover:bg-primary/10 transition-colors"
                                >
                                    Применить
                                </button>
                            </div>
                            {promocodeError && (
                                <p role="alert" className="text-sm text-red-600 text-pretty mt-2">{promocodeError}</p>
                            )}
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AccountView;
