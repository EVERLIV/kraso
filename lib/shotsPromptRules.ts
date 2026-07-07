export type ShotsShotId =
  | 'hero_wide'
  | 'medium_3q'
  | 'close_portrait'
  | 'side_profile'
  | 'hands_detail'
  | 'over_shoulder';

export interface ShotsShotPreset {
  id: ShotsShotId;
  title: string;
  description: string;
  promptSuffix: string;
}

export const SHOTS_COST = 90;
export const SHOTS_COUNT = 6;
export const SHOTS_UPSCALE_LIMIT = 4;
export const SHOTS_UPSCALE_COST = 20;
export const SHOTS_REGENERATE_COST = 15;

export const SHOTS_PRESETS: ShotsShotPreset[] = [
  {
    id: 'hero_wide',
    title: 'Общий план',
    description: 'Общий план',
    promptSuffix:
      'Shot type: full-body or three-quarter environmental portrait. Camera slightly farther away. Show the whole seated or standing composition and enough of the room to anchor the space.',
  },
  {
    id: 'medium_3q',
    title: 'Три четверти',
    description: 'Средний ракурс',
    promptSuffix:
      'Shot type: medium three-quarter angle portrait. Camera slightly off-center. Keep the same posture logic and same room, but tighten framing to the torso and chair or surrounding furniture.',
  },
  {
    id: 'close_portrait',
    title: 'Крупный портрет',
    description: 'Крупный портрет',
    promptSuffix:
      'Shot type: close portrait. Focus on face, hair, upper shoulders, and soft background blur. Keep expression natural and keep lighting direction exactly consistent with the reference photo.',
  },
  {
    id: 'side_profile',
    title: 'Профиль',
    description: 'Боковой ракурс',
    promptSuffix:
      'Shot type: clean side-angle or profile portrait. Keep the subject in the same seat or same place in the room, with a side-facing camera view that reveals the window or interior depth.',
  },
  {
    id: 'hands_detail',
    title: 'Детали',
    description: 'Детали рук и сцены',
    promptSuffix:
      'Shot type: tasteful detail shot. Focus on hands, lap, sleeves, chair arm, coffee cup, or nearby interior detail while keeping enough of the subject visible to remain clearly the same person and scene. Do not invent new props.',
  },
  {
    id: 'over_shoulder',
    title: 'Сзади',
    description: 'Сзади / over-shoulder',
    promptSuffix:
      'Shot type: over-shoulder or back-angle composition. Show the same hairstyle, shoulders, chair, and room perspective from behind or behind-side, while preserving the exact environment and keeping the subject recognizably the same person.',
  },
];

export function buildShotsMasterPrompt(): string {
  return [
    'Use the uploaded photo as the only source of truth.',
    'Keep the exact same person identity, face, hairstyle, skin tone, outfit, proportions, room, furniture, window placement, lighting direction, time of day, color palette, and overall mood.',
    'Do not redesign the location.',
    'Do not change clothes.',
    'Do not change hairstyle, makeup, or accessories.',
    'Do not add new props, people, or animals.',
    'Do not move to another room or another background.',
    'Do not make the person younger, older, thinner, more glamorous, or differently styled.',
    'The result must feel like the same real photoshoot captured seconds later in the same interior.',
    'Only vary camera angle, framing, lens distance, crop, and safe editorial detail composition.',
    'Keep realism high and avoid AI artifacts, duplicate limbs, extra fingers, warped furniture, or background drift.',
  ].join(' ');
}

export function buildShotPrompt(preset: ShotsShotPreset): string {
  return `${buildShotsMasterPrompt()} ${preset.promptSuffix}`;
}
