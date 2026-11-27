/**
 * Unified Cost-Optimized LLM Router (Gemini Free-Tier + OpenAI gpt-4.1-mini / gpt-4o-mini)
 *
 * - Default mode (`AI_PROVIDER=auto`):
 *   Tries Gemini 2.5 Flash (free tier, $0) if GOOGLE_API_KEY is configured and healthy;
 *   automatically falls back to OpenAI (gpt-4.1-mini for writer/critic, gpt-4o-mini for promo/analyst)
 *   on 402/429/network error with a 30-minute circuit breaker so latency is never wasted.
 * - `AI_PROVIDER=openai`: skips Gemini and uses OpenAI directly (~83% cheaper than gpt-4o via gpt-4.1-mini).
 * - `AI_PROVIDER=gemini`: prefers Gemini with OpenAI fallback.
 */

const ROLE_MODELS = {
  writer: {
    gemini: process.env.GEMINI_WRITER_MODEL || 'gemini-2.5-flash',
    openai: process.env.OPENAI_WRITER_MODEL || 'gpt-4.1-mini',
  },
  critic: {
    gemini: process.env.GEMINI_CRITIC_MODEL || 'gemini-2.5-flash',
    openai: process.env.OPENAI_CRITIC_MODEL || 'gpt-4.1-mini',
  },
  promo: {
    gemini: process.env.GEMINI_PROMO_MODEL || 'gemini-2.5-flash',
    openai: process.env.OPENAI_PROMO_MODEL || 'gpt-4o',
  },
  analyst: {
    gemini: process.env.GEMINI_ANALYST_MODEL || 'gemini-2.5-flash',
    openai: process.env.OPENAI_ANALYST_MODEL || 'gpt-4o-mini',
  },
};

let geminiBlockedUntil = 0;

function shouldTryGemini() {
  const pref = (process.env.AI_PROVIDER || 'auto').toLowerCase();
  if (pref === 'openai') return false;
  if (!process.env.GOOGLE_API_KEY) return false;
  if (Date.now() < geminiBlockedUntil) return false;
  return true;
}

async function callGemini({ model, system, user, temperature = 0.7, json = false }) {
  const apiKey = process.env.GOOGLE_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const body = {
    systemInstruction: system ? { parts: [{ text: system }] } : undefined,
    contents: [{ role: 'user', parts: [{ text: user }] }],
    generationConfig: {
      temperature,
      ...(json ? { responseMimeType: 'application/json' } : {}),
    },
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    if (res.status === 402 || res.status === 403 || res.status === 429) {
      geminiBlockedUntil = Date.now() + 30 * 60 * 1000; // 30m cooldown on billing/quota error
    }
    throw new Error(`Gemini HTTP ${res.status}: ${errText.slice(0, 180)}`);
  }

  const data = await res.json();
  const text = (data.candidates?.[0]?.content?.parts || [])
    .map((p) => p.text || '')
    .join('')
    .trim();
  if (!text) throw new Error('Gemini returned empty response');
  return text;
}

function stripJsonFences(raw) {
  return raw
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
}

export async function generateJson(openai, { system, user, role = 'writer', temperature = 0.7 }) {
  const models = ROLE_MODELS[role] || ROLE_MODELS.writer;

  if (shouldTryGemini()) {
    try {
      const raw = await callGemini({ model: models.gemini, system, user, temperature, json: true });
      const parsed = JSON.parse(stripJsonFences(raw));
      return { data: parsed, provider: 'gemini', model: models.gemini };
    } catch (err) {
      console.warn(`[llmClient] Gemini (${models.gemini}) failed, falling back to OpenAI (${models.openai}):`, err.message);
    }
  }

  const res = await openai.chat.completions.create({
    model: models.openai,
    temperature,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
  });
  const content = res.choices?.[0]?.message?.content || '{}';
  return {
    data: JSON.parse(stripJsonFences(content)),
    provider: 'openai',
    model: models.openai,
  };
}

export async function generateText(openai, { system, user, role = 'promo', temperature = 0.85 }) {
  const models = ROLE_MODELS[role] || ROLE_MODELS.promo;

  if (shouldTryGemini()) {
    try {
      const text = await callGemini({ model: models.gemini, system, user, temperature, json: false });
      return { text, provider: 'gemini', model: models.gemini };
    } catch (err) {
      console.warn(`[llmClient] Gemini (${models.gemini}) failed, falling back to OpenAI (${models.openai}):`, err.message);
    }
  }

  const res = await openai.chat.completions.create({
    model: models.openai,
    temperature,
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
  });
  return {
    text: (res.choices?.[0]?.message?.content || '').trim(),
    provider: 'openai',
    model: models.openai,
  };
}
