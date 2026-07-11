"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { WarningIcon, ArrowClockwiseIcon } from "@phosphor-icons/react/dist/ssr"
import { ChatPanel } from "@/components/failover/chat-panel"
import { KillSwitch } from "@/components/failover/kill-switch"
import { TheWire } from "@/components/failover/the-wire"
import { BehaviorCard } from "@/components/failover/behavior-card"
import {
  fetchKilledModels,
  fetchModels,
  fetchSession,
  killModel,
  reviveAllModels,
  sendChatCompletion,
} from "@/components/failover/api"
import type {
  Attempt,
  ChatMessage,
  ModelInfo,
  SessionDetail,
} from "@/components/failover/types"

export default function FailoverPage() {
  const sessionIdRef = useRef<string>(null)
  if (sessionIdRef.current == null) {
    sessionIdRef.current = crypto.randomUUID()
  }

  const [models, setModels] = useState<ModelInfo[]>([])
  const [currentModel, setCurrentModel] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [killedModels, setKilledModels] = useState<string[]>([])
  const [attempts, setAttempts] = useState<Attempt[]>([])
  const [runId, setRunId] = useState(0)
  const [session, setSession] = useState<SessionDetail | null>(null)
  const [sending, setSending] = useState(false)
  const [killing, setKilling] = useState(false)
  const [reviving, setReviving] = useState(false)
  const [loadStatus, setLoadStatus] = useState<"loading" | "ready" | "error">(
    "loading"
  )
  const [reloadToken, setReloadToken] = useState(0)
  const [actionError, setActionError] = useState(false)
  const loading = loadStatus === "loading"
  const loadError = loadStatus === "error"
  const sessionId = sessionIdRef.current

  useEffect(() => {
    let cancelled = false
    Promise.all([fetchModels(), fetchKilledModels()])
      .then(([modelsResponse, killedResponse]) => {
        if (cancelled) return
        setModels(modelsResponse.data)
        setCurrentModel((prev) => prev || modelsResponse.data[0]?.id || "")
        setKilledModels(killedResponse.killed)
        setLoadStatus("ready")
      })
      .catch(() => {
        if (!cancelled) setLoadStatus("error")
      })
    return () => {
      cancelled = true
    }
  }, [reloadToken])

  const retryLoad = useCallback(() => {
    setLoadStatus("loading")
    setReloadToken((token) => token + 1)
  }, [])

  async function handleSend(text: string) {
    if (!currentModel) return
    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: text }]
    setMessages(nextMessages)
    setSending(true)
    try {
      const response = await sendChatCompletion(currentModel, nextMessages, sessionId)
      const replyText = response.choices[0]?.message.content ?? ""
      const modelUsed = response.brolly.model_used
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: replyText, model: modelUsed },
      ])
      setAttempts(response.brolly.attempts)
      setRunId((id) => id + 1)
      if (modelUsed !== currentModel) {
        setCurrentModel(modelUsed)
      }
      const hadFailover = response.brolly.attempts.some((attempt) => !attempt.ok)
      if (hadFailover) {
        try {
          const detail = await fetchSession(sessionId)
          setSession(detail)
        } catch {
          setSession(null)
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Brolly couldn't reach the backend just now. Try again in a moment.",
        },
      ])
    } finally {
      setSending(false)
    }
  }

  async function handleKill() {
    if (!currentModel) return
    setKilling(true)
    setActionError(false)
    try {
      const response = await killModel(currentModel)
      setKilledModels(response.killed)
    } catch {
      setActionError(true)
    } finally {
      setKilling(false)
    }
  }

  async function handleRevive() {
    setReviving(true)
    setActionError(false)
    try {
      const response = await reviveAllModels()
      setKilledModels(response.killed)
    } catch {
      setActionError(true)
    } finally {
      setReviving(false)
    }
  }

  if (loading) {
    return (
      <section className="w-full py-16">
        <p className="font-display text-2xl">Checking in with the policy desk…</p>
      </section>
    )
  }

  if (loadError) {
    return (
      <section className="flex w-full flex-col items-center gap-4 py-24 text-center">
        <WarningIcon size={40} weight="duotone" className="text-primary" />
        <p className="font-display text-2xl">
          Brolly can&apos;t reach the backend right now
        </p>
        <Button
          onClick={retryLoad}
          className="gap-2 bg-primary text-primary-foreground"
        >
          <ArrowClockwiseIcon size={16} />
          retry
        </Button>
      </section>
    )
  }

  return (
    <section className="flex w-full flex-col gap-8 py-16">
      <div className="flex flex-col gap-2">
        <h1 className="text-5xl">Failover</h1>
        <p className="text-muted-foreground">
          Chat with a model, kill it mid-conversation, watch Brolly hot-swap without
          losing the thread.
        </p>
      </div>
      {actionError && (
        <div className="doodle-border flex items-center gap-3 rounded-xl border-dashed bg-card px-4 py-3">
          <WarningIcon size={20} weight="duotone" className="shrink-0 text-primary" />
          <p className="flex-1 text-sm">
            Brolly couldn&apos;t reach the backend for that action.
          </p>
          <Button
            variant="ghost"
            onClick={() => setActionError(false)}
            className="gap-2"
          >
            <ArrowClockwiseIcon size={16} />
            dismiss
          </Button>
        </div>
      )}
      <KillSwitch
        currentModel={currentModel}
        killedModels={killedModels}
        onKill={handleKill}
        onRevive={handleRevive}
        killing={killing}
        reviving={reviving}
      />
      <div className="grid w-full gap-8 lg:grid-cols-2">
        <ChatPanel
          models={models}
          currentModel={currentModel}
          onModelChange={setCurrentModel}
          messages={messages}
          onSend={handleSend}
          sending={sending}
        />
        <div className="flex flex-col gap-8">
          <TheWire attempts={attempts} runId={runId} />
          {session && (
            <BehaviorCard profile={session.profile} modelsUsed={session.models_used} />
          )}
        </div>
      </div>
    </section>
  )
}
