export type MarketingVideoModelId = 'kling-3.0-pro' | 'veo-3.1' | 'seedance-1.5-pro';

/** Kling negative field — list items directly, not "no X". */
export const NEGATIVE_KLING =
    'distorted hands, extra fingers, third hand, melted face, deformed limbs, ' +
    'background change, identity drift, face swap, watermark, subtitles, text overlay, jitter, blur';

/** Veo / Seedance — use positive phrasing in prompt body instead. */
export const POSITIVE_ANATOMY =
    'Anatomically correct hands with clean finger separation. Exactly two hands when gripping product.';

/** Insert after character/product tags in marketing video prompts. */
export const ANTI_SLOP_CONTINUITY =
    'Continuity: preserve exact face, hair, skin tone, and outfit from reference images across every shot. ' +
    'Same location and consistent lighting direction throughout. No background swap. No extra people unless specified. ' +
    POSITIVE_ANATOMY;

/** Seedance multi-shot guard — legacy; prefer wrapRealisticSingleScene for Video Studio. */
export const SEEDANCE_ANTI_MUSH =
    'Important direction: clearly edited multi-shot sequence with visible hard cuts. ' +
    'Do not generate a single continuous take. Each shot must have a different camera angle and framing. ';

/** Kling 3 multi-character continuity. */
export const ANTI_SLOP_MULTI_CHARACTER =
    ANTI_SLOP_CONTINUITY +
    ' Character A and Character B keep distinct identities — no face merging.';

/** Transformation templates — same room, lighting shift only. */
export const ANTI_SLOP_TRANSFORM =
    ANTI_SLOP_CONTINUITY +
    ' Same physical room and camera axis in before and after states — only mood, mess level, and color grade change.';

/** POV / hands-only templates. */
export const ANTI_SLOP_HANDS =
    'Continuity: exactly two hands visible when holding product. No extra limbs or floating fingers. ' +
    'Preserve skin tone from reference. Same {{SCENE}} background throughout. ' +
    POSITIVE_ANATOMY;

export const MARKETING_VIDEO_MODEL_ATLAS: Record<MarketingVideoModelId, string> = {
    'kling-3.0-pro': 'kwaivgi/kling-v3.0-pro/image-to-video',
    'veo-3.1': 'google/veo-3.1/image-to-video',
    'seedance-1.5-pro': 'bytedance/seedance-v1.5-pro/image-to-video',
    'seedance-2.0-fast': 'bytedance/seedance-2.0-fast/image-to-video',
};

export function getDefaultNegativeForModel(model: MarketingVideoModelId): string {
    if (model === 'kling-3.0-pro') return NEGATIVE_KLING;
    return '';
}

export function getAtlasModelIdForMarketing(model: MarketingVideoModelId): string {
    return MARKETING_VIDEO_MODEL_ATLAS[model];
}

/** Default negative for Video Studio Kling variants. */
export const VIDEO_STUDIO_NEGATIVE_KLING = NEGATIVE_KLING;

/** Default negative for Video Studio Seedance viral presets. */
export const VIDEO_STUDIO_NEGATIVE_SEEDANCE =
    NEGATIVE_KLING +
    ', third hand, extra limbs, plastic skin, oversaturated colors, ai slop';

/** Scene-first i2v: reference photo = character likeness only, not background. */
export const I2V_CHARACTER_FROM_REF =
    'Image-to-video: the uploaded photo supplies ONLY the character likeness — face, hair color, skin tone, body type. ' +
    'Do NOT reuse the photo background, pose, wardrobe, or studio backdrop as the first frame or environment. ' +
    'The reference must NOT appear as a frozen portrait plate behind the action. Generate a fresh cinematic scene from the text below.';

export const CINEMATIC_REALISM =
    'Cinematic realism: natural film color grade, realistic contrast, subtle grain, true skin texture. ' +
    'No plastic smoothing, no oversaturated AI look, no uncanny valley.';

export const ANTI_SLOP_ANATOMY =
    'Anatomically correct: exactly two hands visible at any moment. No third hand, no extra fingers, ' +
    'no floating limbs, no merged fingers. Hands stay behind frame edge when not in action.';

/** Base motion prompt for "Обычная генерация" — image-to-video safe. */
export const DEFAULT_I2V_MOTION_PROMPT =
    'Preserve the subject identity, wardrobe, and background from the first frame exactly. ' +
    'One slow motivated camera move — gentle push-in or lateral drift. ' +
    'Single natural micro-action: a breath, a blink, hair catching light, or fabric settling. ' +
    POSITIVE_ANATOMY +
    ' Same lighting direction throughout. No background swap. No new objects or people.';

/** Short identity lock for Video Studio i2v viral templates. */
export const I2V_IDENTITY_LOCK =
    'Continuity: preserve exact face, hair, skin tone, and outfit from reference image across every shot. ' +
    'Same location and consistent lighting direction throughout. No background swap. ' +
    POSITIVE_ANATOMY;

/** Hyper-realistic single continuous take — deprecated; use wrapCinematicViralScene. */
export function wrapRealisticSingleScene(
    scene: string,
    camera: string,
    audio?: string,
    continuityExtra = '',
): string {
    const continuity = continuityExtra
        ? `${I2V_IDENTITY_LOCK} ${continuityExtra}`
        : I2V_IDENTITY_LOCK;
    const audioLine = audio ? `\nAudio: ${audio}` : '';
    return (
        'Hyper-realistic photorealistic i2v. Single continuous take — no cuts, no scene changes. 9:16 vertical.\n' +
        `${continuity}\n` +
        `${scene}\n` +
        `Camera: ${camera} — one motivated move only, smooth and natural.\n` +
        POSITIVE_ANATOMY +
        audioLine
    );
}

/** Seedance i2v — strict single-take. No multishot / scene list syntax. */
export function wrapSeedanceSingleScene(
    scene: string,
    camera: string,
    audio?: string,
): string {
    return wrapCinematicViralScene(
        scene,
        camera,
        audio,
        'CRITICAL: one continuous take only — no cuts, no shot list, no scene changes, no time jumps. ' +
            'Every person, animal, and object must already exist in the opening frame or enter only from a visible frame edge. ' +
            'Nothing materializes mid-air. Same environment, same lighting, physics-consistent motion throughout.',
    );
}
/** Cinematic viral i2v — scene-first prose, character from reference only. */
export function wrapCinematicViralScene(
    scene: string,
    camera: string,
    audio?: string,
    continuityExtra = '',
): string {
    const guard = continuityExtra ? `${ANTI_SLOP_ANATOMY} ${continuityExtra}` : ANTI_SLOP_ANATOMY;
    const audioLine = audio ? `\nAudio: ${audio}` : '';
    return (
        `${I2V_CHARACTER_FROM_REF}\n` +
        `${CINEMATIC_REALISM} Single continuous take. 9:16 vertical.\n\n` +
        `${scene}\n\n` +
        `Camera: ${camera} — one motivated arc from wide establish to medium or close, smooth and natural.\n\n` +
        `${guard}` +
        audioLine
    );
}

/** Kling 3 i2v viral template skeleton — legacy marketing / multi-shot. */
export function wrapKlingPreset(
    characterTag: string,
    masterIntent: string,
    shots: string,
    audio: string,
    continuityExtra = '',
): string {
    const continuity = continuityExtra
        ? `${I2V_IDENTITY_LOCK} ${continuityExtra}`
        : I2V_IDENTITY_LOCK;
    return (
        `[Character A: ${characterTag}]\n\n` +
        `${continuity}\n\n` +
        `${masterIntent}\n\n` +
        `${shots}\n\n` +
        `Audio: ${audio}`
    );
}

/** Wan 2.5 stylized cartoon / game template skeleton (3–4 elements max). */
export function wrapWanPreset(scene: string, action: string): string {
    return (
        '3D stylized cartoon game cinematic. Preserve character likeness from reference as stylized avatar — ' +
        'same hair color, expressive eyes, clean skin. ' +
        `${scene} ` +
        `${action} ` +
        'Bright saturated colors, soft global illumination, squash-and-stretch motion. ' +
        'Family-friendly. 9:16 vertical. 5 seconds.'
    );
}

/** Wan 2.5 atmospheric preset — slow, detailed, no fast cuts. 6 seconds. */
export function wrapWanAtmospherePreset(scene: string, atmosphere: string): string {
    return (
        '3D stylized anime-inspired cinematic. Preserve character likeness from reference as stylized avatar — ' +
        'same hair color, expressive eyes, clean skin. ' +
        `${scene} ` +
        `${atmosphere} ` +
        'Slow deliberate camera movement — one continuous push-in, no fast cuts, no quick actions. ' +
        'Focus on subtle atmospheric details: drifting particles, light caressing surfaces, gentle motion. ' +
        'Anime color grade. 9:16 vertical. 6 seconds.'
    );
}

/** Seedance multi-shot — rooftop and other hard-cut viral templates. */
export function wrapSeedanceMultishot(body: string): string {
    return (
        SEEDANCE_ANTI_MUSH +
        `${I2V_CHARACTER_FROM_REF}\n` +
        `${CINEMATIC_REALISM} 9:16 vertical.\n` +
        `${ANTI_SLOP_ANATOMY}\n\n` +
        body
    );
}

/** Wrap a Seedance preset body with anti-mush + mini timeline scaffold. */
export function wrapSeedancePreset(coreMotion: string, subject = 'the subject from the image'): string {
    return (
        SEEDANCE_ANTI_MUSH +
        `Preserve ${subject} identity, face, and clothing across all shots.\n` +
        `Shot 1, 0.0–1.5s: Establish — medium framing, one environmental detail anchors the scene.\n` +
        `Cut to. Shot 2, 1.5–3.5s: Action — ${coreMotion}\n` +
        `Cut to. Shot 3, 3.5–5.0s: Reaction — tight close-up, emotion lands on the body, same lighting.\n` +
        POSITIVE_ANATOMY +
        '\n--resolution 1080p --duration 5 --camerafixed false'
    );
}
