
import React from 'react';
import { Check, Zap, Crown, Briefcase, CreditCard } from 'lucide-react';
import { SubscriptionPlan } from '../../types';

const PLANS: SubscriptionPlan[] = [
  {
    id: 'creator',
    name: 'Creator',
    price: 99,
    credits: 100,
    features: [
      '100 Кредитов / мес',
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

interface PricingPageProps {
    onAuth: () => void;
}

const PricingPage: React.FC<PricingPageProps> = ({ onAuth }) => {
  return (
    <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Тарифы КрасоМир</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Выберите план, который подходит именно вам. Прозрачные цены от «Два А — Цифровые Решения».
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start mb-16">
            {PLANS.map((plan) => (
                <div 
                  key={plan.id}
                  className={`
                    relative bg-[#151921] rounded-2xl border transition-all duration-300 flex flex-col
                    ${plan.isPopular 
                        ? 'border-purple-500 shadow-2xl shadow-purple-900/20 scale-100 md:scale-105 z-10' 
                        : 'border-white/10 hover:border-purple-500/50'}
                  `}
                >
                  {plan.isPopular && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] md:text-xs font-bold px-3 py-1 rounded-full shadow-lg whitespace-nowrap">
                      ПОПУЛЯРНЫЙ
                    </div>
                  )}

                  <div className="p-8 flex-1">
                     <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-6 shadow-lg`}>
                        {plan.id === 'creator' && <Zap className="w-6 h-6 text-white" />}
                        {plan.id === 'pro' && <Crown className="w-6 h-6 text-white" />}
                        {plan.id === 'business' && <Briefcase className="w-6 h-6 text-white" />}
                     </div>

                     <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                     <div className="flex items-baseline gap-1 mb-6">
                        <span className="text-3xl md:text-4xl font-bold text-white">{formatRUB(plan.price)}</span>
                        <span className="text-gray-400 text-sm">/месяц</span>
                     </div>
                     
                     <div className="space-y-4 mb-8">
                        {plan.features.map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-3 text-sm text-gray-300">
                                <div className={`mt-0.5 w-4 h-4 rounded-full bg-white/10 flex items-center justify-center shrink-0`}>
                                    <Check className="w-2.5 h-2.5 text-green-400" />
                                </div>
                                {feature}
                            </div>
                        ))}
                     </div>
                  </div>

                  <div className="p-8 pt-0 mt-auto">
                     <button
                        onClick={onAuth}
                        className={`
                          w-full py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2
                          ${plan.isPopular 
                              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/30' 
                              : 'bg-white/10 text-white hover:bg-white/20'
                          }
                        `}
                     >
                        Начать
                     </button>
                  </div>
                </div>
            ))}
        </div>

        <div className="text-center">
            <div className="inline-flex items-center gap-2 text-gray-500 text-sm bg-white/5 px-6 py-3 rounded-full border border-white/5">
                <CreditCard className="w-4 h-4 text-red-500" />
                <span>Эквайринг предоставлен АО "Альфа-Банк". Безопасный платеж SSL. Юридическое лицо: «Два А — Цифровые Решения».</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
