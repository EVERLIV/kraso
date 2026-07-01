
import React from 'react';
import { X, Server, Shield, FileText, HelpCircle, CheckCircle2, Activity, Cpu, Database, Globe } from 'lucide-react';

export type InfoPageType = 'support' | 'terms' | 'privacy' | 'status' | null;

interface InfoModalProps {
   page: InfoPageType;
   onClose: () => void;
}

const InfoModal: React.FC<InfoModalProps> = ({ page, onClose }) => {
   if (!page) return null;

   const renderContent = () => {
      switch (page) {
         case 'status':
            return (
               <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <div className="flex items-center justify-between bg-green-500/10 border border-green-500/20 p-6 rounded-2xl">
                     <div className="flex items-center gap-4">
                        <div className="relative">
                           <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                           <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-50"></div>
                        </div>
                        <div>
                           <h3 className="text-xl font-bold text-brand-text">Все системы работают штатно</h3>
                           <p className="text-green-600 text-sm">Инцидентов не обнаружено</p>
                        </div>
                     </div>
                     <div className="text-right">
                        <div className="text-2xl font-mono font-bold text-brand-text">100.0%</div>
                        <p className="text-brand-muted text-xs uppercase tracking-wider">Uptime (24ч)</p>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                     {[
                        { name: 'Основной API', icon: Globe },
                        { name: 'Генерация (GPU)', icon: Cpu },
                        { name: 'База данных', icon: Database },
                        { name: 'Хранилище', icon: Server }
                     ].map((item, idx) => (
                        <div key={idx} className="bg-white border border-brand-border p-4 rounded-xl flex items-center justify-between group hover:border-green-500/50 transition-colors shadow-sm">
                           <div className="flex items-center gap-3">
                              <div className="p-2 bg-brand-accent/5 rounded-lg text-brand-muted group-hover:text-brand-text transition-colors">
                                 <item.icon className="w-5 h-5" />
                              </div>
                              <span className="font-medium text-sm text-brand-text">{item.name}</span>
                           </div>
                           <CheckCircle2 className="w-5 h-5 text-green-500" />
                        </div>
                     ))}
                  </div>

                  <div className="bg-white border border-brand-border p-6 rounded-2xl shadow-sm">
                     <h3 className="text-sm font-bold text-brand-muted uppercase tracking-wider mb-6 flex items-center gap-2">
                        <Activity className="w-4 h-4" /> Производительность системы
                     </h3>

                     <div className="grid grid-cols-3 gap-8 text-center">
                        <div className="space-y-1">
                           <div className="text-3xl font-bold text-brand-text">45ms</div>
                           <div className="text-xs text-brand-muted">API Latency</div>
                        </div>
                        <div className="space-y-1">
                           <div className="text-3xl font-bold text-green-400">0s</div>
                           <div className="text-xs text-brand-muted">Crash Time</div>
                        </div>
                        <div className="space-y-1">
                           <div className="3xl font-bold text-brand-text">0.02%</div>
                           <div className="text-xs text-brand-muted">Error Rate</div>
                        </div>
                     </div>

                     {/* Fake Graph */}
                     <div className="mt-8 h-32 w-full flex items-end gap-1 overflow-hidden opacity-50">
                        {Array.from({ length: 50 }).map((_, i) => (
                           <div
                              key={i}
                              className="flex-1 bg-green-500/20 rounded-t-sm hover:bg-green-500 transition-colors"
                              style={{ height: `${30 + Math.random() * 40}%` }}
                           ></div>
                        ))}
                     </div>
                  </div>
               </div>
            );

         case 'support':
            return (
               <div className="space-y-6 max-w-2xl mx-auto">
                  <div className="text-center mb-8">
                     <HelpCircle className="w-12 h-12 text-brand-accent mx-auto mb-4" />
                     <h2 className="text-2xl font-bold text-brand-text">Как мы можем помочь?</h2>
                     <p className="text-brand-muted mt-2">Наша команда отвечает в течение 24 часов.</p>
                  </div>

                  <div className="bg-white border border-brand-border rounded-xl p-6 shadow-sm">
                     <h3 className="font-bold text-brand-text mb-4">Частые вопросы</h3>
                     <div className="space-y-4">
                        <details className="group">
                           <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-brand-text">
                              <span>Как вернуть деньги?</span>
                              <span className="transition group-open:rotate-180">
                                 <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                              </span>
                           </summary>
                           <p className="text-brand-muted mt-3 group-open:animate-fadeIn text-sm">
                              Мы возвращаем средства, если вы не использовали кредиты в течение 14 дней после покупки. Напишите нам на billing@asprollc.ru.
                           </p>
                        </details>
                        <div className="h-px bg-brand-border"></div>
                        <details className="group">
                           <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-brand-text">
                              <span>Куда сохраняются фото?</span>
                              <span className="transition group-open:rotate-180">
                                 <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                              </span>
                           </summary>
                           <p className="text-brand-muted mt-3 group-open:animate-fadeIn text-sm">
                              Все генерации сохраняются в вашем личном кабинете в разделе "История".
                           </p>
                        </details>
                     </div>
                  </div>

                  <div className="text-center mt-8">
                     <p className="text-brand-muted text-sm mb-2">Свяжитесь с нами напрямую</p>
                     <a href="mailto:billing@asprollc.ru" className="text-brand-accent font-bold hover:underline">billing@asprollc.ru</a>
                  </div>
               </div>
            );

         case 'terms':
            return (
               <div className="space-y-4 text-brand-muted text-sm leading-relaxed max-w-3xl mx-auto">
                  <div className="flex items-center gap-3 mb-6">
                     <FileText className="w-8 h-8 text-brand-text" />
                     <h2 className="text-2xl font-bold text-brand-text">Пользовательское соглашение</h2>
                  </div>
                  <p>Последнее обновление: 12 Декабря 2025</p>
                  <h3 className="text-brand-text font-bold text-lg mt-6">1. Введение</h3>
                  <p>Добро пожаловать в КрасоМир. Используя наш сервис, вы соглашаетесь с условиями настоящего <strong>Пользовательского соглашения</strong>.</p>
                  <h3 className="text-brand-text font-bold text-lg mt-6">2. Лицензия на контент</h3>
                  <p>Весь контент, созданный с помощью AI, принадлежит вам (пользователю). Мы предоставляем вам неисключительную лицензию на использование инструментов генерации.</p>
                  <h3 className="text-brand-text font-bold text-lg mt-6">3. Оплата и подписки</h3>
                  <p>Услуги предоставляются по модели подписки или разовой покупки кредитов. Оплата обрабатывается через защищенные шлюзы (АО "Альфа-Банк"). Возврат средств возможен в соответствии с законодательством РФ.</p>
                  <h3 className="text-brand-text font-bold text-lg mt-6">4. Запрещенный контент</h3>
                  <p>Запрещено использовать сервис для генерации незаконного, оскорбительного или вредоносного контента. Аккаунты нарушителей блокируются без возврата средств.</p>
               </div>
            );

         case 'privacy':
            return (
               <div className="space-y-4 text-brand-muted text-sm leading-relaxed max-w-3xl mx-auto">
                  <div className="flex items-center gap-3 mb-6">
                     <Shield className="w-8 h-8 text-brand-text" />
                     <h2 className="text-2xl font-bold text-brand-text">Политика конфиденциальности</h2>
                  </div>
                  <p>Мы серьезно относимся к вашей приватности.</p>
                  <h3 className="text-brand-text font-bold text-lg mt-6">1. Сбор данных</h3>
                  <p>Мы собираем только необходимые данные: email для входа и загруженные вами изображения для обработки. Изображения хранятся в защищенном облаке.</p>
                  <h3 className="text-brand-text font-bold text-lg mt-6">2. Использование данных</h3>
                  <p>Ваши фото используются ИСКЛЮЧИТЕЛЬНО для процесса генерации. Мы не используем ваши личные фото для обучения общедоступных моделей AI без вашего явного согласия.</p>
                  <h3 className="text-brand-text font-bold text-lg mt-6">3. Безопасность</h3>
                  <p>Мы используем шифрование SSL/TLS и алгоритмы AES-256 для защиты ваших данных. Доступ к системам строго ограничен.</p>
                  <h3 className="text-brand-text font-bold text-lg mt-6">4. Удаление данных</h3>
                  <p>Вы можете запросить полное удаление аккаунта и всех данных через службу поддержки в любое время.</p>
               </div>
            );

         default:
            return null;
      }
   };

   return (
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
         <div
            className="absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity animate-in fade-in"
            onClick={onClose}
         />
         <div className="relative w-full max-w-4xl bg-brand-bg border border-brand-border rounded-2xl shadow-2xl flex flex-col h-[85vh] animate-in zoom-in-95 duration-300">
            <div className="p-4 border-b border-brand-border flex justify-end shrink-0">
               <button onClick={onClose} className="p-2 text-brand-muted hover:text-brand-text bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                  <X className="w-5 h-5" />
               </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
               {renderContent()}
            </div>
         </div>
      </div>
   );
};

export default InfoModal;
