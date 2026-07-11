import express, { Router } from 'express'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { CATALOG } from './models.js'
import { meshChat } from './mesh.js'
import config from './config.js'

const DATA_FILE = process.env.CASCADE_DATA_FILE || fileURLToPath(new URL('../data/cascade.json', import.meta.url))
const DEFAULT_MODEL = 'openai/gpt-4o-mini'
const PASS_SCORE = 4
const HASH_SALT = 'bench'

const CASES = [
  { prompt: 'What is 17 + 25? Reply with only the number.', expect: '42' },
  { prompt: 'Return only a JSON object with a single key "ok" whose value is true.', expect: '"ok"' },
  { prompt: 'What is the capital of France? Answer with one word.', expect: 'Paris' },
  { prompt: 'How many letters are in the word "cat"? Reply with only the number.', expect: '3' },
  { prompt: 'Complete with one word: the quick brown fox jumps over the lazy ____.', expect: 'dog' }
]

const state = { enabled: false, maxSteps: 3, results: null }

function load() {
  let parsed
  try {
    parsed = JSON.parse(readFileSync(DATA_FILE, 'utf8'))
  } catch {
    return
  }
  if (!parsed || typeof parsed !== 'object') return
  if (typeof parsed.enabled === 'boolean') state.enabled = parsed.enabled
  if (Number.isInteger(parsed.maxSteps) && parsed.maxSteps > 0) state.maxSteps = parsed.maxSteps
  if (Array.isArray(parsed.results)) state.results = parsed.results
}

function save() {
  mkdirSync(dirname(DATA_FILE), { recursive: true })
  writeFileSync(DATA_FILE, JSON.stringify(state, null, 2))
}

load()

function sortedCatalog() {
  return [...CATALOG].sort((a, b) => a.prompt + a.completion - (b.prompt + b.completion))
}

function resultFor(id) {
  if (!state.results) return null
  return state.results.find((r) => r.model === id) || null
}

function qualifies(id) {
  const r = resultFor(id)
  return r ? r.passed : true
}

export function pickCandidates(body) {
  if (!state.enabled) return [{ model: (body && body.model) || DEFAULT_MODEL, reason: 'requested' }]
  return sortedCatalog()
    .filter((m) => qualifies(m.id))
    .slice(0, state.maxSteps)
    .map((m) => ({ model: m.id, reason: 'cascade' }))
}

function configPayload() {
  return {
    enabled: state.enabled,
    maxSteps: state.maxSteps,
    ladder: sortedCatalog().map((m) => {
      const r = resultFor(m.id)
      return {
        model: m.id,
        prompt_usd_per_1m: m.prompt,
        completion_usd_per_1m: m.completion,
        tier: m.tier,
        benchmark: r ? { passed: r.passed, score: r.score, total: r.total } : null
      }
    })
  }
}

function fnv(s) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619) >>> 0
  }
  return h >>> 0
}

function mockFailIndexes(model) {
  const h = fnv(HASH_SALT + model.id)
  const count = model.tier === 3 ? 0 : model.tier === 2 ? h % 2 : h % 3
  return new Set(
    [...CASES.keys()]
      .sort((a, b) => fnv(model.id + '|' + CASES[a].prompt) - fnv(model.id + '|' + CASES[b].prompt))
      .slice(0, count)
  )
}

function mockCases(model) {
  const fails = mockFailIndexes(model)
  return CASES.map((c, i) => ({
    prompt: c.prompt,
    expect: c.expect,
    got: fails.has(i) ? 'mock miss' : c.expect,
    pass: !fails.has(i)
  }))
}

async function liveCase(model, c) {
  let got = ''
  try {
    const r = await meshChat({ model: model.id, messages: [{ role: 'user', content: c.prompt }] })
    got = String(r.data?.choices?.[0]?.message?.content ?? '')
  } catch {
    got = ''
  }
  return { prompt: c.prompt, expect: c.expect, got, pass: got.includes(c.expect) }
}

async function runBenchmark() {
  const results = []
  for (const model of CATALOG) {
    let cases
    if (config.MOCK) {
      cases = mockCases(model)
    } else {
      cases = []
      for (const c of CASES) cases.push(await liveCase(model, c))
    }
    const score = cases.filter((c) => c.pass).length
    results.push({ model: model.id, score, total: CASES.length, passed: score >= PASS_SCORE, cases })
  }
  return results
}

export const cascadeRouter = Router()

cascadeRouter.use(express.json())

cascadeRouter.get('/api/cascade/config', (req, res) => {
  res.json(configPayload())
})

cascadeRouter.post('/api/cascade/config', (req, res) => {
  const body = req.body || {}
  if (typeof body.enabled === 'boolean') state.enabled = body.enabled
  if (Number.isInteger(body.maxSteps) && body.maxSteps > 0) state.maxSteps = body.maxSteps
  save()
  res.json(configPayload())
})

cascadeRouter.get('/api/cascade/benchmark', (req, res) => {
  res.json({ cases: CASES.map((c) => ({ prompt: c.prompt, expect: c.expect })), results: state.results })
})

cascadeRouter.post('/api/cascade/benchmark/run', async (req, res) => {
  state.results = await runBenchmark()
  save()
  res.json({ results: state.results })
})
