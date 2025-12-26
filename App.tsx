
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar, { CategoryItem } from './components/Sidebar';
import ImageUploader from './components/ImageUploader';
import TemplateGrid, { ALL_PRESETS } from './components/TemplateGrid';
import UserProfileModal from './components/UserProfileModal';
import LandingPage from './components/LandingPage';
import ChatInterface from './components/ChatInterface'; 
import UpscaleView from './components/UpscaleView';
import RemoveBgView from './components/RemoveBgView';
import PricingModal from './components/PricingModal'; 
import InfoModal, { InfoPageType } from './components/InfoModal';
import { CookieConsent } from './components/CookieConsent'; 
import { useAuth } from './contexts/AuthContext';
import { generateImageWithGemini, cleanBase64, getMimeType, ReferenceImage } from './services/geminiService';
import { uploadImageToStorage, saveGenerationToHistory, getUserHistory, syncUserProfile, deductCredits, purchaseSubscription, toggleSavedStatus } from './services/firebaseService';
import { AppState, CategoryId, AspectRatio, Preset, ImageResolution, GenModelId, GeneratedImage, ViewMode, SubscriptionTier } from './types';
import { 
  Loader2, Zap, Download, Square, RectangleHorizontal, RectangleVertical, 
  LayoutGrid, Users, FileText, Baby, ShoppingBag, Shirt, 
  Palette, Briefcase, Camera, Gem, Flame, Bookmark, 
  X, ChevronDown, ChevronUp, Utensils, Info,
  Store, Dumbbell, Heart, Flower, Ghost, Flag, Layers, Printer, PartyPopper,
  Video, Folder, History, Sparkles, Type, Trash2, Wand2, SlidersHorizontal, Image as ImageIcon, ArrowRight, Star, Cpu, Monitor, Maximize2, Share2, Paintbrush, RotateCcw
} from 'lucide-react';

// Define Categories Configuration
const CATEGORIES: CategoryItem[] = [
  { id: 'all', label: 'Все', icon: LayoutGrid },
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
  { id: 'christmas', label: 'Рождество', icon: Sparkles },
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
  },
  {
    id: 'fashion-editorial',
    title: 'Fashion Обложка',
    subtitle: 'Станьте звездой глянцевого журнала',
    bg: 'from-purple-900 to-indigo-900',
    accent: 'text-purple-300',
    image: 'https://images.unsplash.com/photo-1509631179647-b849389274e9?auto=format&fit=crop&w=800&q=80'
  }
];

const App: React.FC = () => {
  const { user, loading } = useAuth();
  
  // View State
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard'); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
  const [loadingStatusIndex, setLoadingStatusIndex] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [credits, setCredits] = useState(0); 
  const [userTier, setUserTier] = useState<SubscriptionTier>('free');

  // Modals
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [paymentEmail, setPaymentEmail] = useState('');
  
  // Info Modal State
  const [infoPage, setInfoPage] = useState<InfoPageType>(null);

  // --- Effects ---

  useEffect(() => {
    if (user) {
        syncUserData();
        const redirect = localStorage.getItem('auth_redirect');
        if (redirect) {
            setCurrentView(redirect as ViewMode);
            localStorage.removeItem('auth_redirect');
        }
    }
  }, [user]);

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

  const syncUserData = async () => {
      if(!user) return;
      const profile = await syncUserProfile(user);
      setCredits(typeof profile.credits === 'number' ? profile.credits : 5);
      setUserTier(profile.subscriptionTier);
      const cloudHistory = await getUserHistory(user.uid);
      if (cloudHistory.length > 0) setHistory(cloudHistory);
  };

  // Payment Handler Effect
  useEffect(() => {
    if (user && window.location.search.includes('payment=success')) {
       const url = new URL(window.location.href);
       const plan = url.searchParams.get('plan') as SubscriptionTier;
       const email = url.searchParams.get('email') || user.email || '';
       
       if (plan) {
           let creditsToAdd = 100;
           if (plan === 'pro') creditsToAdd = 500;
           if (plan === 'business') creditsToAdd = 2000;
           
           // In real logic, this deduction/credit happens via the Server Callback.
           // Here we update UI immediately for better UX.
           purchaseSubscription(user.uid, plan, creditsToAdd).then(() => {
               syncUserData();
               setPaymentEmail(email);
               setShowPaymentSuccess(true);
           });
       }
       // Clean URL
       window.history.replaceState({}, '', window.location.origin);
    }
  }, [user]);

  // --- Handlers ---

  const calculateCost = () => {
    let base = 1;
    if (selectedModel === 'gemini-3-pro-image-preview') {
      base = 4;
      if (resolution === '2K') base = 6;
      if (resolution === '4K') base = 10;
    }
    return base;
  };
  const currentCost = calculateCost();

  const handleTemplateSelect = (preset: Preset) => {
    setSelectedTemplate(preset);
    setCurrentView('dashboard');
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
    
    if (selectedTemplate) {
        const intensityMap = [
            { threshold: 10, text: "Extremely subtle hint of the style, keeping 95% of original details identical." },
            { threshold: 30, text: "Light style influence, preserving original photo features as primary focus." },
            { threshold: 50, text: "Perfectly balanced integration of style and original photo characteristics." },
            { threshold: 75, text: "Strong style application, making the thematic aesthetic very prominent." },
            { threshold: 90, text: "High intensity transformation, prioritizing the template's look over original details." },
            { threshold: 100, text: "Maximum style transformation, complete thematic overhaul to strictly match the requested style." }
        ];
        const intensityInstruction = intensityMap.find(m => intensity <= m.threshold)?.text || intensityMap[intensityMap.length - 1].text;
        parts.push(`${intensityInstruction} Template Prompt: ${selectedTemplate.prompt}`);
    }
    
    if (overlayText) parts.push(`Include the text "${overlayText}" in the image gracefully.`);
    if (promptInput) parts.push(promptInput);

    if (parts.length === 0) {
        parts.push("Enhance this image, professional studio quality, high detail.");
    }

    let finalPrompt = parts.join(' ');

    setAppState(AppState.GENERATING);
    setErrorMsg(null);
    setCredits(prev => Math.max(0, prev - currentCost)); 
    setGeneratedImage(null);
    setCurrentImageId(null);
    setMobileTab('canvas');

    try {
      if (user) await deductCredits(user.uid, currentCost);

      const refs: ReferenceImage[] = [];
      if (originalImage) refs.push({ data: cleanBase64(originalImage), mimeType: getMimeType(originalImage) });
      if (subjectImage) refs.push({ data: cleanBase64(subjectImage), mimeType: getMimeType(subjectImage) });

      const shouldWatermark = userTier === 'free';

      const generatedData = await generateImageWithGemini(
          finalPrompt, 
          refs, 
          aspectRatio, 
          selectedModel, 
          resolution, 
          shouldWatermark
      );
      const resultDataUrl = `data:image/jpeg;base64,${generatedData}`;
      
      setGeneratedImage(resultDataUrl);
      setAppState(AppState.SUCCESS);

      const storageUrl = await uploadImageToStorage(user!.uid, resultDataUrl, 'generated');
      
      let originalUrl = originalImage || subjectImage;
      if (originalUrl && !originalUrl.startsWith('http')) {
          originalUrl = await uploadImageToStorage(user!.uid, originalUrl, 'original');
      }

      const newRecord: GeneratedImage = {
          original: originalUrl,
          generated: storageUrl,
          prompt: finalPrompt
      };
      
      const docId = await saveGenerationToHistory(user!.uid, newRecord);
      const finalId = docId || `temp_${Date.now()}`;
      newRecord.id = finalId;
      setCurrentImageId(finalId);
      
      setHistory(prev => [newRecord, ...prev]);

    } catch (err: any) {
      console.error(err);
      setAppState(AppState.ERROR);
      setErrorMsg("Ошибка генерации. Попробуйте еще раз.");
      setCredits(prev => (prev || 0) + currentCost); 
    }
  };

  const handleDownload = (imageUrl: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `photo-smart-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], "generated-image.jpg", { type: "image/jpeg" });

      if (navigator.share) {
        await navigator.share({
          files: [file],
          title: 'Photo Smart AI',
          text: 'Создано в Photo Smart AI'
        });
      } else {
        try {
            await navigator.clipboard.write([
                new ClipboardItem({
                    [blob.type]: blob
                })
            ]);
            alert('Изображение скопировано в буфер обмена');
        } catch (err) {
             alert('Ваш браузер не поддерживает шеринг. Используйте кнопку "Скачать".');
        }
      }
    } catch (error) {
      console.error("Share failed:", error);
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
        <LandingPage onOpenInfo={(page) => setInfoPage(page)} />
        <InfoModal page={infoPage} onClose={() => setInfoPage(null)} />
        <CookieConsent />
      </>
    );
  }

  return (
    <div className="h-screen bg-brand-bg text-brand-text font-sans flex flex-col overflow-hidden selection:bg-brand-accent selection:text-white">
      
      <CookieConsent />

      <UserProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
        credits={credits} 
        userTier={userTier}
      />
      <PricingModal 
        isOpen={isPricingOpen}
        onClose={() => setIsPricingOpen(false)}
        onSuccess={() => syncUserData()}
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
        toggleSidebar={() => setIsMobileMenuOpen(true)}
        credits={credits || 0} 
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      <div className="flex-1 flex overflow-hidden relative">
          
          <Sidebar 
              categories={CATEGORIES}
              activeCategory={activeCategory} 
              onSelectCategory={(id) => { setActiveCategory(id); setCurrentView('dashboard'); setMobileTab('canvas'); }}
              isCollapsed={isSidebarCollapsed} 
              toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              credits={credits || 0}
              userTier={userTier}
              isOpen={isMobileMenuOpen}
              onClose={() => setIsMobileMenuOpen(false)}
              currentView={currentView}
              onChangeView={setCurrentView}
          />

          {currentView === 'dashboard' && (
            <>
              <div className={`
                w-full md:w-[320px] lg:w-[360px] bg-[#151921] border-r border-brand-border flex-col h-full shrink-0 z-20 shadow-xl overflow-hidden
                ${mobileTab === 'settings' ? 'flex' : 'hidden md:flex'}
              `}>
                  <div className="p-4 border-b border-brand-border shrink-0 bg-[#151921]">
                      <h2 className="font-bold text-white flex items-center gap-2 text-sm uppercase tracking-wider">
                        <Wand2 className="w-4 h-4 text-brand-accent" /> Настройки генерации
                      </h2>
                  </div>

                  <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-5">
                      
                      <div className="space-y-3">
                          <p className="text-[10px] font-bold text-brand-muted uppercase tracking-wider flex items-center gap-2">
                             <Folder className="w-3 h-3" /> Исходные изображения
                          </p>
                          <div className="grid grid-cols-2 gap-3">
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
                           <div className="flex justify-between items-center">
                               <span className="text-[10px] font-bold text-brand-muted uppercase tracking-wider flex items-center gap-2">
                                   <Type className="w-3 h-3" /> 
                                   {selectedTemplate ? (
                                     <span className="text-brand-accent">Стиль: {selectedTemplate.title}</span>
                                   ) : 'Промт'}
                               </span>
                               
                               {selectedTemplate && (
                                   <button onClick={() => setSelectedTemplate(null)} className="text-[10px] text-red-400 hover:text-red-300 transition-colors">
                                       Сброс стиля
                                   </button>
                               )}
                           </div>
                           <textarea 
                              value={promptInput}
                              onChange={(e) => setPromptInput(e.target.value)}
                              placeholder={selectedTemplate 
                                ? `Дополните стиль "${selectedTemplate.title}"...` 
                                : "Опишите желаемый результат..."}
                              className="w-full bg-[#0B0E14] border border-brand-border rounded-xl p-3 text-sm text-white placeholder-brand-muted/40 focus:border-brand-accent/50 focus:ring-1 focus:ring-brand-accent/50 outline-none resize-none h-24 transition-all"
                           />
                      </div>

                      {selectedTemplate && (
                        <div className="space-y-3 bg-[#0B0E14] border border-brand-border rounded-2xl p-4 animate-in fade-in slide-in-from-top-2 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-1 h-full bg-brand-accent/30 group-hover:bg-brand-accent transition-colors"></div>
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] font-bold text-brand-muted uppercase tracking-wider flex items-center gap-2">
                                    <Paintbrush className="w-3 h-3 text-brand-accent" /> Сила эффекта
                                </label>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-mono font-bold text-brand-accent bg-brand-accent/10 px-1.5 py-0.5 rounded">{intensity}%</span>
                                    <button 
                                      onClick={() => setIntensity(50)}
                                      className="p-1 text-brand-muted hover:text-white transition-colors"
                                      title="Сбросить на 50%"
                                    >
                                      <RotateCcw className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                            <input 
                                type="range" 
                                min="1" 
                                max="100" 
                                step="1"
                                value={intensity}
                                onChange={(e) => setIntensity(parseInt(e.target.value))}
                                className="w-full h-1.5 bg-brand-card rounded-lg appearance-none cursor-pointer accent-brand-accent focus:outline-none"
                            />
                            <div className="flex justify-between text-[8px] text-brand-muted uppercase tracking-tighter opacity-60">
                                <span>Мягко</span>
                                <span>Баланс</span>
                                <span>Сильно</span>
                            </div>
                        </div>
                      )}

                      <div className="space-y-3">
                          <p className="text-[10px] font-bold text-brand-muted uppercase tracking-wider flex items-center gap-2">
                             <Cpu className="w-3 h-3" /> Параметры модели
                          </p>
                          
                          <div className="grid grid-cols-1 gap-2">
                              <button 
                                onClick={() => setSelectedModel('gemini-2.5-flash-image')}
                                className={`flex items-center justify-between p-3 rounded-lg border transition-all ${selectedModel === 'gemini-2.5-flash-image' ? 'bg-brand-accent/10 border-brand-accent text-white' : 'bg-[#0B0E14] border-brand-border text-brand-muted hover:border-brand-muted'}`}
                              >
                                  <div className="flex items-center gap-2">
                                      <Zap className={`w-4 h-4 ${selectedModel === 'gemini-2.5-flash-image' ? 'text-yellow-400' : 'text-gray-500'}`} />
                                      <div className="text-left">
                                          <div className="text-xs font-bold">Nano Banana (Flash 2.5)</div>
                                          <div className="text-[10px] opacity-70">Быстро • Экономно</div>
                                      </div>
                                  </div>
                                  <div className="text-[10px] font-mono opacity-50">1⚡</div>
                              </button>

                              <button 
                                onClick={() => setSelectedModel('gemini-3-pro-image-preview')}
                                className={`flex items-center justify-between p-3 rounded-lg border transition-all ${selectedModel === 'gemini-3-pro-image-preview' ? 'bg-brand-accent/10 border-brand-accent text-white' : 'bg-[#0B0E14] border-brand-border text-brand-muted hover:border-brand-muted'}`}
                              >
                                  <div className="flex items-center gap-2">
                                      <Star className={`w-4 h-4 ${selectedModel === 'gemini-3-pro-image-preview' ? 'text-purple-400' : 'text-gray-500'}`} />
                                      <div className="text-left">
                                          <div className="text-xs font-bold">Gemini 3 Pro</div>
                                          <div className="text-[10px] opacity-70">Высокое качество • 4K</div>
                                      </div>
                                  </div>
                                  <div className="text-[10px] font-mono opacity-50">4-10⚡</div>
                              </button>
                          </div>

                          {selectedModel === 'gemini-3-pro-image-preview' && (
                              <div className="animate-in fade-in slide-in-from-top-2">
                                  <div className="flex items-center justify-between mb-1.5">
                                      <label className="text-[10px] font-bold text-brand-muted uppercase">Разрешение</label>
                                  </div>
                                  <div className="flex bg-[#0B0E14] rounded-lg border border-brand-border p-1">
                                      {(['1K', '2K', '4K'] as ImageResolution[]).map((res) => (
                                          <button
                                              key={res}
                                              onClick={() => setResolution(res)}
                                              className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all ${resolution === res ? 'bg-brand-card text-white shadow-sm' : 'text-brand-muted hover:text-white'}`}
                                          >
                                              {res}
                                          </button>
                                      ))}
                                  </div>
                              </div>
                          )}
                      </div>

                      <div className="space-y-2">
                          <label className="text-[10px] font-bold text-brand-muted uppercase tracking-wider flex items-center gap-2">
                             <Maximize2 className="w-3 h-3" /> Формат
                          </label>
                          <div className="grid grid-cols-5 gap-1 bg-[#0B0E14] rounded-lg border border-brand-border p-1">
                               {[
                                   { r: '1:1', i: Square }, 
                                   { r: '4:3', i: Monitor },
                                   { r: '3:4', i: RectangleVertical },
                                   { r: '16:9', i: RectangleHorizontal }, 
                                   { r: '9:16', i: RectangleVertical }
                               ].map((item) => (
                                   <button
                                       key={item.r}
                                       onClick={() => setAspectRatio(item.r as AspectRatio)}
                                       className={`flex items-center justify-center p-1.5 rounded-md transition-all ${aspectRatio === item.r ? 'bg-brand-card text-white shadow-sm' : 'text-brand-muted hover:text-white'}`}
                                       title={item.r}
                                   >
                                       <item.i className="w-3.5 h-3.5" />
                                   </button>
                               ))}
                           </div>
                           <div className="text-center text-[10px] text-brand-muted font-mono">{aspectRatio}</div>
                      </div>

                      <div className="space-y-2">
                         <label className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">Текст на изображении</label>
                         <input 
                            type="text"
                            value={overlayText}
                            onChange={(e) => setOverlayText(e.target.value)}
                            placeholder="Например: SALE 50%"
                            className="w-full bg-[#0B0E14] border border-brand-border rounded-lg p-2.5 text-sm text-white focus:border-brand-accent outline-none"
                         />
                      </div>

                      <div className="h-px bg-brand-border/50"></div>

                      <div className="space-y-3">
                          <div className="flex items-center justify-between">
                              <span className="flex items-center gap-2 text-[10px] font-bold text-brand-muted uppercase tracking-wider">
                                  <History className="w-3 h-3" /> Недавние
                              </span>
                          </div>
                          
                          {history.length === 0 ? (
                              <div className="text-center py-6 text-brand-muted text-xs bg-[#0B0E14] rounded-lg border border-dashed border-brand-border">
                                  <p>История пуста</p>
                              </div>
                          ) : (
                              <div className="grid grid-cols-3 gap-2">
                                  {history.slice(0, 6).map((item, idx) => (
                                      <div 
                                        key={idx} 
                                        className="group relative rounded-lg overflow-hidden border border-brand-border bg-black aspect-square cursor-pointer hover:border-brand-accent transition-all"
                                        onClick={() => {
                                            setGeneratedImage(item.generated);
                                            setCurrentImageId(item.id || null);
                                        }}
                                      >
                                          <img src={item.generated} className="w-full h-full object-cover" loading="lazy" alt="History" />
                                      </div>
                                  ))}
                              </div>
                          )}
                      </div>
                  </div>

                  <div className="p-4 border-t border-brand-border bg-[#151921] space-y-3 shrink-0 pb-24 md:pb-4">
                       {errorMsg && (
                           <div className="text-red-400 text-xs text-center p-1 bg-red-500/10 rounded border border-red-500/20">{errorMsg}</div>
                       )}

                       <button 
                          onClick={handleGenerate}
                          disabled={appState === AppState.GENERATING}
                          className="w-full bg-white hover:bg-gray-200 text-black font-bold text-sm py-3.5 rounded-xl transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                       >
                          {appState === AppState.GENERATING ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Zap className="w-4 h-4 text-black" /> Генерировать ({currentCost})</>}
                       </button>
                  </div>
              </div>

              <div className={`
                 flex-1 flex-col min-w-0 bg-[#0B0E14] relative transition-all duration-300
                 ${mobileTab === 'canvas' ? 'flex' : 'hidden md:flex'}
              `}>
                 <div className="flex-1 flex flex-col items-center justify-start overflow-hidden relative pb-24 md:pb-6">
                     
                     {appState === AppState.GENERATING ? (
                         <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
                             <div className="relative mb-8">
                                <div className="absolute inset-0 bg-brand-accent/20 blur-3xl rounded-full"></div>
                                <div className="relative w-24 h-24 bg-[#151921] border border-brand-border rounded-3xl flex items-center justify-center shadow-2xl">
                                    <Sparkles className="w-10 h-10 text-brand-accent animate-pulse" />
                                </div>
                                <div className="absolute -top-2 -right-2">
                                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                                </div>
                             </div>
                             
                             <h2 className="text-xl md:text-2xl font-bold text-white mb-2 transition-all duration-500 min-h-[32px]">
                                {FUNNY_STATUSES[loadingStatusIndex]}
                             </h2>
                             <p className="text-brand-muted text-sm max-w-xs">
                                Это займет 5-10 секунд. <br/> Создаем высокое разрешение...
                             </p>
                         </div>
                     ) : activeCategory === 'saved' ? (
                         <div className="w-full h-full overflow-y-auto custom-scrollbar p-6">
                             <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                 <Bookmark className="w-6 h-6 text-brand-accent" /> Сохраненное
                             </h1>
                             
                             {savedHistory.length === 0 ? (
                                 <div className="flex flex-col items-center justify-center h-96 text-brand-muted text-center max-w-md mx-auto">
                                     <div className="w-20 h-20 bg-[#151921] rounded-full flex items-center justify-center mb-6">
                                        <Heart className="w-8 h-8 text-brand-muted opacity-50" />
                                     </div>
                                     <h3 className="text-lg font-bold text-white mb-2">Здесь пока пусто</h3>
                                     <p className="mb-6">Нажмите на сердечко <Heart className="w-3 h-3 inline text-red-500 fill-red-500"/> после генерации, чтобы сохранить лучшие результаты.</p>
                                     <button onClick={() => { setActiveCategory('all'); setCurrentView('dashboard'); }} className="px-6 py-2 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors">
                                         Создать шедевр
                                     </button>
                                 </div>
                             ) : (
                                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                     {savedHistory.map((item) => (
                                         <div 
                                            key={item.id} 
                                            className="group relative aspect-square rounded-xl overflow-hidden border border-brand-border bg-black cursor-pointer hover:border-brand-accent transition-all"
                                            onClick={() => {
                                                setGeneratedImage(item.generated);
                                                setCurrentImageId(item.id || null);
                                                setMobileTab('canvas');
                                            }}
                                         >
                                             <img src={item.generated} alt="Saved" className="w-full h-full object-cover" />
                                             <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all"></div>
                                             <div className="absolute top-2 right-2">
                                                 <div className="p-1.5 bg-black/50 backdrop-blur rounded-full text-red-500">
                                                     <Heart className="w-3.5 h-3.5 fill-red-500" />
                                                 </div>
                                             </div>
                                         </div>
                                     ))}
                                 </div>
                             )}
                         </div>
                     ) : generatedImage ? (
                         <div className="w-full h-full flex items-center justify-center p-4 md:p-6 animate-in zoom-in-95 duration-300 relative">
                             <div className="relative group max-w-full max-h-full">
                                <img 
                                    src={generatedImage} 
                                    alt="Generated" 
                                    className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl border border-white/10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" 
                                />
                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 p-2 bg-black/80 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl z-20 w-max">
                                    <button onClick={() => handleDownload(generatedImage)} className="px-4 py-2 bg-white text-black rounded-xl text-sm font-bold hover:bg-gray-200 transition-colors flex items-center gap-2 shadow-lg">
                                        <Download className="w-4 h-4" /> Скачать
                                    </button>
                                    <button onClick={() => handleShare(generatedImage)} className="p-2.5 text-white hover:bg-white/10 rounded-xl transition-colors" title="Поделиться">
                                        <Share2 className="w-5 h-5" />
                                    </button>
                                    <button 
                                        onClick={() => {
                                            if (currentImageId) {
                                                handleToggleSave(currentImageId);
                                            } else {
                                                alert("Изображение сохраняется... Попробуйте через секунду.");
                                            }
                                        }} 
                                        className={`p-2.5 rounded-xl transition-all ${isCurrentSaved ? 'bg-red-500/20 text-red-500' : 'text-white hover:bg-white/10'}`} 
                                        title={isCurrentSaved ? "Убрать из сохраненного" : "Сохранить"}
                                    >
                                        <Heart className={`w-5 h-5 ${isCurrentSaved ? 'fill-red-500' : ''}`} />
                                    </button>
                                    <div className="w-px h-6 bg-white/20 mx-1"></div>
                                    <button onClick={() => setGeneratedImage(null)} className="p-2.5 text-white hover:bg-white/10 rounded-xl transition-colors" title="Закрыть">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                             </div>
                         </div>
                     ) : (
                         <div className="w-full h-full overflow-y-auto custom-scrollbar">
                             <div className="w-full max-w-[1800px] mx-auto pt-4 pb-20 px-3 md:px-5">
                                 
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
                                        <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
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
                             </div>
                         </div>
                     )}
                 </div>
              </div>

              <div className="md:hidden fixed bottom-0 inset-x-0 bg-[#0B0E14]/95 backdrop-blur-lg border-t border-brand-border z-50 pb-safe">
                 <div className="flex items-center justify-between px-6 py-2">
                     <button 
                        onClick={() => setMobileTab('canvas')}
                        className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${mobileTab === 'canvas' ? 'text-brand-accent' : 'text-brand-muted'}`}
                     >
                        <ImageIcon className="w-6 h-6" />
                        <span className="text-[10px] font-medium">Галерея</span>
                     </button>

                     <button 
                        onClick={() => setMobileTab('settings')}
                        className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${mobileTab === 'settings' ? 'text-brand-accent' : 'text-brand-muted'}`}
                     >
                        <SlidersHorizontal className="w-6 h-6" />
                        <span className="text-[10px] font-medium">Настройки</span>
                        {(originalImage || promptInput || selectedTemplate) && mobileTab !== 'settings' && (
                            <span className="absolute top-2 right-1/4 w-2 h-2 bg-brand-accent rounded-full animate-pulse"></span>
                        )}
                     </button>
                 </div>
              </div>
            </>
          )}

          {currentView === 'chat' && (
             <div className="flex-1 flex min-w-0 bg-[#0B0E14] relative">
                 <ChatInterface 
                    credits={credits || 0} 
                    onDeductCredit={(val) => setCredits(c => Math.max(0, (c || 0) - val))}
                    onSaveHistory={(o, g, p) => {
                        const newItem: GeneratedImage = { original: o, generated: g, prompt: p };
                        setHistory(prev => [newItem, ...prev]);
                    }}
                    isFreeTier={userTier === 'free'}
                 />
             </div>
          )}

          {currentView === 'upscale' && (
             <UpscaleView 
                credits={credits || 0}
                onUpdateCredits={setCredits}
                isFreeTier={userTier === 'free'}
             />
          )}

          {currentView === 'remove-bg' && (
             <RemoveBgView 
                credits={credits || 0}
                onUpdateCredits={setCredits}
                isFreeTier={userTier === 'free'}
             />
          )}
      </div>

    </div>
  );
};

export default App;
