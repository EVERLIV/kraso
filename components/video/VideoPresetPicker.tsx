import React, { useEffect, useMemo, useState } from 'react';
import { Check, Search, Volume2, X } from 'lucide-react';
import { KrasoModelId } from '../../lib/krasoModels';
import { getAllVideoVariants, VideoVariantId, VideoVariantOption } from '../../lib/videoModels';
import { getPresetsForModel, VideoMotionPreset } from '../../lib/videoPresets';

interface VideoPresetPickerProps {
  onClose: () => void;
  selectedId?: string | null;
  onSelect: (preset: VideoMotionPreset, tier: KrasoModelId, variantId: VideoVariantId) => void;
  krasoModel: KrasoModelId;
  variant: VideoVariantId;
}

function VideoPresetPicker({
  onClose,
  selectedId,
  onSelect,
  krasoModel,
  variant,
}: VideoPresetPickerProps) {
  const allModels = useMemo(() => getAllVideoVariants(), []);
  const [browseVariant, setBrowseVariant] = useState<VideoVariantId>(variant);
  const [presetQuery, setPresetQuery] = useState('');

  useEffect(() => {
    setBrowseVariant(variant);
    setPresetQuery('');
  }, [variant]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const browseEntry = allModels.find((m) => m.variant.id === browseVariant) ?? allModels[0];
  const browseTier = browseEntry.tier;

  const presets = useMemo(() => {
    let list = getPresetsForModel(browseVariant);
    const q = presetQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q),
      );
    }
    return list;
  }, [browseVariant, presetQuery]);

  const handleModelTab = (tier: KrasoModelId, v: VideoVariantOption) => {
    if (v.requiresConfirm && v.id !== variant) {
      const ok = window.confirm(
        `${v.label} — дорогая генерация. Использовать только по явному запросу. Продолжить?`,
      );
      if (!ok) return;
    }
    setBrowseVariant(v.id);
  };

  const handlePresetPick = (preset: VideoMotionPreset) => {
    onSelect(preset, browseTier, browseVariant);
  };

  return (
    <div className="vs-preset-workspace">
      <header className="vs-preset-workspace__header">
        <div className="vs-preset-workspace__models custom-scrollbar" role="tablist" aria-label="Модели видео">
          {allModels.map(({ tier, variant: v }) => {
            const active = browseVariant === v.id;
            return (
              <button
                key={v.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => handleModelTab(tier, v)}
                className={`vs-picker-model-tab ${active ? 'vs-picker-model-tab--active' : ''}`}
              >
                <span className="truncate">{v.label}</span>
                {v.hasAudio && <Volume2 className="size-3 shrink-0 opacity-50" aria-hidden />}
              </button>
            );
          })}
        </div>

        <div className="vs-preset-workspace__search-wrap">
          <Search className="size-3.5 shrink-0 text-ink-faint pointer-events-none" aria-hidden />
          <input
            type="search"
            value={presetQuery}
            onChange={(e) => setPresetQuery(e.target.value)}
            placeholder="Поиск"
            aria-label="Поиск пресетов"
            className="vs-preset-workspace__search-input"
          />
        </div>

        <button
          type="button"
          onClick={onClose}
          className="vs-preset-workspace__close"
          aria-label="Закрыть выбор пресетов"
        >
          <X className="size-4" />
        </button>
      </header>

      <div className="vs-preset-workspace__body custom-scrollbar">
        <div className="vs-preset-workspace__grid">
          {presets.map((preset) => {
            const active = selectedId === preset.id && krasoModel === browseTier && variant === browseVariant;
            const isGeneral = preset.id === 'general';
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handlePresetPick(preset)}
                className={`vs-preset-card-btn ${active ? 'vs-preset-card-btn--active' : ''}`}
              >
                <div className="vs-preset-card-btn__media">
                  {preset.thumb ? (
                    <img src={preset.thumb} alt="" className="size-full object-cover" loading="lazy" />
                  ) : (
                    <div className={`vs-preset-card-btn__placeholder ${isGeneral ? 'vs-preset-card-btn__placeholder--general' : ''}`} />
                  )}
                  <div className="vs-preset-card-btn__shade" />
                  {active && (
                    <span className="vs-preset-card-btn__check" aria-hidden>
                      <Check className="size-3.5 text-on-primary" strokeWidth={3} />
                    </span>
                  )}
                  <p className="vs-preset-card-btn__title">{preset.title}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default VideoPresetPicker;
