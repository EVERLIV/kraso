
import React, { useState, useRef, useEffect } from 'react';
import {
    Download, Zap, Bot, Loader2, Send, Video,
    ImagePlus, X, AlertCircle, Sparkles, User, Maximize2, Play, ChevronDown, Heart,
    Info, ChevronUp, Film, Sliders
} from 'lucide-react';
import { GeneratedImage } from '../types';

interface AnimateInterfaceProps {
    credits: number;
    userId?: string;
    onOpenPricing: () => void;
    videoSettings: {
        duration: '5' | '10';
        aspectRatio: '16:9' | '9:16' | '1:1';
        negativePrompt: string;
        cfgScale: number;
        setDuration?: (d: '5' | '10') => void;
        setAspectRatio?: (r: '16:9' | '9:16' | '1:1') => void;
    };
    prompt: string;
    setPrompt: (p: string) => void;
    attachedImage: string | null;
    setAttachedImage: (img: string | null) => void;
    isGenerating: boolean;
    status: string;
    historyData: GeneratedImage[];
    onGenerate: () => void;
    triggerFileSelect: () => void;
    onToggleSave: (id: string) => void;
}

const AnimateInterface: React.FC<AnimateInterfaceProps> = ({
    credits,
    onOpenPricing,
    videoSettings,
    prompt,
    setPrompt,
    attachedImage,
    setAttachedImage,
    isGenerating,
    status,
    historyData,
    onGenerate,
    triggerFileSelect,
    onToggleSave
}) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
    const [infoExpanded, setInfoExpanded] = useState(true);
    const [settingsOpen, setSettingsOpen] = useState(false);

    // Auto-scroll to bottom on generation
    useEffect(() => {
        if (isGenerating && scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [isGenerating]);

    const handleDownload = async (url: string) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = `kling-video-${Date.now()}.mp4`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(downloadUrl);
            document.body.removeChild(a);
        } catch (e) {
            window.open(url, '_blank');
        }
    };

    return (
        <div className="flex flex-col h-full w-full bg-brand-bg relative overflow-hidden font-sans min-h-0">
            {/* Main Stream Area — на мобильном больше отступ снизу под инпут в стиле чата */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto custom-scrollbar px-4 py-4 md:py-6 md:px-8 space-y-8 pb-[5.5rem] md:pb-32 min-h-0"
            >
                {/* Инструкции — всегда сверху */}
                <div className="max-w-2xl mx-auto">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 md:w-14 md:h-14 bg-pink-500/10 rounded-2xl flex items-center justify-center shrink-0 border border-pink-500/20">
                            <Video className="w-6 h-6 md:w-7 md:h-7 text-pink-500" />
                        </div>
                        <div>
                            <h2 className="text-lg md:text-xl font-bold text-slate-800">Оживление фото</h2>
                            <p className="text-slate-600 text-xs md:text-sm max-w-md">
                                Статичное фото → короткое видео. Загрузите фото, опишите движение (Veo 3.1).
                            </p>
                        </div>
                    </div>
                    <div className="bg-white/80 backdrop-blur border border-slate-200 rounded-[24px] shadow-sm overflow-hidden text-left">
                        <button
                            onClick={() => setInfoExpanded(!infoExpanded)}
                            className="w-full flex items-center justify-between gap-3 px-5 py-3 text-slate-800 hover:bg-slate-50/80 transition-colors"
                            aria-expanded={infoExpanded ? "true" : "false"}
                        >
                            <span className="flex items-center gap-2 font-semibold text-sm">
                                <Info className="w-4 h-4 text-pink-500" />
                                Как пользоваться
                            </span>
                            {infoExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                        </button>
                        {infoExpanded && (
                            <div className="px-5 pb-5 pt-0 space-y-4 border-t border-slate-100">
                                <div className="flex gap-3 pt-4">
                                    <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center shrink-0 font-bold text-sm">1</div>
                                    <div>
                                        <p className="font-medium text-slate-800 text-sm">Загрузите фото</p>
                                        <p className="text-slate-500 text-xs mt-0.5">Кнопка с иконкой фото — портрет, пейзаж или предмет.</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center shrink-0 font-bold text-sm">2</div>
                                    <div>
                                        <p className="font-medium text-slate-800 text-sm">Опишите движение</p>
                                        <p className="text-slate-500 text-xs mt-0.5">Например: «лёгкий ветер в волосах», «камера приближается», «огонь колышется».</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center shrink-0 font-bold text-sm">3</div>
                                    <div>
                                        <p className="font-medium text-slate-800 text-sm">Длительность и формат</p>
                                        <p className="text-slate-500 text-xs mt-0.5">В настройках: 5 или 10 с, 16:9, 9:16 или 1:1.</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center shrink-0 font-bold text-sm">4</div>
                                    <div>
                                        <p className="font-medium text-slate-800 text-sm">Нажмите «Отправить»</p>
                                        <p className="text-slate-500 text-xs mt-0.5">Генерация 1–3 мин. Скачать или в избранное.</p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2 pt-2">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
                                        <Film className="w-3 h-3" /> 5 с — 90 кредитов, 10 с — 180
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-medium">
                                        <Zap className="w-3 h-3" /> Кредиты после успешной генерации
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* История генераций */}
                <div className="max-w-4xl mx-auto space-y-10">
                        {historyData.map((item, idx) => (
                            <div key={item.id || idx} className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                                {/* USER PROMPT CARD */}
                                <div className="flex justify-end gap-3">
                                    <div className="flex flex-col items-end gap-2 max-w-[85%]">
                                        <div className="bg-slate-900 text-white rounded-[24px] rounded-tr-[4px] p-4 shadow-xl border border-slate-800">
                                            <div className="flex flex-col gap-4">
                                                {item.original && (
                                                    <div className="relative group w-48 aspect-square rounded-xl overflow-hidden border border-white/10 shadow-lg cursor-pointer">
                                                        <img src={item.original} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                            <span className="text-[10px] font-bold text-white uppercase tracking-wider">Исходник</span>
                                                        </div>
                                                    </div>
                                                )}
                                                <p className="text-sm font-medium leading-relaxed">{item.prompt}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 px-1">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Вы</span>
                                            <div className="w-7 h-7 rounded-full bg-slate-200 border border-white shadow-sm flex items-center justify-center">
                                                <User className="w-3.5 h-3.5 text-slate-500" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* AI RESULT CARD */}
                                <div className="flex justify-start gap-3">
                                    <div className="flex flex-col items-start gap-2 max-w-[90%] w-full">
                                        <div className="flex items-center gap-2 px-1">
                                            <div className="w-7 h-7 rounded-full bg-pink-600 border border-pink-400 shadow-md flex items-center justify-center">
                                                <Sparkles className="w-3.5 h-3.5 text-white" />
                                            </div>
                                            <span className="text-[10px] font-bold text-pink-600 uppercase tracking-widest">Kling AI 1.6 Pro</span>
                                        </div>

                                        {item.generated ? (
                                            <div className="w-full bg-white border border-slate-100 rounded-[28px] rounded-tl-[4px] p-3 shadow-xl group/card relative overflow-hidden">
                                                <div className="relative aspect-video rounded-2xl overflow-hidden bg-black shadow-inner ring-1 ring-black/5 group/vid">
                                                    <video
                                                        src={item.generated}
                                                        className="w-full h-full object-cover"
                                                        muted
                                                        loop
                                                        onMouseOver={(e) => (e.target as any).play()}
                                                        onMouseOut={(e) => (e.target as any).pause()}
                                                    />
                                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/vid:opacity-100 transition-all flex items-center justify-center group-hover/vid:backdrop-blur-[2px]">
                                                        <button
                                                            onClick={() => setSelectedVideo(item.generated)}
                                                            className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 hover:scale-110 active:scale-95 transition-all shadow-xl"
                                                        >
                                                            <Maximize2 className="w-6 h-6" />
                                                        </button>
                                                    </div>
                                                    <div className="absolute top-3 left-3 px-2 py-1 bg-black/40 backdrop-blur-md rounded-lg text-[9px] font-bold text-white uppercase tracking-wider border border-white/10 flex items-center gap-1.5">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse"></div>
                                                        {videoSettings.duration}s • {videoSettings.aspectRatio}
                                                    </div>
                                                </div>

                                                <div className="mt-3 flex items-center justify-between px-2 pb-1">
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                                            <Play className="w-2.5 h-2.5" /> Видео готово
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => item.id && onToggleSave(item.id)}
                                                            className={`flex items-center justify-center w-9 h-9 rounded-xl border transition-all active:scale-95 shadow-sm ${item.isSaved ? 'bg-red-50 border-red-200 text-red-500' : 'bg-white border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200'}`}
                                                            title={item.isSaved ? "Убрать из избранного" : "В избранное"}
                                                        >
                                                            <Heart className={`w-4 h-4 ${item.isSaved ? 'fill-red-500' : ''}`} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDownload(item.generated)}
                                                            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95"
                                                        >
                                                            <Download className="w-3.5 h-3.5" />
                                                            Скачать
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : isGenerating && idx === 0 ? (
                                            <div className="bg-white border border-slate-100 rounded-[20px] rounded-tl-[4px] px-6 py-4 flex items-center gap-4 w-fit shadow-md animate-pulse">
                                                <div className="flex gap-1.5">
                                                    <div className="w-2 h-2 rounded-full bg-pink-400 animate-bounce [animation-duration:0.6s]"></div>
                                                    <div className="w-2 h-2 rounded-full bg-pink-400 animate-bounce [animation-duration:0.6s] [animation-delay:-0.2s]"></div>
                                                    <div className="w-2 h-2 rounded-full bg-pink-400 animate-bounce [animation-duration:0.6s] [animation-delay:-0.4s]"></div>
                                                </div>
                                                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{status}</span>
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Current Loading Indicator (if no message yet) */}
                        {isGenerating && historyData.length === 0 && (
                            <div className="flex justify-start gap-4 animate-in slide-in-from-left-4">
                                <div className="w-8 h-8 rounded-full bg-pink-600 flex items-center justify-center shadow-md shrink-0">
                                    <Sparkles className="w-4 h-4 text-white" />
                                </div>
                                <div className="bg-white border border-slate-100 rounded-[20px] rounded-tl-[4px] px-6 py-4 flex items-center gap-4 w-fit shadow-md">
                                    <div className="w-5 h-5 border-2 border-pink-200 border-t-pink-600 rounded-full animate-spin"></div>
                                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-widest">{status}</span>
                                </div>
                            </div>
                        )}
                </div>
            </div>

            {/* Float Input Bar — на мобильном фиксирован снизу в стиле Telegram */}
            <div className="flex justify-center w-full px-3 md:px-8 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:pb-8 md:pt-4 md:absolute md:bottom-0 inset-x-0 md:bg-gradient-to-t md:from-brand-bg md:via-brand-bg/80 md:to-transparent pointer-events-none z-30 fixed bottom-0 left-0 right-0 md:relative md:pointer-events-none">
                <div className="relative w-full max-w-4xl">
                    {/* Компактные настройки — поповер над инпутом */}
                    {settingsOpen && (videoSettings.setDuration || videoSettings.setAspectRatio) && (
                        <>
                            <div className="absolute inset-0 -top-2 bottom-full z-10 pointer-events-auto" aria-hidden="true" onClick={() => setSettingsOpen(false)} />
                            <div className="absolute bottom-full left-0 right-0 mb-2 z-20 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 space-y-3 pointer-events-auto">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                    <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5"><Sliders className="w-3.5 h-3.5 text-pink-500" /> Параметры</span>
                                    <button type="button" onClick={() => setSettingsOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"><X className="w-4 h-4" /></button>
                                </div>
                                {videoSettings.setDuration && (
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">Длительность</p>
                                        <div className="flex gap-1.5 p-1 bg-slate-100 rounded-lg">
                                            <button onClick={() => videoSettings.setDuration?.('5')} className={`flex-1 py-1.5 text-[10px] font-bold rounded-md transition-all ${videoSettings.duration === '5' ? 'bg-white text-pink-600 shadow-sm' : 'text-slate-500'}`}>5 сек</button>
                                            <button onClick={() => videoSettings.setDuration?.('10')} className={`flex-1 py-1.5 text-[10px] font-bold rounded-md transition-all ${videoSettings.duration === '10' ? 'bg-white text-pink-600 shadow-sm' : 'text-slate-500'}`}>10 сек</button>
                                        </div>
                                    </div>
                                )}
                                {videoSettings.setAspectRatio && (
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">Формат</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {(['16:9', '9:16', '1:1'] as const).map(r => (
                                                <button key={r} onClick={() => videoSettings.setAspectRatio?.(r)} className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-all ${videoSettings.aspectRatio === r ? 'bg-pink-600 text-white border-pink-600' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>{r}</button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                                    {videoSettings.duration === '10' ? '180' : '90'} кр. за ролик
                                </div>
                            </div>
                        </>
                    )}
                <div className="bg-white md:bg-white/90 backdrop-blur-xl border border-slate-200 shadow-[0_-2px_12px_rgba(0,0,0,0.06)] md:shadow-2xl rounded-2xl md:rounded-[32px] p-2.5 md:p-3 flex items-center gap-2 md:gap-3 w-full pointer-events-auto ring-0 md:ring-1 ring-black/5 transition-all focus-within:ring-2 focus-within:ring-pink-400/30 md:focus-within:ring-4 md:focus-within:ring-purple-500/5 focus-within:border-pink-300 md:focus-within:border-purple-200">
                    <button
                        onClick={triggerFileSelect}
                        className={`p-3 md:p-4 rounded-xl md:rounded-[22px] transition-all relative shrink-0 ${attachedImage ? 'bg-pink-100 text-pink-600' : 'bg-slate-100 text-slate-500 hover:text-pink-600 hover:bg-pink-50'}`}
                        aria-label="Прикрепить фото"
                    >
                        <ImagePlus className="w-5 h-5 md:w-6 md:h-6" />
                        {attachedImage && (
                            <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-pink-600 text-white rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                                <X className="w-2.5 h-2.5 cursor-pointer" onClick={(e) => { e.stopPropagation(); setAttachedImage(null); }} />
                            </div>
                        )}
                    </button>

                    {(videoSettings.setDuration || videoSettings.setAspectRatio) && (
                        <button
                            type="button"
                            onClick={() => setSettingsOpen(!settingsOpen)}
                            className={`p-2.5 md:p-3 rounded-xl md:rounded-[22px] transition-all shrink-0 ${settingsOpen ? 'bg-pink-100 text-pink-600' : 'bg-slate-100 text-slate-500 hover:text-pink-600 hover:bg-pink-50'}`}
                            aria-label="Параметры"
                            title="Параметры"
                        >
                            <Sliders className="w-5 h-5 md:w-6 md:h-6" />
                        </button>
                    )}

                    <div className="flex-1 flex flex-col px-1 min-w-0">
                        <input
                            type="text"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && onGenerate()}
                            placeholder="Сообщение"
                            className="bg-transparent border-none outline-none text-slate-900 placeholder-slate-400 font-medium md:font-bold text-sm h-11 md:h-12"
                        />
                    </div>

                    <button
                        onClick={onGenerate}
                        disabled={isGenerating || (!prompt.trim() && !attachedImage)}
                        className="h-11 w-11 md:h-14 md:w-14 bg-[#2AABEE] hover:bg-[#229ED9] md:bg-slate-900 md:hover:bg-black text-white rounded-full md:rounded-[22px] flex items-center justify-center transition-all active:scale-95 disabled:opacity-50 shrink-0"
                        aria-label="Отправить"
                    >
                        {isGenerating ? (
                            <Loader2 className="w-5 h-5 md:w-5 md:h-5 animate-spin" />
                        ) : (
                            <Send className="w-5 h-5 md:w-5 md:h-5 rotate-0" />
                        )}
                    </button>

                    <div className="hidden sm:flex flex-col items-center pl-2 pr-1 border-l border-slate-100 h-10 justify-center">
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-50 rounded-full border border-amber-100 text-amber-700">
                            <Zap className="w-3 h-3 fill-amber-500 text-amber-500" />
                            <span className="text-[10px] font-bold">
                                {videoSettings.duration === '10' ? 180 : 90}
                            </span>
                        </div>
                    </div>
                </div>
                </div>
            </div>

            {/* Fullscreen Player Modal */}
            {selectedVideo && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={() => setSelectedVideo(null)} />
                    <button
                        onClick={() => setSelectedVideo(null)}
                        className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all z-[110]"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <div className="relative w-full max-w-6xl aspect-video bg-black rounded-[40px] overflow-hidden shadow-[0_0_100px_rgba(236,72,153,0.3)] ring-1 ring-white/10 z-[105]">
                        <video
                            src={selectedVideo}
                            className="w-full h-full object-contain"
                            controls
                            autoPlay
                        />
                    </div>

                    <div className="absolute bottom-10 inset-x-0 flex justify-center z-[110]">
                        <button
                            onClick={() => handleDownload(selectedVideo)}
                            className="flex items-center gap-3 px-10 py-4 bg-white text-black rounded-3xl font-bold hover:scale-105 active:scale-95 transition-all shadow-2xl"
                        >
                            <Download className="w-5 h-5" />
                            Скачать в высоком качестве
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AnimateInterface;
