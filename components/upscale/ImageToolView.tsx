import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Upload, Download, Loader2, Plus, ScanEye } from 'lucide-react';
import BeforeAfterCompare from './BeforeAfterCompare';
import { ImageToolConfig } from '../../lib/imageToolConfig';
import { generateImageWithGemini, cleanBase64, getMimeType } from '../../services/geminiService';
import { uploadImageToStorage, saveGenerationToHistory, deductCredits, getUserHistory } from '../../services/firebaseService';
import { useAuth } from '../../contexts/AuthContext';
import { GeneratedImage } from '../../types';
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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [history, setHistory] = useState<GeneratedImage[]>([]);
    const [activeHistoryId, setActiveHistoryId] = useState<string | null>(null);

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
            setActiveHistoryId(null);
            setError(null);
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    };

    const selectHistoryItem = (item: GeneratedImage) => {
        if (item.original) setImage(item.original);
        if (item.generated) setResult(item.generated);
        setActiveHistoryId(item.id ?? null);
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
            const prompt = config.buildPrompt();
            const refs = [{ data: cleanBase64(image), mimeType: getMimeType(image) }];
            const generatedData = await generateImageWithGemini(prompt, refs, '1:1');
            setResult(generatedData);
            setActiveHistoryId(null);

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
        <div className="it-root flex-1 flex min-h-0 overflow-hidden relative">
            <input type="file" ref={fileRef} className="hidden" accept="image/*" onChange={handleFileUpload} />

            <aside className="it-rail hidden sm:flex" aria-label="История">
                <button
                    type="button"
                    onClick={pickFile}
                    aria-label="Загрузить изображение"
                    className="it-rail__add"
                >
                    <Plus className="size-5" strokeWidth={1.75} />
                </button>
                <div className="it-rail__scroll custom-scrollbar">
                    {history.map((item, i) => {
                        const key = item.id || String(i);
                        const active = activeHistoryId === item.id;
                        return (
                            <button
                                key={key}
                                type="button"
                                onClick={() => selectHistoryItem(item)}
                                aria-label="Открыть из истории"
                                className={`it-rail__thumb ${active ? 'it-rail__thumb--active' : ''}`}
                            >
                                <img src={item.generated || item.original} alt="" className="size-full object-cover" />
                            </button>
                        );
                    })}
                </div>
            </aside>

            <div className="it-stage">
                <div className="it-mobile-rail sm:hidden" aria-label="История">
                    <button type="button" onClick={pickFile} aria-label="Загрузить" className="it-mobile-rail__btn">
                        <Plus className="size-5" strokeWidth={1.75} />
                    </button>
                    {history.map((item, i) => {
                        const active = activeHistoryId === item.id;
                        return (
                            <button
                                key={item.id || i}
                                type="button"
                                onClick={() => selectHistoryItem(item)}
                                aria-label="Открыть из истории"
                                className={`it-mobile-rail__thumb ${active ? 'it-mobile-rail__thumb--active' : ''}`}
                            >
                                <img src={item.generated || item.original} alt="" className="size-full object-cover" />
                            </button>
                        );
                    })}
                </div>

                <div className="it-workspace">
                    <div className="it-canvas">
                        <div className="it-workspace__media">
                            {hasImage && result ? (
                                <BeforeAfterCompare before={compareBefore} after={compareAfter} />
                            ) : hasImage ? (
                                <div className="it-preview">
                                    <img src={image!} alt="" />
                                    {loading && (
                                        <div className="it-preview__overlay">
                                            <Loader2 className="size-7 motion-safe:animate-spin motion-reduce:animate-none" />
                                            <span className="text-sm text-pretty">Обрабатываем…</span>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <BeforeAfterCompare before={config.demoBefore} after={config.demoAfter} />
                            )}
                        </div>
                    </div>

                    <div className="it-panel">
                        <div className="it-copy">
                            <h1 className="it-title">{config.title}</h1>
                            <p className="it-desc">{config.description}</p>
                        </div>

                        <div className="it-actions">
                            {!hasImage ? (
                                <button type="button" onClick={pickFile} className="it-btn-primary">
                                    <Upload className="size-4" />
                                    Загрузить медиа
                                </button>
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        onClick={handleProcess}
                                        disabled={loading}
                                        className="it-btn-primary"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="size-4 motion-safe:animate-spin motion-reduce:animate-none" />
                                                Обработка…
                                            </>
                                        ) : (
                                            <>
                                                <ScanEye className="size-4" />
                                                {config.actionLabel} · {config.cost} кр
                                            </>
                                        )}
                                    </button>
                                    <div className="it-actions it-actions--secondary">
                                        {result && (
                                            <button type="button" onClick={handleDownload} className="it-btn-link gap-1.5">
                                                <Download className="size-3.5" />
                                                Скачать
                                            </button>
                                        )}
                                        <button type="button" onClick={pickFile} className="it-btn-link">
                                            Другое фото
                                        </button>
                                    </div>
                                </>
                            )}
                            {error && <p className="it-error" role="alert">{error}</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ImageToolView;
