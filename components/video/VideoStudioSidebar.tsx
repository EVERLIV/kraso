import React, { useState } from 'react';
import { Check, ChevronUp, ImageIcon, Loader2, Pencil, Shuffle, Sparkles, Volume2, Wand2, X } from 'lucide-react';
import { KRASO_MODELS, KrasoModelId } from '../../lib/krasoModels';
import { VideoMotionPreset } from '../../lib/videoPresets';
import { getTierVariants, getVariant, VideoVariantId, VideoVariantOption } from '../../lib/videoModels';
import {
  GEN_BAR_R,
  GEN_BAR_FORM,
  GEN_BAR_GENERATE,
  GEN_BAR_CHIP,
  GEN_BAR_CHIP_MUTED,
  GEN_BAR_DROPDOWN,
  GEN_BAR_DROPDOWN_ITEM,
} from '../genbar/genBarStyles';

export type VideoQuality = '720p' | '1080p';
export type VideoFormat = '16:9' | '9:16';

const QUALITY_OPTIONS: VideoQuality[] = ['720p', '1080p'];
const FORMAT_OPTIONS: VideoFormat[] = ['16:9', '9:16'];
const MIN_DURATION = 3;
const MAX_DURATION = 15;

interface VideoStudioSidebarProps {
  prompt: string;
  setPrompt: (v: string) => void;
  attachedImage: string | null;
  onUpload: () => void;
  onClearImage: () => void;
  selectedPreset: VideoMotionPreset | null;
  onOpenPresets: () => void;
  onClearPreset: () => void;
  krasoModel: KrasoModelId;
  onKrasoModelChange: (id: KrasoModelId) => void;
  variant: VideoVariantId;
  onVariantChange: (id: VideoVariantId) => void;
  duration: number;
  onDurationChange: (d: number) => void;
  quality: VideoQuality;
  onQualityChange: (q: VideoQuality) => void;
  aspectRatio: VideoFormat;
  onAspectRatioChange: (f: VideoFormat) => void;
  promptEnhanceEnabled: boolean;
  onPromptEnhanceChange: (enabled: boolean) => void;
  isEnhancingPrompt: boolean;
  onEnhancePrompt: () => void;
  cost: number;
  isGenerating: boolean;
  onGenerate: () => void;
  error?: string | null;
}

function OverlayChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-6 items-center gap-1 px-2 text-[10px] font-semibold rounded-full border border-white/10 bg-black/55 text-white/90">
      {children}
    </span>
  );
}

function FormatIcon({ ratio, className = '' }: { ratio: VideoFormat; className?: string }) {
  const [w, h] = ratio.split(':').map(Number);
  const max = 13;
  const bw = w >= h ? max : Math.round((w / h) * max);
  const bh = h >= w ? max : Math.round((h / w) * max);
  return (
    <span className={`inline-flex items-center justify-center size-4 shrink-0 ${className}`}>
      <span className="border-[1.5px] border-current rounded-[2px]" style={{ width: bw, height: bh }} />
    </span>
  );
}

function VideoStudioSidebar({
  prompt,
  setPrompt,
  attachedImage,
  onUpload,
  onClearImage,
  selectedPreset,
  onOpenPresets,
  onClearPreset,
  krasoModel,
  onKrasoModelChange,
  variant,
  onVariantChange,
  duration,
  onDurationChange,
  quality,
  onQualityChange,
  aspectRatio,
  onAspectRatioChange,
  promptEnhanceEnabled,
  onPromptEnhanceChange,
  isEnhancingPrompt,
  onEnhancePrompt,
  cost,
  isGenerating,
  onGenerate,
  error,
}: VideoStudioSidebarProps) {
  const canGenerate = !isGenerating && !!attachedImage;
  const activeVariant = getVariant(krasoModel, variant);

  const [modelOpen, setModelOpen] = useState(false);
  const [durationOpen, setDurationOpen] = useState(false);
  const [qualityOpen, setQualityOpen] = useState(false);
  const [formatOpen, setFormatOpen] = useState(false);

  const closeAllExcept = (which: 'model' | 'duration' | 'quality' | 'format' | null) => {
    setModelOpen(which === 'model');
    setDurationOpen(which === 'duration');
    setQualityOpen(which === 'quality');
    setFormatOpen(which === 'format');
  };

  const handleEnhanceClick = () => {
    if (isEnhancingPrompt) return;
    if (!promptEnhanceEnabled) {
      onPromptEnhanceChange(true);
      if (prompt.trim()) onEnhancePrompt();
      return;
    }
    if (prompt.trim()) {
      onEnhancePrompt();
      return;
    }
    onPromptEnhanceChange(false);
  };

  const handleVariantSelect = (tier: KrasoModelId, v: VideoVariantOption) => {
    if (v.requiresConfirm && v.id !== variant) {
      const ok = window.confirm(
        `${v.label} — дорогая генерация. Использовать только по явному запросу. Продолжить?`,
      );
      if (!ok) return;
    }
    if (tier !== krasoModel) onKrasoModelChange(tier);
    onVariantChange(v.id);
    closeAllExcept(null);
  };

  return (
    <div className={`${GEN_BAR_FORM} w-full shrink-0 flex flex-col gap-3 !p-4 sm:!p-5`}>
      <p className="text-xs font-bold uppercase text-ink-muted">Создать видео</p>

      <figure
        role="button"
        tabIndex={0}
        onClick={onOpenPresets}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onOpenPresets(); }}
        className={`h-[120px] w-full relative overflow-hidden ${GEN_BAR_R} border border-[var(--border-soft)] bg-surface-muted cursor-pointer group`}
      >
        {selectedPreset?.thumb ? (
          <img src={selectedPreset.thumb} alt="" className="absolute inset-0 size-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-surface-muted" />
        )}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute top-2 right-2 flex gap-1 z-10">
          <OverlayChip><Shuffle className="size-3" />Mix</OverlayChip>
          <OverlayChip><Pencil className="size-3" />Сменить</OverlayChip>
        </div>
        {selectedPreset && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onClearPreset(); }}
            className="absolute top-2 left-2 size-5 rounded-full bg-primary text-on-primary flex items-center justify-center opacity-0 group-hover:opacity-100 z-10"
            aria-label="Убрать пресет"
          >
            <X className="size-2.5" strokeWidth={3} />
          </button>
        )}
        <figcaption className="absolute left-3 bottom-3 right-2 z-10">
          <p className="truncate text-sm font-black uppercase text-primary leading-tight">
            {selectedPreset?.title ?? 'Выберите пресет'}
          </p>
          <p className="text-[11px] text-white/75 truncate mt-0.5">Красо Motion</p>
        </figcaption>
      </figure>

      {attachedImage ? (
        <div className={`relative h-[88px] overflow-hidden ${GEN_BAR_R} border border-[var(--border-soft)] bg-surface-muted`}>
          <img src={attachedImage} alt="" className="size-full object-cover" />
          <button
            type="button"
            onClick={onClearImage}
            className="absolute top-1.5 right-1.5 size-5 rounded-full bg-primary text-on-primary flex items-center justify-center"
            aria-label="Убрать фото"
          >
            <X className="size-2.5" strokeWidth={3} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={onUpload}
          className={`w-full border border-dashed border-[var(--border-soft)] bg-surface-muted ${GEN_BAR_R} py-4 px-3 flex flex-col items-center justify-center gap-1.5 hover:border-primary/35 transition-colors`}
        >
          <span className="size-8 rounded-full border border-[var(--border-soft)] bg-card-light flex items-center justify-center">
            <ImageIcon className="size-4 text-ink-muted" />
          </span>
          <p className="text-xs text-ink-muted text-center text-pretty leading-tight">
            Загрузите фото или <span className="text-ink font-semibold">сгенерируйте</span>
          </p>
          <p className="text-[10px] text-ink-faint">PNG, JPG или вставка из буфера</p>
        </button>
      )}

      <div className={`${GEN_BAR_R} bg-surface-muted p-2.5`}>
        <label htmlFor="video-prompt" className="block text-[10px] font-medium text-ink-muted mb-1.5">
          Промпт
        </label>
        <textarea
          id="video-prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
          placeholder="Опишите сцену, которую представляете, с деталями…"
          className="w-full bg-transparent text-xs text-ink placeholder:text-ink-muted outline-none resize-none min-h-[88px] max-h-[120px] leading-relaxed text-pretty"
        />
        <button
          type="button"
          onClick={handleEnhanceClick}
          disabled={isEnhancingPrompt}
          aria-pressed={promptEnhanceEnabled}
          title={promptEnhanceEnabled ? 'Улучшить промпт (FAL)' : 'Включить улучшение промпта'}
          className={`mt-1.5 inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-semibold ${GEN_BAR_R} transition-colors ${
            promptEnhanceEnabled
              ? 'bg-card-light text-ink'
              : 'bg-black/35 text-ink-muted hover:text-ink'
          } disabled:opacity-60`}
        >
          {isEnhancingPrompt ? (
            <Loader2 className="size-3 animate-spin motion-reduce:animate-none" />
          ) : (
            <Wand2 className="size-3" />
          )}
          {promptEnhanceEnabled ? 'Улучшение вкл.' : 'Улучшение'}
        </button>
      </div>

      {/* Settings: model / duration / format / quality — compact dropdown chips */}
      <div className="space-y-2">
        <div className="relative">
          <button
            type="button"
            onClick={() => closeAllExcept(modelOpen ? null : 'model')}
            className={`${GEN_BAR_CHIP} w-full justify-between`}
          >
            <span className="flex items-center gap-1.5 min-w-0">
              <span className="truncate">{activeVariant.label}</span>
              {activeVariant.hasAudio && <Volume2 className="size-3 shrink-0 text-ink-faint" />}
            </span>
            <ChevronUp className={`size-4 shrink-0 ${GEN_BAR_CHIP_MUTED} transition-transform ${modelOpen ? '' : 'rotate-180'}`} />
          </button>
          {modelOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setModelOpen(false)} aria-hidden="true" />
              <div className={`${GEN_BAR_DROPDOWN} w-full max-h-72 overflow-y-auto`}>
                {KRASO_MODELS.map((tier) => (
                  <div key={tier.id}>
                    <p className="px-2.5 pt-2 pb-1 text-[9px] font-bold uppercase tracking-wide text-ink-faint">
                      {tier.label}
                    </p>
                    {getTierVariants(tier.id).map((v) => {
                      const selected = krasoModel === tier.id && variant === v.id;
                      return (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => handleVariantSelect(tier.id, v)}
                          className={`${GEN_BAR_DROPDOWN_ITEM} ${selected ? 'bg-primary/10 text-primary' : 'text-ink-body hover:bg-white/5'}`}
                        >
                          <span className="flex-1 min-w-0 text-left">
                            <span className="flex items-center gap-1.5">
                              <span className="truncate text-xs font-medium">{v.label}</span>
                              {v.hasAudio && <Volume2 className="size-3 shrink-0 text-ink-faint" />}
                            </span>
                            <span className="block text-[10px] text-ink-faint truncate mt-0.5">{v.hint}</span>
                          </span>
                          {selected && <Check className="size-3.5 shrink-0 text-primary mt-0.5" strokeWidth={3} />}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2">
          {/* Duration */}
          <div className="relative min-w-0">
            <button
              type="button"
              onClick={() => closeAllExcept(durationOpen ? null : 'duration')}
              className={`${GEN_BAR_CHIP} w-full justify-between !px-2.5`}
            >
              <span className="tabular-nums truncate">{duration} с</span>
              <ChevronUp className={`size-3.5 shrink-0 ${GEN_BAR_CHIP_MUTED} transition-transform ${durationOpen ? '' : 'rotate-180'}`} />
            </button>
            {durationOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setDurationOpen(false)} aria-hidden="true" />
                <div className={`${GEN_BAR_DROPDOWN} w-52`}>
                  <div className="px-2.5 py-2">
                    <div className="flex items-baseline justify-between mb-2">
                      <span className="text-[10px] font-medium text-ink-muted">Длительность</span>
                      <span className="text-sm font-bold text-ink tabular-nums">{duration} с</span>
                    </div>
                    <input
                      type="range"
                      min={MIN_DURATION}
                      max={MAX_DURATION}
                      step={1}
                      value={duration}
                      onChange={(e) => onDurationChange(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                    <div className="flex justify-between mt-1 text-[9px] text-ink-faint tabular-nums">
                      <span>{MIN_DURATION}с</span>
                      <span>{MAX_DURATION}с</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Format / aspect ratio */}
          <div className="relative min-w-0">
            <button
              type="button"
              onClick={() => closeAllExcept(formatOpen ? null : 'format')}
              className={`${GEN_BAR_CHIP} w-full justify-between !px-2.5`}
            >
              <span className="flex items-center gap-1.5 min-w-0">
                <FormatIcon ratio={aspectRatio} />
                <span className="tabular-nums truncate">{aspectRatio}</span>
              </span>
              <ChevronUp className={`size-3.5 shrink-0 ${GEN_BAR_CHIP_MUTED} transition-transform ${formatOpen ? '' : 'rotate-180'}`} />
            </button>
            {formatOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setFormatOpen(false)} aria-hidden="true" />
                <div className={`${GEN_BAR_DROPDOWN} w-32`}>
                  {FORMAT_OPTIONS.map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => { onAspectRatioChange(f); setFormatOpen(false); }}
                      className={`${GEN_BAR_DROPDOWN_ITEM} ${aspectRatio === f ? 'bg-primary/10 text-primary font-semibold' : 'text-ink-body hover:bg-white/5'}`}
                    >
                      <FormatIcon ratio={f} />
                      <span className="flex-1 text-left tabular-nums">{f}</span>
                      {aspectRatio === f && <Check className="size-3.5 text-primary" strokeWidth={3} />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Quality / resolution */}
          <div className="relative min-w-0">
            <button
              type="button"
              onClick={() => closeAllExcept(qualityOpen ? null : 'quality')}
              className={`${GEN_BAR_CHIP} w-full justify-between !px-2.5`}
            >
              <span className="tabular-nums truncate">{quality}</span>
              <ChevronUp className={`size-3.5 shrink-0 ${GEN_BAR_CHIP_MUTED} transition-transform ${qualityOpen ? '' : 'rotate-180'}`} />
            </button>
            {qualityOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setQualityOpen(false)} aria-hidden="true" />
                <div className={`${GEN_BAR_DROPDOWN} w-28`}>
                  {QUALITY_OPTIONS.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => { onQualityChange(q); setQualityOpen(false); }}
                      className={`${GEN_BAR_DROPDOWN_ITEM} justify-between tabular-nums ${quality === q ? 'bg-primary/10 text-primary font-semibold' : 'text-ink-body hover:bg-white/5'}`}
                    >
                      {q}
                      {quality === q && <Check className="size-3.5 text-primary" strokeWidth={3} />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {error && (
        <p role="alert" className={`text-red-400 text-xs font-medium ${GEN_BAR_R} border border-red-500/30 bg-card-light px-3 py-2 text-pretty`}>
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={onGenerate}
        disabled={!canGenerate}
        className={`${GEN_BAR_GENERATE} w-full !min-w-0 !h-11`}
      >
        {isGenerating ? (
          <Loader2 className="size-4 animate-spin motion-reduce:animate-none" />
        ) : (
          <>
            <span>Создать</span>
            <span className="inline-flex items-center gap-1 opacity-90 tabular-nums">
              <Sparkles className="size-3.5" />
              {cost}
            </span>
          </>
        )}
      </button>
    </div>
  );
}

export default VideoStudioSidebar;
