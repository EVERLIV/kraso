
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import UserProfileModal from './UserProfileModal';
import Footer from './Footer';
import AboutPage from './pages/AboutPage';
import BlogPage from './pages/BlogPage';
import CareersPage from './pages/CareersPage';
import ContactPage from './pages/ContactPage';
import PricingPage from './pages/PricingPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import { 
  Sparkles, Zap, ArrowRight, Upload, Star, Heart, 
  CheckCircle2, Crown, Gem, Image as ImageIcon, Wand2,
  Play, Palette, Quote, ShoppingBag, Glasses, Menu, X
} from 'lucide-react';
import { InfoPageType } from './InfoModal';

interface LandingPageProps {
  onOpenInfo?: (page: InfoPageType) => void;
}

type PageRoute = 'home' | 'about' | 'blog' | 'careers' | 'contacts' | 'pricing' | 'terms' | 'privacy';

const LandingPage: React.FC<LandingPageProps> = ({ onOpenInfo }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'tet' | 'market'>('tet');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageRoute>('home');

  // Infinite marquee images
  const GALLERY_IMAGES = [
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80",
    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80"
  ];

  const handleOpenAuth = (destination?: string) => {
      if (destination) {
          localStorage.setItem('auth_redirect', destination);
      }
      setIsAuthOpen(true);
  };

  const navigateTo = (page: string) => {
      // Handle special info modal links
      if (page.startsWith('info-')) {
          const type = page.replace('info-', '') as InfoPageType;
          onOpenInfo?.(type);
          return;
      }
      
      setCurrentPage(page as PageRoute);
      window.scrollTo(0, 0);
  };

  const renderContent = () => {
      switch (currentPage) {
          case 'about': return <AboutPage />;
          case 'blog': return <BlogPage />;
          case 'careers': return <CareersPage />;
          case 'contacts': return <ContactPage />;
          case 'pricing': return <PricingPage onAuth={() => handleOpenAuth()} />;
          case 'terms': return <TermsPage />;
          case 'privacy': return <PrivacyPage />;
          default: return renderHome();
      }
  };

  const renderHome = () => (
      <>
        {/* Hero Section */}
      <div className="relative z-10">
        <div className="pt-32 pb-20 px-6">
            <div className="max-w-5xl mx-auto text-center">
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 hover:bg-white/10 transition-colors cursor-default">
                <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                </span>
                <span className="text-xs font-bold text-purple-200 uppercase tracking-widest">Photo Smart AI 2.0</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-700">
                AI Фоторедактор <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-red-400">
                Нового Поколения
                </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                Превратите обычные селфи в профессиональные фотосессии, новогодние открытки или кадры из роскошной жизни в один клик. Идеальное сохранение черт лица.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-200">
                <button 
                onClick={() => handleOpenAuth('dashboard')}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full font-bold text-lg text-white shadow-[0_0_40px_-10px_rgba(124,58,237,0.5)] hover:shadow-[0_0_60px_-10px_rgba(124,58,237,0.7)] hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                >
                <Wand2 className="w-5 h-5" />
                Создать фото
                </button>
                <button 
                onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 rounded-full font-bold text-lg text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                >
                <Play className="w-5 h-5 fill-white" />
                Смотреть примеры
                </button>
            </div>
            </div>
        </div>

        {/* STATS BAR */}
        <div className="border-y border-white/5 bg-white/[0.02] backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div className="space-y-1">
                    <h4 className="text-3xl font-bold text-white">1M+</h4>
                    <p className="text-sm text-gray-400">Генераций</p>
                </div>
                <div className="space-y-1">
                    <h4 className="text-3xl font-bold text-white">500k+</h4>
                    <p className="text-sm text-gray-400">Пользователей</p>
                </div>
                <div className="space-y-1">
                    <h4 className="text-3xl font-bold text-white">150+</h4>
                    <p className="text-sm text-gray-400">Шаблонов</p>
                </div>
                <div className="space-y-1">
                    <h4 className="text-3xl font-bold text-white flex items-center justify-center gap-1">4.9 <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /></h4>
                    <p className="text-sm text-gray-400">Рейтинг</p>
                </div>
            </div>
        </div>

        {/* TRANSFORMATION SHOWCASE */}
        <div id="demo" className="mt-24 px-6 max-w-6xl mx-auto">
           <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 max-w-4xl mx-auto leading-tight">Ваши фотографии — в новом свете</h2>
              <div className="flex justify-center gap-4 mt-8">
                 <button 
                   onClick={() => setActiveTab('tet')}
                   className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'tet' ? 'bg-red-600 text-white shadow-lg shadow-red-900/50' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                 >
                    🎄 Новый Год
                 </button>
                 <button 
                   onClick={() => setActiveTab('market')}
                   className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'market' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                 >
                    🛍️ Маркетплейсы
                 </button>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start bg-[#0F1218] border border-white/10 rounded-3xl p-6 md:p-10 relative overflow-hidden">
              <div className={`absolute top-0 right-0 w-[400px] h-[400px] rounded-full blur-[150px] opacity-20 pointer-events-none transition-colors duration-500 ${activeTab === 'tet' ? 'bg-red-600' : 'bg-blue-600'}`}></div>

              <div className="order-2 md:order-1 text-left space-y-6 relative z-10">
                 <h3 className="text-2xl md:text-3xl font-bold">
                    {activeTab === 'tet' ? 'Волшебство в каждом кадре' : 'Профессиональные карточки товаров'}
                 </h3>
                 <p className="text-gray-400 leading-relaxed">
                    {activeTab === 'tet' 
                       ? 'Превратите обычное селфи в сказочный новогодний портрет. Наш AI бережно сохраняет ваши черты лица, добавляя при этом студийный свет, праздничный декор и атмосферу уюта.' 
                       : 'Больше не нужно тратить тысячи на фотостудию. Загрузите фото товара на любом фоне, и AI Studio создаст идеальную композицию с 3D тенями и правильным светом.'
                    }
                 </p>
                 <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-sm text-gray-300">
                       <CheckCircle2 className={`w-5 h-5 ${activeTab === 'tet' ? 'text-red-500' : 'text-blue-500'}`} />
                       {activeTab === 'tet' ? '100% сходство с оригиналом' : 'Увеличение кликабельности (CTR)'}
                    </li>
                    <li className="flex items-center gap-3 text-sm text-gray-300">
                       <CheckCircle2 className={`w-5 h-5 ${activeTab === 'tet' ? 'text-red-500' : 'text-blue-500'}`} />
                       {activeTab === 'tet' ? 'Праздничные стили и костюмы' : 'Замена фона на профессиональный 3D'}
                    </li>
                    <li className="flex items-center gap-3 text-sm text-gray-300">
                       <CheckCircle2 className={`w-5 h-5 ${activeTab === 'tet' ? 'text-red-500' : 'text-blue-500'}`} />
                       Высокое разрешение для печати
                    </li>
                 </ul>
                 <button 
                   onClick={() => handleOpenAuth('dashboard')}
                   className={`mt-6 px-6 py-3 rounded-xl font-bold text-white flex items-center gap-2 transition-transform hover:scale-105 ${activeTab === 'tet' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                 >
                    Попробовать бесплатно <ArrowRight className="w-4 h-4" />
                 </button>
              </div>

              <div className="order-1 md:order-2 flex gap-4 relative h-[320px] md:h-[420px]">
                  <div className="w-1/2 h-full rounded-2xl overflow-hidden relative border border-white/10 group shadow-2xl">
                      <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur rounded text-[10px] font-bold text-white z-10 uppercase tracking-tighter">Оригинал</div>
                      <img 
                        src={activeTab === 'tet' 
                           ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80" 
                           : "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80"
                        }
                        className="w-full h-full object-cover filter brightness-[0.8] group-hover:brightness-100 transition-all duration-700" 
                        alt="Before" 
                      />
                  </div>

                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black rounded-full border-4 border-brand-bg flex items-center justify-center shadow-2xl">
                      <Sparkles className={`w-5 h-5 ${activeTab === 'tet' ? 'text-yellow-400' : 'text-blue-400'} animate-pulse`} />
                  </div>

                  <div className="w-1/2 h-full rounded-2xl overflow-hidden relative border border-white/20 shadow-[0_0_50px_-10px_rgba(0,0,0,0.5)]">
                      <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-bold text-white z-10 flex items-center gap-1.5 ${activeTab === 'tet' ? 'bg-red-600 shadow-lg shadow-red-900/50' : 'bg-blue-600 shadow-lg shadow-blue-900/50'}`}>
                         AI РЕЗУЛЬТАТ
                      </div>
                      <img 
                        src={activeTab === 'tet'
                           ? "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80"
                           : "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=400&q=80"
                        }
                        className="w-full h-full object-cover animate-in fade-in duration-1000" 
                        alt="After" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  </div>
              </div>
           </div>
        </div>

        {/* HOW IT WORKS */}
        <div id="how-it-works" className="mt-32 py-20 bg-[#0B0E14] relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"></div>
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Как это работает</h2>
                    <p className="text-gray-400">3 простых шага к идеальному фото</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="text-center group">
                        <div className="w-20 h-20 mx-auto bg-gray-800 rounded-2xl flex items-center justify-center mb-6 border border-gray-700 group-hover:border-purple-500 group-hover:bg-purple-500/10 transition-all duration-300">
                            <Upload className="w-8 h-8 text-gray-300 group-hover:text-purple-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">1. Загрузите фото</h3>
                        <p className="text-gray-400 text-sm px-4">Выберите четкое фото лица или товара с телефона.</p>
                    </div>

                    <div className="text-center group relative">
                        <div className="hidden md:block absolute top-10 -left-1/2 w-full h-0.5 bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
                        <div className="w-20 h-20 mx-auto bg-gray-800 rounded-2xl flex items-center justify-center mb-6 border border-gray-700 group-hover:border-blue-500 group-hover:bg-blue-500/10 transition-all duration-300 relative z-10">
                            <Palette className="w-8 h-8 text-gray-300 group-hover:text-blue-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">2. Выберите стиль</h3>
                        <p className="text-gray-400 text-sm px-4">Выберите шаблон: Бизнес, Праздники, Маркетплейс или введите свой промт.</p>
                    </div>

                    <div className="text-center group">
                        <div className="w-20 h-20 mx-auto bg-gray-800 rounded-2xl flex items-center justify-center mb-6 border border-gray-700 group-hover:border-green-500 group-hover:bg-green-500/10 transition-all duration-300">
                            <Wand2 className="w-8 h-8 text-gray-300 group-hover:text-green-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">3. Готово!</h3>
                        <p className="text-gray-400 text-sm px-4">AI обработает фото за 5 секунд. Скачивайте в HD качестве.</p>
                    </div>
                </div>
            </div>
        </div>

        {/* INFINITE GALLERY */}
        <div className="py-20 overflow-hidden relative bg-black">
             <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black to-transparent z-10"></div>
             <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black to-transparent z-10"></div>
             
             <div className="flex gap-4 animate-[scroll_40s_linear_infinite] w-max">
                 {[...GALLERY_IMAGES, ...GALLERY_IMAGES, ...GALLERY_IMAGES].map((src, i) => (
                     <div key={i} className="w-[200px] h-[300px] rounded-xl overflow-hidden border border-white/10 shrink-0">
                         <img src={src} className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" alt="Gallery" />
                     </div>
                 ))}
             </div>
        </div>

        {/* FEATURES GRID */}
        <div id="features" className="mt-20 max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
               <h2 className="text-3xl md:text-4xl font-bold mb-4">Наши Преимущества</h2>
               <p className="text-gray-400">Самый мощный набор AI инструментов</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="bg-[#0F1218] rounded-3xl p-8 border border-white/5 hover:border-purple-500/30 transition-all group">
                  <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                     <Wand2 className="w-7 h-7 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Умное редактирование</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                     Не нужен Photoshop. AI автоматически анализирует лицо, свет и композицию для создания идеального кадра.
                  </p>
               </div>

               <div className="bg-[#0F1218] rounded-3xl p-8 border border-white/5 hover:border-blue-500/30 transition-all group">
                  <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                     <ImageIcon className="w-7 h-7 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Сотни стилей</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                     Более 150 шаблонов: Бизнес портреты, Свадьба, Дети, Мода, E-commerce, Праздники...
                  </p>
               </div>

               <div className="bg-[#0F1218] rounded-3xl p-8 border border-white/5 hover:border-yellow-500/30 transition-all group">
                  <div className="w-14 h-14 bg-yellow-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                     <Zap className="w-7 h-7 text-yellow-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Молниеносно</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                     Всего 5-10 секунд на создание шедевра. Скачивайте в высоком разрешении, готовом для соцсетей.
                  </p>
               </div>
            </div>
        </div>

        {/* TESTIMONIALS */}
        <div className="mt-32 max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-16">Отзывы пользователей</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    {name: "Анна", role: "Блогер", text: "Photo Smart спас мой контент-план! Когда нужны красивые фото, а времени на съемку нет — это идеальное решение."},
                    {name: "Дмитрий", role: "Селлер", text: "Сделал карточки товара для Ozon за 5 минут. Продажи выросли, а сэкономил на дизайнере кучу денег."},
                    {name: "Елена", role: "Мама", text: "Функция с костюмами супергероев для детей — просто восторг! Сын в восторге от своих новых фото."}
                ].map((review, i) => (
                    <div key={i} className="bg-[#151921] p-6 rounded-2xl border border-white/5 relative">
                        <Quote className="absolute top-4 right-4 w-8 h-8 text-white/5" />
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 flex items-center justify-center font-bold">
                                {review.name[0]}
                            </div>
                            <div>
                                <h4 className="font-bold text-sm">{review.name}</h4>
                                <p className="text-xs text-gray-400">{review.role}</p>
                            </div>
                        </div>
                        <p className="text-gray-300 text-sm italic">"{review.text}"</p>
                        <div className="flex gap-1 mt-4">
                            {[1,2,3,4,5].map(s => <Star key={s} className="w-3 h-3 text-yellow-500 fill-yellow-500" />)}
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* FINAL CTA */}
        <div className="mt-32 px-6 pb-20">
             <div className="max-w-5xl mx-auto bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border border-white/10 rounded-3xl p-8 md:p-16 text-center relative overflow-hidden group">
                 <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                 <div className="relative z-10">
                     <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Готовы творить?</h2>
                     <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">Присоединяйтесь к 500,000+ пользователей и создавайте невероятные изображения уже сегодня. Бесплатно.</p>
                     <button 
                        onClick={() => handleOpenAuth('dashboard')}
                        className="px-10 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-100 hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                     >
                        Начать сейчас
                     </button>
                 </div>
             </div>
        </div>
      </div>
      </>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden selection:bg-purple-500 selection:text-white relative flex flex-col">
      
      <UserProfileModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        credits={0} 
        userTier="free"
      />

      {/* Background Gradients (Fixed) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-[8000ms]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-[10000ms]"></div>
      </div>

      {/* Header - Completely transparent and blended */}
      <header className="absolute top-0 inset-x-0 z-50 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto w-full pointer-events-auto">
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => navigateTo('home')}>
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform duration-300">
              <Glasses className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white drop-shadow-md">Photo Smart</span>
        </div>
        
        {/* Login Button */}
        <button 
          onClick={() => handleOpenAuth('dashboard')}
          className="px-6 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-bold hover:bg-white hover:text-black transition-all transform hover:scale-105 shadow-lg"
        >
          Войти
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative z-10">
          {renderContent()}
      </main>

      <Footer onNavigate={navigateTo} onProductClick={handleOpenAuth} />
      
      <style>{`
        @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
