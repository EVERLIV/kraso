
import React, { useRef, useEffect, useState } from 'react';
import {
    Bot, Download, Maximize, X, Loader2, User, Sparkles, Send, ImagePlus, Zap, Heart,
    Info, ChevronDown, ChevronUp, Sliders, Cpu
} from 'lucide-react';
import { GeneratedImage, GenModelId, AspectRatio } from '../types';

interface ChatInterfaceProps {
    credits: number;
    userId?: string;
    onOpenPricing: () => void;
    settings: {
        quality: 'low' | 'medium' | 'high';
        format: 'jpeg' | 'png';
        aspectRatio: AspectRatio;
        model?: GenModelId;
        setModel?: (m: GenModelId) => void;
        setQuality?: (q: 'low' | 'medium' | 'high') => void;
        setFormat?: (f: 'jpeg' | 'png') => void;
        setAspectRatio?: (r: AspectRatio) => void;
    };
    prompt: string;
    setPrompt: (p: string) => void;
    attachedImages: string[];
    setAttachedImages: (imgs: string[]) => void;
    isGenerating: boolean;
    historyData: GeneratedImage[];
    onGenerate: () => void;
    triggerFileSelect: () => void;
    onToggleSave: (id: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
    credits,
    userId,
    onOpenPricing,
    settings,
    prompt,
    setPrompt,
    attachedImages,
    setAttachedImages,
    isGenerating,
    historyData,
    onGenerate,
    triggerFileSelect,
    onToggleSave
}) => {
    const chatEndRef = useRef<HTMLDivElement>(null);
    const [viewingImage, setViewingImage] = useState<string | null>(null);
    const [infoExpanded, setInfoExpanded] = useState(true);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const settingsRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom when history changes or generation starts
    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [historyData, isGenerating]);

    return (
        <div className="flex flex-col h-full w-full bg-brand-bg relative overflow-hidden font-sans min-h-0">
            {/* Main Stream Area — на мобильном больше отступ снизу под инпут в стиле чата */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-4 md:py-10 md:px-10 space-y-12 pb-[5.5rem] md:pb-36 min-h-0">
                {/* Инструкции — всегда сверху */}
                <div className="max-w-2xl mx-auto">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 md:w-14 md:h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center shrink-0 border border-purple-500/20">
                            <Bot className="w-6 h-6 md:w-7 md:h-7 text-purple-500" />
                        </div>
                        <div>
                            <h2 className="text-lg md:text-xl font-bold text-slate-800">AI Studio: Генерация изображений</h2>
                            <p className="text-slate-600 text-xs md:text-sm max-w-md">
                                Текст + референс — нейросеть сохранит лицо/интерьер/продукт и дорисует сцену.
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
                                <Info className="w-4 h-4 text-purple-500" />
                                Как пользоваться
                            </span>
                            {infoExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                        </button>
                        {infoExpanded && (
                            <div className="px-5 pb-5 pt-0 space-y-4 border-t border-slate-100">
                                <div className="flex gap-3 pt-4">
                                    <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 font-bold text-sm">1</div>
                                    <div>
                                        <p className="font-medium text-slate-800 text-sm">Опишите картинку</p>
                                        <p className="text-slate-500 text-xs mt-0.5">Например: «Портрет в стиле ретро, мягкий свет» или «Комната с окном на закат».</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 font-bold text-sm">2</div>
                                    <div>
                                        <p className="font-medium text-slate-800 text-sm">Добавьте референс (по желанию)</p>
                                        <p className="text-slate-500 text-xs mt-0.5">Кнопка с иконкой фото — загрузите лицо, интерьер или продукт.</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 font-bold text-sm">3</div>
                                    <div>
                                        <p className="font-medium text-slate-800 text-sm">Нажмите «Отправить»</p>
                                        <p className="text-slate-500 text-xs mt-0.5">Генерация займёт несколько секунд. Скачать или в избранное.</p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2 pt-2">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
                                        <Sliders className="w-3 h-3" /> «Интенсивность» в настройках
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-medium">
                                        <Zap className="w-3 h-3" /> 15 кредитов за изображение
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
                                {/* USER MESSAGE */}
                                <div className="flex justify-end gap-3">
                                    <div className="flex flex-col items-end gap-2 max-w-[85%]">
                                        <div className="bg-slate-900 text-white rounded-[24px] rounded-tr-[4px] p-4 shadow-xl border border-slate-800">
                                            <div className="flex flex-col gap-4">
                                                {item.original && (
                                                    <div className="relative group w-48 aspect-square rounded-xl overflow-hidden border border-white/10 shadow-lg">
                                                        <img src={item.original} className="w-full h-full object-cover" />
                                                    </div>
                                                )}
                                                <p className="text-sm font-medium leading-relaxed">{item.prompt || "Запрос изображения"}</p>
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

                                {/* AI RESPONSE */}
                                <div className="flex justify-start gap-3">
                                    <div className="flex flex-col items-start gap-2 max-w-[95%] w-full">
                                        <div className="flex items-center gap-2 px-1">
                                            <div className="w-7 h-7 rounded-full bg-purple-600 border border-purple-400 shadow-md flex items-center justify-center">
                                                <Sparkles className="w-3.5 h-3.5 text-white" />
                                            </div>
                                            <span className="text-[10px] font-bold text-purple-600 uppercase tracking-widest">GPT Image 1.5</span>
                                        </div>

                                        {item.generated ? (
                                            <div className="w-full bg-white border border-slate-100 rounded-[28px] rounded-tl-[4px] p-3 shadow-xl group/card relative overflow-hidden max-w-fit">
                                                <div className="relative rounded-2xl overflow-hidden bg-slate-50 shadow-inner ring-1 ring-black/5 group/img">
                                                    <img
                                                        src={item.generated}
                                                        alt="AI Result"
                                                        className="max-w-full md:max-w-2xl max-h-[600px] object-contain cursor-zoom-in transition-transform group-hover/img:scale-[1.01]"
                                                        onClick={() => setViewingImage(item.generated)}
                                                        onError={(e) => {
                                                            console.warn("Failed to load chat image:", item.id, item.generated?.substring(0, 50));
                                                            const parent = e.currentTarget.parentElement?.parentElement;
                                                            if (parent) {
                                                                parent.innerHTML = '<div class="p-4 text-center text-slate-500 text-sm">Ошибка загрузки изображения</div>';
                                                            }
                                                        }}
                                                    />
                                                    <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/5 transition-colors flex items-center justify-center pointer-events-none">
                                                        <Maximize className="text-white opacity-0 group-hover/img:opacity-100 w-8 h-8 drop-shadow-lg" />
                                                    </div>

                                                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover/img:opacity-100 transition-all translate-x-2 group-hover/img:translate-x-0">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                if (item.id) onToggleSave(item.id);
                                                            }}
                                                            className={`h-9 w-9 flex items-center justify-center rounded-full bg-white shadow-lg border border-slate-100 hover:scale-110 transition-all ${item.isSaved ? 'text-red-500' : 'text-slate-600 hover:text-red-500'}`}
                                                            title={item.isSaved ? "Убрать из избранного" : "В избранное"}
                                                        >
                                                            <Heart className={`w-4 h-4 ${item.isSaved ? 'fill-red-500' : ''}`} />
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                const link = document.createElement('a');
                                                                link.href = item.generated!;
                                                                link.download = `photo-smart-${Date.now()}.jpg`;
                                                                link.click();
                                                            }}
                                                            className="h-9 w-9 flex items-center justify-center rounded-full bg-white shadow-lg border border-slate-100 text-slate-600 hover:text-purple-600 hover:scale-110 transition-all"
                                                        >
                                                            <Download className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : isGenerating && idx === 0 ? (
                                            <div className="bg-white border border-slate-100 rounded-[20px] rounded-tl-[4px] px-6 py-4 flex items-center gap-4 w-fit shadow-md">
                                                <div className="flex gap-1.5">
                                                    <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce [animation-duration:0.6s]"></div>
                                                    <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce [animation-duration:0.6s] [animation-delay:-0.2s]"></div>
                                                    <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce [animation-duration:0.6s] [animation-delay:-0.4s]"></div>
                                                </div>
                                                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Создаю шедевр...</span>
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div ref={chatEndRef} className="h-4" />
                </div>
            </div>

            {/* Float Input Bar — на мобильном фиксирован снизу в стиле Telegram */}
            <div ref={settingsRef} className="flex justify-center w-full px-3 md:px-8 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:pb-8 md:pt-4 md:absolute md:bottom-0 inset-x-0 md:bg-gradient-to-t md:from-brand-bg md:via-brand-bg/80 md:to-transparent pointer-events-none z-30 fixed bottom-0 left-0 right-0 md:relative md:pointer-events-none">
                <div className="relative w-full max-w-4xl">
                    {/* Компактные настройки — поповер над инпутом */}
                    {settingsOpen && (settings.setModel || settings.setAspectRatio || settings.setQuality || settings.setFormat) && (
                        <>
                            <div className="absolute inset-0 -top-2 bottom-full z-10 pointer-events-auto" aria-hidden="true" onClick={() => setSettingsOpen(false)} />
                            <div className="absolute bottom-full left-0 right-0 mb-2 z-20 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 space-y-3 max-h-[70vh] overflow-y-auto pointer-events-auto">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                    <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5"><Sliders className="w-3.5 h-3.5 text-purple-500" /> Параметры</span>
                                    <button type="button" onClick={() => setSettingsOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"><X className="w-4 h-4" /></button>
                                </div>
                                {settings.setModel && (
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">Модель</p>
                                        <div className="flex gap-1.5">
                                            {([
                                                { id: 'gemini-2.5-flash-image' as GenModelId, label: 'Flash', icon: Zap },
                                                { id: 'gemini-3-pro-image-preview' as GenModelId, label: 'Pro', icon: Cpu },
                                                { id: 'nano-banana-v1' as GenModelId, label: 'Nano', icon: Bot },
                                            ]).map(m => (
                                                <button key={m.id} onClick={() => { settings.setModel?.(m.id); }} className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${settings.model === m.id ? 'bg-purple-100 border-purple-300 text-purple-700' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                                                    <m.icon className="w-3 h-3" /> {m.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {settings.setAspectRatio && (
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">Формат</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {(['1:1', '4:5', '9:16', '16:9'] as AspectRatio[]).map(r => (
                                                <button key={r} onClick={() => settings.setAspectRatio?.(r)} className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-all ${settings.aspectRatio === r ? 'bg-purple-600 text-white border-purple-600' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>{r}</button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {settings.setQuality && (
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">Качество</p>
                                        <div className="flex gap-1 p-1 bg-slate-100 rounded-lg">
                                            {(['low', 'medium', 'high'] as const).map(q => (
                                                <button key={q} onClick={() => settings.setQuality?.(q)} className={`flex-1 py-1 text-[10px] font-bold rounded-md transition-all ${settings.quality === q ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-500'}`}>{q === 'low' ? 'Низ' : q === 'medium' ? 'Сред' : 'Выс'}</button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {settings.setFormat && (
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">Файл</p>
                                        <div className="flex gap-1.5">
                                            <button onClick={() => settings.setFormat?.('jpeg')} className={`flex-1 py-1 rounded-lg text-[10px] font-bold border ${settings.format === 'jpeg' ? 'bg-purple-100 border-purple-300 text-purple-700' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>JPEG</button>
                                            <button onClick={() => settings.setFormat?.('png')} className={`flex-1 py-1 rounded-lg text-[10px] font-bold border ${settings.format === 'png' ? 'bg-purple-100 border-purple-300 text-purple-700' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>PNG</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                <div className="bg-white md:bg-white/90 backdrop-blur-xl border border-slate-200 shadow-[0_-2px_12px_rgba(0,0,0,0.06)] md:shadow-2xl rounded-2xl md:rounded-[32px] p-2.5 md:p-3 flex items-center gap-2 md:gap-3 w-full pointer-events-auto ring-0 md:ring-1 ring-black/5 transition-all focus-within:ring-2 focus-within:ring-purple-400/30 md:focus-within:ring-4 md:focus-within:ring-purple-500/5 focus-within:border-purple-300 md:focus-within:border-purple-200">
                    <button
                        onClick={triggerFileSelect}
                        className={`p-3 md:p-4 rounded-xl md:rounded-[22px] transition-all relative shrink-0 ${attachedImages.length > 0 ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-500 hover:text-purple-600 hover:bg-purple-50'}`}
                        aria-label="Прикрепить фото"
                    >
                        <ImagePlus className="w-5 h-5 md:w-6 md:h-6" />
                        {attachedImages.length > 0 && (
                            <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-purple-600 text-white rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                                <X className="w-2.5 h-2.5 cursor-pointer" onClick={(e) => { e.stopPropagation(); setAttachedImages([]); }} />
                            </div>
                        )}
                    </button>

                    {(settings.setModel || settings.setAspectRatio || settings.setQuality || settings.setFormat) && (
                        <button
                            type="button"
                            onClick={() => setSettingsOpen(!settingsOpen)}
                            className={`p-2.5 md:p-3 rounded-xl md:rounded-[22px] transition-all shrink-0 ${settingsOpen ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-500 hover:text-purple-600 hover:bg-purple-50'}`}
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
                        disabled={isGenerating || (!prompt.trim() && attachedImages.length === 0)}
                        className="h-11 w-11 md:h-14 md:w-14 bg-[#2AABEE] hover:bg-[#229ED9] md:bg-slate-900 md:hover:bg-black text-white rounded-full md:rounded-[22px] flex items-center justify-center transition-all active:scale-95 disabled:opacity-50 shrink-0"
                        aria-label="Отправить"
                    >
                        {isGenerating ? (
                            <Loader2 className="w-5 h-5 md:w-5 md:h-5 animate-spin" />
                        ) : (
                            <Send className="w-5 h-5 md:w-5 md:h-5 rotate-0" />
                        )}
                    </button>

                    <div className="hidden md:flex flex-col items-center pl-2 pr-1 border-l border-slate-100 h-10 justify-center">
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 rounded-full border border-amber-100 text-amber-700">
                            <Zap className="w-3 h-3 fill-amber-500 text-amber-500" />
                            <span className="text-[10px] font-bold">15</span>
                        </div>
                    </div>
                </div>
                </div>
            </div>

            {/* FULLSCREEN IMAGE MODAL */}
            {viewingImage && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/95 backdrop-blur-md p-4 md:p-10 animate-in fade-in duration-300" onClick={() => setViewingImage(null)}>
                    <div className="relative max-w-full max-h-full flex flex-col items-center gap-6" onClick={e => e.stopPropagation()}>
                        <div className="relative group">
                            <img src={viewingImage} className="max-w-[90vw] max-h-[80vh] object-contain rounded-2xl shadow-2xl border-4 border-white" />
                            <button
                                className="absolute -top-12 right-0 p-2 text-white/50 hover:text-white transition-colors"
                                onClick={() => setViewingImage(null)}
                            >
                                <X className="w-8 h-8" />
                            </button>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => {
                                    const link = document.createElement('a');
                                    link.href = viewingImage;
                                    link.download = `photo-smart-${Date.now()}.jpg`;
                                    link.click();
                                }}
                                className="flex items-center gap-3 px-8 py-4 bg-white text-slate-900 rounded-2xl font-bold shadow-2xl hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all"
                            >
                                <Download className="w-5 h-5" /> Скачать оригинал
                            </button>
                            <button
                                onClick={() => setViewingImage(null)}
                                className="px-8 py-4 bg-white/10 text-white rounded-2xl font-bold backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all font-bold"
                            >
                                Закрыть
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatInterface;
