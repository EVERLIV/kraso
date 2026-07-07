import React, { useEffect, useMemo, useRef, useState } from 'react';
import ShotsUploadStep from './shots/ShotsUploadStep';
import ShotsGridStep from './shots/ShotsGridStep';
import ShotsExportBar from './shots/ShotsExportBar';
import { generateShotsGrid, regenerateShotsShot, ShotsGridItem, upscaleShotsShot } from '../services/shotsService';
import { AspectRatio, ImageResolution } from '../types';
import { saveGenerationToHistory, uploadImageToStorage } from '../services/firebaseService';
import { useAuth } from '../contexts/AuthContext';
import { KrasoModelId } from '../lib/krasoModels';
import { SHOTS_COST, SHOTS_COUNT, SHOTS_REGENERATE_COST, SHOTS_UPSCALE_COST, SHOTS_UPSCALE_LIMIT } from '../lib/shotsPromptRules';
import './shots/shotsTheme.css';

interface ShotsViewProps {
  credits: number;
  onUpdateCredits: (val: number) => void;
  initialImage?: string | null;
}

type StepId = 1 | 2 | 3;

function downloadDataUrl(dataUrl: string, filename: string) {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  link.click();
}

async function buildGridExport(shots: ShotsGridItem[], aspectRatio: '3:4' | '4:5'): Promise<string> {
  const canvas = document.createElement('canvas');
  const cols = 3;
  const rows = 2;
  const tileWidth = 720;
  const tileHeight = aspectRatio === '4:5' ? 900 : 960;
  const gap = 24;
  const padding = 24;
  canvas.width = cols * tileWidth + (cols - 1) * gap + padding * 2;
  canvas.height = rows * tileHeight + (rows - 1) * gap + padding * 2;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas unavailable');

  ctx.fillStyle = '#0b0c10';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const images = await Promise.all(
    shots.map(
      (shot) =>
        new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = shot.upscaled || shot.image;
        }),
    ),
  );

  images.forEach((img, index) => {
    const row = Math.floor(index / cols);
    const col = index % cols;
    const x = padding + col * (tileWidth + gap);
    const y = padding + row * (tileHeight + gap);
    ctx.drawImage(img, x, y, tileWidth, tileHeight);
  });

  return canvas.toDataURL('image/jpeg', 0.92);
}

function ShotsView({ credits, onUpdateCredits, initialImage = null }: ShotsViewProps) {
  const { user } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [sourceImage, setSourceImage] = useState<string | null>(initialImage);
  const [storedOriginalUrl, setStoredOriginalUrl] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<Extract<AspectRatio, '3:4' | '4:5'>>('3:4');
  const [krasoTier] = useState<KrasoModelId>('kraso-quality');
  const [resolution] = useState<ImageResolution>('1K');
  const [availableCredits, setAvailableCredits] = useState(credits);
  const [shots, setShots] = useState<ShotsGridItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busyShotIds, setBusyShotIds] = useState<Set<string>>(new Set());
  const creditsRef = useRef(credits);

  useEffect(() => {
    if (initialImage) setSourceImage(initialImage);
  }, [initialImage]);

  useEffect(() => {
    creditsRef.current = credits;
    setAvailableCredits(credits);
  }, [credits]);

  const applyCreditCharge = (amount: number) => {
    const next = Math.max(0, creditsRef.current - amount);
    creditsRef.current = next;
    setAvailableCredits(next);
    onUpdateCredits(next);
  };

  const step: StepId = shots.length ? 2 : 1;
  const selectedShots = useMemo(() => shots.filter((s) => s.selected), [shots]);

  const pickFile = () => fileRef.current?.click();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setSourceImage(ev.target?.result as string);
      setStoredOriginalUrl(null);
      setShots([]);
      setError(null);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const ensureStoredOriginal = async () => {
    if (!user || !sourceImage) return sourceImage;
    if (storedOriginalUrl) return storedOriginalUrl;
    const uploaded = await uploadImageToStorage(user.uid, sourceImage, 'original');
    setStoredOriginalUrl(uploaded);
    return uploaded;
  };

  const persistShotsToHistory = async (items: ShotsGridItem[]) => {
    if (!user || !sourceImage) return;
    const originalUrl = await ensureStoredOriginal();
    for (const item of items) {
      const storageUrl = await uploadImageToStorage(user.uid, item.image, 'generated');
      const docId = await saveGenerationToHistory(user.uid, {
        original: originalUrl,
        generated: storageUrl,
        prompt: `[SHOTS:${item.shotId}] ${item.prompt}`,
        source: 'shots',
      });
      if (!docId || docId.startsWith('temp_') || docId.startsWith('local_')) {
        throw new Error('Не удалось сохранить снимок в историю');
      }
    }
  };

  const persistOneShot = async (shot: ShotsGridItem, dataUrl: string, prefix = '[SHOTS]') => {
    if (!user || !sourceImage) return;
    const originalUrl = await ensureStoredOriginal();
    const storageUrl = await uploadImageToStorage(user.uid, dataUrl, 'generated');
    const docId = await saveGenerationToHistory(user.uid, {
      original: originalUrl,
      generated: storageUrl,
      prompt: `${prefix}[${shot.shotId}] ${shot.prompt}`,
      source: 'shots',
    });
    if (!docId || docId.startsWith('temp_') || docId.startsWith('local_')) {
      throw new Error('Не удалось сохранить снимок в историю');
    }
  };

  const handleGenerate = async () => {
    if (!sourceImage || !user) return;
    if (availableCredits < SHOTS_COST) {
      setError(`Недостаточно кредитов (${SHOTS_COST} кр)`);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const generatedShots = await generateShotsGrid(sourceImage, {
        aspectRatio,
        krasoTier,
        resolution,
      });
      applyCreditCharge(SHOTS_COST);
      setShots(generatedShots);
      try {
        await persistShotsToHistory(generatedShots);
      } catch (persistErr) {
        console.error('[ShotsView] persist failed:', persistErr);
        setError('Сетка создана, но не сохранилась в историю. Скачивание доступно.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось собрать сетку снимков');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSelect = (shotId: ShotsGridItem['shotId']) => {
    setShots((prev) => {
      const selectedCount = prev.filter((s) => s.selected).length;
      return prev.map((shot) => {
        if (shot.shotId !== shotId) return shot;
        const nextSelected = !shot.selected;
        if (nextSelected && selectedCount >= SHOTS_UPSCALE_LIMIT) return shot;
        return { ...shot, selected: nextSelected };
      });
    });
  };

  const updateBusy = (shotId: string, busy: boolean) => {
    setBusyShotIds((prev) => {
      const next = new Set(prev);
      if (busy) next.add(shotId);
      else next.delete(shotId);
      return next;
    });
  };

  const handleUpscaleShot = async (shotId: ShotsGridItem['shotId']) => {
    const shot = shots.find((s) => s.shotId === shotId);
    if (!shot || !user) return;
    if (availableCredits < SHOTS_UPSCALE_COST) {
      setError(`Недостаточно кредитов (${SHOTS_UPSCALE_COST} кр)`);
      return;
    }
    updateBusy(shotId, true);
    setError(null);
    try {
      const upscaled = await upscaleShotsShot(shot.upscaled || shot.image, {
        aspectRatio,
        krasoTier,
        resolution,
      });
      applyCreditCharge(SHOTS_UPSCALE_COST);
      await persistOneShot(shot, upscaled, '[SHOTS_UPSCALED]');
      setShots((prev) => prev.map((item) => (item.shotId === shotId ? { ...item, upscaled } : item)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка апскейла');
    } finally {
      updateBusy(shotId, false);
    }
  };

  const handleUpscaleSelected = async () => {
    if (!selectedShots.length) return;
    const selected = selectedShots.slice(0, SHOTS_UPSCALE_LIMIT);
    if (availableCredits < selected.length * SHOTS_UPSCALE_COST) {
      setError(`Недостаточно кредитов (${selected.length * SHOTS_UPSCALE_COST} кр)`);
      return;
    }
    for (const shot of selected) {
      // eslint-disable-next-line no-await-in-loop
      await handleUpscaleShot(shot.shotId);
    }
  };

  const regenerateOne = async (shotId: ShotsGridItem['shotId']) => {
    if (!sourceImage || !user) return;
    if (availableCredits < SHOTS_REGENERATE_COST) {
      setError(`Недостаточно кредитов (${SHOTS_REGENERATE_COST} кр)`);
      return;
    }
    updateBusy(shotId, true);
    try {
      const replacement = await regenerateShotsShot(sourceImage, shotId, {
        aspectRatio,
        krasoTier,
        resolution,
      });
      applyCreditCharge(SHOTS_REGENERATE_COST);
      await persistOneShot(replacement, replacement.image, '[SHOTS_RETRY]');
      setShots((prev) => prev.map((item) => (item.shotId === shotId ? { ...replacement, selected: item.selected } : item)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось пересобрать кадр');
    } finally {
      updateBusy(shotId, false);
    }
  };

  const handleDownloadShot = (shot: ShotsGridItem) => {
    downloadDataUrl(shot.upscaled || shot.image, `shots-${shot.shotId}.jpg`);
  };

  const handleDownloadSelected = () => {
    selectedShots.forEach((shot) => handleDownloadShot(shot));
  };

  const handleDownloadGrid = async () => {
    if (!shots.length) return;
    try {
      const grid = await buildGridExport(shots.slice(0, SHOTS_COUNT), aspectRatio);
      downloadDataUrl(grid, `shots-grid-${Date.now()}.jpg`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось собрать сетку');
    }
  };

  return (
    <div className="shots-root">
      <input type="file" ref={fileRef} className="hidden" accept="image/*" aria-label="Загрузить фото для снимков" onChange={handleFileUpload} />
      <div className="shots-shell">
        <div className="shots-steps" aria-label="Progress">
          {[1, 2, 3].map((n) => (
            <div key={n} className={`shots-step ${n === step || (n === 3 && shots.some((s) => s.upscaled)) ? 'shots-step--active' : ''}`}>
              <span className="shots-step__dot">{n}</span>
              <span>{n === 1 ? 'Загрузка' : n === 2 ? 'Сетка' : 'Апскейл'}</span>
            </div>
          ))}
        </div>

        <ShotsUploadStep
          sourceImage={sourceImage}
          loading={loading}
          aspectRatio={aspectRatio}
          onAspectRatioChange={setAspectRatio}
          onPickFile={pickFile}
          onGenerate={handleGenerate}
        />

        {error && <p className="shots-error" role="alert">{error}</p>}

        {shots.length > 0 && (
          <>
            <ShotsGridStep
              shots={shots}
              selectedCount={selectedShots.length}
              onToggleSelect={handleToggleSelect}
              onDownloadShot={handleDownloadShot}
              onRegenerateShot={regenerateOne}
              onUpscaleShot={handleUpscaleShot}
              busyShotIds={busyShotIds}
            />
            <ShotsExportBar
              selectedCount={selectedShots.length}
              loading={loading || busyShotIds.size > 0}
              onUpscaleSelected={handleUpscaleSelected}
              onDownloadSelected={handleDownloadSelected}
              onDownloadGrid={handleDownloadGrid}
              onRegenerateAll={handleGenerate}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default ShotsView;
