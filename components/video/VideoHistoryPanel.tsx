import React, { useMemo } from 'react';
import { Loader2, MoreHorizontal, Play, RotateCcw, XCircle } from 'lucide-react';
import { GeneratedImage } from '../../types';
import { getDisplayPrompt } from '../../lib/promptUtils';

export const VIDEO_GEN_FAILED = '__FAILED__';

export type VideoHistoryLayout = 'grid' | 'list';

function groupByDay(items: GeneratedImage[]): { label: string; items: GeneratedImage[] }[] {
  const map = new Map<string, { sortKey: number; items: GeneratedImage[] }>();
  for (const item of items) {
    const sec = item.createdAt?.seconds ?? Math.floor(Date.now() / 1000);
    const d = new Date(sec * 1000);
    const label = d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
    const bucket = map.get(label);
    if (bucket) bucket.items.push(item);
    else map.set(label, { sortKey: sec, items: [item] });
  }
  return Array.from(map.entries())
    .sort((a, b) => b[1].sortKey - a[1].sortKey)
    .map(([label, { items: groupItems }]) => ({ label, items: groupItems }));
}

function isFailed(item: GeneratedImage) {
  return item.generated === VIDEO_GEN_FAILED;
}

function isPending(item: GeneratedImage) {
  return !item.generated;
}

function isValidVideo(item: GeneratedImage) {
  return !isPending(item) && !isFailed(item)
    && (item.generated.startsWith('http') || item.generated.startsWith('blob:'));
}

interface VideoHistoryPanelProps {
  items: GeneratedImage[];
  layout: VideoHistoryLayout;
  gridCols?: number;
  isGenerating?: boolean;
  status?: string;
}

function FailedCard() {
  return (
    <div className="vs-failed-card">
      <span className="vs-error-pill vs-error-pill--failed">
        <XCircle className="size-3.5" />
        Ошибка
      </span>
      <span className="vs-error-pill vs-error-pill--refund">
        <RotateCcw className="size-3.5" />
        Кредиты возвращены
      </span>
    </div>
  );
}

function VideoGridCard({ item }: { item: GeneratedImage }) {
  const pending = isPending(item);
  const failed = isFailed(item);
  const valid = isValidVideo(item);

  if (failed) {
    return <FailedCard />;
  }

  return (
    <div className="vs-result-card">
      <div className="vs-result-media">
        {pending ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-[var(--vs-text-dim)]" aria-busy="true">
            <Loader2 className="size-6 animate-spin motion-reduce:animate-none text-[var(--vs-lime)]" />
            <span className="text-[11px]">Генерация…</span>
          </div>
        ) : valid ? (
          <>
            <video
              src={item.generated}
              className="size-full object-cover"
              muted
              loop
              playsInline
              preload="metadata"
              onMouseOver={(e) => (e.currentTarget as HTMLVideoElement).play?.()}
              onMouseOut={(e) => (e.currentTarget as HTMLVideoElement).pause?.()}
            />
            <div className="vs-play-btn">
              <span><Play className="size-4 fill-white text-white ml-0.5" /></span>
            </div>
          </>
        ) : null}
        <input type="checkbox" className="vs-card-check" aria-label="Выбрать" onClick={(e) => e.stopPropagation()} />
        <button type="button" className="vs-card-menu" aria-label="Действия">
          <MoreHorizontal className="size-4" />
        </button>
      </div>
    </div>
  );
}

function VideoListRow({ item }: { item: GeneratedImage }) {
  const pending = isPending(item);
  const failed = isFailed(item);
  const valid = isValidVideo(item);
  const prompt = getDisplayPrompt(item) || 'Видео';

  return (
    <div className="vs-list-row">
      <div className="vs-list-thumb">
        {failed ? (
          <div className="size-full flex items-center justify-center bg-[var(--vs-error-bg)]">
            <XCircle className="size-4 text-[var(--vs-error-text-1)]" />
          </div>
        ) : pending ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="size-4 animate-spin text-[var(--vs-lime)]" />
          </div>
        ) : valid ? (
          <>
            <video src={item.generated} className="size-full object-cover" muted playsInline preload="metadata" />
            <span className="absolute inset-0 flex items-center justify-center bg-black/30">
              <Play className="size-3 fill-white text-white" />
            </span>
          </>
        ) : null}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-semibold text-[var(--vs-text)] truncate">{prompt}</p>
        <p className="text-[11px] text-[var(--vs-text-dim)] mt-0.5">
          {failed ? 'Ошибка · кредиты возвращены' : pending ? 'Генерация…' : 'Готово'}
        </p>
      </div>
      <button type="button" className="vs-card-menu !static text-[var(--vs-text-muted)]" aria-label="Действия">
        <MoreHorizontal className="size-4" />
      </button>
    </div>
  );
}

function VideoHistoryPanel({ items, layout, gridCols = 4, isGenerating, status }: VideoHistoryPanelProps) {
  const groups = useMemo(() => groupByDay(items), [items]);

  if (!items.length && !isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 py-16 px-6 text-center">
        <p className="text-[13px] text-ink-muted text-pretty">
          Пока нет видео. Загрузите фото слева и нажмите «Создать».
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar pb-5">
      {groups.map((group) => (
        <section key={group.label} className="mb-8">
          <div className="vs-date-header">
            <input type="checkbox" className="vs-date-check" aria-label={`Выбрать все за ${group.label}`} />
            <h3 className="vs-date-label">{group.label}</h3>
          </div>
          {layout === 'grid' ? (
            <div
              className="vs-result-grid"
              style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}
            >
              {group.items.map((item, i) => (
                <VideoGridCard key={item.id || `${group.label}-${i}`} item={item} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {group.items.map((item, i) => (
                <VideoListRow key={item.id || `${group.label}-${i}`} item={item} />
              ))}
            </div>
          )}
        </section>
      ))}
      {isGenerating && items.every((i) => i.generated && !isFailed(i)) && (
        <section className="mb-8">
          <div className="vs-date-header">
            <h3 className="vs-date-label">Сейчас</h3>
          </div>
          <div className="vs-list-row">
            <Loader2 className="size-4 animate-spin text-[var(--vs-lime)] shrink-0" />
            <span className="text-[13px] text-[var(--vs-text-muted)]">{status || 'Генерация видео…'}</span>
          </div>
        </section>
      )}
    </div>
  );
}

export default VideoHistoryPanel;
