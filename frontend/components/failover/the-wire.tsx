"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LightningDoodle, CrossDoodle, CheckDoodle } from "@/components/brand/icons"
import type { Attempt } from "@/components/failover/types"

type TheWireProps = {
  attempts: Attempt[]
  runId: number
}

const wirePath = "M6 0C4 12 9 20 5 32C1 44 8 54 4 66C0 78 7 88 6 100"

function WireStrand() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 12 100"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-y-0 -z-10 w-3 text-foreground/40"
      style={{ left: "1.2rem" }}
    >
      <path
        d={wirePath}
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        vectorEffect="non-scaling-stroke"
        style={{ filter: "url(#doodle-rough-filter)" }}
      />
    </svg>
  )
}

export function TheWire({ attempts, runId }: TheWireProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || attempts.length === 0) return
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    const failedCards = containerRef.current.querySelectorAll<HTMLElement>(
      "[data-wire-card='failed']"
    )
    const survivorCard = containerRef.current.querySelector<HTMLElement>(
      "[data-wire-card='survivor']"
    )

    if (prefersReducedMotion) {
      gsap.set(failedCards, { rotate: 6 })
      gsap.set(survivorCard, { x: 0, opacity: 1 })
      return
    }

    const timeline = gsap.timeline()
    if (failedCards.length > 0) {
      timeline.to(failedCards, {
        rotate: 6,
        duration: 0.5,
        ease: "none",
        stagger: 0.1,
      })
    }
    if (survivorCard) {
      timeline.fromTo(
        survivorCard,
        { x: 32, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, ease: "none" },
        failedCards.length > 0 ? "-=0.1" : 0
      )
    }

    return () => {
      timeline.kill()
    }
  }, [runId, attempts])

  const failed = attempts.filter((attempt) => !attempt.ok)
  const survivor = attempts.find((attempt) => attempt.ok)

  return (
    <Card className={`flex min-h-0 flex-col !bg-accent/50 ${attempts.length === 0 ? "flex-1" : "shrink-0"}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <span className="grid size-8 shrink-0 place-items-center rounded-full border-2 border-foreground bg-card">
            <LightningDoodle className="size-4 text-primary" />
          </span>
          the wire
        </CardTitle>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col">
        {attempts.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 rounded-2xl border-2 border-foreground bg-card p-6 text-center">
            <div className="relative grid size-24 place-items-center">
              <svg
                aria-hidden="true"
                viewBox="0 0 100 100"
                className="absolute inset-0 size-full text-accent"
              >
                <path
                  d="M50 4C68 4 88 16 94 36C99 53 92 70 78 84C64 97 40 98 24 88C9 79 2 60 4 42C6 24 21 9 38 5C42 4 46 4 50 4Z"
                  fill="currentColor"
                />
              </svg>
              <LightningDoodle className="relative size-10 text-primary" />
            </div>
            <div className="flex flex-col gap-1.5">
              <p className="font-display text-3xl leading-none">Kill a model to see the swap</p>
              <p className="font-body text-sm text-muted-foreground">
                Brolly hot-swaps to a survivor without dropping the thread
              </p>
            </div>
          </div>
        ) : (
          <div
            ref={containerRef}
            className="relative flex flex-col gap-3 rounded-2xl border-2 border-foreground bg-card p-4"
          >
            <WireStrand />
            {failed.map((attempt, index) => (
              <div
                key={`${attempt.model}-${index}`}
                data-wire-card="failed"
                className="doodle-card-soft relative flex w-fit max-w-full origin-left items-center gap-2 border-primary! bg-primary/15 py-2 pr-3 pl-2.5"
              >
                <CrossDoodle className="size-4 shrink-0 text-primary" />
                <span className="truncate font-mono text-sm tabular-nums line-through decoration-primary decoration-2">
                  {attempt.model}
                </span>
                <Badge variant="destructive" className="shrink-0">
                  {attempt.reason || attempt.status}
                </Badge>
              </div>
            ))}
            {survivor && (
              <div
                data-wire-card="survivor"
                className="doodle-card flex w-fit max-w-full items-center gap-2 bg-secondary py-2 pr-3 pl-2.5"
              >
                <CheckDoodle className="size-4 shrink-0 text-foreground" />
                <span className="truncate font-mono text-sm font-semibold tabular-nums">
                  {survivor.model}
                </span>
                <Badge variant="secondary" className="shrink-0 border-foreground">
                  covered
                </Badge>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
