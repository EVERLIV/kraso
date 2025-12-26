
import React, { useState, useEffect } from 'react';
import { Cookie, ShieldCheck, AlertTriangle } from 'lucide-react';

export const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted
    const consent = localStorage.getItem('photo_smart_cookie_consent');
    if (!consent) {
      // Small delay for animation effect on load
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('photo_smart_cookie_consent', 'true');
    setIsVisible(false);
  };

  const handleDecline = () => {
    // Try to close the tab
    try {
      window.close();
    } catch (e) {
      console.log("Browser blocked close window");
    }
    // Fallback: Redirect to a neutral page if window.close() is blocked by browser
    window.location.href = 'https://google.com';
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-[200] p-4 md:p-6 flex justify-center pointer-events-none">
       <div className="pointer-events-auto max-w-5xl w-full bg-[#0F1218]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/50 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden animate-in slide-in-from-bottom-10 duration-700">
          
          {/* Decorative Gradients */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-600/20 blur-[100px] rounded-full pointer-events-none"></div>
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full pointer-events-none"></div>

          <div className="flex items-start gap-5 relative z-10">
             <div className="w-14 h-14 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center shrink-0 border border-white/5 shadow-inner hidden sm:flex">
                <Cookie className="w-7 h-7 text-purple-300" />
             </div>
             <div className="text-left">
                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                   <span className="sm:hidden"><Cookie className="w-5 h-5 text-purple-300" /></span>
                   Мы используем Cookies
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed max-w-2xl">
                   Для работы AI-генерации и сохранения ваших шедевров нам нужны файлы cookie. Продолжая, вы соглашаетесь с <strong>Пользовательским соглашением</strong> и <span className="text-white font-medium hover:text-brand-accent cursor-pointer transition-colors">Политикой конфиденциальности</span> сервиса Photo Smart.
                </p>
             </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto relative z-10 shrink-0">
             <button 
               onClick={handleDecline}
               className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 hover:border-white/20 transition-all text-sm font-medium"
             >
                Отклонить
             </button>
             <button 
               onClick={handleAccept}
               className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold shadow-lg shadow-purple-900/30 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm flex items-center justify-center gap-2 whitespace-nowrap"
             >
                <ShieldCheck className="w-4 h-4" />
                Принять все
             </button>
          </div>
       </div>
    </div>
  );
};
