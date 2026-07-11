import express from 'express'
import config from './config.js'
import { meshChatStream, meshModels } from './mesh.js'
import { appendEvent, readEvents, summarize } from './usage.js'
import { mockStream, seedHistory } from './mock.js'
import { completeChat } from './pipeline.js'
import { cascadeRouter } from './cascade.js'
import { failoverRouter } from './failover.js'
import { CATALOG } from './models.js'

if (config.MOCK) seedHistory()

const app = express()
app.use(express.json())

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  if (req.method === 'OPTIONS') return res.sendStatus(204)
  next()
})

app.use(cascadeRouter)
app.use(failoverRouter)

function isValidChatBody(body) {
  return (
    body &&
    typeof body === 'object' &&
    !Array.isArray(body) &&
    Array.isArray(body.messages) &&
    body.messages.length > 0
  )
}

app.post('/v1/chat/completions', async (req, res) => {
  const body = req.body
  if (!isValidChatBody(body)) {
    return res.status(400).json({ error: 'invalid request: body must be an object with a non-empty messages array' })
  }

  const model = body.model || 'default'
  const stream = Boolean(body.stream)
  const start = Date.now()

  if (stream) {
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    let prompt_tokens = 0
    let completion_tokens = 0
    let ok = true

    try {
      if (config.MOCK) {
        let completionText = ''
        for await (const chunk of mockStream(body)) {
          res.write(chunk)
          const match = chunk.match(/"content":"([^"]*)"/)
          if (match) completionText += match[1]
        }
        prompt_tokens = Math.max(1, Math.ceil(JSON.stringify(body.messages).length / 4))
        completion_tokens = Math.max(1, Math.ceil(completionText.length / 4))
      } else {
        const upstream = await meshChatStream(body)
        ok = upstream.ok
        const reader = upstream.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const text = decoder.decode(value, { stream: true })
          buffer += text
          res.write(text)
          const usageMatch = buffer.match(/"usage":\s*{[^}]*"prompt_tokens":\s*(\d+)[^}]*"completion_tokens":\s*(\d+)/)
          if (usageMatch) {
            prompt_tokens = Number(usageMatch[1])
            completion_tokens = Number(usageMatch[2])
          }
        }
      }
    } catch (err) {
      ok = false
    } finally {
      appendEvent({
        ts: new Date().toISOString(),
        model,
        prompt_tokens,
        completion_tokens,
        latency_ms: Date.now() - start,
        stream: true,
        ok
      })
      res.end()
    }
    return
  }

  const out = await completeChat(body)
  return res.status(out.status).json(out.data)
})

app.get('/v1/models', async (req, res) => {
  if (config.MOCK) {
    return res.json({
      object: 'list',
      data: CATALOG.map((m) => ({
        id: m.id,
        object: 'model',
        family: m.family,
        tier: m.tier,
        pricing: { prompt_usd_per_1m: m.prompt, completion_usd_per_1m: m.completion }
      }))
    })
  }
  try {
    const result = await meshModels()
    return res.status(result.status).json(result.data)
  } catch (err) {
    return res.status(502).json({ error: 'upstream request failed' })
  }
})

app.get('/api/usage/summary', (req, res) => {
  res.json(summarize(readEvents()))
})

app.get('/api/usage/events', (req, res) => {
  const limit = Number(req.query.limit) || 100
  const events = readEvents()
  res.json(events.slice(-limit).reverse())
})

app.get('/api/health', (req, res) => {
  res.json({ ok: true, mock: config.MOCK })
})

if (process.env.NODE_ENV !== 'test') {
  app.listen(config.PORT, () => {
    console.log(`Brolly backend listening on :${config.PORT} (mock: ${config.MOCK})`)
  })
}

export default app
