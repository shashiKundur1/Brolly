import { mkdirSync, appendFileSync, readFileSync, existsSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { priceFor } from './models.js'
import config from './config.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_DIR = join(__dirname, '..', 'data')
const USAGE_FILE = join(DATA_DIR, 'usage.jsonl')

mkdirSync(DATA_DIR, { recursive: true })

let mongoCollectionPromise = null

// ponytail: JSONL stays the source of truth for readEvents/summarize; Mongo is a write-only mirror until JSONL outgrows a demo, at which point readEvents should read from Mongo instead.
async function getMongoCollection() {
  if (!config.MONGO_URL) return null
  if (!mongoCollectionPromise) {
    mongoCollectionPromise = (async () => {
      const { MongoClient } = await import('mongodb')
      const client = new MongoClient(config.MONGO_URL)
      await client.connect()
      const collection = client.db('brolly').collection('usage_events')
      await collection.createIndex({ ts: -1 })
      await collection.createIndex({ model: 1 })
      return collection
    })().catch((err) => {
      mongoCollectionPromise = null
      throw err
    })
  }
  return mongoCollectionPromise
}

export function appendEvent(event) {
  appendFileSync(USAGE_FILE, JSON.stringify(event) + '\n')
  if (config.MONGO_URL) {
    getMongoCollection()
      .then((collection) => collection?.insertOne({ ...event }))
      .catch(() => {})
  }
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

  const totals = Object.values(byModelDay).sort((a, b) => (a.day < b.day ? 1 : a.day > b.day ? -1 : 0))
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
