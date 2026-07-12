"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowClockwiseIcon } from "@phosphor-icons/react/dist/ssr"
import { SkullDoodle } from "@/components/brand/icons"
import { ChatPanel } from "@/components/failover/chat-panel"
import { KillSwitch } from "@/components/failover/kill-switch"
import { TheWire } from "@/components/failover/the-wire"
import { BehaviorCard } from "@/components/failover/behavior-card"
import { EmptyState } from "@/components/failover/empty-state"
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
    const requestedModel = currentModel
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
      const hadFailover =
        modelUsed !== requestedModel || response.brolly.attempts.length > 1
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
      <section className="flex w-full flex-col lg:h-[calc(100vh-4rem)]">
        <div className="doodle-card m-4 flex flex-1 flex-col !bg-secondary/25 p-6 lg:m-6">
          <EmptyState icon={SkullDoodle} line="Checking in with the policy desk…" />
        </div>
      </section>
    )
  }

  if (loadError) {
    return (
      <section className="flex w-full flex-col lg:h-[calc(100vh-4rem)]">
        <div className="doodle-card m-4 flex flex-1 flex-col !bg-primary/15 p-6 lg:m-6">
          <EmptyState
            icon={SkullDoodle}
            line="Brolly can't reach the backend right now"
            action={{ label: "retry", onClick: retryLoad }}
          />
        </div>
      </section>
    )
  }

  return (
    <section className="flex w-full flex-col gap-3 py-4 lg:h-[calc(100vh-4rem)] lg:overflow-hidden">
      <div className="doodle-card flex shrink-0 flex-col gap-3 !bg-primary px-5 py-4">
        <div className="flex flex-wrap items-baseline gap-3 rounded-2xl border-2 border-foreground bg-card px-4 py-2.5">
          <h1 className="font-display text-4xl leading-none text-foreground">
            Failover
          </h1>
          <p className="text-sm text-muted-foreground">
            Kill the model mid-chat. Watch Brolly hot-swap.
          </p>
        </div>
        <KillSwitch
          currentModel={currentModel}
          killedModels={killedModels}
          onKill={handleKill}
          onRevive={handleRevive}
          killing={killing}
          reviving={reviving}
        />
      </div>
      {actionError && (
        <div className="doodle-rough-soft flex shrink-0 items-center gap-3 bg-accent px-4 py-2.5">
          <SkullDoodle className="size-5 shrink-0 text-primary" />
          <p className="flex-1 text-sm font-semibold">
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
      <div className="grid w-full min-h-0 flex-1 grid-cols-1 items-stretch gap-4 lg:grid-cols-2 lg:gap-6">
        <ChatPanel
          models={models}
          currentModel={currentModel}
          onModelChange={setCurrentModel}
          messages={messages}
          onSend={handleSend}
          sending={sending}
        />
        <div
          className="flex min-h-0 flex-col gap-4 lg:overflow-y-auto lg:pr-1"
          style={{ scrollbarWidth: "thin", scrollbarColor: "var(--border) transparent" }}
        >
          <TheWire attempts={attempts} runId={runId} />
          {session && (
            <BehaviorCard profile={session.profile} modelsUsed={session.models_used} />
          )}
        </div>
      </div>
    </section>
  )
}
