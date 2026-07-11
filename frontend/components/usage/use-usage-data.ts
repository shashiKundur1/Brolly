"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  fetchUsageEvents,
  fetchUsageSummary,
  type UsageEvent,
  type UsageSummary,
} from "@/components/usage/types";

const POLL_INTERVAL_MS = 3000;

type UsageDataState = {
  summary: UsageSummary | null;
  events: UsageEvent[] | null;
  loading: boolean;
  error: boolean;
  refresh: () => void;
};

export function useUsageData(): UsageDataState {
  const [summary, setSummary] = useState<UsageSummary | null>(null);
  const [events, setEvents] = useState<UsageEvent[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const attemptRef = useRef(0);
  const refreshRef = useRef<() => void>(() => {});

  useEffect(() => {
    const controller = new AbortController();

    async function load(signal: AbortSignal) {
      const attempt = ++attemptRef.current;
      try {
        const [summaryData, eventsData] = await Promise.all([
          fetchUsageSummary(signal),
          fetchUsageEvents(50, signal),
        ]);
        if (signal.aborted || attempt !== attemptRef.current) return;
        setSummary(summaryData);
        setEvents(eventsData);
        setError(false);
        setLoading(false);
      } catch (err) {
        if (signal.aborted) return;
        if ((err as Error).name === "AbortError") return;
        setError(true);
        setLoading(false);
      }
    }

    function tick() {
      load(controller.signal);
    }

    refreshRef.current = () => {
      setLoading(true);
      tick();
    };

    tick();
    const interval = setInterval(tick, POLL_INTERVAL_MS);

    return () => {
      controller.abort();
      clearInterval(interval);
    };
  }, []);

  const refresh = useCallback(() => {
    refreshRef.current();
  }, []);

  return { summary, events, loading, error, refresh };
}
