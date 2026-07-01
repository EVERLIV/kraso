import React, { useState } from 'react';
import { Plus, ArrowRight, Loader2, X, ChevronUp, Zap, Cpu, Check, Sparkles } from 'lucide-react';
import { AspectRatio, GenModelId, GeneratedImage } from '../types';

interface SceneStudioProps {
    prompt: string;
    setPrompt: (v: string) => void;
    attachedImages: string[];
    setAttachedImages: (imgs: string[]) => void;
    triggerFileSelect: () => void;
    model: GenModelId;
    setModel: (m: GenModelId) => void;
    aspectRatio: AspectRatio;
    setAspectRatio: (r: AspectRatio) => void;
    quality: 'low' | 'medium' | 'high';
    setQuality: (q: 'low' | 'medium' | 'high') => void;
    isGenerating: boolean;
    onGenerate: () => void;
    historyData: GeneratedImage[];
    credits: number;
}

const RATIOS: AspectRatio[] = ['9:16', '3:4', '4:5', '1:1', '4:3', '16:9'];
const MODELS = [
    { id: 'gemini-2.5-flash-image', label: 'Быстрая', desc: 'Gemini 2.5', icon: Zap, color: 'text-amber-500' },
    { id: 'gemini-3-pro-image-preview', label: 'Pro', desc: 'Gemini 3.0', icon: Cpu, color: 'text-primary' },
] as const;
const QUALITY_LABEL: Record<string, string> = { low: '1K', medium: '2K', high: '2K+' };

// Small proportional icon for an aspect ratio (rounded frame).
function RatioIcon({ ratio, className = '' }: { ratio: string; className?: string }) {
    const [w, h] = ratio.split(':').map(Number);
    const max = 16;
    const bw = w >= h ? max : Math.round((w / h) * max);
    const bh = h >= w ? max : Math.round((h / w) * max);
    return (
        <span className={`inline-flex items-center justify-center w-4 h-4 ${className}`}>
            <span className="border-[1.5px] border-current rounded-[3px]" style={{ width: bw, height: bh }} />
        </span>
    );
}

/** Minimalist generation studio (Higgsfield-style): results grid + rich bottom panel + generating placeholder. */
function SceneStudio(props: SceneStudioProps) {
    const {
        prompt, setPrompt, attachedImages, setAttachedImages, triggerFileSelect,
        model, setModel, aspectRatio, setAspectRatio, quality, setQuality,
        isGenerating, onGenerate, historyData,
    } = props;

    const [count, setCount] = useState(4);
    const [modelOpen, setModelOpen] = useState(false);
    const [qualityOpen, setQualityOpen] = useState(false);
    const [ratioOpen, setRatioOpen] = useState(false);
    const activeModel = MODELS.find(m => m.id === model) || MODELS[0];

    const removeAttached = (i: number) => setAttachedImages(attachedImages.filter((_, idx) => idx !== i));

    return (
        <div className="flex-1 flex flex-col min-w-0 bg-background-light overflow-hidden">
            {/* Results grid */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-3 md:px-5 pt-4 pb-[190px]">
                <div className="max-w-shell mx-auto">
                    {(isGenerating || historyData.length > 0) ? (
                        <div className="[column-gap:12px] [columns:180px] sm:[columns:220px] md:[columns:260px]">
                            {/* Live generating placeholders */}
                            {isGenerating && Array.from({ length: count }).map((_, i) => (
                                <div key={`gen-${i}`} className="w-full mb-3 break-inside-avoid rounded-xl overflow-hidden border border-[var(--border-color)] bg-surface-muted relative"
                                    style={{ aspectRatio: aspectRatio.replace(':', ' / ') }}>
                                    <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-white/5 to-transparent" />
                                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-ink-muted">
                                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                        <span className="text-[11px]">Генерация…</span>
                                    </div>
                                </div>
                            ))}
                            {/* History results */}
                            {historyData.map((item, i) => {
                                const valid = item.generated && (item.generated.startsWith('http') || item.generated.startsWith('data:image') || item.generated.startsWith('blob:'));
                                if (!valid) return null;
                                return (
                                    <div key={item.id || i} className="group relative w-full mb-3 break-inside-avoid rounded-xl overflow-hidden border border-[var(--border-color)] hover:border-primary transition-colors">
                                        <img src={item.generated} alt={item.prompt || ''} loading="lazy" className="w-full h-auto object-cover" />
                                        {item.prompt && (
                                            <div className="absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                                <p className="text-white text-[11px] line-clamp-2">{item.prompt}</p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-24 text-center text-ink-muted">
                            <div className="w-16 h-16 rounded-2xl bg-surface-muted flex items-center justify-center mb-4">
                                <Sparkles className="w-7 h-7 text-primary" />
                            </div>
                            <h2 className="text-base font-semibold text-ink mb-1">Опишите сцену</h2>
                            <p className="text-[13px] max-w-xs">Введите идею внизу и нажмите «Создать». Результаты появятся здесь.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom control panel */}
            <div className="absolute bottom-3 md:bottom-5 inset-x-0 z-30 flex justify-center px-3 md:px-5 pointer-events-none">
                <div className="pointer-events-auto w-full max-w-genbar bg-card-light rounded-[24px] p-2.5 sm:p-3
                                border border-white/10
                                shadow-[0_24px_60px_-18px_rgba(0,0,0,0.7)]">
                    {/* Prompt row */}
                    <div className="flex items-start gap-2.5 mb-2.5">
                        {attachedImages.slice(0, 3).map((src, i) => (
                            <div key={i} className="relative w-16 h-16 shrink-0 mt-1">
                                <img src={src} alt="" className="w-full h-full object-cover rounded-2xl border border-[var(--border-color)]" />
                                <button onClick={() => removeAttached(i)} className="absolute -top-1.5 -right-1.5 z-10 w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-[0_1px_4px_rgba(0,0,0,0.5)] hover:bg-primary-hover" aria-label="Убрать">
                                    <X className="w-3 h-3" strokeWidth={3} />
                                </button>
                            </div>
                        ))}
                        {/* + upload (photo) — bigger rounded square */}
                        <button onClick={triggerFileSelect} className="w-16 h-16 mt-1 rounded-2xl border border-dashed border-[var(--border-color)] bg-surface-muted text-ink-muted hover:text-primary hover:border-primary/50 flex items-center justify-center shrink-0 transition-colors" aria-label="Добавить фото">
                            <Plus className="w-6 h-6" />
                        </button>
                        <textarea
                            value={prompt}
                            onChange={e => setPrompt(e.target.value)}
                            placeholder="Опишите сцену, которую хотите создать…"
                            rows={2}
                            className="flex-1 min-w-0 bg-transparent outline-none text-[15px] font-medium text-ink placeholder:text-ink-faint px-1 pt-2 resize-none h-16"
                            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey && !isGenerating) { e.preventDefault(); onGenerate(); } }}
                        />
                    </div>

                    {/* Controls row */}
                    <div className="flex items-center gap-2 flex-wrap">
                        {/* Model */}
                        <div className="relative shrink-0">
                            <button onClick={() => { setModelOpen(v => !v); setQualityOpen(false); }} className="flex items-center gap-1.5 text-xs font-semibold text-ink-body bg-surface-muted px-2.5 py-1.5 rounded-full hover:bg-[var(--border-soft)]">
                                <activeModel.icon className={`w-[14px] h-[14px] ${activeModel.color}`} /> {activeModel.label}
                                <ChevronUp className={`w-3 h-3 transition-transform ${modelOpen ? '' : 'rotate-180'}`} />
                            </button>
                            {modelOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setModelOpen(false)} />
                                    <div className="absolute bottom-full left-0 mb-2 w-52 bg-card-light border border-[var(--border-color)] rounded-xl shadow-xl z-50 p-1 space-y-1">
                                        {MODELS.map(opt => (
                                            <button key={opt.id} onClick={() => { setModel(opt.id as GenModelId); setModelOpen(false); }} className={`w-full flex items-center gap-3 p-2 rounded-lg ${model === opt.id ? 'bg-primary/10' : 'hover:bg-surface-muted'}`}>
                                                <span className={`w-7 h-7 rounded-md bg-surface-muted flex items-center justify-center`}><opt.icon className={`w-3.5 h-3.5 ${opt.color}`} /></span>
                                                <span className="text-left flex-1">
                                                    <span className={`block text-xs ${model === opt.id ? 'font-bold text-primary' : 'font-medium text-ink'}`}>{opt.label}</span>
                                                    <span className="block text-[10px] text-ink-faint">{opt.desc}</span>
                                                </span>
                                                {model === opt.id && <Check className="w-4 h-4 text-primary" strokeWidth={3} />}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Ratio — dropdown with icons (Higgsfield style) */}
                        <div className="relative shrink-0">
                            <button onClick={() => { setRatioOpen(v => !v); setModelOpen(false); setQualityOpen(false); }} className="flex items-center gap-1.5 text-xs font-semibold text-ink-body bg-surface-muted px-2.5 py-1.5 rounded-full hover:bg-[var(--border-soft)]">
                                <RatioIcon ratio={aspectRatio} /> {aspectRatio}
                                <ChevronUp className={`w-3 h-3 transition-transform ${ratioOpen ? '' : 'rotate-180'}`} />
                            </button>
                            {ratioOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setRatioOpen(false)} />
                                    <div className="absolute bottom-full left-0 mb-2 w-40 bg-card-light border border-[var(--border-color)] rounded-xl shadow-xl z-50 p-1 space-y-0.5">
                                        <p className="px-3 py-1.5 text-[11px] text-ink-faint uppercase tracking-wider">Формат</p>
                                        {RATIOS.map(r => (
                                            <button key={r} onClick={() => { setAspectRatio(r); setRatioOpen(false); }} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-colors ${aspectRatio === r ? 'bg-primary/10 text-primary font-semibold' : 'text-ink-body hover:bg-surface-muted'}`}>
                                                <RatioIcon ratio={r} />
                                                <span className="flex-1 text-left">{r}</span>
                                                {aspectRatio === r && <Check className="w-4 h-4" strokeWidth={3} />}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Quality */}
                        <div className="relative shrink-0">
                            <button onClick={() => { setQualityOpen(v => !v); setModelOpen(false); }} className="flex items-center gap-1.5 text-xs font-semibold text-ink-body bg-surface-muted px-2.5 py-1.5 rounded-full hover:bg-[var(--border-soft)]">
                                {QUALITY_LABEL[quality]}
                                <ChevronUp className={`w-3 h-3 transition-transform ${qualityOpen ? '' : 'rotate-180'}`} />
                            </button>
                            {qualityOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setQualityOpen(false)} />
                                    <div className="absolute bottom-full left-0 mb-2 w-32 bg-card-light border border-[var(--border-color)] rounded-xl shadow-xl z-50 p-1 space-y-1">
                                        {(['low', 'medium', 'high'] as const).map(q => (
                                            <button key={q} onClick={() => { setQuality(q); setQualityOpen(false); }} className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-[13px] ${quality === q ? 'bg-primary/10 text-primary font-semibold' : 'text-ink-body hover:bg-surface-muted'}`}>
                                                {QUALITY_LABEL[q]}{quality === q && <Check className="w-4 h-4" strokeWidth={3} />}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Count */}
                        <div className="flex items-center gap-1 shrink-0 bg-surface-muted rounded-full px-1.5 py-1">
                            <button onClick={() => setCount(c => Math.max(1, c - 1))} className="w-5 h-5 flex items-center justify-center text-ink-muted hover:text-ink" aria-label="Меньше">−</button>
                            <span className="text-xs font-semibold text-ink tabular-nums w-7 text-center">{count}/4</span>
                            <button onClick={() => setCount(c => Math.min(4, c + 1))} className="w-5 h-5 flex items-center justify-center text-ink-muted hover:text-ink" aria-label="Больше">+</button>
                        </div>

                        {/* Generate */}
                        <button onClick={onGenerate} disabled={isGenerating} className="ml-auto flex items-center gap-2 shrink-0 text-on-primary text-[15px] font-bold px-5 md:px-6 py-2.5 rounded-full shadow-cta bg-primary hover:bg-primary-hover disabled:opacity-60 transition-all active:scale-[0.98]">
                            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Sparkles className="w-4 h-4" /> Создать <ArrowRight className="w-4 h-4 hidden sm:inline" /></>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SceneStudio;
