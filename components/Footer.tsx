
import React from 'react';
import { Facebook, Instagram, Linkedin, Youtube, Heart, Glasses } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
  onProductClick: (destination?: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate, onProductClick }) => {
  return (
    <div className="border-t border-white/5 bg-[#050505] pt-20 pb-10">
       <footer className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
             {/* Column 1: Brand & Service Description ONLY */}
             <div className="col-span-2 md:col-span-1">
                <div className="flex items-center gap-2 mb-6 cursor-pointer" onClick={() => onNavigate('home')}>
                   <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <Glasses className="w-4 h-4 text-white" />
                   </div>
                   <span className="font-bold text-white text-lg">Photo Smart</span>
                </div>
                
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                   ООО «АСПРО». AI платформа для профессиональной генерации и редактирования изображений.
                </p>

                <div className="flex gap-4">
                   <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-all"><Facebook className="w-4 h-4" /></a>
                   <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-all"><Instagram className="w-4 h-4" /></a>
                   <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-all"><Youtube className="w-4 h-4" /></a>
                   <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-all"><Linkedin className="w-4 h-4" /></a>
                </div>
             </div>

             {/* Column 2: Product */}
             <div>
                <h4 className="font-bold text-white mb-6">Продукт</h4>
                <ul className="space-y-4 text-sm text-gray-400">
                   <li><button onClick={() => onProductClick('dashboard')} className="hover:text-purple-400 transition-colors text-left">AI Редактор</button></li>
                   <li><button onClick={() => onProductClick('dashboard')} className="hover:text-purple-400 transition-colors text-left">Шаблоны</button></li>
                   <li><button onClick={() => onProductClick('remove-bg')} className="hover:text-purple-400 transition-colors text-left">Удаление фона</button></li>
                   <li><button onClick={() => onProductClick('upscale')} className="hover:text-purple-400 transition-colors text-left">Upscale 4K</button></li>
                </ul>
             </div>

             {/* Column 3: Company */}
             <div>
                <h4 className="font-bold text-white mb-6">Компания</h4>
                <ul className="space-y-4 text-sm text-gray-400">
                   <li><button onClick={() => onNavigate('about')} className="hover:text-purple-400 transition-colors text-left">О нас</button></li>
                   <li><button onClick={() => onNavigate('blog')} className="hover:text-purple-400 transition-colors text-left">Блог</button></li>
                   <li><button onClick={() => onNavigate('careers')} className="hover:text-purple-400 transition-colors text-left">Вакансии</button></li>
                   <li><button onClick={() => onNavigate('pricing')} className="hover:text-purple-400 transition-colors text-left">Цены</button></li>
                   <li><button onClick={() => onNavigate('contacts')} className="hover:text-purple-400 transition-colors text-left">Контакты</button></li>
                </ul>
             </div>

             {/* Column 4: Resources */}
             <div>
                <h4 className="font-bold text-white mb-6">Ресурсы</h4>
                <ul className="space-y-4 text-sm text-gray-400">
                   <li><button className="hover:text-purple-400 transition-colors text-left">Гайды</button></li>
                   <li><button className="hover:text-purple-400 transition-colors text-left">API</button></li>
                   <li><button className="hover:text-purple-400 transition-colors text-left">Партнерам</button></li>
                </ul>
             </div>

             {/* Column 5: Support */}
             <div>
                <h4 className="font-bold text-white mb-6">Помощь</h4>
                <ul className="space-y-4 text-sm text-gray-400">
                   <li><button onClick={() => onNavigate('contacts')} className="hover:text-purple-400 transition-colors text-left">Центр поддержки</button></li>
                   <li><button onClick={() => onNavigate('terms')} className="hover:text-purple-400 transition-colors text-left">Пользовательское соглашение</button></li>
                   <li><button onClick={() => onNavigate('privacy')} className="hover:text-purple-400 transition-colors text-left">Конфиденциальность</button></li>
                   <li><button onClick={() => onNavigate('info-status')} className="hover:text-purple-400 transition-colors text-left flex items-center gap-2"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Статус</button></li>
                </ul>
             </div>
          </div>

          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
             <p>© 2025 Photo Smart (ООО «АСПРО»). Все права защищены.</p>
             <div className="flex items-center gap-2">
                <span>Сделано с</span>
                <Heart className="w-3 h-3 text-red-500 fill-red-500" />
                <span>в Москве</span>
             </div>
          </div>
       </footer>
    </div>
  );
};

export default Footer;
