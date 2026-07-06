import React from 'react';
import { Loader2, Plus, User, Share2, Smartphone, Package, ChevronDown, Image, Video } from 'lucide-react';
import MarketingPreviewMedia from './MarketingPreviewMedia';
import { MARKETING_GEN_COST, MARKETING_GEN_COST_OLD, MARKETING_VIDEO_GEN_COST, MARKETING_VIDEO_GEN_COST_OLD } from '../../lib/marketingPresets';
import { MarketingGenMode } from '../MarketingStudio';
import { COMPOSER_CHIP_DEFS, PickerType } from '../../lib/marketingPickers';

export interface MarketingComposerProps {
    prompt: string;
    onPromptChange: (v: string) => void;
    videoPrompt: string;
    onVideoPromptChange: (v: string) => void;
    genMode: MarketingGenMode;
    onGenModeChange: (m: MarketingGenMode) => void;
    chipLabels: Record<string, string>;
    onChipClick: (chipId: string, picker: PickerType) => void;
    productImage: string | null;
    avatarImage: string | null;
    lastResult: string | null;
    lastVideoResult: string | null;
    mode: 'product' | 'app';
    onModeChange: (m: 'product' | 'app') => void;
    loading: boolean;
    error: string | null;
    onGenerate: () => void;
    onPickProduct: () => void;
    onPickAvatar: () => void;
    onPickAsset: () => void;
    compact?: boolean;
    docked?: boolean;
}

function MarketingComposer({
    prompt, onPromptChange, videoPrompt, onVideoPromptChange,
    genMode, onGenModeChange,
    chipLabels, onChipClick,
    productImage, avatarImage, lastResult, lastVideoResult, mode, onModeChange,
    loading, error, onGenerate, onPickProduct, onPickAvatar, onPickAsset,
    compact = false, docked = false,
}: MarketingComposerProps) {
    const isVideo = genMode === 'video';
    const imageThumb = lastResult ?? productImage;
    const videoThumb = lastVideoResult;
    const thumb = isVideo ? (videoThumb ?? productImage) : imageThumb;
    const genCost = isVideo ? MARKETING_VIDEO_GEN_COST : MARKETING_GEN_COST;
    const genCostOld = isVideo ? MARKETING_VIDEO_GEN_COST_OLD : MARKETING_GEN_COST_OLD;

    return (
        <div className="flex items-end gap-2">
            <div className={`hidden sm:flex flex-col gap-0.5 p-1 rounded-full shrink-0 border border-[var(--ms-hairline)] ${
                docked ? 'bg-[color-mix(in_srgb,var(--ms-panel)_60%,transparent)]' : 'bg-[var(--ms-panel)]'
            }`}>
                {(['product', 'app'] as const).map(m => (
                    <button
                        key={m}
                        type="button"
                        onClick={() => onModeChange(m)}
                        aria-pressed={mode === m}
                        className={`flex items-center justify-center size-9 rounded-full transition-colors duration-100 ${
                            mode === m ? 'bg-[var(--ms-raised)] text-white' : 'text-[var(--ms-dim)] hover:text-[var(--ms-body)]'
                        }`}
                        aria-label={m === 'product' ? 'Товар' : 'Приложение'}
                    >
                        {m === 'product' ? <Package className="size-4" /> : <Smartphone className="size-4" />}
                    </button>
                ))}
            </div>

            <div className={`flex-1 min-w-0 ms-composer p-4 ${docked ? 'ms-composer--docked' : ''}`}>
                <div className="flex gap-2 mb-3.5">
                    {thumb && (
                        <div className="size-[42px] rounded-[10px] overflow-hidden ms-slot shrink-0">
                            <MarketingPreviewMedia src={thumb} className="size-full object-cover" autoPlay />
                        </div>
                    )}
                    <button
                        type="button"
                        onClick={onPickAsset}
                        className="size-[42px] rounded-[10px] ms-slot ms-slot--dashed flex items-center justify-center text-[var(--ms-dim)] hover:text-[var(--ms-body)] transition-colors duration-100 shrink-0"
                        aria-label="Добавить изображение"
                    >
                        <Plus className="size-4" />
                    </button>
                </div>

                {/* Фото / Видео mode toggle */}
                <div className="flex gap-1 mb-3">
                    {(['image', 'video'] as const).map(m => (
                        <button
                            key={m}
                            type="button"
                            onClick={() => onGenModeChange(m)}
                            aria-pressed={genMode === m}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wide transition-all duration-150 ${
                                genMode === m
                                    ? 'bg-[var(--ms-lime)] text-black'
                                    : 'text-[var(--ms-dim)] hover:text-[var(--ms-body)]'
                            }`}
                        >
                            {m === 'image' ? <Image className="size-3" /> : <Video className="size-3" />}
                            {m === 'image' ? 'Фото' : 'Видео'}
                        </button>
                    ))}
                </div>

                <textarea
                    value={isVideo ? videoPrompt : prompt}
                    onChange={e => isVideo ? onVideoPromptChange(e.target.value) : onPromptChange(e.target.value)}
                    rows={compact ? 2 : isVideo ? 5 : 3}
                    className="w-full bg-transparent text-sm font-medium leading-[1.55] text-[var(--ms-body)] placeholder:text-[var(--ms-dim)] outline-none resize-none text-pretty"
                    placeholder={isVideo ? 'Видео промт в формате Kling 3.0…' : 'Опишите рекламный ролик…'}
                    lang={isVideo ? 'en' : 'ru'}
                />

                {isVideo && (
                    <p className="text-[10px] text-[var(--ms-muted)] mt-1 mb-2">
                        Kling 3.0 Pro · нативный диалог + lip-sync · 9:16
                    </p>
                )}

                <div className="flex flex-wrap items-center gap-2 mt-4">
                    <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
                        {COMPOSER_CHIP_DEFS.map(chip => {
                            const label = chipLabels[chip.id] ?? chip.label;
                            const isStyleSelected = chip.picker === 'style';
                            return (
                                <button
                                    key={chip.id}
                                    type="button"
                                    onClick={() => onChipClick(chip.id, chip.picker)}
                                    className={`ms-chip inline-flex items-center gap-1.5 ${isStyleSelected ? 'ms-chip--active' : ''}`}
                                >
                                    {isStyleSelected ? (
                                        <>
                                            <span className="ms-chip-plus">+</span>
                                            {label}
                                        </>
                                    ) : (
                                        <>
                                            {label}
                                            <ChevronDown className="size-3 text-[var(--ms-dim)]" />
                                        </>
                                    )}
                                </button>
                            );
                        })}
                        <button
                            type="button"
                            className="size-8 rounded-full ms-slot flex items-center justify-center text-[var(--ms-dim)] hover:text-[var(--ms-body)] transition-colors duration-100"
                            aria-label="Поделиться"
                        >
                            <Share2 className="size-3.5" />
                        </button>
                    </div>

                    <div className="flex items-end gap-3 shrink-0 ml-auto">
                        <div className="text-center">
                            <button
                                type="button"
                                onClick={onPickProduct}
                                className="size-10 rounded-[10px] ms-slot flex items-center justify-center text-[var(--ms-dim)] hover:text-[var(--ms-body)] overflow-hidden transition-colors duration-100"
                                aria-label="Загрузить товар"
                            >
                                {productImage ? (
                                    <img src={productImage} alt="" className="size-full object-cover" />
                                ) : (
                                    <Plus className="size-4" />
                                )}
                            </button>
                            <p className="text-[9px] font-bold uppercase text-[var(--ms-dim)] mt-1">Товар</p>
                        </div>
                        <div className="text-center">
                            <button
                                type="button"
                                onClick={onPickAvatar}
                                className="size-10 rounded-[10px] ms-slot flex items-center justify-center text-[var(--ms-dim)] hover:text-[var(--ms-body)] overflow-hidden transition-colors duration-100"
                                aria-label="Загрузить аватар"
                            >
                                {avatarImage ? (
                                    <img src={avatarImage} alt="" className="size-full object-cover" />
                                ) : (
                                    <User className="size-4" />
                                )}
                            </button>
                            <p className="text-[9px] font-bold uppercase text-[var(--ms-dim)] mt-1">Аватар</p>
                        </div>
                        <button
                            type="button"
                            onClick={onGenerate}
                            disabled={loading}
                            className="ms-btn-generate min-w-[88px] px-[18px] py-3 text-[13px] leading-tight text-center disabled:opacity-50"
                        >
                            {loading ? (
                                <Loader2 className="size-5 animate-spin motion-reduce:animate-none mx-auto" aria-hidden />
                            ) : (
                                <>
                                    <span className="block font-bold uppercase tracking-wide">
                                        {isVideo ? 'Создать видео' : 'Сгенерировать'}
                                    </span>
                                    <span className="block text-[11px] font-semibold tabular-nums mt-0.5 opacity-80">
                                        ✦ {genCost}
                                        <span className="line-through opacity-50 ml-1">{genCostOld}</span>
                                    </span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {error && (
                    <p className="mt-3 text-xs text-red-400 text-pretty" role="alert">{error}</p>
                )}
            </div>
        </div>
    );
}

export default MarketingComposer;
