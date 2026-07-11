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

test('POST /v1/chat/completions returns choices and usage', async () => {
  const res = await fetch(`${baseUrl}/v1/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'user', content: 'hello' }] })
  })
  assert.equal(res.status, 200)
  const body = await res.json()
  assert.ok(Array.isArray(body.choices) && body.choices.length > 0)
  assert.ok(body.usage && typeof body.usage.prompt_tokens === 'number')
})

test('POST /v1/chat/completions rejects invalid body', async () => {
  const res = await fetch(`${baseUrl}/v1/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ foo: 'bar' })
  })
  assert.equal(res.status, 400)
})

test('GET /api/usage/summary returns totals', async () => {
  const res = await fetch(`${baseUrl}/api/usage/summary`)
  assert.equal(res.status, 200)
  const body = await res.json()
  assert.ok(Array.isArray(body.totals))
  assert.ok(typeof body.burnRate === 'number')
})

test('GET /api/health ok', async () => {
  const res = await fetch(`${baseUrl}/api/health`)
  assert.equal(res.status, 200)
  const body = await res.json()
  assert.equal(body.ok, true)
  assert.equal(body.mock, true)
})
