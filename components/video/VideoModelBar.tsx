import React, { useMemo, useState } from 'react';
import { Search, Volume2, X } from 'lucide-react';
import { KrasoModelId } from '../../lib/krasoModels';
import {
  getAllVideoVariants,
  getVariant,
  VideoVariantId,
  VideoVariantOption,
} from '../../lib/videoModels';
import { GEN_BAR_R } from '../genbar/genBarStyles';

interface VideoModelBarProps {
  krasoModel: KrasoModelId;
  variant: VideoVariantId;
  onSelect: (tier: KrasoModelId, v: VideoVariantOption) => void;
}

function VideoModelBar({ krasoModel, variant, onSelect }: VideoModelBarProps) {
  const [query, setQuery] = useState('');
  const all = useMemo(() => getAllVideoVariants(), []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return all;
    return all.filter(
      ({ variant: v }) =>
        v.label.toLowerCase().includes(q) || v.hint.toLowerCase().includes(q),
    );
  }, [all, query]);

  const handleSelect = (tier: KrasoModelId, v: VideoVariantOption) => {
    if (v.requiresConfirm && v.id !== variant) {
      const ok = window.confirm(
        `${v.label} — дорогая генерация. Использовать только по явному запросу. Продолжить?`,
      );
      if (!ok) return;
    }
    onSelect(tier, v);
  };

  const active = getVariant(krasoModel, variant);

  return (
    <div className="vs-model-bar shrink-0">
      <div className="vs-model-bar__scroll custom-scrollbar" role="tablist" aria-label="Модели видео">
        {filtered.map(({ tier, variant: v }) => {
          const selected = krasoModel === tier && variant === v.id;
          return (
            <button
              key={v.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => handleSelect(tier, v)}
              className={`vs-model-pill ${selected ? 'vs-model-pill--active' : ''}`}
            >
              <span className="truncate">{v.label}</span>
              {v.hasAudio && <Volume2 className="size-3 shrink-0 opacity-70" aria-hidden />}
            </button>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-xs text-ink-muted px-2 py-1.5">Ничего не найдено</p>
        )}
      </div>

      <div className={`vs-model-bar__search ${GEN_BAR_R}`}>
        <Search className="size-3.5 shrink-0 text-ink-faint" aria-hidden />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={active.label}
          aria-label="Поиск модели"
          className="vs-model-bar__input"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="vs-model-bar__clear"
            aria-label="Очистить поиск"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

export default VideoModelBar;
