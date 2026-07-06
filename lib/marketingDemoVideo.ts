import type { MarketingTemplate } from './marketingPresets';
import { resolveMarketingVideoPrompt } from './marketingPresets';
import {
    ANTI_SLOP_ANATOMY,
    CINEMATIC_REALISM,
    I2V_CHARACTER_FROM_REF,
} from './videoPromptRules';

/** Per-template demo variants — hook + scene for cards 2 and 3 (card 1 uses template defaults). */
export const MARKETING_DEMO_VARIANTS: Record<
    string,
    [{ hook?: string; scene?: string }, { hook?: string; scene?: string }]
> = {
    ugc: [
        { hook: 'Energetic smile, holding product toward camera at chest height.', scene: 'golden hour urban street, warm sunset bokeh' },
        { hook: 'Authentic grin, product raised beside face.', scene: 'cozy living room, soft window daylight' },
    ],
    'unboxing-asmr': [
        { hook: 'Manicured hands peel tissue paper inside matte black gift box.', scene: 'white marble table, warm side light, minimal background' },
        { hook: 'Hands pull satin ribbon on cream luxury box.', scene: 'wooden table, amber candlelight, rose petals scattered' },
    ],
    'unboxing-tryon': [
        { hook: 'One hand holds open box, other hand already wearing the product.', scene: 'bright modern apartment, full-length mirror behind' },
        { hook: 'Excited reveal — packaging in one hand, product on body in the other.', scene: 'stylish loft, warm ambient window light' },
    ],
    'selfie-testimonial': [
        { hook: 'Mouth opens mid-sentence about the product, eyes bright.', scene: 'sunny park, golden bokeh background' },
        { hook: 'Enthusiastic selfie expression, product near cheek.', scene: 'urban sidewalk, soft natural daylight' },
    ],
    'direct-to-camera': [
        { hook: 'Lifts product to shoulder height, confident half-smile.', scene: 'light grey studio backdrop, ring-light catchlight' },
        { hook: 'Presenter posture, product at chest, direct eye contact.', scene: 'clean white minimal studio, soft diffused key' },
    ],
    'before-after': [
        { hook: 'Vertical split line divides frame — tired left, radiant right.', scene: 'neutral light background, equal lighting both halves' },
        { hook: 'Same person, messy hair left vs polished glow right.', scene: 'cozy room, cool vs warm color contrast' },
    ],
    'product-review': [
        { hook: 'Rotates product to show the most impressive side.', scene: 'wooden desk, warm side window light, bookshelf blur' },
        { hook: 'Leans forward examining product details, then looks up.', scene: 'home office table, natural side light' },
    ],
    'couple-sharing': [
        { hook: 'One partner shows product, both laugh with delight.', scene: 'cozy sofa, warm evening lamp light' },
        { hook: 'Couple try product together in bright kitchen.', scene: 'modern kitchen, natural daylight' },
    ],
    'secret-hack': [
        { hook: 'Finger to lips, conspiratorial lean toward camera.', scene: 'bright clean kitchen, good overhead light' },
        { hook: 'Surprised aha expression demonstrating unexpected product use.', scene: 'home counter, warm practical lighting' },
    ],
    'camera-pov': [
        { hook: 'Hands lift product to eye level, slight camera sway.', scene: 'outdoor park, daylight bokeh background' },
        { hook: 'POV hands reveal product packaging toward viewer.', scene: 'urban street, golden hour depth of field' },
    ],
    'classic-modern': [
        { hook: 'Vertical split — sepia vintage left, neon modern right, same product.', scene: 'architectural facade, high contrast fashion look' },
        { hook: 'Dual-era styling with product as bridge between halves.', scene: 'interior with contrasting classic and modern decor' },
    ],
    'mess-to-fresh': [
        { hook: 'Exhausted at messy counter left, sparkling clean right with product.', scene: 'kitchen counter split transformation' },
        { hook: 'Winks at camera holding product amid clutter-to-clean contrast.', scene: 'desk or bathroom, high contrast fresh side' },
    ],
    'gadget-saved-me': [
        { hook: 'Wide eyes, mouth open in discovery, finger points at product.', scene: 'modern kitchen, bright daylight, clean background' },
        { hook: 'Thrusts product toward camera with huge excited grin.', scene: 'workspace desk, saturated TikTok energy' },
    ],
};

function stripSpeechAndTiming(prose: string): string {
    return prose
        .replace(/\n*Audio:[\s\S]*?(?=\n[A-Z\[]|$)/gi, '')
        .replace(/^.*\bsays\b.*$/gim, '')
        .replace(/^.*\bshouts\b.*$/gim, '')
        .replace(/^.*\bwhispers\b.*$/gim, '')
        .replace(/^.*Says:.*$/gim, '')
        .replace(/--resolution[^\n]*/gi, '')
        .replace(/^Duration:.*$/gim, '')
        .replace(/Shot \d+ \([\d–-]+s\)\.?/gi, '')
        .replace(/Shot \d+, [\d.–]+s:/gi, '')
        .replace(/Cut to\.\s*/gi, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

/**
 * 5-second silent demo prompt for Marketing Studio homepage cards.
 * Uses the template's videoPromptTemplate with improved demo constraints.
 */
export function buildMarketingDemoVideoPrompt(
    tpl: MarketingTemplate,
    variantIndex: 0 | 1 | 2,
): string {
    let hook: string | undefined;
    let scene: string | undefined;
    if (variantIndex === 0) {
        hook = tpl.defaultHook;
        scene = tpl.defaultScene;
    } else {
        const variants = MARKETING_DEMO_VARIANTS[tpl.id];
        const v = variants?.[variantIndex - 1];
        hook = v?.hook ?? tpl.defaultHook;
        scene = v?.scene ?? tpl.defaultScene;
    }

    const core = stripSpeechAndTiming(resolveMarketingVideoPrompt(tpl, hook, scene));

    return (
        `${I2V_CHARACTER_FROM_REF}\n` +
        `${CINEMATIC_REALISM}\n` +
        'Marketing demo clip. Exactly 5 seconds. 9:16 vertical. Completely silent — no speech, no voiceover, no subtitles, no text overlays.\n' +
        'Animate naturally from the start frame. Preserve face, product label, wardrobe, and environment from the first frame.\n' +
        `${ANTI_SLOP_ANATOMY}\n\n` +
        core +
        '\n\nOne smooth camera move. Clear product hero moment before 5 seconds end.'
    );
}

/** Map preview slot → existing style PNG basename under public/marketing/pickers/style/ */
export function marketingDemoStartFrameBasename(tplId: string, slot: 1 | 2 | 3): string {
    const map: Record<string, [string, string, string]> = {
        ugc: ['ugc-bathroom', 'ugc-2', 'ugc-3'],
        'unboxing-asmr': ['unboxing-asmr', 'asmr-2', 'asmr-3'],
        'unboxing-tryon': ['unboxing-tryon', 'unboxing-tryon-2', 'unboxing-tryon-3'],
        'selfie-testimonial': ['selfie-testimonial', 'selfie-2', 'selfie-3'],
        'direct-to-camera': ['direct-to-camera', 'direct-to-camera-2', 'direct-to-camera-3'],
        'before-after': ['before-after', 'before-after-2', 'before-after-3'],
        'product-review': ['product-review', 'product-review-2', 'product-review-3'],
        'couple-sharing': ['couple-1', 'couple-2', 'couple-3'],
        'secret-hack': ['hack-1', 'hack-2', 'hack-3'],
        'camera-pov': ['pov-1', 'pov-2', 'pov-3'],
        'classic-modern': ['classic-1', 'classic-2', 'classic-3'],
        'mess-to-fresh': ['mess-fresh-1', 'mess-fresh-2', 'mess-fresh-3'],
        'gadget-saved-me': ['gadget', 'gadget', 'gadget'],
    };
    const row = map[tplId];
    if (!row) throw new Error(`No start-frame map for template ${tplId}`);
    return row[slot - 1];
}

export function marketingDemoVideoFilename(tplId: string, slot: 1 | 2 | 3): string {
    return `${tplId}-${slot}.mp4`;
}
