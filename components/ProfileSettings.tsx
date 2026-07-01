
import React, { useState, useEffect } from 'react';
import { User, Settings, Zap, CreditCard, Lock, CheckCircle2, Image, Code, Copy, RefreshCw, Key, LogOut, ArrowUpRight, Wallet } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { SubscriptionTier } from '../types';
import PricingModal from './PricingModal';
import { db } from '../lib/firebase';

type Tab = 'overview' | 'security' | 'billing' | 'developers';
type AuthMode = 'login' | 'register';

const TIER_LABELS: Record<SubscriptionTier, string> = {
    'free': 'Free Plan',
    'creator': 'Creator',
    'pro': 'Pro Member',
    'business': 'Business'
};

const TIER_CREDITS: Record<SubscriptionTier, number> = {
    'free': 45,
    'creator': 350,
    'pro': 750,
    'business': 4000
};

interface PaymentHistory {
    id: string;
    date: any;
    plan: string;
    amount: number;
    credits: number;
}

interface ProfileSettingsProps {
    credits: number;
    userTier: SubscriptionTier;
    generatedCount: number;
}
const ProfileSettings: React.FC<ProfileSettingsProps> = ({ credits, userTier, generatedCount }) => {
    const [activeTab, setActiveTab] = useState<Tab>('overview');
    const { user, signInWithGoogle, loginWithEmail, registerWithEmail, logout } = useAuth();

    // Auth Form State
    const [authMode, setAuthMode] = useState<AuthMode>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);

    // Pricing Modal State
    const [isPricingOpen, setIsPricingOpen] = useState(false);

    // Payment History State
    const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);

    // API Key State
    const [apiKey, setApiKey] = useState<string | null>(null);
    const [isKeyVisible, setIsKeyVisible] = useState(false);

    const fetchPaymentHistory = async () => {
        if (!user || !db) return;

        try {
            const userDoc = await db.collection('users').doc(user.uid).get();
            if (userDoc.exists) {
                const data = userDoc.data();
                const history: PaymentHistory[] = [];

                // Add current subscription if exists
                if (data?.lastPaymentDate && data?.lastPaymentPlan) {
                    history.push({
                        id: data.lastPaymentId || 'current',
                        date: data.lastPaymentDate,
                        plan: data.lastPaymentPlan,
                        amount: data.lastPaymentAmount || 0,
                        credits: TIER_CREDITS[data.lastPaymentPlan as SubscriptionTier] || 0
                    });
                }

                setPaymentHistory(history);
            }
        } catch (error) {
            console.error('Error fetching payment history:', error);
        }
    };

    useEffect(() => {
        setAuthError(null);
        // In real app, fetch apiKey from Firestore user document here
        if (user && !apiKey) setApiKey(`sk_live_${Math.random().toString(36).substring(2, 15)}`);

        // Fetch payment history
        if (user && db) {
            fetchPaymentHistory();
        }
    }, [user]);

    const handleGenerateKey = () => {
        setApiKey(`sk_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`);
        alert("Новый API ключ сгенерирован. Старый ключ перестанет работать.");
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert("Скопировано!");
    };

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) { setAuthError("Заполните поля"); return; }
        setIsSubmitting(true);
        setAuthError(null);
        try {
            if (authMode === 'login') await loginWithEmail(email, password);
            else await registerWithEmail(email, password, fullName);
        } catch (err: any) {
            setAuthError("Ошибка авторизации. Проверьте данные.");
        } finally { setIsSubmitting(false); }
    };

    if (!user) {
        return (
            <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar bg-brand-bg flex items-center justify-center h-full">
                <div className="max-w-md mx-auto w-full py-8 text-center animate-in fade-in zoom-in-95">
                    <div className="w-full bg-white rounded-xl p-1 border border-brand-border mb-8 grid grid-cols-2 shadow-sm">
                        <button onClick={() => setAuthMode('login')} className={`text-sm font-bold py-2 rounded-lg transition-all ${authMode === 'login' ? 'bg-brand-card text-brand-text shadow-sm border border-black/5' : 'text-brand-muted hover:text-brand-text'}`}>Вход</button>
                        <button onClick={() => setAuthMode('register')} className={`text-sm font-bold py-2 rounded-lg transition-all ${authMode === 'register' ? 'bg-brand-card text-brand-text shadow-sm border border-black/5' : 'text-brand-muted hover:text-brand-text'}`}>Регистрация</button>
                    </div>
                    <h2 className="text-2xl font-bold text-brand-text mb-2 uppercase tracking-tight">{authMode === 'login' ? 'С возвращением' : 'Создать аккаунт'}</h2>
                    <p className="text-brand-muted text-sm mb-6">Войдите, чтобы сохранить свой прогресс и получить доступ к PRO функциям.</p>

                    <button onClick={async () => {
                        setAuthError(null);
                        try {
                            await signInWithGoogle();
                        } catch (err: any) {
                            if (err?.code === 'auth/popup-closed-by-user' || err?.code === 'auth/cancelled-popup-request') {
                                setAuthError('Вход отменён.');
                            } else {
                                setAuthError(err?.message || 'Ошибка входа через Google.');
                            }
                        }
                    }} className="w-full flex items-center justify-center gap-3 bg-white text-brand-text px-6 py-3 rounded-xl font-bold transition-all mb-6 active:scale-95 shadow-sm border border-brand-border hover:bg-gray-50 hover:shadow-md">
                        <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                        Продолжить с Google
                    </button>
                    {authError && <div className="text-red-500 text-xs bg-red-50 p-2 rounded-lg border border-red-100 mb-4">{authError}</div>}

                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-brand-border"></div></div>
                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-brand-bg px-2 text-brand-muted">Или через Email</span></div>
                    </div>

                    <form onSubmit={handleEmailAuth} className="w-full space-y-4">
                        {authMode === 'register' && <input type="text" placeholder="Ваше имя" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full bg-white border border-brand-border rounded-xl px-4 py-3 text-brand-text outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all placeholder:text-brand-muted/50" />}
                        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-white border border-brand-border rounded-xl px-4 py-3 text-brand-text outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all placeholder:text-brand-muted/50" />
                        <input type="password" placeholder="Пароль" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-white border border-brand-border rounded-xl px-4 py-3 text-brand-text outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all placeholder:text-brand-muted/50" />

                        {authError && <div className="text-red-500 text-xs bg-red-50 p-2 rounded-lg border border-red-100">{authError}</div>}

                        <button type="submit" disabled={isSubmitting} className="w-full bg-brand-text text-white font-bold py-4 rounded-xl shadow-lg hover:bg-brand-text/90 active:scale-95 transition-all uppercase tracking-widest text-sm">
                            {isSubmitting ? '...' : (authMode === 'login' ? 'Войти' : 'Создать аккаунт')}
                        </button>
                    </form>
                </div>
            </div>
        )
    }

    return (
        <>
            <PricingModal
                isOpen={isPricingOpen}
                onClose={() => setIsPricingOpen(false)}
                onSuccess={() => {
                    setIsPricingOpen(false);
                    fetchPaymentHistory(); // Refresh history after purchase
                }}
                currentTier={userTier}
            />

            <div className="flex flex-col md:flex-row h-full w-full bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
                {/* Sidebar Navigation */}
                <div className="w-full md:w-72 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl flex flex-col shrink-0 md:h-full z-10 transition-all">
                    <div className="p-8 border-b border-slate-100 dark:border-slate-800 hidden md:block">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                                <Settings className="w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="font-bold text-lg text-slate-900 dark:text-white">Настройки</h1>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Параметры профиля</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 flex md:flex-col overflow-x-auto md:overflow-visible gap-2 md:gap-1.5 no-scrollbar">
                        {[
                            { id: 'overview', icon: User, label: 'Обзор профиля' },
                            { id: 'security', icon: Lock, label: 'Безопасность' },
                            { id: 'billing', icon: CreditCard, label: 'Тарифы и оплата' },
                            ...(userTier === 'business' ? [{ id: 'developers', icon: Code, label: 'API Разработчика' }] : [])
                        ].map(item => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id as Tab)}
                                className={`flex-shrink-0 flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-bold transition-all whitespace-nowrap text-left group
                                ${activeTab === item.id
                                        ? 'bg-primary text-on-primary shadow-lg shadow-primary/20'
                                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'}
                            `}
                            >
                                <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${activeTab === item.id ? 'text-white' : 'text-slate-400'}`} />
                                {item.label}
                            </button>
                        ))}
                    </div>

                    <div className="mt-auto p-6 border-t border-slate-100 dark:border-slate-800 hidden md:block">
                        <button
                            onClick={() => logout()}
                            className="flex items-center gap-3 px-5 py-3 rounded-2xl text-sm font-bold text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all group w-full"
                        >
                            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            Выйти
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col relative h-full overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-6 md:p-12 custom-scrollbar pb-40 md:pb-12">
                        <div className="max-w-4xl mx-auto space-y-12">

                            {/* Content is now padding-managed via the parent wrapper */}

                            {activeTab === 'overview' && (
                                <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-500">
                                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] p-8 md:p-10 shadow-sm">
                                        <div className="flex flex-col md:flex-row items-center gap-8">
                                            <div className="relative group">
                                                <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full group-hover:scale-110 transition-transform"></div>
                                                <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-primary to-indigo-600 p-1 shadow-2xl overflow-hidden shrink-0">
                                                    <img src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} className="w-full h-full rounded-full bg-white object-cover" />
                                                </div>
                                                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-500 border-4 border-white dark:border-slate-900 rounded-full flex items-center justify-center shadow-lg">
                                                    <CheckCircle2 className="w-4 h-4 text-white" />
                                                </div>
                                            </div>
                                            <div className="flex-1 text-center md:text-left">
                                                <h1 className="text-3xl font-bold text-slate-900 dark:text-white truncate mb-3">{user.displayName || user.email?.split('@')[0] || 'Пользователь'}</h1>
                                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                                    <span className={`px-4 py-1.5 text-white text-[10px] font-bold rounded-full uppercase tracking-widest shadow-lg 
                                                    ${userTier === 'free' ? 'bg-slate-500' :
                                                            userTier === 'creator' ? 'bg-primary' :
                                                                userTier === 'business' ? 'bg-slate-950' : 'bg-purple-600'}`}>
                                                        {TIER_LABELS[userTier]}
                                                    </span>
                                                    <span className="text-slate-400 text-[10px] font-bold px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 uppercase tracking-wider">ID: {user.uid.substring(0, 8)}</span>
                                                    {!user.emailVerified && (
                                                        <span className="text-amber-600 dark:text-amber-400 text-[10px] font-bold px-3 py-1.5 bg-amber-50 dark:bg-amber-950/30 rounded-full border border-amber-200 dark:border-amber-800 uppercase tracking-wider">Email не подтвержден</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[32px] relative overflow-hidden group shadow-sm hover:border-amber-200 transition-all">
                                            <div className="text-slate-400 text-[10px] uppercase font-bold tracking-[0.2em] mb-4 flex items-center gap-2"><Zap className="w-4 h-4 text-amber-500 fill-amber-500" /> Доступно</div>
                                            <div className="text-5xl font-bold text-slate-900 dark:text-white tabular-nums tracking-tight">{credits}</div>
                                            <p className="text-xs text-slate-400 mt-2">Кредитов для генерации</p>
                                            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-amber-400/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                                        </div>
                                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[32px] relative overflow-hidden group shadow-sm hover:border-purple-200 transition-all">
                                            <div className="text-slate-400 text-[10px] uppercase font-bold tracking-[0.2em] mb-4 flex items-center gap-2"><Image className="w-4 h-4 text-purple-500" /> Активность</div>
                                            <div className="text-5xl font-bold text-slate-900 dark:text-white tabular-nums tracking-tight">{generatedCount}</div>
                                            <p className="text-xs text-slate-400 mt-2">Создано шедевров</p>
                                            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-purple-500/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                                        </div>
                                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[32px] relative overflow-hidden group shadow-sm hover:border-emerald-200 transition-all flex flex-col justify-center">
                                            <div className="text-slate-400 text-[10px] uppercase font-bold tracking-[0.2em] mb-2 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Статус</div>
                                            <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Активный</div>
                                            <p className="text-xs text-slate-400">Ограничений нет</p>
                                        </div>
                                    </div>

                                    <div className="bg-primary/5 border-2 border-primary/20 rounded-[32px] p-10 text-center relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Готовы к новому уровню?</h3>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 max-w-lg mx-auto leading-relaxed">Разблокируйте профессиональные инструменты: генерация в 4K Ultra HD, коммерческая лицензия и приоритет в очереди.</p>
                                        <button onClick={() => setActiveTab('billing')} className="bg-primary text-on-primary px-10 py-5 rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-xl shadow-primary/20 active:scale-95 uppercase tracking-widest text-xs">Посмотреть тарифы</button>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'security' && (
                                <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-500">
                                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] p-8 md:p-10 shadow-sm transition-all hover:border-slate-300">
                                        <div className="flex items-center gap-3 mb-8">
                                            <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-2xl">
                                                <Lock className="w-6 h-6 text-red-500" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-xl text-slate-900 dark:text-white">Безопасность аккаунта</h3>
                                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Управление доступом</p>
                                            </div>
                                        </div>

                                        {user.providerData[0]?.providerId === 'google.com' ? (
                                            <div className="p-6 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                                                Вы вошли через <span className="text-primary font-bold">Google account</span> (<b>{user.email}</b>). Управление паролем осуществляется централизованно через настройки вашего Google Аккаунта.
                                            </div>
                                        ) : (
                                            <form className="space-y-6 max-w-md" onSubmit={async (e) => {
                                                e.preventDefault();
                                                const oldPass = (document.getElementById('old-password') as HTMLInputElement).value;
                                                const newPass = (document.getElementById('new-password') as HTMLInputElement).value;
                                                const confirmPass = (document.getElementById('confirm-password') as HTMLInputElement).value;

                                                if (!oldPass || !newPass || !confirmPass) {
                                                    alert("Заполните все поля");
                                                    return;
                                                }

                                                if (newPass !== confirmPass) {
                                                    alert("Новые пароли не совпадают");
                                                    return;
                                                }

                                                if (newPass.length < 6) {
                                                    alert("Пароль должен быть не менее 6 символов");
                                                    return;
                                                }

                                                try {
                                                    await user?.updatePassword(newPass);
                                                    alert("Пароль успешно обновлен!");
                                                    (e.target as HTMLFormElement).reset();
                                                } catch (err: any) {
                                                    alert("Ошибка: " + err.message + ". Возможно, вам нужно выйти и войти снова.");
                                                }
                                            }}>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Текущий пароль</label>
                                                    <input type={isKeyVisible ? "text" : "password"} placeholder="••••••••" required className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 text-slate-900 dark:text-white focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all font-mono" id="old-password" />
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Новый пароль</label>
                                                    <input type={isKeyVisible ? "text" : "password"} placeholder="••••••••" required className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 text-slate-900 dark:text-white focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all font-mono" id="new-password" />
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Подтверждение</label>
                                                    <input type={isKeyVisible ? "text" : "password"} placeholder="••••••••" required className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 text-slate-900 dark:text-white focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all font-mono" id="confirm-password" />
                                                </div>

                                                <div className="flex items-center gap-3 py-2 cursor-pointer group" onClick={() => setIsKeyVisible(!isKeyVisible)}>
                                                    <div className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${isKeyVisible ? 'bg-primary border-primary' : 'border-slate-300 group-hover:border-primary'}`}>
                                                        {isKeyVisible && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest select-none">Показать пароли</span>
                                                </div>

                                                <button
                                                    type="submit"
                                                    className="bg-primary text-on-primary font-bold px-10 py-5 rounded-2xl hover:bg-blue-600 transition-all shadow-xl shadow-primary/20 w-full uppercase tracking-widest text-xs mt-4 active:scale-95"
                                                >
                                                    Обновить пароль
                                                </button>
                                            </form>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'billing' && (
                                <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-500">
                                    <div className="bg-gradient-to-br from-primary to-indigo-700 rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-1000"></div>
                                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
                                            <div className="text-center md:text-left">
                                                <div className="text-blue-200 text-xs font-bold uppercase tracking-[0.3em] mb-4">Ваш тарифный план</div>
                                                <div className="text-5xl font-bold mb-4 tracking-tight">{TIER_LABELS[userTier]}</div>
                                                <div className="flex items-center justify-center md:justify-start gap-3 text-blue-100 text-sm font-medium">
                                                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                                        <Zap className="w-4 h-4 fill-white" />
                                                    </div>
                                                    {TIER_CREDITS[userTier]} кредитов ежемесячно
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setIsPricingOpen(true)}
                                                className="bg-white text-primary font-bold px-12 py-5 rounded-2xl hover:bg-slate-50 transition-all shadow-xl active:scale-95 whitespace-nowrap uppercase tracking-widest text-xs"
                                            >
                                                Улучшить
                                            </button>
                                        </div>
                                    </div>

                                    {/* Upgrade Suggestions */}
                                    {userTier !== 'business' && (
                                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] p-8 md:p-10 shadow-sm relative overflow-hidden">
                                            <div className="flex flex-col md:flex-row items-center gap-8">
                                                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center rounded-2xl shadow-inner group transition-transform hover:rotate-12">
                                                    <ArrowUpRight className="w-8 h-8 text-primary" />
                                                </div>
                                                <div className="flex-1 text-center md:text-left">
                                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                                                        {userTier === 'free' && 'PRO возможности: План Creator'}
                                                        {userTier === 'creator' && 'PRO возможности: План Pro'}
                                                        {userTier === 'pro' && 'PRO возможности: План Business'}
                                                    </h3>
                                                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-0">
                                                        {userTier === 'free' && 'Удалите водяной знак, получите 100 кредитов и HD качество.'}
                                                        {userTier === 'creator' && 'Откройте 4K генерацию, 500 кредитов и коммерческие права.'}
                                                        {userTier === 'pro' && '2000 кредитов ежемесячно, доступ к API и командная работа.'}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => setIsPricingOpen(true)}
                                                    className="px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl font-bold text-xs uppercase tracking-widest transition-all hover:bg-primary hover:text-white shadow-sm active:scale-95"
                                                >
                                                    Подробнее
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] shadow-sm overflow-hidden">
                                        <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex justify-between items-center">
                                            <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-widest text-sm">История транзакций</h3>
                                            <CreditCard className="w-5 h-5 text-slate-400" />
                                        </div>
                                        {paymentHistory.length === 0 ? (
                                            <div className="text-center py-24">
                                                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                                                    <CreditCard className="w-10 h-10" />
                                                </div>
                                                <p className="text-slate-900 dark:text-white font-bold text-lg">Операций не найдено</p>
                                                <p className="text-slate-400 text-sm mt-2">Здесь появятся ваши покупки и списания.</p>
                                            </div>
                                        ) : (
                                            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                                {paymentHistory.map((payment) => (
                                                    <div key={payment.id} className="p-8 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-6">
                                                                <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl flex items-center justify-center">
                                                                    <Wallet className="w-7 h-7 text-emerald-500" />
                                                                </div>
                                                                <div>
                                                                    <div className="font-bold text-slate-900 dark:text-white text-lg">
                                                                        План {TIER_LABELS[payment.plan as SubscriptionTier]}
                                                                    </div>
                                                                    <div className="text-sm text-slate-400 font-medium">
                                                                        {payment.date?.toDate ? payment.date.toDate().toLocaleDateString('ru-RU', {
                                                                            year: 'numeric',
                                                                            month: 'long',
                                                                            day: 'numeric'
                                                                        }) : 'Недавно'}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <div className="font-bold text-slate-900 dark:text-white text-xl tabular-nums tracking-tight">
                                                                    {payment.amount} ₽
                                                                </div>
                                                                <div className="text-sm text-emerald-500 font-bold uppercase tracking-widest">
                                                                    +{payment.credits} Credits
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'developers' && (
                                <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-500">
                                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] p-8 md:p-10 shadow-sm relative overflow-hidden group">
                                        <div className="flex items-center gap-3 mb-8">
                                            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/30 rounded-2xl">
                                                <Key className="w-6 h-6 text-indigo-500" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-xl text-slate-900 dark:text-white">Merchant API</h3>
                                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Интеграция и ключи</p>
                                            </div>
                                        </div>

                                        <div className="space-y-8">
                                            <div className="space-y-3">
                                                <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Секретный ключ (API Secret)</label>
                                                <div className="flex flex-col md:flex-row items-center gap-3">
                                                    <div className="flex-1 w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-5 font-mono text-sm text-slate-900 dark:text-white flex items-center justify-between group transition-all hover:border-primary/30">
                                                        <span className="truncate">{isKeyVisible ? apiKey : 'sk_live_••••••••••••••••••••••••••••••••'}</span>
                                                        <button
                                                            onClick={() => setIsKeyVisible(!isKeyVisible)}
                                                            className="p-2 text-slate-400 hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest"
                                                        >
                                                            {isKeyVisible ? 'Скрыть' : 'Показать'}
                                                        </button>
                                                    </div>
                                                    <div className="flex gap-2 w-full md:w-auto">
                                                        <button onClick={() => copyToClipboard(apiKey || '')} className="flex-1 md:flex-none p-5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl text-slate-600 dark:text-slate-300 transition-all border border-slate-200 dark:border-slate-800 shadow-sm active:scale-95 flex items-center justify-center" title="Копировать"><Copy className="w-5 h-5" /></button>
                                                        <button onClick={handleGenerateKey} className="flex-1 md:flex-none p-5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl text-slate-600 dark:text-slate-300 transition-all border border-slate-200 dark:border-slate-800 shadow-sm active:scale-95 flex items-center justify-center" title="Обновить"><RefreshCw className="w-5 h-5" /></button>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-[10px] font-bold uppercase tracking-[0.1em] rounded-xl border border-red-100 dark:border-red-900/30">
                                                    <Lock className="w-4 h-4 shrink-0" /> Никогда не передавайте этот ключ клиенту (Frontend). Используйте только на сервере.
                                                </div>
                                            </div>

                                            <div className="h-px bg-slate-100 dark:bg-slate-800"></div>

                                            <div className="space-y-4">
                                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><Code className="w-4 h-4" /> Swagger / cURL Example</h4>
                                                <div className="p-8 bg-[#0F172A] rounded-[24px] border border-white/5 font-mono text-xs text-blue-200 overflow-x-auto shadow-2xl relative group">
                                                    <div className="absolute top-4 right-4 text-[10px] text-slate-600 font-bold uppercase">Terminal</div>
                                                    <span className="text-purple-400">curl</span> -X POST https://api.smartphotos.ru/v1/generate \<br />
                                                    &nbsp;&nbsp;-H <span className="text-emerald-400">"Authorization: Bearer {apiKey?.substring(0, 8)}..."</span> \<br />
                                                    &nbsp;&nbsp;-H <span className="text-emerald-400">"Content-Type: application/json"</span> \<br />
                                                    &nbsp;&nbsp;-d <span className="text-amber-300">'&#123;"prompt": "cyberpunk portrait", "model": "gemini-2.0-pro" &#125;'</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProfileSettings;
