import React, { useState } from 'react';
import { Plus, Loader2, X, Cpu, Zap, ChevronUp } from 'lucide-react';
import { AspectRatio, GenModelId, Preset } from '../types';

interface GenerationBarProps {
    prompt: string;
    onPromptChange: (value: string) => void;
    aspectRatio: AspectRatio;
    onAspectRatioChange: (ratio: AspectRatio) => void;
    selectedModel: GenModelId;
    onModelChange: (model: GenModelId) => void;
    selectedTemplate: Preset | null;
    onClearTemplate: () => void;
    hasSourceImage: boolean;
    onAddImageClick: () => void;
    onGenerate: () => void;
    isGenerating: boolean;
    cost: number;
    error?: string | null;
    /** Thumbnails of attached source images (data URLs / urls) */
    sourceImages?: string[];
    onRemoveSourceImage?: (index: number) => void;
    /** When true (document presets), the aspect-ratio picker is disabled. */
    ratioLocked?: boolean;
}

const RATIOS: AspectRatio[] = ['1:1', '4:5', '9:16', '16:9'];

const MODEL_OPTIONS = [
    { id: 'gemini-2.5-flash-image', label: 'Быстрая', desc: 'Gemini 2.5', icon: Zap, color: 'text-amber-500' },
    { id: 'gemini-3-pro-image-preview', label: 'Pro', desc: 'Gemini 3.0', icon: Cpu, color: 'text-primary' },
] as const;

/**
 * Sticky bottom generation bar — Studio reference.
 * Sits below the template gallery; centered, pill-shaped, frosted.
 */
function GenerationBar({
    prompt, onPromptChange, aspectRatio, onAspectRatioChange,
    selectedModel, onModelChange, selectedTemplate, onClearTemplate,
    hasSourceImage, onAddImageClick, onGenerate, isGenerating, cost, error,
    sourceImages = [], onRemoveSourceImage, ratioLocked = false,
}: GenerationBarProps) {
    const [modelOpen, setModelOpen] = useState(false);
    const activeModel = MODEL_OPTIONS.find(m => m.id === selectedModel) || MODEL_OPTIONS[0];

    return (
        <div className="z-30 flex justify-center px-2 sm:px-4 md:px-6 pb-[calc(22px+env(safe-area-inset-bottom))] pointer-events-none">
            <div className="pointer-events-auto w-full max-w-genbar">
                {error && (
                    <div className="mb-2 mx-auto w-fit max-w-full text-red-500 text-xs font-medium bg-card-light border border-red-200 px-3 py-1.5 rounded-full shadow-sm">
                        {error}
                    </div>
                )}

                {/* Card: thumbnails + prompt (top), controls (bottom) — wraps on mobile */}
                <div className="bg-card-light rounded-[24px] p-2.5 sm:p-3
                                border border-white/10
                                shadow-[0_24px_60px_-18px_rgba(0,0,0,0.7)]">

                    {/* Selected style label */}
                    {selectedTemplate && (
                        <div className="flex items-center gap-1.5 mb-2 px-0.5">
                            <span className="text-[11px] text-ink-muted">Стиль:</span>
                            <span className="inline-flex items-center gap-1.5 max-w-full text-[12px] font-semibold text-primary bg-primary/10 border border-primary/30 rounded-full pl-2 pr-1 py-0.5">
                                <span className="truncate">{selectedTemplate.title}</span>
                                <button onClick={onClearTemplate} className="shrink-0 w-4 h-4 rounded-full bg-primary text-on-primary flex items-center justify-center hover:bg-primary-hover" aria-label="Убрать стиль">
                                    <X className="w-2.5 h-2.5" strokeWidth={3} />
                                </button>
                            </span>
                        </div>
                    )}

                    {/* Top: attached photos + prompt */}
                    <div className="flex items-center gap-2 mb-2.5">
                        {/* Thumbnails */}
                        <div className="flex items-center gap-1.5 shrink-0">
                            {selectedTemplate && (
                                <div className="relative w-16 h-16 shrink-0 mr-1 mt-1">
                                    <img src={selectedTemplate.image || `/templates/${selectedTemplate.id}.jpg`} alt={selectedTemplate.title} className="w-full h-full object-cover rounded-2xl border border-primary/30" />
                                    <button onClick={onClearTemplate} className="absolute -top-1.5 -right-1.5 z-10 w-4 h-4 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-[0_1px_4px_rgba(0,0,0,0.5)] hover:bg-primary-hover" aria-label="Убрать стиль">
                                        <X className="w-2.5 h-2.5" strokeWidth={3} />
                                    </button>
                                </div>
                            )}
                            {sourceImages.slice(0, 3).map((src, i) => (
                                <div key={i} className="relative w-16 h-16 shrink-0 mr-1 mt-1">
                                    <img src={src} alt="Фото" className="w-full h-full object-cover rounded-2xl border border-[var(--border-color)]" />
                                    {onRemoveSourceImage && (
                                        <button onClick={() => onRemoveSourceImage(i)} className="absolute -top-1.5 -right-1.5 z-10 w-4 h-4 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-[0_1px_4px_rgba(0,0,0,0.5)] hover:bg-primary-hover" aria-label="Убрать фото">
                                            <X className="w-2.5 h-2.5" strokeWidth={3} />
                                        </button>
                                    )}
                                </div>
                            ))}
                            {/* Add photo */}
                            <button
                                onClick={onAddImageClick}
                                className={`w-16 h-16 rounded-2xl border flex items-center justify-center shrink-0 transition-colors ${hasSourceImage ? 'bg-primary-soft border-primary/30 text-primary' : 'bg-surface-muted border-[var(--border-soft)] text-ink-body hover:bg-[var(--border-soft)]'}`}
                                aria-label="Добавить фото"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Prompt */}
                        <input
                            value={prompt}
                            onChange={e => onPromptChange(e.target.value)}
                            placeholder="Опишите идею или выберите стиль…"
                            className="flex-1 min-w-0 bg-transparent outline-none text-[15px] font-medium text-ink placeholder:text-ink-faint px-1"
                            onKeyDown={e => { if (e.key === 'Enter' && !isGenerating) onGenerate(); }}
                        />
                    </div>

                    {/* Bottom: controls (wrap on mobile); Generate stays pinned to the bottom-right */}
                    <div className="flex items-end gap-2">
                    <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
                        {/* Model chip */}
                        <div className="relative shrink-0">
                            <button
                                onClick={() => setModelOpen(v => !v)}
                                className="flex items-center gap-1.5 text-xs font-semibold text-ink-body bg-surface-muted px-2.5 py-1.5 rounded-full hover:bg-[var(--border-soft)] transition-colors"
                            >
                                <activeModel.icon className={`w-[14px] h-[14px] ${activeModel.color}`} />
                                <span className="hidden xs:inline">{activeModel.label}</span>
                                <ChevronUp className={`w-3 h-3 transition-transform ${modelOpen ? '' : 'rotate-180'}`} />
                            </button>
                            {modelOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setModelOpen(false)} />
                                    <div className="absolute bottom-full left-0 mb-2 w-52 bg-card-light border border-[var(--border-color)] rounded-xl shadow-xl z-50 p-1 space-y-1">
                                        {MODEL_OPTIONS.map(opt => (
                                            <button
                                                key={opt.id}
                                                onClick={() => { onModelChange(opt.id as GenModelId); setModelOpen(false); }}
                                                className={`w-full flex items-center gap-3 p-2 rounded-lg transition-all ${selectedModel === opt.id ? 'bg-primary-soft' : 'hover:bg-surface-muted'}`}
                                            >
                                                <span className={`w-7 h-7 rounded-md bg-surface-muted flex items-center justify-center ${selectedModel === opt.id ? 'bg-primary/15' : ''}`}>
                                                    <opt.icon className={`w-3.5 h-3.5 ${opt.color}`} />
                                                </span>
                                                <span className="text-left">
                                                    <span className={`block text-xs ${selectedModel === opt.id ? 'font-bold text-primary' : 'font-medium text-ink'}`}>{opt.label}</span>
                                                    <span className="block text-[10px] text-ink-faint">{opt.desc}</span>
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Aspect ratio segment — locked for document presets (fixed size) */}
                        <div className={`flex items-center gap-1 shrink-0 ${ratioLocked ? 'opacity-50' : ''}`} title={ratioLocked ? 'Размер задан документом' : undefined}>
                            {RATIOS.map(r => (
                                <button
                                    key={r}
                                    disabled={ratioLocked}
                                    onClick={() => !ratioLocked && onAspectRatioChange(r)}
                                    className={`px-2 sm:px-2.5 py-[6px] rounded-lg text-[12px] font-semibold border transition-colors ${ratioLocked ? 'cursor-not-allowed' : ''} ${aspectRatio === r ? 'bg-primary/10 text-primary border-primary' : 'text-ink-muted border-[var(--border-color)]'} ${!ratioLocked && aspectRatio !== r ? 'hover:text-ink hover:border-ink-faint' : ''}`}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>
                    </div>

                        {/* Generate */}
                        <button
                            onClick={onGenerate}
                            disabled={isGenerating}
                            className="shrink-0 inline-flex items-center justify-center gap-1.5 text-on-primary text-[13px] font-bold px-4 py-2 rounded-lg shadow-cta bg-primary hover:bg-primary-hover disabled:opacity-60 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
                        >
                            {isGenerating ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <>
                                    <span>Создать</span>
                                    <span className="opacity-80 font-semibold">· {cost}</span>
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
