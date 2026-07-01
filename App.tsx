
import React, { useState, useEffect, useRef } from 'react';
import { db } from './lib/firebase';
import { compressImage, addWatermark } from './lib/imageUtils';
import Header from './components/Header';
import { CategoryItem } from './components/Sidebar';
import ImageUploader from './components/ImageUploader';
import TemplateGrid, { ALL_PRESETS } from './components/TemplateGrid';
import LandingPage from './components/LandingPage';
import SceneStudio from './components/SceneStudio';
import VideoStudio from './components/VideoStudio';
import PricingModal from './components/PricingModal';
import InfoModal, { InfoPageType } from './components/InfoModal';
import DesignSystemView from './components/DesignSystemView';
import GenerationBar from './components/GenerationBar';
import GenerationSheet from './components/GenerationSheet';
import AccountView from './components/AccountView';
import HomeDashboard from './components/HomeDashboard';
import { isDocumentPresetId, documentAspectRatio } from './lib/documentSpecs';
import Footer from './components/Footer';
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
    Video, Folder, History, Sparkles, Type, Trash2, Wand2, SlidersHorizontal, Image as ImageIcon, ArrowRight, ArrowLeft, Star, Cpu, Monitor, Maximize2, Share2, Paintbrush, RotateCcw,
    Home, Crown, User as UserIcon, FolderHeart, Plus, Check
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
    const [isGenSheetOpen, setIsGenSheetOpen] = useState(false);
    const [accountTab, setAccountTab] = useState<'profile' | 'subscription' | 'usage' | 'promocode'>('profile');
    const [templateSort, setTemplateSort] = useState<'popular' | 'new' | 'az'>('popular');
    const [isSortOpen, setIsSortOpen] = useState(false);
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

    // Dashboard source-image upload (used by the sticky generation bar)
    const dashboardFileInputRef = useRef<HTMLInputElement>(null);
    const triggerDashboardFileSelect = () => dashboardFileInputRef.current?.click();
    const handleDashboardFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => setOriginalImage(reader.result as string);
        reader.readAsDataURL(file);
        e.target.value = '';
    };

    const handleTemplateSelect = (preset: Preset) => {
        setSelectedTemplate(preset);
        // Documents have a fixed size — force the correct aspect ratio (ratio picker is locked in the UI).
        if (isDocumentPresetId(preset.id)) {
            setAspectRatio(documentAspectRatio(preset.id));
        }
        setView('templates');
        // Keep the gallery (canvas) visible — the sticky bottom bar holds the controls now.
        setMobileTab('canvas');
    };

    // True when the current selection is a document preset (ratio must stay locked).
    const isDocSelected = isDocumentPresetId(selectedTemplate?.id);


    const handleHeroClick = (id: string) => {
        const preset = ALL_PRESETS.find(p => p.id === id);
        if (preset) handleTemplateSelect(preset);
    };

    // Footer navigation inside the logged-in app shell.
    const handleFooterNavigate = (page: string) => {
        if (page === 'home') { setView('dashboard'); setActiveCategory('all'); }
        else if (page === 'pricing') { setIsPricingOpen(true); }
        else if (page === 'terms' || page === 'privacy') { setInfoPage(page as InfoPageType); }
        else if (page === 'contacts') { setInfoPage('support'); }
        else { setInfoPage('support'); } // about / blog / careers → support page fallback
        window.scrollTo({ top: 0 });
    };
    const handleFooterProductClick = (destination?: string) => {
        if (destination === 'chat') setView('chat');
        else if (destination === 'video') setView('video');
        else { setView('templates'); setActiveCategory('all'); }
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
                    title: 'КрасоМир AI',
                    text: 'Создано в КрасоМир AI'
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
                    title="1 фото → 150+ стилей за минуту. Генерация картинок ИИ | КрасоМир"
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
                    title={isTerms ? 'Условия использования | КрасоМир — генерация картинок ИИ' : 'Политика конфиденциальности | КрасоМир'}
                    description={isTerms ? 'Правила использования КрасоМир: генерация картинок ИИ, стилизация фотографий, оживление фото. Тарифы и кредиты.' : 'Как мы защищаем ваши данные при генерации изображений и использовании сервиса КрасоМир.'}
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
                title="Студия генерации картинок ИИ — 150+ шаблонов | КрасоМир"
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
                currentView={view}
                onChangeView={setView}
            />

            <div className="flex-1 flex overflow-hidden relative">


                {/* Account Page (profile + subscription + usage + promocode) */}
                {view === 'profile' && (
                    <AccountView
                        credits={credits || 0}
                        userTier={userTier}
                        generatedCount={history.length}
                        history={history}
                        initialTab={accountTab}
                        onBack={() => setView('dashboard')}
                    />
                )}

                {/* History gallery — all previously generated photos */}
                {view === 'history' && (
                    <div className="flex flex-1 flex-col min-w-0 bg-background-light relative overflow-hidden">
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            <div className="w-full max-w-shell mx-auto px-4 md:px-6 pt-6 pb-[88px] lg:pb-8">
                                <div className="mb-6">
                                    <h2 className="text-[27px] font-extrabold tracking-[-0.025em] text-ink mb-1.5 flex items-center gap-2">
                                        <History className="w-6 h-6 text-primary" /> История генераций
                                    </h2>
                                    <p className="text-[14.5px] text-ink-muted">Все ваши ранее созданные изображения и видео.</p>
                                </div>

                                {history.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-24 text-center text-ink-muted">
                                        <div className="w-20 h-20 bg-surface-muted rounded-full flex items-center justify-center mb-6">
                                            <ImageIcon className="w-8 h-8 text-ink-faint" />
                                        </div>
                                        <h3 className="text-lg font-bold text-ink mb-2">Здесь пока пусто</h3>
                                        <p className="mb-6 max-w-xs">Сгенерируйте первое изображение — оно появится в истории.</p>
                                        <button onClick={() => { setActiveCategory('all'); setView('templates'); }} className="px-6 py-3 bg-primary text-on-primary font-bold rounded-btn shadow-cta hover:bg-primary-hover transition-colors">
                                            Создать первое фото
                                        </button>
                                    </div>
                                ) : (
                                    <div className="[column-gap:16px] [columns:160px] sm:[columns:200px] md:[columns:236px]">
                                        {history.map((item, idx) => {
                                            const isVideo = item.source === 'video' || /\.mp4(\?|$)/i.test(item.generated || '');
                                            const isValidUrl = item.generated && (
                                                item.generated.startsWith('http') ||
                                                item.generated.startsWith('data:image') ||
                                                item.generated.startsWith('data:video') ||
                                                item.generated.startsWith('blob:')
                                            );
                                            if (!isValidUrl) return null;
                                            return (
                                                <button
                                                    key={item.id || idx}
                                                    onClick={() => {
                                                        imageRecoveryAttempted.current.clear();
                                                        setGeneratedImage(item.generated);
                                                        setCurrentImageId(item.id || null);
                                                        setAppState(AppState.SUCCESS);
                                                        setView('templates');
                                                        setMobileTab('canvas');
                                                    }}
                                                    className="group relative w-full mb-4 break-inside-avoid rounded-tile overflow-hidden bg-card-light border border-[var(--border-soft)] shadow-sm hover:shadow-tile-hover hover:-translate-y-1 transition-all duration-300"
                                                >
                                                    {isVideo ? (
                                                        <video src={item.generated} className="w-full h-auto object-cover" muted loop playsInline preload="metadata"
                                                            onMouseOver={(e) => (e.currentTarget as HTMLVideoElement).play?.()}
                                                            onMouseOut={(e) => (e.currentTarget as HTMLVideoElement).pause?.()} />
                                                    ) : (
                                                        <img src={item.generated} alt={item.prompt || 'История'} loading="lazy" className="w-full h-auto object-cover group-hover:scale-[1.04] transition-transform duration-500" />
                                                    )}
                                                    {isVideo && (
                                                        <span className="absolute top-2 left-2 bg-black/55 backdrop-blur rounded-md p-1"><Video className="w-3 h-3 text-white" /></span>
                                                    )}
                                                    {item.prompt && (
                                                        <div className="absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-[rgba(15,23,42,.8)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <p className="text-white text-[11px] font-medium line-clamp-2">{item.prompt}</p>
                                                        </div>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {view === 'dashboard' && (
                    <HomeDashboard
                        userName={user?.displayName || undefined}
                        onOpenTemplates={(cat) => { setActiveCategory(cat || 'all'); setView('templates'); setMobileTab('canvas'); }}
                        onOpenPhoto={() => setView('chat')}
                        onOpenVideo={() => setView('video')}
                    />
                )}

                {view === 'templates' && (
                    <>
                        {/* Hidden left settings panel — controls moved to the sticky bottom GenerationBar. */}
                        <div className="hidden">

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
                                                <img src={`/templates/${selectedTemplate.id}.webp`} className="w-full h-full object-cover" alt="Template" />
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

                        <div className="flex flex-1 flex-col min-w-0 bg-background-light relative transition-all duration-300">
                            <div className="flex-1 flex flex-col items-center justify-start overflow-hidden relative">

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
                                    <div ref={scrollViewportRef} className="w-full h-full overflow-y-auto custom-scrollbar p-6 pb-[88px] lg:pb-6">
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
                                                <button onClick={() => { setActiveCategory('all'); setView('templates'); }} className="px-6 py-2 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors">
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

                                        {/* Sticky category pills */}
                                        <div className="sticky top-0 z-20 bg-background-light border-b border-[var(--border-strong)]">
                                            <div className="max-w-shell mx-auto px-4 md:px-6 py-2.5 flex items-center gap-2 overflow-x-auto custom-scrollbar">
                                                {CATEGORIES.map(cat => {
                                                    const active = cat.id === activeCategory;
                                                    return (
                                                        <button
                                                            key={cat.id}
                                                            onClick={() => setActiveCategory(cat.id)}
                                                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-semibold whitespace-nowrap shrink-0 border transition-colors ${active ? 'bg-primary/10 text-primary border-primary' : 'bg-transparent text-ink-muted border-[var(--border-color)] hover:text-ink hover:border-ink-faint'}`}
                                                        >
                                                            {cat.label}
                                                            {cat.badge && !active && (
                                                                <span className="text-[8.5px] font-extrabold tracking-[0.05em] text-accent-pink bg-accent-pink-soft px-1.5 py-0.5 rounded-[5px]">{cat.badge}</span>
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        <div className="w-full max-w-shell mx-auto pt-6 pb-28 lg:pb-[150px] px-4 md:px-6">

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

                                            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                                                <div>
                                                    <h2 className="text-[27px] font-extrabold tracking-[-0.025em] text-ink mb-1.5">
                                                        {activeCategory === 'all' ? 'Библиотека стилей' : CATEGORIES.find(c => c.id === activeCategory)?.label || 'Шаблоны'}
                                                    </h2>
                                                    <p className="text-[14.5px] text-ink-muted">
                                                        Выберите образ — он подставится в строку генерации внизу.
                                                    </p>
                                                </div>
                                                <div className="relative">
                                                    <button
                                                        onClick={() => setIsSortOpen(v => !v)}
                                                        className="flex items-center gap-1.5 bg-card-light border border-[var(--border-color)] px-3.5 py-2 rounded-[10px] text-[13px] font-semibold text-ink-body hover:border-ink-faint transition-colors"
                                                    >
                                                        <SlidersHorizontal className="w-[15px] h-[15px] text-ink-muted" />
                                                        {templateSort === 'popular' ? 'Популярные' : templateSort === 'new' ? 'Новые' : 'А–Я'}
                                                        <ChevronDown className={`w-3.5 h-3.5 text-ink-muted transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
                                                    </button>
                                                    {isSortOpen && (
                                                        <>
                                                            <div className="fixed inset-0 z-40" onClick={() => setIsSortOpen(false)} />
                                                            <div className="absolute right-0 top-full mt-1.5 w-44 bg-card-light border border-[var(--border-color)] rounded-xl shadow-xl z-50 p-1">
                                                                {([
                                                                    { id: 'popular', label: 'Популярные' },
                                                                    { id: 'new', label: 'Новые' },
                                                                    { id: 'az', label: 'По алфавиту (А–Я)' },
                                                                ] as const).map(opt => (
                                                                    <button
                                                                        key={opt.id}
                                                                        onClick={() => { setTemplateSort(opt.id); setIsSortOpen(false); }}
                                                                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-[13px] transition-colors ${templateSort === opt.id ? 'bg-primary/10 text-primary font-semibold' : 'text-ink-body hover:bg-surface-muted'}`}
                                                                    >
                                                                        {opt.label}
                                                                        {templateSort === opt.id && <Check className="w-4 h-4" strokeWidth={3} />}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </>
                                                    )}
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
                                                selectedId={selectedTemplate?.id}
                                                sort={templateSort}
                                            />

                                            <div className="h-12 w-full"></div>
                                        </div>

                                        {/* Site footer at the end of the gallery scroll */}
                                        <Footer onNavigate={handleFooterNavigate} onProductClick={handleFooterProductClick} />
                                        {/* Clearance for the fixed mobile nav */}
                                        <div className="h-[72px] lg:hidden" />
                                    </div>
                                )}
                            </div>

                            {/* Generation bar — pinned to the bottom of the studio panel (desktop only) */}
                            {activeCategory !== 'saved' && (
                              <div className="hidden lg:block absolute bottom-0 inset-x-0 pointer-events-none">
                                <GenerationBar
                                    prompt={promptInput}
                                    onPromptChange={setPromptInput}
                                    aspectRatio={aspectRatio}
                                    onAspectRatioChange={setAspectRatio}
                                    selectedModel={selectedModel}
                                    onModelChange={setSelectedModel}
                                    selectedTemplate={selectedTemplate}
                                    onClearTemplate={() => setSelectedTemplate(null)}
                                    hasSourceImage={!!originalImage || !!subjectImage}
                                    onAddImageClick={triggerDashboardFileSelect}
                                    sourceImages={[originalImage, subjectImage].filter(Boolean) as string[]}
                                    onRemoveSourceImage={(i) => {
                                        const imgs = [originalImage, subjectImage].filter(Boolean) as string[];
                                        const target = imgs[i];
                                        if (target === originalImage) setOriginalImage(null);
                                        else if (target === subjectImage) setSubjectImage(null);
                                    }}
                                    onGenerate={handleGenerate}
                                    isGenerating={appState === AppState.GENERATING}
                                    cost={currentCost}
                                    error={errorMsg}
                                    ratioLocked={isDocSelected}
                                />
                              </div>
                            )}
                        </div>

                        <input type="file" ref={dashboardFileInputRef} className="hidden" accept="image/*" onChange={handleDashboardFileUpload} />
                    </>
                )}

                {view === 'chat' && (
                    <div className="flex-1 flex min-w-0 bg-background-light relative w-full main-content overflow-hidden">
                        <SceneStudio
                            prompt={chatPrompt}
                            setPrompt={setChatPrompt}
                            attachedImages={chatAttachedImages}
                            setAttachedImages={setChatAttachedImages}
                            triggerFileSelect={triggerChatFileSelect}
                            model={chatModel}
                            setModel={setChatModel}
                            aspectRatio={chatAspectRatio}
                            setAspectRatio={setChatAspectRatio}
                            quality={chatQuality}
                            setQuality={setChatQuality}
                            isGenerating={isChatGenerating}
                            onGenerate={handleChatGenerate}
                            historyData={history.filter(h => h.source === 'chat')}
                            credits={credits || 0}
                        />
                    </div>
                )}

                {view === 'video' && (
                    <div className="flex-1 flex min-w-0 bg-background-light relative w-full main-content overflow-hidden">
                        <VideoStudio
                            prompt={videoPrompt}
                            setPrompt={setVideoPrompt}
                            attachedImage={videoAttachedImage}
                            setAttachedImage={setVideoAttachedImage}
                            triggerFileSelect={triggerVideoFileSelect}
                            duration={videoDuration}
                            setDuration={setVideoDuration}
                            aspectRatio={videoAspectRatio}
                            setAspectRatio={setVideoAspectRatio}
                            isGenerating={isVideoGenerating}
                            status={videoStatus}
                            historyData={history.filter(h => h.source === 'video')}
                            onGenerate={handleVideoGenerate}
                        />
                    </div>
                )}

                {view === 'design-system' && (
                    <DesignSystemView />
                )}
            </div>

            <input type="file" ref={chatFileInputRef} className="hidden" accept="image/*" onChange={handleChatFileUpload} />
            <input type="file" ref={videoFileInputRef} className="hidden" accept="image/*" onChange={handleVideoFileUpload} />

            {/* Mobile Navigation (Higgsfield-style) — Главная · Библиотека · Создать · Pro · Профиль */}
            <nav className={`lg:hidden fixed bottom-0 inset-x-0 bg-card-light border-t border-[var(--border-strong)] px-1 pt-1.5 pb-[calc(0.3rem+env(safe-area-inset-bottom))] grid grid-cols-5 items-center z-50 ${(view === 'chat' || view === 'video') ? 'hidden' : ''}`}>
                <button
                    onClick={() => setView('dashboard')}
                    className={`flex flex-col items-center gap-1 py-1 transition-colors ${view === 'dashboard' ? 'text-ink' : 'text-ink-faint'}`}
                >
                    <Home className="w-[21px] h-[21px]" />
                    <span className="text-[10px]">Главная</span>
                </button>

                <button
                    onClick={() => setView('history')}
                    className={`flex flex-col items-center gap-1 py-1 transition-colors ${view === 'history' ? 'text-ink' : 'text-ink-faint'}`}
                >
                    <FolderHeart className="w-[21px] h-[21px]" />
                    <span className="text-[10px]">Библиотека</span>
                </button>

                {/* Center — Создать (3D button) */}
                <div className="flex justify-center">
                    <button
                        onClick={() => { if (view !== 'dashboard') setView('dashboard'); setIsGenSheetOpen(true); }}
                        className="-mt-5 w-12 h-12 rounded-2xl flex items-center justify-center text-on-primary
                                   bg-gradient-to-b from-[#d4ff3a] to-[#9bdd04]
                                   border-t border-white/40
                                   shadow-[0_5px_0_0_#6fa000,0_8px_12px_-2px_rgba(0,0,0,0.5)]
                                   active:translate-y-[3px] active:shadow-[0_2px_0_0_#6fa000,0_4px_8px_-2px_rgba(0,0,0,0.5)]
                                   transition-all duration-100"
                        aria-label="Создать"
                    >
                        <Plus className="w-6 h-6" strokeWidth={2.5} />
                    </button>
                </div>

                <button
                    onClick={() => { setAccountTab('subscription'); setView('profile'); }}
                    className={`flex flex-col items-center gap-1 py-1 transition-colors ${view === 'profile' && accountTab === 'subscription' ? 'text-ink' : 'text-ink-faint'}`}
                >
                    <Crown className="w-[21px] h-[21px]" />
                    <span className="text-[10px]">Pro</span>
                </button>

                <button
                    onClick={() => { setAccountTab('profile'); setView('profile'); }}
                    className={`flex flex-col items-center gap-1 py-1 transition-colors ${view === 'profile' && accountTab === 'profile' ? 'text-ink' : 'text-ink-faint'}`}
                >
                    <UserIcon className="w-[21px] h-[21px]" />
                    <span className="text-[10px]">Профиль</span>
                </button>
            </nav>

            {/* Mobile generation sheet (opened by the FAB) */}
            <GenerationSheet
                open={isGenSheetOpen}
                onClose={() => setIsGenSheetOpen(false)}
                prompt={promptInput}
                onPromptChange={setPromptInput}
                aspectRatio={aspectRatio}
                onAspectRatioChange={setAspectRatio}
                selectedModel={selectedModel}
                onModelChange={setSelectedModel}
                selectedTemplate={selectedTemplate}
                onClearTemplate={() => setSelectedTemplate(null)}
                sourceImages={[originalImage, subjectImage].filter(Boolean) as string[]}
                onAddImageClick={triggerDashboardFileSelect}
                onRemoveSourceImage={(i) => {
                    const imgs = [originalImage, subjectImage].filter(Boolean) as string[];
                    const target = imgs[i];
                    if (target === originalImage) setOriginalImage(null);
                    else if (target === subjectImage) setSubjectImage(null);
                }}
                onGenerate={() => { setIsGenSheetOpen(false); handleGenerate(); }}
                isGenerating={appState === AppState.GENERATING}
                cost={currentCost}
                error={errorMsg}
                ratioLocked={isDocSelected}
                onOpenTemplates={() => { setView('templates'); setActiveCategory('all'); }}
                videoPrompt={videoPrompt}
                onVideoPromptChange={setVideoPrompt}
                videoAttachedImage={videoAttachedImage}
                onVideoAddImageClick={triggerVideoFileSelect}
                onVideoRemoveImage={() => setVideoAttachedImage(null)}
                videoDuration={videoDuration}
                onVideoDurationChange={setVideoDuration}
                videoAspectRatio={videoAspectRatio}
                onVideoAspectRatioChange={setVideoAspectRatio}
                onVideoGenerate={() => { setIsGenSheetOpen(false); handleVideoGenerate(); }}
                isVideoGenerating={isVideoGenerating}
                videoStatus={videoStatus}
            />

        </div>
    );
};

export default App;
