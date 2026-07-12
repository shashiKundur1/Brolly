"use client";

import { useCallback, useEffect, useState } from "react";
import { CascadeHeader } from "@/components/cascade/cascade-header";
import { Ladder } from "@/components/cascade/ladder";
import { BenchmarkPanel } from "@/components/cascade/benchmark-panel";
import { BenchmarkDetailDialog } from "@/components/cascade/benchmark-detail-dialog";
import { TryItBox } from "@/components/cascade/try-it-box";
import { CascadeErrorState } from "@/components/cascade/cascade-error-state";
import {
  fetchCascadeConfig,
  updateCascadeConfig,
  fetchBenchmark,
  runBenchmark,
  type CascadeConfig,
  type BenchmarkCase,
  type BenchmarkModelResult,
  type LadderModel,
} from "@/components/cascade/types";

export default function CascadePage() {
  const [config, setConfig] = useState<CascadeConfig | null>(null);
  const [configLoading, setConfigLoading] = useState(true);
  const [configError, setConfigError] = useState(false);

  const [cases, setCases] = useState<BenchmarkCase[]>([]);
  const [results, setResults] = useState<BenchmarkModelResult[] | null>(null);
  const [running, setRunning] = useState(false);
  const [selectedResult, setSelectedResult] =
    useState<BenchmarkModelResult | null>(null);

  const loadInitialData = useCallback((signal?: AbortSignal) => {
    setConfigLoading(true);
    setConfigError(false);

    fetchCascadeConfig(signal)
      .then((data) => {
        setConfig(data);
        setConfigLoading(false);
      })
      .catch((error) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setConfigError(true);
        setConfigLoading(false);
      });

    fetchBenchmark(signal)
      .then((data) => {
        setCases(data.cases);
        setResults(data.results);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadInitialData(controller.signal);
    return () => controller.abort();
  }, [loadInitialData]);

  async function handleEnabledChange(enabled: boolean) {
    if (!config) return;
    setConfig({ ...config, enabled });
    try {
      const updated = await updateCascadeConfig({ enabled });
      setConfig(updated);
    } catch {
      setConfig(config);
    }
  }

  async function handleMaxStepsChange(maxSteps: number) {
    if (!config) return;
    setConfig({ ...config, maxSteps });
    try {
      const updated = await updateCascadeConfig({ maxSteps });
      setConfig(updated);
    } catch {
      setConfig(config);
    }
  }

  async function handleRunBenchmark() {
    setRunning(true);
    try {
      const data = await runBenchmark();
      setResults(data.results);
      const configData = await fetchCascadeConfig();
      setConfig(configData);
    } catch {
    } finally {
      setRunning(false);
    }
  }

  function handleSelectRung(rung: LadderModel) {
    const result = results?.find((r) => r.model === rung.model);
    if (result) setSelectedResult(result);
  }

  const ladder = config?.ladder ?? [];

  if (configError) {
    return (
      <section className="doodle-card rounded-3xl bg-card p-8">
        <CascadeErrorState onRetry={() => loadInitialData()} />
      </section>
    );
  }

  return (
    <section className="grid gap-4 rounded-3xl bg-secondary/15 p-4 md:gap-6 md:p-6">
      <CascadeHeader
        enabled={config?.enabled ?? false}
        maxSteps={config?.maxSteps ?? 3}
        onEnabledChange={handleEnabledChange}
        onMaxStepsChange={handleMaxStepsChange}
        disabled={configLoading || configError}
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-10 md:gap-6 md:items-start">
        <div className="md:col-span-6">
          <Ladder
            ladder={ladder}
            maxSteps={config?.maxSteps ?? 3}
            enabled={config?.enabled ?? false}
            loading={configLoading}
            onSelectRung={handleSelectRung}
          />
        </div>
        <div className="flex flex-col gap-4 md:col-span-4">
          <BenchmarkPanel
            cases={cases}
            results={results}
            running={running}
            onRun={handleRunBenchmark}
            onSelectResult={setSelectedResult}
          />
          <TryItBox ladder={ladder} />
        </div>
      </div>
      <BenchmarkDetailDialog
        result={selectedResult}
        onOpenChange={(open) => {
          if (!open) setSelectedResult(null);
        }}
      />
    </section>
  );
}
