import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

process.env.NODE_ENV = 'test'
process.env.MOCK = '1'
process.env.CASCADE_DATA_FILE = join(mkdtempSync(join(tmpdir(), 'brolly-units-cascade-')), 'cascade.json')

const { summarize } = await import('../src/usage.js')
const { priceFor, modelInfo, CATALOG } = await import('../src/models.js')
const { mockChat, mockStream } = await import('../src/mock.js')
const { pickCandidates } = await import('../src/cascade.js')
const { pickFallback } = await import('../src/failover.js')

// ---------------------------------------------------------------------------
// usage.summarize
// ---------------------------------------------------------------------------

describe('usage.summarize', () => {
  test('empty events returns empty totals and zero rates', () => {
    const out = summarize([])
    assert.deepEqual(out.totals, [])
    assert.equal(out.burnRate, 0)
    assert.equal(out.projectedTokensPerHour, 0)
  })

  test('single model produces a single total bucket with correct cost math', () => {
    const price = priceFor('openai/gpt-4o-mini')
    const events = [
      { ts: '2026-07-11T10:00:00.000Z', model: 'openai/gpt-4o-mini', prompt_tokens: 1000, completion_tokens: 500 }
    ]
    const out = summarize(events)
    assert.equal(out.totals.length, 1)
    const bucket = out.totals[0]
    assert.equal(bucket.model, 'openai/gpt-4o-mini')
    assert.equal(bucket.day, '2026-07-11')
    assert.equal(bucket.requests, 1)
    assert.equal(bucket.prompt_tokens, 1000)
    assert.equal(bucket.completion_tokens, 500)
    const expectedCost = Number(
      (((1000 / 1e6) * price.prompt) + ((500 / 1e6) * price.completion)).toFixed(6)
    )
    assert.equal(bucket.est_cost_usd, expectedCost)
  })

  test('multi-model/multi-day events roll up into separate buckets sorted newest-day-first', () => {
    const events = [
      { ts: '2026-07-01T00:00:00.000Z', model: 'openai/gpt-4o-mini', prompt_tokens: 100, completion_tokens: 50 },
      { ts: '2026-07-01T12:00:00.000Z', model: 'openai/gpt-4o-mini', prompt_tokens: 200, completion_tokens: 50 },
      { ts: '2026-07-02T00:00:00.000Z', model: 'anthropic/claude-haiku-4.5', prompt_tokens: 300, completion_tokens: 100 }
    ]
    const out = summarize(events)
    // two 07-01 gpt-4o-mini events merge into one bucket; the 07-02 claude event is a second bucket
    assert.equal(out.totals.length, 2)
    const julyFirstMini = out.totals.find((t) => t.model === 'openai/gpt-4o-mini' && t.day === '2026-07-01')
    assert.ok(julyFirstMini)
    assert.equal(julyFirstMini.requests, 2)
    assert.equal(julyFirstMini.prompt_tokens, 300)
    assert.equal(julyFirstMini.completion_tokens, 100)
    // newest day should sort first
    assert.equal(out.totals[0].day, '2026-07-02')
  })

  test('burnRate window boundary: event exactly 10 minutes ago is included, older is excluded', () => {
    const now = Date.now()
    const exactlyTenMinAgo = new Date(now - 10 * 60 * 1000).toISOString()
    const justOverTenMinAgo = new Date(now - 10 * 60 * 1000 - 1000).toISOString()

    const includedOnly = summarize([
      { ts: exactlyTenMinAgo, model: 'openai/gpt-4o-mini', prompt_tokens: 100, completion_tokens: 100 }
    ])
    assert.equal(includedOnly.burnRate, 200 / 10)

    const excludedOnly = summarize([
      { ts: justOverTenMinAgo, model: 'openai/gpt-4o-mini', prompt_tokens: 100, completion_tokens: 100 }
    ])
    assert.equal(excludedOnly.burnRate, 0)
  })

  test('projectedTokensPerHour is burnRate * 60', () => {
    const now = new Date().toISOString()
    const out = summarize([
      { ts: now, model: 'openai/gpt-4o-mini', prompt_tokens: 500, completion_tokens: 500 }
    ])
    assert.equal(out.burnRate, 1000 / 10)
    assert.equal(out.projectedTokensPerHour, out.burnRate * 60)
  })
})

// ---------------------------------------------------------------------------
// models.priceFor / modelInfo
// ---------------------------------------------------------------------------

describe('models.priceFor', () => {
  test('known id returns its catalog pricing', () => {
    const price = priceFor('openai/gpt-4o')
    assert.deepEqual(price, { prompt: 2.5, completion: 10 })
  })

  test('unknown id returns the default price', () => {
    const price = priceFor('totally/unknown-model')
    assert.deepEqual(price, { prompt: 1, completion: 3 })
  })

  test('provider-prefixed ids must match exactly; bare id without provider falls back to default', () => {
    // catalog ids are always provider-prefixed (e.g. "openai/gpt-4o-mini")
    const bare = priceFor('gpt-4o-mini')
    assert.deepEqual(bare, { prompt: 1, completion: 3 })
    const prefixed = priceFor('google/gemini-2.5-flash')
    assert.deepEqual(prefixed, { prompt: 0.075, completion: 0.3 })
  })
})

describe('models.modelInfo', () => {
  test('known id returns the full catalog entry', () => {
    const info = modelInfo('meta/llama-3.3-70b')
    assert.deepEqual(info, { id: 'meta/llama-3.3-70b', family: 'llama', tier: 2, prompt: 0.59, completion: 0.79 })
  })

  test('unknown id returns null', () => {
    assert.equal(modelInfo('nope/does-not-exist'), null)
  })
})

// ---------------------------------------------------------------------------
// mock.mockChat
// ---------------------------------------------------------------------------

describe('mock.mockChat', () => {
  test('estimates prompt tokens from the last user message length (ceil(len/4), min 1)', () => {
    const shortBody = { model: 'openai/gpt-4o-mini', messages: [{ role: 'user', content: 'hi' }] }
    const short = mockChat(shortBody)
    assert.equal(short.usage.prompt_tokens, Math.max(1, Math.ceil('hi'.length / 4)))

    const longContent = 'x'.repeat(41) // 41 chars -> ceil(41/4) = 11
    const longBody = { model: 'openai/gpt-4o-mini', messages: [{ role: 'user', content: longContent }] }
    const long = mockChat(longBody)
    assert.equal(long.usage.prompt_tokens, 11)
  })

  test('echoes the requested model, defaulting to "default" when absent', () => {
    const withModel = mockChat({ model: 'anthropic/claude-haiku-4.5', messages: [{ role: 'user', content: 'hi' }] })
    assert.equal(withModel.model, 'anthropic/claude-haiku-4.5')
    assert.equal(withModel.choices[0].message.role, 'assistant')

    const withoutModel = mockChat({ messages: [{ role: 'user', content: 'hi' }] })
    assert.equal(withoutModel.model, 'default')
  })

  test('choices/usage shape matches the OpenAI-style contract', () => {
    const out = mockChat({ model: 'openai/gpt-4o-mini', messages: [{ role: 'user', content: 'hello world' }] })
    assert.equal(out.object, 'chat.completion')
    assert.equal(typeof out.id, 'string')
    assert.equal(typeof out.created, 'number')
    assert.equal(Array.isArray(out.choices), true)
    assert.equal(out.choices.length, 1)
    assert.equal(out.choices[0].index, 0)
    assert.equal(out.choices[0].finish_reason, 'stop')
    assert.equal(typeof out.choices[0].message.content, 'string')
    assert.equal(out.usage.total_tokens, out.usage.prompt_tokens + out.usage.completion_tokens)
  })
})

// ---------------------------------------------------------------------------
// mock.mockStream
// ---------------------------------------------------------------------------

describe('mock.mockStream', () => {
  test('yields SSE "data: " chunks terminated by [DONE], each JSON chunk parseable', async () => {
    const chunks = []
    for await (const chunk of mockStream({ model: 'openai/gpt-4o-mini', messages: [{ role: 'user', content: 'hi' }] })) {
      chunks.push(chunk)
    }
    assert.ok(chunks.length > 2, 'expected multiple word chunks plus final chunk plus [DONE]')

    const last = chunks[chunks.length - 1]
    assert.equal(last, 'data: [DONE]\n\n')

    // all chunks except the final [DONE] marker must be parseable JSON payloads
    for (const chunk of chunks.slice(0, -1)) {
      assert.ok(chunk.startsWith('data: '))
      assert.ok(chunk.endsWith('\n\n'))
      const jsonStr = chunk.slice('data: '.length, -2)
      const parsed = JSON.parse(jsonStr)
      assert.equal(parsed.object, 'chat.completion.chunk')
      assert.equal(parsed.model, 'openai/gpt-4o-mini')
      assert.ok(Array.isArray(parsed.choices))
    }

    // second-to-last (final content) chunk should carry finish_reason stop with empty delta
    const finalContentChunk = JSON.parse(chunks[chunks.length - 2].slice('data: '.length, -2))
    assert.equal(finalContentChunk.choices[0].finish_reason, 'stop')
    assert.deepEqual(finalContentChunk.choices[0].delta, {})
  })
})

// ---------------------------------------------------------------------------
// cascade.pickCandidates
// ---------------------------------------------------------------------------

describe('cascade.pickCandidates', () => {
  const priceAsc = [...CATALOG].sort((a, b) => a.prompt + a.completion - (b.prompt + b.completion)).map((m) => m.id)

  test('disabled by default: returns the requested model with reason "requested"', () => {
    assert.deepEqual(pickCandidates({ model: 'anthropic/claude-sonnet-4.5' }), [
      { model: 'anthropic/claude-sonnet-4.5', reason: 'requested' }
    ])
  })

  test('disabled by default: falls back to openai/gpt-4o-mini when no model given', () => {
    assert.deepEqual(pickCandidates({}), [{ model: 'openai/gpt-4o-mini', reason: 'requested' }])
  })

  test('enabled: orders candidates cheapest-first, slices to maxSteps, and filters to benchmark-passing models', async () => {
    // pickCandidates reads module-level `state`, which is only mutated through the router's
    // POST /api/cascade/config and /api/cascade/benchmark/run handlers. Mount the real router
    // standalone (isolated CASCADE_DATA_FILE from the top of this file) to drive that state.
    const { cascadeRouter } = await import('../src/cascade.js')
    const express = (await import('express')).default
    const app = express()
    app.use(express.json())
    app.use(cascadeRouter)
    const server = app.listen(0)
    await new Promise((resolve) => server.once('listening', resolve))
    const { port } = server.address()
    const baseUrl = `http://localhost:${port}`
    const post = (path, body) =>
      fetch(`${baseUrl}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

    try {
      // enable with a generous maxSteps first to see full cheapest-first ordering
      await post('/api/cascade/config', { enabled: true, maxSteps: CATALOG.length })
      const fullOrder = pickCandidates({ model: 'openai/gpt-4o' })
      assert.deepEqual(fullOrder, priceAsc.map((model) => ({ model, reason: 'cascade' })))
      // requested model is ignored once cascade is enabled
      assert.notEqual(fullOrder[0].model, 'openai/gpt-4o')

      // slice to maxSteps
      await post('/api/cascade/config', { maxSteps: 3 })
      const sliced = pickCandidates({})
      assert.deepEqual(sliced, priceAsc.slice(0, 3).map((model) => ({ model, reason: 'cascade' })))

      // filter to benchmark-passing models only
      await post('/api/cascade/config', { maxSteps: CATALOG.length })
      const benchRes = await post('/api/cascade/benchmark/run', {})
      const bench = await benchRes.json()
      const passing = new Set(bench.results.filter((r) => r.passed).map((r) => r.model))
      assert.ok(passing.size < CATALOG.length, 'mock benchmark must fail at least one model to exercise the filter')
      const filtered = pickCandidates({})
      assert.deepEqual(
        filtered,
        priceAsc.filter((id) => passing.has(id)).map((model) => ({ model, reason: 'cascade' }))
      )
      for (const c of filtered) assert.ok(passing.has(c.model))
    } finally {
      // reset so this module-level state doesn't leak into other tests in this file
      await post('/api/cascade/config', { enabled: false, maxSteps: 3 })
      await new Promise((resolve) => server.close(resolve))
    }
  })
})

// ---------------------------------------------------------------------------
// failover.pickFallback
// ---------------------------------------------------------------------------

describe('failover.pickFallback', () => {
  test('prefers cheapest same-family candidate over other families', async () => {
    const sessionId = `unit-fallback-family-${Date.now()}`
    // dead model is openai/gpt-4o (tier 3, family gpt); same-family candidate is gpt-4o-mini
    const fb = await pickFallback('openai/gpt-4o', sessionId)
    assert.ok(fb)
    assert.equal(fb.model, 'openai/gpt-4o-mini')
    assert.equal(typeof fb.profile, 'string')
  })

  test('falls back to same-tier cheapest when no same-family candidate exists', async () => {
    const sessionId = `unit-fallback-tier-${Date.now()}`
    // meta/llama-3.3-70b is the only "llama" family model, so no same-family candidate exists.
    // it is tier 2; the other tier-2 model is mistral/mistral-large (prompt 2 + completion 6 = 8)
    const fb = await pickFallback('meta/llama-3.3-70b', sessionId)
    assert.ok(fb)
    assert.equal(fb.model, 'mistral/mistral-large')
  })

  test('falls back to the overall cheapest candidate when no same-family or same-tier match exists', async () => {
    // meta/llama-3.3-70b (tier 2, family llama) has one same-tier peer: mistral/mistral-large.
    // Kill it so neither the same-family nor same-tier branch has a match, forcing the
    // overall-cheapest branch. Among the remaining models the cheapest is google/gemini-2.5-flash
    // (prompt 0.075 + completion 0.3 = 0.375, cheaper than deepseek-chat's 0.42).
    const { failoverRouter } = await import('../src/failover.js')
    const express = (await import('express')).default
    const app = express()
    app.use(express.json())
    app.use(failoverRouter)
    const server = app.listen(0)
    await new Promise((resolve) => server.once('listening', resolve))
    const { port } = server.address()
    const baseUrl = `http://localhost:${port}`
    const post = (path, body) =>
      fetch(`${baseUrl}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

    try {
      await post('/api/failover/kill', { model: 'mistral/mistral-large' })
      const sessionId = `unit-fallback-cheapest-${Date.now()}`
      const fb = await pickFallback('meta/llama-3.3-70b', sessionId)
      assert.ok(fb)
      assert.equal(fb.model, 'google/gemini-2.5-flash')
    } finally {
      await post('/api/failover/revive', {})
      await new Promise((resolve) => server.close(resolve))
    }
  })

  test('excludes killed models and the dead model itself', async () => {
    const { failoverRouter } = await import('../src/failover.js')
    const express = (await import('express')).default
    const app = express()
    app.use(express.json())
    app.use(failoverRouter)
    const server = app.listen(0)
    await new Promise((resolve) => server.once('listening', resolve))
    const { port } = server.address()
    const baseUrl = `http://localhost:${port}`
    const post = (path, body) =>
      fetch(`${baseUrl}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

    try {
      // kill every same-family (gpt tier1/3) and same-tier(1) candidate for gpt-4o-mini except
      // one cheap survivor, then confirm the killed ones never appear as the fallback.
      await post('/api/failover/kill', { model: 'openai/gpt-4o' })
      await post('/api/failover/kill', { model: 'anthropic/claude-haiku-4.5' })
      await post('/api/failover/kill', { model: 'google/gemini-2.5-flash' })
      await post('/api/failover/kill', { model: 'deepseek/deepseek-chat' })

      const sessionId = `unit-fallback-exclude-${Date.now()}`
      const fb = await pickFallback('openai/gpt-4o-mini', sessionId)
      assert.ok(fb)
      assert.notEqual(fb.model, 'openai/gpt-4o-mini')
      for (const killedId of ['openai/gpt-4o', 'anthropic/claude-haiku-4.5', 'google/gemini-2.5-flash', 'deepseek/deepseek-chat']) {
        assert.notEqual(fb.model, killedId)
      }
    } finally {
      await post('/api/failover/revive', {})
      await new Promise((resolve) => server.close(resolve))
    }
  })

  test('returns null when there are no candidates left (all other models killed)', async () => {
    const { failoverRouter } = await import('../src/failover.js')
    // Kill every model except the dead one via the router's own HTTP surface would need a server;
    // instead spin up a tiny app mount to exercise the exported router directly.
    const express = (await import('express')).default
    const app = express()
    app.use(express.json())
    app.use(failoverRouter)
    const server = app.listen(0)
    await new Promise((resolve) => server.once('listening', resolve))
    const { port } = server.address()
    const baseUrl = `http://localhost:${port}`

    const deadModel = 'openai/gpt-4o-mini'
    const others = CATALOG.filter((m) => m.id !== deadModel).map((m) => m.id)
    for (const id of others) {
      await fetch(`${baseUrl}/api/failover/kill`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: id })
      })
    }

    const sessionId = `unit-fallback-null-${Date.now()}`
    const fb = await pickFallback(deadModel, sessionId)
    assert.equal(fb, null)

    // revive all so this module-level killed Set doesn't leak into other tests in this file/process
    await fetch(`${baseUrl}/api/failover/revive`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    })
    await new Promise((resolve) => server.close(resolve))
  })
})
