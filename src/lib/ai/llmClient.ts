export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMOptions {
  temperature?: number;
  maxTokens?: number;
  jsonMode?: boolean;
  timeoutMs?: number;
}

function parseCleanJSON<T>(rawText: string): T {
  let cleaned = rawText.trim();

  // Strip markdown code block wrappers if present
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  }

  try {
    return JSON.parse(cleaned) as T;
  } catch (firstErr: any) {
    throw new Error(`Failed to parse JSON response from LLM: ${firstErr.message}\nRaw text snippet: ${cleaned.substring(0, 150)}...`);
  }
}

export async function generateJSONCompletion<T>(
  messages: LLMMessage[],
  options: LLMOptions = {}
): Promise<T> {
  const geminiKey = process.env.GEMINI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (geminiKey && geminiKey.trim().length > 0) {
    return callGeminiNative<T>(geminiKey.trim(), messages, options);
  }

  if (openaiKey && openaiKey.trim().length > 0) {
    return callOpenAI<T>(openaiKey.trim(), messages, options);
  }

  throw new Error(
    'GEMINI_API_KEY is missing. Please configure GEMINI_API_KEY in .env.local.'
  );
}

async function callGeminiNative<T>(
  apiKey: string,
  messages: LLMMessage[],
  options: LLMOptions
): Promise<T> {
  const preferredModel = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';
  const candidateModels = Array.from(
    new Set([preferredModel, 'gemini-3.5-flash-lite', 'gemini-3.1-flash-lite', 'gemini-3.5-flash', 'gemini-3.7-flash'])
  );

  const systemPrompt = messages.find((m) => m.role === 'system')?.content || '';
  const userPrompt = messages
    .filter((m) => m.role !== 'system')
    .map((m) => m.content)
    .join('\n\n');

  let lastErrorText = '';
  const timeoutMs = options.timeoutMs ?? 20000;

  for (const model of candidateModels) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: `${systemPrompt}\n\n${userPrompt}\n\nIMPORTANT: Respond ONLY with valid JSON.` }],
            },
          ],
          generationConfig: {
            temperature: options.temperature ?? 0.1,
            maxOutputTokens: options.maxTokens ?? 2048,
            responseMimeType: 'application/json',
          },
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        const sanitizedError = errorText.replace(new RegExp(apiKey, 'g'), '[REDACTED_KEY]');
        lastErrorText = `Gemini API error (${response.status} model=${model}): ${sanitizedError}`;

        if (response.status === 503 || response.status === 404 || response.status === 429) {
          continue;
        }
        throw new Error(lastErrorText);
      }

      const json = await response.json();
      const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text || '{}';

      return parseCleanJSON<T>(rawText);
    } catch (err: any) {
      clearTimeout(timeoutId);
      const isTimeout = err?.name === 'AbortError' || err?.message?.includes('aborted');
      if (isTimeout || err?.message?.includes('503') || err?.message?.includes('404') || err?.message?.includes('429')) {
        lastErrorText = `Attempt on ${model} timed out, rate limited, or unavailable. Trying next model...`;
        if (model !== candidateModels[candidateModels.length - 1]) {
          continue;
        }
      }
      throw err;
    }
  }

  throw new Error(lastErrorText || 'Failed to generate completion from Gemini models.');
}

async function callOpenAI<T>(
  apiKey: string,
  messages: LLMMessage[],
  options: LLMOptions
): Promise<T> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages,
      temperature: options.temperature ?? 0.1,
      max_tokens: options.maxTokens ?? 2000,
      response_format: options.jsonMode !== false ? { type: 'json_object' } : undefined,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    const sanitizedError = errorText.replace(new RegExp(apiKey, 'g'), '[REDACTED_KEY]');
    throw new Error(`OpenAI API error (${response.status}): ${sanitizedError}`);
  }

  const json = await response.json();
  const rawText = json.choices?.[0]?.message?.content || '{}';
  return parseCleanJSON<T>(rawText);
}
