"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "brolly:weekly-budget";
const DEFAULT_BUDGET = 25;

const listeners = new Set<() => void>();

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): number {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  const parsed = stored ? Number(stored) : NaN;
  return !Number.isNaN(parsed) && parsed > 0 ? parsed : DEFAULT_BUDGET;
}

function getServerSnapshot(): number {
  return DEFAULT_BUDGET;
}

export function useWeeklyBudget(): [number, (value: number) => void] {
  const budget = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const updateBudget = useCallback((value: number) => {
    if (Number.isNaN(value) || value <= 0) return;
    window.localStorage.setItem(STORAGE_KEY, String(value));
    listeners.forEach((listener) => listener());
  }, []);

  return [budget, updateBudget];
}
