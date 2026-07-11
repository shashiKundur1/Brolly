"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PaperPlaneRightIcon, CircleNotchIcon } from "@phosphor-icons/react/dist/ssr";
import { AttemptStep } from "@/components/cascade/attempt-step";
import { useStaggerReveal } from "@/components/cascade/use-stagger-reveal";
import {
  sendChat,
  formatUsd,
  type ChatCompletionResponse,
  type LadderModel,
} from "@/components/cascade/types";

type TryItBoxProps = {
  ladder: LadderModel[];
};

function computeSavings(
  response: ChatCompletionResponse,
  ladder: LadderModel[]
): number | null {
  if (!response.brolly || !response.usage) return null;
  const priciest = [...ladder].sort(
    (a, b) => b.prompt_usd_per_1m - a.prompt_usd_per_1m
  )[0];
  const used = ladder.find((rung) => rung.model === response.brolly?.model_used);
  if (!priciest || !used) return null;

  const promptTokens = response.usage.prompt_tokens ?? 0;
  const completionTokens = response.usage.completion_tokens ?? 0;

  const priciestCost =
    (promptTokens / 1_000_000) * priciest.prompt_usd_per_1m +
    (completionTokens / 1_000_000) * priciest.completion_usd_per_1m;
  const usedCost =
    (promptTokens / 1_000_000) * used.prompt_usd_per_1m +
    (completionTokens / 1_000_000) * used.completion_usd_per_1m;

  return Math.max(priciestCost - usedCost, 0);
}

export function TryItBox({ ladder }: TryItBoxProps) {
  const [prompt, setPrompt] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<ChatCompletionResponse | null>(null);
  const containerRef = useStaggerReveal<HTMLDivElement>(
    !sending && response !== null,
    [response]
  );

  async function handleSend() {
    if (!prompt.trim() || sending) return;
    setSending(true);
    setError(null);
    try {
      const result = await sendChat(prompt.trim());
      setResponse(result);
    } catch {
      setError("couldn't reach the cascade");
      setResponse(null);
    } finally {
      setSending(false);
    }
  }

  const attempts = response?.brolly?.attempts ?? [];
  const answer = response?.choices?.[0]?.message?.content;
  const savings = response ? computeSavings(response, ladder) : null;

  return (
    <div className="doodle-border flex flex-col rounded-2xl bg-card p-4 lg:h-full lg:min-h-0">
      <h2 className="font-display text-xl leading-none">try it</h2>
      <div className="mt-2 flex items-center gap-2">
        <Input
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") handleSend();
          }}
          placeholder="ask the cascade"
          disabled={sending}
          className="h-9 text-sm"
        />
        <Button size="sm" onClick={handleSend} disabled={sending || !prompt.trim()}>
          {sending ? (
            <CircleNotchIcon data-icon="inline-start" className="animate-spin" />
          ) : (
            <PaperPlaneRightIcon data-icon="inline-start" />
          )}
          send
        </Button>
      </div>
      {error && <p className="mt-2 text-xs text-primary">{error}</p>}
      <div className="mt-2 lg:min-h-0 lg:flex-1 lg:overflow-y-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "var(--border) transparent" }}>
        {attempts.length > 0 && (
          <div ref={containerRef} className="flex flex-col gap-1.5">
            {attempts.map((attempt, index) => (
              <AttemptStep key={index} attempt={attempt} reveal />
            ))}
          </div>
        )}
        {answer && (
          <p className="mt-2 rounded-lg bg-muted p-2.5 text-xs">{answer}</p>
        )}
        {savings !== null && (
          <p className="mt-2 font-mono text-xs tabular-nums text-muted-foreground">
            saved {formatUsd(savings)} vs priciest
          </p>
        )}
      </div>
    </div>
  );
}
