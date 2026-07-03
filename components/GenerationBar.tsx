import React, { useState } from 'react';
import { Plus, Loader2, X, ChevronUp, Check, Sparkles, Gem } from 'lucide-react';
import { AspectRatio, ImageResolution, Preset } from '../types';
import KrasoModelPicker from './KrasoModelPicker';
import { KrasoModelId, resolutionsForKraso, getKrasoModel } from '../lib/krasoModels';
import {
    GEN_BAR_FORM,
    GEN_BAR_CHIP,
    GEN_BAR_CHIP_MUTED,
    GEN_BAR_DROPDOWN,
    GEN_BAR_DROPDOWN_ITEM,
    GEN_BAR_GENERATE,
    GEN_BAR_ADD_PHOTO,
    GEN_BAR_R,
} from './genbar/genBarStyles';

interface GenerationBarProps {
    prompt: string;
    onPromptChange: (value: string) => void;
    aspectRatio: AspectRatio;
    onAspectRatioChange: (ratio: AspectRatio) => void;
    krasoModel: KrasoModelId;
    onKrasoModelChange: (model: KrasoModelId) => void;
    resolution: ImageResolution;
    onResolutionChange: (resolution: ImageResolution) => void;
    selectedTemplate: Preset | null;
    onClearTemplate: () => void;
    hasSourceImage: boolean;
    onAddImageClick: () => void;
    onGenerate: (batchCount?: number) => void;
    isGenerating: boolean;
    cost: number;
    batchCount?: number;
    onBatchCountChange?: (n: number) => void;
    error?: string | null;
    status?: string | null;
    sourceImages?: string[];
    onRemoveSourceImage?: (index: number) => void;
    ratioLocked?: boolean;
    /** Override default prompt placeholder */
    promptPlaceholder?: string;
}

const RATIOS: AspectRatio[] = ['1:1', '4:5', '9:16', '16:9'];

function RatioIcon({ ratio, className = '' }: { ratio: string; className?: string }) {
    const [w, h] = ratio.split(':').map(Number);
    const max = 14;
    const bw = w >= h ? max : Math.round((w / h) * max);
    const bh = h >= w ? max : Math.round((h / w) * max);
    return (
        <span className={`inline-flex items-center justify-center size-4 ${className}`}>
            <span className="border-[1.5px] border-current rounded-[2px]" style={{ width: bw, height: bh }} />
        </span>
    );
}

function GenerationBar({
    prompt, onPromptChange, aspectRatio, onAspectRatioChange,
    krasoModel, onKrasoModelChange, resolution, onResolutionChange,
    selectedTemplate, onClearTemplate,
    hasSourceImage, onAddImageClick, onGenerate, isGenerating, cost, error, status,
    sourceImages = [], onRemoveSourceImage, ratioLocked = false,
    batchCount = 1, onBatchCountChange, promptPlaceholder: promptPlaceholderProp,
}: GenerationBarProps) {
    const [ratioOpen, setRatioOpen] = useState(false);
    const [resOpen, setResOpen] = useState(false);
    const krasoCfg = getKrasoModel(krasoModel);
    const availableResolutions = resolutionsForKraso(krasoModel);
    const needsReference = !!selectedTemplate;
    const canGenerate = !isGenerating && (!needsReference || hasSourceImage);
    const promptPlaceholder = promptPlaceholderProp ?? (selectedTemplate
        ? (hasSourceImage ? 'Уточнения к стилю (необязательно)…' : 'Загрузите фото — шаблон применится к нему')
        : 'Опишите идею или выберите стиль…');

    return (
        <div className="z-30 flex justify-center px-2 sm:px-4 md:px-6 pb-[calc(22px+env(safe-area-inset-bottom))] pointer-events-none">
            <div className="pointer-events-auto w-full max-w-genbar">
                {status && isGenerating && (
                    <div className={`mb-2 mx-auto w-fit max-w-full text-ink-muted text-xs font-medium bg-card-light border border-[var(--border-color)] px-3 py-1.5 ${GEN_BAR_R} text-pretty`}>
                        {status}
                    </div>
                )}
                {error && (
                    <div role="alert" className={`mb-2 mx-auto w-fit max-w-full text-red-400 text-xs font-medium bg-card-light border border-red-500/30 px-3 py-1.5 ${GEN_BAR_R} text-pretty`}>
                        {error}
                    </div>
                )}

                <div className={GEN_BAR_FORM}>
                    {selectedTemplate && (
                        <div className="flex items-center gap-1.5 mb-3">
                            <span className="text-xs text-ink-muted">Стиль:</span>
                            <span className={`inline-flex items-center gap-1.5 max-w-full text-xs font-semibold text-primary bg-primary/10 border border-primary/30 ${GEN_BAR_R} pl-2 pr-1 py-0.5`}>
                                <span className="truncate">{selectedTemplate.title}</span>
                                <button type="button" onClick={onClearTemplate} className="shrink-0 size-4 rounded-full bg-primary text-on-primary flex items-center justify-center hover:bg-primary-hover" aria-label="Убрать стиль">
                                    <X className="size-2.5" strokeWidth={3} />
                                </button>
                            </span>
                        </div>
                    )}

                    {/* Prompt row */}
                    <div className="flex gap-3 mb-3 min-w-0">
                        <div className="flex items-start gap-2 shrink-0">
                            {selectedTemplate && (
                                <div className="relative size-14 shrink-0">
                                    <img src={selectedTemplate.image || `/templates/${selectedTemplate.id}.webp`} alt="" className={`size-full object-cover ${GEN_BAR_R} border border-primary/30`} />
                                    <button type="button" onClick={onClearTemplate} className="absolute -top-1 -right-1 size-4 rounded-full bg-primary text-on-primary flex items-center justify-center" aria-label="Убрать стиль">
                                        <X className="size-2.5" strokeWidth={3} />
                                    </button>
                                </div>
                            )}
                            {sourceImages.slice(0, 2).map((src, i) => (
                                <div key={i} className="relative size-14 shrink-0">
                                    <img src={src} alt="" className={`size-full object-cover ${GEN_BAR_R} border border-[var(--border-color)]`} />
                                    {onRemoveSourceImage && (
                                        <button type="button" onClick={() => onRemoveSourceImage(i)} className="absolute -top-1 -right-1 size-4 rounded-full bg-primary text-on-primary flex items-center justify-center" aria-label="Убрать фото">
                                            <X className="size-2.5" strokeWidth={3} />
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button type="button" onClick={onAddImageClick} className={GEN_BAR_ADD_PHOTO} aria-label="Добавить фото">
                                <Plus className="size-4" />
                            </button>
                        </div>
                        <input
                            value={prompt}
                            onChange={e => onPromptChange(e.target.value)}
                            placeholder={promptPlaceholder}
                            className="flex-1 min-w-0 bg-transparent outline-none text-[15px] font-medium text-ink placeholder:text-ink-muted py-1"
                            onKeyDown={e => { if (e.key === 'Enter' && !isGenerating && canGenerate) onGenerate(); }}
                        />
                    </div>

                    {/* Controls row — uniform h-10 chips */}
                    <div className="flex items-end gap-3 min-w-0">
                        <div className="flex h-10 items-center gap-2 flex-wrap flex-1 min-w-0">
                            <KrasoModelPicker value={krasoModel} onChange={onKrasoModelChange} />

                            {/* Aspect ratio chip */}
                            <div className="relative shrink-0">
                                <button
                                    type="button"
                                    disabled={ratioLocked}
                                    onClick={() => { if (!ratioLocked) { setRatioOpen(v => !v); setResOpen(false); } }}
                                    className={`${GEN_BAR_CHIP} ${ratioLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <RatioIcon ratio={aspectRatio} />
                                    <span className="tabular-nums">{aspectRatio}</span>
                                    {!ratioLocked && (
                                        <ChevronUp className={`size-4 shrink-0 ${GEN_BAR_CHIP_MUTED} transition-transform ${ratioOpen ? '' : 'rotate-180'}`} />
                                    )}
                                </button>
                                {ratioOpen && !ratioLocked && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setRatioOpen(false)} aria-hidden="true" />
                                        <div className={`${GEN_BAR_DROPDOWN} w-36`}>
                                            {RATIOS.map(r => (
                                                <button
                                                    key={r}
                                                    type="button"
                                                    onClick={() => { onAspectRatioChange(r); setRatioOpen(false); }}
                                                    className={`${GEN_BAR_DROPDOWN_ITEM} ${aspectRatio === r ? 'bg-primary/10 text-primary font-semibold' : 'text-ink-body hover:bg-white/5'}`}
                                                >
                                                    <RatioIcon ratio={r} />
                                                    <span className="flex-1 text-left tabular-nums">{r}</span>
                                                    {aspectRatio === r && <Check className="size-3.5 text-primary" strokeWidth={3} />}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Resolution chip */}
                            {krasoCfg.allowsResolution && availableResolutions.length > 0 && (
                                <div className="relative shrink-0">
                                    <button
                                        type="button"
                                        onClick={() => { setResOpen(v => !v); setRatioOpen(false); }}
                                        className={GEN_BAR_CHIP}
                                    >
                                        <Gem className="size-4 text-primary shrink-0" strokeWidth={2} />
                                        <span className="tabular-nums">{resolution}</span>
                                        <ChevronUp className={`size-4 shrink-0 ${GEN_BAR_CHIP_MUTED} transition-transform ${resOpen ? '' : 'rotate-180'}`} />
                                    </button>
                                    {resOpen && (
                                        <>
                                            <div className="fixed inset-0 z-40" onClick={() => setResOpen(false)} aria-hidden="true" />
                                            <div className={GEN_BAR_DROPDOWN}>
                                                {availableResolutions.map(r => (
                                                    <button
                                                        key={r}
                                                        type="button"
                                                        onClick={() => { onResolutionChange(r); setResOpen(false); }}
                                                        className={`${GEN_BAR_DROPDOWN_ITEM} justify-between tabular-nums ${resolution === r ? 'bg-primary/10 text-primary font-semibold' : 'text-ink-body hover:bg-white/5'}`}
                                                    >
                                                        {r}
                                                        {resolution === r && <Check className="size-3.5 text-primary" strokeWidth={3} />}
                                                    </button>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}

                            {/* Batch chip */}
                            {onBatchCountChange && (
                                <div className={GEN_BAR_CHIP}>
                                    <button
                                        type="button"
                                        onClick={() => onBatchCountChange(Math.max(1, batchCount - 1))}
                                        disabled={batchCount <= 1}
                                        className={`${GEN_BAR_CHIP_MUTED} hover:text-ink disabled:opacity-40 transition-colors`}
                                        aria-label="Меньше"
                                    >
                                        <span className="text-base leading-none">−</span>
                                    </button>
                                    <span className="font-semibold text-ink tabular-nums text-center min-w-[2rem]">
                                        {batchCount}<span className="text-ink-muted">/4</span>
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => onBatchCountChange(Math.min(4, batchCount + 1))}
                                        disabled={batchCount >= 4}
                                        className={`${GEN_BAR_CHIP_MUTED} hover:text-ink disabled:opacity-40 transition-colors`}
                                        aria-label="Больше"
                                    >
                                        <Plus className="size-4" />
                                    </button>
                                </div>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={() => onGenerate(batchCount)}
                            disabled={!canGenerate}
                            className={GEN_BAR_GENERATE}
                        >
                            {isGenerating ? (
                                <Loader2 className="size-4 animate-spin motion-reduce:animate-none" />
                            ) : (
                                <>
                                    <span>Создать</span>
                                    <span className="inline-flex items-center gap-1 opacity-90 tabular-nums">
                                        <Sparkles className="size-3.5" />
                                        {cost * batchCount}
                                    </span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GenerationBar;
