
import React from 'react';
import { Mail, Building2, Send, Globe, MessageSquare } from 'lucide-react';

const ContactPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20 font-sans">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
           {/* Info Column */}
           <div className="space-y-12">
              <div className="animate-in fade-in slide-in-from-left-4 duration-700">
                 <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
                    Свяжитесь <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                      с нами
                    </span>
                 </h1>
                 <p className="text-xl text-gray-400 leading-relaxed max-w-lg">
                    Есть вопросы по работе сервиса или предложения по сотрудничеству? Команда Photo Smart всегда готова помочь.
                 </p>
              </div>

              <div className="space-y-6 animate-in fade-in slide-in-from-left-6 duration-700 delay-100">
                 {/* Email Item */}
                 <div className="flex items-start gap-6 p-6 rounded-3xl bg-white/[0.03] border border-white/5 hover:border-indigo-500/30 transition-all group">
                    <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                       <Mail className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                       <h3 className="font-bold text-lg mb-1 text-white">Электронная почта</h3>
                       <a href="mailto:billing@asprollc.ru" className="text-gray-400 hover:text-indigo-400 transition-colors text-lg font-medium">
                          billing@asprollc.ru
                       </a>
                       <p className="text-xs text-gray-500 mt-2">Отвечаем в течение рабочего дня</p>
                    </div>
                 </div>

                 {/* Legal Item */}
                 <div className="flex items-start gap-6 p-6 rounded-3xl bg-white/[0.03] border border-white/5 hover:border-purple-500/30 transition-all group">
                    <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                       <Building2 className="w-6 h-6 text-purple-400" />
                    </div>
                    <div className="flex-1">
                       <h3 className="font-bold text-lg mb-2 text-white">Реквизиты компании</h3>
                       <div className="space-y-3">
                          <p className="text-white font-semibold text-sm">ООО «АСПРО»</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-[13px] font-mono text-gray-400">
                             <div className="flex justify-between border-b border-white/5 pb-1">
                                <span className="opacity-50">ИНН</span>
                                <span>7708427184</span>
                             </div>
                             <div className="flex justify-between border-b border-white/5 pb-1">
                                <span className="opacity-50">КПП</span>
                                <span>770801001</span>
                             </div>
                             <div className="flex justify-between border-b border-white/5 pb-1">
                                <span className="opacity-50">ОГРН</span>
                                <span>1237700834139</span>
                             </div>
                             <div className="flex justify-between border-b border-white/5 pb-1">
                                <span className="opacity-50">Регион</span>
                                <span>Москва</span>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Form Column */}
           <div className="bg-[#0F1218] border border-white/10 rounded-[40px] p-8 md:p-12 shadow-2xl relative overflow-hidden animate-in fade-in slide-in-from-right-4 duration-700">
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none"></div>
              
              <div className="relative z-10 mb-10">
                 <h2 className="text-3xl font-bold mb-3">Напишите нам</h2>
                 <p className="text-gray-400 text-sm">Мы перезвоним или напишем вам на почту.</p>
              </div>

              <form className="space-y-6 relative z-10" onSubmit={(e) => e.preventDefault()}>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Ваше имя</label>
                        <input 
                           type="text" 
                           className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-indigo-500 outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-gray-700 shadow-inner" 
                           placeholder="Иван Иванов" 
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Email</label>
                        <input 
                           type="email" 
                           className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-indigo-500 outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-gray-700 shadow-inner" 
                           placeholder="name@mail.ru" 
                        />
                    </div>
                 </div>
                 
                 <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Тема сообщения</label>
                    <select className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-indigo-500 outline-none transition-all cursor-pointer shadow-inner">
                       <option>Техническая поддержка</option>
                       <option>Вопрос по оплате</option>
                       <option>Предложение о партнерстве</option>
                       <option>Другое</option>
                    </select>
                 </div>

                 <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Ваш вопрос</label>
                    <textarea 
                       className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-indigo-500 outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all h-32 resize-none placeholder:text-gray-700 shadow-inner" 
                       placeholder="Опишите вашу проблему или предложение..."
                    ></textarea>
                 </div>
                 
                 <button className="w-full bg-white text-black font-bold py-5 rounded-2xl hover:bg-gray-200 transition-all flex items-center justify-center gap-3 text-lg shadow-xl hover:shadow-white/5 active:scale-[0.98]">
                    <Send className="w-5 h-5" /> 
                    Отправить сообщение
                 </button>
                 
                 <p className="text-[10px] text-gray-600 text-center mt-6 leading-relaxed">
                    Нажимая кнопку, вы подтверждаете согласие с <span className="underline cursor-pointer hover:text-gray-400">Политикой конфиденциальности</span> и <span className="underline cursor-pointer hover:text-gray-400">Пользовательским соглашением</span> ООО «АСПРО».
                 </p>
              </form>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
