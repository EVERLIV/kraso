import React, { useState } from 'react';
import {
  Check, ChevronDown, ChevronRight, ChevronUp,
  ImageIcon, Loader2, Pencil, Sparkles, Volume2, VolumeX, Wand2, X,
} from 'lucide-react';
import { KrasoModelId } from '../../lib/krasoModels';
import { getVariant, VideoVariantId, VideoResolution, VideoAspectRatio, snapToFixed } from '../../lib/videoModels';
import { VideoMotionPreset } from '../../lib/videoPresets';
import {
  GEN_BAR_R,
  GEN_BAR_FORM,
  GEN_BAR_GENERATE,
  GEN_BAR_CHIP,
  GEN_BAR_CHIP_MUTED,
  GEN_BAR_DROPDOWN,
  GEN_BAR_DROPDOWN_ITEM,
} from '../genbar/genBarStyles';

export type VideoQuality = VideoResolution;
export type VideoFormat = VideoAspectRatio;

const DEFAULT_FORMAT_OPTIONS: VideoAspectRatio[] = ['16:9', '9:16'];
const DEFAULT_QUALITY_OPTIONS: VideoResolution[] = ['720p', '1080p'];

type StudioMode = 'create' | 'edit' | 'motion';

const MODE_TABS: { id: StudioMode; label: string; disabled?: boolean }[] = [
  { id: 'create', label: 'Создать видео' },
  { id: 'edit', label: 'Редактировать', disabled: true },
  { id: 'motion', label: 'Движение', disabled: true },
];

interface VideoStudioSidebarProps {
  prompt: string;
  setPrompt: (v: string) => void;
  attachedImage: string | null;
  onUpload: () => void;
  onClearImage: () => void;
  selectedPreset: VideoMotionPreset | null;
  onOpenPresets: () => void;
  onClearPreset: () => void;
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
  generateAudioEnabled: boolean;
  onGenerateAudioChange: (enabled: boolean) => void;
  krasoModel: KrasoModelId;
  variant: VideoVariantId;
  showModelInPanel?: boolean;
  cost: number;
  /** Number of currently active generations (0 = idle). */
  generatingCount: number;
  onGenerate: () => void;
  error?: string | null;
}

function FormatIcon({ ratio, className = '' }: { ratio: VideoAspectRatio; className?: string }) {
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
  generateAudioEnabled,
  onGenerateAudioChange,
  krasoModel,
  variant,
  showModelInPanel = false,
  cost,
  generatingCount,
  onGenerate,
  error,
}: VideoStudioSidebarProps) {
  const isGenerating = generatingCount > 0;
  // Button is only disabled without an attached image — multiple generations allowed
  const canGenerate = !!attachedImage;
  const currentVariant = getVariant(krasoModel, variant);
  const { params } = currentVariant;

  const presetTitle = selectedPreset?.title ?? 'Обычная Генерация';
  const presetSubtitle = showModelInPanel
    ? currentVariant.label
    : (selectedPreset?.description ?? 'Чистая генерация — качество модели');
  const modelHasAudio = currentVariant.hasAudio === true;
  // Show demo video in the preset card when no custom preset is selected
  const isGeneralPreset = !selectedPreset || selectedPreset.id === 'general';
  const demoVideoUrl = isGeneralPreset ? (currentVariant.demoVideoUrl ?? null) : null;

  // Derive per-model constraints
  const formatOptions: VideoAspectRatio[] = params.aspectRatioOptions ?? DEFAULT_FORMAT_OPTIONS;
  const resolutionOptions: VideoResolution[] = params.resolutionOptions ?? DEFAULT_QUALITY_OPTIONS;
  const showResolutionControl = resolutionOptions.length > 1;

  // Duration control type
  const hasDurationFixed = !!params.durationFixed && params.durationFixed.length > 0;
  const hasDurationRange = !!params.durationRange;

  // Snap current duration to valid value for this model whenever constraints change
  const effectiveDuration = hasDurationFixed
    ? snapToFixed(duration, params.durationFixed!)
    : hasDurationRange
      ? Math.max(params.durationRange!.min, Math.min(params.durationRange!.max, duration))
      : duration;

  const [mode, setMode] = useState<StudioMode>('create');
  const [durationOpen, setDurationOpen] = useState(false);
  const [qualityOpen, setQualityOpen] = useState(false);
  const [formatOpen, setFormatOpen] = useState(false);

  const closeAllExcept = (which: 'duration' | 'quality' | 'format' | null) => {
    setDurationOpen(which === 'duration');
    setQualityOpen(which === 'quality');
    setFormatOpen(which === 'format');
  };

  const anyParamOpen = durationOpen || qualityOpen || formatOpen;

  const ParamChevron = ({ open }: { open: boolean }) => (
    open
      ? <ChevronUp className={`size-3.5 shrink-0 ${GEN_BAR_CHIP_MUTED}`} />
      : <ChevronDown className={`size-3.5 shrink-0 ${GEN_BAR_CHIP_MUTED}`} />
  );

  const handleEnhanceOn = () => {
    if (isEnhancingPrompt) return;
    onPromptEnhanceChange(true);
    if (prompt.trim()) onEnhancePrompt();
  };

  // Render duration control: slider for range, dropdown for fixed options
  const renderDurationControl = () => {
    if (hasDurationFixed) {
      return (
        <div className="relative min-w-0 flex-1">
          <button
            type="button"
            onClick={() => closeAllExcept(durationOpen ? null : 'duration')}
            className={`${GEN_BAR_CHIP} w-full justify-between !px-2.5 !h-9`}
            aria-expanded={durationOpen}
          >
            <span className="tabular-nums truncate">{effectiveDuration} с</span>
            <ParamChevron open={durationOpen} />
          </button>
          {durationOpen && (
            <>
              <div className="fixed inset-0 z-[55]" onClick={() => setDurationOpen(false)} aria-hidden="true" />
              <div className={`${GEN_BAR_DROPDOWN} vs-param-dropdown w-full`}>
                {params.durationFixed!.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => { onDurationChange(d); setDurationOpen(false); }}
                    className={`${GEN_BAR_DROPDOWN_ITEM} justify-between tabular-nums ${effectiveDuration === d ? 'bg-primary/10 text-primary font-semibold' : 'text-ink-body hover:bg-white/5'}`}
                  >
                    {d} секунд
                    {effectiveDuration === d && <Check className="size-3.5 text-primary" strokeWidth={3} />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      );
    }

    if (hasDurationRange) {
      const { min, max } = params.durationRange!;
      return (
        <div className="relative min-w-0 flex-1">
          <button
            type="button"
            onClick={() => closeAllExcept(durationOpen ? null : 'duration')}
            className={`${GEN_BAR_CHIP} w-full justify-between !px-2.5 !h-9`}
            aria-expanded={durationOpen}
          >
            <span className="tabular-nums truncate">{effectiveDuration} с</span>
            <ParamChevron open={durationOpen} />
          </button>
          {durationOpen && (
            <>
              <div className="fixed inset-0 z-[55]" onClick={() => setDurationOpen(false)} aria-hidden="true" />
              <div className={`${GEN_BAR_DROPDOWN} vs-param-dropdown w-full min-w-[10rem]`}>
                <div className="px-2.5 py-2">
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-[10px] font-medium text-ink-muted">Длительность</span>
                    <span className="text-sm font-bold text-ink tabular-nums">{effectiveDuration} с</span>
                  </div>
                  <input
                    type="range"
                    min={min}
                    max={max}
                    step={1}
                    value={effectiveDuration}
                    onChange={(e) => onDurationChange(Number(e.target.value))}
                    aria-label="Длительность видео"
                    className="w-full accent-primary"
                  />
                  <div className="flex justify-between mt-1 text-[9px] text-ink-faint tabular-nums">
                    <span>{min}с</span>
                    <span>{max}с</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      );
    }

    return null;
  };

  const renderParamRow = () => (
    <div className={`vs-param-row ${anyParamOpen ? 'vs-param-row--open' : ''}`}>
      {/* Duration */}
      {renderDurationControl()}

      {/* Aspect ratio */}
      <div className="relative min-w-0 flex-1">
        <button
          type="button"
          onClick={() => closeAllExcept(formatOpen ? null : 'format')}
          className={`${GEN_BAR_CHIP} w-full justify-between !px-2.5 !h-9`}
          aria-expanded={formatOpen}
        >
          <span className="flex items-center gap-1 min-w-0">
            <FormatIcon ratio={aspectRatio as VideoAspectRatio} />
            <span className="tabular-nums truncate">{aspectRatio}</span>
          </span>
          <ParamChevron open={formatOpen} />
        </button>
        {formatOpen && (
          <>
            <div className="fixed inset-0 z-[55]" onClick={() => setFormatOpen(false)} aria-hidden="true" />
            <div className={`${GEN_BAR_DROPDOWN} vs-param-dropdown w-full`}>
              {formatOptions.map((f) => (
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

      {/* Resolution */}
      {showResolutionControl ? (
        <div className="relative min-w-0 flex-1">
          <button
            type="button"
            onClick={() => closeAllExcept(qualityOpen ? null : 'quality')}
            className={`${GEN_BAR_CHIP} w-full justify-between !px-2.5 !h-9`}
            aria-expanded={qualityOpen}
          >
            <span className="tabular-nums truncate">{quality}</span>
            <ParamChevron open={qualityOpen} />
          </button>
          {qualityOpen && (
            <>
              <div className="fixed inset-0 z-[55]" onClick={() => setQualityOpen(false)} aria-hidden="true" />
              <div className={`${GEN_BAR_DROPDOWN} vs-param-dropdown w-full`}>
                {resolutionOptions.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => { onQualityChange(q); setQualityOpen(false); }}
                    className={`${GEN_BAR_DROPDOWN_ITEM} justify-between tabular-nums ${quality === q ? 'bg-primary/10 text-primary font-semibold' : 'text-ink-body hover:bg-white/5'}`}
                  >
                    {q.toUpperCase()}
                    {quality === q && <Check className="size-3.5 text-primary" strokeWidth={3} />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        /* Fixed resolution badge */
        <span className={`${GEN_BAR_CHIP} !px-2.5 !h-9 pointer-events-none opacity-70 tabular-nums`}>
          {currentVariant.resolution.toUpperCase()}
        </span>
      )}
    </div>
  );

  return (
    <aside className={`vs-sidebar ${GEN_BAR_FORM} flex flex-col min-h-0 h-full !p-0`}>
      <div className="vs-mode-tabs" role="tablist" aria-label="Режим студии">
        {MODE_TABS.map((tab) => {
          const active = mode === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active}
              disabled={tab.disabled}
              onClick={() => !tab.disabled && setMode(tab.id)}
              className={`vs-mode-tab ${active ? 'vs-mode-tab--active' : ''}`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="vs-sidebar__body flex flex-col gap-3 flex-1 min-h-0 overflow-y-auto custom-scrollbar px-4 pt-3 pb-2">
        <figure
          role="button"
          tabIndex={0}
          onClick={onOpenPresets}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onOpenPresets(); }}
          className={`vs-preset-card group ${GEN_BAR_R}`}
        >
          {demoVideoUrl ? (
            <video
              key={demoVideoUrl}
              src={demoVideoUrl}
              muted
              loop
              playsInline
              autoPlay
              className="absolute inset-0 size-full object-cover"
            />
          ) : selectedPreset?.thumb ? (
            <img src={selectedPreset.thumb} alt="" className="absolute inset-0 size-full object-cover" />
          ) : (
            <div className={`absolute inset-0 ${selectedPreset?.id === 'general' ? 'vs-preset-card__bg-general' : 'bg-surface-muted'}`} />
          )}
          <div className="vs-preset-card__overlay" />
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onOpenPresets(); }}
            className="vs-preset-card__change"
          >
            <Pencil className="size-3" />
            Сменить
          </button>
          {selectedPreset && selectedPreset.id !== 'general' && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onClearPreset(); }}
              className="absolute top-2 left-2 size-5 rounded-full bg-primary text-on-primary flex items-center justify-center opacity-0 group-hover:opacity-100 z-10 transition-opacity"
              aria-label="Сбросить пресет"
            >
              <X className="size-2.5" strokeWidth={3} />
            </button>
          )}
          <figcaption className="vs-preset-card__caption">
            <p className="truncate text-sm font-black uppercase text-primary leading-tight">
              {presetTitle}
            </p>
            <p className={`truncate mt-0.5 text-[11px] ${showModelInPanel ? 'vs-preset-card__model text-white font-bold' : 'text-white/75 text-pretty'}`}>
              {presetSubtitle}
            </p>
          </figcaption>
        </figure>

        {showModelInPanel && (
          <button
            type="button"
            onClick={onOpenPresets}
            className={`vs-model-row ${GEN_BAR_R}`}
          >
            <span className="vs-model-row__label">Модель</span>
            <span className="vs-model-row__value truncate">{currentVariant.label}</span>
            <ChevronRight className="size-3.5 shrink-0 text-ink-muted" aria-hidden />
          </button>
        )}

        {/* Model hint chip */}
        <div className="px-0.5">
          <p className="text-[11px] text-ink-muted leading-relaxed text-pretty">
            {currentVariant.hint}
          </p>
        </div>

        <div className="vs-frames">
          <div className="vs-frame-slot">
            <p className="vs-frame-slot__label">Стартовый кадр</p>
            {attachedImage ? (
              <div className={`vs-frame-slot__media ${GEN_BAR_R}`}>
                <img src={attachedImage} alt="" className="size-full object-cover" />
                <button
                  type="button"
                  onClick={onClearImage}
                  className="vs-frame-slot__clear"
                  aria-label="Убрать фото"
                >
                  <X className="size-3" strokeWidth={3} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onUpload}
                className={`vs-frame-slot__empty ${GEN_BAR_R}`}
              >
                <ImageIcon className="size-5 text-ink-muted" />
                <span className="text-[10px] text-ink-muted mt-1">Загрузить</span>
              </button>
            )}
          </div>

          <div className="vs-frame-slot vs-frame-slot--optional">
            <p className="vs-frame-slot__label">
              Конечный кадр <span className="text-ink-faint font-normal">необяз.</span>
            </p>
            <div className={`vs-frame-slot__empty vs-frame-slot__empty--disabled ${GEN_BAR_R}`} aria-disabled>
              <ImageIcon className="size-5 text-ink-faint" />
              <span className="text-[10px] text-ink-faint mt-1">Скоро</span>
            </div>
          </div>
        </div>

        <div className={`vs-prompt-block ${GEN_BAR_R}`}>
          <textarea
            id="video-prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            placeholder="Опишите сцену с деталями…"
            className="vs-prompt-block__input"
          />
          <div className="vs-prompt-badges" role="group" aria-label="Настройки промпта">
            <button
              type="button"
              onClick={handleEnhanceOn}
              disabled={isEnhancingPrompt}
              aria-pressed={promptEnhanceEnabled}
              className={`vs-prompt-badge ${promptEnhanceEnabled ? 'vs-prompt-badge--active' : ''}`}
            >
              {isEnhancingPrompt ? (
                <Loader2 className="size-3 animate-spin motion-reduce:animate-none" />
              ) : (
                <Wand2 className="size-3" />
              )}
              Улучшение вкл.
            </button>
            <button
              type="button"
              onClick={() => onPromptEnhanceChange(false)}
              aria-pressed={!promptEnhanceEnabled}
              className={`vs-prompt-badge ${!promptEnhanceEnabled ? 'vs-prompt-badge--active' : ''}`}
            >
              Выкл.
            </button>
            {modelHasAudio && (
              <>
                <button
                  type="button"
                  onClick={() => onGenerateAudioChange(true)}
                  aria-pressed={generateAudioEnabled}
                  className={`vs-prompt-badge ${generateAudioEnabled ? 'vs-prompt-badge--active' : ''}`}
                >
                  <Volume2 className="size-3" />
                  Звук вкл.
                </button>
                <button
                  type="button"
                  onClick={() => onGenerateAudioChange(false)}
                  aria-pressed={!generateAudioEnabled}
                  className={`vs-prompt-badge ${!generateAudioEnabled ? 'vs-prompt-badge--active' : ''}`}
                >
                  <VolumeX className="size-3" />
                  Без звука
                </button>
              </>
            )}
          </div>
        </div>

        {error && (
          <p role="alert" className={`text-red-400 text-xs font-medium ${GEN_BAR_R} border border-red-500/30 bg-card-light px-3 py-2 text-pretty`}>
            {error}
          </p>
        )}
      </div>

      <div className="vs-sidebar__dock shrink-0 overflow-visible relative z-40 px-4 pt-2 pb-4">
        {renderParamRow()}
        <button
          type="button"
          onClick={onGenerate}
          disabled={!canGenerate}
          className={`${GEN_BAR_GENERATE} w-full !min-w-0 !h-12 text-sm mt-3 relative`}
        >
          {/* Active generation spinner badge */}
          {isGenerating && (
            <span className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-primary flex items-center justify-center z-10">
              <Loader2 className="size-3 text-on-primary animate-spin motion-reduce:animate-none" />
            </span>
          )}
          {generatingCount > 1 && (
            <span className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-primary text-[9px] font-black text-on-primary flex items-center justify-center z-10">
              {generatingCount}
            </span>
          )}
          <span>Создать</span>
          <span className="inline-flex items-center gap-1 opacity-90 tabular-nums">
            <Sparkles className="size-3.5" />
            {cost}
          </span>
        </button>
      </div>
    </aside>
  );
}

export default VideoStudioSidebar;
