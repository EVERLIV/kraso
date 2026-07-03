import React, { useEffect, useRef, useState } from 'react';
import MarketingStudioShell, { MarketingNav, MarketingTool } from './marketing/MarketingStudioShell';
import MarketingComposer from './marketing/MarketingComposer';
import MarketingPickerModal from './marketing/MarketingPickerModal';
import MarketingGenerationsView from './marketing/MarketingGenerationsView';
import MarketingMobileHome from './marketing/MarketingMobileHome';
import MarketingMobileComposer from './marketing/MarketingMobileComposer';
import MarketingUrlToAdModal from './marketing/MarketingUrlToAdModal';
import MarketingAdReferenceModal, { AdReferencePayload } from './marketing/MarketingAdReferenceModal';
import MarketingIconTile from './marketing/MarketingIconTile';
import { StudioId } from './marketing/MarketingStudioSwitcher';
import {
    MARKETING_TEMPLATES, MARKETING_FILTERS, DEFAULT_MARKETING_PROMPT,
    MARKETING_GEN_COST, MarketingFilter, MarketingTemplate,
} from '../lib/marketingPresets';
import {
    PICKER_BY_TYPE, PickerType, PickerItem, COMPOSER_CHIP_DEFS, ComposerChipId,
} from '../lib/marketingPickers';
import { generateImageWithGemini, cleanBase64, getMimeType } from '../services/geminiService';
import { analyzeProductUrl, analyzeAdReference } from '../services/marketingAnalysisService';
import { uploadImageToStorage, saveGenerationToHistory, deductCredits } from '../services/firebaseService';
import { useAuth } from '../contexts/AuthContext';
import MarketingPreviewMedia, { MARKETING_PREVIEW_FALLBACK } from './marketing/MarketingPreviewMedia';

interface MarketingStudioProps {
    credits: number;
    onUpdateCredits: (val: number) => void;
    onExit: () => void;
    onOpenCredits: () => void;
    onNavigateStudio?: (studio: StudioId) => void;
}

const FALLBACK = MARKETING_PREVIEW_FALLBACK;

const DEFAULT_CHIP_LABELS: Record<ComposerChipId, string> = {
    style: 'Распаковка ASMR',
    hook: 'Хук',
    setting: 'Сеттинг',
};

function PreviewPanel({ src }: { src: string }) {
    return (
        <div className="flex-1 min-w-0 aspect-[3/4] rounded-[12px] overflow-hidden bg-[var(--ms-raised)]">
            <MarketingPreviewMedia src={src} className="size-full object-cover" fallback={FALLBACK} />
        </div>
    );
}

function TemplateCard({ tpl, onTry }: { tpl: MarketingTemplate; onTry: () => void }) {
    return (
        <div className="ms-panel p-3.5 shadow-[var(--ms-shadow-panel)]">
            <div className="grid grid-cols-3 gap-2">
                {tpl.previews.map((src, i) => (
                    <PreviewPanel key={i} src={src} />
                ))}
            </div>
            <div className="flex items-center gap-3 mt-3.5">
                <MarketingIconTile variant={tpl.tileVariant} size="card" />
                <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-bold truncate">{tpl.title}</p>
                    <p className="text-xs text-[var(--ms-muted)] truncate text-pretty mt-px">{tpl.subtitle}</p>
                </div>
                <button
                    type="button"
                    onClick={onTry}
                    className="ms-btn-primary shrink-0 px-5 py-2 text-[13px] rounded-[10px]"
                >
                    Попробовать
                </button>
            </div>
        </div>
    );
}

function MarketingStudio({ credits, onUpdateCredits, onExit, onOpenCredits, onNavigateStudio }: MarketingStudioProps) {
    const { user } = useAuth();
    const scrollRef = useRef<HTMLElement>(null);
    const sentinelRef = useRef<HTMLDivElement>(null);
    const fileRef = useRef<HTMLInputElement>(null);
    const avatarRef = useRef<HTMLInputElement>(null);

    const [msView, setMsView] = useState<MarketingNav>('home');
    const [filter, setFilter] = useState<MarketingFilter>('all');
    const [prompt, setPrompt] = useState(DEFAULT_MARKETING_PROMPT);
    const [productImage, setProductImage] = useState<string | null>(null);
    const [avatarImage, setAvatarImage] = useState<string | null>(null);
    const [chipLabels, setChipLabels] = useState<Record<ComposerChipId, string>>({ ...DEFAULT_CHIP_LABELS });
    const [pickerFragments, setPickerFragments] = useState<Partial<Record<PickerType, string>>>({});
    const [openPicker, setOpenPicker] = useState<PickerType | null>(null);
    const [loading, setLoading] = useState(false);
    const [lastResult, setLastResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [mode, setMode] = useState<'product' | 'app'>('product');
    const [docked, setDocked] = useState(false);
    const [showComposer, setShowComposer] = useState(false);
    const [openTool, setOpenTool] = useState<MarketingTool | null>(null);
    const [analysisNote, setAnalysisNote] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState(() =>
        typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches,
    );

    const filtered = MARKETING_TEMPLATES.filter(
        t => filter === 'all' || t.categories.includes(filter),
    );

    const isHome = msView === 'home';

    useEffect(() => {
        const mq = window.matchMedia('(max-width: 767px)');
        const onChange = () => setIsMobile(mq.matches);
        onChange();
        mq.addEventListener('change', onChange);
        return () => mq.removeEventListener('change', onChange);
    }, []);

    useEffect(() => {
        if (!isHome || isMobile) {
            setDocked(false);
            return;
        }
        const root = scrollRef.current;
        const sentinel = sentinelRef.current;
        if (!root || !sentinel) return;

        const observer = new IntersectionObserver(
            ([entry]) => setDocked(!entry.isIntersecting),
            { root, threshold: 0, rootMargin: '0px 0px -8px 0px' },
        );
        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [isHome, isMobile]);

    const handleNav = (nav: MarketingNav) => {
        setMsView(nav);
        scrollRef.current?.scrollTo({ top: 0 });
    };

    const handleSwitchStudio = (studio: StudioId) => {
        if (studio === 'krasomir') onExit();
        else if (studio === 'shorts') onNavigateStudio?.('shorts');
    };

    const handleChipClick = (_chipId: string, picker: PickerType) => {
        setOpenPicker(picker);
    };

    const handlePickerSelect = (item: PickerItem) => {
        const chipDef = COMPOSER_CHIP_DEFS.find(c => c.picker === openPicker);
        if (chipDef) {
            setChipLabels(prev => ({ ...prev, [chipDef.id]: item.title }));
        }
        if (openPicker) {
            setPickerFragments(prev => ({ ...prev, [openPicker]: item.prompt }));
        }
        setPrompt(item.prompt);
        setOpenPicker(null);
    };

    const applyTemplate = (tpl: MarketingTemplate) => {
        setPrompt(tpl.prompt);
        if (isMobile) {
            setShowComposer(true);
        } else {
            scrollRef.current?.scrollTo({ top: 0 });
        }
    };

    const openComposer = () => setShowComposer(true);

    const applyBrief = (brief: Awaited<ReturnType<typeof analyzeProductUrl>>) => {
        setPrompt(brief.prompt);
        setChipLabels(prev => ({
            ...prev,
            style: brief.styleLabel,
            hook: brief.hook,
            setting: brief.setting,
        }));
        setPickerFragments({
            hook: brief.hook,
            setting: brief.setting,
            style: brief.styleLabel,
        });
        setAnalysisNote(brief.summary);
        setOpenTool(null);
        setMsView('home');
        if (isMobile) {
            setShowComposer(true);
        } else {
            scrollRef.current?.scrollTo({ top: 0 });
        }
    };

    const handleUrlToAd = async (url: string) => {
        const brief = await analyzeProductUrl(url, productImage);
        applyBrief(brief);
    };

    const handleAdReference = async (payload: AdReferencePayload) => {
        if (payload.productImage) setProductImage(payload.productImage);
        if (payload.avatarImage) setAvatarImage(payload.avatarImage);
        const brief = await analyzeAdReference({
            videoUrl: payload.videoUrl,
            videoThumb: payload.videoThumb,
            productImage: payload.productImage ?? productImage,
            avatarImage: payload.avatarImage ?? avatarImage,
        });
        applyBrief(brief);
    };

    const handleGenerate = async () => {
        if (!user) return;
        if (!productImage && mode === 'product') {
            setError('Загрузите фото товара');
            return;
        }
        if (credits < MARKETING_GEN_COST) {
            setError(`Недостаточно кредитов (${MARKETING_GEN_COST} кр)`);
            onOpenCredits();
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const extras = Object.values(pickerFragments).filter(Boolean).join(' ');
            const fullPrompt = `${prompt} ${extras} Вертикальный 9:16, фотореализм, готово для соцсетей.`;

            const refs: { data: string; mimeType: string }[] = [];
            if (productImage) refs.push({ data: cleanBase64(productImage), mimeType: getMimeType(productImage) });
            if (avatarImage) refs.push({ data: cleanBase64(avatarImage), mimeType: getMimeType(avatarImage) });

            const dataUrl = await generateImageWithGemini(fullPrompt, refs, '9:16');
            const url = await uploadImageToStorage(user.uid, dataUrl, 'generated');
            await saveGenerationToHistory(user.uid, {
                original: productImage,
                generated: url,
                prompt: `[MARKETING] ${prompt.slice(0, 120)}`,
                source: 'marketing',
            });
            await deductCredits(user.uid, MARKETING_GEN_COST);
            onUpdateCredits(credits - MARKETING_GEN_COST);
            setLastResult(url);
        } catch (e) {
            console.error(e);
            setError('Ошибка генерации. Попробуйте снова.');
        } finally {
            setLoading(false);
        }
    };

    const onFile = (e: React.ChangeEvent<HTMLInputElement>, setter: (v: string) => void) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => setter(reader.result as string);
        reader.readAsDataURL(file);
        e.target.value = '';
    };

    const handleOpenTool = (tool: MarketingTool) => {
        setShowComposer(false);
        setOpenPicker(null);
        setOpenTool(tool);
    };

    const composerProps = {
        prompt,
        onPromptChange: setPrompt,
        chipLabels,
        onChipClick: handleChipClick,
        productImage,
        avatarImage,
        lastResult,
        mode,
        onModeChange: setMode,
        loading,
        error: docked ? null : error,
        onGenerate: handleGenerate,
        onPickProduct: () => fileRef.current?.click(),
        onPickAvatar: () => avatarRef.current?.click(),
        onPickAsset: () => fileRef.current?.click(),
    };

    return (
        <MarketingStudioShell
            credits={credits}
            userPhoto={user?.photoURL}
            onExit={onExit}
            onOpenCredits={onOpenCredits}
            onNav={handleNav}
            onSwitchStudio={handleSwitchStudio}
            onOpenTool={handleOpenTool}
            activeNav={msView}
            mainRef={scrollRef}
            showComposerDock={isHome && !isMobile && !openTool && !openPicker}
            dockedComposer={isHome && docked && !isMobile ? (
                <MarketingComposer {...composerProps} compact docked error={error} />
            ) : undefined}
        >
            {msView === 'home' && (
                <>
                    <MarketingMobileHome
                        filter={filter}
                        onFilterChange={setFilter}
                        templates={filtered}
                        onStartCreating={openComposer}
                        onTryTemplate={applyTemplate}
                        onOpenTool={handleOpenTool}
                    />

                    <div className="hidden md:block relative px-4 md:px-10 pt-2 pb-[calc(5rem+env(safe-area-inset-bottom))] max-w-[1180px] mx-auto">
                        <div className="text-center pt-4 pb-8 md:pb-10 relative">
                            <p className="text-xs font-bold uppercase text-[var(--ms-lime)] mb-4" style={{ letterSpacing: '0.28em' }}>
                                Маркетинг Студия
                            </p>
                            <h1 className="ms-font-display text-2xl sm:text-3xl md:text-[46px] leading-[0.94] text-balance">
                                Превратите любой товар в видеорекламу
                            </h1>
                        </div>

                        <div className={(docked || openTool) ? 'invisible pointer-events-none' : ''} aria-hidden={docked || !!openTool}>
                            <MarketingComposer {...composerProps} />
                        </div>

                        {analysisNote && !openTool && (
                            <p className="text-xs text-[var(--ms-lime)] text-center mb-4 text-pretty px-4">
                                ✦ {analysisNote}
                            </p>
                        )}

                        <div ref={sentinelRef} className="h-px w-full" aria-hidden />

                        <div className="flex justify-center mt-6 mb-8">
                            <div className="inline-flex flex-wrap items-center justify-center gap-2">
                                {MARKETING_FILTERS.map(f => (
                                    <button
                                        key={f.id}
                                        type="button"
                                        onClick={() => setFilter(f.id)}
                                        className={filter === f.id ? 'ms-filter-active' : 'ms-filter-inactive'}
                                    >
                                        {f.label}
                                        {f.badge && <span className="ms-badge-new ml-1.5">{f.badge}</span>}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {filtered.map(tpl => (
                                <TemplateCard key={tpl.id} tpl={tpl} onTry={() => applyTemplate(tpl)} />
                            ))}
                        </div>
                    </div>
                </>
            )}

            {msView === 'generations' && (
                <MarketingGenerationsView mode="all" onGoHome={() => handleNav('home')} />
            )}

            {msView === 'favorites' && (
                <MarketingGenerationsView mode="favorites" onGoHome={() => handleNav('generations')} />
            )}

            {openPicker && (
                <MarketingPickerModal
                    config={PICKER_BY_TYPE[openPicker]}
                    onClose={() => setOpenPicker(null)}
                    onSelect={handlePickerSelect}
                />
            )}

            {openTool === 'url' && (
                <MarketingUrlToAdModal
                    onClose={() => setOpenTool(null)}
                    onContinue={handleUrlToAd}
                />
            )}

            {openTool === 'reference' && (
                <MarketingAdReferenceModal
                    onClose={() => setOpenTool(null)}
                    onContinue={handleAdReference}
                />
            )}

            {showComposer && (
                <MarketingMobileComposer
                    prompt={prompt}
                    onPromptChange={setPrompt}
                    productImage={productImage}
                    avatarImage={avatarImage}
                    previewImage={lastResult}
                    styleLabel={chipLabels.style}
                    onClose={() => setShowComposer(false)}
                    onPickProduct={() => fileRef.current?.click()}
                    onPickAvatar={() => avatarRef.current?.click()}
                    onPickAsset={() => fileRef.current?.click()}
                    onRemoveProduct={() => setProductImage(null)}
                    onOpenPicker={picker => setOpenPicker(picker)}
                    loading={loading}
                    error={error}
                    onGenerate={handleGenerate}
                    analysisNote={analysisNote}
                />
            )}

            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => onFile(e, setProductImage)} />
            <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={e => onFile(e, setAvatarImage)} />
        </MarketingStudioShell>
    );
}

export default MarketingStudio;
