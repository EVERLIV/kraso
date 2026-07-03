export type MusicMood = 'none' | 'upbeat' | 'calm' | 'cinematic' | 'dramatic';

export interface MusicPreset {
    id: MusicMood;
    label: string;
    description: string;
}

/** UI presets for Shorts audio layer — Veo generates ambient audio; mood guides the prompt suffix. */
export const MUSIC_PRESETS: MusicPreset[] = [
    { id: 'none', label: 'Без музыки', description: 'Только звук сцены' },
    { id: 'upbeat', label: 'Энергичная', description: 'Для Reels и TikTok' },
    { id: 'calm', label: 'Спокойная', description: 'Мягкий фон' },
    { id: 'cinematic', label: 'Кино', description: 'Эпичный саундтрек' },
    { id: 'dramatic', label: 'Драма', description: 'Напряжённая атмосфера' },
];

export function musicPromptSuffix(mood: MusicMood): string {
    switch (mood) {
        case 'upbeat': return ' Upbeat energetic background music feel.';
        case 'calm': return ' Calm soft ambient background music.';
        case 'cinematic': return ' Cinematic orchestral score atmosphere.';
        case 'dramatic': return ' Dramatic tense musical atmosphere.';
        default: return '';
    }
}

/** Russian TTS via browser Speech Synthesis (client-side preview; no server cost). */
export function speakRussianText(text: string): void {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ru-RU';
    utterance.rate = 0.95;
    const voices = window.speechSynthesis.getVoices();
    const ru = voices.find(v => v.lang.startsWith('ru'));
    if (ru) utterance.voice = ru;
    window.speechSynthesis.speak(utterance);
}
