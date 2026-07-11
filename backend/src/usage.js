import { mkdirSync, appendFileSync, readFileSync, existsSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_DIR = join(__dirname, '..', 'data')
const USAGE_FILE = join(DATA_DIR, 'usage.jsonl')

mkdirSync(DATA_DIR, { recursive: true })

// ponytail: static price map, swap for Mesh pricing endpoint when verified
const PRICE_PER_1M = {
  'gpt-4o': { prompt: 2.5, completion: 10 },
  'gpt-4o-mini': { prompt: 0.15, completion: 0.6 },
  'claude-sonnet': { prompt: 3, completion: 15 },
  'claude-haiku': { prompt: 0.8, completion: 4 },
  'gemini-flash': { prompt: 0.075, completion: 0.3 },
  'gemini-pro': { prompt: 1.25, completion: 5 },
  'llama-70b': { prompt: 0.59, completion: 0.79 },
  'mistral-large': { prompt: 2, completion: 6 },
  'deepseek-chat': { prompt: 0.14, completion: 0.28 },
  default: { prompt: 1, completion: 3 }
}

function priceFor(model) {
  return PRICE_PER_1M[model] || PRICE_PER_1M.default
}

export function appendEvent(event) {
  appendFileSync(USAGE_FILE, JSON.stringify(event) + '\n')
}

export function readEvents() {
  if (!existsSync(USAGE_FILE)) return []
  const raw = readFileSync(USAGE_FILE, 'utf8')
  return raw
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line)
      } catch {
        return null
      }
    })
    .filter(Boolean)
}

export function summarize(events) {
  const byModelDay = {}
  for (const e of events) {
    const day = new Date(e.ts).toISOString().slice(0, 10)
    const key = `${e.model}|${day}`
    if (!byModelDay[key]) {
      byModelDay[key] = {
        model: e.model,
        day,
        requests: 0,
        prompt_tokens: 0,
        completion_tokens: 0,
        est_cost_usd: 0
      }
    }
    const bucket = byModelDay[key]
    bucket.requests += 1
    bucket.prompt_tokens += e.prompt_tokens || 0
    bucket.completion_tokens += e.completion_tokens || 0
    const price = priceFor(e.model)
    bucket.est_cost_usd +=
      ((e.prompt_tokens || 0) / 1e6) * price.prompt +
      ((e.completion_tokens || 0) / 1e6) * price.completion
  }

  const totals = Object.values(byModelDay).sort((a, b) => (a.day < b.day ? 1 : -1))
  for (const t of totals) t.est_cost_usd = Number(t.est_cost_usd.toFixed(6))

  const now = Date.now()
  const tenMinAgo = now - 10 * 60 * 1000
  const recentTokens = events
    .filter((e) => new Date(e.ts).getTime() >= tenMinAgo)
    .reduce((sum, e) => sum + (e.prompt_tokens || 0) + (e.completion_tokens || 0), 0)
  const burnRate = recentTokens / 10

  return {
    totals,
    burnRate,
    projectedTokensPerHour: burnRate * 60
  }
}

export { USAGE_FILE }
