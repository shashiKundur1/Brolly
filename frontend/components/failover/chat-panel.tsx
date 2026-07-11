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
import {
  ChatCircleIcon,
  PaperPlaneTiltIcon,
  CircleNotchIcon,
} from "@phosphor-icons/react/dist/ssr"
import { EmptyState } from "@/components/failover/empty-state"
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
    <Card className="doodle-border doodle-shadow flex h-full flex-col">
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <ChatCircleIcon size={22} weight="duotone" />
            Chat
          </CardTitle>
          <Field orientation="horizontal" className="w-fit items-center gap-2">
            <FieldLabel htmlFor="starting-model" className="text-sm">
              Starting model
            </FieldLabel>
            <Select
              value={currentModel}
              onValueChange={(value) => {
                if (typeof value === "string") onModelChange(value)
              }}
            >
              <SelectTrigger id="starting-model" className="font-mono">
                <SelectValue placeholder="Choose a model" />
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
      <CardContent className="flex flex-1 flex-col gap-4">
        <div ref={listRef} className="flex flex-1 flex-col gap-4 overflow-y-auto">
          {messages.length === 0 ? (
            <EmptyState
              icon={ChatCircleIcon}
              line="Say hello and start the policy"
            />
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex flex-col gap-1.5 ${
                  message.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-xl rounded-xl px-4 py-2.5 ${
                    message.role === "user"
                      ? "bg-primary/15 text-foreground"
                      : "bg-card ring-1 ring-foreground/10"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
                {message.role === "assistant" && message.model && (
                  <Badge variant="secondary" className="font-mono">
                    {message.model}
                  </Badge>
                )}
              </div>
            ))
          )}
        </div>
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
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
            {sending ? (
              <CircleNotchIcon size={16} className="animate-spin" />
            ) : (
              <PaperPlaneTiltIcon size={16} />
            )}
            Send
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
