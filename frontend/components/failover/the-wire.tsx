"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  LightningIcon,
  CloudLightningIcon,
  CheckCircleIcon,
} from "@phosphor-icons/react/dist/ssr"
import { EmptyState } from "@/components/failover/empty-state"
import type { Attempt } from "@/components/failover/types"

type TheWireProps = {
  attempts: Attempt[]
  runId: number
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
      gsap.set(failedCards, { rotate: 8 })
      gsap.set(survivorCard, { x: 0, opacity: 1 })
      return
    }

    const timeline = gsap.timeline()
    if (failedCards.length > 0) {
      timeline.to(failedCards, {
        rotate: 8,
        duration: 0.5,
        ease: "none",
        stagger: 0.1,
      })
    }
    if (survivorCard) {
      timeline.fromTo(
        survivorCard,
        { x: 48, opacity: 0 },
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
    <Card className="doodle-border doodle-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <LightningIcon size={22} weight="duotone" />
          the wire
        </CardTitle>
      </CardHeader>
      <CardContent>
        {attempts.length === 0 ? (
          <EmptyState
            icon={LightningIcon}
            line="Kill a model to watch the hot-swap"
          />
        ) : (
          <div ref={containerRef} className="flex flex-col gap-3">
            {failed.map((attempt, index) => (
              <div
                key={`${attempt.model}-${index}`}
                data-wire-card="failed"
                className="doodle-border flex origin-left items-center gap-3 rounded-xl border-dashed bg-accent px-4 py-3"
              >
                <CloudLightningIcon
                  size={22}
                  weight="fill"
                  className="shrink-0 text-primary"
                />
                <div className="flex flex-1 items-center justify-between gap-3">
                  <span className="font-mono text-sm">{attempt.model}</span>
                  <Badge variant="destructive">
                    {attempt.reason || attempt.status}
                  </Badge>
                </div>
              </div>
            ))}
            {survivor && (
              <div
                data-wire-card="survivor"
                className="doodle-border flex items-center gap-3 rounded-xl bg-card px-4 py-3 ring-1 ring-foreground/10"
              >
                <CheckCircleIcon
                  size={22}
                  weight="fill"
                  className="shrink-0 text-secondary-foreground"
                />
                <div className="flex flex-1 items-center justify-between gap-3">
                  <span className="font-mono text-sm">{survivor.model}</span>
                  <Badge variant="secondary">covered</Badge>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
