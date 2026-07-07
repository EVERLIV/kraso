import React from 'react';
import { Download, RefreshCw, ScanEye } from 'lucide-react';
import { ShotsGridItem } from '../../services/shotsService';

interface ShotsGridStepProps {
  shots: ShotsGridItem[];
  selectedCount: number;
  onToggleSelect: (shotId: ShotsGridItem['shotId']) => void;
  onDownloadShot: (shot: ShotsGridItem) => void;
  onRegenerateShot: (shotId: ShotsGridItem['shotId']) => void;
  onUpscaleShot: (shotId: ShotsGridItem['shotId']) => void;
  busyShotIds: Set<string>;
}

function ShotsGridStep({
  shots,
  selectedCount,
  onToggleSelect,
  onDownloadShot,
  onRegenerateShot,
  onUpscaleShot,
  busyShotIds,
}: ShotsGridStepProps) {
  return (
    <div className="shots-grid">
      <div className="shots-grid__head">
        <div>
          <h2 className="shots-title shots-title--small">Сетка из 6 кадров</h2>
          <p className="shots-subtitle">
            Выберите снимки для апскейла или скачайте их по одному. Выбрано: {selectedCount}
          </p>
        </div>
      </div>

      <div className="shots-grid__tiles">
        {shots.map((shot) => {
          const currentSrc = shot.upscaled || shot.image;
          const busy = busyShotIds.has(shot.shotId);
          return (
            <article key={shot.shotId} className="shots-card">
              <div className="shots-card__media">
                <img src={currentSrc} alt={shot.title} className="shots-card__img" />
                <label className="shots-card__check">
                  <input
                    type="checkbox"
                    checked={Boolean(shot.selected)}
                    onChange={() => onToggleSelect(shot.shotId)}
                  />
                  <span>{shot.selected ? 'Выбрано' : 'Выбрать'}</span>
                </label>
              </div>

              <div className="shots-card__meta">
                <div>
                  <div className="shots-card__title">{shot.title}</div>
                  <div className="shots-card__desc">{shot.description}</div>
                </div>
                <div className="shots-card__actions">
                  <button type="button" onClick={() => onUpscaleShot(shot.shotId)} disabled={busy} className="shots-chip">
                    <ScanEye className="size-3.5" /> {busy ? '...' : 'Апскейл'}
                  </button>
                  <button type="button" onClick={() => onDownloadShot(shot)} className="shots-chip">
                    <Download className="size-3.5" /> Скачать
                  </button>
                  <button type="button" onClick={() => onRegenerateShot(shot.shotId)} disabled={busy} className="shots-chip">
                    <RefreshCw className="size-3.5" /> Пересоздать
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export default ShotsGridStep;
