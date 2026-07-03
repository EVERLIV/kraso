import React from 'react';
import { ChevronRight, Pencil, Sparkles, Video, Volume2, Wand2 } from 'lucide-react';
import {
  GEN_BAR_FORM,
  GEN_BAR_GENERATE,
  GEN_BAR_R,
} from '../genbar/genBarStyles';
import '../video/videoTheme.css';

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex items-center gap-3 border-b border-[var(--border-strong)] pb-4">
    <span className="text-primary"><Video className="w-5 h-5" /></span>
    <h2 className="text-sm font-bold text-ink uppercase tracking-widest">{children}</h2>
  </div>
);

/** Live reference for Video Studio — mirrors production classes */
function VideoStudioDesignSection() {
  return (
    <section className="space-y-6">
      <SectionTitle>Video Studio</SectionTitle>
      <p className="text-xs text-ink-muted text-pretty max-w-3xl">
        Спецификация: <code className="text-ink font-mono text-[11px]">docs/design-system/video-studio.md</code>.
        Токены: <code className="text-ink font-mono text-[11px]">genBarStyles.ts</code>,{' '}
        <code className="text-ink font-mono text-[11px]">videoStudioTokens.ts</code>.
      </p>

      <div className="video-studio bg-background-light rounded-xl border border-[var(--border-soft)] p-4">
        <div className="flex flex-col lg:flex-row gap-4 min-h-[420px]">
          {/* Sidebar sample */}
          <aside className={`${GEN_BAR_FORM} vs-sidebar w-full max-w-[300px] flex flex-col !p-0 shrink-0`}>
            <div className="vs-mode-tabs px-1">
              <span className="vs-mode-tab vs-mode-tab--active">Создать видео</span>
              <span className="vs-mode-tab opacity-35">Редактировать</span>
            </div>
            <div className="px-4 pt-3 pb-2 space-y-3">
              <div className={`vs-preset-card ${GEN_BAR_R} relative h-[108px]`}>
                <div className="absolute inset-0 vs-preset-card__bg-general" />
                <div className="vs-preset-card__overlay" />
                <span className="vs-preset-card__change pointer-events-none">
                  <Pencil className="size-3" /> Сменить
                </span>
                <figcaption className="vs-preset-card__caption">
                  <p className="text-sm font-black uppercase text-primary">Обычная Генерация</p>
                  <p className="vs-preset-card__model text-[11px] text-white font-bold mt-0.5">Kling 3.0</p>
                </figcaption>
              </div>

              <button type="button" className={`vs-model-row ${GEN_BAR_R} w-full`} tabIndex={-1}>
                <span className="vs-model-row__label">Модель</span>
                <span className="vs-model-row__value">Kling 3.0</span>
                <ChevronRight className="size-3.5 text-ink-muted" />
              </button>

              <div className={`vs-prompt-block ${GEN_BAR_R}`}>
                <p className="text-xs text-ink-muted mb-1">Промпт</p>
                <div className="vs-prompt-block__input min-h-[72px] text-xs text-ink-faint">Опишите сцену…</div>
                <div className="vs-prompt-badges static !relative !left-0 !right-0 !bottom-0 mt-2">
                  <span className="vs-prompt-badge vs-prompt-badge--active"><Wand2 className="size-3" /> Улучшение вкл.</span>
                  <span className="vs-prompt-badge">Выкл.</span>
                  <span className="vs-prompt-badge vs-prompt-badge--active"><Volume2 className="size-3" /> Звук вкл.</span>
                </div>
              </div>
            </div>
            <div className="vs-sidebar__dock px-4 pb-4">
              <div className="vs-param-row">
                {['5 с', '16:9', '720p'].map((l) => (
                  <span key={l} className={`${GEN_BAR_R} flex-1 h-9 inline-flex items-center justify-center text-xs font-medium bg-surface-muted border border-[var(--border-soft)]`}>{l}</span>
                ))}
              </div>
              <button type="button" className={`${GEN_BAR_GENERATE} w-full !h-11 mt-3`} tabIndex={-1}>
                <span>Создать</span><Sparkles className="size-3.5" /><span>90</span>
              </button>
            </div>
          </aside>

          {/* Gallery sample */}
          <div className={`vs-preset-workspace flex-1 min-w-0`}>
            <header className="vs-preset-workspace__header">
              <div className="vs-preset-workspace__models">
                <span className="vs-picker-model-tab">Wan 2.5</span>
                <span className="vs-picker-model-tab vs-picker-model-tab--active">Kling 3.0</span>
                <span className="vs-picker-model-tab">Seedance 1.5 Pro</span>
              </div>
              <div className="vs-preset-workspace__search-wrap">
                <span className="text-[11px] text-ink-faint">Поиск</span>
              </div>
            </header>
            <div className="vs-preset-workspace__body">
              <div className="vs-preset-workspace__grid max-w-md">
                <div className="vs-preset-card-btn vs-preset-card-btn--active">
                  <div className="vs-preset-card-btn__media">
                    <div className="vs-preset-card-btn__placeholder vs-preset-card-btn__placeholder--general" />
                    <div className="vs-preset-card-btn__shade" />
                    <p className="vs-preset-card-btn__title">Обычная Генерация</p>
                  </div>
                </div>
                <div className="vs-preset-card-btn">
                  <div className="vs-preset-card-btn__media">
                    <div className="vs-preset-card-btn__placeholder" />
                    <div className="vs-preset-card-btn__shade" />
                    <p className="vs-preset-card-btn__title">Папарацци</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ul className="text-xs text-ink-muted space-y-1.5 list-disc pl-5 max-w-3xl">
        <li>Radius панелей: <strong>6px</strong> · карточки в галерее: <strong>12px</strong></li>
        <li>Без горизонтальных разделителей между секциями сайдбара и галереи</li>
        <li>Модель в сайдбаре — только после выбора в галерее</li>
        <li>Бейджи промпта и звука — внутри поля ввода</li>
      </ul>
    </section>
  );
}

export default VideoStudioDesignSection;
