import React, { useState } from 'react';
import { FolderHeart, LayoutGrid, List } from 'lucide-react';
import { GeneratedImage } from '../types';
import { KrasoModelId } from '../lib/krasoModels';
import { VideoVariantId } from '../lib/videoModels';
import { VideoMotionPreset } from '../lib/videoPresets';
import { GEN_BAR_FORM, GEN_BAR_R } from './genbar/genBarStyles';
import VideoStudioSidebar, { VideoQuality } from './video/VideoStudioSidebar';
import VideoOnboarding from './video/VideoOnboarding';
import VideoPresetPicker from './video/VideoPresetPicker';
import VideoHistoryPanel, { VideoHistoryLayout } from './video/VideoHistoryPanel';
import './video/videoTheme.css';

type VideoRatio = '16:9' | '9:16';
type MainTab = 'how' | 'history';

interface VideoStudioProps {
    prompt: string;
    setPrompt: (v: string) => void;
    attachedImage: string | null;
    setAttachedImage: (v: string | null) => void;
    triggerFileSelect: () => void;
    aspectRatio: VideoRatio;
    setAspectRatio: (r: VideoRatio) => void;
    krasoModel: KrasoModelId;
    onKrasoModelChange: (m: KrasoModelId) => void;
    variant: VideoVariantId;
    onVariantChange: (v: VideoVariantId) => void;
    duration: number;
    onDurationChange: (d: number) => void;
    quality: VideoQuality;
    onQualityChange: (q: VideoQuality) => void;
    promptEnhanceEnabled: boolean;
    onPromptEnhanceChange: (enabled: boolean) => void;
    isEnhancingPrompt: boolean;
    onEnhancePrompt: () => void;
    selectedPreset: VideoMotionPreset | null;
    onSelectPreset: (preset: VideoMotionPreset | null) => void;
    isGenerating: boolean;
    status?: string;
    onGenerate: () => void;
    historyData: GeneratedImage[];
    cost: number;
    error?: string | null;
}

function HistoryTabBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold ${GEN_BAR_R} transition-colors ${
        active ? 'bg-surface-raised text-ink' : 'text-ink-muted hover:text-ink hover:bg-surface-raised'
      }`}
    >
      {children}
    </button>
  );
}

function VideoStudio(props: VideoStudioProps) {
    const {
        prompt, setPrompt, attachedImage, setAttachedImage, triggerFileSelect,
        aspectRatio, setAspectRatio,
        krasoModel, onKrasoModelChange, variant, onVariantChange, selectedPreset, onSelectPreset,
        duration, onDurationChange, quality, onQualityChange,
        promptEnhanceEnabled, onPromptEnhanceChange, isEnhancingPrompt, onEnhancePrompt,
        isGenerating, status, onGenerate, historyData, cost, error,
    } = props;

    const [mainTab, setMainTab] = useState<MainTab>('history');
    const [showPresets, setShowPresets] = useState(false);
    const [historyLayout, setHistoryLayout] = useState<VideoHistoryLayout>('grid');
    const [gridCols, setGridCols] = useState(4);

    const handleSelectPreset = (preset: VideoMotionPreset) => {
        onSelectPreset(preset);
        setShowPresets(false);
    };

    const openPresets = () => setShowPresets(true);

    return (
        <div className="video-studio flex-1 flex flex-col min-h-0 overflow-hidden bg-background-light">
        <div className="vs-shell w-full max-w-[1440px] mx-auto flex flex-col md:flex-row flex-1 min-h-0 gap-3 md:gap-5 p-3 md:p-5">
            <div className="vs-control-column shrink-0 self-start">
                <VideoStudioSidebar
                    prompt={prompt}
                    setPrompt={setPrompt}
                    attachedImage={attachedImage}
                    onUpload={triggerFileSelect}
                    onClearImage={() => setAttachedImage(null)}
                    selectedPreset={selectedPreset}
                    onOpenPresets={openPresets}
                    onClearPreset={() => onSelectPreset(null)}
                    krasoModel={krasoModel}
                    onKrasoModelChange={onKrasoModelChange}
                    variant={variant}
                    onVariantChange={onVariantChange}
                    duration={duration}
                    onDurationChange={onDurationChange}
                    quality={quality}
                    onQualityChange={onQualityChange}
                    aspectRatio={aspectRatio}
                    onAspectRatioChange={setAspectRatio}
                    promptEnhanceEnabled={promptEnhanceEnabled}
                    onPromptEnhanceChange={onPromptEnhanceChange}
                    isEnhancingPrompt={isEnhancingPrompt}
                    onEnhancePrompt={onEnhancePrompt}
                    cost={cost}
                    isGenerating={isGenerating}
                    onGenerate={() => {
                        onGenerate();
                        setMainTab('history');
                    }}
                    error={error}
                />
            </div>

            <div className="vs-workspace flex-1 flex flex-col min-w-0 min-h-0">
                {showPresets ? (
                    <VideoPresetPicker
                        selectedId={selectedPreset?.id}
                        onSelect={handleSelectPreset}
                        onBack={() => setShowPresets(false)}
                    />
                ) : (
                    <>
                        <header className="shrink-0 flex items-center justify-between gap-3 pb-3 md:pb-4 flex-wrap">
                            <div className={`${GEN_BAR_FORM} !p-1.5 w-fit inline-flex items-center gap-1 shrink-0`}>
                                <HistoryTabBtn active={mainTab === 'history'} onClick={() => setMainTab('history')}>
                                    <FolderHeart className="size-3.5" />
                                    История
                                </HistoryTabBtn>
                                <HistoryTabBtn active={mainTab === 'how'} onClick={() => setMainTab('how')}>
                                    Как это работает
                                </HistoryTabBtn>
                            </div>

                            {mainTab === 'history' && (
                                <div className="flex items-center gap-3 ml-auto">
                                    <input
                                        type="range"
                                        min={2}
                                        max={6}
                                        value={8 - gridCols}
                                        onChange={(e) => setGridCols(8 - Number(e.target.value))}
                                        className="vs-thumb-slider hidden sm:block"
                                        aria-label="Размер превью"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setHistoryLayout('list')}
                                        className={`inline-flex items-center gap-1 text-xs font-semibold ${historyLayout === 'list' ? 'text-ink' : 'text-ink-muted hover:text-ink'}`}
                                    >
                                        <List className="size-3.5" />
                                        Список
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setHistoryLayout('grid')}
                                        className={`inline-flex items-center gap-1 text-xs font-semibold ${historyLayout === 'grid' ? 'text-ink' : 'text-ink-muted hover:text-ink'}`}
                                    >
                                        <LayoutGrid className="size-3.5" />
                                        Сетка
                                    </button>
                                </div>
                            )}
                        </header>

                        {mainTab === 'history' ? (
                            <VideoHistoryPanel
                                items={historyData}
                                layout={historyLayout}
                                gridCols={gridCols}
                                isGenerating={isGenerating}
                                status={status}
                            />
                        ) : (
                            <VideoOnboarding
                                onOpenPresets={openPresets}
                                onUpload={triggerFileSelect}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
        </div>
    );
}

export default VideoStudio;
