import type { ImageResolution } from '../types';
import {
  FAL_MODEL_IDS,
  FAL_REGISTRY_VERIFIED_AT,
  STUDIO_TIER_PRIMARY,
  type FalModelId,
  type StudioTier,
} from './falModelRegistry';
import type { KrasoModelId } from './krasoModels';

export interface FalStudioModelConfig {
  modelId: FalModelId;
  label: string;
  imageInputField: 'image_url' | 'image_urls';
  supportsResolution: boolean;
  /** Map app resolution to FAL param when supported */
  resolutionParam?: 'resolution';
}

const STUDIO_CONFIG: Record<StudioTier, FalStudioModelConfig> = {
  'kraso-fast': {
    modelId: STUDIO_TIER_PRIMARY['kraso-fast'],
    label: 'Nano Banana 2 Lite Edit',
    imageInputField: 'image_urls',
    supportsResolution: false,
  },
  'kraso-quality': {
    modelId: STUDIO_TIER_PRIMARY['kraso-quality'],
    label: 'FLUX Kontext Pro',
    imageInputField: 'image_url',
    supportsResolution: false,
  },
  'kraso-realism': {
    modelId: STUDIO_TIER_PRIMARY['kraso-realism'],
    label: 'Nano Banana Pro Edit',
    imageInputField: 'image_urls',
    supportsResolution: true,
    resolutionParam: 'resolution',
  },
};

export function krasoToStudioTier(id: KrasoModelId): StudioTier {
  return id;
}

export function getFalStudioConfig(krasoId: KrasoModelId): FalStudioModelConfig {
  return STUDIO_CONFIG[krasoToStudioTier(krasoId)];
}

/** Resolution for nano-banana-pro/edit API */
export function falResolutionForKraso(
  krasoId: KrasoModelId,
  resolution: ImageResolution,
): '1K' | '2K' | '4K' | undefined {
  const cfg = getFalStudioConfig(krasoId);
  if (!cfg.supportsResolution) return undefined;
  return resolution;
}

export function getFalStudioModelId(krasoId: KrasoModelId): FalModelId {
  return getFalStudioConfig(krasoId).modelId;
}

/** For display / debugging — not wired to generation yet */
export const FAL_STUDIO_REGISTRY_NOTE =
  `FAL studio models verified ${FAL_REGISTRY_VERIFIED_AT}. ` +
  `Fast=${FAL_MODEL_IDS.nanoBananaLiteEdit}, ` +
  `Quality=${FAL_MODEL_IDS.fluxKontextPro}, ` +
  `Realism=${FAL_MODEL_IDS.nanoBananaProEdit}`;
