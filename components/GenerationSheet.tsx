import React, { useState, useEffect } from 'react';
import { X, Plus, ChevronDown, Sparkles, Loader2, ArrowRight, Image as ImageIcon, Cpu, Zap, Video as VideoIcon, LayoutGrid, Check } from 'lucide-react';
import { AspectRatio, GenModelId, Preset } from '../types';

type SheetMode = 'chooser' | 'photo' | 'video';
type VideoRatio = '16:9' | '9:16' | '1:1';

interface GenerationSheetProps {
    open: boolean;
    onClose: () => void;
    // Photo
    prompt: string;
    onPromptChange: (value: string) => void;
    aspectRatio: AspectRatio;
    onAspectRatioChange: (ratio: AspectRatio) => void;
    selectedModel: GenModelId;
    onModelChange: (model: GenModelId) => void;
    selectedTemplate: Preset | null;
    onClearTemplate: () => void;
    sourceImages: string[];
    onAddImageClick: () => void;
    onRemoveSourceImage: (index: number) => void;
    onGenerate: () => void;
    isGenerating: boolean;
    cost: number;
    error?: string | null;
    ratioLocked?: boolean;
    // Navigation
    onOpenTemplates: () => void;
    // Video
    videoPrompt: string;
    onVideoPromptChange: (v: string) => void;
    videoAttachedImage: string | null;
    onVideoAddImageClick: () => void;
    onVideoRemoveImage: () => void;
    videoDuration: '5' | '10';
    onVideoDurationChange: (d: '5' | '10') => void;
    videoAspectRatio: VideoRatio;
    onVideoAspectRatioChange: (r: VideoRatio) => void;
    onVideoGenerate: () => void;
    isVideoGenerating: boolean;
    videoStatus?: string;
}

const RATIOS: AspectRatio[] = ['1:1', '4:5', '9:16', '16:9'];
const MODEL_OPTIONS = [
    { id: 'gemini-2.5-flash-image', label: 'Быстрая', desc: 'Gemini 2.5', icon: Zap, color: 'text-amber-500' },
    { id: 'gemini-3-pro-image-preview', label: 'Pro', desc: 'Gemini 3.0', icon: Cpu, color: 'text-primary' },
] as const;

/**
 * Mobile full-screen generation sheet (Higgsfield-style "Create Image").
 * Opens from the central FAB in the bottom nav. Desktop uses GenerationBar instead.
 */
const VIDEO_RATIOS: VideoRatio[] = ['16:9', '9:16', '1:1'];

function RatioIcon({ ratio }: { ratio: string }) {
    const [w, h] = ratio.split(':').map(Number);
    const max = 14;
    const bw = w >= h ? max : Math.round((w / h) * max);
    const bh = h >= w ? max : Math.round((h / w) * max);
    return <span className="inline-flex items-center justify-center w-4 h-4"><span className="border-[1.5px] border-current rounded-[3px]" style={{ width: bw, height: bh }} /></span>;
}

function GenerationSheet(props: GenerationSheetProps) {
    const {
        open, onClose, prompt, onPromptChange, aspectRatio, onAspectRatioChange,
        selectedModel, onModelChange, selectedTemplate, onClearTemplate,
        sourceImages, onAddImageClick, onRemoveSourceImage, onGenerate, isGenerating, cost, error,
        ratioLocked = false, onOpenTemplates,
        videoPrompt, onVideoPromptChange, videoAttachedImage, onVideoAddImageClick, onVideoRemoveImage,
        videoDuration, onVideoDurationChange, videoAspectRatio, onVideoAspectRatioChange, onVideoGenerate, isVideoGenerating, videoStatus,
    } = props;
    const [modelOpen, setModelOpen] = useState(false);
    const [mode, setMode] = useState<SheetMode>('chooser');
    const [modeMenuOpen, setModeMenuOpen] = useState(false);
    const activeModel = MODEL_OPTIONS.find(m => m.id === selectedModel) || MODEL_OPTIONS[0];

    // Reset to chooser each time the sheet opens.
    useEffect(() => { if (open) { setMode('chooser'); setModeMenuOpen(false); } }, [open]);

    if (!open) return null;

    const thumbs = [
        ...(selectedTemplate ? [{ src: selectedTemplate.image || `/templates/${selectedTemplate.id}.jpg`, onRemove: onClearTemplate, isTemplate: true }] : []),
        ...sourceImages.map((src, i) => ({ src, onRemove: () => onRemoveSourceImage(i), isTemplate: false })),
    ];

    const title = mode === 'video' ? 'Генерация видео' : mode === 'photo' ? 'Генерация фото' : 'Создать';

    // ——— Chooser screen (first tap) ———
    const CHOICES = [
        { id: 'templates', label: 'Шаблоны КрасоМир', sub: 'Готовые стили и образы', icon: LayoutGrid, img: '/templates/soviet-gentlemen.webp', onClick: () => { onClose(); onOpenTemplates(); } },
        { id: 'photo', label: 'Генерация фото', sub: 'Создавайте изображения ИИ', icon: ImageIcon, img: '/templates/fashion-cyber.webp', onClick: () => setMode('photo') },
        { id: 'video', label: 'Генерация видео', sub: 'Оживите фото в видео', icon: VideoIcon, img: '/templates/f1-cockpit.webp', onClick: () => setMode('video') },
    ];

    return (
        <div className="lg:hidden fixed inset-0 z-[90] flex flex-col bg-background-light animate-in slide-in-from-bottom duration-300">
            {/* Header with mode switcher dropdown */}
            <div className="h-14 shrink-0 flex items-center justify-between px-4 border-b border-[var(--border-strong)]">
                <span className="w-9" />
                <div className="relative">
                    <button onClick={() => mode !== 'chooser' && setModeMenuOpen(v => !v)} className="flex items-center gap-1.5 text-sm font-bold text-ink">
                        {title} {mode !== 'chooser' && <ChevronDown className={`w-4 h-4 text-ink-muted transition-transform ${modeMenuOpen ? 'rotate-180' : ''}`} />}
                    </button>
                    {modeMenuOpen && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setModeMenuOpen(false)} />
                            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-52 bg-card-light border border-[var(--border-color)] rounded-xl shadow-xl z-50 p-1">
                                <button onClick={() => { setModeMenuOpen(false); onClose(); onOpenTemplates(); }} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] text-ink-body hover:bg-surface-muted">
                                    <LayoutGrid className="w-4 h-4" /> Шаблоны КрасоМир
                                </button>
                                <button onClick={() => { setMode('photo'); setModeMenuOpen(false); }} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-[13px] ${mode === 'photo' ? 'bg-primary/10 text-primary font-semibold' : 'text-ink-body hover:bg-surface-muted'}`}>
                                    <span className="flex items-center gap-2.5"><ImageIcon className="w-4 h-4" /> Генерация фото</span>{mode === 'photo' && <Check className="w-4 h-4" strokeWidth={3} />}
                                </button>
                                <button onClick={() => { setMode('video'); setModeMenuOpen(false); }} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-[13px] ${mode === 'video' ? 'bg-primary/10 text-primary font-semibold' : 'text-ink-body hover:bg-surface-muted'}`}>
                                    <span className="flex items-center gap-2.5"><VideoIcon className="w-4 h-4" /> Генерация видео</span>{mode === 'video' && <Check className="w-4 h-4" strokeWidth={3} />}
                                </button>
                            </div>
                        </>
                    )}
                </div>
                <button onClick={onClose} className="w-9 h-9 flex items-center justify-center text-ink-muted hover:text-ink rounded-full hover:bg-surface-muted" aria-label="Закрыть">
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* CHOOSER */}
            {mode === 'chooser' && (
                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
                    {CHOICES.map(c => (
                        <button key={c.id} onClick={c.onClick} className="group relative w-full h-28 rounded-2xl overflow-hidden border border-[var(--border-color)] text-left">
                            <img src={c.img} alt="" className="w-full h-full object-cover opacity-60 group-active:opacity-80 transition-opacity" />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" />
                            <div className="absolute inset-0 p-4 flex flex-col justify-center">
                                <span className="flex items-center gap-2 mb-1">
                                    <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center"><c.icon className="w-4 h-4 text-primary" /></span>
                                </span>
                                <div className="text-white font-semibold text-[15px]">{c.label}</div>
                                <div className="text-white/60 text-[12px] mt-0.5">{c.sub}</div>
                            </div>
                            <ArrowRight className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/70" />
                        </button>
                    ))}
                </div>
            )}

            {/* VIDEO PANEL */}
            {mode === 'video' && (
                <>
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
                        <div className="bg-surface-muted rounded-2xl p-4">
                            {videoAttachedImage ? (
                                <div className="relative w-20 h-20">
                                    <img src={videoAttachedImage} alt="" className="w-full h-full object-cover rounded-2xl border border-[var(--border-color)]" />
                                    <button onClick={onVideoRemoveImage} className="absolute -top-1.5 -right-1.5 z-10 w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-[0_1px_4px_rgba(0,0,0,0.5)]" aria-label="Убрать"><X className="w-3 h-3" strokeWidth={3} /></button>
                                </div>
                            ) : (
                                <button onClick={onVideoAddImageClick} className="w-full flex flex-col items-center justify-center gap-2 py-6 text-center">
                                    <span className="w-11 h-11 rounded-full bg-card-light border border-[var(--border-color)] flex items-center justify-center"><ImageIcon className="w-5 h-5 text-ink-muted" /></span>
                                    <span className="text-sm font-semibold text-ink">Загрузите фото</span>
                                    <span className="text-xs text-ink-faint">Оно оживёт в видео</span>
                                </button>
                            )}
                        </div>
                        <textarea value={videoPrompt} onChange={e => onVideoPromptChange(e.target.value)} placeholder="Опишите движение и сцену…" rows={3} className="w-full bg-card-light border border-[var(--border-color)] rounded-2xl p-4 text-[15px] font-medium text-ink placeholder:text-ink-faint outline-none focus:border-primary/40 resize-none h-28" />
                        <div>
                            <p className="text-xs font-bold text-ink-muted uppercase tracking-wider mb-2 px-1">Длительность</p>
                            <div className="grid grid-cols-2 gap-2">
                                {(['5', '10'] as const).map(d => (
                                    <button key={d} onClick={() => onVideoDurationChange(d)} className={`py-2.5 rounded-xl text-sm font-semibold border-2 ${videoDuration === d ? 'bg-primary/10 text-primary border-primary' : 'bg-transparent text-ink-muted border-[var(--border-color)]'}`}>{d} сек</button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-ink-muted uppercase tracking-wider mb-2 px-1">Формат</p>
                            <div className="grid grid-cols-3 gap-2">
                                {VIDEO_RATIOS.map(r => (
                                    <button key={r} onClick={() => onVideoAspectRatioChange(r)} className={`py-2.5 rounded-xl text-sm font-semibold border-2 flex items-center justify-center gap-1.5 ${videoAspectRatio === r ? 'bg-primary/10 text-primary border-primary' : 'bg-transparent text-ink-muted border-[var(--border-color)]'}`}><RatioIcon ratio={r} />{r}</button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="shrink-0 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] border-t border-[var(--border-strong)] bg-background-light">
                        <button onClick={onVideoGenerate} disabled={isVideoGenerating} className="w-full flex items-center justify-center gap-2 text-on-primary text-base font-bold py-4 rounded-2xl shadow-cta-lg bg-primary hover:bg-primary-hover disabled:opacity-60 transition-all active:scale-[0.99]">
                            {isVideoGenerating ? <><Loader2 className="w-5 h-5 animate-spin" /> {videoStatus || 'Генерация…'}</> : <><VideoIcon className="w-5 h-5" /> Создать видео <ArrowRight className="w-5 h-5" /></>}
                        </button>
                    </div>
                </>
            )}

            {/* PHOTO PANEL (existing) */}
            {mode === 'photo' && (
            <>

            {/* Body */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
                {/* Upload / thumbnails */}
                <div className="bg-surface-muted rounded-2xl p-4">
                    {thumbs.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {thumbs.map((t, i) => (
                                <div key={i} className="relative w-16 h-16 mr-1 mt-1">
                                    <img src={t.src} alt="" className={`w-full h-full object-cover rounded-xl border ${t.isTemplate ? 'border-primary/40' : 'border-[var(--border-color)]'}`} />
                                    <button onClick={t.onRemove} className="absolute -top-1.5 -right-1.5 z-10 w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-[0_1px_4px_rgba(0,0,0,0.5)] hover:bg-primary-hover" aria-label="Убрать">
                                        <X className="w-3 h-3" strokeWidth={3} />
                                    </button>
                                </div>
                            ))}
                            <button onClick={onAddImageClick} className="w-16 h-16 rounded-xl border border-dashed border-[var(--border-color)] flex items-center justify-center text-ink-muted hover:text-primary hover:border-primary/40 transition-colors" aria-label="Добавить фото">
                                <Plus className="w-6 h-6" />
                            </button>
                        </div>
                    ) : (
                        <button onClick={onAddImageClick} className="w-full flex flex-col items-center justify-center gap-2 py-6 text-center">
                            <span className="w-11 h-11 rounded-full bg-card-light border border-[var(--border-color)] flex items-center justify-center">
                                <ImageIcon className="w-5 h-5 text-ink-muted" />
                            </span>
                            <span className="text-sm font-semibold text-ink">Загрузите фото</span>
                            <span className="text-xs text-ink-faint">Лицо или товар — для подстановки в стиль</span>
                        </button>
                    )}
                </div>

                {/* Prompt */}
                <textarea
                    value={prompt}
                    onChange={e => onPromptChange(e.target.value)}
                    placeholder="Опишите идею или выберите стиль из библиотеки…"
                    className="w-full bg-card-light border border-[var(--border-color)] rounded-2xl p-4 text-[15px] font-medium text-ink placeholder:text-ink-faint outline-none focus:border-primary/40 resize-none h-28"
                />

                {/* Model selector */}
                <div className="bg-card-light border border-[var(--border-color)] rounded-2xl divide-y divide-[var(--border-strong)]">
                    <button onClick={() => setModelOpen(v => !v)} className="w-full flex items-center justify-between p-4">
                        <span className="flex items-center gap-2 text-sm font-semibold text-ink">
                            <activeModel.icon className={`w-4 h-4 ${activeModel.color}`} /> Модель
                        </span>
                        <span className="flex items-center gap-1.5 text-sm font-bold text-ink">
                            {activeModel.label} <ChevronDown className={`w-4 h-4 text-ink-muted transition-transform ${modelOpen ? 'rotate-180' : ''}`} />
                        </span>
                    </button>
                    {modelOpen && (
                        <div className="p-2 space-y-1">
                            {MODEL_OPTIONS.map(opt => (
                                <button
                                    key={opt.id}
                                    onClick={() => { onModelChange(opt.id as GenModelId); setModelOpen(false); }}
                                    className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all ${selectedModel === opt.id ? 'bg-primary-soft' : 'hover:bg-surface-muted'}`}
                                >
                                    <span className={`w-8 h-8 rounded-lg bg-surface-muted flex items-center justify-center ${selectedModel === opt.id ? 'bg-primary/15' : ''}`}>
                                        <opt.icon className={`w-4 h-4 ${opt.color}`} />
                                    </span>
                                    <span className="text-left flex-1">
                                        <span className={`block text-sm ${selectedModel === opt.id ? 'font-bold text-primary' : 'font-medium text-ink'}`}>{opt.label}</span>
                                        <span className="block text-[11px] text-ink-faint">{opt.desc}</span>
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Aspect ratio — locked for document presets (fixed size) */}
                <div>
                    <p className="text-xs font-bold text-ink-muted uppercase tracking-wider mb-2 px-1">
                        Формат {ratioLocked && <span className="text-ink-faint normal-case font-medium tracking-normal">· задан документом</span>}
                    </p>
                    <div className={`grid grid-cols-4 gap-2 ${ratioLocked ? 'opacity-50' : ''}`}>
                        {RATIOS.map(r => (
                            <button
                                key={r}
                                disabled={ratioLocked}
                                onClick={() => !ratioLocked && onAspectRatioChange(r)}
                                className={`py-2.5 rounded-xl text-sm font-semibold border-2 transition-colors ${ratioLocked ? 'cursor-not-allowed' : ''} ${aspectRatio === r ? 'bg-primary/10 text-primary border-primary' : 'bg-transparent text-ink-muted border-[var(--border-color)]'} ${!ratioLocked && aspectRatio !== r ? 'hover:text-ink' : ''}`}
                            >
                                {r}
                            </button>
                        ))}
                    </div>
                </div>

                {error && (
                    <div className="text-red-500 text-sm font-medium bg-red-50 border border-red-200 px-3 py-2 rounded-xl">{error}</div>
                )}
            </div>

            {/* Footer: big Generate */}
            <div className="shrink-0 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] border-t border-[var(--border-strong)] bg-background-light">
                <button
                    onClick={onGenerate}
                    disabled={isGenerating}
                    className="w-full flex items-center justify-center gap-2 text-on-primary text-base font-bold py-4 rounded-2xl shadow-cta-lg bg-primary hover:bg-primary-hover disabled:opacity-60 transition-all active:scale-[0.99]"
                >
                    {isGenerating ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            <Sparkles className="w-5 h-5" /> Создать · {cost} кр <ArrowRight className="w-5 h-5" />
                        </>
                    )}
                </button>
            </div>
            </>
            )}
        </div>
    );
}

export default GenerationSheet;
