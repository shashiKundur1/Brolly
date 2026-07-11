import { Router } from 'express'

export function noteTurn(sessionId, body, response, model) {}

export function pickFallback(deadModel, sessionId) {
  return null
}

export function isKilled(model) {
  return false
}

export const failoverRouter = Router()

failoverRouter.get('/api/failover/sessions', (req, res) => {
  res.json([])
})
