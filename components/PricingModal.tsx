
import React, { useState, useEffect } from 'react';
import { Check, X, Zap, Crown, Briefcase, CreditCard, User, Loader2, Smartphone, Sparkles } from 'lucide-react';
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
    credits: 45,
    features: [
      '45 Кредитов (при регистрации)',
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
    price: 245,
    credits: 350,
    features: [
      '350 Кредитов / мес',
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
    price: 450,
    credits: 750,
    isPopular: true,
    features: [
      '750 Кредитов / мес',
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
    price: 845,
    credits: 4000,
    features: [
      '4000 Кредитов / мес',
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
      const checkoutUrl = await createPaymentSession(
        user.uid,
        user.email || 'guest@photosmart.ru',
        plan.id,
        plan.price
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

      <div className="relative w-full max-w-6xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-500">

        <div className="p-8 md:p-12 text-center relative overflow-hidden shrink-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>
          <button onClick={onClose} className="absolute top-6 right-6 p-3 bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-2xl transition-all active:scale-95 z-20">
            <X className="w-6 h-6" />
          </button>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6 relative z-10">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Premium Access</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-3 relative z-10 tracking-tight">Выберите свой план</h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg relative z-10 font-medium">Раскройте потенциал ИИ без ограничений</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-10 bg-slate-50 dark:bg-slate-950/50 custom-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-7xl mx-auto items-stretch">
            {PLANS.map((plan) => {
              // Normalize current tier for comparison
              const normalizedCurrentTier = (currentTier || 'free').toLowerCase().trim();
              const normalizedPlanId = plan.id.toLowerCase().trim();
              const isCurrent = normalizedCurrentTier === normalizedPlanId;

              // Debug logging (remove after testing)
              if (plan.id === 'creator') {
                console.log('PricingModal Debug:', {
                  currentTier,
                  normalizedCurrentTier,
                  planId: plan.id,
                  normalizedPlanId,
                  isCurrent
                });
              }

              return (
                <div key={plan.id} className={`relative bg-white dark:bg-slate-900/50 backdrop-blur-sm rounded-[32px] border transition-all duration-500 flex flex-col h-full group ${plan.isPopular ? 'border-primary shadow-2xl scale-100 lg:scale-[1.02] z-10 ring-4 ring-primary/5' : 'border-slate-100 dark:border-slate-800 hover:border-primary/30 shadow-sm'} ${isCurrent ? 'bg-slate-50/50 dark:bg-slate-800/30' : ''}`}>
                  {plan.isPopular && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-on-primary text-[10px] font-bold px-5 py-2 rounded-full shadow-lg shadow-primary/30 whitespace-nowrap uppercase tracking-widest z-20">Хит Продаж</div>
                  )}
                  <div className="p-8 pb-4 flex-1 flex flex-col">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-8 shadow-xl transition-transform group-hover:scale-110`}>
                      {plan.id === 'free' && <User className="w-7 h-7 text-white" />}
                      {plan.id === 'creator' && <Zap className="w-7 h-7 text-white" />}
                      {plan.id === 'pro' && <Crown className="w-7 h-7 text-white" />}
                      {plan.id === 'business' && <Briefcase className="w-7 h-7 text-white" />}
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{plan.name}</h3>
                    <div className="flex items-baseline gap-1 mb-8">
                      <span className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">{formatRUB(plan.price)}</span>
                      {plan.price > 0 && <span className="text-slate-400 text-sm font-bold uppercase tracking-widest">/мес</span>}
                    </div>
                    <div className="space-y-4 mb-8">
                      {plan.features.map((f, idx) => (
                        <div key={idx} className="flex items-start gap-3 text-sm text-slate-500 dark:text-slate-400 font-medium">
                          <div className="mt-1 w-4 h-4 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0"><Check className="w-2.5 h-2.5 text-emerald-500" /></div>
                          {f}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-8 pt-0 mt-auto">
                    <button onClick={() => !isCurrent && handlePurchase(plan)} disabled={!!processing || isCurrent} className={`w-full py-5 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2 uppercase tracking-[0.2em] ${isCurrent ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-default' : plan.isPopular ? 'bg-primary text-on-primary hover:bg-blue-600 hover:shadow-xl hover:shadow-primary/20 active:scale-95' : plan.id === 'free' ? 'bg-slate-50 dark:bg-slate-800 text-slate-500 hover:bg-slate-100' : 'bg-slate-900 dark:bg-white dark:text-slate-900 text-white hover:bg-black active:scale-95'}`}>
                      {processing === plan.id ? <Loader2 className="w-5 h-5 animate-spin" /> : isCurrent ? <><Check className="w-4 h-4" /> Ваш тариф</> : plan.id === 'free' ? 'Бесплатно' : 'Выбрать'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-16 text-center pb-12 border-t border-slate-100 dark:border-slate-800 pt-10">
            <p className="text-slate-400 text-[10px] md:text-xs mb-8 max-w-2xl mx-auto leading-relaxed">
              Нажимая «Купить», вы полностью соглашаетесь с условиями <span className="text-primary font-bold cursor-pointer">Оферты и Пользовательского соглашения</span>. <br />
              Фискальные чеки отправляются на ваш email через <b>Cloud Kassir</b> в соответствии с ФЗ-54. Безопасные платежи обеспечиваются АО «Альфа-Банк».
            </p>
            <div className="inline-flex flex-wrap justify-center gap-8 opacity-40 hover:opacity-60 transition-opacity">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4" alt="Visa" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-8" alt="Mastercard" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b9/Mir-logo.svg" className="h-5" alt="MIR" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingModal;
