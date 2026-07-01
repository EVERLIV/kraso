# SmartPhotos — UI/UX Design Export

Полный дизайн-контекст проекта для редизайна в Claude.
Стек: React 19 + Vite + Tailwind (CDN, конфиг инлайн в index.html).
Design tokens (CSS-переменные) и тема — в `<style>` внутри index.html.

Сгенерировано: 2026-06-27 19:23

## Файлы в этом экспорте
- `index.html` (111 строк)
- `components/DesignSystemView.tsx` (243 строк)
- `components/LandingPage.tsx` (460 строк)
- `components/Header.tsx` (137 строк)
- `components/Footer.tsx` (93 строк)
- `components/Sidebar.tsx` (465 строк)
- `components/ChatInterface.tsx` (387 строк)
- `components/ImageUploader.tsx` (217 строк)
- `components/Presets.tsx` (1 строк)
- `components/TemplateGrid.tsx` (2142 строк)
- `components/PricingModal.tsx` (213 строк)
- `components/UserProfileModal.tsx` (412 строк)
- `components/InfoModal.tsx` (198 строк)
- `components/ProfileSettings.tsx` (544 строк)
- `components/CookieConsent.tsx` (78 строк)
- `App.tsx` (1899 строк)

---

## `index.html`

```html
<!DOCTYPE html>
<html lang="ru">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
  <title>1 фото → 150+ стилей за минуту. Генерация картинок ИИ | SmartPhotos</title>
  <meta name="description" content="Загрузите одно фото — получите ретро, свадьбу, маркетплейс, портрет. Нейросеть сохраняет лицо. Оживление фото в видео. Бесплатный старт. Генерация картинок ИИ онлайн." />
  <meta name="keywords" content="генерация картинок ИИ, нейросеть для фото, стилизация фотографий, AI фоторедактор, оживление фото, ретро стиль, свадебные фото, карточки товаров, фото в стиле" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="https://smartphotos.ru/" />
  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://smartphotos.ru/" />
  <meta property="og:title" content="1 фото → 150+ стилей. Генерация картинок ИИ за минуту | SmartPhotos" />
  <meta property="og:description" content="Одно фото — ретро, свадьба, маркетплейс. Нейросеть сохраняет лицо. Оживите фото в видео. Попробуйте бесплатно." />
  <meta property="og:locale" content="ru_RU" />
  <meta property="og:site_name" content="SmartPhotos" />
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', 'sans-serif'],
          },
          colors: {
            // New Design System Colors
            primary: 'var(--primary)',
            'background-light': 'var(--bg-light)',
            'background-dark': 'var(--bg-dark)',
            'card-light': 'var(--card-light)',
            'card-dark': 'var(--card-dark)',
            'accent-purple': 'var(--accent-purple)',
            
            // Legacy Brand Mapping (for compatibility)
            brand: {
              bg: 'var(--bg-light)',
              sidebar: 'var(--bg-light)',
              card: 'var(--card-light)',
              accent: 'var(--primary)',
              hover: 'var(--primary-hover)',
              text: '#0f172a',
              muted: '#64748b',
              border: 'var(--border-color)'
            }
          },
          borderRadius: {
            DEFAULT: 'var(--radius-default)',
            'lg': 'var(--radius-lg)',
            'xl': 'var(--radius-xl)',
          }
        }
      }
    }
  </script>
  <style>
    :root {
      --primary: #4B7CFE;
      --primary-hover: #3b6ae6;
      --bg-light: #F9FAFB;
      --bg-dark: #0F172A;
      --card-light: #FFFFFF;
      --card-dark: #1E293B;
      --accent-purple: #F3E8FF;
      --border-color: #e2e8f0;
      
      --radius-default: 12px;
      --radius-lg: 16px;
      --radius-xl: 24px;
    }

    body {
      background-color: var(--bg-light);
      color: #0f172a;
      font-family: 'Inter', sans-serif;
      transition: background-color 0.3s ease, color 0.3s ease;
    }

    .dark {
      --bg-light: #0F172A;
      --card-light: #1E293B;
      --border-color: #1e293b;
    }

    /* Custom scrollbar */
    ::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }

    ::-webkit-scrollbar-track {
      background: #f1f5f9;
    }

    ::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 3px;
    }

    ::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/index.tsx"></script>
</body>
</html>```

## `components/DesignSystemView.tsx`

```tsx

import React, { useState } from 'react';
import {
    Cloud, Moon, Sun, Type, Palette, MousePointer2,
    Layout, Search, Bell, Info, Database, Layers, Wallet,
    Check, Filter, Plus, X, Laptop, Smartphone, Tablet,
    ChevronRight, Settings, Maximize2, Download, SlidersHorizontal, Sparkles, LayoutGrid
} from 'lucide-react';

const DesignSystemView: React.FC = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    return (
        <div className={`flex-1 overflow-y-auto custom-scrollbar transition-colors duration-300 ${isDarkMode ? 'dark bg-slate-950' : 'bg-slate-50'}`}>
            {/* Design System Header */}
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                        <Cloud className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="font-bold text-xl text-slate-900 dark:text-white">Cloud UI Kit</h1>
                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Design System v1.5</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                        <button className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><Laptop className="w-4 h-4" /></button>
                        <button className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><Tablet className="w-4 h-4" /></button>
                        <button className="p-2 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"><Smartphone className="w-4 h-4" /></button>
                    </div>
                    <button
                        className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:scale-110 active:scale-95 transition-all"
                        onClick={() => setIsDarkMode(!isDarkMode)}
                    >
                        {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
                    </button>
                </div>
            </header>

            <main className="max-w-4xl mx-auto p-8 space-y-16 pb-32">

                {/* 1. Typography */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
                        <Type className="w-5 h-5 text-primary" />
                        <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">Typography</h2>
                    </div>
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-[20px] shadow-sm space-y-6">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider">Display H1</p>
                            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Cloud Console AI</h1>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider">Heading H2</p>
                            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Service Management</h2>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider">Small Caps / Label</p>
                            <h3 className="text-xs font-bold text-primary uppercase tracking-[0.2em]">Directory Services</h3>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider">Body copy</p>
                            <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg font-sans">
                                The platform allows you to manage cloud resources efficiently with modern UI patterns. Built on Inter font family for maximum legibility.
                            </p>
                        </div>
                    </div>
                </section>

                {/* 2. Color Palette */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
                        <Palette className="w-5 h-5 text-primary" />
                        <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">Colors</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { name: 'Primary', hex: '#4B7CFE', class: 'bg-primary' },
                            { name: 'Dark Bg', hex: '#0F172A', class: 'bg-slate-900 shadow-inner border border-white/10' },
                            { name: 'Accent', hex: '#F3E8FF', class: 'bg-purple-100 dark:bg-purple-900/30' },
                            { name: 'Success', hex: '#10B981', class: 'bg-emerald-500' },
                        ].map(color => (
                            <div key={color.name} className="space-y-2 group">
                                <div className={`h-24 ${color.class} rounded-2xl shadow-sm transition-transform group-hover:scale-[1.02]`}></div>
                                <div className="px-1">
                                    <span className="text-xs font-bold text-slate-900 dark:text-white block">{color.name}</span>
                                    <span className="text-[10px] font-mono text-slate-400 uppercase">{color.hex}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 3. Buttons */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
                        <MousePointer2 className="w-5 h-5 text-primary" />
                        <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">Buttons & Interactive</h2>
                    </div>
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-[20px] space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button className="bg-primary hover:bg-blue-600 text-white font-bold py-2.5 px-4 rounded-lg transition-all active:scale-95 shadow-lg shadow-primary/20 text-sm">
                                Primary Action
                            </button>
                            <button className="bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-bold py-2.5 px-4 rounded-lg transition-all active:scale-95 text-sm">
                                Secondary Action
                            </button>
                            <button className="border-2 border-slate-200 dark:border-slate-800 bg-transparent text-slate-600 dark:text-slate-400 font-bold py-2.5 px-4 rounded-lg transition-all hover:bg-slate-50 dark:hover:bg-slate-800 text-sm">
                                Tertiary Outline
                            </button>
                            <div className="flex gap-2">
                                <button className="flex-1 bg-slate-100 dark:bg-slate-800 p-3 rounded-lg flex items-center justify-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                                    <Plus className="w-4 h-4" />
                                    <span className="text-sm font-bold">Create</span>
                                </button>
                                <button className="flex-1 bg-slate-100 dark:bg-slate-800 p-3 rounded-lg flex items-center justify-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                                    <Filter className="w-4 h-4" />
                                    <span className="text-sm font-bold">Filter</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. Form Elements */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
                        <SlidersHorizontal className="w-5 h-5 text-primary" />
                        <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">Controls</h2>
                    </div>
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-[20px] space-y-5">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                                placeholder="Search resources..."
                                type="text"
                            />
                        </div>

                        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800/50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                                    <Bell className="w-4 h-4 text-primary" />
                                </div>
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">System Notifications</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input checked className="sr-only peer" type="checkbox" readOnly />
                                <div className="w-12 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                            </label>
                        </div>
                    </div>
                </section>

                {/* 5. Cards & Layout */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
                        <Layout className="w-5 h-5 text-primary" />
                        <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">Components & Cards</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Resource Card */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-[24px] shadow-sm border border-slate-100 dark:border-slate-800 group hover:border-primary/30 transition-all">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center rounded-2xl group-hover:scale-110 transition-transform">
                                    <Database className="w-6 h-6 text-primary" />
                                </div>
                                <span className="text-[10px] font-bold text-emerald-500 uppercase bg-emerald-50 dark:bg-emerald-950 px-2 py-1 rounded-lg">Active</span>
                            </div>
                            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1">PostgreSQL DB</h4>
                            <p className="text-xs text-slate-400 mb-6">cluster-prod-01 (3 Nodes)</p>
                            <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div className="w-3/4 h-full bg-primary rounded-full shadow-[0_0_8px_rgba(75,124,254,0.5)]"></div>
                            </div>
                        </div>

                        {/* Function Card */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-[24px] shadow-sm border border-slate-100 dark:border-slate-800 group hover:border-purple-300 transition-all">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center rounded-2xl group-hover:scale-110 transition-transform">
                                    <Layers className="w-6 h-6 text-purple-600" />
                                </div>
                                <div className="flex -space-x-2">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800"></div>
                                    ))}
                                </div>
                            </div>
                            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Edge Cache</h4>
                            <p className="text-xs text-slate-400 mb-6">12 Serverless triggers</p>
                            <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div className="w-1/4 h-full bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.5)]"></div>
                            </div>
                        </div>
                    </div>

                    {/* Banner */}
                    <div className="bg-purple-600 dark:bg-purple-700/80 p-6 rounded-[24px] relative overflow-hidden text-white shadow-2xl">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-400/20 rounded-full blur-3xl"></div>
                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                            <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-md">
                                <Sparkles className="w-8 h-8 text-white" />
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <h3 className="text-xl font-bold mb-1">Try our new AI Studio</h3>
                                <p className="text-purple-100 text-sm">We've reimagined how you interact with your cloud resources using GPT Vision.</p>
                            </div>
                            <button className="px-6 py-3 bg-white text-purple-600 font-bold rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl">
                                Switch Now
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            {/* iOS Navigation Simulation */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-2xl border-t border-slate-200 dark:border-slate-800 px-8 py-4 flex justify-between items-center z-50 rounded-t-[32px] md:hidden">
                <div className="flex flex-col items-center gap-1 text-primary">
                    <LayoutGrid className="w-6 h-6" />
                    <span className="text-[10px] font-bold">Status</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-slate-400">
                    <Database className="w-6 h-6" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Cloud</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-slate-400">
                    <Bell className="w-6 h-6" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Alerts</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-slate-400">
                    <Settings className="w-6 h-6" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Setup</span>
                </div>
            </nav>
        </div>
    );
};

export default DesignSystemView;
```

## `components/LandingPage.tsx`

```tsx

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

const pathToPage = (path: string): PageRoute => {
    const p = path.replace(/\/$/, '') || '/';
    if (p === '/privacy') return 'privacy';
    if (p === '/terms') return 'terms';
    return 'home';
};

const LandingPage: React.FC<LandingPageProps> = ({ onOpenInfo }) => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'fashion' | 'animate' | 'market'>('fashion');
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState<PageRoute>(() => pathToPage(typeof window !== 'undefined' ? window.location.pathname : '/'));

    // Sync currentPage with URL on browser back/forward (for /privacy, /terms)
    useEffect(() => {
        const onPopState = () => setCurrentPage(pathToPage(window.location.pathname));
        window.addEventListener('popstate', onPopState);
        return () => window.removeEventListener('popstate', onPopState);
    }, []);

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
        if (page.startsWith('info-')) {
            const type = page.replace('info-', '') as InfoPageType;
            onOpenInfo?.(type);
            return;
        }
        const route = page as PageRoute;
        setCurrentPage(route);
        window.scrollTo(0, 0);
        if (route === 'privacy' || route === 'terms') {
            window.history.pushState({}, '', `/${route}`);
        }
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
                            <span className="text-xs font-bold text-purple-200 uppercase tracking-widest">Генерация картинок ИИ за 5 сек</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-700">
                            Одно фото — <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-red-400">
                                150+ стилей за минуту
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                            Генерация картинок ИИ: ретро, свадьба, маркетплейс, портреты. Нейросеть сохраняет ваше лицо. Оживите фото в видео — без монтажа. Попробуйте бесплатно.
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
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 max-w-4xl mx-auto leading-tight">Как одно селфи превращается в ретро, свадьбу и карточку товара</h2>
                        <div className="flex justify-center gap-4 mt-8 flex-wrap">
                            <button
                                onClick={() => setActiveTab('fashion')}
                                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'fashion' ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/50' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                            >
                                👗 Мода и Стиль
                            </button>
                            <button
                                onClick={() => setActiveTab('animate')}
                                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'animate' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                            >
                                ✨ Оживление фото
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
                        <div className={`absolute top-0 right-0 w-[400px] h-[400px] rounded-full blur-[150px] opacity-20 pointer-events-none transition-colors duration-500 ${activeTab === 'fashion' ? 'bg-purple-600' : activeTab === 'animate' ? 'bg-indigo-600' : 'bg-blue-600'}`}></div>

                        <div className="order-2 md:order-1 text-left space-y-6 relative z-10">
                            <h3 className="text-2xl md:text-3xl font-bold">
                                {activeTab === 'fashion' ? 'Высокая мода у вас дома' : activeTab === 'animate' ? 'Ваши фото оживают' : 'Профессиональные карточки товаров'}
                            </h3>
                            <p className="text-gray-400 leading-relaxed">
                                {activeTab === 'fashion'
                                    ? 'Превратите обычное селфи в профессиональный модельный кадр. Наш AI подберет идеальный наряд, макияж и освещение, сохраняя вашу индивидуальность.'
                                    : activeTab === 'animate'
                                        ? 'Добавьте жизни вашим снимкам. AI превращает статичные фотографии в реалистичные видео с естественными движениями, эмоциями и динамическим окружением.'
                                        : 'Больше не нужно тратить тысячи на фотостудию. Загрузите фото товара на любом фоне, и AI Studio создаст идеальную композицию с 3D тенями и правильным светом.'
                                }
                            </p>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-3 text-sm text-gray-300">
                                    <CheckCircle2 className={`w-5 h-5 ${activeTab === 'fashion' ? 'text-purple-500' : activeTab === 'animate' ? 'text-indigo-500' : 'text-blue-500'}`} />
                                    {activeTab === 'fashion' ? 'Трендовые образы и луки' : activeTab === 'animate' ? 'Плавная анимация 4K' : 'Увеличение кликабельности (CTR)'}
                                </li>
                                <li className="flex items-center gap-3 text-sm text-gray-300">
                                    <CheckCircle2 className={`w-5 h-5 ${activeTab === 'fashion' ? 'text-purple-500' : activeTab === 'animate' ? 'text-indigo-500' : 'text-blue-500'}`} />
                                    {activeTab === 'fashion' ? 'Студийная ретушь кожи' : activeTab === 'animate' ? 'Естественная мимика лица' : 'Замена фона на профессиональный 3D'}
                                </li>
                                <li className="flex items-center gap-3 text-sm text-gray-300">
                                    <CheckCircle2 className={`w-5 h-5 ${activeTab === 'fashion' ? 'text-purple-500' : activeTab === 'animate' ? 'text-indigo-500' : 'text-blue-500'}`} />
                                    {activeTab === 'animate' ? 'Готово для Reels и TikTok' : 'Высокое разрешение для печати'}
                                </li>
                            </ul>
                            <button
                                onClick={() => handleOpenAuth('dashboard')}
                                className={`mt-6 px-6 py-3 rounded-xl font-bold text-white flex items-center gap-2 transition-transform hover:scale-105 ${activeTab === 'fashion' ? 'bg-purple-600 hover:bg-purple-700' : activeTab === 'animate' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                            >
                                Попробовать бесплатно <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="order-1 md:order-2 flex gap-4 relative h-[320px] md:h-[420px]">
                            <div className="w-1/2 h-full rounded-2xl overflow-hidden relative border border-white/10 group shadow-2xl">
                                <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur rounded text-[10px] font-bold text-white z-10 uppercase tracking-tighter">Оригинал</div>
                                <img
                                    src={activeTab === 'fashion'
                                        ? "/main/main_before.jpeg"
                                        : activeTab === 'animate'
                                            ? "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80"
                                            : "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80"
                                    }
                                    className="w-full h-full object-cover filter brightness-[0.8] group-hover:brightness-100 transition-all duration-700"
                                    alt="Before"
                                />
                            </div>

                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black rounded-full border-4 border-brand-bg flex items-center justify-center shadow-2xl">
                                <Sparkles className={`w-5 h-5 ${activeTab === 'fashion' ? 'text-purple-400' : activeTab === 'animate' ? 'text-indigo-400' : 'text-blue-400'} animate-pulse`} />
                            </div>

                            <div className="w-1/2 h-full rounded-2xl overflow-hidden relative border border-white/20 shadow-[0_0_50px_-10px_rgba(0,0,0,0.5)]">
                                <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-bold text-white z-10 flex items-center gap-1.5 ${activeTab === 'fashion' ? 'bg-purple-600 shadow-lg shadow-purple-900/50' : activeTab === 'animate' ? 'bg-indigo-600 shadow-lg shadow-indigo-900/50' : 'bg-blue-600 shadow-lg shadow-blue-900/50'}`}>
                                    AI РЕЗУЛЬТАТ
                                </div>
                                <img
                                    src={activeTab === 'fashion'
                                        ? "/main/main_after.jpeg"
                                        : activeTab === 'animate'
                                            ? "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80"
                                            : "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=400&q=80"
                                    }
                                    className={`w-full h-full object-cover animate-in fade-in duration-1000 ${activeTab === 'animate' ? 'grayscale brightness-[1.2]' : ''}`}
                                    alt="After"
                                />
                                {activeTab === 'animate' && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 animate-pulse">
                                            <Play className="w-8 h-8 text-white fill-white ml-1" />
                                        </div>
                                    </div>
                                )}
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
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Загрузили фото — получили 150 стилей. За 3 шага</h2>
                            <p className="text-gray-400">Без монтажа и Photoshop. Генерация картинок ИИ за секунды</p>
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
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Почему 500 000+ уже создают фото здесь</h2>
                        <p className="text-gray-400">Нейросеть сохраняет лицо. 150+ шаблонов. Оживление фото в видео</p>
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
                    <h2 className="text-3xl font-bold text-center mb-16">Что говорят те, кто уже попробовал</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { name: "Анна", role: "Блогер", text: "Photo Smart спас мой контент-план! Когда нужны красивые фото, а времени на съемку нет — это идеальное решение." },
                            { name: "Дмитрий", role: "Селлер", text: "Сделал карточки товара для Ozon за 5 минут. Продажи выросли, а сэкономил на дизайнере кучу денег." },
                            { name: "Елена", role: "Мама", text: "Функция с костюмами супергероев для детей — просто восторг! Сын в восторге от своих новых фото." }
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
                                    {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-3 h-3 text-yellow-500 fill-yellow-500" />)}
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
                            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Попробуйте бесплатно. Без карты</h2>
                            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">500 000+ уже создают фото за минуту. Загрузите одно фото — получите ретро, свадьбу, маркетплейс. Генерация картинок ИИ онлайн.</p>
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
```

## `components/Header.tsx`

```tsx

import React, { useState } from 'react';
import { Search, Bell, Zap, Menu, ChevronDown, MessageSquare, Sparkles, Glasses, ArrowLeft } from 'lucide-react';
import PricingModal from './PricingModal'; // Import pricing
import { SubscriptionTier } from '../types';

interface HeaderProps {
  toggleSidebar: () => void;
  credits: number;
  onOpenProfile: () => void;
  userTier: SubscriptionTier;
  /** На мобильном в режиме чата/оживления показывать «Назад» вместо меню */
  showBackOnMobile?: boolean;
  onBack?: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, credits, onOpenProfile, userTier, showBackOnMobile, onBack }) => {
  const [showPricing, setShowPricing] = useState(false);

  // Tier display names
  const TIER_LABELS: Record<SubscriptionTier, string> = {
    'free': 'Free',
    'creator': 'Creator',
    'pro': 'Pro',
    'business': 'Business'
  };

  // Debug logging (remove after testing)
  console.log('Header userTier:', userTier);


  return (
    <>
      <PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} onSuccess={() => { }} currentTier={userTier} />

      <header className="h-16 bg-[#0B0E14] dark:bg-background-dark border-b border-white/5 dark:border-slate-800 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-40 text-brand-text shrink-0 relative overflow-hidden transition-colors duration-300">

        {/* Festive Glow */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>

        <div className="flex items-center gap-4 relative z-10">
          {showBackOnMobile ? (
            <button
              onClick={onBack}
              className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Назад"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 text-brand-muted hover:text-white transition-colors"
              aria-label="Меню"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          {/* Logo Area - Photo Smart Style */}
          <div className="flex items-center gap-3 select-none cursor-pointer group">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20 ring-1 ring-white/10 group-hover:scale-105 transition-transform duration-300 relative overflow-hidden">
              {/* Glossy Effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-50"></div>
              <Glasses className="w-6 h-6 text-white relative z-10 drop-shadow-md" />
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-lg leading-none tracking-tight font-sans drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] group-hover:text-purple-200 transition-colors duration-300">Photo Smart</span>
                <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded bg-gradient-to-r from-blue-500 to-purple-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
                  AI
                </span>
              </div>
              <span className="text-[10px] text-brand-muted font-medium tracking-wide">
                Умный редактор
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-5">
          {/* Desktop Helper Icons */}
          <div className="hidden md:flex items-center gap-1">
            <button className="p-2 text-brand-muted hover:text-white hover:bg-white/5 rounded-full transition-colors relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
            </button>
          </div>

          <div className="h-6 w-px bg-white/10 hidden md:block"></div>

          {/* Credits Badge */}
          <div
            onClick={() => setShowPricing(true)}
            className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full shadow-sm hover:bg-white/10 transition-colors cursor-pointer group"
          >
            <div className="bg-yellow-500/20 p-1 rounded-full group-hover:bg-yellow-500/30 transition-colors">
              <Zap className="w-3 h-3 text-yellow-400" fill="currentColor" />
            </div>
            <span className="text-xs font-bold text-white tabular-nums">
              {credits} <span className="text-brand-muted font-normal ml-0.5">кр.</span>
            </span>
          </div>


          {/* Tariff Button (Desktop) - Shows actual user tier */}
          <button
            onClick={() => setShowPricing(true)}
            className={`hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow-lg active:scale-95 ${userTier === 'free'
              ? 'bg-gray-600 hover:bg-gray-700 text-white shadow-gray-900/20'
              : userTier === 'creator'
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-900/20'
                : userTier === 'business'
                  ? 'bg-yellow-600 hover:bg-yellow-700 text-white shadow-yellow-900/20'
                  : 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-900/20'
              }`}
          >
            <span>Тариф {TIER_LABELS[userTier]}</span>
          </button>

          {/* User Avatar */}
          <button
            className="flex items-center gap-2 pl-2 cursor-pointer hover:opacity-90 transition-opacity"
            onClick={onOpenProfile}
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-[1px] ring-2 ring-black border border-white/20 shadow-lg relative">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="w-full h-full rounded-full bg-[#151921]" />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[#0B0E14] rounded-full"></div>
            </div>
          </button>
        </div>
      </header>
    </>
  );
};

export default Header;
```

## `components/Footer.tsx`

```tsx

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
                     <li><button onClick={() => onProductClick('chat')} className="hover:text-purple-400 transition-colors text-left">ИИ чат создание картинок</button></li>
                     <li><button onClick={() => onProductClick('video')} className="hover:text-purple-400 transition-colors text-left">Оживление фото</button></li>
                  </ul>
               </div>

               {/* Column 3: Company */}
               <div>
                  <h4 className="font-bold text-white mb-6">Компания</h4>
                  <ul className="space-y-4 text-sm text-gray-400">
                     <li><button onClick={() => onNavigate('about')} className="hover:text-purple-400 transition-colors text-left">О нас</button></li>
                     <li><button onClick={() => onNavigate('blog')} className="hover:text-purple-400 transition-colors text-left">Блог</button></li>
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
                     <li><a href="/terms" onClick={(e) => { e.preventDefault(); onNavigate('terms'); }} className="hover:text-purple-400 transition-colors text-left block">Пользовательское соглашение</a></li>
                     <li><a href="/privacy" onClick={(e) => { e.preventDefault(); onNavigate('privacy'); }} className="hover:text-purple-400 transition-colors text-left block">Конфиденциальность</a></li>
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
```

## `components/Sidebar.tsx`

```tsx

import React from 'react';
import {
  PanelLeftClose,
  PanelLeftOpen,
  Zap,
  X,
  MessageSquare,
  LayoutDashboard,
  ScanEye,
  Eraser,
  Wand2,
  Settings,
  Video,
  Sliders,
  Cloud,
  ImagePlus,
  Layers,
  Bot
} from 'lucide-react';
import { CategoryId, ViewMode, SubscriptionTier, AspectRatio, GenModelId } from '../types';

export interface CategoryItem {
  id: CategoryId;
  label: string;
  icon: any;
  badge?: string;
}

export interface ChatSettings {
  quality: 'low' | 'medium' | 'high';
  format: 'jpeg' | 'png';
  aspectRatio: AspectRatio;
  model: GenModelId;
  setModel: (m: GenModelId) => void;
  setQuality: (q: 'low' | 'medium' | 'high') => void;
  setFormat: (f: 'jpeg' | 'png') => void;
  setAspectRatio: (r: AspectRatio) => void;
  // Shared Input State
  prompt: string;
  setPrompt: (p: string) => void;
  attachedImages: string[];
  setAttachedImages: (imgs: string[]) => void;
  isGenerating: boolean;
  onGenerate: () => void;
  triggerFileSelect: () => void;
}

export interface VideoSettings {
  duration: '5' | '10';
  aspectRatio: '16:9' | '9:16' | '1:1';
  negativePrompt: string;
  cfgScale: number;
  setDuration: (d: '5' | '10') => void;
  setAspectRatio: (r: '16:9' | '9:16' | '1:1') => void;
  setNegativePrompt: (p: string) => void;
  setCfgScale: (s: number) => void;
}


interface SidebarProps {
  categories: CategoryItem[];
  activeCategory: CategoryId;
  onSelectCategory: (id: CategoryId) => void;
  isCollapsed: boolean;
  toggleCollapse: () => void;
  credits: number;
  userTier: SubscriptionTier;
  isOpen?: boolean;
  onClose?: () => void;
  currentView: ViewMode;
  onChangeView: (view: ViewMode) => void;
  chatSettings?: ChatSettings;
  videoSettings?: VideoSettings;
}

const TIER_LIMITS: Record<SubscriptionTier, number> = {
  'free': 5,
  'creator': 100,
  'pro': 500,
  'business': 2000
};

const Sidebar: React.FC<SidebarProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
  isCollapsed,
  toggleCollapse,
  credits,
  userTier,
  isOpen = false,
  onClose,
  currentView,
  onChangeView,
  chatSettings,
  videoSettings
}) => {
  const maxCredits = TIER_LIMITS[userTier] || 5;
  const creditPercentage = Math.min((credits / maxCredits) * 100, 100);

  const NavItem = ({ view, icon: Icon, label, badge, colorClass }: { view: ViewMode, icon: any, label: string, badge?: string, colorClass?: string }) => (
    <button
      onClick={() => { onChangeView(view); onClose?.(); }}
      className={`
          w-full flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group/btn
          ${currentView === view
          ? 'bg-brand-card text-brand-text border border-brand-border shadow-sm'
          : 'text-brand-muted hover:text-brand-text hover:bg-gray-200 border border-transparent'}
          ${isCollapsed ? 'justify-center' : 'justify-start gap-3'}
        `}
      title={label}
    >
      <div className={`w-5 h-5 shrink-0 flex items-center justify-center ${currentView === view ? colorClass : ''}`}>
        <Icon className="w-5 h-5" />
      </div>
      {!isCollapsed && (
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-sm font-medium truncate">{label}</span>
          {badge && (
            <span className="text-[9px] font-bold bg-brand-accent/20 text-brand-accent px-1.5 py-0.5 rounded uppercase tracking-wider ml-auto">
              {badge}
            </span>
          )}
        </div>
      )}
    </button>
  );

  const renderSidebarContent = (collapsed: boolean) => (
    <div className="flex flex-col h-full bg-brand-sidebar text-brand-muted">
      {/* Feature Navigation */}
      <div className="px-2 pt-4 pb-2 space-y-1 shrink-0">
        <NavItem
          view="dashboard"
          icon={LayoutDashboard}
          label="Студия"
        />

        <NavItem
          view="chat"
          icon={MessageSquare}
          label="AI Studio"
          badge="PRO"
          colorClass="text-purple-400"
        />

        <NavItem
          view="video"
          icon={Video}
          label="Оживить Фото"
          badge="NEW"
          colorClass="text-pink-400"
        />

        <NavItem
          view="profile"
          icon={Settings}
          label="Настройки"
        />


      </div>

      <div className="h-px bg-brand-border/50 mx-4 my-2 shrink-0"></div>

      {/* Categories (Only show if in Dashboard mode) */}
      {currentView === 'dashboard' && (
        <div className="flex-1 overflow-y-auto custom-scrollbar px-2 space-y-1 pb-4 min-h-0">
          {!collapsed && <p className="px-3 py-2 text-[10px] font-bold text-brand-muted uppercase tracking-wider">Шаблоны</p>}
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { onSelectCategory(cat.id); onClose?.(); }}
              title={collapsed ? cat.label : undefined}
              className={`
                   w-full flex items-center px-3 py-2 rounded-lg transition-all duration-200 group/btn relative
                   ${activeCategory === cat.id
                  ? 'bg-white shadow-sm border border-brand-border text-brand-text'
                  : 'text-brand-muted hover:text-brand-text hover:bg-gray-200'}
                   ${collapsed ? 'justify-center' : 'justify-between'}
                 `}
            >
              <div className={`flex items-center ${collapsed ? 'justify-center w-full' : 'gap-3'} overflow-hidden`}>
                <cat.icon className={`w-4 h-4 shrink-0 ${activeCategory === cat.id ? 'text-brand-accent' : 'text-brand-muted group-hover/btn:text-brand-text'}`} />

                {!collapsed && (
                  <span className="text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                    {cat.label}
                  </span>
                )}
              </div>

              {!collapsed && cat.badge && (
                <span className="text-[9px] font-bold bg-brand-accent/20 text-brand-accent px-1.5 py-0.5 rounded uppercase tracking-wider ml-2 shrink-0">
                  {cat.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Settings / Banner Area */}
      {currentView !== 'dashboard' && (
        <div className={`flex-1 overflow-y-auto p-4 ${collapsed ? 'px-2' : ''}`}>

          {/* Chat Settings */}
          {currentView === 'chat' && chatSettings && !collapsed && (
            <div className="space-y-6 animate-in fade-in slide-in-from-left-2 duration-300">
              <div className="flex items-center gap-2 mb-4">
                <Sliders className="w-4 h-4 text-purple-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Параметры</span>
              </div>

              {/* Model Selector */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Модель Нейросети</label>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => chatSettings.setModel('gemini-2.5-flash-image')}
                    className={`flex items-center gap-3 p-2 rounded-xl border transition-all text-left ${chatSettings.model === 'gemini-2.5-flash-image' ? 'bg-purple-50 border-purple-200 ring-1 ring-purple-100' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${chatSettings.model === 'gemini-2.5-flash-image' ? 'bg-purple-500 text-white' : 'bg-gray-100 text-slate-400'}`}>
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-700">Gemini Flash 2.5</div>
                      <div className="text-[9px] text-slate-400">Быстро • Креативно</div>
                    </div>
                  </button>

                  <button
                    onClick={() => chatSettings.setModel('nano-banana-v1')}
                    className={`flex items-center gap-3 p-2 rounded-xl border transition-all text-left ${chatSettings.model === 'nano-banana-v1' ? 'bg-yellow-50 border-yellow-200 ring-1 ring-yellow-100' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${chatSettings.model === 'nano-banana-v1' ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-slate-400'}`}>
                      <Bot className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-700">Nano Banana v1</div>
                      <div className="text-[9px] text-slate-400">Точно • Реализм</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Aspect Ratio */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Формат</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['1:1', '16:9', '9:16'] as const).map(ratio => (
                    <button
                      key={ratio}
                      onClick={() => chatSettings.setAspectRatio(ratio)}
                      className={`px-1 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${chatSettings.aspectRatio === ratio ? 'bg-purple-600 text-white border-purple-600' : 'bg-white border-gray-200 text-slate-500 hover:bg-gray-50'}`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quality */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase flex justify-between">
                  Качество
                  <span className="text-[9px] text-purple-600 bg-purple-100 px-1 rounded">{chatSettings.quality === 'high' ? '$$$' : chatSettings.quality === 'medium' ? '$$' : '$'}</span>
                </label>
                <div className="flex p-0.5 bg-gray-200 rounded-lg">
                  {(['low', 'medium', 'high'] as const).map((q) => (
                    <button
                      key={q}
                      onClick={() => chatSettings.setQuality(q)}
                      className={`flex-1 py-1 text-[10px] font-bold capitalize rounded-md transition-all ${chatSettings.quality === q ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

            </div >
          )}

          {/* Video Settings */}
          {
            currentView === 'video' && videoSettings && !collapsed && (
              <div className="space-y-6 animate-in fade-in slide-in-from-left-2 duration-300">
                <div className="flex items-center gap-2 mb-4">
                  <Sliders className="w-4 h-4 text-pink-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Параметры</span>
                </div>

                {/* Duration */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Длительность</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => videoSettings.setDuration('5')}
                      className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all ${videoSettings.duration === '5' ? 'bg-white text-pink-600 shadow-sm border border-pink-200' : 'text-slate-500 hover:text-slate-700 border border-transparent bg-gray-100'}`}
                    >
                      5 сек
                    </button>
                    <button
                      onClick={() => videoSettings.setDuration('10')}
                      className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all ${videoSettings.duration === '10' ? 'bg-white text-pink-600 shadow-sm border border-pink-200' : 'text-slate-500 hover:text-slate-700 border border-transparent bg-gray-100'}`}
                    >
                      10 сек
                    </button>
                  </div>
                </div>

                {/* Aspect Ratio */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Формат</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => videoSettings.setAspectRatio('16:9')}
                      className={`px-1 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${videoSettings.aspectRatio === '16:9' ? 'bg-pink-600 text-white border-pink-600' : 'bg-white border-gray-200 text-slate-500 hover:bg-gray-50'}`}
                    >
                      16:9
                    </button>
                    <button
                      onClick={() => videoSettings.setAspectRatio('1:1')}
                      className={`px-1 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${videoSettings.aspectRatio === '1:1' ? 'bg-pink-600 text-white border-pink-600' : 'bg-white border-gray-200 text-slate-500 hover:bg-gray-50'}`}
                    >
                      1:1
                    </button>
                    <button
                      onClick={() => videoSettings.setAspectRatio('9:16')}
                      className={`px-1 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${videoSettings.aspectRatio === '9:16' ? 'bg-pink-600 text-white border-pink-600' : 'bg-white border-gray-200 text-slate-500 hover:bg-gray-50'}`}
                    >
                      9:16
                    </button>
                  </div>
                </div>

                {/* CFG Scale */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">CFG Scale</label>
                    <span className="text-[9px] font-mono text-pink-600 bg-pink-100 px-1.5 py-0.5 rounded">{videoSettings.cfgScale.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={videoSettings.cfgScale}
                    onChange={(e) => videoSettings.setCfgScale(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-600"
                  />
                  <div className="flex justify-between text-[9px] text-slate-400">
                    <span>Креативно</span>
                    <span>Точно</span>
                  </div>
                </div>

                {/* Negative Prompt */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Negative Prompt</label>
                  <textarea
                    value={videoSettings.negativePrompt}
                    onChange={(e) => videoSettings.setNegativePrompt(e.target.value)}
                    placeholder="blur, distort..."
                    className="w-full px-2 py-1.5 text-[10px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-pink-500 resize-none bg-white"
                    rows={2}
                  />
                </div>
              </div>
            )
          }

          {/* Banner for other views (or if collapsed, or if setting not visible) */}
          {
            (!['chat', 'video'].includes(currentView) || collapsed) && (
              collapsed ? (
                <div className="flex justify-center mt-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xs shadow-lg">
                    PRO
                  </div>
                </div>
              ) : (
                <div className="mt-4 rounded-xl overflow-hidden relative group cursor-pointer shadow-lg hidden xl:block">
                  <img
                    src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80"
                    className="w-full aspect-[4/5] object-cover group-hover:scale-110 transition-transform duration-700"
                    alt="Pro Banner"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
                    <span className="text-[10px] font-bold text-yellow-400 uppercase tracking-wider mb-1">Coming Soon</span>
                    <h4 className="text-white font-bold text-sm leading-tight">Подписка PRO Plus</h4>
                    <p className="text-[10px] text-white/70 mt-1">Больше кредитов и 4K видео.</p>
                  </div>
                </div>
              )
            )
          }

        </div >
      )}

      {/* Footer Toggle */}
      <div className="p-3 border-t border-brand-border/50 bg-brand-sidebar shrink-0 flex flex-col gap-3 mt-auto">
        {!collapsed && (
          <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-brand-border rounded-xl p-3 group">
            <div className="flex justify-between items-center mb-2">
              <p className="text-xs text-brand-muted">Кредиты</p>
              <Zap className="w-3 h-3 text-yellow-500" fill="currentColor" />
            </div>

            <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden mb-1 ring-1 ring-black/5">
              <div
                className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 transition-all duration-500"
                style={{ width: `${creditPercentage}%` }}
              ></div>
            </div>
            <p className="text-[10px] text-right text-brand-muted opacity-70 font-mono">
              {credits} кр.
            </p>
          </div>
        )}

        <div className={`flex items-center ${collapsed ? 'flex-col gap-2' : 'justify-between'}`}>

          <button
            onClick={toggleCollapse}
            className="p-2 text-brand-muted hover:text-brand-text hover:bg-gray-200 rounded-lg transition-colors"
            title={collapsed ? "Развернуть" : "Свернуть"}
          >
            {collapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div >
  );

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      <div className={`fixed inset-0 z-[70] lg:hidden transition-all duration-300 ${isOpen ? 'visible' : 'invisible'}`}>
        <div className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={onClose} />
        <aside className={`absolute top-0 bottom-0 left-0 w-72 bg-brand-sidebar border-r border-brand-border flex flex-col shadow-2xl transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="h-16 flex items-center justify-between px-4 border-b border-brand-border shrink-0">
            <span className="font-bold text-brand-text text-lg">Меню</span>
            <button onClick={onClose} className="p-2 text-brand-muted hover:text-brand-text hover:bg-gray-200 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          {renderSidebarContent(false)}
        </aside>
      </div>

      {/* Desktop Sidebar - STATIC LAYOUT (No Fixed positioning) */}
      <aside
        className={`hidden lg:flex flex-col shrink-0 border-r border-brand-border transition-all duration-300 ease-in-out bg-brand-sidebar ${isCollapsed ? 'w-16' : 'w-64'}`}
      >
        {renderSidebarContent(isCollapsed)}
      </aside>
    </>
  );
};

export default Sidebar;
```

## `components/ChatInterface.tsx`

```tsx

import React, { useRef, useEffect, useState } from 'react';
import {
    Bot, Download, Maximize, X, Loader2, User, Sparkles, Send, ImagePlus, Zap, Heart,
    Info, ChevronDown, ChevronUp, Sliders, Cpu
} from 'lucide-react';
import { GeneratedImage, GenModelId, AspectRatio } from '../types';

interface ChatInterfaceProps {
    credits: number;
    userId?: string;
    onOpenPricing: () => void;
    settings: {
        quality: 'low' | 'medium' | 'high';
        format: 'jpeg' | 'png';
        aspectRatio: AspectRatio;
        model?: GenModelId;
        setModel?: (m: GenModelId) => void;
        setQuality?: (q: 'low' | 'medium' | 'high') => void;
        setFormat?: (f: 'jpeg' | 'png') => void;
        setAspectRatio?: (r: AspectRatio) => void;
    };
    prompt: string;
    setPrompt: (p: string) => void;
    attachedImages: string[];
    setAttachedImages: (imgs: string[]) => void;
    isGenerating: boolean;
    historyData: GeneratedImage[];
    onGenerate: () => void;
    triggerFileSelect: () => void;
    onToggleSave: (id: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
    credits,
    userId,
    onOpenPricing,
    settings,
    prompt,
    setPrompt,
    attachedImages,
    setAttachedImages,
    isGenerating,
    historyData,
    onGenerate,
    triggerFileSelect,
    onToggleSave
}) => {
    const chatEndRef = useRef<HTMLDivElement>(null);
    const [viewingImage, setViewingImage] = useState<string | null>(null);
    const [infoExpanded, setInfoExpanded] = useState(true);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const settingsRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom when history changes or generation starts
    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [historyData, isGenerating]);

    return (
        <div className="flex flex-col h-full w-full bg-brand-bg relative overflow-hidden font-sans min-h-0">
            {/* Main Stream Area — на мобильном больше отступ снизу под инпут в стиле чата */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-4 md:py-10 md:px-10 space-y-12 pb-[5.5rem] md:pb-36 min-h-0">
                {/* Инструкции — всегда сверху */}
                <div className="max-w-2xl mx-auto">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 md:w-14 md:h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center shrink-0 border border-purple-500/20">
                            <Bot className="w-6 h-6 md:w-7 md:h-7 text-purple-500" />
                        </div>
                        <div>
                            <h2 className="text-lg md:text-xl font-bold text-slate-800">AI Studio: Генерация изображений</h2>
                            <p className="text-slate-600 text-xs md:text-sm max-w-md">
                                Текст + референс — нейросеть сохранит лицо/интерьер/продукт и дорисует сцену.
                            </p>
                        </div>
                    </div>
                    <div className="bg-white/80 backdrop-blur border border-slate-200 rounded-[24px] shadow-sm overflow-hidden text-left">
                        <button
                            onClick={() => setInfoExpanded(!infoExpanded)}
                            className="w-full flex items-center justify-between gap-3 px-5 py-3 text-slate-800 hover:bg-slate-50/80 transition-colors"
                            aria-expanded={infoExpanded ? "true" : "false"}
                        >
                            <span className="flex items-center gap-2 font-semibold text-sm">
                                <Info className="w-4 h-4 text-purple-500" />
                                Как пользоваться
                            </span>
                            {infoExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                        </button>
                        {infoExpanded && (
                            <div className="px-5 pb-5 pt-0 space-y-4 border-t border-slate-100">
                                <div className="flex gap-3 pt-4">
                                    <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 font-bold text-sm">1</div>
                                    <div>
                                        <p className="font-medium text-slate-800 text-sm">Опишите картинку</p>
                                        <p className="text-slate-500 text-xs mt-0.5">Например: «Портрет в стиле ретро, мягкий свет» или «Комната с окном на закат».</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 font-bold text-sm">2</div>
                                    <div>
                                        <p className="font-medium text-slate-800 text-sm">Добавьте референс (по желанию)</p>
                                        <p className="text-slate-500 text-xs mt-0.5">Кнопка с иконкой фото — загрузите лицо, интерьер или продукт.</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 font-bold text-sm">3</div>
                                    <div>
                                        <p className="font-medium text-slate-800 text-sm">Нажмите «Отправить»</p>
                                        <p className="text-slate-500 text-xs mt-0.5">Генерация займёт несколько секунд. Скачать или в избранное.</p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2 pt-2">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
                                        <Sliders className="w-3 h-3" /> «Интенсивность» в настройках
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-medium">
                                        <Zap className="w-3 h-3" /> 15 кредитов за изображение
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* История генераций */}
                <div className="max-w-4xl mx-auto space-y-10">
                        {historyData.map((item, idx) => (
                            <div key={item.id || idx} className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                                {/* USER MESSAGE */}
                                <div className="flex justify-end gap-3">
                                    <div className="flex flex-col items-end gap-2 max-w-[85%]">
                                        <div className="bg-slate-900 text-white rounded-[24px] rounded-tr-[4px] p-4 shadow-xl border border-slate-800">
                                            <div className="flex flex-col gap-4">
                                                {item.original && (
                                                    <div className="relative group w-48 aspect-square rounded-xl overflow-hidden border border-white/10 shadow-lg">
                                                        <img src={item.original} className="w-full h-full object-cover" />
                                                    </div>
                                                )}
                                                <p className="text-sm font-medium leading-relaxed">{item.prompt || "Запрос изображения"}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 px-1">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Вы</span>
                                            <div className="w-7 h-7 rounded-full bg-slate-200 border border-white shadow-sm flex items-center justify-center">
                                                <User className="w-3.5 h-3.5 text-slate-500" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* AI RESPONSE */}
                                <div className="flex justify-start gap-3">
                                    <div className="flex flex-col items-start gap-2 max-w-[95%] w-full">
                                        <div className="flex items-center gap-2 px-1">
                                            <div className="w-7 h-7 rounded-full bg-purple-600 border border-purple-400 shadow-md flex items-center justify-center">
                                                <Sparkles className="w-3.5 h-3.5 text-white" />
                                            </div>
                                            <span className="text-[10px] font-bold text-purple-600 uppercase tracking-widest">GPT Image 1.5</span>
                                        </div>

                                        {item.generated ? (
                                            <div className="w-full bg-white border border-slate-100 rounded-[28px] rounded-tl-[4px] p-3 shadow-xl group/card relative overflow-hidden max-w-fit">
                                                <div className="relative rounded-2xl overflow-hidden bg-slate-50 shadow-inner ring-1 ring-black/5 group/img">
                                                    <img
                                                        src={item.generated}
                                                        alt="AI Result"
                                                        className="max-w-full md:max-w-2xl max-h-[600px] object-contain cursor-zoom-in transition-transform group-hover/img:scale-[1.01]"
                                                        onClick={() => setViewingImage(item.generated)}
                                                        onError={(e) => {
                                                            console.warn("Failed to load chat image:", item.id, item.generated?.substring(0, 50));
                                                            const parent = e.currentTarget.parentElement?.parentElement;
                                                            if (parent) {
                                                                parent.innerHTML = '<div class="p-4 text-center text-slate-500 text-sm">Ошибка загрузки изображения</div>';
                                                            }
                                                        }}
                                                    />
                                                    <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/5 transition-colors flex items-center justify-center pointer-events-none">
                                                        <Maximize className="text-white opacity-0 group-hover/img:opacity-100 w-8 h-8 drop-shadow-lg" />
                                                    </div>

                                                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover/img:opacity-100 transition-all translate-x-2 group-hover/img:translate-x-0">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                if (item.id) onToggleSave(item.id);
                                                            }}
                                                            className={`h-9 w-9 flex items-center justify-center rounded-full bg-white shadow-lg border border-slate-100 hover:scale-110 transition-all ${item.isSaved ? 'text-red-500' : 'text-slate-600 hover:text-red-500'}`}
                                                            title={item.isSaved ? "Убрать из избранного" : "В избранное"}
                                                        >
                                                            <Heart className={`w-4 h-4 ${item.isSaved ? 'fill-red-500' : ''}`} />
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                const link = document.createElement('a');
                                                                link.href = item.generated!;
                                                                link.download = `photo-smart-${Date.now()}.jpg`;
                                                                link.click();
                                                            }}
                                                            className="h-9 w-9 flex items-center justify-center rounded-full bg-white shadow-lg border border-slate-100 text-slate-600 hover:text-purple-600 hover:scale-110 transition-all"
                                                        >
                                                            <Download className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : isGenerating && idx === 0 ? (
                                            <div className="bg-white border border-slate-100 rounded-[20px] rounded-tl-[4px] px-6 py-4 flex items-center gap-4 w-fit shadow-md">
                                                <div className="flex gap-1.5">
                                                    <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce [animation-duration:0.6s]"></div>
                                                    <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce [animation-duration:0.6s] [animation-delay:-0.2s]"></div>
                                                    <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce [animation-duration:0.6s] [animation-delay:-0.4s]"></div>
                                                </div>
                                                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Создаю шедевр...</span>
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div ref={chatEndRef} className="h-4" />
                </div>
            </div>

            {/* Float Input Bar — на мобильном фиксирован снизу в стиле Telegram */}
            <div ref={settingsRef} className="flex justify-center w-full px-3 md:px-8 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:pb-8 md:pt-4 md:absolute md:bottom-0 inset-x-0 md:bg-gradient-to-t md:from-brand-bg md:via-brand-bg/80 md:to-transparent pointer-events-none z-30 fixed bottom-0 left-0 right-0 md:relative md:pointer-events-none">
                <div className="relative w-full max-w-4xl">
                    {/* Компактные настройки — поповер над инпутом */}
                    {settingsOpen && (settings.setModel || settings.setAspectRatio || settings.setQuality || settings.setFormat) && (
                        <>
                            <div className="absolute inset-0 -top-2 bottom-full z-10 pointer-events-auto" aria-hidden="true" onClick={() => setSettingsOpen(false)} />
                            <div className="absolute bottom-full left-0 right-0 mb-2 z-20 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 space-y-3 max-h-[70vh] overflow-y-auto pointer-events-auto">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                    <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5"><Sliders className="w-3.5 h-3.5 text-purple-500" /> Параметры</span>
                                    <button type="button" onClick={() => setSettingsOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"><X className="w-4 h-4" /></button>
                                </div>
                                {settings.setModel && (
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">Модель</p>
                                        <div className="flex gap-1.5">
                                            {([
                                                { id: 'gemini-2.5-flash-image' as GenModelId, label: 'Flash', icon: Zap },
                                                { id: 'gemini-3-pro-image-preview' as GenModelId, label: 'Pro', icon: Cpu },
                                                { id: 'nano-banana-v1' as GenModelId, label: 'Nano', icon: Bot },
                                            ]).map(m => (
                                                <button key={m.id} onClick={() => { settings.setModel?.(m.id); }} className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${settings.model === m.id ? 'bg-purple-100 border-purple-300 text-purple-700' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                                                    <m.icon className="w-3 h-3" /> {m.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {settings.setAspectRatio && (
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">Формат</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {(['1:1', '4:5', '9:16', '16:9'] as AspectRatio[]).map(r => (
                                                <button key={r} onClick={() => settings.setAspectRatio?.(r)} className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-all ${settings.aspectRatio === r ? 'bg-purple-600 text-white border-purple-600' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>{r}</button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {settings.setQuality && (
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">Качество</p>
                                        <div className="flex gap-1 p-1 bg-slate-100 rounded-lg">
                                            {(['low', 'medium', 'high'] as const).map(q => (
                                                <button key={q} onClick={() => settings.setQuality?.(q)} className={`flex-1 py-1 text-[10px] font-bold rounded-md transition-all ${settings.quality === q ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-500'}`}>{q === 'low' ? 'Низ' : q === 'medium' ? 'Сред' : 'Выс'}</button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {settings.setFormat && (
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">Файл</p>
                                        <div className="flex gap-1.5">
                                            <button onClick={() => settings.setFormat?.('jpeg')} className={`flex-1 py-1 rounded-lg text-[10px] font-bold border ${settings.format === 'jpeg' ? 'bg-purple-100 border-purple-300 text-purple-700' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>JPEG</button>
                                            <button onClick={() => settings.setFormat?.('png')} className={`flex-1 py-1 rounded-lg text-[10px] font-bold border ${settings.format === 'png' ? 'bg-purple-100 border-purple-300 text-purple-700' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>PNG</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                <div className="bg-white md:bg-white/90 backdrop-blur-xl border border-slate-200 shadow-[0_-2px_12px_rgba(0,0,0,0.06)] md:shadow-2xl rounded-2xl md:rounded-[32px] p-2.5 md:p-3 flex items-center gap-2 md:gap-3 w-full pointer-events-auto ring-0 md:ring-1 ring-black/5 transition-all focus-within:ring-2 focus-within:ring-purple-400/30 md:focus-within:ring-4 md:focus-within:ring-purple-500/5 focus-within:border-purple-300 md:focus-within:border-purple-200">
                    <button
                        onClick={triggerFileSelect}
                        className={`p-3 md:p-4 rounded-xl md:rounded-[22px] transition-all relative shrink-0 ${attachedImages.length > 0 ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-500 hover:text-purple-600 hover:bg-purple-50'}`}
                        aria-label="Прикрепить фото"
                    >
                        <ImagePlus className="w-5 h-5 md:w-6 md:h-6" />
                        {attachedImages.length > 0 && (
                            <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-purple-600 text-white rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                                <X className="w-2.5 h-2.5 cursor-pointer" onClick={(e) => { e.stopPropagation(); setAttachedImages([]); }} />
                            </div>
                        )}
                    </button>

                    {(settings.setModel || settings.setAspectRatio || settings.setQuality || settings.setFormat) && (
                        <button
                            type="button"
                            onClick={() => setSettingsOpen(!settingsOpen)}
                            className={`p-2.5 md:p-3 rounded-xl md:rounded-[22px] transition-all shrink-0 ${settingsOpen ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-500 hover:text-purple-600 hover:bg-purple-50'}`}
                            aria-label="Параметры"
                            title="Параметры"
                        >
                            <Sliders className="w-5 h-5 md:w-6 md:h-6" />
                        </button>
                    )}

                    <div className="flex-1 flex flex-col px-1 min-w-0">
                        <input
                            type="text"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && onGenerate()}
                            placeholder="Сообщение"
                            className="bg-transparent border-none outline-none text-slate-900 placeholder-slate-400 font-medium md:font-bold text-sm h-11 md:h-12"
                        />
                    </div>

                    <button
                        onClick={onGenerate}
                        disabled={isGenerating || (!prompt.trim() && attachedImages.length === 0)}
                        className="h-11 w-11 md:h-14 md:w-14 bg-[#2AABEE] hover:bg-[#229ED9] md:bg-slate-900 md:hover:bg-black text-white rounded-full md:rounded-[22px] flex items-center justify-center transition-all active:scale-95 disabled:opacity-50 shrink-0"
                        aria-label="Отправить"
                    >
                        {isGenerating ? (
                            <Loader2 className="w-5 h-5 md:w-5 md:h-5 animate-spin" />
                        ) : (
                            <Send className="w-5 h-5 md:w-5 md:h-5 rotate-0" />
                        )}
                    </button>

                    <div className="hidden md:flex flex-col items-center pl-2 pr-1 border-l border-slate-100 h-10 justify-center">
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 rounded-full border border-amber-100 text-amber-700">
                            <Zap className="w-3 h-3 fill-amber-500 text-amber-500" />
                            <span className="text-[10px] font-bold">15</span>
                        </div>
                    </div>
                </div>
                </div>
            </div>

            {/* FULLSCREEN IMAGE MODAL */}
            {viewingImage && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/95 backdrop-blur-md p-4 md:p-10 animate-in fade-in duration-300" onClick={() => setViewingImage(null)}>
                    <div className="relative max-w-full max-h-full flex flex-col items-center gap-6" onClick={e => e.stopPropagation()}>
                        <div className="relative group">
                            <img src={viewingImage} className="max-w-[90vw] max-h-[80vh] object-contain rounded-2xl shadow-2xl border-4 border-white" />
                            <button
                                className="absolute -top-12 right-0 p-2 text-white/50 hover:text-white transition-colors"
                                onClick={() => setViewingImage(null)}
                            >
                                <X className="w-8 h-8" />
                            </button>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => {
                                    const link = document.createElement('a');
                                    link.href = viewingImage;
                                    link.download = `photo-smart-${Date.now()}.jpg`;
                                    link.click();
                                }}
                                className="flex items-center gap-3 px-8 py-4 bg-white text-slate-900 rounded-2xl font-bold shadow-2xl hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all"
                            >
                                <Download className="w-5 h-5" /> Скачать оригинал
                            </button>
                            <button
                                onClick={() => setViewingImage(null)}
                                className="px-8 py-4 bg-white/10 text-white rounded-2xl font-bold backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all font-bold"
                            >
                                Закрыть
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatInterface;
```

## `components/ImageUploader.tsx`

```tsx

import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon, Plus } from 'lucide-react';

interface ImageUploaderProps {
  currentImage: string | null;
  onImageUpload: (base64: string) => void;
  onClear: () => void;
  disabled: boolean;
  variant?: 'default' | 'compact';
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  currentImage,
  onImageUpload,
  onClear,
  disabled,
  variant = 'default'
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, загрузите изображение (JPG, PNG).');
      return;
    }

    // Gemini API natively supports: image/png, image/jpeg, image/webp, image/heic, image/heif
    // AVIF is commonly used but NOT supported by Gemini API yet.
    const apiSupportedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];

    // If the file type is supported by the API, use it directly.
    // HEIC is supported by API but difficult to convert in browser, so we pass it raw.
    if (apiSupportedTypes.includes(file.type)) {
      readFileRaw(file);
    } else {
      // Try to convert unsupported types (like AVIF) to JPEG using canvas
      convertToJpeg(file);
    }
  };

  const readFileRaw = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onImageUpload(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const convertToJpeg = (file: File) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Draw white background to handle transparency correctly when converting to JPEG
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        // Convert to JPEG
        const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
        onImageUpload(dataUrl);
      } else {
        // Fallback to raw if canvas fails
        readFileRaw(file);
      }
      URL.revokeObjectURL(url);
    };

    img.onerror = () => {
      // Fallback if browser cannot load image (e.g. really obscure format)
      URL.revokeObjectURL(url);
      readFileRaw(file);
    };

    img.src = url;
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const triggerUpload = () => fileInputRef.current?.click();

  // --- COMPACT VARIANT (Mobile) ---
  if (variant === 'compact') {
    if (currentImage) {
      return (
        <div className="flex items-center gap-3 bg-brand-card border border-brand-border rounded-lg p-2 relative group">
          <div className="w-10 h-10 rounded overflow-hidden bg-black shrink-0 border border-white/10">
            <img src={currentImage} alt="Ref" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-white font-medium truncate">Фото загружено</p>
            <p className="text-[10px] text-brand-muted">Нажмите X для удаления</p>
          </div>
          {!disabled && (
            <button
              onClick={(e) => { e.stopPropagation(); onClear(); }}
              className="p-1.5 bg-white/5 hover:bg-red-500/20 text-brand-muted hover:text-red-400 rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      );
    }

    return (
      <div
        onClick={triggerUpload}
        className="flex items-center gap-3 bg-brand-card/50 border border-brand-border border-dashed rounded-lg p-2 cursor-pointer hover:bg-brand-card transition-colors active:scale-[0.98]"
      >
        <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center shrink-0">
          <Plus className="w-4 h-4 text-brand-muted" />
        </div>
        <div className="flex-1 text-left">
          <p className="text-xs text-brand-muted font-medium">Добавить фото</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled}
        />
      </div>
    );
  }

  // --- DEFAULT VARIANT (Desktop) ---
  if (currentImage) {
    return (
      <div className="relative w-full aspect-square bg-black/40 rounded-lg overflow-hidden border border-brand-border group shadow-lg">
        <img
          src={currentImage}
          alt="Reference"
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
        />
        {!disabled && (
          <button
            onClick={(e) => { e.stopPropagation(); onClear(); }}
            className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-500/90 text-white rounded-full transition-all backdrop-blur-sm opacity-0 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0"
            title="Удалить"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className={`
        relative w-full aspect-square rounded-xl border border-dashed flex flex-col items-center justify-center transition-all duration-300 cursor-pointer group overflow-hidden
        ${dragActive ? 'border-brand-accent bg-brand-accent/10 scale-[0.98]' : 'border-brand-border/50 bg-brand-card/20 hover:border-brand-accent/50 hover:bg-brand-card/50 hover:shadow-2xl hover:shadow-brand-accent/5'}
        ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
      `}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={triggerUpload}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />

      {/* Decorative gradient blob */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/0 via-brand-accent/0 to-brand-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="relative z-10 w-12 h-12 rounded-full bg-brand-bg border border-brand-border flex items-center justify-center mb-3 text-brand-muted group-hover:text-brand-accent group-hover:border-brand-accent/50 group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-brand-accent/20">
        <Plus className="w-5 h-5" />
      </div>
      <p className="relative z-10 text-xs text-brand-muted font-medium group-hover:text-brand-accent transition-colors duration-300">Загрузить фото</p>
      <p className="relative z-10 text-[10px] text-brand-muted/50 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">Перетащите сюда</p>
    </div>
  );
};

export default ImageUploader;
```

## `components/Presets.tsx`

```tsx
// This file is deprecated and can be deleted.
// Presets are now handled in TemplateGrid.tsx```

## `components/TemplateGrid.tsx`

```tsx

import React from 'react';
import { Preset, CategoryId } from '../types';
import { Sparkles, ArrowRight } from 'lucide-react';

interface TemplateGridProps {
  category: CategoryId;
  onSelect: (preset: Preset) => void;
}

// Fallback images map in case generation fails
const FALLBACK_IMAGES: Record<string, string> = {
  formula1: 'https://images.unsplash.com/photo-1574786198875-49f5d09fd272?auto=format&fit=crop&w=400&q=60',
  retro: 'https://images.unsplash.com/photo-1495707902641-75cac588d2e9?auto=format&fit=crop&w=400&q=60',
  tet: 'https://images.unsplash.com/photo-1548625361-1eb84c9f6d1d?auto=format&fit=crop&w=400&q=60',
  wedding: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=60',
  family: 'https://images.unsplash.com/photo-1609220136736-443140cffec6?auto=format&fit=crop&w=400&q=60',
  kids: 'https://images.unsplash.com/photo-1519456264917-42d0aa2e0625?auto=format&fit=crop&w=400&q=60',
  documents: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=60',
  ecommerce: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=60',
  fashion: 'https://images.unsplash.com/photo-1509631179647-b849389274e9?auto=format&fit=crop&w=400&q=60',
  makeup: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=400&q=60',
  business: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=60',
  ugc: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?auto=format&fit=crop&w=400&q=60',
  bloggers: 'https://images.unsplash.com/photo-1478737270239-2f02b77ac6d5?auto=format&fit=crop&w=400&q=60',
  rich_life: 'https://images.unsplash.com/photo-1559523161-0fc0d8b3c6b7?auto=format&fit=crop&w=400&q=60',
  restaurants: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=60',
  marketplaces: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=60',
  sports: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=400&q=60',
  dating: 'https://images.unsplash.com/photo-1516585427167-9f4af9627e6c?auto=format&fit=crop&w=400&q=60',
  pranks: 'https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?auto=format&fit=crop&w=400&q=60',
  style_trends: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=400&q=60',
  business_print: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=400&q=60',
  default: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=60'
};

// Helper to generate safe, encoded URLs for AI previews
const getPreviewUrl = (prompt: string, seed: number) => {
  const encodedPrompt = encodeURIComponent(prompt);
  // Reverting to image.pollinations.ai (Legacy/Stable) as per user request to "make it as before".
  // This endpoint often overrides rate limits or caches better for public usage.
  return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=400&height=500&seed=${seed}&nologo=true&model=turbo&v=5`;
};

// Data source for all templates with specific visual descriptions for previews
export const ALL_PRESETS: Preset[] = [
  // --- MARKETPLACES & SOCIAL ADS (UPDATED PROMPTS FOR BETTER PRODUCT PLACEMENT) ---
  {
    id: 'market-shopee-hero',
    category: 'marketplaces',
    title: 'Маркетплейс (Подиум)',
    description: '3D презентация товара',
    prompt: 'Show the product from the input image standing prominently on a 3D podium in the center. Vibrant orange and yellow gradient background with flying 3D percent symbols, coins, and confetti. CRUCIAL: Preserve the product appearance exactly as in the original photo. Commercial studio lighting, 8k resolution, e-commerce sale style.',
    image: '/templates/market-shopee-hero.jpg'
  },
  {
    id: 'market-fb-minimal',
    category: 'marketplaces',
    title: 'Facebook Реклама',
    description: 'Минимализм',
    prompt: 'Show the product from the input image placed on a clean minimalist surface. Soft pastel background colors (beige or sage green). Hard sunlight shadows (gobolight effect) of palm leaves falling on the product. CRUCIAL: Keep the product exactly identical. High-end lifestyle vibe.',
    image: '/templates/market-fb-minimal.jpg'
  },
  {
    id: 'market-insta-story',
    category: 'marketplaces',
    title: 'Instagram Stories',
    description: 'POV в руке',
    prompt: 'First-person POV shot. Show a hand holding the product from the input image against a blurred aesthetic coffee shop or city street background. CRUCIAL: Preserve the product exactly. Natural lighting, authentic influencer vibe, vertical composition.',
    image: '/templates/market-insta-story.jpg'
  },
  {
    id: 'market-cosmetic-water',
    category: 'marketplaces',
    title: 'Косметика (Luxury)',
    description: 'Текстура воды/шелка',
    prompt: 'Show the product from the input image floating in crystal clear water ripples or flowing silk texture. Soft pink or gold tones. Bokeh sparkles. CRUCIAL: Preserve the product appearance exactly. Fresh, hydrating, premium look. Commercial photography.',
    image: '/templates/market-cosmetic-water.jpg'
  },
  {
    id: 'market-tech-neon',
    category: 'marketplaces',
    title: 'Техно Неон',
    description: 'Cyberpunk & Игры',
    prompt: 'Show the product from the input image placed in a futuristic dark mode setting. Glowing neon blue and purple rim lighting on the product. Circuit board patterns or abstract geometric 3D shapes floating. CRUCIAL: Preserve the product exactly. Sleek, modern, high-tech vibe.',
    image: '/templates/market-tech-neon.jpg'
  },
  {
    id: 'market-food-splash',
    category: 'marketplaces',
    title: 'Еда и Напитки',
    description: 'Свежесть и брызги',
    prompt: 'Show the product from the input image surrounded by a fresh water or milk splash. Flying fresh fruits (lemon, strawberry, mint leaves) in the air around the product. CRUCIAL: Preserve the product exactly. Bright, energetic, juicy atmosphere. Solid bright color background.',
    image: '/templates/market-food-splash.jpg'
  },
  {
    id: 'market-glassmorphism',
    category: 'marketplaces',
    title: 'Стекломорфизм',
    description: 'Современный UI фон',
    prompt: 'Show the product from the input image floating in front of frosted glass panels. Soft, multi-colored gradient orbs floating behind. CRUCIAL: Preserve the product exactly. Modern UI style, clean, 3D abstract art direction.',
    image: '/templates/market-glassmorphism.jpg'
  },
  {
    id: 'market-black-friday',
    category: 'marketplaces',
    title: 'Черная Пятница',
    description: 'Распродажа',
    prompt: 'Show the product from the input image on a dark black matte texture background. Glossy 3D black balloons and bold red neon lights around it. CRUCIAL: Preserve the product appearance exactly. Urgent, bold, premium discount vibe.',
    image: '/templates/market-black-friday.jpg'
  },
  {
    id: 'market-podium-nature',
    category: 'marketplaces',
    title: 'Эко Подиум',
    description: 'Дерево и зелень',
    prompt: 'Show the product from the input image standing on a natural wooden log podium. Surrounded by real moss, stones, and ferns. CRUCIAL: Preserve the product exactly. Dappled forest sunlight. Organic, eco-friendly atmosphere.',
    image: '/templates/market-podium-nature.jpg'
  },
  {
    id: 'market-fashion-studio',
    category: 'marketplaces',
    title: 'Фэшн Студия',
    description: 'Абстрактный фон',
    prompt: 'Show the product from the input image placed in a high-end fashion studio setting. Abstract architectural shapes (arches, stairs) in monochrome white or concrete. CRUCIAL: Preserve the product exactly. Soft diffused studio lighting, long shadows.',
    image: '/templates/market-fashion-studio.jpg'
  },

  // --- NEW MARKETPLACE PRESETS (General) ---
  {
    id: 'market-kitchen',
    category: 'marketplaces',
    title: 'На кухне',
    description: 'Уютный интерьер',
    prompt: 'Show the product from the input image placed on a clean marble kitchen countertop. Bright morning sunlight through the window, blurred modern kitchen interior in background. Fresh ingredients nearby. CRUCIAL: Preserve product details exactly. Photorealistic lifestyle photography.',
    image: '/templates/market-kitchen.jpg'
  },
  {
    id: 'market-bathroom',
    category: 'marketplaces',
    title: 'Ванная / SPA',
    description: 'Для ухода',
    prompt: 'Show the product from the input image standing on a white ceramic bathroom sink shelf. Mirror reflection, soft steam, clean white towels in background. CRUCIAL: Preserve product details exactly. Spa atmosphere, fresh and clean.',
    image: '/templates/market-bathroom.jpg'
  },
  {
    id: 'market-office',
    category: 'marketplaces',
    title: 'Рабочий стол',
    description: 'Офис и Гаджеты',
    prompt: 'Show the product from the input image placed on a wooden office desk next to a laptop and a cup of coffee. Warm desk lamp lighting, cozy productivity vibe. CRUCIAL: Preserve product details exactly. Photorealistic office setting.',
    image: '/templates/market-office.jpg'
  },
  {
    id: 'market-gym',
    category: 'marketplaces',
    title: 'Фитнес зал',
    description: 'Спорт товары',
    prompt: 'Show the product from the input image placed on a black rubber gym floor. Blurred gym equipment and dumbbells in the background. Dramatic sports lighting. CRUCIAL: Preserve product details exactly. Energetic, strong atmosphere.',
    image: '/templates/market-gym.jpg'
  },
  {
    id: 'market-silk',
    category: 'marketplaces',
    title: 'Шелк и Роскошь',
    description: 'Ювелирный стиль',
    prompt: 'Show the product from the input image lying on luxurious draped red or champagne colored silk fabric. Soft elegant folds, expensive studio lighting. CRUCIAL: Preserve product details exactly. Jewelry store advertisement style.',
    image: '/templates/market-silk.jpg'
  },

  // --- NEW: MARKETPLACE INFOGRAPHICS & SPECIFIC STYLES ---
  {
    id: 'market-autumn-cozy',
    category: 'marketplaces',
    title: 'Осенний Уют',
    description: 'Тепло и стиль',
    prompt: 'Show the product from the input image placed on a soft knitted beige scarf. Red and orange autumn maple leaves falling around. Steam rising from the product (if appropriate). Warm golden hour backlight. Detailed texture. Marketplace card style. Ideal for thermos, mugs, warm clothing.',
    image: '/templates/market-autumn-cozy.jpg'
  },
  {
    id: 'market-fresh-avocado',
    category: 'marketplaces',
    title: 'Свежесть & Авокадо',
    description: 'Бьюти инфографика',
    prompt: 'Show the product from the input image centered, surrounded by fresh flying water splashes and green avocado slices. Tropical monstera leaves in the background. Bright gradient green background. Freshness and hydration concept. Commercial cosmetic photography.',
    image: '/templates/market-fresh-avocado.jpg'
  },
  {
    id: 'market-tech-specs',
    category: 'marketplaces',
    title: 'Умный Гаджет',
    description: 'Технический стиль',
    prompt: 'Show the product from the input image in a high-tech setting. Dark background with glowing blue technical lines and floating HUD interface elements (battery icon, wifi icon, temperature). Sleek, modern, premium electronics presentation. 3D render style.',
    image: '/templates/market-tech-specs.jpg'
  },
  {
    id: 'market-sale-banner',
    category: 'marketplaces',
    title: 'Супер Цена',
    description: 'Яркий акцент',
    prompt: 'Show the product from the input image on a vibrant yellow and red background. 3D percent signs (%) and red "Sale" tags floating around. High contrast, bold commercial lighting. Attention grabbing design for clearance sales.',
    image: '/templates/market-sale-banner.jpg'
  },
  {
    id: 'market-eco-bamboo',
    category: 'marketplaces',
    title: 'Эко Бамбук',
    description: 'Натуральность',
    prompt: 'Show the product from the input image standing on a bamboo mat. Green bamboo stalks and smooth zen stones in the background. Soft daylight. Natural, organic, eco-friendly product presentation. Spa and wellness vibe.',
    image: '/templates/market-eco-bamboo.jpg'
  },

  // --- KIDS CATEGORY ---
  {
    id: 'kids-roblox',
    category: 'kids',
    title: 'Стиль Roblox',
    description: 'Мир блоков',
    prompt: 'Turn the person into a 3D Roblox character style. Plastic texture, blocky body, friendly face. Background: colorful obby parkour.',
    image: '/templates/kids-roblox.jpg'
  },
  {
    id: 'kids-lego',
    category: 'kids',
    title: 'LEGO',
    description: 'Конструктор',
    prompt: 'Turn the person into a realistic 3D LEGO minifigure. Plastic glossy texture, c-shaped hands. Background: lego city.',
    image: '/templates/kids-lego.jpg'
  },
  {
    id: 'kids-minecraft',
    category: 'kids',
    title: 'Minecraft',
    description: 'Пиксели',
    prompt: 'Turn the person into a Minecraft voxel character. Square head, pixelated texture. Background: blocky landscape with trees.',
    image: '/templates/kids-minecraft.jpg'
  },
  {
    id: 'kids-stalcraft',
    category: 'kids',
    title: 'Stalcraft',
    description: 'Кубический воин',
    prompt: 'Turn the person into a Stalcraft game character. Minecraft style cubic body but wearing tactical stalker gear, gas mask, dark atmosphere. Background: exclusion zone.',
    image: '/templates/kids-stalcraft.jpg'
  },
  {
    id: 'superhero',
    category: 'kids',
    title: 'Супергерой',
    description: 'Плащ и маска',
    prompt: 'Turn child into a superhero. Cape, futuristic suit. Background: night city lights. CRUCIAL: Preserve facial identity. Photorealistic style.',
    image: '/templates/superhero.jpg'
  },
  {
    id: 'fairy',
    category: 'kids',
    title: 'Фея',
    description: 'Волшебный лес',
    prompt: 'Add transparent fairy wings. Background: magical forest with giant flowers and fireflies. CRUCIAL: Preserve facial identity. Photorealistic style.',
    image: '/templates/fairy.jpg'
  },
  {
    id: 'astronaut',
    category: 'kids',
    title: 'Космонавт',
    description: 'Открытый космос',
    prompt: 'Dress child in astronaut space suit. Background: outer space, stars, planets. CRUCIAL: Keep the face recognizable. Photorealistic style.',
    image: '/templates/astronaut.jpg'
  },
  {
    id: 'harry-potter',
    category: 'kids',
    title: 'Волшебник',
    description: 'Хогвартс',
    prompt: 'Dress child as wizard student. Gryffindor scarf, wand. Background: magical castle. CRUCIAL: Preserve facial identity. Photorealistic style.',
    image: '/templates/harry-potter.jpg'
  },
  {
    id: 'kids-dinosaur',
    category: 'kids',
    title: 'Динозаврик',
    description: 'Веселый костюм',
    prompt: 'Show the child from the photo wearing a cute green dinosaur costume (onesie). CRUCIAL: Preserve facial identity exactly. Photorealistic style. Background: prehistoric jungle with cartoon-style volcano. Happy expression.',
    image: '/templates/kids-dinosaur.jpg'
  },
  {
    id: 'kids-princess',
    category: 'kids',
    title: 'Принцесса',
    description: 'Сказочный замок',
    prompt: 'Show the child from the photo wearing a beautiful sparkling princess dress and a tiara. CRUCIAL: Maintain exact facial identity. Photorealistic style. Background: magical fairy tale castle ballroom. Soft pink and gold lighting.',
    image: '/templates/kids-princess.jpg'
  },
  {
    id: 'kids-chef',
    category: 'kids',
    title: 'Шеф-повар',
    description: 'Готовим',
    prompt: 'Show the child from the photo wearing a tiny chef uniform and hat, holding a wooden spoon. CRUCIAL: Keep the face recognizable. Photorealistic style. Background: messy kitchen with flour and dough. Cute and funny.',
    image: '/templates/kids-chef.jpg'
  },
  {
    id: 'kids-pilot',
    category: 'kids',
    title: 'Пилот',
    description: 'Самолет',
    prompt: 'Show the child from the photo wearing a vintage aviator hat and goggles, sitting in a cardboard or toy airplane. CRUCIAL: Preserve facial identity. Photorealistic style. Background: blue sky with fluffy clouds.',
    image: '/templates/kids-pilot.jpg'
  },
  {
    id: 'kids-firefighter',
    category: 'kids',
    title: 'Пожарный',
    description: 'Герой',
    prompt: 'Show the child from the photo wearing a firefighter costume and helmet, holding a toy hose. CRUCIAL: Maintain exact facial identity. Photorealistic style. Background: fire station with red truck.',
    image: '/templates/kids-firefighter.jpg'
  },
  {
    id: 'kids-explorer',
    category: 'kids',
    title: 'Исследователь',
    description: 'Джунгли',
    prompt: 'Show the child from the photo dressed as a safari explorer with binoculars and a hat. CRUCIAL: Keep the face recognizable. Photorealistic style. Background: jungle with friendly animals (parrot, monkey).',
    image: '/templates/kids-explorer.jpg'
  },
  {
    id: 'kids-doctor',
    category: 'kids',
    title: 'Доктор',
    description: 'Будущее',
    prompt: 'Show the child from the photo wearing a small white doctor coat and stethoscope. CRUCIAL: Preserve facial identity. Photorealistic style. Background: hospital or clinic setting with teddy bear patient.',
    image: '/templates/kids-doctor.jpg'
  },
  {
    id: 'kids-racer',
    category: 'kids',
    title: 'Гонщик',
    description: 'Болид',
    prompt: 'Show the child from the photo wearing a racing suit and holding a helmet. CRUCIAL: Maintain exact facial identity. Photorealistic style. Background: race track with race cars.',
    image: '/templates/kids-racer.jpg'
  },
  {
    id: 'kids-pirate',
    category: 'kids',
    title: 'Пират',
    description: 'Остров сокровищ',
    prompt: 'Show the child from the photo dressed as a pirate with a hat and eye patch (optional). CRUCIAL: Keep the face recognizable. Photorealistic style. Background: pirate ship deck, ocean, treasure chest.',
    image: '/templates/kids-pirate.jpg'
  },
  {
    id: 'kids-detective',
    category: 'kids',
    title: 'Детектив',
    description: 'Расследование',
    prompt: 'Show the child from the photo wearing a trench coat and holding a magnifying glass. CRUCIAL: Preserve facial identity. Photorealistic style. Background: mystery library.',
    image: '/templates/kids-detective.jpg'
  },



  // --- BUSINESS PRINT CATEGORY ---
  {
    id: 'print-menu',
    category: 'business_print',
    title: 'Меню Ресторана',
    description: 'Премиум дизайн',
    prompt: 'Create a high-end restaurant menu background design. Dark marble texture, elegant gold lines, soft ambient lighting. Leave empty space in the center for text. Place a gourmet dish on the bottom corner. Photorealistic style.',
    image: '/templates/print-menu.jpg'
  },
  {
    id: 'print-spa-pricelist',
    category: 'business_print',
    title: 'Прайс SPA',
    description: 'Релакс и стиль',
    prompt: 'Create a luxury spa price list background. Soft beige tones, orchid flowers, white stones, and bamboo. Zen atmosphere. Clean space for service list text. Photorealistic.',
    image: '/templates/print-spa-pricelist.jpg'
  },
  {
    id: 'print-coffee-poster',
    category: 'business_print',
    title: 'Постер Кофейни',
    description: 'Реклама напитков',
    prompt: 'Create a coffee shop promotional poster background. Close-up of coffee beans and a steaming cup. Warm, cozy lighting. Text space at the top. Photorealistic.',
    image: '/templates/print-coffee-poster.jpg'
  },
  {
    id: 'print-sale-flyer',
    category: 'business_print',
    title: 'Флаер Распродажи',
    description: 'Яркое промо',
    prompt: 'Create a dynamic sale flyer background. Vibrant red and yellow geometric shapes, confetti, "Big Sale" energy. Space for product images and text. Photorealistic.',
    image: '/templates/print-sale-flyer.jpg'
  },
  {
    id: 'print-business-card',
    category: 'business_print',
    title: 'Визитка',
    description: 'Деловой стиль',
    prompt: 'Create a minimalist modern business card background design. Dark blue and silver gradient. Abstract geometric lines. Professional look. Photorealistic.',
    image: '/templates/print-business-card.jpg'
  },
  {
    id: 'print-billboard',
    category: 'business_print',
    title: 'Билборд',
    description: 'Наружная реклама',
    prompt: 'Create a mockup of a large outdoor billboard on a city building. The billboard surface is blank white for your design. Blue sky background. Photorealistic.',
    image: '/templates/print-billboard.jpg'
  },
  {
    id: 'print-event-banner',
    category: 'business_print',
    title: 'Баннер События',
    description: 'Конференция / Гала',
    prompt: 'Create a corporate event banner background. Blue stage curtains, spotlights, gold sparkles. Celebration atmosphere. Space for event title. Photorealistic.',
    image: '/templates/print-event-banner.jpg'
  },
  {
    id: 'print-voucher',
    category: 'business_print',
    title: 'Ваучер',
    description: 'Подарочный сертификат',
    prompt: 'Create a luxury gift voucher background design. Gold ribbon, silky texture background, elegant typography elements. Photorealistic.',
    image: '/templates/print-voucher.jpg'
  },
  {
    id: 'print-real-estate',
    category: 'business_print',
    title: 'Недвижимость',
    description: 'Листовка риелтора',
    prompt: 'Create a real estate flyer background. Modern home interior in background (blurred), bright airy lighting. Blue and white color scheme. Space for property details. Photorealistic.',
    image: '/templates/print-real-estate.jpg'
  },
  {
    id: 'print-roll-up',
    category: 'business_print',
    title: 'Ролл-ап',
    description: 'Стенд для офиса',
    prompt: 'Create a blank roll-up standee mockup standing in a modern office lobby. Clean canvas for your design. Professional lighting. Photorealistic.',
    image: '/templates/print-roll-up.jpg'
  },

  // --- TET (LUNAR NEW YEAR) VIETNAMESE CATEGORY ---
  {
    id: 'tet-traditional-yellow',
    category: 'tet',
    title: 'Аозай и Цветы Мая',
    description: 'Золотой Новый год',
    prompt: 'Show the person from the photo wearing a luxurious traditional yellow and red Ao Dai, standing next to a large blooming yellow Ochna Integerrima tree (Hoa Mai). CRUCIAL: Preserve the facial features exactly. Photorealistic style, detailed natural skin texture, visible pores, no plastic smoothing. Festive Vietnamese Lunar New Year atmosphere, soft sunlight, happy expression.',
    image: '/templates/tet-traditional-yellow.jpg'
  },
  {
    id: 'tet-traditional-pink',
    category: 'tet',
    title: 'Персиковый Сад',
    description: 'Северный стиль',
    prompt: 'Show the person from the photo wearing a pink silk Ao Dai standing in a garden of blooming peach blossoms (Hoa Dao). CRUCIAL: Maintain exact facial identity. Photorealistic style, detailed natural skin texture. Traditional Northern Vietnamese Tet celebration style. Gentle, elegant, spring vibes.',
    image: '/templates/tet-traditional-pink.jpg'
  },
  {
    id: 'tet-hoi-an',
    category: 'tet',
    title: 'Хойан Ночью',
    description: 'Фонарики',
    prompt: 'Show the person from the photo in Hoi An ancient town at night, surrounded by hundreds of colorful glowing silk lanterns. Wearing a traditional Ao Dai. CRUCIAL: Keep the face exactly identical. Photorealistic style, detailed natural skin texture. Magical, cinematic lighting, river background.',
    image: '/templates/tet-hoi-an.jpg'
  },
  {
    id: 'tet-temple',
    category: 'tet',
    title: 'Храм',
    description: 'Молитва на удачу',
    prompt: 'Show the person from the photo visiting a traditional Vietnamese temple or pagoda to pray for luck. CRUCIAL: Preserve facial identity. Photorealistic style, detailed natural skin texture. Burning incense sticks, smoke swirling, peaceful spiritual atmosphere. Wearing modest traditional clothing.',
    image: '/templates/tet-temple.jpg'
  },
  {
    id: 'tet-calligraphy',
    category: 'tet',
    title: 'Каллиграфия',
    description: 'Мастер Ong Do',
    prompt: 'Show the person from the photo sitting with a Vietnamese calligraphy master (Ong Do) on a street corner, holding a red paper with lucky characters. CRUCIAL: Maintain exact facial identity. Photorealistic style, detailed natural skin texture. Old Quarter background, red paper decorations.',
    image: '/templates/tet-calligraphy.jpg'
  },
  {
    id: 'tet-lucky-money',
    category: 'tet',
    title: 'Ли Си (Конверты)',
    description: 'Красные конверты удачи',
    prompt: 'Show the person from the photo holding many red lucky money envelopes (Li Xi) with a big smile. CRUCIAL: Keep the face exactly identical. Photorealistic style, detailed natural skin texture. Background decorated with Tet couplets and flowers. Wealth and prosperity vibe.',
    image: '/templates/tet-lucky-money.jpg'
  },
  {
    id: 'tet-banh-chung',
    category: 'tet',
    title: 'Бань Чунг',
    description: 'Готовим пироги',
    prompt: 'Show the person from the photo wrapping traditional sticky rice cakes (Banh Chung) with green leaves. CRUCIAL: Preserve facial identity. Photorealistic style, detailed natural skin texture. Rustic kitchen setting, cozy family atmosphere, preparing for Tet.',
    image: '/templates/tet-banh-chung.jpg'
  },
  {
    id: 'tet-flower-market',
    category: 'tet',
    title: 'Цветочный Рынок',
    description: 'Суета праздника',
    prompt: 'Show the person from the photo walking through a bustling Tet flower market filled with kumquat trees and chrysanthemums. CRUCIAL: Maintain exact facial identity. Photorealistic style, detailed natural skin texture. Motorbikes carrying flowers in the background. Authentic street life.',
    image: '/templates/tet-flower-market.jpg'
  },
  {
    id: 'tet-family-tray',
    category: 'tet',
    title: 'Праздничный Стол',
    description: 'Пять фруктов',
    prompt: 'Show the person from the photo sitting at a traditional Tet tea table with a tray of five fruits (Mam Ngu Qua) and candied fruits. CRUCIAL: Keep the face exactly identical. Photorealistic style, detailed natural skin texture. Wearing nice clothes, welcoming guests.',
    image: '/templates/tet-family-tray.jpg'
  },
  {
    id: 'tet-modern-chic',
    category: 'tet',
    title: 'Современный Тет',
    description: 'Модный Аозай',
    prompt: 'Show the person from the photo wearing a modern, stylized fashion Ao Dai (Ao Dai Cach Tan) with trendy accessories. CRUCIAL: Preserve facial identity. Photorealistic style, detailed natural skin texture. Studio photography with red background and artistic props.',
    image: '/templates/tet-modern-chic.jpg'
  },
  {
    id: 'tet-fireworks-hcm',
    category: 'tet',
    title: 'Салют Landmark 81',
    description: 'Сайгон в Новый год',
    prompt: 'Show the person from the photo standing on a luxury rooftop bar in Ho Chi Minh City, with the illuminated Landmark 81 tower in the background. Colorful Tet fireworks exploding in the night sky. CRUCIAL: Preserve facial identity exactly. Photorealistic style, detailed natural skin texture, visible pores, no plastic smoothing. Festive elegant atmosphere, holding a glass of wine.',
    image: '/templates/tet-fireworks-hcm.jpg'
  },
  {
    id: 'tet-dragon-dance',
    category: 'tet',
    title: 'Танец Льва',
    description: 'Праздничное шествие',
    prompt: 'Show the person from the photo standing next to a vibrant red and yellow Lion Dance (Mua Lan) performance on a busy street. CRUCIAL: Maintain exact facial identity. Photorealistic style, detailed natural skin texture, deep depth of field. Drums, confetti, energetic festive atmosphere.',
    image: '/templates/tet-dragon-dance.jpg'
  },
  {
    id: 'tet-vintage-retro',
    category: 'tet',
    title: 'Ретро Сайгон',
    description: 'Ностальгия 90-х',
    prompt: 'Vintage 90s film photography style. Show the person from the photo sitting on an old Honda Cub motorbike decorated with Tet flowers. CRUCIAL: Keep the face exactly identical. Photorealistic film grain, warm nostalgic colors. Vietnamese street corner background.',
    image: '/templates/tet-vintage-retro.jpg'
  },
  {
    id: 'tet-flower-street',
    category: 'tet',
    title: 'Улица Цветов',
    description: 'Прогулка Нгуен Хюэ',
    prompt: 'Show the person from the photo walking down the famous Nguyen Hue Flower Street in Ho Chi Minh City. CRUCIAL: Preserve facial identity. Photorealistic style, detailed natural skin texture. Surrounded by elaborate floral displays and Tet mascots. Sunny bright day.',
    image: '/templates/tet-flower-street.jpg'
  },
  {
    id: 'tet-countryside',
    category: 'tet',
    title: 'Деревенский Тет',
    description: 'Уют и спокойствие',
    prompt: 'Show the person from the photo in a peaceful Vietnamese countryside setting. Standing in front of a traditional wooden house with banana trees and a red flag. CRUCIAL: Maintain exact facial identity. Photorealistic style, detailed natural skin texture. Rustic, warm, homecoming vibe.',
    image: '/templates/tet-countryside.jpg'
  },
  {
    id: 'tet-cyclo',
    category: 'tet',
    title: 'Велорикша',
    description: 'Прогулка по городу',
    prompt: 'Show the person from the photo sitting on a traditional Vietnamese Cyclo (Xich Lo) decorated with marigold flowers. CRUCIAL: Keep the face exactly identical. Photorealistic style, detailed natural skin texture. Riding through a sunny street with colonial architecture.',
    image: '/templates/tet-cyclo.jpg'
  },
  {
    id: 'tet-watermelon',
    category: 'tet',
    title: 'Арбуз Удачи',
    description: 'Резьба по арбузу',
    prompt: 'Show the person from the photo holding a carved red watermelon with lucky calligraphy characters (Tai Loc). CRUCIAL: Preserve facial identity. Photorealistic style, detailed natural skin texture. Bright red and green colors, festive background.',
    image: '/templates/tet-watermelon.jpg'
  },
  {
    id: 'tet-non-la',
    category: 'tet',
    title: 'Нон Ла и Лотос',
    description: 'Традиционная красота',
    prompt: 'Show the person from the photo wearing a white Ao Dai and a traditional Conical Hat (Non La), standing by a lotus pond. CRUCIAL: Maintain exact facial identity. Photorealistic style, detailed natural skin texture. Soft, poetic, serene atmosphere.',
    image: '/templates/tet-non-la.jpg'
  },
  {
    id: 'tet-incense-spiral',
    category: 'tet',
    title: 'Благовония',
    description: 'Спирали в храме',
    prompt: 'Show the person from the photo standing under hundreds of hanging spiral incense coils in an atmospheric temple (like Ba Thien Hau). CRUCIAL: Keep the face exactly identical. Photorealistic style, detailed natural skin texture. Shafts of light cutting through the smoke, cinematic.',
    image: '/templates/tet-incense-spiral.jpg'
  },
  {
    id: 'tet-kitchen-god',
    category: 'tet',
    title: 'У Очага',
    description: 'Готовим ночью',
    prompt: 'Show the person from the photo sitting by a warm wood fire, cooking a large pot of Banh Chung at night. CRUCIAL: Preserve facial identity. Photorealistic style, detailed natural skin texture. Glowing warm light from the fire, cozy anticipation of New Year.',
    image: '/templates/tet-kitchen-god.jpg'
  },

  // --- FASHION CATEGORY ---

  {
    id: 'fashion-urban',
    category: 'fashion',
    title: 'Урбан Стритвир',
    description: 'Уличный стиль',
    prompt: 'Show the person from the photo in a trendy urban streetwear outfit (hoodie, bomber jacket, sneakers). CRUCIAL: Preserve facial identity. Graffiti wall background, neon city lights reflections, dynamic angle. Hypebeast style. Photorealistic.',
    image: '/templates/fashion-urban.jpg'
  },
  {
    id: 'fashion-red-carpet',
    category: 'fashion',
    title: 'Красная Дорожка',
    description: 'Гала-вечер',
    prompt: 'Show the person from the photo standing on a red carpet at a movie premiere or Met Gala. CRUCIAL: Maintain exact facial identity. Wearing a glamorous evening gown or tuxedo. Paparazzi flashes, velvet ropes, luxury event atmosphere. Photorealistic.',
    image: '/templates/fashion-red-carpet.jpg'
  },
  {
    id: 'fashion-summer-resort',
    category: 'fashion',
    title: 'Летний Курорт',
    description: 'Средиземноморье',
    prompt: 'Show the person from the photo in a luxury summer resort outfit (linen shirt/dress, sunglasses). CRUCIAL: Keep the face exactly identical. Amalfi coast background, blue sea, lemon trees, sunny bright lighting. Photorealistic.',
    image: '/templates/fashion-summer-resort.jpg'
  },
  {
    id: 'fashion-cyber',
    category: 'fashion',
    title: 'Кибер Мода',
    description: 'Футуризм',
    prompt: 'Show the person from the photo in futuristic cyber fashion clothing. Holographic fabrics, neon glowing accessories. CRUCIAL: Preserve facial identity. Night city futuristic background, rain, blue and pink neon lighting. Photorealistic.',
    image: '/templates/fashion-cyber.jpg'
  },
  {
    id: 'fashion-denim',
    category: 'fashion',
    title: 'Деним',
    description: 'Джинсовый стиль',
    prompt: 'Show the person from the photo wearing a stylish all-denim outfit (jean jacket and jeans). CRUCIAL: Maintain exact facial identity. Studio blue background or industrial loft setting. Cool, edgy fashion vibe. Photorealistic.',
    image: '/templates/fashion-denim.jpg'
  },
  {
    id: 'fashion-minimal',
    category: 'fashion',
    title: 'Минимализм',
    description: 'Студийный портрет',
    prompt: 'Minimalist fashion photography. Show the person from the photo in a sleek monochrome outfit against a plain concrete or beige wall. CRUCIAL: Keep the face exactly identical. Soft natural shadow, clean lines, Zara/Uniqlo lookbook style. Photorealistic.',
    image: '/templates/fashion-minimal.jpg'
  },


  {
    id: 'fashion-runway',
    category: 'fashion',
    title: 'Подиум',
    description: 'Показ мод',
    prompt: 'Show the person from the photo walking on a high-fashion runway during a fashion week show. CRUCIAL: Preserve facial identity exactly. Wearing avant-garde designer couture. Dramatic spotlights, audience in darkness, flashing cameras. Photorealistic 8k, detailed skin texture.',
    image: '/templates/fashion-runway.jpg'
  },
  {
    id: 'fashion-editorial',
    category: 'fashion',
    title: 'Обложка журнала',
    description: 'Vogue стиль',
    prompt: 'High-end fashion editorial portrait shot for a magazine cover like Vogue. CRUCIAL: Maintain exact facial identity. Artistic lighting, bold makeup, stylish haute couture outfit. Studio background with geometric shadows. 8k resolution, detailed skin texture.',
    image: '/templates/fashion-editorial.jpg'
  },
  {
    id: 'fashion-street-paris',
    category: 'fashion',
    title: 'Париж',
    description: 'У Эйфелевой башни',
    prompt: 'Show the person from the photo walking in Paris near the Eiffel Tower. CRUCIAL: Preserve facial identity. Wearing a trench coat, beret, and holding a baguette or coffee. Cloudy chic atmosphere, street style photography. Photorealistic.',
    image: '/templates/fashion-street-paris.jpg'
  },
  {
    id: 'fashion-old-money-winter',
    category: 'fashion',
    title: 'Альпы',
    description: 'Зимний люкс',
    prompt: 'Show the person from the photo on a balcony of a luxury ski chalet in the Alps. CRUCIAL: Keep the face exactly identical. Wearing expensive cashmere beige sweater, fur hat, sipping hot chocolate. Snowy mountain background. Wealthy aesthetic, detailed skin.',
    image: '/templates/fashion-old-money-winter.jpg'
  },

  // --- STYLE TRENDS & MOODBOARDS CATEGORY ---
  {
    id: 'style-old-money',
    category: 'style_trends',
    title: 'Old Money',
    description: 'Роскошная сдержанность',
    prompt: 'Dress the person from the photo in the "Old Money" aesthetic. Polo shirt, beige trousers or tennis skirt, cashmere sweater over shoulders, loafers. CRUCIAL: Preserve facial identity exactly. Background: A luxury yacht deck or a private mansion garden. Wealthy, understated elegance. Photorealistic, detailed skin.',
    image: '/templates/style-old-money.jpg'
  },
  {
    id: 'style-y2k',
    category: 'style_trends',
    title: 'Стиль Y2K',
    description: 'Нулевые',
    prompt: 'Dress the person from the photo in Y2K fashion (Year 2000 style). Low-rise jeans, baby tee, butterfly clips, rimless sunglasses. CRUCIAL: Maintain exact facial identity. Background: Glossy futuristic purple and pink gradient with digital abstract shapes. Photorealistic.',
    image: '/templates/style-y2k.jpg'
  },
  {
    id: 'style-streetwear',
    category: 'style_trends',
    title: 'Стритвир Премиум',
    description: 'Уличная мода',
    prompt: 'Dress the person from the photo in premium streetwear. Oversized graphic hoodie, cargo pants, chunky sneakers, beanie. CRUCIAL: Keep the face exactly identical. Background: Urban city street with graffiti art and neon signs. Photorealistic.',
    image: '/templates/style-streetwear.jpg'
  },
  {
    id: 'style-minimalist',
    category: 'style_trends',
    title: 'Минимализм',
    description: 'Элегантность',
    prompt: 'Dress the person from the photo in a clean Minimalist fashion style. Monochromatic outfit (all black or all white), sleek lines, trench coat. CRUCIAL: Preserve facial identity. Background: Modern concrete architectural wall or art gallery. Photorealistic.',
    image: '/templates/style-minimalist.jpg'
  },
  {
    id: 'style-coquette',
    category: 'style_trends',
    title: 'Coquette',
    description: 'Банты и кружева',
    prompt: 'Dress the person from the photo in Coquette aesthetic. Lace dress, pink bows in hair, pearls, soft lighting. CRUCIAL: Maintain exact facial identity. Background: Vintage bedroom with flowers and soft pastel colors. Photorealistic.',
    image: '/templates/style-coquette.jpg'
  },
  {
    id: 'style-cyberpunk',
    category: 'style_trends',
    title: 'Techwear / Cyberpunk',
    description: 'Техно-мода',
    prompt: 'Dress the person from the photo in futuristic Techwear. Black tactical straps, mask hanging on neck, waterproof fabrics, neon accents. CRUCIAL: Keep the face recognizable. Background: Rainy night city in Tokyo cyberpunk style. Photorealistic.',
    image: '/templates/style-cyberpunk.jpg'
  },
  {
    id: 'style-vintage-90s',
    category: 'style_trends',
    title: 'Винтаж 90-х',
    description: 'Гранж и деним',
    prompt: 'Dress the person from the photo in 90s vintage style. Denim jacket, flannel shirt tied around waist, combat boots. CRUCIAL: Preserve facial identity. Background: Retro record store or diner. Photorealistic.',
    image: '/templates/style-vintage-90s.jpg'
  },
  {
    id: 'style-moodboard-1',
    category: 'style_trends',
    title: 'Мудборд 1',
    description: 'Образ + Раскладка',
    prompt: 'Create a fashion moodboard composition. Split the image into two sections. On the Left: The person from the photo wearing a stylish chic outfit (CRUCIAL: Preserve facial identity exactly, photorealistic). On the Right: A neat flatlay arrangement of the matching accessories, shoes, and bag on a marble background. High fashion magazine layout style.',
    image: '/templates/style-moodboard-1.jpg'
  },
  {
    id: 'style-moodboard-2',
    category: 'style_trends',
    title: 'Мудборд 2',
    description: 'Коллаж',
    prompt: 'Create a trendy fashion collage. Main visual is the person from the photo wearing a casual trendy outfit (CRUCIAL: Maintain exact facial identity, photorealistic). Surrounding the person are floating aesthetic elements: a coffee cup, sunglasses, a magazine, and a pair of sneakers arranged artistically. Beige aesthetic background.',
    image: '/templates/style-moodboard-2.jpg'
  },
  {
    id: 'style-boho',
    category: 'style_trends',
    title: 'Бохо (Boho)',
    description: 'Свобода стиля',
    prompt: 'Dress the person from the photo in Bohemian style. Flowy patterned dress or linen shirt, wide-brimmed hat, leather accessories. CRUCIAL: Keep the face exactly identical. Background: Sunset desert or festival grounds. Photorealistic.',
    image: '/templates/style-boho.jpg'
  },

  // --- FORMULA 1 CATEGORY ---
  {
    id: 'f1-cockpit',
    category: 'formula1',
    title: 'Вид пилота',
    description: 'В кокпите (Профиль)',
    prompt: 'Cinematic side profile shot of the person from the photo sitting inside a Formula 1 car cockpit. Camera angle from the side/three-quarters. Wearing a professional racing suit and helmet with visor open, revealing the face clearly. CRUCIAL: Preserve the facial features exactly. Photorealistic style, detailed natural skin texture. Hands gripping the steering wheel. Detailed car chassis, blurred racetrack background, high speed atmosphere.',
    image: '/templates/f1-cockpit.jpg'
  },
  {
    id: 'f1-car-standing',
    category: 'formula1',
    title: 'У болида',
    description: 'Пит-лейн',
    prompt: 'Show the person from the photo standing confidently next to a sleek Formula 1 car in the pit lane. CRUCIAL: Maintain exact facial identity. Photorealistic style, detailed natural skin texture. Wearing team racing kit, sunglasses, mechanic crew busy in background.',
    image: '/templates/f1-car-standing.jpg'
  },
  {
    id: 'f1-podium',
    category: 'formula1',
    title: 'Подиум',
    description: 'Шампанское',
    prompt: 'Show the person from the photo standing on the 1st place podium, holding a giant gold trophy and spraying champagne. CRUCIAL: Keep the face exactly identical. Photorealistic style. Confetti raining down, cheering crowd below, wearing winner cap.',
    image: '/templates/f1-podium.jpg'
  },
  {
    id: 'f1-racing',
    category: 'formula1',
    title: 'Гонка',
    description: 'На трассе',
    prompt: 'Action shot of a Formula 1 car speeding on the track. The person from the photo is driving, face visible through the open visor. CRUCIAL: Preserve facial identity. Photorealistic style. Motion blur background, sparks from under the car, intense speed.',
    image: '/templates/f1-racing.jpg'
  },
  {
    id: 'f1-paddock',
    category: 'formula1',
    title: 'Паддок VIP',
    description: 'Стиль звезды',
    prompt: 'Show the person from the photo walking through the exclusive F1 Paddock area. CRUCIAL: Maintain exact facial identity. Photorealistic style. Wearing stylish VIP guest pass, sunglasses, luxury casual outfit, motorhomes in background.',
    image: '/templates/f1-paddock.jpg'
  },
  {
    id: 'f1-pitstop',
    category: 'formula1',
    title: 'Пит-стоп',
    description: 'Механик',
    prompt: 'Show the person from the photo as part of the pit crew, holding a wheel gun during a lightning-fast pit stop. CRUCIAL: Keep the face recognizable. Photorealistic style. Surrounded by mechanics in matching uniforms, smoke, intensity.',
    image: '/templates/f1-pitstop.jpg'
  },
  {
    id: 'f1-garage',
    category: 'formula1',
    title: 'Гараж',
    description: 'Телеметрия',
    prompt: 'Show the person from the photo sitting in the team garage, looking at telemetry data on monitors with engineers. CRUCIAL: Preserve facial identity. Photorealistic style. Headset on, focused expression, high-tech environment.',
    image: '/templates/f1-garage.jpg'
  },
  {
    id: 'f1-helmet',
    category: 'formula1',
    title: 'Шлем',
    description: 'Крупный план',
    prompt: 'Close-up portrait of the person wearing a custom-designed colorful racing helmet with the visor open. CRUCIAL: Maintain exact facial identity. Photorealistic style, detailed skin texture. Track lights reflecting on the helmet, intense eyes.',
    image: '/templates/f1-helmet.jpg'
  },

  // --- PRANKS CATEGORY ---
  {
    id: 'prank-flood',
    category: 'pranks',
    title: 'Наводнение',
    description: 'Затопленная комната',
    prompt: 'Transform the room in the photo to look completely flooded with water. Reflections of furniture in the water, floating items, realistic disaster movie effect. Photorealistic.',
    image: '/templates/prank-flood.jpg'
  },
  {
    id: 'prank-mistress',
    category: 'pranks',
    title: 'Кто-то в постели (Ж)',
    description: 'Пранк с девушкой',
    prompt: 'Add a mysterious silhouette of a sleeping woman under the blanket in the bed next to the viewer. Messy sheets, long hair visible on the pillow. Prank photo. Photorealistic.',
    image: '/templates/prank-mistress.jpg'
  },
  {
    id: 'prank-lover',
    category: 'pranks',
    title: 'Кто-то в постели (М)',
    description: 'Пранк с парнем',
    prompt: 'Add a mysterious silhouette of a sleeping man under the blanket in the bed next to the viewer. Messy sheets, arm visible. Prank photo. Photorealistic.',
    image: '/templates/prank-lover.jpg'
  },
  {
    id: 'prank-broken-screen',
    category: 'pranks',
    title: 'Разбитый экран',
    description: 'Трещины на мониторе',
    prompt: 'Add a realistic smashed screen effect with spiderweb cracks and glitching pixels to the TV or monitor screen in the photo. Photorealistic.',
    image: '/templates/prank-broken-screen.jpg'
  },
  {
    id: 'prank-arrest',
    category: 'pranks',
    title: 'Арест',
    description: 'Полицейское фото',
    prompt: 'Show the person from the photo in a police booking photo (mugshot). CRUCIAL: Preserve the facial features exactly. Photorealistic style, detailed natural skin texture. Holding a sign with numbers, height chart in the background, harsh lighting. Prank photo.',
    image: '/templates/prank-arrest.jpg'
  },
  {
    id: 'prank-bruises',
    category: 'pranks',
    title: 'Драка',
    description: 'Грим побоев',
    prompt: 'Apply hyper-realistic Hollywood special effects makeup (SFX) to the person\'s face. Create a realistic black eye, bruises on the cheekbone, and a split lip effect. CRUCIAL: Preserve the underlying facial identity. Action movie aftermath style, detailed texture, cinematic lighting, visible pores.',
    image: '/templates/prank-bruises.jpg'
  },
  {
    id: 'prank-mess',
    category: 'pranks',
    title: 'Беспорядок',
    description: 'Хаос в комнате',
    prompt: 'Make the room look absolutely messy and chaotic. Clothes everywhere, spilled food, overturned chairs. "Party gone wrong" prank vibe. Photorealistic.',
    image: '/templates/prank-mess.jpg'
  },
  {
    id: 'prank-animal-mess',
    category: 'pranks',
    title: 'Питомец нашкодил',
    description: 'Порванная подушка',
    prompt: 'Add a guilty-looking dog or cat sitting amidst a pile of torn white feathers from a destroyed pillow. Messy room prank. Photorealistic.',
    image: '/templates/prank-animal-mess.jpg'
  },
  {
    id: 'prank-kids-art',
    category: 'pranks',
    title: 'Детские рисунки',
    description: 'Разрисованные стены',
    prompt: 'Add colorful crayon drawings and scribbles all over the walls and furniture. Messy kids playroom prank. Photorealistic.',
    image: '/templates/prank-kids-art.jpg'
  },
  {
    id: 'prank-clown',
    category: 'pranks',
    title: 'Жуткий клоун',
    description: 'В окне',
    prompt: 'Add a creepy clown face peering through the window or standing in a dark corner of the room. Spooky prank photo. Photorealistic.',
    image: '/templates/prank-clown.jpg'
  },
  {
    id: 'prank-lottery',
    category: 'pranks',
    title: 'Джекпот',
    description: 'Чек лотереи',
    prompt: 'Show the person from the photo holding a giant lottery check with a huge amount of money written on it. CRUCIAL: Keep the face exactly identical. Photorealistic style. Confetti falling, excited expression, looking like a winner on TV.',
    image: '/templates/prank-lottery.jpg'
  },
  {
    id: 'prank-alien',
    category: 'pranks',
    title: 'Пришельцы',
    description: 'Похищение НЛО',
    prompt: 'Show the person from the photo being lifted off the ground by a bright green beam of light coming from a UFO saucer in the night sky. CRUCIAL: Keep the face recognizable. Sci-fi movie style, floating in air.',
    image: '/templates/prank-alien.jpg'
  },
  {
    id: 'prank-ghost',
    category: 'pranks',
    title: 'Призрак',
    description: 'Паранормальное',
    prompt: 'Make the photo look spooky. Add a semi-transparent ghostly figure standing behind the person. Dim lighting, paranormal activity vibe, grainy horror movie texture.',
    image: '/templates/prank-ghost.jpg'
  },
  {
    id: 'prank-superpower',
    category: 'pranks',
    title: 'Суперсила (Фейл)',
    description: 'Лазер из глаз',
    prompt: 'Show the person from the photo trying to use superpowers (like laser eyes or fire hands) but accidentally scorching their own clothes or the wall nearby. CRUCIAL: Keep the face recognizable. Funny superhero fail situation. smoke and char marks.',
    image: '/templates/prank-superpower.jpg'
  },
  {
    id: 'prank-time',
    category: 'pranks',
    title: 'Путешественник',
    description: 'Из будущего',
    prompt: 'Show the person from the photo stepping out of a glowing time travel portal or a futuristic DeLorean car. CRUCIAL: Keep the face exactly identical. Smoke, electricity sparks, wearing futuristic goggles or clothes mixed with normal ones.',
    image: '/templates/prank-time.jpg'
  },

  // --- WEDDING CATEGORY ---
  {
    id: 'wedding-bride-groom',
    category: 'wedding',
    title: 'Жених и Невеста',
    description: 'Классический портрет',
    prompt: 'Show the person from the photo in wedding attire (suit or white dress) standing with a partner in a beautiful garden. CRUCIAL: Preserve the facial features exactly. Photorealistic style, detailed natural skin texture. Soft romantic lighting, love, happiness.',
    image: '/templates/wedding-bride-groom.jpg'
  },
  {
    id: 'wedding-dress',
    category: 'wedding',
    title: 'Примерка платья',
    description: 'Идеальный выбор',
    prompt: 'Show the person from the photo wearing a luxurious, detailed white lace wedding dress, looking into a large vintage mirror in a bridal salon. CRUCIAL: Maintain exact facial identity. Photorealistic style, detailed natural skin texture. Soft lighting, elegance.',
    image: '/templates/wedding-dress.jpg'
  },
  {
    id: 'wedding-church',
    category: 'wedding',
    title: 'Венчание',
    description: 'Церемония в церкви',
    prompt: 'Show the person from the photo participating in a traditional orthodox wedding ceremony (Venchanie) inside a beautiful church. CRUCIAL: Keep the face exactly identical. Photorealistic style, detailed natural skin texture. Candles, gold icons, holding crowns, spiritual atmosphere.',
    image: '/templates/wedding-church.jpg'
  },
  {
    id: 'wedding-zags',
    category: 'wedding',
    title: 'ЗАГС',
    description: 'Лепестки роз',
    prompt: 'Show the person from the photo walking out of the Registry Office (ZAGS) doors, smiling happily. CRUCIAL: Preserve the facial features exactly. Photorealistic style. Guests are throwing white rose petals in the air. Joyful celebration moment.',
    image: '/templates/wedding-zags.jpg'
  },
  {
    id: 'wedding-ring',
    category: 'wedding',
    title: 'Кольца',
    description: 'Символ верности',
    prompt: 'Close-up artistic shot focusing on the person\'s hand wearing a beautiful diamond wedding ring. Soft bokeh background, holding a bouquet or partner\'s hand. Photorealistic.',
    image: '/templates/wedding-ring.jpg'
  },
  {
    id: 'wedding-dance',
    category: 'wedding',
    title: 'Первый танец',
    description: 'Дым и свет',
    prompt: 'Show the person from the photo dancing the first wedding dance. CRUCIAL: Maintain exact facial identity. Photorealistic style. Low floor fog (dry ice), spotlight, romantic evening atmosphere in a banquet hall.',
    image: '/templates/wedding-dance.jpg'
  },
  {
    id: 'wedding-cake',
    category: 'wedding',
    title: 'Свадебный торт',
    description: 'Разрезание торта',
    prompt: 'Show the person from the photo standing next to a giant multi-tier wedding cake, holding a knife ready to cut it. CRUCIAL: Keep the face exactly identical. Photorealistic style. Festive reception background.',
    image: '/templates/wedding-cake.jpg'
  },
  {
    id: 'wedding-party',
    category: 'wedding',
    title: 'Вечеринка',
    description: 'Шампанское и веселье',
    prompt: 'Show the person from the photo at a lively wedding party, holding a glass of champagne, laughing with friends. CRUCIAL: Preserve facial identity. Photorealistic style. Sparklers, disco lights, fun vibe.',
    image: '/templates/wedding-party.jpg'
  },
  {
    id: 'wedding-morning',
    category: 'wedding',
    title: 'Утро невесты',
    description: 'Сборы',
    prompt: 'Show the person from the photo in a silk white robe, sitting on a bed or chair, getting ready for the wedding. CRUCIAL: Maintain exact facial identity. Photorealistic style, detailed natural skin texture. Makeup, bouquet nearby, soft window light.',
    image: '/templates/wedding-morning.jpg'
  },
  {
    id: 'wedding-car',
    category: 'wedding',
    title: 'Свадебное авто',
    description: 'Лимузин или ретро',
    prompt: 'Show the person from the photo sitting in a decorated luxury retro wedding car or limousine. CRUCIAL: Keep the face exactly identical. Photorealistic style. Flowers on the car, waving out the window.',
    image: '/templates/wedding-car.jpg'
  },

  // --- DATING CATEGORY ---
  {
    id: 'dating-train',
    category: 'dating',
    title: 'Вокзал',
    description: 'Долгожданная встреча',
    prompt: 'Show the person from the photo meeting a loved one at a vintage train station platform. CRUCIAL: Preserve facial identity. Photorealistic style. Steam, warm lighting, hugging or waiting with flowers, emotional reunion atmosphere.',
    image: '/templates/dating-train.jpg'
  },
  {
    id: 'dating-car',
    category: 'dating',
    title: 'Свидание в авто',
    description: 'Огни города',
    prompt: 'Show the person from the photo on a romantic date night by a luxury car. CRUCIAL: Keep the face exactly identical. Photorealistic style. Leaning on the car hood, city lights in background, evening street vibe, holding a rose.',
    image: '/templates/dating-car.jpg'
  },
  {
    id: 'dating-flowers',
    category: 'dating',
    title: 'Букет роз',
    description: 'Сюрприз',
    prompt: 'Show the person from the photo holding a giant luxury bouquet of red roses. CRUCIAL: Maintain exact facial identity. Photorealistic style. Happy expression, urban street background, romantic surprise.',
    image: '/templates/dating-flowers.jpg'
  },
  {
    id: 'dating-restaurant',
    category: 'dating',
    title: 'Ужин при свечах',
    description: 'Романтика',
    prompt: 'Show the person from the photo having a romantic dinner date in a high-end restaurant. CRUCIAL: Preserve facial identity. Photorealistic style. Candlelight, wine glasses, holding hands across the table, intimate atmosphere.',
    image: '/templates/dating-restaurant.jpg'
  },
  {
    id: 'dating-park',
    category: 'dating',
    title: 'Прогулка в парке',
    description: 'Осень/Весна',
    prompt: 'Show the person from the photo walking in a beautiful park with autumn leaves or spring blossoms. CRUCIAL: Keep the face exactly identical. Photorealistic style. Holding hands with partner, soft sunlight, romantic walk.',
    image: '/templates/dating-park.jpg'
  },
  {
    id: 'dating-rooftop',
    category: 'dating',
    title: 'На крыше',
    description: 'Вид на город',
    prompt: 'Show the person from the photo on a romantic date on a rooftop at sunset. CRUCIAL: Maintain exact facial identity. Photorealistic style. City skyline view, string lights, cozy blanket, drinking wine.',
    image: '/templates/dating-rooftop.jpg'
  },
  {
    id: 'dating-picnic',
    category: 'dating',
    title: 'Пикник',
    description: 'Отдых на природе',
    prompt: 'Show the person from the photo having a romantic picnic on the grass. CRUCIAL: Preserve facial identity. Photorealistic style. Checkered blanket, fruit basket, wine, laughing, sunny day nature.',
    image: '/templates/dating-picnic.jpg'
  },
  {
    id: 'dating-beach',
    category: 'dating',
    title: 'Пляж',
    description: 'Закат у моря',
    prompt: 'Show the person from the photo walking along the beach at sunset. CRUCIAL: Keep the face exactly identical. Photorealistic style. Barefoot, waves crashing, golden hour light, romantic silhouette.',
    image: '/templates/dating-beach.jpg'
  },
  {
    id: 'dating-gift',
    category: 'dating',
    title: 'Подарок',
    description: 'Радость',
    prompt: 'Show the person from the photo holding a beautifully wrapped gift box with a bow. CRUCIAL: Maintain exact facial identity. Photorealistic style. Excited expression, party background or cozy home setting.',
    image: '/templates/dating-gift.jpg'
  },
  {
    id: 'dating-cinema',
    category: 'dating',
    title: 'Кинотеатр',
    description: 'Просмотр фильма',
    prompt: 'Show the person from the photo on a date at the cinema. CRUCIAL: Preserve facial identity. Photorealistic style. Eating popcorn, watching a movie, cozy atmosphere, dim lighting.',
    image: '/templates/dating-cinema.jpg'
  },

  // --- SPORTS CATEGORY ---
  {
    id: 'sports-karate',
    category: 'sports',
    title: 'Каратэ',
    description: 'Единоборства',
    prompt: 'Show the person from the photo dressed in a clean white karate gi with a black belt, performing a dynamic martial arts kick. CRUCIAL: Keep the face exactly identical to the original photo. Photorealistic style, detailed skin texture. Background: traditional Japanese dojo with tatami mats.',
    image: '/templates/sports-karate.jpg'
  },
  {
    id: 'sports-tennis',
    category: 'sports',
    title: 'Теннис',
    description: 'Корт',
    prompt: 'Show the person from the photo dressed in professional tennis sportswear holding a racket. CRUCIAL: Preserve the facial features exactly. Photorealistic style. Ready to serve on a clay tennis court. Sunny day, dynamic action pose.',
    image: '/templates/sports-tennis.jpg'
  },
  {
    id: 'sports-fit-girl',
    category: 'sports',
    title: 'Фитнес (Ж)',
    description: 'Спортивное тело',
    prompt: 'Enhance the physique of the person from the photo to look like a fitness model. Toned athletic body, defined abs, wearing stylish gym activewear. CRUCIAL: Keep the face completely unchanged and recognizable. Photorealistic style, detailed natural skin texture, visible pores. Professional fitness photography in a modern gym.',
    image: '/templates/sports-fit-girl.jpg'
  },
  {
    id: 'sports-fit-guy',
    category: 'sports',
    title: 'Фитнес (М)',
    description: 'Рельефные мышцы',
    prompt: 'Enhance the physique of the person from the photo to look like a fitness model. Muscular definition, broad shoulders, six-pack abs, athletic build. CRUCIAL: Maintain the exact facial identity. Photorealistic style, detailed skin texture. Gym setting with dramatic lighting.',
    image: '/templates/sports-fit-guy.jpg'
  },
  {
    id: 'sports-olympia',
    category: 'sports',
    title: 'Бодибилдинг',
    description: 'Мистер Олимпия',
    prompt: 'Transform the person from the photo into a Mr. Olympia bodybuilding champion body type while keeping the face exactly as is in the original photo. CRUCIAL: Preserve facial identity. Photorealistic style, detailed skin texture. Extreme muscle mass, veins, definition, stage tan, posing trunks, bright stage lighting.',
    image: '/templates/sports-olympia.jpg'
  },
  {
    id: 'sports-running',
    category: 'sports',
    title: 'Бег',
    description: 'Марафон',
    prompt: 'Show the person from the photo running in a park or on a track, wearing professional running gear. CRUCIAL: Preserve the face exactly. Photorealistic style. Motion blur background, athletic determination, morning sunlight.',
    image: '/templates/sports-running.jpg'
  },
  {
    id: 'sports-boxing',
    category: 'sports',
    title: 'Бокс',
    description: 'На ринге',
    prompt: 'Show the person from the photo wearing boxing gloves and shorts, standing in a boxing ring. CRUCIAL: Keep the face exactly identical. Photorealistic style, detailed skin texture. Sweat on skin, intense look, dramatic arena lighting.',
    image: '/templates/sports-boxing.jpg'
  },
  {
    id: 'sports-yoga',
    category: 'sports',
    title: 'Йога',
    description: 'Гибкость',
    prompt: 'Show the person from the photo doing a yoga pose on a mat in a peaceful studio or nature setting at sunset. CRUCIAL: Maintain exact facial identity. Photorealistic style. Flexibility, calm atmosphere, athletic yoga wear.',
    image: '/templates/sports-yoga.jpg'
  },
  {
    id: 'sports-swimming',
    category: 'sports',
    title: 'Плавание',
    description: 'Бассейн',
    prompt: 'Show the person from the photo as a swimmer in a pool wearing goggles and cap, emerging from the water. CRUCIAL: Preserve facial identity. Photorealistic style. Water droplets, athletic shoulders.',
    image: '/templates/sports-swimming.jpg'
  },
  {
    id: 'sports-soccer',
    category: 'sports',
    title: 'Футбол',
    description: 'Стадион',
    prompt: 'Show the person from the photo wearing a soccer jersey and cleats, dribbling a ball on a large green stadium field at night. CRUCIAL: Keep the face unchanged. Photorealistic style. Floodlights background.',
    image: '/templates/sports-soccer.jpg'
  },

  // --- RESTAURANTS CATEGORY ---
  {
    id: 'restaurant-michelin',
    category: 'restaurants',
    title: 'Мишлен',
    description: 'Высокая кухня',
    prompt: 'Professional food photography, fine dining style. Elegant dark plating, tweezers precision, dramatic moody lighting, white tablecloth. Photorealistic.',
    image: '/templates/restaurant-michelin.jpg'
  },
  {
    id: 'restaurant-full',
    category: 'restaurants',
    title: 'Полная посадка',
    description: 'Атмосфера ресторана',
    prompt: 'Show the dish on a table in a bustling, crowded restaurant. Blurred background of happy customers chatting and eating. Warm, lively atmosphere. Photorealistic.',
    image: '/templates/restaurant-full.jpg'
  },
  {
    id: 'restaurant-terrace',
    category: 'restaurants',
    title: 'Терраса',
    description: 'На свежем воздухе',
    prompt: 'Food photography on an outdoor restaurant terrace. Bright sunlight, dappled shadows from trees, summer vibe, glass of lemonade nearby. Photorealistic.',
    image: '/templates/restaurant-terrace.jpg'
  },
  {
    id: 'restaurant-romantic',
    category: 'restaurants',
    title: 'Романтический ужин',
    description: 'Свечи и вино',
    prompt: 'Romantic dinner setting. Dim warm lighting, candles on the table, two glasses of red wine, bokeh background. Intimate atmosphere. Photorealistic.',
    image: '/templates/restaurant-romantic.jpg'
  },
  {
    id: 'restaurant-chef',
    category: 'restaurants',
    title: 'Шеф-повар',
    description: 'Презентация блюда',
    prompt: 'Close up of a professional chef in a white uniform holding the plate with the dish towards the camera. Commercial kitchen background. Photorealistic.',
    image: '/templates/restaurant-chef.jpg'
  },
  {
    id: 'restaurant-steam',
    category: 'restaurants',
    title: 'Горячее блюдо',
    description: 'Пар и свежесть',
    prompt: 'Appetizing food photography with visible steam rising from the hot dish. Fresh ingredients, macro shot, shallow depth of field. Photorealistic.',
    image: '/templates/restaurant-steam.jpg'
  },
  {
    id: 'restaurant-burger',
    category: 'restaurants',
    title: 'Бургер',
    description: 'Крафт и Неон',
    prompt: 'Juicy fast food photography. Dark wooden table, craft paper, neon sign in background. Greasy, delicious, dynamic angle. Photorealistic.',
    image: '/templates/restaurant-burger.jpg'
  },
  {
    id: 'restaurant-breakfast',
    category: 'restaurants',
    title: 'Завтрак',
    description: 'Утренний кофе',
    prompt: 'Morning breakfast setting. Bright airy light, cup of coffee with latte art, newspaper, fresh flowers on a white marble table. Photorealistic.',
    image: '/templates/restaurant-breakfast.jpg'
  },
  {
    id: 'restaurant-asian',
    category: 'restaurants',
    title: 'Азия',
    description: 'Вок и палочки',
    prompt: 'Asian cuisine styling. Slate plate, chopsticks, bamboo mat, steam, dark moody lighting with red accents. Photorealistic.',
    image: '/templates/restaurant-asian.jpg'
  },
  {
    id: 'restaurant-flatlay',
    category: 'restaurants',
    title: 'Меню (Сверху)',
    description: 'Раскладка блюд',
    prompt: 'Flat lay top-down view of a table full of different dishes. Feast style, shared plates, beautiful composition for a menu cover. Photorealistic.',
    image: '/templates/restaurant-flatlay.jpg'
  },

  // --- BLOGGERS CATEGORY ---
  {
    id: 'blogger-photoshoot',
    category: 'bloggers',
    title: 'Фотосессия',
    description: 'Бэкстейдж',
    prompt: 'Show the person from the photo as a model in a professional fashion photoshoot backstage. CRUCIAL: Keep the face exactly identical. Posing, photographer in background, bright studio lighting equipment, flashes firing, busy creative atmosphere. Photorealistic style, detailed skin texture.',
    image: '/templates/blogger-photoshoot.jpg'
  },
  {
    id: 'blogger-autograph',
    category: 'bloggers',
    title: 'Автограф-сессия',
    description: 'Встреча с фанатами',
    prompt: 'Show the person from the photo as a famous influencer signing autographs for fans. CRUCIAL: Preserve facial identity. Photorealistic style, detailed skin texture. Crowded event, holding a marker, happy fans in background, posters, paparazzi style flashes.',
    image: '/templates/blogger-autograph.jpg'
  },
  {
    id: 'blogger-stream-star',
    category: 'bloggers',
    title: 'Стрим со звездой',
    description: 'В эфире',
    prompt: 'Show the person from the photo as a streamer sitting next to a famous celebrity guest. CRUCIAL: Maintain exact facial identity. Photorealistic style, detailed skin texture. High energy live stream setup, wide angle shot of a room with LED lights, laughing, microphone arms, crazy atmosphere.',
    image: '/templates/blogger-stream-star.jpg'
  },
  {
    id: 'blogger-podcast',
    category: 'bloggers',
    title: 'Подкаст',
    description: 'Интервью',
    prompt: 'Show the person from the photo in a professional podcast studio with microphone and headphones, neon sign in background. CRUCIAL: Keep the face exactly identical. Photorealistic style.',
    image: '/templates/blogger-podcast.jpg'
  },
  {
    id: 'blogger-gaming',
    category: 'bloggers',
    title: 'Геймер',
    description: 'Игровая комната',
    prompt: 'Show the person from the photo in a gaming room with RGB lighting, gaming chair, and multiple monitors. CRUCIAL: Preserve facial identity. Photorealistic style.',
    image: '/templates/blogger-gaming.jpg'
  },
  {
    id: 'blogger-coffee',
    category: 'bloggers',
    title: 'Кофейня',
    description: 'Работа за ноутом',
    prompt: 'Aesthetic photo of the person from the photo working on laptop in a stylish minimalist coffee shop. CRUCIAL: Maintain exact facial identity. Photorealistic style.',
    image: '/templates/blogger-coffee.jpg'
  },
  {
    id: 'blogger-travel',
    category: 'bloggers',
    title: 'Тревел-блог',
    description: 'Тропики',
    prompt: 'Travel blogger style. Show the person from the photo holding a coconut on a tropical beach with palm trees. CRUCIAL: Keep the face exactly identical. Photorealistic style.',
    image: '/templates/blogger-travel.jpg'
  },
  {
    id: 'blogger-fashion',
    category: 'bloggers',
    title: 'Стритстайл',
    description: 'Городская мода',
    prompt: 'Fashion blogger street style photo. Show the person from the photo walking down a city street, holding a coffee cup, stylish outfit. CRUCIAL: Preserve facial identity. Photorealistic style.',
    image: '/templates/blogger-fashion.jpg'
  },
  {
    id: 'blogger-fitness',
    category: 'bloggers',
    title: 'Йога Блог',
    description: 'ЗОЖ',
    prompt: 'Fitness blogger. Show the person from the photo doing yoga in a bright studio with plants. Athletic wear. CRUCIAL: Maintain exact facial identity. Photorealistic style.',
    image: '/templates/blogger-fitness.jpg'
  },
  {
    id: 'blogger-food',
    category: 'bloggers',
    title: 'Фуд-блог',
    description: 'Обзор еды',
    prompt: 'Show the person from the photo sitting at a table full of delicious brunch food, holding a fork, smiling. CRUCIAL: Keep the face exactly identical. Photorealistic style.',
    image: '/templates/blogger-food.jpg'
  },
  {
    id: 'blogger-car',
    category: 'bloggers',
    title: 'Авто-блог',
    description: 'За рулем',
    prompt: 'Car vlogger style. Show the person from the photo sitting in the driver seat of a luxury car, hands on steering wheel. CRUCIAL: Preserve facial identity. Photorealistic style.',
    image: '/templates/blogger-car.jpg'
  },
  {
    id: 'blogger-minimal',
    category: 'bloggers',
    title: 'Рабочее место',
    description: 'Минимализм',
    prompt: 'Minimalist aesthetic lifestyle shot. Show the person from the photo sitting at a clean white desk with a macbook and plant. CRUCIAL: Maintain exact facial identity. Photorealistic style.',
    image: '/templates/blogger-minimal.jpg'
  },
  {
    id: 'blogger-party',
    category: 'bloggers',
    title: 'Вечеринка',
    description: 'Ночная жизнь',
    prompt: 'Lifestyle party shot. Show the person from the photo on a rooftop bar at night with city lights, holding a drink. CRUCIAL: Keep the face exactly identical. Photorealistic style.',
    image: '/templates/blogger-party.jpg'
  },

  // --- RICH LIFE CATEGORY ---
  {
    id: 'rich-jet',
    category: 'rich_life',
    title: 'Частный Джет',
    description: 'Первый класс',
    prompt: 'Place the person in a luxury private jet cabin with leather cream seats and champagne. CRUCIAL: Preserve the facial features exactly. Photorealistic style, detailed skin texture.',
    image: '/templates/rich-jet.jpg'
  },
  {
    id: 'rich-yacht',
    category: 'rich_life',
    title: 'Яхта',
    description: 'Океан',
    prompt: 'Place the person on the deck of a luxury superyacht in the ocean. White clothes, sunglasses, blue water. CRUCIAL: Maintain exact facial identity. Photorealistic style.',
    image: '/templates/rich-yacht.jpg'
  },
  {
    id: 'rich-villa',
    category: 'rich_life',
    title: 'Вилла',
    description: 'Инфинити бассейн',
    prompt: 'Place the person in a luxury infinity pool at a modern villa overlooking the sea at sunset. CRUCIAL: Keep the face exactly identical. Photorealistic style.',
    image: '/templates/rich-villa.jpg'
  },
  {
    id: 'rich-supercar',
    category: 'rich_life',
    title: 'Суперкар',
    description: 'Lamborghini',
    prompt: 'Person leaning against a bright lime green Lamborghini supercar. Urban background. CRUCIAL: Preserve facial identity. Photorealistic style.',
    image: '/templates/rich-supercar.jpg'
  },
  {
    id: 'rich-penthouse',
    category: 'rich_life',
    title: 'Пентхаус',
    description: 'Вид на город',
    prompt: 'Person standing near floor-to-ceiling windows in a luxury penthouse apartment with night city skyline view. CRUCIAL: Maintain exact facial identity. Photorealistic style.',
    image: '/templates/rich-penthouse.jpg'
  },
  {
    id: 'rich-shopping',
    category: 'rich_life',
    title: 'Шопинг',
    description: 'Брендовые пакеты',
    prompt: 'Person walking carrying many luxury brand shopping bags (Gucci, LV, Prada). High-end street. CRUCIAL: Keep the face exactly identical. Photorealistic style.',
    image: '/templates/rich-shopping.jpg'
  },
  {
    id: 'rich-champagne',
    category: 'rich_life',
    title: 'Шампанское',
    description: 'Бокал Crystal',
    prompt: 'Close up of person holding a crystal glass of expensive champagne at a gala dinner. CRUCIAL: Preserve facial identity. Photorealistic style.',
    image: '/templates/rich-champagne.jpg'
  },
  {
    id: 'rich-helicopter',
    category: 'rich_life',
    title: 'Вертолет',
    description: 'Полет над городом',
    prompt: 'Person sitting in a helicopter with headsets on, looking out the window at the view. CRUCIAL: Maintain exact facial identity. Photorealistic style.',
    image: '/templates/rich-helicopter.jpg'
  },
  {
    id: 'rich-golf',
    category: 'rich_life',
    title: 'Гольф',
    description: 'Закрытый клуб',
    prompt: 'Person posing on a pristine golf course with a golf club. Country club atmosphere. CRUCIAL: Keep the face exactly identical. Photorealistic style.',
    image: '/templates/rich-golf.jpg'
  },
  {
    id: 'rich-watch',
    category: 'rich_life',
    title: 'Часы',
    description: 'Rolex на руке',
    prompt: 'Focus on a luxury gold watch on the person\'s wrist. Driving a luxury car or in a suit. Photorealistic style.',
    image: '/templates/rich-watch.jpg'
  },

  // --- FAMILY CATEGORY (REFINED PROMPTS) ---
  {
    id: 'family-addams',
    category: 'family',
    title: 'Семейка Аддамс',
    description: 'Готический стиль',
    prompt: 'Transform the specific family/group from the uploaded photo into a dark, elegant gothic masterpiece. High-contrast cinematic lighting. Everyone dressed in high-quality black velvet and lace formal wear. CRUCIAL: Each person in the output must have a 100% identical face to their counterpart in the original photo. No AI face genericizing. Detailed skin texture, photorealistic, professional dark studio atmosphere. Maintain individual heights and positions.',
    image: '/templates/family-addams.jpg'
  },
  {
    id: 'family-wild-west',
    category: 'family',
    title: 'Дикий Запад',
    description: 'Ковбои',
    prompt: 'CRUCIAL: Preserve facial identity exactly. Dress the group as cowboys and sheriffs. Hats, leather vests, boots. Background: old western saloon. Photorealistic style.',
    image: '/templates/family-wild-west.jpg'
  },
  {
    id: 'family-vikings',
    category: 'family',
    title: 'Викинги',
    description: 'Воины севера',
    prompt: 'CRUCIAL: Preserve facial identity exactly. Dress everyone as fierce vikings with furs, leather armor, and horned helmets. Background: misty fjord. Photorealistic style.',
    image: '/templates/family-vikings.jpg'
  },
  {
    id: 'family-royal',
    category: 'family',
    title: 'Королевская семья',
    description: 'Ренессанс',
    prompt: 'CRUCIAL: Preserve facial identity exactly. Dress everyone in luxurious renaissance royal clothes, velvet robes, crowns. Background: palace throne room. Photorealistic style.',
    image: '/templates/family-royal.jpg'
  },
  {
    id: 'family-pajamas',
    category: 'family',
    title: 'Пижамная вечеринка',
    description: 'Кигуруми',
    prompt: 'CRUCIAL: Preserve facial identity exactly. Dress everyone in matching funny colorful animal onesies (kigurumi). Background: cozy bedroom. Photorealistic style.',
    image: '/templates/family-pajamas.jpg'
  },
  {
    id: 'family-space',
    category: 'family',
    title: 'Космос',
    description: 'Экипаж корабля',
    prompt: 'CRUCIAL: Preserve facial identity exactly. Dress everyone in futuristic sci-fi space uniforms. Background: spaceship bridge with stars. Photorealistic style.',
    image: '/templates/family-space.jpg'
  },
  {
    id: 'family-cavemen',
    category: 'family',
    title: 'Пещерные люди',
    description: 'Каменный век',
    prompt: 'CRUCIAL: Preserve facial identity exactly. Dress everyone in leopard prints and animal furs, holding wooden clubs. Background: stone cave. Photorealistic style.',
    image: '/templates/family-cavemen.jpg'
  },
  {
    id: 'family-classic',
    category: 'family',
    title: 'Классика',
    description: 'Семейная студия',
    prompt: 'Professional classic family portrait in a studio setting. Neutral background, elegant but casual attire, warm smiles, soft lighting. CRUCIAL: All individuals must retain 100% identical facial features and expressions from the original photo. Photorealistic 8k.',
    image: '/templates/family-classic.jpg'
  },
  {
    id: 'family-zombies',
    category: 'family',
    title: 'Зомби',
    description: 'Апокалипсис',
    prompt: 'CRUCIAL: Preserve facial identity exactly. Turn the family into funny green zombies. Background: abandoned city.',
    image: '/templates/family-zombies.jpg'
  },
  {
    id: 'family-cartoon',
    category: 'family',
    title: 'Симпсоны',
    description: 'Мультфильм',
    prompt: 'Transform the image into a famous 2D cartoon style with yellow skin. Background: suburban living room.',
    image: '/templates/family-cartoon.jpg'
  },

  // --- DOCUMENTS CATEGORY ---
  {
    id: 'passport',
    category: 'documents',
    title: 'На паспорт',
    description: 'Белый фон, официально',
    prompt: 'Generate a professional passport photo of the person from the uploaded image. CRUCIAL: Keep the face exactly identical to the original photo. Do not alter facial features. Apply a clean, even white background. Soft, balanced lighting, formal appearance. Photorealistic style, detailed skin texture.',
    image: '/templates/passport.jpg'
  },
  {
    id: 'resume-office',
    category: 'documents',
    title: 'Для резюме',
    description: 'Офисный стиль',
    prompt: 'Show the person from the photo in a professional business suit. CRUCIAL: Maintain exact facial identity. Background: blurred modern office environment. Soft professional lighting, confident look. Photorealistic style, detailed skin texture.',
    image: '/templates/resume-office.jpg'
  },
  {
    id: 'resume-studio',
    category: 'documents',
    title: 'Деловой портрет',
    description: 'Серый фон',
    prompt: 'Studio business portrait of the person from the photo. CRUCIAL: Do not change the face. Keep facial features exactly as in the original. Neutral grey gradient background. Rembrandt lighting. Photorealistic style, detailed skin texture.',
    image: '/templates/resume-studio.jpg'
  },

  // --- ECOMMERCE CATEGORY ---
  {
    id: 'product-podium',
    category: 'ecommerce',
    title: '3D Подиум',
    description: 'Минимализм',
    prompt: 'Place product on stylish minimalist 3D podium. Pastel colors, soft shadows. Photorealistic product photography.',
    image: '/templates/product-podium.jpg'
  },
  {
    id: 'product-nature',
    category: 'ecommerce',
    title: 'Природа',
    description: 'Камни и мох',
    prompt: 'Product photography on nature. Mossy stones, sunlight, bokeh. Organic vibe. Photorealistic.',
    image: '/templates/product-nature.jpg'
  },
  {
    id: 'product-luxury',
    category: 'ecommerce',
    title: 'Премиум',
    description: 'Черное и золото',
    prompt: 'Luxury product photography. Black background with golden accents and dramatic lighting, premium look. Photorealistic.',
    image: '/templates/product-luxury.jpg'
  },

  // --- BUSINESS CATEGORY ---
  {
    id: 'business-startup',
    category: 'business',
    title: 'Стартап',
    description: 'Современный офис',
    prompt: 'Business portrait in a modern startup office. Glass walls, casual professional attire, confident smile. CRUCIAL: Keep the face exactly identical. Photorealistic style, detailed skin texture.',
    image: '/templates/business-startup.jpg'
  },
  {
    id: 'business-speech',
    category: 'business',
    title: 'Выступление',
    description: 'На сцене',
    prompt: 'Person giving a business presentation on stage. Ted talk style, spotlight, screen in background. CRUCIAL: Preserve facial identity. Photorealistic style.',
    image: '/templates/business-speech.jpg'
  },

  // --- UGC CATEGORY ---
  {
    id: 'ugc-unboxing',
    category: 'ugc',
    title: 'Анпакинг',
    description: 'Распаковка',
    prompt: 'UGC style photo of person unboxing a package. Excited expression, hands visible, living room background. CRUCIAL: Keep the face exactly identical. Photorealistic style.',
    image: '/templates/ugc-unboxing.jpg'
  },
  {
    id: 'ugc-review',
    category: 'ugc',
    title: 'Отзыв',
    description: 'Лайк товару',
    prompt: 'UGC product review. Person holding a product close to camera, thumbs up, domestic setting. CRUCIAL: Preserve facial identity. Photorealistic style.',
    image: '/templates/ugc-review.jpg'
  },

  // --- STYLE TRENDS & ARTISTIC (NEW ADDITIONS) ---
  {
    id: 'soviet-retro',
    category: 'retro',
    title: 'Советское Ретро',
    description: 'Ностальгия',
    prompt: 'Vintage Soviet era portrait photography style. Warm nostalgic colors, subtle film grain, authentic 70s-80s apparel. Soft natural lighting. CRUCIAL: Preserve facial identity exactly. Photorealistic style.',
    image: getPreviewUrl('vintage soviet portrait photography 70s 80s', 3001)
  },
  {
    id: 'cyberpunk-city',
    category: 'style_trends',
    title: 'Cyberpunk',
    description: 'Неон и Город',
    prompt: 'Futuristic cyberpunk city portrait. Neon lights, rain, high-tech clothing, mechanical enhancements. Night atmosphere. CRUCIAL: Preserve facial identity. High contrast, cinematic.',
    image: '/templates/cyberpunk-city.jpg'
  },
  {
    id: 'watercolor-art',
    category: 'style_trends',
    title: 'Акварель',
    description: 'Нежный арт',
    prompt: 'Soft watercolor painting portrait. Pastel colors, paper texture, artistic brush strokes. Dreamy and romantic. CRUCIAL: Keep the face recognizable but artistic.',
    image: '/templates/watercolor-art.jpg'
  },
  {
    id: 'pencil-sketch',
    category: 'style_trends',
    title: 'Карандаш',
    description: 'Набросок',
    prompt: 'Realistic graphite pencil sketch on textured paper. Detailed shading, cross-hatching. Artistic monochrome. CRUCIAL: Preserve facial identity.',
    image: '/templates/pencil-sketch.jpg'
  },
  {
    id: 'oil-painting',
    category: 'style_trends',
    title: 'Масло',
    description: 'Классика',
    prompt: 'Classic oil painting portrait. Visible brushstrokes, rich colors, canvas texture. Renaissance or classical art style. CRUCIAL: Keep the face recognizable.',
    image: '/templates/oil-painting.jpg'
  },
  {
    id: 'polaroid-vintage',
    category: 'style_trends',
    title: 'Полароид',
    description: '90-е вайб',
    prompt: 'Vintage Polaroid photo style. Flash photography, slightly washed out colors, vignetting, retro vibe. CRUCIAL: Preserve facial identity.',
    image: '/templates/polaroid-vintage.jpg'
  },
  {
    id: 'neon-noir',
    category: 'style_trends',
    title: 'Неон Нуар',
    description: 'Мистика',
    prompt: 'Cinematic neon noir portrait. Dark shadows, contrasting blue and pink neon lighting, moody atmosphere. Mystery thriller vibe. CRUCIAL: Preserve facial identity.',
    image: '/templates/neon-noir.jpg'
  },
  {
    id: 'studio-bw',
    category: 'style_trends',
    title: 'Ч/Б Портрет',
    description: 'Студия',
    prompt: 'Professional black and white studio photography. High contrast, dramatic lighting, sharp details. Elegant and timeless. CRUCIAL: Preserve facial identity.',
    image: '/templates/studio-bw.jpg'
  },
  {
    id: 'double-exposure',
    category: 'style_trends',
    title: 'Double Exposure',
    description: 'Сюрреализм',
    prompt: 'Artistic double exposure portrait combining face with a forest or city landscape. Surreal and dreamy. Silhouette effect. CRUCIAL: Keep the face recognizable.',
    image: '/templates/double-exposure.jpg'
  },
  {
    id: 'pop-art',
    category: 'style_trends',
    title: 'Поп-арт',
    description: 'Уорхол',
    prompt: 'Pop Art style portrait. Bright contrasting colors, halftone dots, comic book style outlines. Andy Warhol style. CRUCIAL: Keep the face recognizable.',
    image: '/templates/pop-art.jpg'
  },
  {
    id: 'cinematic-film',
    category: 'style_trends',
    title: 'Кинокадр',
    description: 'Фильм',
    prompt: 'Cinematic film still. Wide aspect ratio, teal and orange color grading, grain, depth of field. Movie scene look. CRUCIAL: Preserve facial identity.',
    image: '/templates/cinematic-film.jpg'
  },
  {
    id: 'anime-style',
    category: 'style_trends',
    title: 'Аниме',
    description: 'Япония',
    prompt: 'High quality anime style portrait. Vibrant colors, big expressive eyes, cel shading. Makoto Shinkai background style. CRUCIAL: Keep key facial features recognizable.',
    image: '/templates/anime-style.jpg'
  },
  {
    id: 'clay-3d',
    category: 'style_trends',
    title: '3D Пластилин',
    description: 'Claymorphism',
    prompt: 'cute 3d clay character portait made of plasticine. visible fingerprints, stop motion animation style, soft lighting, vibrant colors. CRUCIAL: recognizable facial features adapted to clay style.',
    image: '/templates/clay-3d.jpg'
  },
  {
    id: 'pixel-art',
    category: 'style_trends',
    title: 'Пиксель Арт',
    description: 'Ретро игры',
    prompt: 'Pixel art portrait. 16-bit retro game style. Limited color palette, blocky pixels. CRUCIAL: Recognizable features in pixel form.',
    image: '/templates/pixel-art.jpg'
  },
  {
    id: 'gothic-fantasy',
    category: 'style_trends',
    title: 'Готика',
    description: 'Темная магия',
    prompt: 'dark gothic fantasy portrait. pale skin, dramatic black lace dress, mysterious ancient castle background, candle lighting, melancholic atmosphere. photorealistic.',
    image: '/templates/gothic-fantasy.jpg'
  },

  // --- RETRO PHOTO COLLECTION ---
  {
    id: 'retro-polaroid-classic',
    category: 'retro',
    title: 'Classic Polaroid',
    description: '600 Series',
    prompt: 'Authentic vintage Polaroid photo. Square white border, slightly washed out colors, high contrast flash lighting, chemical texture. CRUCIAL: Preserve facial identity. Photorealistic.',
    image: '/templates/retro-polaroid-classic.jpg'
  },
  {
    id: 'retro-kodachrome-50s',
    category: 'retro',
    title: 'Kodachrome',
    description: '1950s Style',
    prompt: '1950s Kodachrome color film photography. Rich saturated reds and blues, fine grain, cinematic lighting, mid-century fashion. CRUCIAL: Preserve facial identity. Photorealistic.',
    image: '/templates/retro-kodachrome-50s.jpg'
  },
  {
    id: 'retro-film-noir',
    category: 'retro',
    title: 'Film Noir',
    description: '1940s Monochrome',
    prompt: 'Classic 1940s film noir black and white photography. Dramatic low-key lighting, deep shadows, smoke, fedora hat, hard light. CRUCIAL: Preserve facial identity. High contrast monochrome.',
    image: '/templates/retro-film-noir.jpg'
  },
  {
    id: 'retro-flash-90s',
    category: 'retro',
    title: '90s Party',
    description: 'Night Flash',
    prompt: 'Retro 90s party photography. Direct camera flash, red-eye effect, high saturation, messy background, vintage fashion. CRUCIAL: Preserve facial identity. Photorealistic.',
    image: '/templates/retro-flash-90s.jpg'
  },
  {
    id: 'retro-vhs-grain',
    category: 'retro',
    title: 'VHS Aesthetic',
    description: '80s Home Video',
    prompt: '80s VHS home video screen capture. Magnetic tape distortion, tracking lines, color bleeding, low resolution, date stamp in corner. CRUCIAL: Preserve facial identity.',
    image: '/templates/retro-vhs-grain.jpg'
  },
  {
    id: 'retro-daguerreotype',
    category: 'retro',
    title: 'Daguerreotype',
    description: '19th Century',
    prompt: 'Antique 19th-century daguerreotype portrait. Silver plate texture, scratches, sepia tones, long exposure blur, Victorian clothing. CRUCIAL: Preserve facial identity in antique style.',
    image: '/templates/retro-daguerreotype.jpg'
  },
  {
    id: 'retro-technicolor',
    category: 'retro',
    title: 'Technicolor',
    description: 'Golden Age',
    prompt: 'Golden Age of Hollywood Technicolor photography. Vibrant surreal colors, perfect studio lighting, glamorous makeup, sharp details. CRUCIAL: Preserve facial identity. Photorealistic.',
    image: '/templates/retro-technicolor.jpg'
  },
  {
    id: 'retro-seventies-dream',
    category: 'retro',
    title: '70s Dream',
    description: 'Soft & Warm',
    prompt: '1970s soft focus film photography. Warm golden hour lighting, flared lens, faded edges, bohemian style, grainy. CRUCIAL: Preserve facial identity. Photorealistic.',
    image: '/templates/retro-seventies-dream.jpg'
  },
  {
    id: 'retro-magazine-80s',
    category: 'retro',
    title: '80s Magazine',
    description: 'Pop Style',
    prompt: '1980s fashion magazine cover style. Bright colors, hairspray volume, bold makeup, hazy background, high grain. CRUCIAL: Preserve facial identity. Photorealistic.',
    image: '/templates/retro-magazine-80s.jpg'
  },
  {
    id: 'retro-western-sepia',
    category: 'retro',
    title: 'Wild West',
    description: 'Sepia Print',
    prompt: 'Old Wild West wanted poster style. Heavy paper texture, sepia monochrome, rough edges, weathered look. CRUCIAL: Preserve facial identity.',
    image: '/templates/retro-western-sepia.jpg'
  },
  {
    id: 'retro-candid-film',
    category: 'retro',
    title: 'Candid Film',
    description: 'Everyday Life',
    prompt: 'Modern candid film photography (Leica style). Natural grain, everyday setting, authentic expression, soft contrast. CRUCIAL: Preserve facial identity. Photorealistic.',
    image: '/templates/retro-candid-film.jpg'
  },
  {
    id: 'retro-album-cover',
    category: 'retro',
    title: 'Album Cover',
    description: 'Artistic Retro',
    prompt: 'Vintage vinyl album cover aesthetic. Artistic composition, muted color palette, grain, high-end retro styling. CRUCIAL: Preserve facial identity.',
    image: '/templates/retro-album-cover.jpg'
  },


  // --- SOVIET MOVIES SPECIAL ---
  {
    id: 'soviet-irony-fate',
    category: 'retro',
    title: 'Ирония Судьбы',
    description: 'Надя / Женя',
    prompt: 'Cinematic portrait in the style of the movie "Irony of Fate" (1975). Retro Soviet apartment interior. Wearing a fur hat or beige dress. Soft film grain, warm nostalgic lighting. Group compatible. Preserve identity of ALL faces in the reference. High fidelity face swap.',
    image: '/templates/soviet-irony-fate.jpg'
  },
  {
    id: 'soviet-carnival-night',
    category: 'retro',
    title: 'Карнавальная Ночь',
    description: 'Леночка Крылова',
    prompt: 'Portrait in the style of "Carnival Night" (1956). Wearing a black dress with white muff/collar, standing on a stage with festive clock background. 50s musical vibe, bright stage lights. Group compatible. Preserve identity of ALL faces in the reference. High fidelity face swap.',
    image: '/templates/soviet-carnival-night.jpg'
  },
  {
    id: 'soviet-morozko',
    category: 'retro',
    title: 'Морозко',
    description: 'Сказка',
    prompt: 'Fairy tale portrait in the style of "Morozko" (1964). Russian winter folklore costume, Kokoshnik or warm shawl. Snowy magical forest background. Frosty cheeks. Magical atmosphere. Group compatible. Preserve identity of ALL faces in the reference. High fidelity face swap.',
    image: '/templates/soviet-morozko.jpg'
  },
  {
    id: 'soviet-charodei',
    category: 'retro',
    title: 'Чародеи',
    description: 'НУИНУ',
    prompt: 'Portrait in the style of "Charodei" (1982). White suit or sweater, Soviet institute corridor/hall. Sparkles and mystery. 80s Soviet aesthetic. Group compatible. Preserve identity of ALL faces in the reference. High fidelity face swap.',
    image: '/templates/soviet-charodei.jpg'
  },
  {
    id: 'soviet-ivan-vasilievich',
    category: 'retro',
    title: 'Иван Васильевич',
    description: 'Царские палаты',
    prompt: 'Portrait in the style of "Ivan Vasilievich Changes Profession" (1973). Wearing a royal red kaftan and Monomakh\'s Cap (or boyar clothes). Kremlin chambers background. Cinematic comedy style. Group compatible. Preserve identity of ALL faces in the reference. High fidelity face swap.',
    image: '/templates/soviet-ivan-vasilievich.jpg'
  },
  {
    id: 'soviet-gentlemen',
    category: 'retro',
    title: 'Джентльмены',
    description: 'Удачи',
    prompt: 'Portrait in the style of "Gentlemen of Fortune" (1971). Winter setting, wearing a sheepskin coat or heavy fur hat. Snowy Soviet street background. Comedy film aesthetic. Group compatible. Preserve identity of ALL faces in the reference. High fidelity face swap.',
    image: '/templates/soviet-gentlemen.jpg'
  },

  // --- MAKEUP CATEGORY ---
  {
    id: 'makeup-nude',
    category: 'makeup',
    title: 'Нюд (Nude)',
    description: 'Без макияжа',
    prompt: 'Apply a natural "no-makeup" makeup look to the person. Glowing skin, light mascara, clear gloss, neat eyebrows, soft peach blush. CRUCIAL: Keep the face completely recognizable. Photorealistic style, detailed skin texture.',
    image: '/templates/makeup-nude.jpg'
  },
  {
    id: 'makeup-hollywood',
    category: 'makeup',
    title: 'Голливуд',
    description: 'Красная помада',
    prompt: 'Apply classic Hollywood makeup. Bright red lipstick, black winged eyeliner, perfect matte skin, defined lashes. CRUCIAL: Preserve the facial features exactly. Photorealistic style, detailed skin texture.',
    image: '/templates/makeup-hollywood.jpg'
  },
  {
    id: 'makeup-smokey',
    category: 'makeup',
    title: 'Смоки Айс',
    description: 'Вечерний',
    prompt: 'Apply dramatic black smokey eye makeup, nude matte lips, and defined cheekbone contouring. CRUCIAL: Maintain exact facial identity. Photorealistic style.',
    image: '/templates/makeup-smokey.jpg'
  },
  {
    id: 'makeup-euphoria',
    category: 'makeup',
    title: 'Эйфория',
    description: 'Стразы и блеск',
    prompt: 'Apply creative Euphoria-style makeup with glitter, face gems near eyes, and purple/blue eyeshadows. CRUCIAL: Keep the face exactly identical. Photorealistic style.',
    image: '/templates/makeup-euphoria.jpg'
  },
  {
    id: 'makeup-kbeauty',
    category: 'makeup',
    title: 'K-Beauty',
    description: 'Корейский стиль',
    prompt: 'Apply Korean beauty style makeup. Glass skin effect, gradient fruit-colored lips, soft straight brows, coral blush. CRUCIAL: Preserve facial identity. Photorealistic style.',
    image: '/templates/makeup-kbeauty.jpg'
  },
  {
    id: 'makeup-goth',
    category: 'makeup',
    title: 'Готика',
    description: 'Темные губы',
    prompt: 'Apply gothic makeup style. Dark burgundy or black lipstick, pale skin, heavy black eyeliner, grunge aesthetic. CRUCIAL: Maintain exact facial identity. Photorealistic style.',
    image: '/templates/makeup-goth.jpg'
  },
  {
    id: 'makeup-instaglam',
    category: 'makeup',
    title: 'Insta Glam',
    description: 'Контуринг',
    prompt: 'Apply full glam Instagram makeup. Heavy contouring, baking, cut crease eyeshadow, matte liquid lipstick, long false lashes. CRUCIAL: Keep the face recognizable. Photorealistic style.',
    image: '/templates/makeup-instaglam.jpg'
  },
  {
    id: 'makeup-cyberpunk',
    category: 'makeup',
    title: 'Киберпанк',
    description: 'Неон',
    prompt: 'Apply futuristic cyberpunk makeup. Neon graphic eyeliner, metallic highlighter on cheekbones, silver lip gloss. CRUCIAL: Preserve facial identity. Photorealistic style.',
    image: '/templates/makeup-cyberpunk.jpg'
  },
  {
    id: 'makeup-sunkissed',
    category: 'makeup',
    title: 'Поцелуй солнца',
    description: 'Загар и веснушки',
    prompt: 'Apply a sunkissed makeup look. Bronzer, warm blush across nose, faux freckles, golden highlighter. CRUCIAL: Maintain exact facial identity. Photorealistic style.',
    image: '/templates/makeup-sunkissed.jpg'
  },
  {
    id: 'makeup-vamp',
    category: 'makeup',
    title: 'Вамп',
    description: 'Роковая',
    prompt: 'Apply a dark seductive vamp look. Sharp contour, dark red lips, intense gaze, slight smokey eye. CRUCIAL: Keep the face exactly identical. Photorealistic style.',
    image: '/templates/makeup-vamp.jpg'
  },
  {
    id: 'makeup-bridal',
    category: 'makeup',
    title: 'Свадебный',
    description: 'Нежный образ',
    prompt: 'Apply soft, romantic bridal makeup to the person. Glowing skin, soft pink blush, defined lashes, nude glossy lips. CRUCIAL: Preserve facial identity exactly. Photorealistic style, detailed natural skin texture. White veil background hint.',
    image: '/templates/makeup-bridal.jpg'
  },
  {
    id: 'makeup-festival',
    category: 'makeup',
    title: 'Фестиваль',
    description: 'Бохо шик',
    prompt: 'Apply colorful festival makeup. Face jewels, glitter on cheeks, bright eyeshadow accents. CRUCIAL: Maintain exact facial identity. Photorealistic style. Boho chic vibe.',
    image: '/templates/makeup-festival.jpg'
  },
  {
    id: 'makeup-retro-50s',
    category: 'makeup',
    title: 'Ретро 50-х',
    description: 'Пин-ап',
    prompt: 'Apply 1950s pin-up style makeup. Defined brows, winged eyeliner, bold matte red lipstick. CRUCIAL: Keep the face recognizable. Photorealistic style. Vintage aesthetic.',
    image: '/templates/makeup-retro-50s.jpg'
  },
  {
    id: 'makeup-neon-graphic',
    category: 'makeup',
    title: 'Графика',
    description: 'Яркие стрелки',
    prompt: 'Apply graphic neon eyeliner designs in bright green or pink. Minimalist skin, bold eyes. CRUCIAL: Preserve facial identity. Photorealistic style. Edgy modern look.',
    image: '/templates/makeup-neon-graphic.jpg'
  },
  {
    id: 'makeup-soft-glam',
    category: 'makeup',
    title: 'Soft Glam',
    description: 'Мягкий гламур',
    prompt: 'Apply soft glam makeup. Neutral eyeshadow tones, shimmery lid, glossy lips, soft contour. CRUCIAL: Maintain exact facial identity. Photorealistic style. Perfect for date night.',
    image: '/templates/makeup-soft-glam.jpg'
  },
  {
    id: 'makeup-fantasy-mermaid',
    category: 'makeup',
    title: 'Русалка',
    description: 'Фэнтези',
    prompt: 'Apply fantasy mermaid makeup. Iridescent scales on cheekbones, blue and purple hues, wet look skin. CRUCIAL: Keep the face recognizable. Photorealistic style. Aquatic vibe.',
    image: '/templates/makeup-fantasy-mermaid.jpg'
  },
  {
    id: 'makeup-editorial-avantgarde',
    category: 'makeup',
    title: 'Авангард',
    description: 'Арт-макияж',
    prompt: 'Apply avant-garde editorial makeup. Unique shapes, bold colors, artistic expression. CRUCIAL: Preserve facial identity. Photorealistic style. High fashion magazine look.',
    image: '/templates/makeup-editorial-avantgarde.jpg'
  },
  {
    id: 'makeup-grunge-90s',
    category: 'makeup',
    title: 'Гранж 90-х',
    description: 'Небрежность',
    prompt: 'Apply 90s grunge makeup. Smudged black eyeliner, matte brown lipstick, matte skin. CRUCIAL: Maintain exact facial identity. Photorealistic style. Rock chic vibe.',
    image: '/templates/makeup-grunge-90s.jpg'
  },
  {
    id: 'makeup-glass-skin',
    category: 'makeup',
    title: 'Glass Skin',
    description: 'Сияние',
    prompt: 'Focus on perfect "Glass Skin" makeup. Ultra-hydrated, dewy, reflective skin texture, minimal eye makeup. CRUCIAL: Keep the face recognizable. Photorealistic style.',
    image: '/templates/makeup-glass-skin.jpg'
  },
  {
    id: 'makeup-glitter-tears',
    category: 'makeup',
    title: 'Глиттер',
    description: 'Блестящие слезы',
    prompt: 'Apply glitter tears makeup. Glitter trails falling from eyes like tears. Emotional and artistic. CRUCIAL: Preserve facial identity. Photorealistic style.',
    image: '/templates/makeup-glitter-tears.jpg'
  }
];





const TemplateGrid: React.FC<TemplateGridProps> = ({ category, onSelect }) => {
  const filteredPresets = ALL_PRESETS.filter(preset => {
    if (category === 'all') return true;
    if (category === 'trending') return ['retro-polaroid-classic', 'tet-traditional-yellow', 'market-shopee-hero', 'kids-dinosaur', 'makeup-bridal'].includes(preset.id);
    if (category === 'new') return ['retro-vhs-grain', 'market-fb-minimal', 'market-insta-story', 'tet-hoi-an', 'kids-chef', 'makeup-festival'].includes(preset.id);
    if (category === 'saved') return false;
    return preset.category === category;
  });

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {filteredPresets.map((preset) => (
        <button
          key={preset.id}
          onClick={() => onSelect(preset)}
          className="group relative flex flex-col rounded-xl overflow-hidden border border-brand-border bg-white shadow-sm hover:shadow-xl hover:border-brand-accent transition-all duration-300 text-left h-full"
        >
          {/* Image */}
          <div className="aspect-[3/4] relative overflow-hidden bg-gray-100">
            <img
              src={preset.image || FALLBACK_IMAGES[preset.category] || FALLBACK_IMAGES.default}
              alt={preset.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />

            {/* Hover Action Overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-brand-accent shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 flex flex-col gap-1 bg-white border-t border-brand-border/30 grow">
            <h3 className="text-brand-text font-bold text-sm md:text-base leading-tight group-hover:text-brand-accent transition-colors">
              {preset.title}
            </h3>
            <p className="text-xs text-brand-muted line-clamp-2">
              {preset.description}
            </p>
          </div>
        </button>
      ))}

      {filteredPresets.length === 0 && (
        <div className="col-span-full flex flex-col items-center justify-center py-12 text-center text-brand-muted">
          <Sparkles className="w-12 h-12 mb-4 opacity-20" />
          <p>В этой категории пока нет шаблонов.</p>
          <p className="text-xs mt-1 opacity-50">Загляните позже.</p>
        </div>
      )}
    </div>
  );
};

export default TemplateGrid;
```

## `components/PricingModal.tsx`

```tsx

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
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-[10px] font-bold px-5 py-2 rounded-full shadow-lg shadow-primary/30 whitespace-nowrap uppercase tracking-widest z-20">Хит Продаж</div>
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
                    <button onClick={() => !isCurrent && handlePurchase(plan)} disabled={!!processing || isCurrent} className={`w-full py-5 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2 uppercase tracking-[0.2em] ${isCurrent ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-default' : plan.isPopular ? 'bg-primary text-white hover:bg-blue-600 hover:shadow-xl hover:shadow-primary/20 active:scale-95' : plan.id === 'free' ? 'bg-slate-50 dark:bg-slate-800 text-slate-500 hover:bg-slate-100' : 'bg-slate-900 dark:bg-white dark:text-slate-900 text-white hover:bg-black active:scale-95'}`}>
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
```

## `components/UserProfileModal.tsx`

```tsx

import React, { useState, useEffect } from 'react';
import { X, User, Settings, LogOut, Zap, History, Image, CreditCard, Lock, Mail, CheckCircle2, XCircle, Code, Copy, RefreshCw, Key, Eye as EyeIcon } from 'lucide-react';
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
type AuthMode = 'login' | 'register' | 'forgot';

const TIER_LABELS: Record<SubscriptionTier, string> = {
    'free': 'Free Plan',
    'creator': 'Creator',
    'pro': 'Pro Member',
    'business': 'Business'
};

const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose, credits, userTier }) => {
    const [activeTab, setActiveTab] = useState<Tab>('overview');
    const { user, signInWithGoogle, loginWithEmail, registerWithEmail, logout, resetPassword } = useAuth();

    // Auth Form State
    const [authMode, setAuthMode] = useState<AuthMode>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);
    const [authSuccess, setAuthSuccess] = useState<string | null>(null);

    // API Key State
    const [apiKey, setApiKey] = useState<string | null>(null);
    const [isKeyVisible, setIsKeyVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setAuthError(null);
            setAuthSuccess(null);
            setPassword('');
            setConfirmPassword('');
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
        setAuthError(null);
        setAuthSuccess(null);

        if (authMode === 'forgot') {
            if (!email) { setAuthError("Введите email"); return; }
            setIsSubmitting(true);
            try {
                await resetPassword(email);
                setAuthSuccess("Инструкции по сбросу пароля отправлены на ваш email.");
            } catch (err: any) {
                setAuthError("Ошибка: " + (err.message || "Не удалось сбросить пароль"));
            } finally {
                setIsSubmitting(false);
            }
            return;
        }

        if (!email || !password) { setAuthError("Заполните поля"); return; }

        if (authMode === 'register') {
            if (password !== confirmPassword) {
                setAuthError("Пароли не совпадают");
                return;
            }
            if (password.length < 6) {
                setAuthError("Пароль должен быть не менее 6 символов");
                return;
            }
        }

        setIsSubmitting(true);
        try {
            if (authMode === 'login') {
                await loginWithEmail(email, password);
                onClose();
            } else {
                await registerWithEmail(email, password, fullName);
                setAuthSuccess("Аккаунт создан! Проверьте почту для подтверждения email.");
                // Optional: Don't close immediately so they see the message
                setTimeout(() => onClose(), 3000);
            }
        } catch (err: any) {
            console.error(err);
            if (err.message === "unverified-email") {
                setAuthError("Email не подтвержден. Проверьте почту.");
            } else if (err.code === 'auth/email-already-in-use') {
                setAuthError("Этот email уже используется.");
            } else if (err.code === 'auth/wrong-password') {
                setAuthError("Неверный пароль.");
            } else if (err.code === 'auth/user-not-found') {
                setAuthError("Пользователь не найден.");
            } else {
                setAuthError("Ошибка авторизации. Проверьте данные.");
            }
        } finally { setIsSubmitting(false); }
    };

    const toggleMode = (mode: AuthMode) => {
        setAuthMode(mode);
        setAuthError(null);
        setAuthSuccess(null);
        setPassword('');
        setConfirmPassword('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-0 md:p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative w-full md:max-w-4xl h-full md:h-auto md:max-h-[90vh] bg-brand-bg border-0 md:border border-brand-border md:rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden animate-in zoom-in-95 duration-200">

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
                                    className={`flex-shrink-0 flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeTab === item.id ? 'bg-brand-accent/10 text-brand-accent' : 'text-brand-muted hover:text-brand-text hover:bg-gray-100'}`}
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

                <div className="flex-1 flex flex-col bg-brand-bg relative min-h-0 overflow-hidden">
                    <button onClick={onClose} className="hidden md:block absolute top-4 right-4 p-2 text-brand-muted hover:text-brand-text z-10"><X className="w-5 h-5" /></button>

                    <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
                        {!user ? (
                            <div className="h-full flex flex-col items-center justify-center max-w-sm mx-auto w-full py-8 text-center text-brand-text">
                                <div className="w-full bg-brand-bg rounded-lg p-1 border border-brand-border mb-8 grid grid-cols-2">
                                    <button onClick={() => toggleMode('login')} className={`text-sm font-bold py-2 rounded-md transition-all ${authMode === 'login' || authMode === 'forgot' ? 'bg-white text-brand-text shadow-sm border border-brand-border' : 'text-brand-muted'}`}>Вход</button>
                                    <button onClick={() => toggleMode('register')} className={`text-sm font-bold py-2 rounded-md transition-all ${authMode === 'register' ? 'bg-white text-brand-text shadow-sm border border-brand-border' : 'text-brand-muted'}`}>Регистрация</button>
                                </div>

                                <h2 className="text-2xl font-bold mb-2 uppercase tracking-tight">
                                    {authMode === 'login' ? 'С возвращением' : authMode === 'register' ? 'Создать аккаунт' : 'Сброс пароля'}
                                </h2>
                                <p className="text-sm text-brand-muted mb-6">
                                    {authMode === 'login' ? 'Войдите, чтобы продолжить творчество' : authMode === 'register' ? 'Присоединяйтесь к сообществу креаторов' : 'Введите email для восстановления'}
                                </p>

                                {authMode !== 'forgot' && (
                                    <>
                                        <button onClick={async () => {
                                            setAuthError(null);
                                            try {
                                                await signInWithGoogle();
                                            } catch (err: any) {
                                                if (err?.code === 'auth/popup-closed-by-user' || err?.code === 'auth/cancelled-popup-request') {
                                                    setAuthError('Вход отменён.');
                                                } else {
                                                    setAuthError(err?.message || 'Ошибка входа через Google.');
                                                }
                                            }
                                        }} className="w-full flex items-center justify-center gap-3 bg-white text-black px-6 py-3 rounded-xl font-bold transition-all mb-6 active:scale-95 shadow-lg border border-brand-border hover:bg-gray-50">
                                            <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                                            Google
                                        </button>
                                        {authError && <p className="text-sm text-red-500 mb-4">{authError}</p>}
                                    </>
                                )}

                                <form onSubmit={handleEmailAuth} className="w-full space-y-4">
                                    {authMode === 'register' && (
                                        <input
                                            type="text"
                                            placeholder="Ваше имя"
                                            value={fullName}
                                            onChange={e => setFullName(e.target.value)}
                                            className="w-full bg-white border border-brand-border rounded-xl px-4 py-3 text-brand-text outline-none focus:border-brand-accent transition-colors"
                                        />
                                    )}

                                    <input
                                        type="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        className="w-full bg-white border border-brand-border rounded-xl px-4 py-3 text-brand-text outline-none focus:border-brand-accent transition-colors"
                                    />

                                    {authMode !== 'forgot' && (
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Пароль"
                                                value={password}
                                                onChange={e => setPassword(e.target.value)}
                                                className="w-full bg-white border border-brand-border rounded-xl px-4 py-3 text-brand-text outline-none focus:border-brand-accent transition-colors pr-10"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-text transition-colors"
                                            >
                                                {showPassword ? <XCircle className="w-5 h-5" /> : <EyeIcon />}
                                            </button>
                                        </div>
                                    )}

                                    {authMode === 'register' && (
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Повторите пароль"
                                                value={confirmPassword}
                                                onChange={e => setConfirmPassword(e.target.value)}
                                                className="w-full bg-white border border-brand-border rounded-xl px-4 py-3 text-brand-text outline-none focus:border-brand-accent transition-colors pr-10"
                                            />
                                        </div>
                                    )}

                                    {authMode === 'login' && (
                                        <div className="flex justify-end">
                                            <button
                                                type="button"
                                                onClick={() => toggleMode('forgot')}
                                                className="text-xs text-brand-muted hover:text-brand-accent transition-colors"
                                            >
                                                Забыли пароль?
                                            </button>
                                        </div>
                                    )}

                                    {authError && <div className="text-red-400 text-xs bg-red-500/10 p-2 rounded border border-red-500/20">{authError}</div>}
                                    {authSuccess && <div className="text-green-500 text-xs bg-green-500/10 p-2 rounded border border-green-500/20">{authSuccess}</div>}

                                    <button type="submit" disabled={isSubmitting} className="w-full bg-brand-accent text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-all uppercase tracking-widest flex items-center justify-center gap-2">
                                        {isSubmitting && <RefreshCw className="w-4 h-4 animate-spin" />}
                                        {authMode === 'login' ? 'Войти' : authMode === 'register' ? 'Создать' : 'Отправить'}
                                    </button>

                                    {authMode === 'forgot' && (
                                        <button
                                            type="button"
                                            onClick={() => toggleMode('login')}
                                            className="w-full text-brand-muted text-sm hover:text-brand-text py-2"
                                        >
                                            Вернуться назад
                                        </button>
                                    )}
                                </form>
                            </div>
                        ) : (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                                {activeTab === 'overview' && (
                                    <div className="space-y-8">
                                        <div className="flex items-center gap-6">
                                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 p-1 ring-2 ring-brand-border overflow-hidden shrink-0"><img src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} className="w-full h-full rounded-full bg-white" /></div>
                                            <div className="min-w-0">
                                                <h1 className="text-2xl font-bold text-brand-text truncate">{user.displayName || user.email?.split('@')[0]}</h1>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className="px-2 py-0.5 bg-brand-accent/20 text-brand-accent text-[10px] font-bold rounded uppercase tracking-wider border border-brand-accent/20">{TIER_LABELS[userTier]}</span>
                                                    <span className="text-brand-muted text-xs">• ID: {user.uid.substring(0, 8)}</span>
                                                    {user.emailVerified ?
                                                        <span className="text-green-500 text-[10px] flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Verified</span> :
                                                        <span className="text-yellow-500 text-[10px] flex items-center gap-1 cursor-help" title="Проверьте почту"><Mail className="w-3 h-3" /> Unverified</span>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            <div className="bg-white border border-brand-border p-5 rounded-2xl relative overflow-hidden group shadow-sm">
                                                <div className="text-brand-muted text-[10px] uppercase font-bold tracking-wider mb-2 flex items-center gap-2"><Zap className="w-3 h-3 text-yellow-500" /> Кредиты</div>
                                                <div className="text-3xl font-bold text-brand-text tabular-nums">{credits}</div>
                                                <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-yellow-500/10 rounded-full group-hover:scale-150 transition-transform"></div>
                                            </div>
                                            <div className="bg-white border border-brand-border p-5 rounded-2xl shadow-sm">
                                                <div className="text-brand-muted text-[10px] uppercase font-bold tracking-wider mb-2 flex items-center gap-2"><Image className="w-3 h-3 text-purple-500" /> Создано</div>
                                                <div className="text-3xl font-bold text-brand-text tabular-nums">12</div>
                                            </div>
                                            <div className="bg-white border border-brand-border p-5 rounded-2xl hidden md:block shadow-sm">
                                                <div className="text-brand-muted text-[10px] uppercase font-bold tracking-wider mb-2 flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-green-500" /> Статус</div>
                                                <div className="text-3xl font-bold text-brand-text">Активен</div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'security' && (
                                    <div className="space-y-6">
                                        <div><h2 className="text-xl font-bold text-brand-text mb-1">Безопасность</h2><p className="text-brand-muted text-sm">Управление паролем и доступом.</p></div>

                                        <div className="bg-white border border-brand-border rounded-xl p-6 shadow-sm">
                                            <h3 className="font-bold text-brand-text mb-4">Смена пароля</h3>
                                            <div className="space-y-4 max-w-md">
                                                <input type="password" placeholder="Новый пароль" className="w-full bg-white border border-brand-border rounded-lg px-4 py-3 text-brand-text focus:border-brand-accent outline-none" id="new-password" />
                                                <button
                                                    onClick={async () => {
                                                        const newPass = (document.getElementById('new-password') as HTMLInputElement).value;
                                                        if (newPass.length < 6) { alert("Пароль должен быть не менее 6 символов"); return; }
                                                        try {
                                                            await user?.updatePassword(newPass);
                                                            alert("Пароль успешно обновлен!");
                                                        } catch (e: any) {
                                                            alert("Ошибка: " + e.message);
                                                        }
                                                    }}
                                                    className="bg-brand-accent text-white font-bold px-6 py-2 rounded-lg hover:bg-brand-accent/80 transition-colors"
                                                >
                                                    Обновить пароль
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'billing' && (
                                    <div className="space-y-6">
                                        <div><h2 className="text-xl font-bold text-brand-text mb-1">История платежей</h2><p className="text-brand-muted text-sm">Управление подпиской и чеки Cloud Kassir.</p></div>
                                        <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                                            <div className="text-center md:text-left">
                                                <div className="text-xs text-indigo-500 font-bold uppercase tracking-widest mb-1">Текущий тариф</div>
                                                <div className="text-3xl font-bold text-brand-text">{TIER_LABELS[userTier]}</div>
                                            </div>
                                            <button className="bg-black text-white font-bold px-8 py-3 rounded-xl hover:bg-gray-800 transition-colors shadow-lg active:scale-95">Продлить подписку</button>
                                        </div>
                                        <div className="text-center py-12 border border-dashed border-brand-border rounded-2xl text-brand-muted text-sm">У вас пока нет оплаченных счетов.</div>
                                    </div>
                                )}

                                {activeTab === 'developers' && (
                                    <div className="space-y-8">
                                        <div><h2 className="text-xl font-bold text-brand-text mb-1">Для разработчиков (Merchant API)</h2><p className="text-brand-muted text-sm">Используйте API для интеграции Photo Smart в свои сервисы.</p></div>
                                        <div className="bg-white border border-brand-border rounded-2xl p-6 space-y-6 shadow-sm">
                                            <div className="space-y-3">
                                                <label className="flex items-center gap-2 text-xs font-bold text-brand-muted uppercase tracking-wider"><Key className="w-3 h-3" /> Ваш секретный ключ (API Key)</label>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 bg-gray-50 border border-brand-border rounded-xl px-4 py-3 font-mono text-xs text-brand-accent flex items-center justify-between group">
                                                        <span>{isKeyVisible ? apiKey : '••••••••••••••••••••••••••••••••'}</span>
                                                        <button onClick={() => setIsKeyVisible(!isKeyVisible)} className="opacity-0 group-hover:opacity-100 transition-opacity">{isKeyVisible ? <X className="w-4 h-4" /> : <Image className="w-4 h-4" />}</button>
                                                    </div>
                                                    <button onClick={() => copyToClipboard(apiKey || '')} className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl text-brand-text transition-colors border border-brand-border"><Copy className="w-5 h-5" /></button>
                                                    <button onClick={handleGenerateKey} className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl text-brand-text transition-colors border border-brand-border"><RefreshCw className="w-5 h-5" /></button>
                                                </div>
                                                <p className="text-[10px] text-red-400">Никогда не передавайте API ключ третьим лицам. Он дает доступ к вашему балансу кредитов.</p>
                                            </div>
                                            <div className="h-px bg-brand-border"></div>
                                            <div className="space-y-4">
                                                <h4 className="text-sm font-bold text-brand-text">Документация (Alpha)</h4>
                                                <div className="p-4 bg-gray-50 rounded-xl border border-brand-border font-mono text-[11px] text-gray-600">
                                                    POST https://api.smartphotos.ru/v1/generate<br />
                                                    Authorization: Bearer {apiKey?.substring(0, 8)}...<br />
                                                    Content-Type: application/json<br /><br />
                                                    {"{"}<br />
                                                    &nbsp;&nbsp;"prompt": "A professional photo of...",<br />
                                                    &nbsp;&nbsp;"model": "gemini-2.5-flash-image"<br />
                                                    {"}"}
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
```

## `components/InfoModal.tsx`

```tsx

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
                  <p>Добро пожаловать в Photo Smart. Используя наш сервис, вы соглашаетесь с условиями настоящего <strong>Пользовательского соглашения</strong>.</p>
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
```

## `components/ProfileSettings.tsx`

```tsx

import React, { useState, useEffect } from 'react';
import { User, Settings, Zap, CreditCard, Lock, CheckCircle2, Image, Code, Copy, RefreshCw, Key, LogOut, ArrowUpRight, Wallet } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { SubscriptionTier } from '../types';
import PricingModal from './PricingModal';
import { db } from '../lib/firebase';

type Tab = 'overview' | 'security' | 'billing' | 'developers';
type AuthMode = 'login' | 'register';

const TIER_LABELS: Record<SubscriptionTier, string> = {
    'free': 'Free Plan',
    'creator': 'Creator',
    'pro': 'Pro Member',
    'business': 'Business'
};

const TIER_CREDITS: Record<SubscriptionTier, number> = {
    'free': 45,
    'creator': 350,
    'pro': 750,
    'business': 4000
};

interface PaymentHistory {
    id: string;
    date: any;
    plan: string;
    amount: number;
    credits: number;
}

interface ProfileSettingsProps {
    credits: number;
    userTier: SubscriptionTier;
    generatedCount: number;
}
const ProfileSettings: React.FC<ProfileSettingsProps> = ({ credits, userTier, generatedCount }) => {
    const [activeTab, setActiveTab] = useState<Tab>('overview');
    const { user, signInWithGoogle, loginWithEmail, registerWithEmail, logout } = useAuth();

    // Auth Form State
    const [authMode, setAuthMode] = useState<AuthMode>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);

    // Pricing Modal State
    const [isPricingOpen, setIsPricingOpen] = useState(false);

    // Payment History State
    const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);

    // API Key State
    const [apiKey, setApiKey] = useState<string | null>(null);
    const [isKeyVisible, setIsKeyVisible] = useState(false);

    const fetchPaymentHistory = async () => {
        if (!user || !db) return;

        try {
            const userDoc = await db.collection('users').doc(user.uid).get();
            if (userDoc.exists) {
                const data = userDoc.data();
                const history: PaymentHistory[] = [];

                // Add current subscription if exists
                if (data?.lastPaymentDate && data?.lastPaymentPlan) {
                    history.push({
                        id: data.lastPaymentId || 'current',
                        date: data.lastPaymentDate,
                        plan: data.lastPaymentPlan,
                        amount: data.lastPaymentAmount || 0,
                        credits: TIER_CREDITS[data.lastPaymentPlan as SubscriptionTier] || 0
                    });
                }

                setPaymentHistory(history);
            }
        } catch (error) {
            console.error('Error fetching payment history:', error);
        }
    };

    useEffect(() => {
        setAuthError(null);
        // In real app, fetch apiKey from Firestore user document here
        if (user && !apiKey) setApiKey(`sk_live_${Math.random().toString(36).substring(2, 15)}`);

        // Fetch payment history
        if (user && db) {
            fetchPaymentHistory();
        }
    }, [user]);

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
        } catch (err: any) {
            setAuthError("Ошибка авторизации. Проверьте данные.");
        } finally { setIsSubmitting(false); }
    };

    if (!user) {
        return (
            <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar bg-brand-bg flex items-center justify-center h-full">
                <div className="max-w-md mx-auto w-full py-8 text-center animate-in fade-in zoom-in-95">
                    <div className="w-full bg-white rounded-xl p-1 border border-brand-border mb-8 grid grid-cols-2 shadow-sm">
                        <button onClick={() => setAuthMode('login')} className={`text-sm font-bold py-2 rounded-lg transition-all ${authMode === 'login' ? 'bg-brand-card text-brand-text shadow-sm border border-black/5' : 'text-brand-muted hover:text-brand-text'}`}>Вход</button>
                        <button onClick={() => setAuthMode('register')} className={`text-sm font-bold py-2 rounded-lg transition-all ${authMode === 'register' ? 'bg-brand-card text-brand-text shadow-sm border border-black/5' : 'text-brand-muted hover:text-brand-text'}`}>Регистрация</button>
                    </div>
                    <h2 className="text-2xl font-bold text-brand-text mb-2 uppercase tracking-tight">{authMode === 'login' ? 'С возвращением' : 'Создать аккаунт'}</h2>
                    <p className="text-brand-muted text-sm mb-6">Войдите, чтобы сохранить свой прогресс и получить доступ к PRO функциям.</p>

                    <button onClick={async () => {
                        setAuthError(null);
                        try {
                            await signInWithGoogle();
                        } catch (err: any) {
                            if (err?.code === 'auth/popup-closed-by-user' || err?.code === 'auth/cancelled-popup-request') {
                                setAuthError('Вход отменён.');
                            } else {
                                setAuthError(err?.message || 'Ошибка входа через Google.');
                            }
                        }
                    }} className="w-full flex items-center justify-center gap-3 bg-white text-brand-text px-6 py-3 rounded-xl font-bold transition-all mb-6 active:scale-95 shadow-sm border border-brand-border hover:bg-gray-50 hover:shadow-md">
                        <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                        Продолжить с Google
                    </button>
                    {authError && <div className="text-red-500 text-xs bg-red-50 p-2 rounded-lg border border-red-100 mb-4">{authError}</div>}

                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-brand-border"></div></div>
                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-brand-bg px-2 text-brand-muted">Или через Email</span></div>
                    </div>

                    <form onSubmit={handleEmailAuth} className="w-full space-y-4">
                        {authMode === 'register' && <input type="text" placeholder="Ваше имя" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full bg-white border border-brand-border rounded-xl px-4 py-3 text-brand-text outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all placeholder:text-brand-muted/50" />}
                        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-white border border-brand-border rounded-xl px-4 py-3 text-brand-text outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all placeholder:text-brand-muted/50" />
                        <input type="password" placeholder="Пароль" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-white border border-brand-border rounded-xl px-4 py-3 text-brand-text outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all placeholder:text-brand-muted/50" />

                        {authError && <div className="text-red-500 text-xs bg-red-50 p-2 rounded-lg border border-red-100">{authError}</div>}

                        <button type="submit" disabled={isSubmitting} className="w-full bg-brand-text text-white font-bold py-4 rounded-xl shadow-lg hover:bg-brand-text/90 active:scale-95 transition-all uppercase tracking-widest text-sm">
                            {isSubmitting ? '...' : (authMode === 'login' ? 'Войти' : 'Создать аккаунт')}
                        </button>
                    </form>
                </div>
            </div>
        )
    }

    return (
        <>
            <PricingModal
                isOpen={isPricingOpen}
                onClose={() => setIsPricingOpen(false)}
                onSuccess={() => {
                    setIsPricingOpen(false);
                    fetchPaymentHistory(); // Refresh history after purchase
                }}
                currentTier={userTier}
            />

            <div className="flex flex-col md:flex-row h-full w-full bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
                {/* Sidebar Navigation */}
                <div className="w-full md:w-72 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl flex flex-col shrink-0 md:h-full z-10 transition-all">
                    <div className="p-8 border-b border-slate-100 dark:border-slate-800 hidden md:block">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                                <Settings className="w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="font-bold text-lg text-slate-900 dark:text-white">Настройки</h1>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Параметры профиля</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 flex md:flex-col overflow-x-auto md:overflow-visible gap-2 md:gap-1.5 no-scrollbar">
                        {[
                            { id: 'overview', icon: User, label: 'Обзор профиля' },
                            { id: 'security', icon: Lock, label: 'Безопасность' },
                            { id: 'billing', icon: CreditCard, label: 'Тарифы и оплата' },
                            ...(userTier === 'business' ? [{ id: 'developers', icon: Code, label: 'API Разработчика' }] : [])
                        ].map(item => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id as Tab)}
                                className={`flex-shrink-0 flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-bold transition-all whitespace-nowrap text-left group
                                ${activeTab === item.id
                                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'}
                            `}
                            >
                                <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${activeTab === item.id ? 'text-white' : 'text-slate-400'}`} />
                                {item.label}
                            </button>
                        ))}
                    </div>

                    <div className="mt-auto p-6 border-t border-slate-100 dark:border-slate-800 hidden md:block">
                        <button
                            onClick={() => logout()}
                            className="flex items-center gap-3 px-5 py-3 rounded-2xl text-sm font-bold text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all group w-full"
                        >
                            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            Выйти
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col relative h-full overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-6 md:p-12 custom-scrollbar pb-40 md:pb-12">
                        <div className="max-w-4xl mx-auto space-y-12">

                            {/* Content is now padding-managed via the parent wrapper */}

                            {activeTab === 'overview' && (
                                <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-500">
                                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] p-8 md:p-10 shadow-sm">
                                        <div className="flex flex-col md:flex-row items-center gap-8">
                                            <div className="relative group">
                                                <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full group-hover:scale-110 transition-transform"></div>
                                                <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-primary to-indigo-600 p-1 shadow-2xl overflow-hidden shrink-0">
                                                    <img src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} className="w-full h-full rounded-full bg-white object-cover" />
                                                </div>
                                                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-500 border-4 border-white dark:border-slate-900 rounded-full flex items-center justify-center shadow-lg">
                                                    <CheckCircle2 className="w-4 h-4 text-white" />
                                                </div>
                                            </div>
                                            <div className="flex-1 text-center md:text-left">
                                                <h1 className="text-3xl font-bold text-slate-900 dark:text-white truncate mb-3">{user.displayName || user.email?.split('@')[0] || 'Пользователь'}</h1>
                                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                                    <span className={`px-4 py-1.5 text-white text-[10px] font-bold rounded-full uppercase tracking-widest shadow-lg 
                                                    ${userTier === 'free' ? 'bg-slate-500' :
                                                            userTier === 'creator' ? 'bg-primary' :
                                                                userTier === 'business' ? 'bg-slate-950' : 'bg-purple-600'}`}>
                                                        {TIER_LABELS[userTier]}
                                                    </span>
                                                    <span className="text-slate-400 text-[10px] font-bold px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 uppercase tracking-wider">ID: {user.uid.substring(0, 8)}</span>
                                                    {!user.emailVerified && (
                                                        <span className="text-amber-600 dark:text-amber-400 text-[10px] font-bold px-3 py-1.5 bg-amber-50 dark:bg-amber-950/30 rounded-full border border-amber-200 dark:border-amber-800 uppercase tracking-wider">Email не подтвержден</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[32px] relative overflow-hidden group shadow-sm hover:border-amber-200 transition-all">
                                            <div className="text-slate-400 text-[10px] uppercase font-bold tracking-[0.2em] mb-4 flex items-center gap-2"><Zap className="w-4 h-4 text-amber-500 fill-amber-500" /> Доступно</div>
                                            <div className="text-5xl font-bold text-slate-900 dark:text-white tabular-nums tracking-tight">{credits}</div>
                                            <p className="text-xs text-slate-400 mt-2">Кредитов для генерации</p>
                                            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-amber-400/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                                        </div>
                                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[32px] relative overflow-hidden group shadow-sm hover:border-purple-200 transition-all">
                                            <div className="text-slate-400 text-[10px] uppercase font-bold tracking-[0.2em] mb-4 flex items-center gap-2"><Image className="w-4 h-4 text-purple-500" /> Активность</div>
                                            <div className="text-5xl font-bold text-slate-900 dark:text-white tabular-nums tracking-tight">{generatedCount}</div>
                                            <p className="text-xs text-slate-400 mt-2">Создано шедевров</p>
                                            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-purple-500/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                                        </div>
                                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[32px] relative overflow-hidden group shadow-sm hover:border-emerald-200 transition-all flex flex-col justify-center">
                                            <div className="text-slate-400 text-[10px] uppercase font-bold tracking-[0.2em] mb-2 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Статус</div>
                                            <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Активный</div>
                                            <p className="text-xs text-slate-400">Ограничений нет</p>
                                        </div>
                                    </div>

                                    <div className="bg-primary/5 border-2 border-primary/20 rounded-[32px] p-10 text-center relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Готовы к новому уровню?</h3>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 max-w-lg mx-auto leading-relaxed">Разблокируйте профессиональные инструменты: генерация в 4K Ultra HD, коммерческая лицензия и приоритет в очереди.</p>
                                        <button onClick={() => setActiveTab('billing')} className="bg-primary text-white px-10 py-5 rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-xl shadow-primary/20 active:scale-95 uppercase tracking-widest text-xs">Посмотреть тарифы</button>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'security' && (
                                <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-500">
                                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] p-8 md:p-10 shadow-sm transition-all hover:border-slate-300">
                                        <div className="flex items-center gap-3 mb-8">
                                            <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-2xl">
                                                <Lock className="w-6 h-6 text-red-500" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-xl text-slate-900 dark:text-white">Безопасность аккаунта</h3>
                                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Управление доступом</p>
                                            </div>
                                        </div>

                                        {user.providerData[0]?.providerId === 'google.com' ? (
                                            <div className="p-6 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                                                Вы вошли через <span className="text-primary font-bold">Google account</span> (<b>{user.email}</b>). Управление паролем осуществляется централизованно через настройки вашего Google Аккаунта.
                                            </div>
                                        ) : (
                                            <form className="space-y-6 max-w-md" onSubmit={async (e) => {
                                                e.preventDefault();
                                                const oldPass = (document.getElementById('old-password') as HTMLInputElement).value;
                                                const newPass = (document.getElementById('new-password') as HTMLInputElement).value;
                                                const confirmPass = (document.getElementById('confirm-password') as HTMLInputElement).value;

                                                if (!oldPass || !newPass || !confirmPass) {
                                                    alert("Заполните все поля");
                                                    return;
                                                }

                                                if (newPass !== confirmPass) {
                                                    alert("Новые пароли не совпадают");
                                                    return;
                                                }

                                                if (newPass.length < 6) {
                                                    alert("Пароль должен быть не менее 6 символов");
                                                    return;
                                                }

                                                try {
                                                    await user?.updatePassword(newPass);
                                                    alert("Пароль успешно обновлен!");
                                                    (e.target as HTMLFormElement).reset();
                                                } catch (err: any) {
                                                    alert("Ошибка: " + err.message + ". Возможно, вам нужно выйти и войти снова.");
                                                }
                                            }}>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Текущий пароль</label>
                                                    <input type={isKeyVisible ? "text" : "password"} placeholder="••••••••" required className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 text-slate-900 dark:text-white focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all font-mono" id="old-password" />
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Новый пароль</label>
                                                    <input type={isKeyVisible ? "text" : "password"} placeholder="••••••••" required className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 text-slate-900 dark:text-white focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all font-mono" id="new-password" />
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Подтверждение</label>
                                                    <input type={isKeyVisible ? "text" : "password"} placeholder="••••••••" required className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 text-slate-900 dark:text-white focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all font-mono" id="confirm-password" />
                                                </div>

                                                <div className="flex items-center gap-3 py-2 cursor-pointer group" onClick={() => setIsKeyVisible(!isKeyVisible)}>
                                                    <div className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${isKeyVisible ? 'bg-primary border-primary' : 'border-slate-300 group-hover:border-primary'}`}>
                                                        {isKeyVisible && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest select-none">Показать пароли</span>
                                                </div>

                                                <button
                                                    type="submit"
                                                    className="bg-primary text-white font-bold px-10 py-5 rounded-2xl hover:bg-blue-600 transition-all shadow-xl shadow-primary/20 w-full uppercase tracking-widest text-xs mt-4 active:scale-95"
                                                >
                                                    Обновить пароль
                                                </button>
                                            </form>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'billing' && (
                                <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-500">
                                    <div className="bg-gradient-to-br from-primary to-indigo-700 rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-1000"></div>
                                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
                                            <div className="text-center md:text-left">
                                                <div className="text-blue-200 text-xs font-bold uppercase tracking-[0.3em] mb-4">Ваш тарифный план</div>
                                                <div className="text-5xl font-bold mb-4 tracking-tight">{TIER_LABELS[userTier]}</div>
                                                <div className="flex items-center justify-center md:justify-start gap-3 text-blue-100 text-sm font-medium">
                                                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                                        <Zap className="w-4 h-4 fill-white" />
                                                    </div>
                                                    {TIER_CREDITS[userTier]} кредитов ежемесячно
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setIsPricingOpen(true)}
                                                className="bg-white text-primary font-bold px-12 py-5 rounded-2xl hover:bg-slate-50 transition-all shadow-xl active:scale-95 whitespace-nowrap uppercase tracking-widest text-xs"
                                            >
                                                Улучшить
                                            </button>
                                        </div>
                                    </div>

                                    {/* Upgrade Suggestions */}
                                    {userTier !== 'business' && (
                                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] p-8 md:p-10 shadow-sm relative overflow-hidden">
                                            <div className="flex flex-col md:flex-row items-center gap-8">
                                                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center rounded-2xl shadow-inner group transition-transform hover:rotate-12">
                                                    <ArrowUpRight className="w-8 h-8 text-primary" />
                                                </div>
                                                <div className="flex-1 text-center md:text-left">
                                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                                                        {userTier === 'free' && 'PRO возможности: План Creator'}
                                                        {userTier === 'creator' && 'PRO возможности: План Pro'}
                                                        {userTier === 'pro' && 'PRO возможности: План Business'}
                                                    </h3>
                                                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-0">
                                                        {userTier === 'free' && 'Удалите водяной знак, получите 100 кредитов и HD качество.'}
                                                        {userTier === 'creator' && 'Откройте 4K генерацию, 500 кредитов и коммерческие права.'}
                                                        {userTier === 'pro' && '2000 кредитов ежемесячно, доступ к API и командная работа.'}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => setIsPricingOpen(true)}
                                                    className="px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl font-bold text-xs uppercase tracking-widest transition-all hover:bg-primary hover:text-white shadow-sm active:scale-95"
                                                >
                                                    Подробнее
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] shadow-sm overflow-hidden">
                                        <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex justify-between items-center">
                                            <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-widest text-sm">История транзакций</h3>
                                            <CreditCard className="w-5 h-5 text-slate-400" />
                                        </div>
                                        {paymentHistory.length === 0 ? (
                                            <div className="text-center py-24">
                                                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                                                    <CreditCard className="w-10 h-10" />
                                                </div>
                                                <p className="text-slate-900 dark:text-white font-bold text-lg">Операций не найдено</p>
                                                <p className="text-slate-400 text-sm mt-2">Здесь появятся ваши покупки и списания.</p>
                                            </div>
                                        ) : (
                                            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                                {paymentHistory.map((payment) => (
                                                    <div key={payment.id} className="p-8 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-6">
                                                                <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl flex items-center justify-center">
                                                                    <Wallet className="w-7 h-7 text-emerald-500" />
                                                                </div>
                                                                <div>
                                                                    <div className="font-bold text-slate-900 dark:text-white text-lg">
                                                                        План {TIER_LABELS[payment.plan as SubscriptionTier]}
                                                                    </div>
                                                                    <div className="text-sm text-slate-400 font-medium">
                                                                        {payment.date?.toDate ? payment.date.toDate().toLocaleDateString('ru-RU', {
                                                                            year: 'numeric',
                                                                            month: 'long',
                                                                            day: 'numeric'
                                                                        }) : 'Недавно'}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <div className="font-bold text-slate-900 dark:text-white text-xl tabular-nums tracking-tight">
                                                                    {payment.amount} ₽
                                                                </div>
                                                                <div className="text-sm text-emerald-500 font-bold uppercase tracking-widest">
                                                                    +{payment.credits} Credits
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'developers' && (
                                <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-500">
                                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] p-8 md:p-10 shadow-sm relative overflow-hidden group">
                                        <div className="flex items-center gap-3 mb-8">
                                            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/30 rounded-2xl">
                                                <Key className="w-6 h-6 text-indigo-500" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-xl text-slate-900 dark:text-white">Merchant API</h3>
                                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Интеграция и ключи</p>
                                            </div>
                                        </div>

                                        <div className="space-y-8">
                                            <div className="space-y-3">
                                                <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Секретный ключ (API Secret)</label>
                                                <div className="flex flex-col md:flex-row items-center gap-3">
                                                    <div className="flex-1 w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-5 font-mono text-sm text-slate-900 dark:text-white flex items-center justify-between group transition-all hover:border-primary/30">
                                                        <span className="truncate">{isKeyVisible ? apiKey : 'sk_live_••••••••••••••••••••••••••••••••'}</span>
                                                        <button
                                                            onClick={() => setIsKeyVisible(!isKeyVisible)}
                                                            className="p-2 text-slate-400 hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest"
                                                        >
                                                            {isKeyVisible ? 'Скрыть' : 'Показать'}
                                                        </button>
                                                    </div>
                                                    <div className="flex gap-2 w-full md:w-auto">
                                                        <button onClick={() => copyToClipboard(apiKey || '')} className="flex-1 md:flex-none p-5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl text-slate-600 dark:text-slate-300 transition-all border border-slate-200 dark:border-slate-800 shadow-sm active:scale-95 flex items-center justify-center" title="Копировать"><Copy className="w-5 h-5" /></button>
                                                        <button onClick={handleGenerateKey} className="flex-1 md:flex-none p-5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl text-slate-600 dark:text-slate-300 transition-all border border-slate-200 dark:border-slate-800 shadow-sm active:scale-95 flex items-center justify-center" title="Обновить"><RefreshCw className="w-5 h-5" /></button>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-[10px] font-bold uppercase tracking-[0.1em] rounded-xl border border-red-100 dark:border-red-900/30">
                                                    <Lock className="w-4 h-4 shrink-0" /> Никогда не передавайте этот ключ клиенту (Frontend). Используйте только на сервере.
                                                </div>
                                            </div>

                                            <div className="h-px bg-slate-100 dark:bg-slate-800"></div>

                                            <div className="space-y-4">
                                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><Code className="w-4 h-4" /> Swagger / cURL Example</h4>
                                                <div className="p-8 bg-[#0F172A] rounded-[24px] border border-white/5 font-mono text-xs text-blue-200 overflow-x-auto shadow-2xl relative group">
                                                    <div className="absolute top-4 right-4 text-[10px] text-slate-600 font-bold uppercase">Terminal</div>
                                                    <span className="text-purple-400">curl</span> -X POST https://api.smartphotos.ru/v1/generate \<br />
                                                    &nbsp;&nbsp;-H <span className="text-emerald-400">"Authorization: Bearer {apiKey?.substring(0, 8)}..."</span> \<br />
                                                    &nbsp;&nbsp;-H <span className="text-emerald-400">"Content-Type: application/json"</span> \<br />
                                                    &nbsp;&nbsp;-d <span className="text-amber-300">'&#123;"prompt": "cyberpunk portrait", "model": "gemini-2.0-pro" &#125;'</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProfileSettings;
```

## `components/CookieConsent.tsx`

```tsx

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
```

## `App.tsx`

```tsx

import React, { useState, useEffect, useRef } from 'react';
import { db } from './lib/firebase';
import { compressImage, addWatermark } from './lib/imageUtils';
import Header from './components/Header';
import Sidebar, { CategoryItem } from './components/Sidebar';
import ImageUploader from './components/ImageUploader';
import TemplateGrid, { ALL_PRESETS } from './components/TemplateGrid';
import ProfileSettings from './components/ProfileSettings';
import LandingPage from './components/LandingPage';
import ChatInterface from './components/ChatInterface';
import AnimateInterface from './components/AnimateInterface';
import PricingModal from './components/PricingModal';
import InfoModal, { InfoPageType } from './components/InfoModal';
import DesignSystemView from './components/DesignSystemView';
import TermsPage from './components/pages/TermsPage';
import PrivacyPage from './components/pages/PrivacyPage';
import SEO from './components/SEO';
import { CookieConsent } from './components/CookieConsent';
import { useAuth } from './contexts/AuthContext';
import { generateImageWithGemini, cleanBase64, getMimeType, ReferenceImage } from './services/geminiService';
import { uploadImageToStorage, saveGenerationToHistory, getUserHistory, syncUserProfile, deductCredits, purchaseSubscription, toggleSavedStatus } from './services/firebaseService';
import { AppState, CategoryId, AspectRatio, Preset, ImageResolution, GenModelId, GeneratedImage, ViewMode, SubscriptionTier } from './types';
import {
    Loader2, Zap, Download, Square, RectangleHorizontal, RectangleVertical,
    LayoutGrid, Users, FileText, Baby, ShoppingBag, Shirt,
    Palette, Briefcase, Camera, Gem, Flame, Bookmark,
    X, ChevronDown, ChevronUp, Utensils, Info, LayoutDashboard, MessageSquare, Settings,
    Store, Dumbbell, Heart, Flower, Ghost, Flag, Layers, Printer, PartyPopper,
    Video, Folder, History, Sparkles, Type, Trash2, Wand2, SlidersHorizontal, Image as ImageIcon, ArrowRight, ArrowLeft, Star, Cpu, Monitor, Maximize2, Share2, Paintbrush, RotateCcw
} from 'lucide-react';

// Define Categories Configuration
const CATEGORIES: CategoryItem[] = [
    { id: 'all', label: 'Все', icon: LayoutGrid },
    { id: 'retro', label: 'Ретро Фото', icon: Camera, badge: 'HOT' },
    { id: 'tet', label: 'Лунный НГ', icon: Flower, badge: 'NEW' },
    { id: 'wedding', label: 'Свадьба', icon: Gem, badge: 'NEW' },
    { id: 'business_print', label: 'Полиграфия', icon: Printer, badge: 'BIZ' },
    { id: 'style_trends', label: 'Тренды', icon: Layers, badge: 'HOT' },
    { id: 'formula1', label: 'Формула 1', icon: Flag, badge: 'RACE' },
    { id: 'dating', label: 'Свидания', icon: Heart, badge: 'LOVE' },
    { id: 'pranks', label: 'Пранки', icon: Ghost, badge: 'FUN' },
    { id: 'marketplaces', label: 'Маркетплейсы', icon: Store, badge: 'HOT' },
    { id: 'restaurants', label: 'Рестораны', icon: Utensils, badge: 'NEW' },
    { id: 'sports', label: 'Спорт', icon: Dumbbell, badge: 'NEW' },
    { id: 'documents', label: 'Документы', icon: FileText },
    { id: 'kids', label: 'Дети', icon: Baby },
    { id: 'family', label: 'Семья', icon: Users },
    { id: 'ecommerce', label: 'Товары', icon: ShoppingBag },
    { id: 'fashion', label: 'Мода', icon: Shirt },
    { id: 'makeup', label: 'Макияж', icon: Palette },
    { id: 'business', label: 'Бизнес', icon: Briefcase },
    { id: 'ugc', label: 'UGC Контент', icon: Video },
    { id: 'bloggers', label: 'Блогеры', icon: Camera },
    { id: 'rich_life', label: 'Роскошь', icon: Gem },
    { id: 'trending', label: 'Популярное', icon: Flame },
    { id: 'saved', label: 'Сохраненное', icon: Bookmark },
];

const FUNNY_STATUSES = [
    "Разогреваем нейроны...",
    "Смешиваем цифровые краски...",
    "Ищем лучший ракурс...",
    "Договариваемся с пикселями...",
    "Настраиваем свет...",
    "Добавляем щепотку магии...",
    "Наносим виртуальный макияж...",
    "Уговариваем ИИ работать быстрее...",
    "Почти готово, не моргайте!",
    "Рендерим шедевр..."
];

type MobileTab = 'canvas' | 'settings';

// Featured templates for the Hero Slider
const FEATURED_SLIDES = [
    {
        id: 'retro-classic',
        title: 'Ретро Стиль',
        subtitle: 'Оживите воспоминания в стиле пленочной фотографии',
        bg: 'from-amber-900 via-stone-800 to-slate-900',
        accent: 'text-amber-200',
        image: 'https://images.unsplash.com/photo-1495707902641-75cac588d2e9?auto=format&fit=crop&w=800&q=80'
    },
    {
        id: 'tet-traditional-yellow',
        title: 'Лунный Новый Год',
        subtitle: 'Создайте волшебную атмосферу праздника',
        bg: 'from-red-900 to-red-600',
        accent: 'text-yellow-400',
        image: 'https://images.unsplash.com/photo-1548625361-1eb84c9f6d1d?auto=format&fit=crop&w=800&q=80'
    },
    {
        id: 'market-shopee-hero',
        title: 'Карточки Товаров',
        subtitle: 'Увеличьте продажи с 3D фонами',
        bg: 'from-orange-600 to-yellow-600',
        accent: 'text-white',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'
    }
];

// Helper to describe how strongly style should be applied while preserving identity
const getIntensityPrompt = (intensity: number): string => {
    if (intensity < 30) {
        return "INTENSITY: Apply an extremely subtle hint of the style. Keep at least 95% of original photo details identical. Facial features must remain untouched.";
    } else if (intensity < 60) {
        return "INTENSITY: Balanced integration. Mix the style aesthetic with the original person's characteristics naturally while keeping their face clearly recognizable.";
    } else {
        return "INTENSITY: Strong style transformation. Prioritize the cinematic look while still keeping the face recognizable and consistent with the reference image.";
    }
};

const App: React.FC = () => {
    const { user, loading } = useAuth();

    // View State
    const [view, setView] = useState<ViewMode>('dashboard');
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    // Mobile specific state
    const [mobileTab, setMobileTab] = useState<MobileTab>('canvas');

    // Hero Slider State
    const [heroIndex, setHeroIndex] = useState(0);

    // Generation State
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [subjectImage, setSubjectImage] = useState<string | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [currentImageId, setCurrentImageId] = useState<string | null>(null);
    const imageRecoveryAttempted = useRef<Set<string>>(new Set());
    const [history, setHistory] = useState<GeneratedImage[]>([]);

    // Inputs
    const [activeCategory, setActiveCategory] = useState<CategoryId>('all');
    const [promptInput, setPromptInput] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState<Preset | null>(null);
    const [overlayText, setOverlayText] = useState('');
    const [intensity, setIntensity] = useState<number>(50);

    // Settings
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
    const [selectedModel, setSelectedModel] = useState<GenModelId>('gemini-2.5-flash-image');
    const [resolution, setResolution] = useState<ImageResolution>('1K');

    // App Status
    const [appState, setAppState] = useState<AppState>(AppState.IDLE);
    const [genStatus, setGenStatus] = useState<string>('');
    const [loadingStatusIndex, setLoadingStatusIndex] = useState(0);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [credits, setCredits] = useState(0);
    const [userTier, setUserTier] = useState<SubscriptionTier>('free');

    // Modals
    const [isPricingOpen, setIsPricingOpen] = useState(false);
    const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
    const [paymentEmail, setPaymentEmail] = useState('');
    const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);

    // Info Modal State
    const [infoPage, setInfoPage] = useState<InfoPageType>(null);

    // Legal pages URL: /terms, /privacy (for logged-in users)
    const [legalRoute, setLegalRoute] = useState<string | null>(() => {
        if (typeof window === 'undefined') return null;
        const p = (window.location.pathname || '/').replace(/\/$/, '') || '/';
        return (p === '/terms' || p === '/privacy') ? p : null;
    });

    // Context Settings State (Lifted from Children)
    const [chatQuality, setChatQuality] = useState<'low' | 'medium' | 'high'>('high');
    const [chatFormat, setChatFormat] = useState<'jpeg' | 'png'>('jpeg');
    const [chatAspectRatio, setChatAspectRatio] = useState<AspectRatio>('1:1');
    const [chatModel, setChatModel] = useState<GenModelId>('gemini-2.5-flash-image');
    const [videoDuration, setVideoDuration] = useState<'5' | '10'>('5');
    const [videoAspectRatio, setVideoAspectRatio] = useState<'16:9' | '9:16' | '1:1'>('16:9');
    const [videoNegativePrompt, setVideoNegativePrompt] = useState('blur, distort, and low quality');
    const [videoCfgScale, setVideoCfgScale] = useState(0.5);

    // Chat Shared State
    const [chatPrompt, setChatPrompt] = useState('');
    const [chatAttachedImages, setChatAttachedImages] = useState<string[]>([]);
    const [isChatGenerating, setIsChatGenerating] = useState(false);

    // Video Shared State (Lifting from AnimateInterface)
    const [videoPrompt, setVideoPrompt] = useState('');
    const [videoAttachedImage, setVideoAttachedImage] = useState<string | null>(null);
    const [isVideoGenerating, setIsVideoGenerating] = useState(false);
    const [videoStatus, setVideoStatus] = useState('Оживляем фото...');

    const videoFileInputRef = useRef<HTMLInputElement>(null);

    // Scroll Reset Ref
    const scrollViewportRef = useRef<HTMLDivElement>(null);

    // --- Effects ---

    // Sync legal route (/terms, /privacy) with browser back/forward
    useEffect(() => {
        const handler = () => {
            const p = (window.location.pathname || '/').replace(/\/$/, '') || '/';
            setLegalRoute((p === '/terms' || p === '/privacy') ? p : null);
        };
        window.addEventListener('popstate', handler);
        return () => window.removeEventListener('popstate', handler);
    }, []);

    // Scroll to top when category changes
    useEffect(() => {
        if (scrollViewportRef.current) {
            scrollViewportRef.current.scrollTo({ top: 0, behavior: 'instant' });
        }
    }, [activeCategory]);

    // Hero Auto-play
    useEffect(() => {
        const timer = setInterval(() => {
            setHeroIndex((prev) => (prev + 1) % FEATURED_SLIDES.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    // Funny Status Rotator
    useEffect(() => {
        let interval: any;
        if (appState === AppState.GENERATING) {
            setLoadingStatusIndex(0);
            interval = setInterval(() => {
                setLoadingStatusIndex((prev) => (prev + 1) % FUNNY_STATUSES.length);
            }, 2500);
        }
        return () => clearInterval(interval);
    }, [appState]);

    // Realtime User Profile Listener
    useEffect(() => {
        let unsubscribeUser: () => void = () => { };

        const setupRealtimeListener = async () => {
            if (!user) return;

            // 1. Ensure profile exists and get defaults
            await syncUserProfile(user);

            // 2. Listen to real-time changes
            if (db) {
                unsubscribeUser = db.collection('users').doc(user.uid).onSnapshot((doc) => {
                    if (doc.exists) {
                        const data = doc.data();

                        if (typeof data?.credits === 'number') {
                            setCredits(data.credits);
                        }

                        const tier = (data?.subscriptionTier || 'free').toLowerCase() as SubscriptionTier;
                        setUserTier(tier);
                    }
                }, (err) => {
                    console.error("User profile listener error:", err);
                });

                console.log(`[App] Loading history for user: ${user.uid}`);
                const cloudHistory = await getUserHistory(user.uid);
                console.log(`[App] Loaded ${cloudHistory.length} history items from Firestore`);
                if (cloudHistory.length > 0) {
                    setHistory(cloudHistory);
                    console.log(`[App] History set in state. First item:`, {
                        id: cloudHistory[0].id,
                        generated: cloudHistory[0].generated?.substring(0, 100),
                        isSaved: cloudHistory[0].isSaved
                    });
                }
            }
        };

        if (user) {
            setupRealtimeListener();

            const redirect = localStorage.getItem('auth_redirect');
            if (redirect) {
                setView(redirect as ViewMode);
                localStorage.removeItem('auth_redirect');
            }
            const p = (window.location.pathname || '/').replace(/\/$/, '') || '/';
            if (p === '/terms' || p === '/privacy') setLegalRoute(p);
        }

        return () => {
            unsubscribeUser();
        };
    }, [user]);

    // Payment Handler Effect
    useEffect(() => {
        if (user && window.location.search.includes('payment=success')) {
            const url = new URL(window.location.href);
            const rawPlan = url.searchParams.get('plan') || '';
            const plan = rawPlan.toLowerCase() as SubscriptionTier;
            const email = url.searchParams.get('email') || user.email || '';

            // Clean URL immediately to prevent double processing
            window.history.replaceState({}, '', window.location.origin);

            if (plan) {
                setView('profile'); // Возврат в личный кабинет после оплаты
                let creditsToAdd = 0;
                if (plan === 'creator') creditsToAdd = 350;
                else if (plan === 'pro') creditsToAdd = 750;
                else if (plan === 'business') creditsToAdd = 4000;
                else creditsToAdd = 45; // Fallback or unknown plan

                console.log(`Processing payment for ${plan}, adding ${creditsToAdd} credits`);

                // Optimistic update (основное начисление идёт через callback Альфы)
                purchaseSubscription(user.uid, plan, creditsToAdd).then(() => {
                    setPaymentEmail(email);
                    setShowPaymentSuccess(true);
                }).catch(err => {
                    console.error("Purchase processing failed:", err);
                    setErrorMsg("Ошибка начисления кредитов. Обратитесь в поддержку.");
                });
            }
        }
    }, [user]);

    // --- Handlers ---

    const calculateCost = () => {
        // Flash 2.5 (Standard) -> ~5 RUB real cost -> 15 Credits (Margin safe)
        if (selectedModel === 'gemini-2.5-flash-image' || !selectedModel) {
            return 15;
        }

        // Nano Banana 2 (Pro) -> ~20 RUB real cost -> 60 Credits (Margin safe)
        let base = 60;
        if (resolution === '2K') base = 90;
        if (resolution === '4K') base = 120; // Double the standard rate per user request
        return base;
    };
    const currentCost = calculateCost();

    const handleChatGenerate = async () => {
        if (!chatPrompt.trim() && chatAttachedImages.length === 0) return;
        if (credits < 15) {
            setErrorMsg('Недостаточно кредитов (15 кр)');
            setIsPricingOpen(true);
            return;
        }

        const textToUse = chatPrompt.trim();
        const imagesToUse = [...chatAttachedImages];
        const tempId = `temp-${Date.now()}`;

        // 1. CLEAR INPUTS & OPTIMISTIC UPDATE
        setIsChatGenerating(true);
        setChatPrompt('');
        setChatAttachedImages([]);

        const optimisticMsg: GeneratedImage = {
            id: tempId,
            original: imagesToUse[0] || null,
            generated: '', // Empty means loading
            prompt: textToUse,
            source: 'chat',
            createdAt: { seconds: Math.floor(Date.now() / 1000) } as any
        };
        setHistory(prev => [optimisticMsg, ...prev]);

        try {
            const modelId: GenModelId = chatModel;

            // OPTIMIZATION: Compress reference images before sending to API
            const compressedImages = await Promise.all(
                imagesToUse.map(img => img.startsWith('data:') ? compressImage(img, 1024) : Promise.resolve(img))
            );

            const references: ReferenceImage[] = compressedImages.map(img => ({
                data: cleanBase64(img),
                mimeType: getMimeType(img)
            }));

            // Deduct credits
            setCredits(c => Math.max(0, c - 15));
            if (user) await deductCredits(user.uid, 15);

            const generatedUrl = await generateImageWithGemini(
                textToUse,
                references,
                chatAspectRatio,
                modelId,
                {
                    quality: chatQuality,
                    format: chatFormat,
                    onProgress: (status) => {
                        // We can show progress in the optimistic message UI if we had a status field there, 
                        // but for now let's just log it or we could use a global toast.
                        console.log("Chat Gen Status:", status);
                    }
                }
            );

            // 2. SIMPLIFIED: Save to Storage FIRST, then show to user
            // This ensures all users see images from reliable Firebase Storage
            let finalStorageUrl = generatedUrl;

            if (user) {
                try {
                    console.log(`[App] Chat: Saving generated image to Storage for user: ${user.uid}`);
                    finalStorageUrl = await uploadImageToStorage(user.uid, generatedUrl, 'generated');
                    console.log(`[App] Chat: Generated image uploaded to Storage: ${finalStorageUrl}`);

                    let originalUrl = imagesToUse[0] || null;
                    if (originalUrl && originalUrl.startsWith('data:')) {
                        originalUrl = await uploadImageToStorage(user.uid, originalUrl, 'original');
                        console.log(`[App] Chat: Original image uploaded to Storage: ${originalUrl}`);
                    }

                    const finalItem: GeneratedImage = {
                        id: tempId,
                        original: originalUrl,
                        generated: finalStorageUrl,
                        prompt: textToUse,
                        source: 'chat',
                        createdAt: { seconds: Math.floor(Date.now() / 1000) } as any
                    };

                    // Update history with Storage URL
                    setHistory(prev => prev.map(item =>
                        item.id === tempId
                            ? finalItem
                            : item
                    ));

                    const docId = await saveGenerationToHistory(user.uid, finalItem);
                    console.log(`[App] Chat: Generation saved to Firestore with ID: ${docId}`);

                    // Update history item with real doc ID
                    if (docId) {
                        setHistory(prev => prev.map(item =>
                            item.id === tempId
                                ? { ...finalItem, id: docId }
                                : item
                        ));
                    }
                } catch (e) {
                    console.error("[App] Chat: Storage save error:", e);
                    // If Storage save fails, use original URL as fallback
                    finalStorageUrl = generatedUrl;
                    const fallbackItem: GeneratedImage = {
                        id: tempId,
                        original: imagesToUse[0] || null,
                        generated: finalStorageUrl,
                        prompt: textToUse,
                        source: 'chat',
                        createdAt: { seconds: Math.floor(Date.now() / 1000) } as any
                    };
                    setHistory(prev => prev.map(item =>
                        item.id === tempId
                            ? fallbackItem
                            : item
                    ));
                }
            } else {
                // No user - just show the generated URL
                const noUserItem: GeneratedImage = {
                    id: tempId,
                    original: imagesToUse[0] || null,
                    generated: generatedUrl,
                    prompt: textToUse,
                    source: 'chat',
                    createdAt: { seconds: Math.floor(Date.now() / 1000) } as any
                };
                setHistory(prev => prev.map(item =>
                    item.id === tempId
                        ? noUserItem
                        : item
                ));
            }

        } catch (error: any) {
            console.error(error);
            setErrorMsg(error.message || 'Ошибка генерации');
            setHistory(prev => prev.filter(item => item.id !== tempId));
        } finally {
            setIsChatGenerating(false);
        }
    };

    const calculateVideoCost = () => {
        return videoDuration === '10' ? 180 : 90;
    };

    const handleVideoGenerate = async () => {
        if (!videoPrompt.trim() && !videoAttachedImage) return;
        if (!videoAttachedImage) {
            setErrorMsg('Для анимации необходимо исходное фото');
            return;
        }

        const cost = calculateVideoCost();

        if (credits < cost) {
            setErrorMsg(`Недостаточно кредитов (${cost} кр)`);
            setIsPricingOpen(true);
            return;
        }

        const textToUse = videoPrompt.trim();
        const imageToUse = videoAttachedImage;
        const tempId = `temp-v-${Date.now()}`;

        setIsVideoGenerating(true);
        setVideoStatus('Инициализация...');
        setCredits(c => Math.max(0, c - cost));

        const optimisticMsg: GeneratedImage = {
            id: tempId,
            original: imageToUse,
            generated: '', // Loading
            prompt: textToUse || "Animate with smooth camera movement",
            source: 'video',
            createdAt: { seconds: Math.floor(Date.now() / 1000) } as any
        };
        setHistory(prev => [optimisticMsg, ...prev]);

        try {
            let cloudOriginal = imageToUse;
            if (imageToUse.startsWith('data:') && user) {
                setVideoStatus('Загрузка фото...');
                cloudOriginal = await uploadImageToStorage(user.uid, imageToUse, 'original');
            }

            const promptText = textToUse || "Animate this image with smooth camera movement";
            
            const { generateKlingVideo } = await import('./services/klingService');
            const videoUrl = await generateKlingVideo({
                prompt: promptText,
                image_url: cloudOriginal,
                duration: videoDuration,
                aspect_ratio: videoAspectRatio,
                negative_prompt: videoNegativePrompt,
                cfg_scale: videoCfgScale,
                onProgress: (status) => setVideoStatus(status)
            });

            const finalItem: GeneratedImage = {
                id: tempId, // keep optimistic id until Firestore returns real id
                original: cloudOriginal,
                generated: videoUrl,
                prompt: textToUse,
                source: 'video',
                createdAt: { seconds: Math.floor(Date.now() / 1000) } as any
            };

            setHistory(prev => prev.map(item => item.id === tempId ? finalItem : item));

            if (user) {
                await deductCredits(user.uid, cost);
                const docId = await saveGenerationToHistory(user.uid, finalItem);
                if (docId) {
                    setHistory(prev => prev.map(item =>
                        item.id === tempId ? { ...finalItem, id: docId } : item
                    ));
                }
            }

            setVideoStatus('Оживляем фото...');
            setVideoPrompt('');
            setVideoAttachedImage(null);

        } catch (error: any) {
            console.error(error);
            setErrorMsg(error.message || 'Ошибка видео-генерации');
            setHistory(prev => prev.filter(item => item.id !== tempId));
            setCredits(c => c + cost); // Refund
        } finally {
            setIsVideoGenerating(false);
        }
    };

    const handleVideoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                const base64 = ev.target?.result as string;
                setVideoAttachedImage(base64);
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerVideoFileSelect = () => videoFileInputRef.current?.click();

    const handleChatFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                setChatAttachedImages([result]);
            };
            reader.readAsDataURL(file);
        }
    };
    const chatFileInputRef = useRef<HTMLInputElement>(null);
    const triggerChatFileSelect = () => chatFileInputRef.current?.click();

    const handleTemplateSelect = (preset: Preset) => {
        setSelectedTemplate(preset);
        setView('dashboard');
        setMobileTab('settings');
    };

    const handleHeroClick = (id: string) => {
        const preset = ALL_PRESETS.find(p => p.id === id);
        if (preset) handleTemplateSelect(preset);
    };

    const handleGenerate = async () => {
        if (!originalImage && !subjectImage && !promptInput && !selectedTemplate) {
            setErrorMsg("Загрузите фото или введите описание");
            return;
        }

        if (credits < currentCost) {
            setErrorMsg("Недостаточно кредитов");
            setIsPricingOpen(true);
            return;
        }

        let parts: string[] = [];

        // 1. CORE IDENTITY (MUST BE FIRST)
        parts.push("TASK: Image-to-Image character preservation.");
        parts.push("SUBJECT IDENTITY: The output image MUST feature the EXACT SAME person shown in the reference image. Match their face, features, gender, and unique identity perfectly. Ignore any conflicting person descriptions in the style prompt.");

        // 1.1 GLOBAL IDENTITY ANCHOR PHRASES (магические фразы для сохранения лица)
        parts.push("CRUCIAL: Preserve the facial features exactly.");
        parts.push("Maintain 100% identical facial identity from the reference image.");
        parts.push("No plastic smoothing, keep natural skin texture and visible pores. Avoid cartoon, anime, 3D render or plastic doll look.");

        // 1.2 INTENSITY LOGIC (управление силой эффекта)
        parts.push(getIntensityPrompt(intensity));

        // 2. STYLE & TEMPLATE
        if (selectedTemplate) {
            parts.push(`STYLE/ENVIRONMENT: ${selectedTemplate.prompt}`);
        }

        // 2.1 GLOBAL REALISM CONSTRAINT (для всех, кроме явно мультяшных стилей)
        const cartoonKeywords = [
            "roblox",
            "lego",
            "minecraft",
            "stalcraft",
            "anime",
            "cartoon",
            "pixar",
            "pixar-style",
            "pixel art",
            "voxel",
            "low poly",
            "3d render",
            "3d character",
        ];
        const combinedPromptText = `${selectedTemplate?.prompt || ""} ${promptInput || ""}`.toLowerCase();
        const isCartoonStyle = cartoonKeywords.some(k => combinedPromptText.includes(k));
        if (!isCartoonStyle) {
            parts.push("REALISM: The output must look like a natural realistic photograph of a real human, not a cartoon, anime, 3D render, illustration, painting, or game-style character.");
        }

        // 3. USER REFINEMENT
        if (promptInput) parts.push(`ADDITIONAL DETAILS: ${promptInput}`);

        // 4. OVERLAY
        if (overlayText) parts.push(`OVERLAY TEXT: Include the text "${overlayText}" in the image.`);

        if (parts.length <= 2) parts.push("Enhance the photo with professional studio quality and high detail.");

        let finalPrompt = parts.join(' ');

        setAppState(AppState.GENERATING);
        setErrorMsg(null);
        setCredits(prev => Math.max(0, prev - currentCost));
        setGeneratedImage(null);
        setMobileTab('canvas');

        try {
            if (user) await deductCredits(user.uid, currentCost);

            // OPTIMIZATION: Compress source images
            const compOriginal = originalImage && originalImage.startsWith('data:') ? await compressImage(originalImage, 1024) : originalImage;
            const compSubject = subjectImage && subjectImage.startsWith('data:') ? await compressImage(subjectImage, 1024) : subjectImage;

            const refs: ReferenceImage[] = [];
            // Prioritize originalImage as the face reference
            if (compOriginal) refs.push({ data: cleanBase64(compOriginal), mimeType: getMimeType(compOriginal) });
            if (compSubject) refs.push({ data: cleanBase64(compSubject), mimeType: getMimeType(compSubject) });

            console.log(`[Gen] Refs prepared: ${refs.length}`);
            if (refs.length > 0) {
                console.log(`[Gen] First ref size: ${refs[0].data.length} chars`);
            } else {
                console.warn("[Gen] NO REFERENCE IMAGE! Generation will be text-only.");
            }

            // ENHANCED PROMPT FOR LIKENESS
            // Force the model to acknowledge the image input first
            const identityInstruction = "STRICT REQUIREMENT: Use the ATTACHED IMAGE as the absolute visual source. The output MUST depict the EXACT SAME PERSON (same face, same gender, same features) as in the attached image. Do not invent a new person. Do not change gender. Apply the style ONLY to the environment and clothing (if not specified otherwise).";

            // Prepend this instruction
            const consolidatedPrompt = `${identityInstruction} ${finalPrompt}`;

            setGenStatus('Запуск генерации...');
            console.log("[Gen] Final Prompt sent:", consolidatedPrompt);

            const generatedUrl = await generateImageWithGemini(
                consolidatedPrompt,
                refs,
                aspectRatio,
                selectedModel,
                {
                    onProgress: (status) => setGenStatus(status),
                    intensity: intensity, // Pass literal 0-100 value
                }
            );


            // 1. WATERMARK
            let finalGeneratedUrl = generatedUrl;
            if (userTier === 'free') {
                try {
                    setGenStatus('Добавление водяного знака...');
                    finalGeneratedUrl = await addWatermark(generatedUrl);
                } catch (e) {
                    console.error("Watermark failed", e);
                }
            }

            // 2. SIMPLIFIED: Save to Storage FIRST, then show to user
            // This ensures all users see images from reliable Firebase Storage
            let storageUrl = finalGeneratedUrl;

            if (user) {
                try {
                    setGenStatus('Сохранение изображения...');
                    console.log(`[App] Saving generated image to Storage for user: ${user.uid}`);
                    console.log(`[App] Generated URL to save: ${finalGeneratedUrl?.substring(0, 100)}...`);

                    // Save generated image to Storage
                    storageUrl = await uploadImageToStorage(user.uid, finalGeneratedUrl, 'generated');
                    console.log(`[App] Generated image uploaded to Storage: ${storageUrl}`);

                    // Save original images if needed
                    let originalUrl = compOriginal || compSubject;
                    if (originalUrl && originalUrl.startsWith('data:')) {
                        originalUrl = await uploadImageToStorage(user.uid, originalUrl, 'original');
                        console.log(`[App] Original image uploaded to Storage: ${originalUrl}`);
                    }

                    // Save to history
                    const newRecord: GeneratedImage = {
                        original: originalUrl,
                        generated: storageUrl,
                        prompt: finalPrompt,
                        source: 'studio',
                        isSaved: true,
                        createdAt: { seconds: Date.now() / 1000 } as any
                    };

                    const docId = await saveGenerationToHistory(user.uid, newRecord);
                    const finalItem = { ...newRecord, id: docId || `temp_${Date.now()}` };

                    console.log(`[App] Generation saved to Firestore with ID: ${docId}`);
                    setCurrentImageId(finalItem.id);
                    setHistory(prev => [finalItem, ...prev]);
                } catch (e) {
                    console.error("[App] Storage save error:", e);
                    // If Storage save fails, still show the image (fallback to original URL)
                    // But log the error for debugging
                    if (!storageUrl || storageUrl === finalGeneratedUrl) {
                        storageUrl = finalGeneratedUrl;
                    }
                }
            }

            // 3. Show image to user ONLY after Storage save (or fallback to original)
            // Clear recovery attempts for new image
            imageRecoveryAttempted.current.clear();
            setGeneratedImage(storageUrl);
            setAppState(AppState.SUCCESS);
            setGenStatus('');
            console.log(`[App] Generated image displayed: ${storageUrl?.substring(0, 100)}...`);

        } catch (err: any) {
            console.error("[App] Generation error:", err);
            console.error("[App] Error details:", {
                message: err.message,
                stack: err.stack,
                response: err.response,
                status: err.status
            });
            setAppState(AppState.ERROR);
            const errorMessage = err.message || err.toString() || "Ошибка генерации. Попробуйте еще раз.";
            setErrorMsg(errorMessage);
            setGenStatus('');
            setCredits(prev => (prev || 0) + currentCost);
        }
    };

    const handleDownload = async (imageUrl: string) => {
        const looksLikeVideo = imageUrl.startsWith('data:video') || /\.mp4(\?|$)/i.test(imageUrl);
        const defaultExt = looksLikeVideo ? 'mp4' : 'jpg';
        const baseName = looksLikeVideo ? 'photo-smart-video' : 'photo-smart';
        const fileName = `${baseName}-${Date.now()}.${defaultExt}`;
        try {
            if (imageUrl.startsWith('data:')) {
                // Try to infer better extension from data URL mime type
                const mimeMatch = imageUrl.match(/^data:([^;]+);base64,/);
                const mime = mimeMatch?.[1] || '';
                const ext =
                    mime.includes('video/') ? 'mp4' :
                    mime.includes('image/png') ? 'png' :
                    mime.includes('image/webp') ? 'webp' :
                    'jpg';
                const link = document.createElement('a');
                link.href = imageUrl;
                link.download = `${baseName}-${Date.now()}.${ext}`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                return;
            }
            const response = await fetch(imageUrl, { mode: 'cors' });
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);
            const ext =
                blob.type.includes('video/') ? 'mp4' :
                blob.type.includes('image/png') ? 'png' :
                blob.type.includes('image/webp') ? 'webp' :
                'jpg';
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = `${baseName}-${Date.now()}.${ext}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
        } catch (e) {
            const link = document.createElement('a');
            link.href = imageUrl;
            link.download = fileName;
            link.target = '_blank';
            link.rel = 'noopener';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const handleShare = async (imageUrl: string) => {
        try {
            let file: File;
            if (imageUrl.startsWith('data:')) {
                const res = await fetch(imageUrl);
                const blob = await res.blob();
                file = new File([blob], "generated-image.jpg", { type: blob.type || "image/jpeg" });
            } else {
                const response = await fetch(imageUrl, { mode: 'cors' });
                const blob = await response.blob();
                file = new File([blob], "generated-image.jpg", { type: blob.type || "image/jpeg" });
            }

            if (navigator.share && navigator.canShare?.({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: 'Photo Smart AI',
                    text: 'Создано в Photo Smart AI'
                });
            } else if (navigator.clipboard?.write) {
                try {
                    await navigator.clipboard.write([
                        new ClipboardItem({ [file.type]: file })
                    ]);
                    alert('Изображение скопировано в буфер обмена');
                } catch {
                    await navigator.clipboard.writeText(imageUrl);
                    alert('Ссылка на изображение скопирована');
                }
            } else {
                await navigator.clipboard.writeText(imageUrl);
                alert('Ссылка на изображение скопирована. Поделитесь ею.');
            }
        } catch (error) {
            console.error("Share failed:", error);
            try {
                await navigator.clipboard.writeText(imageUrl);
                alert('Ссылка на изображение скопирована. Поделитесь ею.');
            } catch {
                alert('Не удалось поделиться. Скачайте изображение и отправьте вручную.');
            }
        }
    };

    const handleToggleSave = async (id: string) => {
        const itemIndex = history.findIndex(h => h.id === id);
        if (itemIndex === -1) return;

        const newItem = { ...history[itemIndex], isSaved: !history[itemIndex].isSaved };
        const newHistory = [...history];
        newHistory[itemIndex] = newItem;
        setHistory(newHistory);

        if (!id.startsWith('temp_') && !id.startsWith('local_')) {
            const success = await toggleSavedStatus(id, newItem.isSaved || false);
            if (!success) {
                console.warn("Server sync failed, keeping local state");
            }
        }
    };

    // Helper function to handle failed fal.media URLs by trying to re-persist them
    const handleFailedImage = async (itemId: string, imageUrl: string) => {
        // Only handle fal.media URLs
        if (!imageUrl?.includes('fal.media')) {
            return false;
        }

        if (!user) return false;

        try {
            console.log("Attempting to re-persist failed fal.media URL:", imageUrl);

            // For fal.media URLs, use Cloud Function directly to avoid CORS and permission issues
            const functionUrl = "https://us-central1-project-1285666415996898989.cloudfunctions.net/saveImageToHistory";

            try {
                const proxyResp = await fetch(functionUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: user.uid, imageUrl: imageUrl, type: 'generated' })
                });

                if (!proxyResp.ok) {
                    const errorText = await proxyResp.text();
                    console.error("Cloud Function failed:", errorText);
                    // If it's a permission error (412), log it but don't throw
                    if (proxyResp.status === 412) {
                        console.warn("Firebase Storage permission error. Please check Firebase Console Storage settings.");
                    }
                    return false;
                }

                const data = await proxyResp.json();
                const newUrl = data.url;

                if (newUrl && newUrl !== imageUrl) {
                    // Update the history item with the new URL
                    const itemIndex = history.findIndex(h => h.id === itemId);
                    if (itemIndex !== -1) {
                        const updatedItem = { ...history[itemIndex], generated: newUrl };
                        const newHistory = [...history];
                        newHistory[itemIndex] = updatedItem;
                        setHistory(newHistory);

                        // Try to update in Firestore if it's a real document
                        if (!itemId.startsWith('temp_') && !itemId.startsWith('local_') && db) {
                            try {
                                await db.collection('generations').doc(itemId).update({
                                    generated: newUrl
                                });
                            } catch (e) {
                                console.warn("Failed to update Firestore:", e);
                            }
                        }

                        console.log("Successfully re-persisted image:", newUrl);
                        return true;
                    }
                }
            } catch (proxyError: any) {
                console.error("Cloud Function request failed:", proxyError);
                // Fallback to regular uploadImageToStorage if Cloud Function is unavailable
                try {
                    const newUrl = await uploadImageToStorage(user.uid, imageUrl, 'generated');
                    if (newUrl && newUrl !== imageUrl) {
                        const itemIndex = history.findIndex(h => h.id === itemId);
                        if (itemIndex !== -1) {
                            const updatedItem = { ...history[itemIndex], generated: newUrl };
                            const newHistory = [...history];
                            newHistory[itemIndex] = updatedItem;
                            setHistory(newHistory);

                            if (!itemId.startsWith('temp_') && !itemId.startsWith('local_') && db) {
                                try {
                                    await db.collection('generations').doc(itemId).update({
                                        generated: newUrl
                                    });
                                } catch (e) {
                                    console.warn("Failed to update Firestore:", e);
                                }
                            }
                            return true;
                        }
                    }
                } catch (fallbackError) {
                    console.error("Fallback upload also failed:", fallbackError);
                }
            }
        } catch (error: any) {
            console.error("Failed to re-persist image:", error);
            // Check if it's a permission error
            if (error?.code === 412 || error?.message?.includes('permission') || error?.message?.includes('412')) {
                console.warn("Firebase Storage permission error detected. Please check Firebase Console Storage settings.");
            }
        }

        return false;
    };

    const isCurrentSaved = currentImageId
        ? history.find(h => h.id === currentImageId)?.isSaved
        : false;

    const savedHistory = history.filter(h => h.isSaved);

    if (loading) {
        return (
            <div className="h-screen w-screen bg-[#0B0E14] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-brand-accent animate-spin" />
            </div>
        );
    }

    if (!user) {
        return (
            <>
                <SEO
                    title="1 фото → 150+ стилей за минуту. Генерация картинок ИИ | SmartPhotos"
                    description="Загрузите одно фото — получите ретро, свадьбу, маркетплейс, портрет. Нейросеть сохраняет лицо. Оживление фото в видео. Бесплатный старт."
                    path="/"
                />
                <LandingPage onOpenInfo={(page) => setInfoPage(page)} />
                <InfoModal page={infoPage} onClose={() => setInfoPage(null)} />
                <CookieConsent />
            </>
        );
    }

    // Logged-in: show /terms or /privacy when URL is /terms or /privacy
    if (legalRoute === '/terms' || legalRoute === '/privacy') {
        const goBack = () => {
            setLegalRoute(null);
            window.history.replaceState({}, '', '/');
        };
        const isTerms = legalRoute === '/terms';
        return (
            <div className="min-h-screen bg-[#050505] text-gray-300">
                <SEO
                    title={isTerms ? 'Условия использования | SmartPhotos — генерация картинок ИИ' : 'Политика конфиденциальности | SmartPhotos'}
                    description={isTerms ? 'Правила использования SmartPhotos: генерация картинок ИИ, стилизация фотографий, оживление фото. Тарифы и кредиты.' : 'Как мы защищаем ваши данные при генерации изображений и использовании сервиса SmartPhotos.'}
                    path={legalRoute || '/'}
                />
                <header className="fixed top-0 inset-x-0 z-50 flex items-center gap-4 px-6 py-4 bg-[#050505]/90 border-b border-white/5 backdrop-blur-md">
                    <button
                        type="button"
                        onClick={goBack}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Назад</span>
                    </button>
                </header>
                {legalRoute === '/terms' ? <TermsPage /> : <PrivacyPage />}
                <CookieConsent />
            </div>
        );
    }

    return (
        <div className="h-screen bg-brand-bg text-brand-text font-sans flex flex-col overflow-hidden selection:bg-brand-accent selection:text-white">
            <SEO
                title="Студия генерации картинок ИИ — 150+ шаблонов | SmartPhotos"
                description="Ретро, свадьба, маркетплейс, портреты. Оживите фото в видео. Чат с нейросетью. Сохранение лица в каждом стиле. Создавайте за минуту."
                path="/"
            />
            <CookieConsent />

            <PricingModal
                isOpen={isPricingOpen}
                onClose={() => setIsPricingOpen(false)}
                onSuccess={() => { }}
                currentTier={userTier}
            />

            {/* Success Modal - Enhanced for Alfa Bank Flow */}
            {showPaymentSuccess && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#151921] border border-green-500 rounded-2xl p-8 text-center max-w-sm w-full shadow-2xl animate-in zoom-in-95">
                        <div className="relative mb-6">
                            <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full"></div>
                            <PartyPopper className="w-16 h-16 text-green-500 mx-auto relative z-10" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Оплата прошла успешно!</h2>
                        <p className="text-gray-400 mb-1">Кредиты зачислены на баланс.</p>
                        <p className="text-[10px] text-gray-500 mb-6 italic">Электронный чек отправлен на {paymentEmail}</p>
                        <button
                            onClick={() => setShowPaymentSuccess(false)}
                            className="w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded-xl font-bold transition-all hover:scale-105 active:scale-95"
                        >
                            Начать творчество
                        </button>
                    </div>
                </div>
            )}

            <Header
                toggleSidebar={() => setIsMobileSidebarOpen(true)}
                credits={credits || 0}
                onOpenProfile={() => setView('profile')}
                userTier={userTier}
                showBackOnMobile={view === 'chat' || view === 'video'}
                onBack={() => { setView('dashboard'); setIsMobileSidebarOpen(false); }}
            />

            <div className="flex-1 flex overflow-hidden relative">

                <Sidebar
                    categories={CATEGORIES}
                    activeCategory={activeCategory}
                    onSelectCategory={(id) => { setActiveCategory(id); setView('dashboard'); setMobileTab('canvas'); }}
                    isCollapsed={isSidebarCollapsed}
                    toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                    credits={credits || 0}
                    userTier={userTier}
                    isOpen={isMobileSidebarOpen}
                    onClose={() => setIsMobileSidebarOpen(false)}
                    currentView={view}
                    onChangeView={setView}
                    chatSettings={{
                        quality: chatQuality,
                        format: chatFormat,
                        aspectRatio: chatAspectRatio,
                        model: chatModel,
                        setModel: setChatModel,
                        setQuality: setChatQuality,
                        setFormat: setChatFormat,
                        setAspectRatio: setChatAspectRatio,
                        prompt: chatPrompt,
                        setPrompt: setChatPrompt,
                        attachedImages: chatAttachedImages,
                        setAttachedImages: setChatAttachedImages,
                        isGenerating: isChatGenerating,
                        onGenerate: handleChatGenerate,
                        triggerFileSelect: triggerChatFileSelect
                    }}
                    videoSettings={{
                        duration: videoDuration,
                        aspectRatio: videoAspectRatio,
                        negativePrompt: videoNegativePrompt,
                        cfgScale: videoCfgScale,
                        setDuration: setVideoDuration,
                        setAspectRatio: setVideoAspectRatio,
                        setNegativePrompt: setVideoNegativePrompt,
                        setCfgScale: setVideoCfgScale,
                    }}
                />

                {/* Profile Settings Page */}
                {view === 'profile' && (
                    <div className="flex-1 min-w-0 overflow-hidden relative">
                        <ProfileSettings
                            credits={credits || 0}
                            userTier={userTier}
                            generatedCount={history.length}
                        />
                    </div>
                )}

                {view === 'dashboard' && (
                    <>
                        <div className={`
                w-full md:w-[320px] lg:w-[360px] bg-brand-sidebar border-r border-brand-border flex-col h-full shrink-0 z-20 shadow-xl overflow-hidden
                ${mobileTab === 'settings' ? 'flex' : 'hidden md:flex'}
              `}>
                            <div className="p-3 border-b border-brand-border shrink-0 bg-brand-sidebar">
                                <h2 className="font-bold text-brand-text flex items-center gap-1.5 text-xs uppercase tracking-wider">
                                    <Wand2 className="w-3.5 h-3.5 text-brand-accent" /> Настройки генерации
                                </h2>
                            </div>

                            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3">

                                <div className="space-y-2">
                                    <p className="text-[10px] font-bold text-brand-muted uppercase tracking-wider flex items-center gap-1.5">
                                        <Folder className="w-2.5 h-2.5" /> Исходные изображения
                                    </p>
                                    <div className="grid grid-cols-2 gap-2">
                                        <ImageUploader
                                            currentImage={originalImage}
                                            onImageUpload={setOriginalImage}
                                            onClear={() => setOriginalImage(null)}
                                            disabled={appState === AppState.GENERATING}
                                            variant="default"
                                        />
                                        <ImageUploader
                                            currentImage={subjectImage}
                                            onImageUpload={setSubjectImage}
                                            onClear={() => setSubjectImage(null)}
                                            disabled={appState === AppState.GENERATING}
                                            variant="default"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-[10px] font-bold text-brand-muted uppercase tracking-wider flex items-center gap-1.5">
                                        <Wand2 className="w-2.5 h-2.5" /> Стиль и Тема
                                    </p>
                                    {selectedTemplate ? (
                                        <div className="flex items-center gap-2 p-2 bg-brand-accent/10 border border-brand-accent/30 rounded-lg group transition-all">
                                            <div className="w-10 h-10 rounded overflow-hidden shrink-0 border border-brand-accent/20">
                                                <img src={`/templates/${selectedTemplate.id}.jpg`} className="w-full h-full object-cover" alt="Template" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[9px] font-bold text-brand-accent uppercase tracking-tighter truncate">{selectedTemplate.id}</p>
                                                <p className="text-[10px] text-brand-text font-medium truncate">{selectedTemplate.prompt.substring(0, 25)}...</p>
                                            </div>
                                            <button onClick={() => setSelectedTemplate(null)} className="p-0.5 hover:bg-brand-accent/20 rounded text-brand-accent">
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div onClick={() => { setActiveCategory('all'); setMobileTab('canvas'); }} className="p-2.5 bg-brand-bg border border-brand-border border-dashed rounded-lg text-center cursor-pointer hover:border-brand-accent/50 transition-all hover:bg-brand-accent/5 group">
                                            <p className="text-[10px] text-brand-muted group-hover:text-brand-accent transition-colors">Выберите шаблон из библиотеки</p>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <p className="text-[10px] font-bold text-brand-muted uppercase tracking-wider flex items-center gap-1.5">
                                        <Type className="w-2.5 h-2.5" /> Уточнение запроса
                                    </p>
                                    <textarea
                                        value={promptInput}
                                        onChange={(e) => setPromptInput(e.target.value)}
                                        placeholder="Напр: белый цвет одежды, летний фон, улыбка..."
                                        className="w-full bg-brand-bg border border-brand-border rounded-lg p-2.5 text-xs text-brand-text placeholder:text-brand-muted/50 focus:border-brand-accent/50 focus:ring-1 focus:ring-brand-accent/50 outline-none resize-none transition-all h-20 font-medium"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <p className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">Параметры</p>

                                    <div className="grid grid-cols-3 gap-1.5">
                                        {(['1:1', '4:5', '9:16'] as AspectRatio[]).map(ratio => (
                                            <button
                                                key={ratio}
                                                onClick={() => setAspectRatio(ratio)}
                                                className={`py-1.5 rounded-md border text-[9px] font-bold flex flex-col items-center gap-0.5 transition-all ${aspectRatio === ratio ? 'bg-white text-black border-white shadow-md' : 'bg-brand-bg border-brand-border text-brand-muted hover:border-brand-muted'}`}
                                            >
                                                {ratio === '1:1' && <Square className="w-2.5 h-2.5" />}
                                                {ratio === '4:5' && <RectangleVertical className="pt-0.5 w-2.5 h-2.5" />}
                                                {ratio === '9:16' && <RectangleVertical className="w-2.5 h-3" />}
                                                {ratio}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="space-y-1.5">
                                        <div className="flex justify-between items-center px-0.5">
                                            <p className="text-[9px] font-bold text-brand-muted uppercase">Интенсивность</p>
                                            <span className="text-[9px] font-bold text-brand-accent">{intensity}%</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={intensity}
                                            onChange={(e) => setIntensity(parseInt(e.target.value))}
                                            className="w-full accent-brand-accent h-1 bg-brand-border rounded-lg appearance-none cursor-pointer"
                                        />
                                    </div>

                                    <div className="space-y-1.5 pt-1 relative">
                                        <p className="text-[10px] font-bold text-brand-muted uppercase">Модель</p>

                                        <div className="relative">
                                            {(() => {
                                                const MODEL_OPTIONS = [
                                                    { id: 'gemini-2.5-flash-image', label: 'Быстрая (стандарт)', desc: 'Google Gemini 2.5', icon: Zap, color: 'text-orange-500' },
                                                    { id: 'gemini-3-pro-image-preview', label: 'Максимум деталей (Pro)', desc: 'Google Gemini 3.0', icon: Cpu, color: 'text-blue-500' }
                                                ] as const;
                                                const activeOpt = MODEL_OPTIONS.find(m => m.id === selectedModel) || MODEL_OPTIONS[0];

                                                return (
                                                    <>
                                                        <button
                                                            onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                                                            className="w-full flex items-center justify-between p-2.5 rounded-lg border bg-brand-bg border-brand-border text-brand-text hover:border-brand-accent/50 transition-all"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-7 h-7 rounded-md bg-gray-800 flex items-center justify-center">
                                                                    <activeOpt.icon className={`w-3.5 h-3.5 ${activeOpt.color}`} />
                                                                </div>
                                                                <div className="text-left">
                                                                    <p className="text-xs font-bold">{activeOpt.label}</p>
                                                                    <p className="text-[9px] opacity-60">{activeOpt.desc}</p>
                                                                </div>
                                                            </div>
                                                            <ChevronDown className={`w-4 h-4 text-brand-muted transition-transform ${isModelDropdownOpen ? 'rotate-180' : ''}`} />
                                                        </button>

                                                        {isModelDropdownOpen && (
                                                            <>
                                                                <div className="fixed inset-0 z-40" onClick={() => setIsModelDropdownOpen(false)}></div>
                                                                <div className="absolute top-full left-0 right-0 mt-2 bg-brand-sidebar border border-brand-border rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 p-1 space-y-1">
                                                                    {MODEL_OPTIONS.map(opt => (
                                                                        <button
                                                                            key={opt.id}
                                                                            onClick={() => { setSelectedModel(opt.id as GenModelId); setIsModelDropdownOpen(false); }}
                                                                            className={`w-full flex items-center gap-3 p-2 rounded-lg transition-all ${selectedModel === opt.id ? 'bg-brand-accent/10' : 'hover:bg-brand-bg'}`}
                                                                        >
                                                                            <div className={`w-6 h-6 rounded flex items-center justify-center ${selectedModel === opt.id ? 'bg-brand-accent/20' : 'bg-gray-800'}`}>
                                                                                <opt.icon className={`w-3 h-3 ${opt.color}`} />
                                                                            </div>
                                                                            <div className="text-left">
                                                                                <p className={`text-xs ${selectedModel === opt.id ? 'font-bold text-brand-accent' : 'font-medium text-brand-text'}`}>{opt.label}</p>
                                                                            </div>
                                                                            {selectedModel === opt.id && <div className="ml-auto w-1.5 h-1.5 bg-brand-accent rounded-full"></div>}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </>
                                                        )}
                                                    </>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2 pt-1">
                                    <p className="text-[10px] font-bold text-brand-muted uppercase tracking-wider flex items-center gap-1.5">
                                        <History className="w-2.5 h-2.5" /> Недавние
                                    </p>
                                    {history.length === 0 ? (
                                        <div className="p-2.5 bg-brand-bg/50 border border-brand-border border-dashed rounded-lg text-center">
                                            <p className="text-[9px] text-brand-muted">История пуста</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-3 gap-2">
                                            {history.slice(0, 6).map((item, idx) => {
                                                const isVideo = item.source === 'video' || /\.mp4(\?|$)/i.test(item.generated || '');
                                                const isValidUrl = item.generated && (
                                                    item.generated.startsWith('http') ||
                                                    item.generated.startsWith('data:image') ||
                                                    item.generated.startsWith('data:video') ||
                                                    item.generated.startsWith('blob:')
                                                );
                                                return (
                                                    <div
                                                        key={item.id || idx}
                                                        className="group relative rounded-lg overflow-hidden border border-brand-border bg-gray-100 aspect-square cursor-pointer hover:border-brand-accent transition-all"
                                                        onClick={() => {
                                                            if (isValidUrl) {
                                                                // Clear recovery attempts when opening from history
                                                                imageRecoveryAttempted.current.clear();
                                                                setGeneratedImage(item.generated);
                                                                setCurrentImageId(item.id || null);
                                                            }
                                                        }}
                                                    >
                                                        {isValidUrl && !item.generated?.startsWith('local_heavy_') ? (
                                                            isVideo ? (
                                                                <video
                                                                    src={item.generated}
                                                                    className="w-full h-full object-cover"
                                                                    muted
                                                                    playsInline
                                                                    loop
                                                                    preload="metadata"
                                                                    onMouseOver={(e) => (e.currentTarget as any).play?.()}
                                                                    onMouseOut={(e) => (e.currentTarget as any).pause?.()}
                                                                />
                                                            ) : (
                                                            <img
                                                                src={item.generated}
                                                                className="w-full h-full object-cover"
                                                                loading="lazy"
                                                                alt="History"
                                                                onError={async (e) => {
                                                                    const imageUrl = item.generated;
                                                                    console.warn("Failed to load history image:", item.id, imageUrl?.substring(0, 50));

                                                                    // Try to re-persist fal.media URLs
                                                                    if (imageUrl?.includes('fal.media') && item.id) {
                                                                        const success = await handleFailedImage(item.id, imageUrl);
                                                                        if (success) {
                                                                            // Image was re-persisted, the component will re-render with new URL
                                                                            return;
                                                                        }
                                                                    }

                                                                    // Show error placeholder
                                                                    e.currentTarget.style.display = 'none';
                                                                    const parent = e.currentTarget.parentElement;
                                                                    if (parent) {
                                                                        parent.innerHTML = '<div class="w-full h-full flex items-center justify-center text-[8px] text-brand-muted">Ошибка загрузки</div>';
                                                                    }
                                                                }}
                                                            />
                                                            )
                                                        ) : item.generated?.startsWith('local_heavy_') ? (
                                                            <div className="w-full h-full flex items-center justify-center text-[8px] text-brand-muted">
                                                                Изображение слишком велико для сохранения.
                                                            </div>
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-[8px] text-brand-muted p-1 text-center">
                                                                Нет изображения
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="p-3 border-t border-brand-border bg-brand-sidebar space-y-2 shrink-0 pb-24 md:pb-3">
                                {errorMsg && (
                                    <div className="text-red-400 text-[11px] text-center px-2 py-1 bg-red-500/10 rounded-lg border border-red-500/20 leading-snug">{errorMsg}</div>
                                )}

                                <button
                                    onClick={handleGenerate}
                                    disabled={appState === AppState.GENERATING}
                                    className="w-full bg-white hover:bg-gray-200 text-black font-bold text-xs py-2.5 rounded-lg transition-all shadow-md active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {appState === AppState.GENERATING ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Zap className="w-4 h-4 text-black" /> Генерировать · {currentCost} кр</>}
                                </button>
                            </div>
                        </div>

                        <div className={`
                 flex-1 flex-col min-w-0 bg-brand-bg relative transition-all duration-300
                 ${mobileTab === 'canvas' ? 'flex' : 'hidden md:flex'}
              `}>
                            <div className="flex-1 flex flex-col items-center justify-start overflow-hidden relative pb-24 md:pb-6">

                                {appState === AppState.GENERATING && (
                                    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-brand-bg/80 backdrop-blur-md animate-in fade-in duration-500">
                                        <div className="relative mb-8">
                                            <div className="absolute inset-0 bg-brand-accent/20 blur-3xl rounded-full animate-pulse"></div>
                                            <Loader2 className="w-16 h-16 text-brand-accent animate-spin relative z-10" />
                                        </div>
                                        <div className="text-center space-y-4 max-w-xs px-4">
                                            <p className="text-xl font-bold text-white tracking-wide animate-pulse">
                                                {genStatus || FUNNY_STATUSES[loadingStatusIndex]}
                                            </p>
                                            <div className="flex gap-1 justify-center">
                                                {[0, 1, 2].map(i => (
                                                    <div key={i} className="w-1.5 h-1.5 bg-brand-accent rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }}></div>
                                                ))}
                                            </div>
                                            {!genStatus && <p className="text-xs text-brand-muted/60 italic">Это может занять до 15 секунд...</p>}
                                        </div>
                                    </div>
                                )}

                                {activeCategory === 'saved' ? (
                                    <div ref={scrollViewportRef} className="w-full h-full overflow-y-auto custom-scrollbar p-6">
                                        <h1 className="text-2xl font-bold text-brand-text mb-6 flex items-center gap-2">
                                            <Bookmark className="w-6 h-6 text-brand-accent" /> Сохраненное
                                        </h1>

                                        {savedHistory.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center h-96 text-brand-muted text-center max-w-md mx-auto">
                                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                                                    <Heart className="w-8 h-8 text-brand-muted opacity-50" />
                                                </div>
                                                <h3 className="text-lg font-bold text-brand-text mb-2">Здесь пока пусто</h3>
                                                <p className="mb-6">Нажмите на сердечко <Heart className="w-3 h-3 inline text-red-500 fill-red-500" /> после генерации, чтобы сохранить лучшие результаты.</p>
                                                <button onClick={() => { setActiveCategory('all'); setView('dashboard'); }} className="px-6 py-2 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors">
                                                    Создать шедевр
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                                {savedHistory.map((item) => {
                                                    const isValidUrl = item.generated && (
                                                        item.generated.startsWith('http') ||
                                                        item.generated.startsWith('data:image') ||
                                                        item.generated.startsWith('data:video') ||
                                                        item.generated.startsWith('blob:')
                                                    );
                                                    return (
                                                        <div
                                                            key={item.id}
                                                            className="group relative aspect-square rounded-xl overflow-hidden border border-brand-border bg-gray-100 cursor-pointer hover:border-brand-accent transition-all"
                                                            onClick={() => {
                                                                if (isValidUrl) {
                                                                    // Clear recovery attempts when opening from history
                                                                    imageRecoveryAttempted.current.clear();
                                                                    setGeneratedImage(item.generated);
                                                                    setCurrentImageId(item.id || null);
                                                                    setAppState(AppState.SUCCESS);
                                                                    setMobileTab('canvas');
                                                                }
                                                            }}
                                                        >
                                                            {isValidUrl ? (
                                                                item.source === 'video' ? (
                                                                    <div className="relative w-full h-full group/video">
                                                                        <video
                                                                            src={item.generated}
                                                                            className="w-full h-full object-cover"
                                                                            muted
                                                                            loop
                                                                            onMouseOver={(e) => (e.target as HTMLVideoElement).play()}
                                                                            onMouseOut={(e) => (e.target as HTMLVideoElement).pause()}
                                                                        />
                                                                        <div className="absolute top-2 left-2 bg-black/50 backdrop-blur rounded p-1">
                                                                            <Video className="w-3 h-3 text-white" />
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <img
                                                                        src={item.generated}
                                                                        alt="Saved"
                                                                        className="w-full h-full object-cover"
                                                                        onError={async (e) => {
                                                                            const imageUrl = item.generated;
                                                                            console.warn("Failed to load saved image:", item.id, imageUrl?.substring(0, 50));

                                                                            // Try to re-persist fal.media URLs
                                                                            if (imageUrl?.includes('fal.media') && item.id) {
                                                                                const success = await handleFailedImage(item.id, imageUrl);
                                                                                if (success) {
                                                                                    // Image was re-persisted, the component will re-render with new URL
                                                                                    return;
                                                                                }
                                                                            }

                                                                            // Show error placeholder
                                                                            e.currentTarget.style.display = 'none';
                                                                            const parent = e.currentTarget.parentElement;
                                                                            if (parent) {
                                                                                const placeholder = document.createElement('div');
                                                                                placeholder.className = 'w-full h-full flex items-center justify-center text-[10px] text-brand-muted bg-gray-200';
                                                                                placeholder.textContent = imageUrl?.includes('fal.media')
                                                                                    ? 'Загрузка...'
                                                                                    : 'Ошибка загрузки';
                                                                                parent.appendChild(placeholder);
                                                                            }
                                                                        }}
                                                                    />
                                                                )
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-[10px] text-brand-muted bg-gray-200">
                                                                    Нет изображения
                                                                </div>
                                                            )}
                                                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all"></div>
                                                            <div className="absolute top-2 right-2">
                                                                <div className="p-1.5 bg-black/50 backdrop-blur rounded-full text-red-500">
                                                                    <Heart className="w-3.5 h-3.5 fill-red-500" />
                                                                </div>
                                                            </div>
                                                            {/* Download button */}
                                                            {isValidUrl && (
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleDownload(item.generated);
                                                                    }}
                                                                    className="absolute bottom-2 left-2 p-1.5 bg-black/50 backdrop-blur rounded-full text-white hover:bg-black/60 transition-colors"
                                                                    title="Скачать"
                                                                >
                                                                    <Download className="w-3.5 h-3.5" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                ) : generatedImage ? (
                                    <div className="w-full h-full flex items-center justify-center p-4 md:p-6 animate-in zoom-in-95 duration-300 relative">
                                        <div className="relative group max-w-full max-h-full">
                                            {currentImageId && history.find(h => h.id === currentImageId)?.source === 'video' ? (
                                                <video
                                                    src={generatedImage}
                                                    className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl border border-white/10"
                                                    controls
                                                    autoPlay
                                                    loop
                                                    onError={() => console.error("Video load failed")}
                                                />
                                            ) : (
                                                <img
                                                    src={generatedImage}
                                                    alt="Generated"
                                                    className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl border border-white/10"
                                                    onError={(e) => {
                                                        console.error("[App] Failed to load generated image in preview:", generatedImage);
                                                        const img = e.currentTarget;
                                                        const parent = img.parentElement;

                                                        // Simplified: Check if we have a saved Storage URL in history
                                                        let recoveredUrl: string | null = null;

                                                        if (currentImageId) {
                                                            const historyItem = history.find(h => h.id === currentImageId);
                                                            if (historyItem?.generated &&
                                                                historyItem.generated !== generatedImage &&
                                                                (historyItem.generated.includes('firebasestorage') ||
                                                                    historyItem.generated.includes('smartphotos.ru'))) {
                                                                recoveredUrl = historyItem.generated;
                                                                console.log("[App] Found saved Storage URL in history, using it:", recoveredUrl.substring(0, 100));
                                                            }
                                                        }

                                                        // If we found a saved URL, try to use it
                                                        if (recoveredUrl) {
                                                            console.log("[App] Updating image source to saved Storage URL");
                                                            setGeneratedImage(recoveredUrl);
                                                            img.src = recoveredUrl;
                                                            img.style.display = '';
                                                            return;
                                                        }

                                                        // If no recovery possible, show error message
                                                        img.style.display = 'none';
                                                        if (parent) {
                                                            const errorDiv = document.createElement('div');
                                                            errorDiv.className = 'text-center p-8 text-brand-muted';
                                                            errorDiv.innerHTML = `
                                                                <div class="mb-4">
                                                                    <ImageIcon class="w-16 h-16 mx-auto opacity-50" />
                                                                </div>
                                                                <p class="text-sm mb-2">Ошибка загрузки изображения</p>
                                                                <p class="text-xs opacity-75 mb-4">Попробуйте обновить страницу</p>
                                                                <button 
                                                                    onclick="window.location.reload()" 
                                                                    class="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs transition-colors"
                                                                >
                                                                    Обновить страницу
                                                                </button>
                                                            `;
                                                            parent.appendChild(errorDiv);
                                                        }
                                                    }}
                                                    onLoad={() => {
                                                        console.log("[App] Generated image loaded successfully in preview:", generatedImage?.substring(0, 100));
                                                        // Clear recovery attempts on successful load
                                                        if (generatedImage) {
                                                            imageRecoveryAttempted.current.delete(generatedImage);
                                                        }
                                                    }}
                                                />
                                            )}
                                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 p-2 bg-black/80 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl z-20 w-max">
                                                <button onClick={() => handleDownload(generatedImage)} className="px-4 py-2 bg-white text-black rounded-xl text-sm font-bold hover:bg-gray-200 transition-colors flex items-center gap-2 shadow-lg">
                                                    <Download className="w-4 h-4" /> Скачать
                                                </button>
                                                <button onClick={() => handleShare(generatedImage)} className="p-2.5 text-white hover:bg-white/10 rounded-xl transition-colors" title="Поделиться">
                                                    <Share2 className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        if (currentImageId) handleToggleSave(currentImageId);
                                                        else alert("Изображение сохраняется... Попробуйте через секунду.");
                                                    }}
                                                    className={`p-2.5 rounded-xl transition-all ${isCurrentSaved ? 'bg-red-500/20 text-red-500' : 'text-white hover:bg-white/10'}`}
                                                    title={isCurrentSaved ? "Убрать из сохраненного" : "Сохранить"}
                                                >
                                                    <Heart className={`w-5 h-5 ${isCurrentSaved ? 'fill-red-500' : ''}`} />
                                                </button>
                                                <div className="w-px h-6 bg-white/20 mx-1"></div>
                                                <button onClick={() => {
                                                    imageRecoveryAttempted.current.clear();
                                                    setGeneratedImage(null);
                                                }} className="p-2.5 text-white hover:bg-white/10 rounded-xl transition-colors" title="Закрыть">
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div ref={scrollViewportRef} className="w-full h-full overflow-y-auto custom-scrollbar">
                                        <div className="w-full max-w-[1800px] mx-auto pt-4 pb-32 md:pb-20 px-3 md:px-5">

                                            {activeCategory === 'all' && (
                                                <div className="relative w-full h-[280px] md:h-[340px] rounded-2xl overflow-hidden mb-8 border border-white/10 shadow-2xl group shrink-0">
                                                    {FEATURED_SLIDES.map((slide, index) => (
                                                        <div
                                                            key={slide.id}
                                                            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === heroIndex ? 'opacity-100' : 'opacity-0'}`}
                                                        >
                                                            <div className="absolute inset-0">
                                                                <img src={slide.image} className="w-full h-full object-cover" alt="Hero" />
                                                                <div className={`absolute inset-0 bg-gradient-to-r ${slide.bg} opacity-90 mix-blend-multiply`}></div>
                                                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                                                            </div>

                                                            <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full md:w-2/3 flex flex-col gap-3">
                                                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/10 w-fit">
                                                                    <Star className="w-3 h-3 text-yellow-300 fill-yellow-300" />
                                                                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">Выбор редакции</span>
                                                                </div>
                                                                <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                                                                    {slide.title}
                                                                </h2>
                                                                <p className={`text-lg md:text-xl font-medium ${slide.accent}`}>
                                                                    {slide.subtitle}
                                                                </p>
                                                                <button
                                                                    onClick={() => handleHeroClick(slide.id)}
                                                                    className="mt-4 px-6 py-3 bg-white text-black font-bold rounded-xl flex items-center gap-2 w-fit hover:bg-gray-100 transition-transform active:scale-95"
                                                                >
                                                                    Попробовать <ArrowRight className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}

                                                    <div className="absolute bottom-6 right-6 flex gap-2">
                                                        {FEATURED_SLIDES.map((_, idx) => (
                                                            <button
                                                                key={idx}
                                                                onClick={() => setHeroIndex(idx)}
                                                                className={`w-2 h-2 rounded-full transition-all ${idx === heroIndex ? 'bg-white w-6' : 'bg-white/40 hover:bg-white/60'}`}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                                                <div>
                                                    <h1 className="text-2xl md:text-3xl font-bold text-brand-text mb-1">
                                                        {activeCategory === 'all' ? 'Библиотека стилей' : CATEGORIES.find(c => c.id === activeCategory)?.label || 'Шаблоны'}
                                                    </h1>
                                                    <p className="text-sm text-brand-muted">Выберите стиль ниже, чтобы применить его к вашему фото.</p>
                                                </div>
                                            </div>

                                            {['family', 'kids', 'wedding', 'friends'].includes(activeCategory) && (
                                                <div className="mb-6 bg-blue-500/5 border border-blue-500/20 rounded-xl p-3 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                                                    <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                                                    <div className="text-[11px] md:text-xs text-blue-200/80 leading-relaxed">
                                                        <span className="font-bold text-blue-300 block mb-1">Совет по групповым фото:</span>
                                                        Для идеального результата используйте фото, где лица всех людей обращены к камере и хорошо освещены. Оптимально до 3-4 человек. ИИ сохранит индивидуальность каждого лица!
                                                    </div>
                                                </div>
                                            )}

                                            <TemplateGrid
                                                category={activeCategory}
                                                onSelect={handleTemplateSelect}
                                            />

                                            <div className="h-12 w-full"></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}

                {view === 'chat' && (
                    <div className="flex-1 flex min-w-0 bg-brand-bg relative w-full main-content overflow-hidden">
                        <ChatInterface
                            credits={credits || 0}
                            onDeductCredit={async (val) => {
                                setCredits(c => Math.max(0, (c || 0) - val));
                                if (user) await deductCredits(user.uid, val);
                            }}
                            onSaveHistory={async (o, g, p) => {
                                let finalO = o;
                                if (o && o.startsWith('data:') && user) {
                                    finalO = await uploadImageToStorage(user.uid, o, 'original');
                                }
                                const newItem: GeneratedImage = { original: finalO, generated: g, prompt: p, source: 'chat' };
                                setHistory(prev => [newItem, ...prev]);
                                saveGenerationToHistory(user?.uid || 'anon', newItem);
                            }}
                            isFreeTier={userTier === 'free'}
                            userId={user?.uid}
                            onOpenPricing={() => setIsPricingOpen(true)}
                            settings={{
                                quality: chatQuality,
                                format: chatFormat,
                                aspectRatio: chatAspectRatio,
                                model: chatModel,
                                setModel: setChatModel,
                                setQuality: setChatQuality,
                                setFormat: setChatFormat,
                                setAspectRatio: setChatAspectRatio,
                            }}
                            prompt={chatPrompt}
                            attachedImages={chatAttachedImages}
                            isGenerating={isChatGenerating}
                            historyData={history.filter(h => h.source === 'chat')}
                            onGenerate={handleChatGenerate}
                            setPrompt={setChatPrompt}
                            setAttachedImages={setChatAttachedImages}
                            triggerFileSelect={triggerChatFileSelect}
                            onToggleSave={handleToggleSave}
                        />
                    </div>
                )}

                {view === 'video' && (
                    <div className="flex-1 flex min-w-0 bg-brand-bg relative w-full main-content overflow-hidden">
                        <AnimateInterface
                            credits={credits || 0}
                            userId={user?.uid}
                            onOpenPricing={() => setIsPricingOpen(true)}
                            videoSettings={{
                                duration: videoDuration,
                                aspectRatio: videoAspectRatio,
                                negativePrompt: videoNegativePrompt,
                                cfgScale: videoCfgScale,
                                setDuration: setVideoDuration,
                                setAspectRatio: setVideoAspectRatio,
                            }}
                            prompt={videoPrompt}
                            setPrompt={setVideoPrompt}
                            attachedImage={videoAttachedImage}
                            setAttachedImage={setVideoAttachedImage}
                            isGenerating={isVideoGenerating}
                            status={videoStatus}
                            historyData={history.filter(h => h.source === 'video')}
                            onGenerate={handleVideoGenerate}
                            triggerFileSelect={triggerVideoFileSelect}
                            onToggleSave={handleToggleSave}
                        />
                    </div>
                )}

                {view === 'design-system' && (
                    <DesignSystemView />
                )}
            </div>

            <input type="file" ref={chatFileInputRef} className="hidden" accept="image/*" onChange={handleChatFileUpload} />
            <input type="file" ref={videoFileInputRef} className="hidden" accept="image/*" onChange={handleVideoFileUpload} />

            {/* Unified Mobile Navigation — скрыта в режиме чата и оживления (инпут снизу внутри экрана) */}
            <nav className={`lg:hidden fixed bottom-0 inset-x-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-2xl border-t border-slate-200 dark:border-slate-800 px-6 pt-3 pb-6 flex justify-between items-center z-50 rounded-t-[24px] shadow-[0_-8px_30px_rgba(0,0,0,0.08)] ${(view === 'chat' || view === 'video') ? 'hidden' : ''}`}>
                <button
                    onClick={() => setView('dashboard')}
                    className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${view === 'dashboard' ? 'text-brand-accent scale-110' : 'text-slate-400'}`}
                >
                    <LayoutDashboard className={`w-6 h-6 ${view === 'dashboard' ? 'drop-shadow-[0_0_8px_rgba(75,124,254,0.5)]' : ''}`} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Студия</span>
                </button>

                <button
                    onClick={() => setView('chat')}
                    className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${view === 'chat' ? 'text-purple-500 scale-110' : 'text-slate-400'}`}
                >
                    <MessageSquare className={`w-6 h-6 ${view === 'chat' ? 'drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]' : ''}`} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Чат</span>
                </button>

                <button
                    onClick={() => setView('video')}
                    className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${view === 'video' ? 'text-pink-500 scale-110' : 'text-slate-400'}`}
                >
                    <Video className={`w-6 h-6 ${view === 'video' ? 'drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]' : ''}`} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Оживить</span>
                </button>

                <button
                    onClick={() => setView('profile')}
                    className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${view === 'profile' ? 'text-slate-900 scale-110' : 'text-slate-400'} relative`}
                >
                    <Settings className="w-6 h-6" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Опции</span>
                    {(originalImage || promptInput || selectedTemplate) && view === 'dashboard' && (
                        <span className="absolute top-0 right-1 w-2.5 h-2.5 bg-brand-accent rounded-full animate-pulse border-2 border-white"></span>
                    )}
                </button>
            </nav>
        </div>
    );
};

export default App;
```

