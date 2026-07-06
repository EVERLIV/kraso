import React, { useCallback, useEffect, useState } from 'react';
import { FolderHeart, LayoutGrid, List } from 'lucide-react';
import { GeneratedImage } from '../types';
import { KrasoModelId } from '../lib/krasoModels';
import { VideoVariantId } from '../lib/videoModels';
import { VideoMotionPreset, getDefaultPresetForModel, isPresetAvailableForModel } from '../lib/videoPresets';
import { GEN_BAR_FORM, GEN_BAR_R } from './genbar/genBarStyles';
import VideoStudioSidebar, { VideoQuality } from './video/VideoStudioSidebar';
import VideoOnboarding from './video/VideoOnboarding';
import VideoPresetPicker from './video/VideoPresetPicker';
import VideoHistoryPanel, { VideoHistoryLayout } from './video/VideoHistoryPanel';
import VideoResultViewer from './video/VideoResultViewer';
import './video/videoTheme.css';

import type { VideoAspectRatio } from '../lib/videoModels';
type VideoRatio = VideoAspectRatio;
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
    generateAudioEnabled: boolean;
    onGenerateAudioChange: (enabled: boolean) => void;
    showModelInPanel?: boolean;
    selectedPreset: VideoMotionPreset | null;
    onSelectPreset: (preset: VideoMotionPreset | null) => void;
    generatingCount: number;
    status?: string;
    onGenerate: () => void;
    historyData: GeneratedImage[];
    cost: number;
    error?: string | null;
    onDownloadVideo?: (url: string) => void;
    onShareVideo?: (url: string) => void;
    onDeleteVideo?: (item: GeneratedImage) => void;
    onToggleVideoSave?: (id: string) => void;
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
        generateAudioEnabled, onGenerateAudioChange,
        generatingCount, status, onGenerate, historyData, cost, error,
        onDownloadVideo, onShareVideo, onDeleteVideo, onToggleVideoSave,
    } = props;

    const [mainTab, setMainTab] = useState<MainTab>('how');
    const [showPresets, setShowPresets] = useState(false);
    const [presetPanelUsed, setPresetPanelUsed] = useState(false);
    const [historyLayout, setHistoryLayout] = useState<VideoHistoryLayout>('grid');
    const [gridCols, setGridCols] = useState(4);
    const [viewerItem, setViewerItem] = useState<GeneratedImage | null>(null);

    const handleSelectPreset = useCallback((
        preset: VideoMotionPreset,
        tier: KrasoModelId,
        variantId: VideoVariantId,
    ) => {
        if (tier !== krasoModel) onKrasoModelChange(tier);
        if (variantId !== variant) onVariantChange(variantId);
        onSelectPreset(preset);
        setPresetPanelUsed(true);
        setShowPresets(false);
    }, [krasoModel, onKrasoModelChange, variant, onVariantChange, onSelectPreset]);

    const openPresets = () => setShowPresets(true);

    useEffect(() => {
        if (!selectedPreset || !isPresetAvailableForModel(selectedPreset.id, variant)) {
            onSelectPreset(getDefaultPresetForModel(variant));
        }
    }, [variant, selectedPreset, onSelectPreset]);

    const staticWorkspace = (
        <>
            <header className="shrink-0 flex items-center justify-between gap-3 pb-3 flex-wrap">
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
                    isGenerating={generatingCount > 0}
                    status={status}
                    onItemClick={setViewerItem}
                />
            ) : (
                <VideoOnboarding
                    onOpenPresets={openPresets}
                    onUpload={triggerFileSelect}
                />
            )}
        </>
    );

    return (
        <div className="video-studio flex-1 flex flex-col min-h-0 overflow-hidden bg-background-light">
            <div className="vs-shell w-full max-w-[1600px] mx-auto flex flex-col md:flex-row flex-1 min-h-0 gap-3 md:gap-4 p-3 md:p-4">
                <div className="vs-control-column shrink-0">
                    <VideoStudioSidebar
                        prompt={prompt}
                        setPrompt={setPrompt}
                        attachedImage={attachedImage}
                        onUpload={triggerFileSelect}
                        onClearImage={() => setAttachedImage(null)}
                        selectedPreset={selectedPreset}
                        onOpenPresets={openPresets}
                        onClearPreset={() => onSelectPreset(getDefaultPresetForModel(variant))}
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
                        generateAudioEnabled={generateAudioEnabled}
                        onGenerateAudioChange={onGenerateAudioChange}
                        krasoModel={krasoModel}
                        variant={variant}
                        showModelInPanel={presetPanelUsed}
                        cost={cost}
                        generatingCount={generatingCount}
                        onGenerate={() => {
                            onGenerate();
                            setMainTab('history');
                            setShowPresets(false);
                        }}
                        error={error}
                    />
                </div>

                <div className="vs-workspace flex-1 flex flex-col min-w-0 min-h-0">
                    {showPresets ? (
                        <VideoPresetPicker
                            onClose={() => setShowPresets(false)}
                            selectedId={selectedPreset?.id}
                            onSelect={handleSelectPreset}
                            krasoModel={krasoModel}
                            variant={variant}
                        />
                    ) : (
                        staticWorkspace
                    )}
                </div>
            </div>

            {viewerItem && (
                <VideoResultViewer
                    item={historyData.find((h) => h.id && h.id === viewerItem.id) ?? viewerItem}
                    onClose={() => setViewerItem(null)}
                    onDownload={onDownloadVideo ?? (() => {})}
                    onShare={onShareVideo ?? (() => {})}
                    onDelete={(item) => {
                        (onDeleteVideo ?? (() => {}))(item);
                        setViewerItem(null);
                    }}
                    onToggleSave={onToggleVideoSave}
                />
            )}
        </div>
    );
}

export default VideoStudio;
