import React, { useState } from 'react';
import { Glasses, Loader2, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AuthPageProps {
    onClose: () => void;   // back to landing
    onSuccess?: () => void;
}

type AuthMode = 'login' | 'register' | 'forgot';

/** Standalone sign-in page — strict minimalist, matches the account/profile style. */
function AuthPage({ onClose, onSuccess }: AuthPageProps) {
    const { signInWithGoogle, loginWithEmail, registerWithEmail, resetPassword } = useAuth();
    const [mode, setMode] = useState<AuthMode>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [name, setName] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const reset = (m: AuthMode) => { setMode(m); setError(null); setSuccess(null); setPassword(''); setConfirm(''); };

    const handleGoogle = async () => {
        setError(null);
        try {
            await signInWithGoogle();
            onSuccess?.();
        } catch (err: any) {
            if (err?.code === 'auth/popup-closed-by-user' || err?.code === 'auth/cancelled-popup-request') setError('Вход отменён.');
            else setError(err?.message || 'Ошибка входа через Google.');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null); setSuccess(null);

        if (mode === 'forgot') {
            if (!email) { setError('Введите email'); return; }
            setBusy(true);
            try {
                await resetPassword(email);
                setSuccess('Инструкции по сбросу пароля отправлены. Проверьте почту и «Спам».');
            } catch (err: any) {
                const c = err?.code;
                if (c === 'auth/user-not-found') setError('Аккаунт не найден или зарегистрирован через Google.');
                else if (c === 'auth/invalid-email') setError('Некорректный email.');
                else setError('Ошибка сброса пароля.' + (c ? ` (${c})` : ''));
            } finally { setBusy(false); }
            return;
        }

        if (!email || !password) { setError('Заполните поля'); return; }
        if (mode === 'register') {
            if (password !== confirm) { setError('Пароли не совпадают'); return; }
            if (password.length < 6) { setError('Пароль должен быть не менее 6 символов'); return; }
        }

        setBusy(true);
        try {
            if (mode === 'login') {
                await loginWithEmail(email, password);
                onSuccess?.();
            } else {
                await registerWithEmail(email, password, name);
                setSuccess('Аккаунт создан! Проверьте почту для подтверждения email.');
            }
        } catch (err: any) {
            if (err?.message === 'unverified-email') setError('Email не подтверждён. Проверьте почту.');
            else if (err?.code === 'auth/email-already-in-use') setError('Этот email уже используется.');
            else if (err?.code === 'auth/wrong-password' || err?.code === 'auth/invalid-credential') setError('Неверный email или пароль.');
            else if (err?.code === 'auth/user-not-found') setError('Пользователь не найден.');
            else setError('Ошибка авторизации. Проверьте данные.');
        } finally { setBusy(false); }
    };

    const inputCls = 'w-full bg-card-light border border-[var(--border-color)] rounded-lg px-3.5 py-2.5 text-[14px] text-ink placeholder:text-ink-faint outline-none focus:border-primary/60 transition-colors';

    return (
        <div className="min-h-screen bg-background-light text-ink flex flex-col">
            {/* Minimal top bar */}
            <div className="h-14 shrink-0 flex items-center px-4 md:px-6 border-b border-[var(--border-strong)]">
                <button onClick={onClose} className="flex items-center gap-1.5 text-[13px] text-ink-muted hover:text-ink transition-colors">
                    <ArrowLeft className="w-4 h-4" /> На главную
                </button>
            </div>

            {/* Centered card */}
            <div className="flex-1 flex items-center justify-center px-4 py-10">
                <div className="w-full max-w-sm">
                    {/* Brand */}
                    <div className="flex flex-col items-center mb-7">
                        <div className="w-11 h-11 bg-brand-grad rounded-[12px] flex items-center justify-center mb-3">
                            <Glasses className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="text-lg font-semibold text-ink">
                            {mode === 'login' ? 'Вход в КрасоМир' : mode === 'register' ? 'Регистрация' : 'Сброс пароля'}
                        </h1>
                        <p className="text-[13px] text-ink-muted mt-1 text-center">
                            {mode === 'login' ? 'Войдите, чтобы продолжить' : mode === 'register' ? 'Создайте аккаунт за минуту' : 'Введите email для восстановления'}
                        </p>
                    </div>

                    {/* Login/Register tabs */}
                    {mode !== 'forgot' && (
                        <div className="grid grid-cols-2 gap-1 p-1 bg-surface-muted rounded-lg mb-5">
                            <button onClick={() => reset('login')} className={`py-1.5 rounded-md text-[13px] font-semibold transition-colors ${mode === 'login' ? 'bg-card-light text-ink border border-[var(--border-color)]' : 'text-ink-muted'}`}>Вход</button>
                            <button onClick={() => reset('register')} className={`py-1.5 rounded-md text-[13px] font-semibold transition-colors ${mode === 'register' ? 'bg-card-light text-ink border border-[var(--border-color)]' : 'text-ink-muted'}`}>Регистрация</button>
                        </div>
                    )}

                    {/* Google */}
                    {mode !== 'forgot' && (
                        <button onClick={handleGoogle} className="w-full flex items-center justify-center gap-2.5 bg-card-light border border-[var(--border-color)] text-ink px-4 py-2.5 rounded-lg text-[14px] font-semibold hover:bg-surface-muted transition-colors mb-4">
                            <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                            Продолжить с Google
                        </button>
                    )}

                    {mode !== 'forgot' && (
                        <div className="flex items-center gap-3 my-4 text-[12px] text-ink-faint">
                            <span className="flex-1 h-px bg-[var(--border-strong)]" /> или <span className="flex-1 h-px bg-[var(--border-strong)]" />
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-3">
                        {mode === 'register' && (
                            <input type="text" placeholder="Ваше имя" value={name} onChange={e => setName(e.target.value)} className={inputCls} />
                        )}
                        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className={inputCls} />

                        {mode !== 'forgot' && (
                            <div className="relative">
                                <input type={showPass ? 'text' : 'password'} placeholder="Пароль" value={password} onChange={e => setPassword(e.target.value)} className={`${inputCls} pr-10`} />
                                <button type="button" onClick={() => setShowPass(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink">
                                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        )}

                        {mode === 'register' && (
                            <input type={showPass ? 'text' : 'password'} placeholder="Повторите пароль" value={confirm} onChange={e => setConfirm(e.target.value)} className={inputCls} />
                        )}

                        {mode === 'login' && (
                            <div className="flex justify-end">
                                <button type="button" onClick={() => reset('forgot')} className="text-[12px] text-ink-muted hover:text-primary transition-colors">Забыли пароль?</button>
                            </div>
                        )}

                        {error && <div className="text-red-400 text-[12px] bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</div>}
                        {success && <div className="text-primary text-[12px] bg-primary/10 border border-primary/20 rounded-lg px-3 py-2">{success}</div>}

                        <button type="submit" disabled={busy} className="w-full bg-primary text-on-primary font-bold py-2.5 rounded-lg text-[14px] hover:bg-primary-hover disabled:opacity-60 transition-colors flex items-center justify-center gap-2">
                            {busy && <Loader2 className="w-4 h-4 animate-spin" />}
                            {mode === 'login' ? 'Войти' : mode === 'register' ? 'Создать аккаунт' : 'Отправить'}
                        </button>

                        {mode === 'forgot' && (
                            <button type="button" onClick={() => reset('login')} className="w-full text-ink-muted text-[13px] hover:text-ink py-1">Вернуться ко входу</button>
                        )}
                    </form>

                    <p className="text-[11px] text-ink-faint text-center mt-6 leading-relaxed">
                        Продолжая, вы соглашаетесь с Пользовательским соглашением и Политикой конфиденциальности.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default AuthPage;
