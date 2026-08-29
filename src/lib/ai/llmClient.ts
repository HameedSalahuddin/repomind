export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMOptions {
  temperature?: number;
  maxTokens?: number;
  jsonMode?: boolean;
}

export async function generateJSONCompletion<T>(
  messages: LLMMessage[],
  options: LLMOptions = {}
): Promise<T> {
  const openaiKey = process.env.OPENAI_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  if (openaiKey && openaiKey.trim().length > 0) {
    return callOpenAI<T>(openaiKey.trim(), messages, options);
  }

  if (geminiKey && geminiKey.trim().length > 0) {
    return callGemini<T>(geminiKey.trim(), messages, options);
  }

  throw new Error(
    'No LLM API key configured. Please set OPENAI_API_KEY or GEMINI_API_KEY in .env.local.'
  );
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
      temperature: options.temperature ?? 0.2,
      max_tokens: options.maxTokens ?? 2000,
      response_format: options.jsonMode !== false ? { type: 'json_object' } : undefined,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API error (${response.status}): ${errorText}`);
  }

  const json = await response.json();
  const rawText = json.choices?.[0]?.message?.content || '{}';
  return JSON.parse(rawText) as T;
}

async function callGemini<T>(
  apiKey: string,
  messages: LLMMessage[],
  options: LLMOptions
): Promise<T> {
  const systemPrompt = messages.find((m) => m.role === 'system')?.content || '';
  const userPrompt = messages
    .filter((m) => m.role !== 'system')
    .map((m) => m.content)
    .join('\n\n');

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: `${systemPrompt}\n\n${userPrompt}\n\nIMPORTANT: Respond with ONLY valid JSON.` }],
        },
      ],
      generationConfig: {
        temperature: options.temperature ?? 0.2,
        responseMimeType: 'application/json',
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errorText}`);
  }

  const json = await response.json();
  const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
  return JSON.parse(rawText) as T;
}
