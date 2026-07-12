"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
    <Card className="doodle-border doodle-shadow flex h-full min-h-0 flex-col">
      <CardHeader>
        <div className="flex min-w-0 items-center justify-between gap-3">
          <CardTitle className="flex shrink-0 items-center gap-2 text-xl">
            <SparkDoodle className="size-5 text-primary" />
            chat
          </CardTitle>
          <Field orientation="horizontal" className="min-w-0 flex-1 items-center justify-end gap-2">
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
                className="min-w-0 max-w-full font-mono text-sm"
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
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col gap-3">
        <div
          ref={listRef}
          className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto"
          style={{ scrollbarWidth: "thin", scrollbarColor: "var(--border) transparent" }}
        >
          {messages.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 py-12 text-center">
              <SparkDoodle className="size-10 text-muted-foreground" />
              <p className="font-display text-2xl">Say hello to start</p>
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
                  <div className="max-w-4/5 rounded-xl border-2 border-foreground bg-primary/15 px-3 py-2 text-sm text-foreground doodle-card-shadow">
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                ) : (
                  <div className="doodle-card-soft max-w-4/5 px-3 py-2 text-sm text-foreground">
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
            className="h-10"
          />
          <Button
            type="submit"
            disabled={sending || !draft.trim()}
            className="h-10 bg-primary text-primary-foreground"
          >
            <ArrowRightDoodle
              className={`size-4 ${sending ? "animate-spin motion-reduce:animate-none" : ""}`}
            />
            send
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
