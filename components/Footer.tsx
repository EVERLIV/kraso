import React from 'react';
import { Glasses, Heart, MapPin, Mail, Phone, Send } from 'lucide-react';

interface FooterProps {
   onNavigate: (page: string) => void;
   onProductClick: (destination?: string) => void;
}

interface FooterLink {
   label: string;
   onClick: () => void;
   badge?: string;
}

// VK / YouTube / Instagram have no lucide icons — inline SVG.
const VkIcon = () => (
   <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M13.16 16.46c-4.94 0-7.96-3.4-8.08-9.04h2.49c.08 4.13 1.96 5.9 3.4 6.26V7.42h2.36v3.53c1.4-.15 2.87-1.78 3.36-3.53h2.34c-.38 2.13-1.96 3.76-3.08 4.43 1.12.54 2.92 1.96 3.62 4.61h-2.58c-.54-1.74-1.88-3.08-3.66-3.26v3.26h-.57z" /></svg>
);
const YtIcon = () => (
   <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z" /></svg>
);
const IgIcon = () => (
   <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
);

const Footer: React.FC<FooterProps> = ({ onNavigate, onProductClick }) => {
   // Popular template categories (deep-link straight into the studio).
   const categories: FooterLink[] = [
      { label: 'Ретро Фото', onClick: () => onProductClick('dashboard') },
      { label: 'Свадьба', onClick: () => onProductClick('dashboard') },
      { label: 'Маркетплейсы', onClick: () => onProductClick('dashboard') },
      { label: 'Бизнес-портреты', onClick: () => onProductClick('dashboard') },
      { label: 'Мода и стиль', onClick: () => onProductClick('dashboard') },
      { label: 'Дети и семья', onClick: () => onProductClick('dashboard') },
   ];

   // Internal generation tools.
   const tools: FooterLink[] = [
      { label: 'AI Редактор', onClick: () => onProductClick('dashboard') },
      { label: 'Библиотека шаблонов', onClick: () => onProductClick('dashboard') },
      { label: 'ИИ-чат генерация', onClick: () => onProductClick('chat') },
      { label: 'Оживление фото', onClick: () => onProductClick('video'), badge: 'NEW' },
      { label: 'Удаление фона', onClick: () => onProductClick('dashboard') },
      { label: 'Апскейл HD', onClick: () => onProductClick('dashboard') },
   ];

   const company: FooterLink[] = [
      { label: 'О нас', onClick: () => onNavigate('about') },
      { label: 'Блог', onClick: () => onNavigate('blog') },
      { label: 'Тарифы', onClick: () => onNavigate('pricing') },
      { label: 'Вакансии', onClick: () => onNavigate('careers') },
      { label: 'Контакты', onClick: () => onNavigate('contacts') },
   ];

   const support: FooterLink[] = [
      { label: 'Центр поддержки', onClick: () => onNavigate('contacts') },
      { label: 'Пользовательское соглашение', onClick: () => onNavigate('terms') },
      { label: 'Конфиденциальность', onClick: () => onNavigate('privacy') },
   ];

   const socials = [
      { label: 'Telegram', href: '#', icon: <Send className="w-4 h-4" /> },
      { label: 'VK', href: '#', icon: <VkIcon /> },
      { label: 'YouTube', href: '#', icon: <YtIcon /> },
      { label: 'Instagram', href: '#', icon: <IgIcon /> },
   ];

   const renderColumn = (title: string, links: FooterLink[]) => (
      <div>
         <h4 className="font-bold text-ink mb-5 text-sm">{title}</h4>
         <ul className="space-y-3 text-sm text-ink-muted">
            {links.map(link => (
               <li key={link.label}>
                  <button onClick={link.onClick} className="text-left hover:text-primary transition-colors inline-flex items-center gap-2">
                     {link.label}
                     {link.badge && (
                        <span className="text-[8.5px] font-extrabold tracking-[0.05em] text-accent-pink bg-accent-pink-soft px-1.5 py-0.5 rounded-[5px]">{link.badge}</span>
                     )}
                  </button>
               </li>
            ))}
         </ul>
      </div>
   );

   return (
      <div className="border-t border-[var(--border-strong)] bg-card-light pt-16 pb-10">
         <footer className="max-w-shell mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-14">

               {/* Brand + contacts (spans 2 cols) */}
               <div className="col-span-2">
                  <div className="flex items-center gap-2.5 mb-5 cursor-pointer w-fit" onClick={() => onNavigate('home')}>
                     <div className="w-[34px] h-[34px] bg-brand-grad rounded-[10px] flex items-center justify-center shadow-[0_6px_16px_-6px_rgba(168,85,247,.5)]">
                        <Glasses className="w-[18px] h-[18px] text-white" />
                     </div>
                     <div className="flex items-center gap-2">
                        <span className="font-extrabold text-ink text-lg tracking-[-0.02em]">КрасоМир</span>
                        <span className="text-[9px] font-extrabold tracking-[0.08em] text-on-primary bg-ai-badge px-[5px] py-0.5 rounded-[5px]">AI</span>
                     </div>
                  </div>

                  <p className="text-ink-muted text-sm leading-relaxed mb-5 max-w-xs">
                     Умная фотостудия на нейросетях: 150+ стилей, генерация картинок ИИ, оживление фото в видео. Лицо сохраняется в каждом кадре.
                  </p>

                  {/* Contacts / address */}
                  <ul className="space-y-2.5 text-sm text-ink-body mb-6">
                     <li className="flex items-start gap-2.5">
                        <MapPin className="w-4 h-4 text-ink-faint mt-0.5 shrink-0" />
                        {/* TODO: заменить на точный адрес */}
                        <span>г. Москва, ул. Примерная, д. 1, офис 101</span>
                     </li>
                     <li className="flex items-center gap-2.5">
                        <Mail className="w-4 h-4 text-ink-faint shrink-0" />
                        <a href="mailto:support@smartphotos.ru" className="hover:text-primary transition-colors">support@smartphotos.ru</a>
                     </li>
                     <li className="flex items-center gap-2.5">
                        <Phone className="w-4 h-4 text-ink-faint shrink-0" />
                        {/* TODO: заменить на точный телефон */}
                        <a href="tel:+78001234567" className="hover:text-primary transition-colors">8 800 123-45-67</a>
                     </li>
                  </ul>

                  {/* Socials */}
                  <div className="flex gap-3">
                     {socials.map(s => (
                        <a
                           key={s.label}
                           href={s.href}
                           aria-label={s.label}
                           className="w-9 h-9 rounded-full bg-surface-muted flex items-center justify-center text-ink-muted hover:bg-primary-soft hover:text-primary transition-all"
                        >
                           {s.icon}
                        </a>
                     ))}
                  </div>
               </div>

               {renderColumn('Категории', categories)}
               {renderColumn('Инструменты', tools)}
               {renderColumn('Компания', company)}
               {renderColumn('Помощь', support)}
            </div>

            {/* Bottom bar */}
            <div className="border-t border-[var(--border-strong)] pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-ink-faint">
               <p>© 2026 КрасоМир («Два А — Цифровые Решения»). Все права защищены.</p>
               <div className="flex items-center gap-2">
                  <span>Сделано с</span>
                  <Heart className="w-3 h-3 text-red-500 fill-red-500" />
                  <span>в Иркутске</span>
               </div>
            </div>
         </footer>
      </div>
   );
};

export default Footer;
