import { GenModelId, ImageResolution } from '../types';

export type KrasoModelId = 'kraso-fast' | 'kraso-quality' | 'kraso-realism';

export interface KrasoModelOption {
  id: KrasoModelId;
  label: string;
  description: string;
  backendModel: GenModelId;
  defaultResolution: ImageResolution;
  /** Show 1K/2K/4K chips when true */
  allowsResolution: boolean;
  /** For realism — minimum resolution */
  minResolution?: ImageResolution;
  iconBg: string;
  badge?: string;
  featured?: boolean;
}

export const KRASO_MODELS: KrasoModelOption[] = [
  {
    id: 'kraso-fast',
    label: 'КрасоФаст',
    description: 'Быстрая генерация для идей и черновиков',
    backendModel: 'gemini-2.5-flash-image',
    defaultResolution: '1K',
    allowsResolution: false,
    iconBg: 'from-amber-400 to-orange-600',
    featured: true,
  },
  {
    id: 'kraso-quality',
    label: 'КрасоКачество',
    description: 'Чёткие детали и стабильный результат',
    backendModel: 'gemini-3-pro-image-preview',
    defaultResolution: '1K',
    allowsResolution: true,
    iconBg: 'from-lime-400 to-emerald-600',
    badge: 'NEW',
    featured: true,
  },
  {
    id: 'kraso-realism',
    label: 'КрасоРеализм',
    description: 'Максимальный фотореализм и натуральная кожа',
    backendModel: 'gemini-3-pro-image-preview',
    defaultResolution: '2K',
    allowsResolution: true,
    minResolution: '2K',
    iconBg: 'from-violet-500 to-fuchsia-700',
    featured: true,
  },
];

export function getKrasoModel(id: KrasoModelId): KrasoModelOption {
  return KRASO_MODELS.find((m) => m.id === id) ?? KRASO_MODELS[0];
}

export function applyKrasoModel(id: KrasoModelId, currentResolution?: ImageResolution): {
  model: GenModelId;
  resolution: ImageResolution;
} {
  const cfg = getKrasoModel(id);
  let resolution = cfg.defaultResolution;
  if (cfg.allowsResolution && currentResolution) {
    resolution = currentResolution;
    if (cfg.minResolution) {
      const order: ImageResolution[] = ['1K', '2K', '4K'];
      if (order.indexOf(resolution) < order.indexOf(cfg.minResolution)) {
        resolution = cfg.minResolution;
      }
    }
  }
  return { model: cfg.backendModel, resolution };
}

export function inferKrasoModel(model: GenModelId, resolution: ImageResolution): KrasoModelId {
  if (model === 'gemini-2.5-flash-image') return 'kraso-fast';
  if (resolution === '4K' || resolution === '2K') return 'kraso-realism';
  return 'kraso-quality';
}

export function calculateKrasoCost(id: KrasoModelId, resolution: ImageResolution): number {
  const cfg = getKrasoModel(id);
  if (cfg.id === 'kraso-fast') return 15;
  let base = 60;
  if (resolution === '2K') base = 90;
  if (resolution === '4K') base = 120;
  return base;
}

export function apiResolutionForKraso(id: KrasoModelId, resolution: ImageResolution): ImageResolution | undefined {
  const cfg = getKrasoModel(id);
  if (!cfg.allowsResolution) return undefined;
  return resolution;
}

export function resolutionsForKraso(id: KrasoModelId): ImageResolution[] {
  const cfg = getKrasoModel(id);
  if (!cfg.allowsResolution) return [];
  const all: ImageResolution[] = ['1K', '2K', '4K'];
  if (!cfg.minResolution) return all;
  const minIdx = all.indexOf(cfg.minResolution);
  return all.slice(minIdx);
}
