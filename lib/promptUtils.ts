import { GeneratedImage, Preset } from '../types';

const SYSTEM_PROMPT_MARKERS = [
    'TASK: Image-to-Image',
    'STYLE/ENVIRONMENT:',
    'STRICT REQUIREMENT:',
    'SUBJECT IDENTITY:',
    'CRUCIAL: Preserve',
    'REALISM: The output',
    'ADDITIONAL DETAILS:',
    'OVERLAY TEXT:',
];

/** Prompt text safe to show in the UI (user input + template title, never hidden project instructions). */
export function buildUserFacingPrompt(
    template: Preset | null,
    promptInput: string,
    overlayText: string,
): string {
    const parts: string[] = [];
    const userText = promptInput.trim();
    const overlay = overlayText.trim();

    if (userText) parts.push(userText);
    if (overlay) parts.push(`Текст: ${overlay}`);
    if (parts.length === 0 && template?.title) parts.push(template.title);

    return parts.join(' · ');
}

/** Returns user-visible prompt for display; hides legacy studio system prompts. */
export function getDisplayPrompt(item: GeneratedImage): string | null {
    const raw = item.prompt?.trim();
    if (!raw) return null;

    if (item.source === 'chat' || item.source === 'video') {
        return raw;
    }

    // Legacy studio records stored the full API prompt — extract user parts only.
    if (raw.includes('ADDITIONAL DETAILS:')) {
        const match = raw.match(/ADDITIONAL DETAILS:\s*(.+?)(?:\s+OVERLAY TEXT:|$)/s);
        if (match?.[1]?.trim()) return match[1].trim();
    }
    if (raw.includes('OVERLAY TEXT:')) {
        const match = raw.match(/OVERLAY TEXT:\s*Include the text "([^"]+)"/);
        if (match?.[1]) return `Текст: ${match[1]}`;
    }

    if (SYSTEM_PROMPT_MARKERS.some(marker => raw.includes(marker))) {
        return null;
    }

    return raw;
}
