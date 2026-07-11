"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
      setError("Couldn't reach the cascade. Try again in a moment.");
      setResponse(null);
    } finally {
      setSending(false);
    }
  }

  const attempts = response?.brolly?.attempts ?? [];
  const answer = response?.choices?.[0]?.message?.content;
  const savings = response ? computeSavings(response, ladder) : null;

  return (
    <Card className="doodle-border">
      <CardHeader>
        <CardTitle>Try it</CardTitle>
        <CardDescription>
          Send a real prompt and watch the cascade climb the ladder.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <Input
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") handleSend();
            }}
            placeholder="Ask the cascade something"
            disabled={sending}
          />
          <Button
            className="bg-primary text-primary-foreground"
            onClick={handleSend}
            disabled={sending || !prompt.trim()}
          >
            {sending ? (
              <CircleNotchIcon data-icon="inline-start" className="animate-spin" />
            ) : (
              <PaperPlaneRightIcon data-icon="inline-start" />
            )}
            Send
          </Button>
        </div>
        {error && <p className="text-sm text-primary">{error}</p>}
        {attempts.length > 0 && (
          <div ref={containerRef} className="flex flex-col gap-3">
            {attempts.map((attempt, index) => (
              <AttemptStep key={index} attempt={attempt} reveal />
            ))}
          </div>
        )}
        {answer && (
          <div className="flex flex-col gap-2 rounded-lg bg-muted p-4">
            <p className="text-sm">{answer}</p>
          </div>
        )}
        {savings !== null && (
          <p className="text-sm text-muted-foreground">
            saved vs priciest rung: {formatUsd(savings)}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
