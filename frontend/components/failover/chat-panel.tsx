"use client"

import { useEffect, useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Field, FieldLabel } from "@/components/ui/field"
import { ArrowRightDoodle, SparkDoodle } from "@/components/brand/icons"
import type { ChatMessage, ModelInfo } from "@/components/failover/types"

type ChatPanelProps = {
  models: ModelInfo[]
  currentModel: string
  onModelChange: (model: string) => void
  messages: ChatMessage[]
  onSend: (text: string) => void
  sending: boolean
}

export function ChatPanel({
  models,
  currentModel,
  onModelChange,
  messages,
  onSend,
  sending,
}: ChatPanelProps) {
  const [draft, setDraft] = useState("")
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const list = listRef.current
    if (!list) return
    list.scrollTo({ top: list.scrollHeight })
  }, [messages])

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const text = draft.trim()
    if (!text || sending) return
    onSend(text)
    setDraft("")
  }

  return (
    <div className="doodle-card cell-mint flex h-full min-h-0 flex-col p-4">
      <div className="flex min-w-0 shrink-0 flex-col gap-3 pb-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="flex shrink-0 items-center gap-2 font-heading text-xl font-semibold text-foreground">
          <span className="grid size-8 shrink-0 place-items-center rounded-full border-2 border-foreground bg-card">
            <SparkDoodle className="size-4 text-primary" />
          </span>
          chat
        </h2>
        <Field orientation="horizontal" className="min-w-0 items-center gap-2 sm:flex-1 sm:justify-end">
          <FieldLabel htmlFor="starting-model" className="shrink-0 text-sm">
            model
          </FieldLabel>
          <Select
            value={currentModel}
            onValueChange={(value) => {
              if (typeof value === "string") onModelChange(value)
            }}
          >
            <SelectTrigger
              id="starting-model"
              className="w-full min-w-0 font-mono text-sm sm:w-auto sm:min-w-56"
            >
              <SelectValue placeholder="Choose a model" className="truncate" />
            </SelectTrigger>
            <SelectContent>
              {models.map((model) => (
                <SelectItem key={model.id} value={model.id} className="font-mono">
                  {model.id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-3">
        <div
          ref={listRef}
          className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto rounded-2xl border-2 border-foreground bg-card p-3"
          style={{ scrollbarWidth: "thin", scrollbarColor: "var(--border) transparent" }}
        >
          {messages.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-5 text-center">
              <div className="relative grid size-24 place-items-center">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 100 100"
                  className="absolute inset-0 size-full text-secondary"
                >
                  <path
                    d="M50 4C68 4 88 16 94 36C99 53 92 70 78 84C64 97 40 98 24 88C9 79 2 60 4 42C6 24 21 9 38 5C42 4 46 4 50 4Z"
                    fill="currentColor"
                  />
                </svg>
                <SparkDoodle className="relative size-10 text-primary" />
              </div>
              <div className="flex flex-col gap-1.5">
                <p className="font-display text-3xl leading-none">Say hello to start</p>
                <p className="font-body text-sm text-muted-foreground">
                  Brolly stays on the wire even if this model goes down
                </p>
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex flex-col gap-1 ${
                  message.role === "user" ? "items-end" : "items-start"
                }`}
              >
                {message.role === "user" ? (
                  <div className="doodle-card max-w-4/5 border-primary bg-primary/25 px-3.5 py-2.5 text-sm text-foreground">
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                ) : (
                  <div className="doodle-card-soft max-w-4/5 bg-card px-3.5 py-2.5 text-sm text-foreground">
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                )}
                {message.role === "assistant" && message.model && (
                  <Badge variant="secondary" className="font-mono text-xs tabular-nums">
                    {message.model}
                  </Badge>
                )}
              </div>
            ))
          )}
        </div>
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <Input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Send a message"
            disabled={sending}
            className="h-11 bg-card"
          />
          <Button
            type="submit"
            disabled={sending || !draft.trim()}
            size="lg"
            className="gap-2 bg-primary text-primary-foreground"
          >
            <ArrowRightDoodle
              className={`size-4 ${sending ? "animate-spin motion-reduce:animate-none" : ""}`}
            />
            send
          </Button>
        </form>
      </div>
    </div>
  )
}
