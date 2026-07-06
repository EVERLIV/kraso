import type { ImageResolution } from '../types';
import {
  ATLAS_MODEL_IDS,
  ATLAS_REGISTRY_VERIFIED_AT,
  STUDIO_TIER_PRIMARY,
  type AtlasModelId,
  type StudioTier,
} from './atlasModelRegistry';
import type { KrasoModelId } from './krasoModels';

export interface AtlasStudioModelConfig {
  modelId: AtlasModelId;
  label: string;
  imageInputField: 'image' | 'images';
  supportsResolution: boolean;
  resolutionParam?: 'resolution';
}

const STUDIO_CONFIG: Record<StudioTier, AtlasStudioModelConfig> = {
  'kraso-fast': {
    modelId: STUDIO_TIER_PRIMARY['kraso-fast'],
    label: 'Nano Banana 2 Lite Edit',
    imageInputField: 'images',
    supportsResolution: false,
  },
  'kraso-quality': {
    modelId: STUDIO_TIER_PRIMARY['kraso-quality'],
    label: 'FLUX Kontext Pro',
    imageInputField: 'image',
    supportsResolution: false,
  },
  'kraso-realism': {
    modelId: STUDIO_TIER_PRIMARY['kraso-realism'],
    label: 'Nano Banana 2 Edit',
    imageInputField: 'images',
    supportsResolution: true,
    resolutionParam: 'resolution',
  },
};

export function krasoToStudioTier(id: KrasoModelId): StudioTier {
  return id;
}

export function getAtlasStudioConfig(krasoId: KrasoModelId): AtlasStudioModelConfig {
  return STUDIO_CONFIG[krasoToStudioTier(krasoId)];
}

export function atlasResolutionForKraso(
  krasoId: KrasoModelId,
  resolution: ImageResolution,
): '1K' | '2K' | '4K' | undefined {
  const cfg = getAtlasStudioConfig(krasoId);
  if (!cfg.supportsResolution) return undefined;
  return resolution;
}

export function getAtlasStudioModelId(krasoId: KrasoModelId): AtlasModelId {
  return getAtlasStudioConfig(krasoId).modelId;
}

export const ATLAS_STUDIO_REGISTRY_NOTE =
  `Atlas studio models verified ${ATLAS_REGISTRY_VERIFIED_AT}. ` +
  `Fast=${ATLAS_MODEL_IDS.nanoBananaLiteEdit}, ` +
  `Quality=${ATLAS_MODEL_IDS.fluxKontextPro}, ` +
  `Realism=${ATLAS_MODEL_IDS.nanoBanana2Edit}`;
