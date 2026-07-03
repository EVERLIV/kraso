export type PromptEnhanceContext = 'video' | 'image';

const ENHANCE_FUNCTION_URL =
  import.meta.env.VITE_ENHANCE_PROMPT_FUNCTION_URL ||
  'https://us-central1-project-1285666415996898989.cloudfunctions.net/enhancePrompt';

/**
 * Enhance a user prompt via FAL any-llm (Cloud Function).
 */
export async function enhancePrompt(
  prompt: string,
  context: PromptEnhanceContext = 'video',
  onProgress?: (status: string) => void,
): Promise<string> {
  const trimmed = prompt.trim();
  if (!trimmed) return prompt;

  onProgress?.('Улучшаем промпт...');

  const resp = await fetch(ENHANCE_FUNCTION_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: trimmed, context }),
  });

  if (!resp.ok) {
    const text = await resp.text();
    let message = text;
    try {
      const json = JSON.parse(text);
      message = json.error || json.message || text;
    } catch {
      // keep text
    }
    throw new Error(message || `Ошибка улучшения промпта (${resp.status})`);
  }

  const data = await resp.json();
  const enhanced = typeof data?.prompt === 'string' ? data.prompt.trim() : '';
  if (!enhanced) {
    throw new Error('Сервер не вернул улучшенный промпт');
  }

  return enhanced;
}
