import type {
  ChatCompletionResponse,
  ChatMessage,
  ModelInfo,
  SessionDetail,
} from "@/components/failover/types"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  })
  if (!response.ok) {
    throw new Error(`${path} responded ${response.status}`)
  }
  return response.json() as Promise<T>
}

export function fetchModels() {
  return requestJson<{ data: ModelInfo[] }>("/v1/models")
}

export function sendChatCompletion(
  model: string,
  messages: ChatMessage[],
  sessionId: string
) {
  return requestJson<ChatCompletionResponse>("/v1/chat/completions", {
    method: "POST",
    body: JSON.stringify({
      model,
      messages: messages.map(({ role, content }) => ({ role, content })),
      session_id: sessionId,
      prefer_requested: true,
    }),
  })
}

export function killModel(model: string) {
  return requestJson<{ killed: string[] }>("/api/failover/kill", {
    method: "POST",
    body: JSON.stringify({ model }),
  })
}

export function reviveAllModels() {
  return requestJson<{ killed: string[] }>("/api/failover/revive", {
    method: "POST",
    body: JSON.stringify({}),
  })
}

export function fetchKilledModels() {
  return requestJson<{ killed: string[] }>("/api/failover/killed")
}

export function fetchSession(sessionId: string) {
  return requestJson<SessionDetail>(`/api/failover/sessions/${sessionId}`)
}
