import { test, before, after, beforeEach, afterEach, describe } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

process.env.NODE_ENV = 'test'
process.env.MOCK = '1'
process.env.CASCADE_DATA_FILE = join(mkdtempSync(join(tmpdir(), 'brolly-integration-cascade-')), 'cascade.json')

const { default: app } = await import('../src/server.js')
const { CATALOG } = await import('../src/models.js')

let server
let baseUrl
let sessionCounter = 0

function uniqueSessionId(tag) {
  sessionCounter += 1
  return `integration-${tag}-${Date.now()}-${sessionCounter}`
}

before(async () => {
  server = app.listen(0)
  await new Promise((resolve) => server.once('listening', resolve))
  const { port } = server.address()
  baseUrl = `http://localhost:${port}`
})

after(async () => {
  await new Promise((resolve) => server.close(resolve))
})

function get(path) {
  return fetch(`${baseUrl}${path}`)
}

function post(path, body) {
  return fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body ?? {})
  })
}

// Reset all shared module-level state before and after every test so that ordering never matters.
async function resetState() {
  await post('/api/failover/revive', {})
  await post('/api/cascade/config', { enabled: false, maxSteps: 3 })
}

beforeEach(resetState)
afterEach(resetState)

describe('(a) cascade enable -> benchmark -> chat with no model routes cheapest-passing', () => {
  test('routes to the cheapest benchmark-passing model with cascade reasons', async () => {
    await post('/api/cascade/config', { enabled: true, maxSteps: CATALOG.length })
    const benchRes = await post('/api/cascade/benchmark/run', {})
    assert.equal(benchRes.status, 200)
    const bench = await benchRes.json()

    const priceAsc = [...CATALOG].sort((a, b) => a.prompt + a.completion - (b.prompt + b.completion))
    const passingIds = new Set(bench.results.filter((r) => r.passed).map((r) => r.model))
    const cheapestPassing = priceAsc.find((m) => passingIds.has(m.id))
    assert.ok(cheapestPassing, 'expected at least one passing model in the mock benchmark')

    const chatRes = await post('/v1/chat/completions', {
      // deliberately omit `model` — cascade routing must ignore any preference anyway
      messages: [{ role: 'user', content: 'route me please' }]
    })
    assert.equal(chatRes.status, 200)
    const body = await chatRes.json()

    assert.equal(body.brolly.model_used, cheapestPassing.id)
    assert.ok(Array.isArray(body.brolly.attempts) && body.brolly.attempts.length > 0)
    for (const attempt of body.brolly.attempts) {
      assert.equal(attempt.reason, 'cascade')
    }
    assert.equal(body.brolly.attempts[body.brolly.attempts.length - 1].model, cheapestPassing.id)
    assert.equal(body.brolly.attempts[body.brolly.attempts.length - 1].ok, true)
  })
})

describe('(b) kill a model -> chat with session_id fails over with 503 + successful fallback', () => {
  test('killed attempt shows 503, a fallback succeeds, session profile/models_used update', async () => {
    const model = 'anthropic/claude-sonnet-4.5'
    const sessionId = uniqueSessionId('kill-fallback')

    const killRes = await post('/api/failover/kill', { model })
    assert.equal(killRes.status, 200)
    const killBody = await killRes.json()
    assert.ok(killBody.killed.includes(model))

    const chatRes = await post('/v1/chat/completions', {
      model,
      session_id: sessionId,
      messages: [{ role: 'user', content: 'ping through the killed model' }]
    })
    assert.equal(chatRes.status, 200)
    const chatBody = await chatRes.json()

    const killedAttempt = chatBody.brolly.attempts.find((a) => a.model === model)
    assert.ok(killedAttempt)
    assert.equal(killedAttempt.status, 503)
    assert.equal(killedAttempt.ok, false)

    const fallbackAttempt = chatBody.brolly.attempts.find((a) => a.model !== model)
    assert.ok(fallbackAttempt, 'expected a fallback attempt after the killed model failed')
    assert.equal(fallbackAttempt.ok, true)
    assert.equal(chatBody.brolly.model_used, fallbackAttempt.model)

    const sessionRes = await get(`/api/failover/sessions/${sessionId}`)
    assert.equal(sessionRes.status, 200)
    const sessionBody = await sessionRes.json()
    assert.equal(typeof sessionBody.profile, 'string')
    assert.ok(sessionBody.profile.length > 0)
    assert.ok(sessionBody.profile.includes(model))
    assert.ok(sessionBody.models_used.includes(fallbackAttempt.model))
  })
})

describe('(c) revive -> killed model becomes callable again', () => {
  test('after revive, a direct request to the previously killed model succeeds', async () => {
    const model = 'google/gemini-2.5-pro'
    const sessionId = uniqueSessionId('revive')

    await post('/api/failover/kill', { model })
    const killedRes = await get('/api/failover/killed')
    const killedBody = await killedRes.json()
    assert.ok(killedBody.killed.includes(model))

    const failingChat = await post('/v1/chat/completions', {
      model,
      session_id: sessionId,
      messages: [{ role: 'user', content: 'should fail over while killed' }]
    })
    const failingBody = await failingChat.json()
    assert.notEqual(failingBody.brolly.model_used, model)

    const reviveRes = await post('/api/failover/revive', { model })
    assert.equal(reviveRes.status, 200)
    const reviveBody = await reviveRes.json()
    assert.ok(!reviveBody.killed.includes(model))

    const okChat = await post('/v1/chat/completions', {
      model,
      session_id: uniqueSessionId('revive-ok'),
      messages: [{ role: 'user', content: 'should succeed now that it is revived' }]
    })
    assert.equal(okChat.status, 200)
    const okBody = await okChat.json()
    assert.equal(okBody.brolly.model_used, model)
    assert.equal(okBody.brolly.attempts.length, 1)
    assert.equal(okBody.brolly.attempts[0].ok, true)
  })
})

describe('(d) usage events grow after chats', () => {
  test('readEvents count increases after issuing chat completions', async () => {
    // GET /api/usage/events caps `limit` at 500 (see src/server.js), so we can't just ask for
    // "everything" once the shared, gitignored data/usage.jsonl log exceeds that. Import
    // readEvents directly instead, which has no cap, to observe true growth.
    const { readEvents } = await import('../src/usage.js')

    const beforeCount = readEvents().length

    await post('/v1/chat/completions', {
      model: 'openai/gpt-4o-mini',
      messages: [{ role: 'user', content: 'grow the log #1' }]
    })
    await post('/v1/chat/completions', {
      model: 'deepseek/deepseek-chat',
      messages: [{ role: 'user', content: 'grow the log #2' }]
    })

    const afterCount = readEvents().length
    assert.ok(
      afterCount >= beforeCount + 2,
      `expected event count to grow by at least 2, was ${beforeCount} -> ${afterCount}`
    )
  })
})
