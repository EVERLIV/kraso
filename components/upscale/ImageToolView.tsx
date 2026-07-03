import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Upload, Download, Loader2, Plus, ScanEye } from 'lucide-react';
import BeforeAfterCompare from './BeforeAfterCompare';
import { ImageToolConfig } from '../../lib/imageToolConfig';
import { generateImageWithGemini, cleanBase64, getMimeType } from '../../services/geminiService';
import { uploadImageToStorage, saveGenerationToHistory, deductCredits, getUserHistory } from '../../services/firebaseService';
import { useAuth } from '../../contexts/AuthContext';
import { GeneratedImage } from '../../types';
import '../marketing/marketingTheme.css';
import './upscaleTheme.css';

interface ImageToolViewProps {
    config: ImageToolConfig;
    credits: number;
    onUpdateCredits: (val: number) => void;
    initialImage?: string | null;
}

function ImageToolView({ config, credits, onUpdateCredits, initialImage }: ImageToolViewProps) {
    const { user } = useAuth();
    const fileRef = useRef<HTMLInputElement>(null);

    const [image, setImage] = useState<string | null>(initialImage ?? null);
    const [result, setResult] = useState<string | null>(null);
    const [recolorPrompt, setRecolorPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [history, setHistory] = useState<GeneratedImage[]>([]);

    useEffect(() => {
        if (initialImage) setImage(initialImage);
    }, [initialImage]);

    const loadHistory = useCallback(async () => {
        if (!user) return;
        const all = await getUserHistory(user.uid);
        setHistory(
            all
                .filter(item => (item.prompt || '').includes(config.historyTag) || item.source === config.source)
                .slice(0, 12),
        );
    }, [user, config.historyTag, config.source]);

    useEffect(() => { loadHistory(); }, [loadHistory]);

    const pickFile = () => fileRef.current?.click();

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => {
            setImage(ev.target?.result as string);
            setResult(null);
            setError(null);
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    };

    const selectHistoryItem = (item: GeneratedImage) => {
        if (item.original) setImage(item.original);
        if (item.generated) setResult(item.generated);
        setError(null);
    };

    const handleProcess = async () => {
        if (!image || !user) return;
        if (credits < config.cost) {
            setError(`Недостаточно кредитов (${config.cost} кр)`);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const prompt = config.buildPrompt(recolorPrompt);
            const refs = [{ data: cleanBase64(image), mimeType: getMimeType(image) }];
            const generatedData = await generateImageWithGemini(prompt, refs, '1:1');
            setResult(generatedData);

            await deductCredits(user.uid, config.cost);
            onUpdateCredits(credits - config.cost);

            const storageUrl = await uploadImageToStorage(user.uid, generatedData, 'generated');
            await saveGenerationToHistory(user.uid, {
                original: image,
                generated: storageUrl,
                prompt: `${config.historyTag} ${prompt}`,
                source: config.source,
            });
            await loadHistory();
        } catch (err) {
            console.error(err);
            setError('Ошибка обработки. Попробуйте ещё раз.');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        if (!result) return;
        const link = document.createElement('a');
        link.href = result;
        link.download = `${config.downloadPrefix}-${Date.now()}.jpg`;
        link.click();
    };

    const hasImage = Boolean(image);
    const compareBefore = image || config.demoBefore;
    const compareAfter = result || image || config.demoAfter;

    return (
        <div className="ms up-root flex-1 flex min-h-0 overflow-hidden bg-black">
            <input type="file" ref={fileRef} className="hidden" accept="image/*" onChange={handleFileUpload} />

            {/* Плавающая колонка истории — без разделителя */}
            <aside className="hidden sm:flex w-16 shrink-0 flex-col items-center py-5 gap-3">
                <button
                    type="button"
                    onClick={pickFile}
                    aria-label="Загрузить изображение"
                    className="size-11 rounded-xl border border-white/12 bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors duration-100"
                >
                    <Plus className="size-5 text-white/80" />
                </button>
                <div className="flex-1 w-full overflow-y-auto custom-scrollbar px-2 space-y-2">
                    {history.map((item, i) => (
                        <button
                            key={item.id || i}
                            type="button"
                            onClick={() => selectHistoryItem(item)}
                            className="block w-full aspect-square rounded-[10px] overflow-hidden border border-white/10 hover:border-white/25 transition-colors duration-100"
                        >
                            <img src={item.generated || item.original} alt="" className="size-full object-cover" />
                        </button>
                    ))}
                </div>
            </aside>

            <div className="flex-1 flex items-center justify-center min-w-0 p-4 md:p-8">
                <div className="w-full max-w-[420px]">
                    <div className="up-frame flex flex-col items-center gap-6 p-6 md:p-8">
                        {hasImage && result ? (
                            <BeforeAfterCompare before={compareBefore} after={compareAfter} />
                        ) : hasImage ? (
                            <div className="relative w-full aspect-[3/4] max-h-[min(60dvh,480px)] rounded-[14px] overflow-hidden">
                                <img src={image!} alt="" className="size-full object-cover" />
                                {loading && (
                                    <div className="absolute inset-0 bg-black/55 flex flex-col items-center justify-center gap-2 text-white">
                                        <Loader2 className="size-7 motion-safe:animate-spin motion-reduce:animate-none" />
                                        <span className="text-sm text-pretty">Обрабатываем…</span>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <BeforeAfterCompare before={config.demoBefore} after={config.demoAfter} />
                        )}

                        <div className="text-center w-full">
                            <h1 className="ms-font-display text-xl md:text-[1.65rem] text-white text-balance uppercase">
                                {config.title}
                            </h1>
                            <p className="text-sm text-white/55 mt-2 text-pretty max-w-sm mx-auto leading-relaxed">
                                {config.description}
                            </p>
                        </div>

                        {config.showRecolorInput && hasImage && (
                            <div className="w-full max-w-xs">
                                <label className="sr-only" htmlFor={`${config.id}-recolor`}>Описание цветов</label>
                                <textarea
                                    id={`${config.id}-recolor`}
                                    value={recolorPrompt}
                                    onChange={e => setRecolorPrompt(e.target.value)}
                                    placeholder="Например: неоновые киберпанк-тона…"
                                    rows={2}
                                    className="w-full bg-white/5 border border-white/12 rounded-[12px] p-3 text-sm text-white placeholder:text-white/35 outline-none resize-none focus:border-white/25"
                                />
                            </div>
                        )}

                        {!hasImage ? (
                            <button
                                type="button"
                                onClick={pickFile}
                                className="w-full max-w-[240px] bg-white text-black font-bold py-3 px-6 rounded-full inline-flex items-center justify-center gap-2 hover:bg-white/90 transition-colors duration-100"
                            >
                                <Upload className="size-4" />
                                Загрузить медиа
                            </button>
                        ) : (
                            <div className="w-full max-w-[240px] space-y-2">
                                <button
                                    type="button"
                                    onClick={handleProcess}
                                    disabled={loading}
                                    className="w-full bg-white text-black font-bold py-3 px-6 rounded-full inline-flex items-center justify-center gap-2 hover:bg-white/90 transition-colors duration-100 disabled:opacity-50"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="size-4 motion-safe:animate-spin motion-reduce:animate-none" />
                                            Обработка…
                                        </>
                                    ) : (
                                        <>
                                            <ScanEye className="size-4" />
                                            {config.actionLabel} · <span className="tabular-nums">{config.cost} кр</span>
                                        </>
                                    )}
                                </button>
                                {result && (
                                    <button
                                        type="button"
                                        onClick={handleDownload}
                                        className="w-full border border-white/20 text-white font-semibold py-2.5 px-5 rounded-full inline-flex items-center justify-center gap-2 hover:bg-white/5 transition-colors duration-100 text-sm"
                                    >
                                        <Download className="size-4" />
                                        Скачать
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={pickFile}
                                    className="w-full text-white/55 text-sm py-1 hover:text-white/80 transition-colors duration-100"
                                >
                                    Другое фото
                                </button>
                            </div>
                        )}

                        {error && (
                            <p className="text-xs text-red-400 text-pretty text-center w-full" role="alert">
                                {error}
                            </p>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={pickFile}
                        className="sm:hidden mt-4 w-full border border-white/20 text-white font-semibold py-2.5 rounded-full inline-flex items-center justify-center gap-2 text-sm"
                    >
                        <Upload className="size-4" />
                        Загрузить медиа
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ImageToolView;
