"use client";

import { useSyncExternalStore } from "react";

const cache = new Map<string, string>();
const inflight = new Map<string, Promise<void>>();
const listeners = new Set<() => void>();

const CONTENT_BOUNDS: Record<string, [number, number, number, number]> = {
  "/brand/bento/hero-umbrella-hills.svg": [120, 270, 785, 480],
  "/brand/bento/stat-coins.svg": [242, 240, 540, 545],
  "/brand/bento/stat-chart.svg": [272, 265, 500, 480],
  "/brand/bento/rain-cloud.svg": [230, 267, 565, 515],
};

function notify() {
  listeners.forEach((listener) => listener());
}

function tightenViewBox(src: string, svgMarkup: string): string {
  const bounds = CONTENT_BOUNDS[src];
  if (!bounds) return svgMarkup;
  const [x, y, w, h] = bounds;
  return svgMarkup.replace(
    /viewBox="[^"]*"/,
    `viewBox="${x} ${y} ${w} ${h}"`
  );
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

type InlineBrandSvgProps = {
  src: string;
  className?: string;
};

export function InlineBrandSvg({ src, className }: InlineBrandSvgProps) {
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
