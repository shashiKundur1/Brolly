import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'

process.env.NODE_ENV = 'test'
process.env.MOCK = '1'

const { default: app } = await import('../src/server.js')

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

test('GET /api/failover/killed starts empty', async () => {
  const res = await fetch(`${baseUrl}/api/failover/killed`)
  assert.equal(res.status, 200)
  const body = await res.json()
  assert.deepEqual(body.killed, [])
})

test('POST /api/failover/kill requires model', async () => {
  const res = await fetch(`${baseUrl}/api/failover/kill`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  })
  assert.equal(res.status, 400)
})

test('kill -> chat completion fails over to fallback and profile is set', async () => {
  const model = 'openai/gpt-4o-mini'
  const sessionId = 'sess-failover-1'

  const killRes = await fetch(`${baseUrl}/api/failover/kill`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model })
  })
  assert.equal(killRes.status, 200)
  const killBody = await killRes.json()
  assert.ok(killBody.killed.includes(model))

  const chatRes = await fetch(`${baseUrl}/v1/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      session_id: sessionId,
      messages: [{ role: 'user', content: 'hello there' }]
    })
  })
  assert.equal(chatRes.status, 200)
  const chatBody = await chatRes.json()

  assert.ok(Array.isArray(chatBody.brolly.attempts))
  const killedAttempt = chatBody.brolly.attempts.find((a) => a.model === model)
  assert.ok(killedAttempt)
  assert.equal(killedAttempt.status, 503)
  assert.equal(killedAttempt.ok, false)

  const fallbackAttempt = chatBody.brolly.attempts.find((a) => a.model !== model)
  assert.ok(fallbackAttempt)
  assert.equal(fallbackAttempt.ok, true)
  assert.equal(chatBody.brolly.model_used, fallbackAttempt.model)

  const sessionRes = await fetch(`${baseUrl}/api/failover/sessions/${sessionId}`)
  assert.equal(sessionRes.status, 200)
  const sessionBody = await sessionRes.json()
  assert.ok(typeof sessionBody.profile === 'string' && sessionBody.profile.length > 0)
  assert.ok(sessionBody.profile.includes(model))
  assert.ok(sessionBody.turns.length >= 1)

  const listRes = await fetch(`${baseUrl}/api/failover/sessions`)
  const listBody = await listRes.json()
  const listed = listBody.find((s) => s.id === sessionId)
  assert.ok(listed)
  assert.ok(listed.turns >= 1)
  assert.ok(typeof listed.profile === 'string')

  const revive1 = await fetch(`${baseUrl}/api/failover/revive`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model })
  })
  const revive1Body = await revive1.json()
  assert.ok(!revive1Body.killed.includes(model))
})

test('revive with no body clears all killed models', async () => {
  await fetch(`${baseUrl}/api/failover/kill`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'anthropic/claude-haiku-4.5' })
  })
  await fetch(`${baseUrl}/api/failover/kill`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'google/gemini-2.5-flash' })
  })

  const reviveRes = await fetch(`${baseUrl}/api/failover/revive`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  })
  assert.equal(reviveRes.status, 200)
  const reviveBody = await reviveRes.json()
  assert.deepEqual(reviveBody.killed, [])
})

test('GET /api/failover/sessions/:id 404s for unknown session', async () => {
  const res = await fetch(`${baseUrl}/api/failover/sessions/does-not-exist`)
  assert.equal(res.status, 404)
})
