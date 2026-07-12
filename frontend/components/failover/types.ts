export type ModelInfo = {
  id: string
  family?: string
  tier?: string
  pricing?: unknown
}

export type ChatMessage = {
  role: "user" | "assistant"
  content: string
  model?: string
}

export type AttemptStatus = number | "ok" | "failed" | "skipped"

export type Attempt = {
  model: string
  status: AttemptStatus
  ok: boolean
  reason?: string
}

export type ChatCompletionResponse = {
  choices: Array<{ message: { content: string } }>
  usage?: unknown
  brolly: {
    model_used: string
    attempts: Attempt[]
  }
}

export type SessionTurn = {
  ts: string
  user: string
  assistant: string
  model: string
}

export type SessionProfile = string | null

export type SessionDetail = {
  id: string
  turns: SessionTurn[]
  models_used: string[]
  profile: SessionProfile
}
