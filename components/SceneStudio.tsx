import React, { useState } from 'react';
import { Loader2, Sparkles, ImagePlus, Video as VideoIcon } from 'lucide-react';
import { AspectRatio, GeneratedImage, ImageResolution } from '../types';
import { getDisplayPrompt } from '../lib/promptUtils';
import { KrasoModelId } from '../lib/krasoModels';
import GenerationBar from './GenerationBar';

interface SceneStudioProps {
    prompt: string;
    setPrompt: (v: string) => void;
    attachedImages: string[];
    setAttachedImages: (imgs: string[]) => void;
    triggerFileSelect: () => void;
    krasoModel: KrasoModelId;
    onKrasoModelChange: (m: KrasoModelId) => void;
    aspectRatio: AspectRatio;
    setAspectRatio: (r: AspectRatio) => void;
    resolution: ImageResolution;
    onResolutionChange: (r: ImageResolution) => void;
    isGenerating: boolean;
    onGenerate: (count: number) => void;
    historyData: GeneratedImage[];
    cost: number;
    error?: string | null;
    /** Pick a past result as a reference photo for the next generation. */
    onUseAsReference: (url: string) => void;
    /** Jump to the Video studio with this photo pre-attached. */
    onGenerateVideoFrom: (url: string) => void;
}

/** Photo studio: results grid + shared GenerationBar (same as Templates page). */
function SceneStudio(props: SceneStudioProps) {
    const {
        prompt, setPrompt, attachedImages, setAttachedImages, triggerFileSelect,
        krasoModel, onKrasoModelChange, aspectRatio, setAspectRatio, resolution, onResolutionChange,
        isGenerating, onGenerate, historyData, cost, error,
        onUseAsReference, onGenerateVideoFrom,
    } = props;

    const [batchCount, setBatchCount] = useState(1);

    const removeAttached = (i: number) => setAttachedImages(attachedImages.filter((_, idx) => idx !== i));

    return (
        <div className="flex-1 flex flex-col min-w-0 bg-background-light overflow-hidden relative">
            <div className="flex-1 overflow-y-auto custom-scrollbar pb-[calc(150px+env(safe-area-inset-bottom))]">
                {(isGenerating || historyData.length > 0) ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5" style={{ gap: '2px' }}>
                        {historyData.map((item, i) => {
                            const isPending = !item.generated;
                            const valid = !isPending && (item.generated.startsWith('http') || item.generated.startsWith('data:image') || item.generated.startsWith('blob:'));
                            if (isPending) {
                                return (
                                    <div key={item.id || `pending-${i}`} className="aspect-square overflow-hidden bg-surface-muted relative" aria-busy="true" aria-label="Генерация">
                                        <div className="absolute inset-0 motion-safe:animate-pulse motion-reduce:animate-none bg-surface-muted" />
                                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-ink-muted">
                                            <Loader2 className="w-6 h-6 animate-spin motion-reduce:animate-none text-primary" />
                                            <span className="text-xs text-pretty">Генерация…</span>
                                        </div>
                                    </div>
                                );
                            }
                            if (!valid) return null;
                            const displayPrompt = getDisplayPrompt(item);
                            return (
                                <div key={item.id || i} className="group relative aspect-square overflow-hidden bg-card-light">
                                    <img src={item.generated} alt={displayPrompt || 'Результат генерации'} loading="lazy" className="w-full h-full object-cover" />
                                    {displayPrompt && (
                                        <div className="absolute inset-x-0 bottom-0 p-2.5 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none motion-reduce:transition-none">
                                            <p className="text-white text-xs line-clamp-2 text-pretty">{displayPrompt}</p>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-start justify-end p-2 gap-1.5 opacity-0 group-hover:opacity-100 motion-reduce:transition-none">
                                        <button
                                            type="button"
                                            onClick={() => onUseAsReference(item.generated)}
                                            className="size-8 rounded-lg bg-black/70 text-white flex items-center justify-center hover:bg-primary hover:text-on-primary transition-colors"
                                            aria-label="Использовать как референс"
                                        >
                                            <ImagePlus className="w-4 h-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => onGenerateVideoFrom(item.generated)}
                                            className="size-8 rounded-lg bg-black/70 text-white flex items-center justify-center hover:bg-primary hover:text-on-primary transition-colors"
                                            aria-label="Сгенерировать видео"
                                        >
                                            <VideoIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 text-center text-ink-muted px-4">
                        <div className="size-16 rounded-2xl bg-surface-muted flex items-center justify-center mb-4">
                            <Sparkles className="w-7 h-7 text-primary" />
                        </div>
                        <h2 className="text-base font-semibold text-ink text-balance mb-1">Опишите сцену</h2>
                        <p className="text-sm max-w-xs text-pretty mb-4">Введите идею внизу и нажмите «Создать». Результаты появятся здесь.</p>
                        <button type="button" onClick={triggerFileSelect} className="text-sm font-medium text-primary hover:underline">
                            Добавить фото
                        </button>
                    </div>
                )}
            </div>

            <div className="absolute bottom-0 inset-x-0 pointer-events-none">
                <GenerationBar
                    prompt={prompt}
                    onPromptChange={setPrompt}
                    aspectRatio={aspectRatio}
                    onAspectRatioChange={setAspectRatio}
                    krasoModel={krasoModel}
                    onKrasoModelChange={onKrasoModelChange}
                    resolution={resolution}
                    onResolutionChange={onResolutionChange}
                    selectedTemplate={null}
                    onClearTemplate={() => {}}
                    hasSourceImage={attachedImages.length > 0}
                    onAddImageClick={triggerFileSelect}
                    sourceImages={attachedImages}
                    onRemoveSourceImage={removeAttached}
                    onGenerate={onGenerate}
                    isGenerating={isGenerating}
                    cost={cost}
                    batchCount={batchCount}
                    onBatchCountChange={setBatchCount}
                    error={error}
                    promptPlaceholder="Опишите сцену или загрузите фото…"
                />
            </div>
        </div>
    );
}

export default SceneStudio;
