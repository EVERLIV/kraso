import React, { useState } from 'react';
import { Check, ChevronUp, Zap, Gem, Aperture } from 'lucide-react';
import { KRASO_MODELS, KrasoModelId, getKrasoModel } from '../lib/krasoModels';
import {
  GEN_BAR_CHIP,
  GEN_BAR_CHIP_MUTED,
  GEN_BAR_DROPDOWN,
  GEN_BAR_DROPDOWN_ITEM,
  GEN_BAR_R,
} from './genbar/genBarStyles';

const ICONS = {
  'kraso-fast': Zap,
  'kraso-quality': Gem,
  'kraso-realism': Aperture,
} as const;

interface KrasoModelPickerProps {
  value: KrasoModelId;
  onChange: (id: KrasoModelId) => void;
  className?: string;
}

function KrasoModelPicker({ value, onChange, className = '' }: KrasoModelPickerProps) {
  const [open, setOpen] = useState(false);
  const active = getKrasoModel(value);
  const ActiveIcon = ICONS[value];

  return (
    <div className={`relative shrink-0 ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={GEN_BAR_CHIP}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <ActiveIcon className="size-4 text-primary shrink-0" strokeWidth={2} />
        <span className="truncate max-w-[7.5rem]">{active.label}</span>
        <ChevronUp className={`size-4 shrink-0 ${GEN_BAR_CHIP_MUTED} transition-transform ${open ? '' : 'rotate-180'}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden="true" />
          <div role="listbox" className={`${GEN_BAR_DROPDOWN} w-[11.5rem]`}>
            {KRASO_MODELS.map((m) => (
              <ModelRow
                key={m.id}
                model={m}
                selected={value === m.id}
                onSelect={() => { onChange(m.id); setOpen(false); }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ModelRow({
  model,
  selected,
  onSelect,
}: {
  model: (typeof KRASO_MODELS)[number];
  selected: boolean;
  onSelect: () => void;
}) {
  const Icon = ICONS[model.id];
  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      title={model.description}
      onClick={onSelect}
      className={`${GEN_BAR_DROPDOWN_ITEM} ${
        selected ? 'bg-primary/10 text-primary font-semibold' : 'text-ink-body hover:bg-white/5'
      }`}
    >
      <Icon className={`size-4 shrink-0 ${selected ? 'text-primary' : 'text-ink-muted'}`} strokeWidth={2} />
      <span className="flex-1 min-w-0 text-left truncate">{model.label}</span>
      {model.badge && (
        <span className={`text-[8px] uppercase px-0.5 ${GEN_BAR_R} font-bold leading-none py-0.5 bg-primary text-on-primary`}>
          {model.badge}
        </span>
      )}
      {selected && <Check className="size-3.5 shrink-0 text-primary" strokeWidth={3} aria-hidden="true" />}
    </button>
  );
}

export default KrasoModelPicker;
