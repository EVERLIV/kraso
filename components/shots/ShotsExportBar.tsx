import React from 'react';
import { Download, RefreshCw, ScanEye } from 'lucide-react';

interface ShotsExportBarProps {
  selectedCount: number;
  loading: boolean;
  onUpscaleSelected: () => void;
  onDownloadSelected: () => void;
  onDownloadGrid: () => void;
  onRegenerateAll: () => void;
}

function ShotsExportBar({
  selectedCount,
  loading,
  onUpscaleSelected,
  onDownloadSelected,
  onDownloadGrid,
  onRegenerateAll,
}: ShotsExportBarProps) {
  return (
    <div className="shots-export">
      <button type="button" onClick={onUpscaleSelected} disabled={!selectedCount || loading} className="shots-btn shots-btn--primary">
        <ScanEye className="size-4" /> Апскейл выбранных
      </button>
      <button type="button" onClick={onDownloadSelected} disabled={!selectedCount} className="shots-btn shots-btn--ghost">
        <Download className="size-4" /> Скачать выбранные
      </button>
      <button type="button" onClick={onDownloadGrid} disabled={loading} className="shots-btn shots-btn--ghost">
        <Download className="size-4" /> Скачать сетку
      </button>
      <button type="button" onClick={onRegenerateAll} disabled={loading} className="shots-btn shots-btn--ghost">
        <RefreshCw className="size-4" /> Пересоздать всё
      </button>
    </div>
  );
}

export default ShotsExportBar;
