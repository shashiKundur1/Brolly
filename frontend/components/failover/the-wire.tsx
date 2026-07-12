"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LightningDoodle, CrossDoodle, CheckDoodle } from "@/components/brand/icons"
import { EmptyState } from "@/components/failover/empty-state"
import type { Attempt } from "@/components/failover/types"

type TheWireProps = {
  attempts: Attempt[]
  runId: number
}

const wirePath =
  "M6 0C4 12 9 20 5 32C1 44 8 54 4 66C0 78 7 88 6 100"

function WireStrand() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 12 100"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-y-0 -z-10 w-3 text-border"
      style={{ left: "1.2rem" }}
    >
      <path
        d={wirePath}
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="1 7"
        strokeLinecap="round"
        fill="none"
        vectorEffect="non-scaling-stroke"
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
    <Card className={`flex min-h-0 flex-col ${attempts.length === 0 ? "flex-1" : "shrink-0"}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <LightningDoodle className="size-5 text-primary" />
          the wire
        </CardTitle>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col">
        {attempts.length === 0 ? (
          <EmptyState icon={LightningDoodle} line="Kill a model to see the swap" />
        ) : (
          <div ref={containerRef} className="relative flex flex-col gap-3">
            <WireStrand />
            {failed.map((attempt, index) => (
              <div
                key={`${attempt.model}-${index}`}
                data-wire-card="failed"
                className="doodle-card-soft relative flex w-fit max-w-full origin-left items-center gap-2 bg-accent py-2 pr-3 pl-2.5"
              >
                <CrossDoodle className="size-4 shrink-0 text-primary" />
                <span className="truncate font-mono text-sm tabular-nums">
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
                <span className="truncate font-mono text-sm tabular-nums">
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
