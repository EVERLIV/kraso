import React from 'react';
import { Upload, Loader2 } from 'lucide-react';

interface ShotsUploadStepProps {
  sourceImage: string | null;
  loading: boolean;
  aspectRatio: '3:4' | '4:5';
  onAspectRatioChange: (value: '3:4' | '4:5') => void;
  onPickFile: () => void;
  onGenerate: () => void;
}

function ShotsUploadStep({
  sourceImage,
  loading,
  aspectRatio,
  onAspectRatioChange,
  onPickFile,
  onGenerate,
}: ShotsUploadStepProps) {
  return (
    <div className="shots-upload">
      <div className="shots-upload__preview">
        {sourceImage ? (
          <img src={sourceImage} alt="Исходное фото" className="shots-upload__img" />
        ) : (
          <button type="button" onClick={onPickFile} className="shots-upload__empty">
            <Upload className="size-6" />
            <span>Загрузить фото</span>
          </button>
        )}
      </div>

      <div className="shots-upload__controls">
        <div>
          <h1 className="shots-title">Снимки</h1>
          <p className="shots-subtitle">
            Из одного фото создаём мини-фотосессию: тот же человек, тот же интерьер, тот же свет.
            Меняем только ракурс, крупность и детали кадра.
          </p>
        </div>

        <div className="shots-segment" role="radiogroup" aria-label="Формат кадра">
          {(['3:4', '4:5'] as const).map((ratio) => (
            <button
              key={ratio}
              type="button"
              role="radio"
              aria-checked={aspectRatio === ratio}
              onClick={() => onAspectRatioChange(ratio)}
              className={`shots-segment__btn ${aspectRatio === ratio ? 'shots-segment__btn--active' : ''}`}
            >
              {ratio}
            </button>
          ))}
        </div>

        <div className="shots-upload__actions">
          <button type="button" onClick={onPickFile} className="shots-btn shots-btn--ghost">
            Другое фото
          </button>
          <button
            type="button"
            onClick={onGenerate}
            disabled={!sourceImage || loading}
            className="shots-btn shots-btn--primary"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 motion-safe:animate-spin motion-reduce:animate-none" />
                Генерация…
              </>
            ) : (
              <>Создать 6 снимков</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ShotsUploadStep;
