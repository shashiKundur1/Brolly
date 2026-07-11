import { Router } from 'express'
import config from './config.js'
import { meshChat } from './mesh.js'
import { CATALOG } from './models.js'

// ponytail: in-memory Map/Set only, ceiling is process-restart data loss and single-instance scale; upgrade path is a shared store (Redis/Postgres) behind the same noteTurn/pickFallback/isKilled interface
const killed = new Set()
const sessions = new Map()

const MAX_LEN = 500

function truncate(text) {
  const str = typeof text === 'string' ? text : String(text ?? '')
  return str.length > MAX_LEN ? str.slice(0, MAX_LEN) : str
}

function lastUserMessage(body) {
  const messages = Array.isArray(body?.messages) ? body.messages : []
  const last = [...messages].reverse().find((m) => m.role === 'user')
  return last?.content ? String(last.content) : ''
}

function getSession(sessionId) {
  let session = sessions.get(sessionId)
  if (!session) {
    session = { id: sessionId, turns: [], models_used: [], profile: null }
    sessions.set(sessionId, session)
  }
  return session
}

export function isKilled(model) {
  return killed.has(model)
}

export function noteTurn(sessionId, body, responseData, model) {
  const session = getSession(sessionId)
  const user = truncate(lastUserMessage(body))
  const assistant = truncate(responseData?.choices?.[0]?.message?.content)
  session.turns.push({ ts: new Date().toISOString(), user, assistant, model })
  if (!session.models_used.includes(model)) session.models_used.push(model)
  return session
}

function summarizeTurns(session) {
  return session.turns
    .map((t) => `user: ${t.user} | assistant: ${t.assistant}`)
    .join(' / ')
}

function buildTemplateProfile(deadModel, session) {
  const summary = summarizeTurns(session) || 'no prior turns recorded'
  return `You are taking over a conversation previously handled by ${deadModel}. Continue seamlessly. Conversation so far covered: ${summary}. Match the prior assistant's tone and formatting.`
}

function cheapest(models) {
  return models.reduce((best, m) => {
    if (!best) return m
    const bestCost = best.prompt + best.completion
    const cost = m.prompt + m.completion
    return cost < bestCost ? m : best
  }, null)
}

function selectCandidate(deadModel, candidates) {
  const deadInfo = CATALOG.find((m) => m.id === deadModel)
  if (deadInfo) {
    const sameFamily = candidates.filter((m) => m.family === deadInfo.family)
    if (sameFamily.length > 0) return cheapest(sameFamily)
    const sameTier = candidates.filter((m) => m.tier === deadInfo.tier)
    if (sameTier.length > 0) return cheapest(sameTier)
  }
  return cheapest(candidates)
}

async function distillProfile(deadModel, session) {
  if (config.MOCK) return buildTemplateProfile(deadModel, session)
  const eligible = CATALOG.filter((m) => !killed.has(m.id))
  const distiller = cheapest(eligible)
  if (!distiller) return buildTemplateProfile(deadModel, session)
  try {
    const transcript = summarizeTurns(session) || 'no prior turns recorded'
    const result = await meshChat({
      model: distiller.id,
      messages: [
        {
          role: 'user',
          content: `Write a 4-sentence behavior card describing how to continue this conversation, previously handled by ${deadModel}, seamlessly. Match tone and formatting. Transcript: ${transcript}`
        }
      ]
    })
    const content = result?.data?.choices?.[0]?.message?.content
    if (result.ok && content) return content
    return buildTemplateProfile(deadModel, session)
  } catch {
    return buildTemplateProfile(deadModel, session)
  }
}

export async function pickFallback(deadModel, sessionId) {
  const candidates = CATALOG.filter((m) => m.id !== deadModel && !killed.has(m.id))
  if (candidates.length === 0) return null
  const chosen = selectCandidate(deadModel, candidates)
  if (!chosen) return null
  const session = getSession(sessionId)
  const profile = await distillProfile(deadModel, session)
  session.profile = profile
  return { model: chosen.id, profile }
}

export const failoverRouter = Router()

failoverRouter.get('/api/failover/sessions', (req, res) => {
  res.json(
    [...sessions.values()].map((s) => ({
      id: s.id,
      turns: s.turns.length,
      models_used: s.models_used,
      last_ts: s.turns.length > 0 ? s.turns[s.turns.length - 1].ts : null,
      profile: s.profile
    }))
  )
})

failoverRouter.get('/api/failover/sessions/:id', (req, res) => {
  const session = sessions.get(req.params.id)
  if (!session) return res.status(404).json({ error: 'session not found' })
  res.json({ id: session.id, turns: session.turns, models_used: session.models_used, profile: session.profile })
})

failoverRouter.post('/api/failover/kill', (req, res) => {
  const model = req.body?.model
  if (!model) return res.status(400).json({ error: 'model is required' })
  killed.add(model)
  res.json({ killed: [...killed] })
})

failoverRouter.post('/api/failover/revive', (req, res) => {
  const model = req.body?.model
  if (model) killed.delete(model)
  else killed.clear()
  res.json({ killed: [...killed] })
})

failoverRouter.get('/api/failover/killed', (req, res) => {
  res.json({ killed: [...killed] })
})
