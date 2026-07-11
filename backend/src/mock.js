import { existsSync } from 'node:fs'
import { appendEvent, USAGE_FILE } from './usage.js'

const CANNED_ANSWER =
  "This is a mock response from Brolly's local mock mode. Set MESH_API_KEY to talk to the real Mesh API."

function estimateTokens(text) {
  return Math.max(1, Math.ceil(text.length / 4))
}

function lastUserMessage(body) {
  const messages = Array.isArray(body?.messages) ? body.messages : []
  const last = [...messages].reverse().find((m) => m.role === 'user')
  return last?.content ? String(last.content) : ''
}

export function mockChat(body) {
  const promptText = lastUserMessage(body)
  const prompt_tokens = estimateTokens(promptText)
  const completion_tokens = estimateTokens(CANNED_ANSWER)
  const model = body?.model || 'default'
  return {
    id: `mock-${Date.now()}`,
    object: 'chat.completion',
    created: Math.floor(Date.now() / 1000),
    model,
    choices: [
      {
        index: 0,
        message: { role: 'assistant', content: CANNED_ANSWER },
        finish_reason: 'stop'
      }
    ],
    usage: {
      prompt_tokens,
      completion_tokens,
      total_tokens: prompt_tokens + completion_tokens
    }
  }
}

export async function* mockStream(body) {
  const model = body?.model || 'default'
  const words = CANNED_ANSWER.split(' ')
  const id = `mock-${Date.now()}`
  for (const word of words) {
    const chunk = {
      id,
      object: 'chat.completion.chunk',
      created: Math.floor(Date.now() / 1000),
      model,
      choices: [{ index: 0, delta: { content: word + ' ' }, finish_reason: null }]
    }
    yield `data: ${JSON.stringify(chunk)}\n\n`
  }
  const finalChunk = {
    id,
    object: 'chat.completion.chunk',
    created: Math.floor(Date.now() / 1000),
    model,
    choices: [{ index: 0, delta: {}, finish_reason: 'stop' }]
  }
  yield `data: ${JSON.stringify(finalChunk)}\n\n`
  yield 'data: [DONE]\n\n'
}

const MODELS = [
  'gpt-4o',
  'gpt-4o-mini',
  'claude-sonnet',
  'claude-haiku',
  'gemini-flash',
  'gemini-pro',
  'llama-70b',
  'mistral-large',
  'deepseek-chat'
]

export function seedHistory() {
  if (existsSync(USAGE_FILE)) return
  const now = Date.now()
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000
  for (let i = 0; i < 200; i++) {
    const model = MODELS[Math.floor(Math.random() * MODELS.length)]
    const ts = new Date(now - Math.random() * sevenDaysMs).toISOString()
    const prompt_tokens = 50 + Math.floor(Math.random() * 950)
    const completion_tokens = 20 + Math.floor(Math.random() * 780)
    appendEvent({
      ts,
      model,
      prompt_tokens,
      completion_tokens,
      latency_ms: 200 + Math.floor(Math.random() * 2000),
      stream: Math.random() > 0.5,
      ok: true
    })
  }
}
