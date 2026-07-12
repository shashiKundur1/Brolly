"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import {
  LightningDoodle,
  CrossDoodle,
  CheckDoodle,
  UmbrellaDoodle,
} from "@/components/brand/icons"
import type { Attempt } from "@/components/failover/types"

type TheWireProps = {
  attempts: Attempt[]
  runId: number
}

function shortName(model: string) {
  const parts = model.split("/")
  return parts[parts.length - 1]
}

function stepCaption(attempt: Attempt, isFirst: boolean) {
  if (attempt.ok) {
    if (attempt.reason === "failover") {
      return "Brolly rerouted here. Reply delivered, thread intact."
    }
    return "Answered on the first try. No failover needed."
  }
  if (attempt.status === 503 || attempt.reason === "requested") {
    return isFirst
      ? "Your message hit this model. It was down."
      : "Tried next. Still down."
  }
  return "Rejected the request."
}

export function TheWire({ attempts, runId }: TheWireProps) {
  const containerRef = useRef<HTMLOListElement>(null)

  useEffect(() => {
    if (!containerRef.current || attempts.length === 0) return
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    const steps = containerRef.current.querySelectorAll<HTMLElement>(
      "[data-wire-step]"
    )
    if (prefersReducedMotion) {
      gsap.set(steps, { x: 0, opacity: 1 })
      return
    }

    const timeline = gsap.timeline()
    timeline.fromTo(
      steps,
      { x: 20, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.4, ease: "none", stagger: 0.18 }
    )
    return () => {
      timeline.kill()
    }
  }, [runId, attempts])

  const survivor = attempts.find((attempt) => attempt.ok)
  const downed = attempts.filter((attempt) => !attempt.ok)
  const swapped = Boolean(survivor) && downed.length > 0

  return (
    <div
      className={`doodle-card cell-butter flex min-h-0 flex-col p-4 ${
        attempts.length === 0 ? "flex-1" : "shrink-0"
      }`}
    >
      <h2 className="mb-3 flex shrink-0 items-center gap-2 font-heading text-xl font-semibold text-foreground">
        <span className="grid size-8 shrink-0 place-items-center rounded-full border-2 border-foreground bg-card">
          <LightningDoodle className="size-4 text-primary" />
        </span>
        what just happened
      </h2>
      <div className="flex min-h-0 flex-1 flex-col">
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
              <p className="font-display text-3xl leading-none">
                Kill a model, then send
              </p>
              <p className="font-body text-sm text-muted-foreground">
                Brolly will trace every step of the swap right here
              </p>
            </div>
          </div>
        ) : (
          <div className="flex min-h-0 flex-col gap-3">
            <div
              className={`flex shrink-0 items-start gap-2.5 rounded-2xl border-2 border-foreground p-3 ${
                swapped ? "bg-secondary" : "bg-card"
              }`}
            >
              <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full border-2 border-foreground bg-card">
                {swapped ? (
                  <UmbrellaDoodle className="size-4 text-primary" />
                ) : (
                  <CheckDoodle className="size-4 text-foreground" />
                )}
              </span>
              <p className="font-body text-sm leading-snug">
                {swapped ? (
                  <>
                    <span className="font-semibold">Covered.</span> Brolly caught
                    the outage and swapped{" "}
                    <span className="font-mono text-xs tabular-nums">
                      {shortName(downed[0].model)}
                    </span>{" "}
                    →{" "}
                    <span className="font-mono text-xs font-semibold tabular-nums">
                      {shortName(survivor!.model)}
                    </span>
                    . You never lost the thread.
                  </>
                ) : (
                  <>
                    <span className="font-semibold">Delivered.</span>{" "}
                    <span className="font-mono text-xs tabular-nums">
                      {survivor ? shortName(survivor.model) : "the model"}
                    </span>{" "}
                    answered on the first try, no failover needed.
                  </>
                )}
              </p>
            </div>
            <ol
              ref={containerRef}
              className="relative flex min-h-0 flex-col gap-2 overflow-y-auto rounded-2xl border-2 border-foreground bg-card p-3"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "var(--border) transparent",
              }}
            >
              {attempts.map((attempt, index) => {
                const isFirst = index === 0
                return (
                  <li
                    key={`${attempt.model}-${index}`}
                    data-wire-step
                    className={`flex origin-left items-start gap-2.5 rounded-xl border-2 px-2.5 py-2 ${
                      attempt.ok
                        ? "border-foreground bg-secondary"
                        : "border-primary bg-primary/12"
                    }`}
                  >
                    <span className="grid size-6 shrink-0 place-items-center rounded-full border-2 border-foreground bg-card font-mono text-xs font-semibold tabular-nums">
                      {index + 1}
                    </span>
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <span className="flex items-center gap-1.5">
                        {attempt.ok ? (
                          <CheckDoodle className="size-3.5 shrink-0 text-foreground" />
                        ) : (
                          <CrossDoodle className="size-3.5 shrink-0 text-primary" />
                        )}
                        <span
                          className={`truncate font-mono text-sm tabular-nums ${
                            attempt.ok
                              ? "font-semibold"
                              : "line-through decoration-primary decoration-2"
                          }`}
                        >
                          {attempt.model}
                        </span>
                        <span
                          className={`ml-auto shrink-0 rounded-full border-2 border-foreground px-2 py-0.5 font-mono text-[0.65rem] font-semibold tabular-nums ${
                            attempt.ok ? "bg-card" : "bg-primary text-primary-foreground"
                          }`}
                        >
                          {attempt.ok ? "200 ok" : `${attempt.status} down`}
                        </span>
                      </span>
                      <span className="font-body text-xs leading-snug text-muted-foreground">
                        {stepCaption(attempt, isFirst)}
                      </span>
                    </div>
                  </li>
                )
              })}
            </ol>
          </div>
        )}
      </div>
    </div>
  )
}
