"use client";

import { useSyncExternalStore } from "react";

const cache = new Map<string, string>();
const inflight = new Map<string, Promise<void>>();
const listeners = new Set<() => void>();

const CONTENT_BOUNDS: Record<string, [number, number, number, number]> = {
  "/brand/bento/hero-character-umbrella.svg": [231, 157, 609, 748],
  "/brand/bento/hero-umbrella-hills.svg": [116, 266, 793, 486],
  "/brand/bento/how-subscribe.svg": [381, 176, 270, 691],
  "/brand/bento/how-cascade.svg": [233, 251, 542, 535],
  "/brand/bento/how-failover.svg": [215, 158, 615, 738],
};

function notify() {
  listeners.forEach((listener) => listener());
}

function tightenViewBox(src: string, svgMarkup: string): string {
  const bounds = CONTENT_BOUNDS[src];
  if (!bounds) return svgMarkup;
  const [x, y, w, h] = bounds;
  return svgMarkup.replace(/viewBox="[^"]*"/, `viewBox="${x} ${y} ${w} ${h}"`);
}

function ensureLoaded(src: string) {
  if (cache.has(src) || inflight.has(src)) return;
  const promise = fetch(src)
    .then((res) => res.text())
    .then((text) => {
      cache.set(src, tightenViewBox(src, text));
      notify();
    })
    .catch(() => {})
    .finally(() => {
      inflight.delete(src);
    });
  inflight.set(src, promise);
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

type InlineDoodleSvgProps = {
  src: string;
  className?: string;
};

export function InlineDoodleSvg({ src, className }: InlineDoodleSvgProps) {
  const markup = useSyncExternalStore(
    subscribe,
    () => cache.get(src) ?? null,
    () => null
  );

  if (!markup) {
    ensureLoaded(src);
    return <span className={className} aria-hidden="true" />;
  }

  return (
    <span
      className={className}
      role="img"
      aria-label=""
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}
