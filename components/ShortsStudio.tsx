import React, { useEffect, useRef, useState } from 'react';
import { Loader2, Play } from 'lucide-react';
import ShortsStudioShell, { ShortsTab } from './shorts/ShortsStudioShell';
import ShortsSidebar from './shorts/ShortsSidebar';
import ShortsPresetGrid from './shorts/ShortsPresetGrid';
import { StudioId } from './marketing/MarketingStudioSwitcher';
import {
    SHORTS_GEN_COST, SHORTS_VISUAL_PRESETS, ShortsAspect, ShortsVisualPreset,
    buildShortsPrompt, getShortsVisualPreset,
} from '../lib/shortsVisualPresets';
import { MusicMood, musicPromptSuffix } from '../lib/audioPresets';
import { GeneratedImage } from '../types';
import { uploadImageToStorage, saveGenerationToHistory, deductCredits } from '../services/firebaseService';
import { useAuth } from '../contexts/AuthContext';

interface ShortsStudioProps {
    credits: number;
    onUpdateCredits: (val: number) => void;
    onExit: () => void;
    onOpenCredits: () => void;
    onSwitchStudio: (studio: StudioId) => void;
    initialImage?: string | null;
    initialPresetId?: string | null;
    shortsHistory?: GeneratedImage[];
    onHistoryChange?: (updater: (prev: GeneratedImage[]) => GeneratedImage[]) => void;
}

function ShortsStudio({
    credits, onUpdateCredits, onExit, onOpenCredits, onSwitchStudio,
    initialImage, initialPresetId, shortsHistory = [], onHistoryChange,
}: ShortsStudioProps) {
    const { user } = useAuth();
    const fileRef = useRef<HTMLInputElement>(null);

    const [tab, setTab] = useState<ShortsTab>('presets');
    const [search, setSearch] = useState('');
    const [attachedImage, setAttachedImage] = useState<string | null>(initialImage ?? null);
    const [presetId, setPresetId] = useState<string | null>(() => {
        if (initialPresetId && getShortsVisualPreset(initialPresetId)) return initialPresetId;
        return SHORTS_VISUAL_PRESETS[0]?.id ?? null;
    });
    const [aspect, setAspect] = useState<ShortsAspect>('9:16');
    const [musicMood] = useState<MusicMood>('none');
    const [voiceover] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');
    const [localHistory, setLocalHistory] = useState<GeneratedImage[]>(shortsHistory);

    const activePreset = presetId ? getShortsVisualPreset(presetId) : undefined;

    useEffect(() => {
        setLocalHistory(shortsHistory);
    }, [shortsHistory]);

    useEffect(() => {
        if (initialImage) setAttachedImage(initialImage);
    }, [initialImage]);

    useEffect(() => {
        if (initialPresetId && getShortsVisualPreset(initialPresetId)) setPresetId(initialPresetId);
    }, [initialPresetId]);

    const pickFile = () => fileRef.current?.click();

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => setAttachedImage(ev.target?.result as string);
        reader.readAsDataURL(file);
        e.target.value = '';
    };

    const selectPreset = (preset: ShortsVisualPreset) => {
        setPresetId(preset.id);
    };

    const pushHistory = (updater: (prev: GeneratedImage[]) => GeneratedImage[]) => {
        setLocalHistory(updater);
        onHistoryChange?.(updater);
    };

    const handleGenerate = async () => {
        if (!attachedImage) {
            setStatus('Загрузите фото или видео для монтажа');
            return;
        }
        if (!presetId) {
            setStatus('Выберите пресет из галереи');
            return;
        }
        if (credits < SHORTS_GEN_COST) {
            setStatus(`Недостаточно кредитов (${SHORTS_GEN_COST} кр)`);
            onOpenCredits();
            return;
        }

        const preset = getShortsVisualPreset(presetId);
        const promptText = buildShortsPrompt(preset, '', musicPromptSuffix(musicMood),
            voiceover.trim() ? ` Narration context: "${voiceover.trim()}".` : '',
        );

        const imageToUse = attachedImage;
        const tempId = `temp-s-${Date.now()}`;

        setLoading(true);
        setStatus('Инициализация…');
        onUpdateCredits(Math.max(0, credits - SHORTS_GEN_COST));
        setTab('history');

        const optimistic: GeneratedImage = {
            id: tempId,
            original: imageToUse,
            generated: '',
            prompt: preset?.title || 'Short',
            source: 'shorts',
            createdAt: { seconds: Math.floor(Date.now() / 1000) } as GeneratedImage['createdAt'],
        };
        pushHistory(prev => [optimistic, ...prev]);

        try {
            let cloudOriginal = imageToUse;
            if (imageToUse.startsWith('data:') && user) {
                setStatus('Загрузка медиа…');
                cloudOriginal = await uploadImageToStorage(user.uid, imageToUse, 'original');
            }

            const { generateKlingVideo } = await import('../services/klingService');
            const videoUrl = await generateKlingVideo({
                prompt: promptText,
                image_url: cloudOriginal,
                duration: '10',
                aspect_ratio: aspect,
                onProgress: setStatus,
            });

            const finalItem: GeneratedImage = {
                id: tempId,
                original: cloudOriginal,
                generated: videoUrl,
                prompt: preset?.title || 'Short',
                source: 'shorts',
                createdAt: { seconds: Math.floor(Date.now() / 1000) } as GeneratedImage['createdAt'],
            };
            pushHistory(prev => prev.map(item => item.id === tempId ? finalItem : item));

            if (user) {
                await deductCredits(user.uid, SHORTS_GEN_COST);
                const docId = await saveGenerationToHistory(user.uid, finalItem);
                if (docId) {
                    pushHistory(prev => prev.map(item => item.id === tempId ? { ...finalItem, id: docId } : item));
                }
            }
            setStatus('Готово!');
        } catch (error: unknown) {
            console.error(error);
            const msg = error instanceof Error ? error.message : 'Ошибка генерации';
            setStatus(msg);
            pushHistory(prev => prev.filter(item => item.id !== tempId));
            onUpdateCredits(credits);
        } finally {
            setLoading(false);
        }
    };

    const historyItems = localHistory.filter(h => {
        const g = h.generated;
        return !g || g.startsWith('http') || g.startsWith('blob:') || g === '';
    });

    return (
        <>
            <input type="file" ref={fileRef} className="hidden" accept="image/*,video/*" onChange={handleFileUpload} />

            <ShortsStudioShell
                tab={tab}
                onTabChange={setTab}
                credits={credits}
                userPhoto={user?.photoURL}
                onExit={onExit}
                onOpenCredits={onOpenCredits}
                onSwitchStudio={onSwitchStudio}
                sidebar={(
                    <ShortsSidebar
                        attachedImage={attachedImage}
                        onPickFile={pickFile}
                        aspect={aspect}
                        onAspectChange={setAspect}
                        loading={loading}
                        status={status}
                        canGenerate={!!attachedImage && !!presetId}
                        onGenerate={handleGenerate}
                        presetTitle={activePreset?.title}
                    />
                )}
            >
                {tab === 'presets' && (
                    <ShortsPresetGrid
                        selectedId={presetId}
                        onSelect={selectPreset}
                        query={search}
                        onSearchChange={setSearch}
                        onCreatePreset={() => setStatus('Создание пресета из референсов — скоро')}
                    />
                )}

                {tab === 'history' && (
                    <div className="relative px-4 md:px-10 pt-2 pb-[calc(5rem+env(safe-area-inset-bottom))] max-w-[1180px] mx-auto">
                        <div className="mb-6 md:mb-8">
                            <p className="text-xs font-bold uppercase text-[var(--ms-lime)] mb-2" style={{ letterSpacing: '0.28em' }}>
                                Shorts Studio
                            </p>
                            <h1 className="ms-font-display text-2xl sm:text-3xl leading-[0.94] text-balance">История</h1>
                            <p className="text-sm text-[var(--ms-muted)] mt-2 text-pretty">Ваши сгенерированные Shorts</p>
                        </div>

                        <div className="ss-history-grid">
                            {loading && (
                                <div className="aspect-[9/16] rounded-[var(--ms-radius-cell)] overflow-hidden bg-[var(--ms-raised)] relative" aria-busy="true">
                                    <div className="absolute inset-0 motion-safe:animate-pulse motion-reduce:animate-none bg-[var(--ms-panel)]" />
                                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-[var(--ms-muted)] px-3 text-center">
                                        <Loader2 className="size-6 motion-safe:animate-spin motion-reduce:animate-none text-[var(--ms-lime)]" />
                                        <span className="text-xs text-pretty">{status || 'Создаём Short…'}</span>
                                    </div>
                                </div>
                            )}
                            {historyItems.map((item, i) => {
                                if (!item.generated && !loading) return null;
                                const isVideo = item.generated && (item.generated.startsWith('http') || item.generated.startsWith('blob:'));
                                return (
                                    <div key={item.id || i} className="group relative aspect-[9/16] rounded-[var(--ms-radius-cell)] overflow-hidden bg-[var(--ms-raised)] border border-[var(--ms-hairline)]">
                                        {isVideo ? (
                                            <video
                                                src={item.generated}
                                                className="size-full object-cover"
                                                muted loop playsInline preload="metadata"
                                                onMouseOver={e => (e.currentTarget as HTMLVideoElement).play?.()}
                                                onMouseOut={e => (e.currentTarget as HTMLVideoElement).pause?.()}
                                            />
                                        ) : attachedImage ? (
                                            <img src={attachedImage} alt="" className="size-full object-cover opacity-60" />
                                        ) : null}
                                        {isVideo && (
                                            <span className="absolute top-2 left-2 bg-black/55 rounded-md p-1">
                                                <Play className="size-3 text-white fill-white" />
                                            </span>
                                        )}
                                        <span className="absolute bottom-2 left-2 right-2 text-[11px] font-semibold text-white truncate">
                                            {item.prompt}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        {!loading && historyItems.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <p className="text-sm text-[var(--ms-muted)] text-pretty mb-4 max-w-xs">
                                    Здесь появятся ваши Shorts после генерации
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setTab('presets')}
                                    className="ms-btn-primary px-6 py-2.5 text-sm font-bold"
                                >
                                    Выбрать пресет
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {tab === 'how' && (
                    <div className="relative px-4 md:px-10 pt-2 pb-[calc(5rem+env(safe-area-inset-bottom))] max-w-[1180px] mx-auto">
                        <div className="mb-6">
                            <p className="text-xs font-bold uppercase text-[var(--ms-lime)] mb-2" style={{ letterSpacing: '0.28em' }}>
                                Shorts Studio
                            </p>
                            <h1 className="ms-font-display text-2xl sm:text-3xl leading-[0.94] text-balance">Как это работает</h1>
                        </div>
                        <div className="ss-how-panel !p-0">
                            <ol>
                                <li>Загрузите фото или короткое видео (до 2 мин) в панель создания.</li>
                                <li>Выберите визуальный пресет — Bold Urban, Sticker Type и другие.</li>
                                <li>Укажите формат: вертикальный 9:16 для Reels/TikTok или горизонтальный 16:9.</li>
                                <li>Нажмите «Сгенерировать» — ИИ применит стиль пресета и оживит кадр.</li>
                            </ol>
                            <button
                                type="button"
                                onClick={() => setTab('presets')}
                                className="mt-6 ms-btn-primary px-6 py-2.5 text-sm font-bold"
                            >
                                Начать создание
                            </button>
                        </div>
                    </div>
                )}
            </ShortsStudioShell>
        </>
    );
}

export default ShortsStudio;
