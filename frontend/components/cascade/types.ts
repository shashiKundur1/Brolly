export type BenchmarkSummary = {
  passed: boolean;
  score: number;
  total: number;
} | null;

export type LadderModel = {
  model: string;
  prompt_usd_per_1m: number;
  completion_usd_per_1m: number;
  tier: string;
  benchmark: BenchmarkSummary;
};

export type CascadeConfig = {
  enabled: boolean;
  maxSteps: number;
  ladder: LadderModel[];
};

export type BenchmarkCase = {
  prompt: string;
  expect: string;
};

export type BenchmarkCaseResult = {
  prompt: string;
  expect: string;
  got: string;
  pass: boolean;
};

export type BenchmarkModelResult = {
  model: string;
  score: number;
  total: number;
  passed: boolean;
  cases: BenchmarkCaseResult[];
};

export type BenchmarkRunResponse = {
  results: BenchmarkModelResult[];
};

export type BenchmarkGetResponse = {
  cases: BenchmarkCase[];
  results: BenchmarkModelResult[] | null;
};

export type ChatAttempt = {
  model: string;
  status: number;
  ok: boolean;
  reason?: string;
};

export type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

export type ChatCompletionResponse = {
  id?: string;
  model?: string;
  choices?: { message?: { role: string; content: string } }[];
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
  brolly?: {
    model_used: string;
    attempts: ChatAttempt[];
  };
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const RETRY_BACKOFF_MS = [300, 800];

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

function wait(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }
    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    function onAbort() {
      clearTimeout(timer);
      reject(new DOMException("Aborted", "AbortError"));
    }
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

async function fetchJsonWithRetry<T>(
  url: string,
  label: string,
  signal?: AbortSignal
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= RETRY_BACKOFF_MS.length; attempt += 1) {
    try {
      const res = await fetch(url, { signal });
      if (!res.ok) {
        throw new Error(`${label} failed: ${res.status}`);
      }
      return res.json();
    } catch (error) {
      if (isAbortError(error)) throw error;
      lastError = error;
      if (attempt < RETRY_BACKOFF_MS.length) {
        await wait(RETRY_BACKOFF_MS[attempt], signal);
      }
    }
  }
  throw lastError;
}

export async function fetchCascadeConfig(
  signal?: AbortSignal
): Promise<CascadeConfig> {
  return fetchJsonWithRetry<CascadeConfig>(
    `${API_BASE}/api/cascade/config`,
    "config request",
    signal
  );
}

export async function updateCascadeConfig(
  patch: Partial<Pick<CascadeConfig, "enabled" | "maxSteps">>
): Promise<CascadeConfig> {
  const res = await fetch(`${API_BASE}/api/cascade/config`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!res.ok) {
    throw new Error(`config update failed: ${res.status}`);
  }
  return res.json();
}

export async function fetchBenchmark(
  signal?: AbortSignal
): Promise<BenchmarkGetResponse> {
  return fetchJsonWithRetry<BenchmarkGetResponse>(
    `${API_BASE}/api/cascade/benchmark`,
    "benchmark request",
    signal
  );
}

export async function runBenchmark(): Promise<BenchmarkRunResponse> {
  const res = await fetch(`${API_BASE}/api/cascade/benchmark/run`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  if (!res.ok) {
    throw new Error(`benchmark run failed: ${res.status}`);
  }
  return res.json();
}

export async function sendChat(
  content: string,
  signal?: AbortSignal
): Promise<ChatCompletionResponse> {
  const res = await fetch(`${API_BASE}/v1/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: [{ role: "user", content }] }),
    signal,
  });
  if (!res.ok) {
    throw new Error(`chat request failed: ${res.status}`);
  }
  return res.json();
}

export function formatUsd(value: number): string {
  if (value === 0) return "$0";
  if (value < 0.01) return `$${value.toFixed(4)}`;
  return `$${value.toFixed(2)}`;
}
