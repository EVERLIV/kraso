
import React, { useState, useEffect } from 'react';
import { X, User, Settings, LogOut, Zap, History, Image, CreditCard, Lock, Mail, CheckCircle2, XCircle, Code, Copy, RefreshCw, Key } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { db, firebase } from '../lib/firebase';
import { SubscriptionTier } from '../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  credits: number;
  userTier: SubscriptionTier;
}

type Tab = 'overview' | 'security' | 'billing' | 'developers';
type AuthMode = 'login' | 'register';

const TIER_LABELS: Record<SubscriptionTier, string> = {
    'free': 'Free Plan',
    'creator': 'Creator',
    'pro': 'Pro Member',
    'business': 'Business'
};

const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose, credits, userTier }) => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const { user, signInWithGoogle, loginWithEmail, registerWithEmail, logout } = useAuth();
  
  // Auth Form State
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // API Key State
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isKeyVisible, setIsKeyVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
        setAuthError(null);
        // In real app, fetch apiKey from Firestore user document here
        if (user && !apiKey) setApiKey(`sk_live_${Math.random().toString(36).substring(2, 15)}`);
    }
  }, [isOpen, user]);

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
        onClose();
    } catch (err: any) {
        setAuthError("Ошибка авторизации. Проверьте данные.");
    } finally { setIsSubmitting(false); }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-0 md:p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative w-full md:max-w-4xl h-full md:h-auto md:max-h-[90vh] bg-[#0F1218] border-0 md:border border-brand-border md:rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden animate-in zoom-in-95 duration-200">
         
         {user && (
             <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-brand-border bg-[#0B0E14] flex flex-col shrink-0">
                <div className="p-4 md:p-6 border-b border-brand-border flex justify-between items-center">
                   <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <Settings className="w-5 h-5 text-brand-muted" /> Настройки
                   </h2>
                   <button onClick={onClose} className="md:hidden text-brand-muted hover:text-white"><X className="w-6 h-6" /></button>
                </div>
                
                <div className="p-2 md:p-4 flex md:flex-col overflow-x-auto md:overflow-visible gap-2 md:gap-1">
                    {[
                        { id: 'overview', icon: User, label: 'Обзор' },
                        { id: 'security', icon: Lock, label: 'Безопасность' },
                        { id: 'billing', icon: CreditCard, label: 'Платежи' },
                        { id: 'developers', icon: Code, label: 'Для API' }
                    ].map(item => (
                        <button 
                            key={item.id}
                            onClick={() => setActiveTab(item.id as Tab)}
                            className={`flex-shrink-0 flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeTab === item.id ? 'bg-brand-accent/10 text-brand-accent' : 'text-brand-muted hover:text-white hover:bg-white/5'}`}
                        >
                            <item.icon className="w-4 h-4" /> {item.label}
                        </button>
                    ))}
                </div>

                <button onClick={() => logout()} className="mt-auto m-4 flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors hidden md:flex">
                    <LogOut className="w-4 h-4" /> Выйти
                </button>
             </div>
         )}

         <div className="flex-1 flex flex-col bg-[#0F1218] relative min-h-0 overflow-hidden">
            <button onClick={onClose} className="hidden md:block absolute top-4 right-4 p-2 text-brand-muted hover:text-white z-10"><X className="w-5 h-5" /></button>

            <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
               {!user ? (
                   <div className="h-full flex flex-col items-center justify-center max-w-sm mx-auto w-full py-8 text-center">
                       <div className="w-full bg-brand-bg rounded-lg p-1 border border-brand-border mb-8 grid grid-cols-2">
                           <button onClick={() => setAuthMode('login')} className={`text-sm font-bold py-2 rounded-md transition-all ${authMode === 'login' ? 'bg-brand-card text-white shadow-sm' : 'text-brand-muted'}`}>Вход</button>
                           <button onClick={() => setAuthMode('register')} className={`text-sm font-bold py-2 rounded-md transition-all ${authMode === 'register' ? 'bg-brand-card text-white shadow-sm' : 'text-brand-muted'}`}>Регистрация</button>
                       </div>
                       <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-tight">{authMode === 'login' ? 'С возвращением' : 'Создать аккаунт'}</h2>
                       <button onClick={() => signInWithGoogle()} className="w-full flex items-center justify-center gap-3 bg-white text-black px-6 py-3 rounded-xl font-bold transition-all mb-6 active:scale-95 shadow-lg">
                            <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                            Google
                       </button>
                       <form onSubmit={handleEmailAuth} className="w-full space-y-4">
                           {authMode === 'register' && <input type="text" placeholder="Ваше имя" value={fullName} onChange={e=>setFullName(e.target.value)} className="w-full bg-brand-bg border border-brand-border rounded-xl px-4 py-3 text-white outline-none focus:border-brand-accent transition-colors" />}
                           <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full bg-brand-bg border border-brand-border rounded-xl px-4 py-3 text-white outline-none focus:border-brand-accent transition-colors" />
                           <input type="password" placeholder="Пароль" value={password} onChange={e=>setPassword(e.target.value)} className="w-full bg-brand-bg border border-brand-border rounded-xl px-4 py-3 text-white outline-none focus:border-brand-accent transition-colors" />
                           {authError && <div className="text-red-400 text-xs">{authError}</div>}
                           <button type="submit" disabled={isSubmitting} className="w-full bg-brand-accent text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-all uppercase tracking-widest">{isSubmitting ? '...' : (authMode === 'login' ? 'Войти' : 'Создать')}</button>
                       </form>
                   </div>
               ) : (
                   <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        {activeTab === 'overview' && (
                            <div className="space-y-8">
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 p-1 ring-2 ring-brand-border overflow-hidden shrink-0"><img src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} className="w-full h-full rounded-full bg-black" /></div>
                                    <div className="min-w-0">
                                        <h1 className="text-2xl font-bold text-white truncate">{user.displayName || user.email?.split('@')[0]}</h1>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="px-2 py-0.5 bg-brand-accent/20 text-brand-accent text-[10px] font-bold rounded uppercase tracking-wider border border-brand-accent/20">{TIER_LABELS[userTier]}</span>
                                            <span className="text-brand-muted text-xs">• ID: {user.uid.substring(0,8)}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    <div className="bg-[#151921] border border-brand-border p-5 rounded-2xl relative overflow-hidden group">
                                        <div className="text-brand-muted text-[10px] uppercase font-bold tracking-wider mb-2 flex items-center gap-2"><Zap className="w-3 h-3 text-yellow-500" /> Кредиты</div>
                                        <div className="text-3xl font-bold text-white tabular-nums">{credits}</div>
                                        <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-yellow-500/5 rounded-full group-hover:scale-150 transition-transform"></div>
                                    </div>
                                    <div className="bg-[#151921] border border-brand-border p-5 rounded-2xl">
                                        <div className="text-brand-muted text-[10px] uppercase font-bold tracking-wider mb-2 flex items-center gap-2"><Image className="w-3 h-3 text-purple-500" /> Создано</div>
                                        <div className="text-3xl font-bold text-white tabular-nums">12</div>
                                    </div>
                                    <div className="bg-[#151921] border border-brand-border p-5 rounded-2xl hidden md:block">
                                        <div className="text-brand-muted text-[10px] uppercase font-bold tracking-wider mb-2 flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-green-500" /> Статус</div>
                                        <div className="text-3xl font-bold text-white">Активен</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'billing' && (
                            <div className="space-y-6">
                                <div><h2 className="text-xl font-bold text-white mb-1">История платежей</h2><p className="text-brand-muted text-sm">Управление подпиской и чеки Cloud Kassir.</p></div>
                                <div className="bg-gradient-to-br from-indigo-900/20 to-brand-bg border border-indigo-500/30 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="text-center md:text-left">
                                        <div className="text-xs text-indigo-400 font-bold uppercase tracking-widest mb-1">Текущий тариф</div>
                                        <div className="text-3xl font-bold text-white">{TIER_LABELS[userTier]}</div>
                                    </div>
                                    <button className="bg-white text-black font-bold px-8 py-3 rounded-xl hover:bg-gray-100 transition-colors shadow-lg active:scale-95">Продлить подписку</button>
                                </div>
                                <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl text-brand-muted text-sm">У вас пока нет оплаченных счетов.</div>
                            </div>
                        )}

                        {activeTab === 'developers' && (
                            <div className="space-y-8">
                                <div><h2 className="text-xl font-bold text-white mb-1">Для разработчиков (Merchant API)</h2><p className="text-brand-muted text-sm">Используйте API для интеграции Photo Smart в свои сервисы.</p></div>
                                <div className="bg-[#0B0E14] border border-brand-border rounded-2xl p-6 space-y-6">
                                    <div className="space-y-3">
                                        <label className="flex items-center gap-2 text-xs font-bold text-brand-muted uppercase tracking-wider"><Key className="w-3 h-3" /> Ваш секретный ключ (API Key)</label>
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 font-mono text-xs text-brand-accent flex items-center justify-between group">
                                                <span>{isKeyVisible ? apiKey : '••••••••••••••••••••••••••••••••'}</span>
                                                <button onClick={()=>setIsKeyVisible(!isKeyVisible)} className="opacity-0 group-hover:opacity-100 transition-opacity">{isKeyVisible ? <X className="w-4 h-4"/> : <Image className="w-4 h-4"/>}</button>
                                            </div>
                                            <button onClick={()=>copyToClipboard(apiKey||'')} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-white transition-colors border border-white/5"><Copy className="w-5 h-5"/></button>
                                            <button onClick={handleGenerateKey} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-white transition-colors border border-white/5"><RefreshCw className="w-5 h-5"/></button>
                                        </div>
                                        <p className="text-[10px] text-red-400">Никогда не передавайте API ключ третьим лицам. Он дает доступ к вашему балансу кредитов.</p>
                                    </div>
                                    <div className="h-px bg-white/5"></div>
                                    <div className="space-y-4">
                                        <h4 className="text-sm font-bold text-white">Документация (Alpha)</h4>
                                        <div className="p-4 bg-black/30 rounded-xl border border-white/5 font-mono text-[11px] text-gray-400">
                                            POST https://api.smartphotos.ru/v1/generate<br/>
                                            Authorization: Bearer {apiKey?.substring(0,8)}...<br/>
                                            Content-Type: application/json<br/><br/>
                                            { "{" }<br/>
                                            &nbsp;&nbsp;"prompt": "A professional photo of...",<br/>
                                            &nbsp;&nbsp;"model": "gemini-2.5-flash-image"<br/>
                                            { "}" }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                   </div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
};

export default UserProfileModal;
