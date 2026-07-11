import config from './config.js'
import { meshChat } from './mesh.js'
import { mockChat } from './mock.js'
import { appendEvent } from './usage.js'
import { pickCandidates } from './cascade.js'
import { noteTurn, pickFallback, isKilled } from './failover.js'

const RETRYABLE = new Set([402, 408, 429, 500, 502, 503, 504])

async function callModel(body, model) {
  if (isKilled(model)) return { ok: false, status: 503, data: { error: { message: `model ${model} is down`, code: 'model_killed' } } }
  if (config.MOCK) return { ok: true, status: 200, data: mockChat({ ...body, model }) }
  const result = await meshChat({ ...body, model })
  if (config.DEGRADE_ON_SPEND_LIMIT && result.status === 402) {
    const data = mockChat({ ...body, model })
    return { ok: true, status: 200, data: { ...data, brolly_degraded: 'mesh_spend_limit' } }
  }
  return result
}

export async function completeChat(body) {
  const sessionId = body.session_id || null
  const attempts = []
  const candidates = pickCandidates(body)
  for (let i = 0; i < candidates.length; i++) {
    const cand = candidates[i]
    const messages = cand.profile ? [{ role: 'system', content: cand.profile }, ...body.messages] : body.messages
    const start = Date.now()
    let result
    try {
      result = await callModel({ ...body, messages }, cand.model)
    } catch {
      result = { ok: false, status: 502, data: { error: { message: 'upstream request failed' } } }
    }
    appendEvent({
      ts: new Date().toISOString(),
      model: cand.model,
      prompt_tokens: result.data?.usage?.prompt_tokens || 0,
      completion_tokens: result.data?.usage?.completion_tokens || 0,
      latency_ms: Date.now() - start,
      stream: false,
      ok: result.ok,
      cascade_step: i,
      session_id: sessionId,
      reason: cand.reason
    })
    attempts.push({ model: cand.model, status: result.status, ok: result.ok, reason: cand.reason })
    if (result.ok) {
      if (sessionId) noteTurn(sessionId, body, result.data, cand.model)
      return { status: result.status, data: { ...result.data, brolly: { model_used: cand.model, attempts } } }
    }
    if (!RETRYABLE.has(result.status)) {
      return { status: result.status, data: { ...result.data, brolly: { model_used: null, attempts } } }
    }
    if (i === candidates.length - 1 && sessionId) {
      const fb = await pickFallback(cand.model, sessionId)
      if (fb && !attempts.some((a) => a.model === fb.model)) {
        candidates.push({ model: fb.model, reason: 'failover', profile: fb.profile })
      }
    }
  }
  const last = attempts[attempts.length - 1]
  return {
    status: last ? last.status : 502,
    data: { error: { message: 'all candidates failed' }, brolly: { model_used: null, attempts } }
  }
}
