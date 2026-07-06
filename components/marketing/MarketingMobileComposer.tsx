import React from 'react';
import {
    X, Plus, User, Package, Pencil, ChevronRight, Sparkles,
    Smartphone, Clock, Gem, Image, Video,
} from 'lucide-react';
import { MARKETING_GEN_COST, MARKETING_VIDEO_GEN_COST } from '../../lib/marketingPresets';
import { MarketingGenMode } from '../MarketingStudio';
import { PickerType } from '../../lib/marketingPickers';

export interface MarketingMobileComposerProps {
    prompt: string;
    onPromptChange: (v: string) => void;
    videoPrompt?: string;
    onVideoPromptChange?: (v: string) => void;
    genMode?: MarketingGenMode;
    onGenModeChange?: (m: MarketingGenMode) => void;
    productImage: string | null;
    avatarImage: string | null;
    previewImage: string | null;
    styleLabel: string;
    onClose: () => void;
    onPickProduct: () => void;
    onPickAvatar: () => void;
    onPickAsset: () => void;
    onRemoveProduct: () => void;
    onOpenPicker: (picker: PickerType) => void;
    loading: boolean;
    error: string | null;
    onGenerate: () => void;
    analysisNote?: string | null;
}

function MarketingMobileComposer({
    prompt, onPromptChange, videoPrompt, onVideoPromptChange,
    genMode = 'image', onGenModeChange,
    productImage, avatarImage, previewImage, styleLabel,
    onClose, onPickProduct, onPickAvatar, onPickAsset, onRemoveProduct,
    onOpenPicker, loading, error, onGenerate, analysisNote,
}: MarketingMobileComposerProps) {
    const isVideo = genMode === 'video';
    const hero = previewImage ?? productImage ?? avatarImage;
    const cost = isVideo ? MARKETING_VIDEO_GEN_COST : MARKETING_GEN_COST;

    return (
        <div className="md:hidden fixed inset-0 z-50 ms flex flex-col bg-[var(--ms-page)] overflow-y-auto custom-scrollbar">
            <div className="sticky top-0 z-10 flex justify-end p-4 pt-[max(1rem,env(safe-area-inset-top))]">
                <button
                    type="button"
                    onClick={onClose}
                    className="size-9 rounded-full bg-[var(--ms-raised)] flex items-center justify-center text-[var(--ms-muted)]"
                    aria-label="Закрыть"
                >
                    <X className="size-5" />
                </button>
            </div>

            <div className="px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] space-y-3 max-w-lg mx-auto w-full">
                {/* Preview card */}
                <div className="relative aspect-[4/5] max-h-[280px] w-full rounded-3xl overflow-hidden bg-[var(--ms-raised)] ms-panel border-0">
                    {hero ? (
                        <img src={hero} alt="" className="size-full object-cover" />
                    ) : (
                        <div className="size-full flex items-center justify-center text-[var(--ms-dim)] text-sm">
                            Добавьте товар
                        </div>
                    )}
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/45 text-xs font-semibold text-white backdrop-blur-sm">
                        Товар
                    </span>
                    <button
                        type="button"
                        onClick={onPickProduct}
                        className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/45 text-xs font-medium text-white backdrop-blur-sm"
                    >
                        <Pencil className="size-3" /> Изменить
                    </button>
                    <p className="absolute bottom-4 left-4 text-2xl font-black uppercase">{styleLabel}</p>
                </div>

                {/* Media assets */}
                <div className="ms-panel p-3 flex items-center gap-3">
                    {productImage ? (
                        <div className="relative size-14 rounded-xl overflow-hidden shrink-0">
                            <img src={productImage} alt="" className="size-full object-cover" />
                            <button
                                type="button"
                                onClick={onRemoveProduct}
                                className="absolute top-0.5 right-0.5 size-5 rounded-full bg-black/60 flex items-center justify-center"
                                aria-label="Убрать"
                            >
                                <X className="size-3 text-white" />
                            </button>
                        </div>
                    ) : null}
                    <button
                        type="button"
                        onClick={onPickAsset}
                        className="size-14 rounded-full ms-slot ms-slot--dashed flex items-center justify-center text-[var(--ms-dim)]"
                        aria-label="Добавить медиа"
                    >
                        <Plus className="size-5" />
                    </button>
                </div>

                {/* Avatar + Product */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="ms-panel p-4 flex flex-col items-center text-center gap-3">
                        <User className="size-6 text-[var(--ms-muted)]" />
                        <span className="text-sm font-semibold">Аватар</span>
                        <button type="button" onClick={onPickAvatar} className="w-full ms-btn-secondary py-2 text-sm rounded-xl">
                            {avatarImage ? 'Изменить' : 'Добавить'}
                        </button>
                    </div>
                    <div className="ms-panel p-4 flex flex-col items-center text-center gap-3">
                        <Package className="size-6 text-[var(--ms-muted)]" />
                        <span className="text-sm font-semibold">Товар</span>
                        <button type="button" onClick={onPickProduct} className="w-full ms-btn-secondary py-2 text-sm rounded-xl">
                            {productImage ? 'Изменить' : 'Добавить'}
                        </button>
                    </div>
                </div>

                {/* Setting & Hook */}
                <button
                    type="button"
                    onClick={() => onOpenPicker('style')}
                    className="ms-panel p-4 w-full text-left"
                >
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full overflow-hidden bg-[var(--ms-raised)] shrink-0">
                            {avatarImage ? (
                                <img src={avatarImage} alt="" className="size-full object-cover" />
                            ) : (
                                <div className="size-full flex items-center justify-center text-[var(--ms-dim)]">
                                    <User className="size-4" />
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold">Сеттинг и хук</p>
                            <p className="text-xs text-[var(--ms-muted)]">Задайте настроение ролика</p>
                        </div>
                        <ChevronRight className="size-5 text-[var(--ms-dim)] shrink-0" />
                    </div>
                    <div className="flex gap-2 mt-3">
                        <button
                            type="button"
                            onClick={e => { e.stopPropagation(); onOpenPicker('hook'); }}
                            className="ms-chip text-xs py-1.5"
                        >
                            Хук
                        </button>
                        <button
                            type="button"
                            onClick={e => { e.stopPropagation(); onOpenPicker('setting'); }}
                            className="ms-chip text-xs py-1.5"
                        >
                            Сеттинг
                        </button>
                    </div>
                </button>

                {/* Photo / Video mode toggle */}
                {onGenModeChange && (
                    <div className="flex gap-2">
                        {(['image', 'video'] as const).map(m => (
                            <button
                                key={m}
                                type="button"
                                onClick={() => onGenModeChange(m)}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm transition-all duration-150 ${
                                    genMode === m
                                        ? 'bg-[var(--ms-lime)] text-black'
                                        : 'ms-panel text-[var(--ms-muted)]'
                                }`}
                            >
                                {m === 'image' ? <Image className="size-4" /> : <Video className="size-4" />}
                                {m === 'image' ? 'Фото' : 'Видео'}
                            </button>
                        ))}
                    </div>
                )}

                <textarea
                    value={isVideo ? (videoPrompt ?? '') : prompt}
                    onChange={e => isVideo
                        ? onVideoPromptChange?.(e.target.value)
                        : onPromptChange(e.target.value)
                    }
                    rows={isVideo ? 5 : 3}
                    placeholder={isVideo ? 'Видео промт (Kling 3.0)…' : 'Опишите, что происходит в рекламе'}
                    className="w-full ms-panel p-4 text-sm text-[var(--ms-body)] placeholder:text-[var(--ms-dim)] bg-[var(--ms-panel)] outline-none resize-none rounded-2xl text-pretty"
                    lang={isVideo ? 'en' : 'ru'}
                />

                {/* Video config pills */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                    <span className="ms-chip shrink-0 inline-flex items-center gap-1.5 tabular-nums">
                        <Smartphone className="size-3.5" /> 9:16
                    </span>
                    <span className="ms-chip shrink-0 inline-flex items-center gap-1.5 tabular-nums">
                        <Clock className="size-3.5" /> 8с
                    </span>
                    <span className="ms-chip shrink-0 inline-flex items-center gap-1.5 tabular-nums">
                        <Gem className="size-3.5" /> 720p
                    </span>
                </div>

                {analysisNote && (
                    <p className="text-xs text-[var(--ms-lime)] text-pretty px-1">✦ {analysisNote}</p>
                )}

                {error && <p className="text-xs text-red-400 text-pretty" role="alert">{error}</p>}

                <button
                    type="button"
                    onClick={onGenerate}
                    disabled={loading}
                    className="w-full py-4 rounded-2xl font-black text-base uppercase disabled:opacity-50 flex flex-col items-center gap-1"
                    style={{
                        background: 'linear-gradient(180deg, #DEFE4C 0%, #C6F017 100%)',
                        color: 'var(--ms-on-lime)',
                    }}
                >
                    {loading ? (isVideo ? 'Создаём видео…' : 'Генерация…') : (
                        <>
                            {isVideo ? 'Создать видео' : 'Сгенерировать'}
                            <Sparkles className="size-4" />
                        </>
                    )}
                </button>
                <p className="text-center text-[11px] text-[var(--ms-dim)] tabular-nums pb-2">
                    ✦ {cost} кредитов
                </p>
            </div>
        </div>
    );
}

export default MarketingMobileComposer;
