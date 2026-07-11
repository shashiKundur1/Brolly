import { Router } from 'express'

export function pickCandidates(body) {
  return [{ model: body.model || 'openai/gpt-4o-mini', reason: 'requested' }]
}

export const cascadeRouter = Router()

cascadeRouter.get('/api/cascade/config', (req, res) => {
  res.json({ enabled: false, ladder: [] })
})
