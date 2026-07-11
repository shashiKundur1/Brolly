import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

process.env.NODE_ENV = 'test'
process.env.MOCK = '1'
process.env.CASCADE_DATA_FILE = join(mkdtempSync(join(tmpdir(), 'brolly-cascade-')), 'cascade.json')

const { default: app } = await import('../src/server.js')
const { pickCandidates } = await import('../src/cascade.js')
const { CATALOG } = await import('../src/models.js')

let server
let baseUrl

before(async () => {
  server = app.listen(0)
  await new Promise((resolve) => server.once('listening', resolve))
  const { port } = server.address()
  baseUrl = `http://localhost:${port}`
})

after(async () => {
  await new Promise((resolve) => server.close(resolve))
})

function post(path, body) {
  return fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
}

const priceAsc = [...CATALOG]
  .sort((a, b) => a.prompt + a.completion - (b.prompt + b.completion))
  .map((m) => m.id)

test('pickCandidates returns the requested model when disabled', () => {
  assert.deepEqual(pickCandidates({ model: 'anthropic/claude-sonnet-4.5' }), [
    { model: 'anthropic/claude-sonnet-4.5', reason: 'requested' }
  ])
  assert.deepEqual(pickCandidates({}), [{ model: 'openai/gpt-4o-mini', reason: 'requested' }])
})

test('GET config returns defaults with a full cheapest-first ladder and null benchmarks', async () => {
  const res = await fetch(`${baseUrl}/api/cascade/config`)
  assert.equal(res.status, 200)
  const body = await res.json()
  assert.equal(body.enabled, false)
  assert.equal(body.maxSteps, 3)
  assert.equal(body.ladder.length, CATALOG.length)
  assert.deepEqual(body.ladder.map((e) => e.model), priceAsc)
  for (const entry of body.ladder) {
    assert.equal(typeof entry.prompt_usd_per_1m, 'number')
    assert.equal(typeof entry.completion_usd_per_1m, 'number')
    assert.equal(typeof entry.tier, 'number')
    assert.equal(entry.benchmark, null)
  }
})

test('POST config round-trips enabled and maxSteps and persists', async () => {
  const res = await post('/api/cascade/config', { enabled: true, maxSteps: 2 })
  assert.equal(res.status, 200)
  const body = await res.json()
  assert.equal(body.enabled, true)
  assert.equal(body.maxSteps, 2)
  assert.deepEqual(body.ladder.map((e) => e.model), priceAsc)
  const check = await (await fetch(`${baseUrl}/api/cascade/config`)).json()
  assert.equal(check.enabled, true)
  assert.equal(check.maxSteps, 2)
  assert.ok(existsSync(process.env.CASCADE_DATA_FILE))
})

test('pickCandidates enabled returns cheapest-first ladder sliced to maxSteps', () => {
  const picks = pickCandidates({ model: 'openai/gpt-4o' })
  assert.deepEqual(
    picks,
    priceAsc.slice(0, 2).map((model) => ({ model, reason: 'cascade' }))
  )
  assert.notEqual(picks[0].model, 'openai/gpt-4o')
})

test('benchmark run is deterministic in mock mode and respects tier expectations', async () => {
  const firstRes = await post('/api/cascade/benchmark/run', {})
  assert.equal(firstRes.status, 200)
  const first = await firstRes.json()
  const second = await (await post('/api/cascade/benchmark/run', {})).json()
  assert.deepEqual(first, second)
  assert.equal(first.results.length, CATALOG.length)
  for (const r of first.results) {
    const model = CATALOG.find((m) => m.id === r.model)
    assert.equal(r.total, 5)
    assert.equal(r.cases.length, 5)
    assert.equal(r.score, r.cases.filter((c) => c.pass).length)
    assert.equal(r.passed, r.score >= 4)
    if (model.tier === 3) assert.equal(r.score, 5)
    if (model.tier === 2) assert.ok(r.score >= 4)
    if (model.tier === 1) assert.ok(r.score >= 3 && r.score <= 5)
    for (const c of r.cases) {
      assert.equal(typeof c.prompt, 'string')
      assert.equal(typeof c.expect, 'string')
      assert.equal(typeof c.got, 'string')
      assert.equal(typeof c.pass, 'boolean')
    }
  }
  const byId = Object.fromEntries(first.results.map((r) => [r.model, r]))
  assert.ok(byId['openai/gpt-4o-mini'].passed)
  assert.ok(byId['google/gemini-2.5-flash'].passed)
  assert.ok(first.results.some((r) => !r.passed))
})

test('GET benchmark returns cases and stored results', async () => {
  const res = await fetch(`${baseUrl}/api/cascade/benchmark`)
  assert.equal(res.status, 200)
  const body = await res.json()
  assert.equal(body.cases.length, 5)
  for (const c of body.cases) {
    assert.equal(typeof c.prompt, 'string')
    assert.equal(typeof c.expect, 'string')
  }
  assert.ok(Array.isArray(body.results))
  assert.equal(body.results.length, CATALOG.length)
})

test('pickCandidates skips models that failed the benchmark, cheapest first', async () => {
  await post('/api/cascade/config', { maxSteps: 4 })
  const bench = await (await fetch(`${baseUrl}/api/cascade/benchmark`)).json()
  const passing = new Set(bench.results.filter((r) => r.passed).map((r) => r.model))
  assert.ok(passing.size < CATALOG.length)
  const expected = priceAsc
    .filter((id) => passing.has(id))
    .slice(0, 4)
    .map((model) => ({ model, reason: 'cascade' }))
  assert.deepEqual(pickCandidates({}), expected)
})

test('config ladder carries benchmark summaries after a run and disabling restores requested behavior', async () => {
  const body = await (await fetch(`${baseUrl}/api/cascade/config`)).json()
  for (const entry of body.ladder) {
    assert.equal(typeof entry.benchmark.passed, 'boolean')
    assert.equal(typeof entry.benchmark.score, 'number')
    assert.equal(entry.benchmark.total, 5)
  }
  await post('/api/cascade/config', { enabled: false })
  assert.deepEqual(pickCandidates({ model: 'mistral/mistral-large' }), [
    { model: 'mistral/mistral-large', reason: 'requested' }
  ])
})
