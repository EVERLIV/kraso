import React, { useMemo, useState } from 'react';

import { ArrowLeft, Check, Crown, Plus, Search } from 'lucide-react';

import { VIDEO_MOTION_PRESETS, VideoMotionPreset } from '../../lib/videoPresets';

import { GEN_BAR_R, GEN_BAR_CHIP } from '../genbar/genBarStyles';



export type VideoPresetFilter =

  | 'all'

  | 'new'

  | 'trending'

  | 'cinematic'

  | 'emotional'

  | 'viral'

  | 'social';



const FILTERS: { id: VideoPresetFilter; label: string }[] = [

  { id: 'all', label: 'Все' },

  { id: 'new', label: 'Новое' },

  { id: 'trending', label: 'В тренде' },

  { id: 'cinematic', label: 'Камера' },

  { id: 'emotional', label: 'Эмоции' },

  { id: 'viral', label: 'Вирусные' },

  { id: 'social', label: 'Соцсети' },

];



const ASPECT_CLASSES = ['aspect-[3/4]', 'aspect-[4/5]', 'aspect-[2/3]', 'aspect-[5/6]', 'aspect-[3/5]'];



interface VideoPresetPickerProps {
  selectedId?: string | null;
  onSelect: (preset: VideoMotionPreset) => void;
  onBack: () => void;
}



function FilterChip({

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

      className={`shrink-0 h-8 px-3 text-xs font-semibold ${GEN_BAR_R} border transition-colors ${

        active

          ? 'bg-primary text-on-primary border-primary shadow-pill-active'

          : 'bg-surface-muted text-ink-body border-[var(--border-soft)] hover:border-[var(--border-color)]'

      }`}

    >

      {children}

    </button>

  );

}



function VideoPresetPicker({
  selectedId,
  onSelect,
  onBack,

}: VideoPresetPickerProps) {

  const [filter, setFilter] = useState<VideoPresetFilter>('all');

  const [query, setQuery] = useState('');



  const items = useMemo(() => {

    let list = VIDEO_MOTION_PRESETS;

    if (filter === 'new') list = list.slice(0, 6);

    else if (filter === 'trending') list = [...list].sort((a, b) => (b.thumb ? 1 : 0) - (a.thumb ? 1 : 0));

    else if (filter !== 'all') list = list.filter((p) => p.category === filter);

    if (query.trim()) {

      const q = query.toLowerCase();

      list = list.filter(

        (p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q),

      );

    }

    return list;

  }, [filter, query]);



  return (

    <div className="flex flex-col h-full min-h-0">

      <div className="shrink-0 px-3 md:px-4 pt-3 md:pt-4 pb-2">

        <div className="flex items-center gap-2 mb-3">

          <button

            type="button"

            onClick={onBack}

            className={`${GEN_BAR_CHIP} !h-8 !px-2.5`}

            aria-label="Назад"

          >

            <ArrowLeft className="size-3.5" />

          </button>

          <h2 className="text-xs font-bold uppercase text-ink flex-1">Пресеты движения</h2>

          <div className="relative hidden sm:block w-44">

            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-ink-faint" />

            <input

              value={query}

              onChange={(e) => setQuery(e.target.value)}

              placeholder="Поиск"

              className={`w-full h-8 pl-8 pr-2 ${GEN_BAR_R} border border-[var(--border-soft)] bg-surface-muted text-xs text-ink placeholder:text-ink-faint outline-none`}

            />

          </div>

        </div>



        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-0.5">

          {FILTERS.map((f) => (

            <FilterChip key={f.id} active={filter === f.id} onClick={() => setFilter(f.id)}>

              {f.label}

            </FilterChip>

          ))}

        </div>

      </div>



      <div className="flex-1 overflow-y-auto custom-scrollbar px-3 md:px-4 py-3">

        <div className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-3">

          {items.map((preset, i) => {

            const active = selectedId === preset.id;

            const aspect = ASPECT_CLASSES[i % ASPECT_CLASSES.length];

            const showBadge = i < 3;

            return (

              <button

                key={preset.id}

                type="button"

                onClick={() => onSelect(preset)}

                className={`group relative w-full mb-3 break-inside-avoid rounded-xl overflow-hidden bg-card-light border-2 transition-colors duration-150 text-left ${

                  active ? 'border-primary ring-2 ring-primary/40' : 'border-[var(--border-color)] hover:border-primary'

                }`}

              >

                <div className={`relative ${aspect} bg-surface-muted`}>

                  {preset.thumb ? (

                    <img src={preset.thumb} alt="" className="absolute inset-0 size-full object-cover" loading="lazy" />

                  ) : (

                    <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-black/60" />

                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                  {showBadge && !active && (
                    <span className="absolute top-2 left-2 inline-flex items-center gap-1 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-md bg-black/55 text-white/90 border border-white/10">
                      <Crown className="size-2.5 text-primary" />
                      Топ
                    </span>
                  )}

                  <div className={`absolute top-2 right-2 size-7 rounded-full bg-primary flex items-center justify-center transition-opacity pointer-events-none ${active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>

                    {active ? <Check className="size-3.5 text-on-primary" strokeWidth={3} /> : <Plus className="size-3.5 text-on-primary" />}

                  </div>

                  <p className="absolute bottom-0 inset-x-0 p-3 text-sm font-black uppercase text-white leading-tight text-balance">

                    {preset.title}

                  </p>

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

