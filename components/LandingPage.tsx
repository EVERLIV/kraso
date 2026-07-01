
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AuthPage from './AuthPage';
import BeforeAfterShowcase from './BeforeAfterShowcase';
import HiggsHome from './HiggsHome';
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
            <HiggsHome onStart={() => handleOpenAuth('dashboard')} />
            <div id="demo"><BeforeAfterShowcase /></div>
        </>
    );

    // Sign-in as a standalone page (replaces the whole landing while open).
    if (isAuthOpen) {
        return <AuthPage onClose={() => setIsAuthOpen(false)} onSuccess={() => setIsAuthOpen(false)} />;
    }

    return (
        <div className="min-h-screen bg-background-light text-ink font-sans overflow-x-hidden selection:bg-primary selection:text-white relative flex flex-col">

            {/* Soft brand glow behind hero */}
            <div className="absolute top-[80px] left-1/2 -translate-x-1/2 w-[560px] h-[280px] rounded-full pointer-events-none z-0"
                style={{ background: 'radial-gradient(ellipse at center, var(--primary-soft) 0%, transparent 70%)' }}></div>

            {/* Header - sticky frosted light */}
            <header className="sticky top-0 z-50 bg-background-light/82 backdrop-blur-[14px] border-b border-[var(--border-strong)]">
                <div className="flex items-center justify-between px-6 h-16 max-w-shell mx-auto w-full">
                    <div className="flex items-center gap-[11px] cursor-pointer group" onClick={() => navigateTo('home')}>
                        <div className="w-[38px] h-[38px] bg-brand-grad rounded-[11px] flex items-center justify-center shadow-[0_6px_16px_-6px_rgba(168,85,247,.5)] group-hover:scale-105 transition-transform duration-300">
                            <Glasses className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex items-center gap-[7px]">
                            <span className="font-extrabold text-lg tracking-[-0.02em] text-ink">КрасоМир</span>
                            <span className="text-[9px] font-extrabold tracking-[0.08em] text-on-primary bg-ai-badge px-[5px] py-0.5 rounded-[5px]">AI</span>
                        </div>
                    </div>

                    {/* Login Button */}
                    <button
                        onClick={() => handleOpenAuth('dashboard')}
                        className="px-[18px] py-[9px] rounded-full bg-primary text-on-primary text-sm font-bold hover:bg-primary-hover transition-all hover:scale-105 shadow-cta"
                    >
                        Войти
                    </button>
                </div>
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
