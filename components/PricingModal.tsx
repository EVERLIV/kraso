
import React, { useState, useEffect } from 'react';
import { Check, X, Zap, Crown, Briefcase, CreditCard, User, Loader2, Smartphone } from 'lucide-react';
import { SubscriptionPlan, SubscriptionTier } from '../types';
import { createPaymentSession } from '../services/paymentService';
import { useAuth } from '../contexts/AuthContext';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  currentTier?: SubscriptionTier;
}

const PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    credits: 5,
    features: [
      '5 Кредитов / старт',
      'Водяной знак',
      'Стандартная скорость',
      'Ограниченные стили'
    ],
    color: 'from-gray-500 to-slate-500',
    allowedQuality: ['1K']
  },
  {
    id: 'creator',
    name: 'Creator',
    price: 99,
    credits: 100,
    features: [
      '100 Кредитов / мес',
      'Без водяного знака',
      'Генерация HD',
      'Стандартная скорость',
      'История 30 дней'
    ],
    color: 'from-blue-500 to-cyan-500',
    allowedQuality: ['1K', '2K']
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 299,
    credits: 500,
    isPopular: true,
    features: [
      '500 Кредитов / мес',
      'Доступ ко всем шаблонам',
      'Генерация 4K Ultra HD',
      'Высокая скорость',
      'Коммерческие права',
      'Поддержка 24/7'
    ],
    color: 'from-purple-500 to-pink-500',
    allowedQuality: ['1K', '2K', '4K']
  },
  {
    id: 'business',
    name: 'Business',
    price: 699,
    credits: 2000,
    features: [
      '2000 Кредитов / мес',
      'API Access (Beta)',
      'Безлимитное хранилище',
      'Параллельная генерация',
      'Управление командой',
      'НДС счет-фактура'
    ],
    color: 'from-yellow-500 to-orange-500',
    allowedQuality: ['1K', '2K', '4K']
  }
];

const formatRUB = (price: number) => {
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 }).format(price);
};

const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose, onSuccess, currentTier }) => {
  const { user } = useAuth();
  const [processing, setProcessing] = useState<SubscriptionTier | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'sbp'>('card');

  useEffect(() => {
    if (isOpen) {
      setProcessing(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePurchase = async (plan: SubscriptionPlan) => {
    if (!user) {
        alert("Пожалуйста, войдите в систему!");
        return;
    }
    if (plan.id === 'free') { onClose(); return; }
    
    setProcessing(plan.id);
    try {
        // Мы передаем email пользователя в функцию регистрации заказа.
        // Банк вернет этот email в Callback-уведомлении, что позволит серверу 
        // автоматически найти пользователя и начислить кредиты.
        const checkoutUrl = await createPaymentSession(
            user.uid, 
            user.email || 'guest@photosmart.ru', 
            plan.id, 
            plan.price, 
            paymentMethod
        );
        
        window.location.href = checkoutUrl;
    } catch (error) {
        console.error(error);
        alert("Ошибка оплаты. Пожалуйста, попробуйте снова.");
        setProcessing(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity animate-in fade-in" onClick={onClose} />

      <div className="relative w-full max-w-6xl bg-[#0B0E14] border border-brand-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-300">
        
        <div className="p-6 md:p-10 text-center relative overflow-hidden bg-brand-bg shrink-0">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-accent/10 blur-[100px] rounded-full pointer-events-none"></div>
           <button onClick={onClose} className="absolute top-4 right-4 p-2 text-brand-muted hover:text-white transition-colors"><X className="w-6 h-6" /></button>
           
           <h2 className="text-2xl md:text-4xl font-bold text-white mb-2 relative z-10 uppercase tracking-tight">Пополнить баланс</h2>
           
           {/* Payment Method Switcher */}
           <div className="flex justify-center gap-3 mt-6 relative z-10">
              <button 
                onClick={() => setPaymentMethod('card')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${paymentMethod === 'card' ? 'bg-white text-black border-white' : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'}`}
              >
                 <CreditCard className="w-4 h-4" />
                 <span className="text-xs font-bold">Карта РФ</span>
              </button>
              <button 
                onClick={() => setPaymentMethod('sbp')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${paymentMethod === 'sbp' ? 'bg-[#00A4E4] text-white border-[#00A4E4]' : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'}`}
              >
                 <Smartphone className="w-4 h-4" />
                 <span className="text-xs font-bold">СБП</span>
              </button>
           </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-10 bg-[#0F1218] custom-scrollbar">
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-7xl mx-auto items-stretch">
              {PLANS.map((plan) => {
                const isCurrent = currentTier === plan.id;
                return (
                <div key={plan.id} className={`relative bg-[#151921] rounded-2xl border transition-all duration-300 flex flex-col h-full ${plan.isPopular ? 'border-purple-500 shadow-2xl shadow-purple-900/20 scale-100 lg:scale-105 z-10' : 'border-brand-border hover:border-brand-accent/50'} ${isCurrent ? 'ring-2 ring-brand-accent/50 bg-brand-accent/5' : ''}`}>
                  {plan.isPopular && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] md:text-xs font-bold px-3 py-1 rounded-full shadow-lg whitespace-nowrap">ХИТ ПРОДАЖ</div>
                  )}
                  <div className="p-6 flex-1 flex flex-col">
                     <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-6 shadow-lg`}>
                        {plan.id === 'free' && <User className="w-6 h-6 text-white" />}
                        {plan.id === 'creator' && <Zap className="w-6 h-6 text-white" />}
                        {plan.id === 'pro' && <Crown className="w-6 h-6 text-white" />}
                        {plan.id === 'business' && <Briefcase className="w-6 h-6 text-white" />}
                     </div>
                     <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                     <div className="flex items-baseline gap-1 mb-6">
                        <span className="text-2xl md:text-3xl font-bold text-white">{formatRUB(plan.price)}</span>
                        {plan.price > 0 && <span className="text-brand-muted text-xs md:text-sm">/мес</span>}
                     </div>
                     <div className="space-y-3 mb-8">
                        {plan.features.map((f, idx) => (
                            <div key={idx} className="flex items-start gap-3 text-xs md:text-sm text-gray-300">
                                <div className="mt-0.5 w-4 h-4 rounded-full bg-white/10 flex items-center justify-center shrink-0"><Check className="w-2.5 h-2.5 text-green-400" /></div>
                                {f}
                            </div>
                        ))}
                     </div>
                  </div>
                  <div className="p-6 pt-0 mt-auto">
                     <button onClick={() => !isCurrent && handlePurchase(plan)} disabled={!!processing || isCurrent} className={`w-full py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${isCurrent ? 'bg-brand-border text-brand-muted cursor-default' : plan.isPopular ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/30 active:scale-95' : plan.id === 'free' ? 'bg-white/5 text-brand-muted hover:bg-white/10' : 'bg-white/10 text-white hover:bg-white/20 active:scale-95'}`}>
                        {processing === plan.id ? <Loader2 className="w-5 h-5 animate-spin" /> : isCurrent ? <><Check className="w-4 h-4" /> Текущий</> : plan.id === 'free' ? 'Бесплатно' : 'Купить'}
                     </button>
                  </div>
                </div>
              )})}
           </div>

           <div className="mt-12 text-center pb-8 border-t border-white/5 pt-8">
              <p className="text-brand-muted text-[10px] md:text-xs mb-4 max-w-2xl mx-auto opacity-60">
                Нажимая «Купить», вы соглашаетесь с условиями оферты. Фискальные чеки отправляются на ваш email через <b>Cloud Kassir</b> в соответствии с ФЗ-54. Эквайринг — АО «Альфа-Банк».
              </p>
              <div className="inline-flex flex-wrap justify-center gap-6 opacity-40">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4" alt="Visa" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-6" alt="Mastercard" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b9/Mir-logo.svg" className="h-4" alt="MIR" />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PricingModal;
