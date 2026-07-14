// ponytail: static catalog with estimated prices, hydrate from GET /v1/models pricing fields when a live rsk_ key is set

export const CATALOG = [
  { id: 'openai/gpt-4o', family: 'gpt', tier: 3, prompt: 2.5, completion: 10 },
  { id: 'openai/gpt-4o-mini', family: 'gpt', tier: 1, prompt: 0.15, completion: 0.6 },
  { id: 'anthropic/claude-sonnet-4.5', family: 'claude', tier: 3, prompt: 3, completion: 15 },
  { id: 'anthropic/claude-haiku-4.5', family: 'claude', tier: 1, prompt: 0.8, completion: 4 },
  { id: 'google/gemini-2.5-flash', family: 'gemini', tier: 1, prompt: 0.075, completion: 0.3 },
  { id: 'google/gemini-2.5-pro', family: 'gemini', tier: 3, prompt: 1.25, completion: 5 },
  { id: 'meta/llama-3.3-70b', family: 'llama', tier: 2, prompt: 0.59, completion: 0.79 },
  { id: 'mistral/mistral-large', family: 'mistral', tier: 2, prompt: 2, completion: 6 },
  { id: 'deepseek/deepseek-chat', family: 'deepseek', tier: 1, prompt: 0.14, completion: 0.28 }
]

const DEFAULT_PROMPT = 1
const DEFAULT_COMPLETION = 3

export function priceFor(id) {
  const entry = CATALOG.find((m) => m.id === id)
  return entry
    ? { prompt: entry.prompt, completion: entry.completion }
    : { prompt: DEFAULT_PROMPT, completion: DEFAULT_COMPLETION }
}

export function modelInfo(id) {
  return CATALOG.find((m) => m.id === id) || null
}
