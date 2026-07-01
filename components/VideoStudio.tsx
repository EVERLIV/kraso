import React, { useState } from 'react';
import { Plus, ArrowRight, Loader2, X, ChevronUp, Check, Video as VideoIcon, Play } from 'lucide-react';
import { GeneratedImage } from '../types';

type VideoRatio = '16:9' | '9:16' | '1:1';

interface VideoStudioProps {
    prompt: string;
    setPrompt: (v: string) => void;
    attachedImage: string | null;
    setAttachedImage: (v: string | null) => void;
    triggerFileSelect: () => void;
    duration: '5' | '10';
    setDuration: (d: '5' | '10') => void;
    aspectRatio: VideoRatio;
    setAspectRatio: (r: VideoRatio) => void;
    isGenerating: boolean;
    status?: string;
    onGenerate: () => void;
    historyData: GeneratedImage[];
}

const RATIOS: VideoRatio[] = ['16:9', '9:16', '1:1'];

function RatioIcon({ ratio }: { ratio: string }) {
    const [w, h] = ratio.split(':').map(Number);
    const max = 16;
    const bw = w >= h ? max : Math.round((w / h) * max);
    const bh = h >= w ? max : Math.round((h / w) * max);
    return (
        <span className="inline-flex items-center justify-center w-4 h-4">
            <span className="border-[1.5px] border-current rounded-[3px]" style={{ width: bw, height: bh }} />
        </span>
    );
}

/** Minimalist video generation studio — mirrors SceneStudio, with a preloader placeholder. */
function VideoStudio(props: VideoStudioProps) {
    const {
        prompt, setPrompt, attachedImage, setAttachedImage, triggerFileSelect,
        duration, setDuration, aspectRatio, setAspectRatio, isGenerating, status, onGenerate, historyData,
    } = props;
    const [ratioOpen, setRatioOpen] = useState(false);
    const [durOpen, setDurOpen] = useState(false);

    return (
        <div className="flex-1 flex flex-col min-w-0 bg-background-light overflow-hidden">
            {/* Results grid */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-3 md:px-5 pt-4 pb-[190px]">
                <div className="max-w-shell mx-auto">
                    {(isGenerating || historyData.length > 0) ? (
                        <div className="[column-gap:12px] [columns:180px] sm:[columns:220px] md:[columns:260px]">
                            {/* Live preloader placeholder */}
                            {isGenerating && (
                                <div className="w-full mb-3 break-inside-avoid rounded-xl overflow-hidden border border-[var(--border-color)] bg-surface-muted relative"
                                    style={{ aspectRatio: aspectRatio.replace(':', ' / ') }}>
                                    <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-white/5 to-transparent" />
                                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-ink-muted px-4 text-center">
                                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                        <span className="text-[11px]">{status || 'Генерация видео…'}</span>
                                        <span className="text-[10px] text-ink-faint">Обычно занимает 1–3 минуты</span>
                                    </div>
                                </div>
                            )}
                            {/* History videos */}
                            {historyData.map((item, i) => {
                                const valid = item.generated && (item.generated.startsWith('http') || item.generated.startsWith('blob:'));
                                if (!valid) return null;
                                return (
                                    <div key={item.id || i} className="group relative w-full mb-3 break-inside-avoid rounded-xl overflow-hidden border border-[var(--border-color)] hover:border-primary transition-colors">
                                        <video src={item.generated} className="w-full h-auto object-cover" muted loop playsInline preload="metadata"
                                            onMouseOver={e => (e.currentTarget as HTMLVideoElement).play?.()}
                                            onMouseOut={e => (e.currentTarget as HTMLVideoElement).pause?.()} />
                                        <span className="absolute top-2 left-2 bg-black/55 backdrop-blur rounded-md p-1"><Play className="w-3 h-3 text-white fill-white" /></span>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-24 text-center text-ink-muted">
                            <div className="w-16 h-16 rounded-2xl bg-surface-muted flex items-center justify-center mb-4">
                                <VideoIcon className="w-7 h-7 text-primary" />
                            </div>
                            <h2 className="text-base font-semibold text-ink mb-1">Оживите фото в видео</h2>
                            <p className="text-[13px] max-w-xs">Загрузите фото, опишите движение и нажмите «Создать».</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom control panel */}
            <div className="absolute bottom-3 md:bottom-5 inset-x-0 z-30 flex justify-center px-3 md:px-5 pointer-events-none">
                <div className="pointer-events-auto w-full max-w-genbar bg-card-light rounded-[24px] p-2.5 sm:p-3 border border-white/10 shadow-[0_24px_60px_-18px_rgba(0,0,0,0.7)]">
                    {/* Prompt row */}
                    <div className="flex items-start gap-2.5 mb-2.5">
                        {attachedImage ? (
                            <div className="relative w-16 h-16 shrink-0 mt-1">
                                <img src={attachedImage} alt="" className="w-full h-full object-cover rounded-2xl border border-[var(--border-color)]" />
                                <button onClick={() => setAttachedImage(null)} className="absolute -top-1.5 -right-1.5 z-10 w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-[0_1px_4px_rgba(0,0,0,0.5)] hover:bg-primary-hover" aria-label="Убрать">
                                    <X className="w-3 h-3" strokeWidth={3} />
                                </button>
                            </div>
                        ) : (
                            <button onClick={triggerFileSelect} className="w-16 h-16 mt-1 rounded-2xl border border-dashed border-[var(--border-color)] bg-surface-muted text-ink-muted hover:text-primary hover:border-primary/50 flex items-center justify-center shrink-0 transition-colors" aria-label="Добавить фото">
                                <Plus className="w-6 h-6" />
                            </button>
                        )}
                        <textarea
                            value={prompt}
                            onChange={e => setPrompt(e.target.value)}
                            placeholder="Опишите движение и сцену…"
                            rows={2}
                            className="flex-1 min-w-0 bg-transparent outline-none text-[15px] font-medium text-ink placeholder:text-ink-faint px-1 pt-2 resize-none h-16"
                            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey && !isGenerating) { e.preventDefault(); onGenerate(); } }}
                        />
                    </div>

                    {/* Controls row */}
                    <div className="flex items-center gap-2 flex-wrap">
                        {/* Duration */}
                        <div className="relative shrink-0">
                            <button onClick={() => { setDurOpen(v => !v); setRatioOpen(false); }} className="flex items-center gap-1.5 text-xs font-semibold text-ink-body bg-surface-muted px-2.5 py-1.5 rounded-full hover:bg-[var(--border-soft)]">
                                {duration} сек <ChevronUp className={`w-3 h-3 transition-transform ${durOpen ? '' : 'rotate-180'}`} />
                            </button>
                            {durOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setDurOpen(false)} />
                                    <div className="absolute bottom-full left-0 mb-2 w-28 bg-card-light border border-[var(--border-color)] rounded-xl shadow-xl z-50 p-1 space-y-0.5">
                                        {(['5', '10'] as const).map(d => (
                                            <button key={d} onClick={() => { setDuration(d); setDurOpen(false); }} className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-[13px] ${duration === d ? 'bg-primary/10 text-primary font-semibold' : 'text-ink-body hover:bg-surface-muted'}`}>
                                                {d} сек {duration === d && <Check className="w-4 h-4" strokeWidth={3} />}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Ratio */}
                        <div className="relative shrink-0">
                            <button onClick={() => { setRatioOpen(v => !v); setDurOpen(false); }} className="flex items-center gap-1.5 text-xs font-semibold text-ink-body bg-surface-muted px-2.5 py-1.5 rounded-full hover:bg-[var(--border-soft)]">
                                <RatioIcon ratio={aspectRatio} /> {aspectRatio}
                                <ChevronUp className={`w-3 h-3 transition-transform ${ratioOpen ? '' : 'rotate-180'}`} />
                            </button>
                            {ratioOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setRatioOpen(false)} />
                                    <div className="absolute bottom-full left-0 mb-2 w-36 bg-card-light border border-[var(--border-color)] rounded-xl shadow-xl z-50 p-1 space-y-0.5">
                                        <p className="px-3 py-1.5 text-[11px] text-ink-faint uppercase tracking-wider">Формат</p>
                                        {RATIOS.map(r => (
                                            <button key={r} onClick={() => { setAspectRatio(r); setRatioOpen(false); }} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] ${aspectRatio === r ? 'bg-primary/10 text-primary font-semibold' : 'text-ink-body hover:bg-surface-muted'}`}>
                                                <RatioIcon ratio={r} /><span className="flex-1 text-left">{r}</span>
                                                {aspectRatio === r && <Check className="w-4 h-4" strokeWidth={3} />}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Generate */}
                        <button onClick={onGenerate} disabled={isGenerating} className="ml-auto flex items-center gap-2 shrink-0 text-on-primary text-[15px] font-bold px-5 md:px-6 py-2.5 rounded-full shadow-cta bg-primary hover:bg-primary-hover disabled:opacity-60 transition-all active:scale-[0.98]">
                            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <><VideoIcon className="w-4 h-4" /> Создать <ArrowRight className="w-4 h-4 hidden sm:inline" /></>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VideoStudio;
