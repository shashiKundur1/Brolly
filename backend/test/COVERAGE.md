# Backend test coverage map

All suites run with `NODE_ENV=test MOCK=1` via `npm test` (`node --test`). 78 `node:test`
tests (leaves + suite nodes) across 6 files, 0 failures, 0 skipped as of this writing.

| File | Kind | Tests |
|---|---|---|
| `test/smoke.test.js` (existing) | black-box | 4 |
| `test/cascade.test.js` (existing) | black-box + white-box | 8 |
| `test/failover.test.js` (existing) | black-box | 5 |
| `test/units.test.js` (new) | white-box | 22 |
| `test/contract.test.js` (new) | black-box | 17 |
| `test/integration.test.js` (new) | end-to-end | 4 |

## Module → covered → not covered

### `src/config.js`
- **Covered (indirectly):** `MOCK` truthiness drives every test file (`MOCK=1` forces mock mode);
  exercised implicitly by every suite that boots `src/server.js` or calls mock-mode code paths.
- **Not covered:** `MESH_API_KEY`/`MESH_BASE_URL`/`PORT`/`MONGO_URL` resolution from real env vars,
  and the `MOCK` auto-derivation (`!MESH_API_KEY`) when `MOCK` is unset — would require spawning a
  child process with a clean env, which is out of scope for these suites.

### `src/mesh.js` (meshChat / meshChatStream / meshModels)
- **Covered:** not directly. All suites run with `MOCK=1`, so `src/pipeline.js` and `src/cascade.js`
  never call into `mesh.js`.
- **Not covered:** every function in this file. Live-mode HTTP calls to the real Mesh API need a
  real `MESH_API_KEY` and network access, which this test track deliberately does not provision
  (no new deps, no mocking framework, no real secrets in CI). A future track could add a fetch-stub
  (Node's built-in `fetch` can be monkey-patched with `node:test`'s `mock.method`) to exercise
  request shape, `Authorization` header, and error/non-OK status handling without a live key.

### `src/usage.js` (appendEvent / readEvents / summarize)
- **Covered (white-box, `units.test.js`):** `summarize` with empty events, single-model single-day
  rollup with exact cost math against `priceFor`, multi-model/multi-day rollup and bucket sort
  order, the `burnRate` 10-minute window boundary (exactly-10-min-ago included, 10-min-and-1s-ago
  excluded), and `projectedTokensPerHour = burnRate * 60`.
- **Covered (black-box, `contract.test.js` + `integration.test.js`):** `GET /api/usage/summary`
  envelope shape; `GET /api/usage/events` newest-first ordering and `limit` cap; event count growth
  after live chat calls via direct `readEvents()` import (bypasses the route's 500-item cap).
- **Not covered:** the Mongo mirror path in `appendEvent`/`getMongoCollection` — only exercised when
  `config.MONGO_URL` is set; these suites never set it, matching how the existing suites already
  behave, and per task scope no new deps (e.g. a Mongo test double) were introduced. `readEvents()`'s
  malformed-JSON-line tolerance (`try/catch` per line, filtering nulls) is not directly unit-tested,
  though it's exercised passively any time the shared log has been touched by out-of-scope processes.

### `src/models.js` (CATALOG / priceFor / modelInfo)
- **Covered (white-box, `units.test.js`):** `priceFor` for a known id, an unknown id (falls back to
  the `{prompt: 1, completion: 3}` default), and confirms provider-prefixed ids must match exactly
  (a bare id like `"gpt-4o-mini"` without its `openai/` prefix also falls back to the default).
  `modelInfo` for a known id (full catalog entry) and an unknown id (`null`).
- **Not covered:** nothing meaningful left in this small, pure module; `CATALOG` itself is exercised
  as a fixture throughout every other suite.

### `src/mock.js` (mockChat / mockStream / seedHistory)
- **Covered (white-box, `units.test.js`):** `mockChat` token estimation from prompt length
  (`ceil(len/4)`, minimum 1), model echo (including the `"default"` fallback when `model` is
  omitted), and the full choices/usage OpenAI-style response shape. `mockStream` yields SSE
  `data: ` chunks, each chunk (except the terminal marker) is parseable JSON with the expected
  `chat.completion.chunk` envelope, the final content chunk carries `finish_reason: "stop"` with an
  empty `delta`, and the stream terminates with a literal `data: [DONE]\n\n` line.
- **Covered (black-box, existing `smoke.test.js` + new suites):** `mockChat` output flowing through
  `POST /v1/chat/completions` end-to-end.
- **Not covered:** `seedHistory()` is only exercised implicitly (`server.js` calls it once at import
  time in mock mode, guarded by `existsSync(USAGE_FILE)`); since the shared `data/usage.jsonl` file
  already exists in this checkout, `seedHistory()`'s actual seeding branch does not re-run under
  these suites. Testing the empty-file seeding branch would require deleting the shared log, which
  these suites intentionally avoid touching destructively (see below).

### `src/cascade.js` (pickCandidates / benchmark / router)
- **Covered (white-box, `units.test.js`):** `pickCandidates` disabled-by-default (returns the
  requested model, or the default id when none given); enabled cheapest-first ordering; slicing to
  `maxSteps`; filtering to benchmark-passing models only, driven by mounting the real `cascadeRouter`
  standalone against an isolated `CASCADE_DATA_FILE`.
- **Covered (black-box, existing `cascade.test.js` + new `contract.test.js`/`integration.test.js`):**
  `GET`/`POST /api/cascade/config` shape and persistence, `GET /api/cascade/benchmark` and
  `POST /api/cascade/benchmark/run` result shape and mock-mode determinism, and the full
  enable → benchmark → chat-with-no-model-routes-cheapest-passing flow with `reason: "cascade"` on
  every attempt.
- **Not covered:** the `liveCase`/non-mock branch of `runBenchmark` (calls `meshChat`, same
  live-Mesh-API gap as `src/mesh.js` above), and `load()`'s malformed-JSON-on-disk recovery branch
  (falls through to defaults on parse failure) — not directly exercised, though every suite using
  `CASCADE_DATA_FILE` implicitly exercises the fresh-file/no-file path via `mkdtempSync`.

### `src/failover.js` (noteTurn / pickFallback / isKilled / router)
- **Covered (white-box, `units.test.js`):** `pickFallback` same-family preference (cheapest within
  family), tier fallback when no same-family candidate exists, overall-cheapest fallback when
  neither family nor tier has a candidate (verified with real kill-state via a standalone-mounted
  `failoverRouter`), exclusion of killed models and the dead model itself, and `null` when no
  candidates remain (all 8 other catalog models killed).
- **Covered (black-box, existing `failover.test.js` + new `contract.test.js`/`integration.test.js`):**
  full `GET/POST` router contract (`/kill` 400-on-missing-model, `/revive` single-model and
  clear-all, `/killed`, `/sessions`, `/sessions/:id` 404), and the kill → chat 503-then-fallback →
  session profile/`models_used` update → revive → callable-again lifecycle end-to-end.
- **Not covered:** `distillProfile`'s live-mode branch (calls `meshChat` to have a cheap model
  summarize the conversation) — only the mock-mode `buildTemplateProfile` branch runs, same
  live-Mesh-API gap noted above. `isKilled` is covered only indirectly through `pipeline.js`'s use
  of it (a killed model attempt returns 503) rather than as a direct unit call, since it is a
  single-line Set lookup.

### `src/pipeline.js` (completeChat orchestration)
- **Covered (black-box only, across all three new files plus existing suites):** the full
  candidate-loop — success on first candidate, 503-from-killed-model triggering a same-loop
  failover push, non-retryable status short-circuiting, `brolly.{model_used,attempts}` shape on
  every response path, and `session_id`-gated `noteTurn`/`pickFallback` invocation.
- **Not covered:** `completeChat` is never imported and unit-tested directly with a hand-built
  `callModel` double — every exercise of it goes through the real HTTP surface
  (`POST /v1/chat/completions`), which is an intentional black-box choice: the module has no seams
  exposed for stubbing `callModel` without either modifying `src/` (out of scope for this track) or
  adding a mocking dependency (disallowed — no new deps). The retryable-status-exhausted-without-
  session_id branch (`all candidates failed`, no fallback attempted) is reachable only by killing
  every model in mock mode, which is implicitly covered by the units.test.js
  "returns null when there are no candidates left" scenario's kill-everything setup, but not
  asserted against `/v1/chat/completions` directly in these suites.

### `src/server.js` (routes)
- **Covered (black-box, `contract.test.js`):** exact status code + body shape for every route:
  `GET /api/health`, `GET /v1/models`, `POST /v1/chat/completions` (success + 400 invalid body),
  `GET /api/usage/summary`, `GET /api/usage/events` (newest-first, `limit` respected),
  `GET`/`POST /api/cascade/config`, `GET /api/cascade/benchmark`, `POST /api/cascade/benchmark/run`,
  `GET /api/failover/sessions`, `GET /api/failover/sessions/:id` (200 + 404), `POST
  /api/failover/kill` (200 + 400), `POST /api/failover/revive`, `GET /api/failover/killed`.
- **Not covered:** the streaming branch of `POST /v1/chat/completions` (`stream: true`) in either
  mock or live mode — `mockStream` itself is unit-tested directly in `units.test.js`, but the route's
  SSE `res.write`/token-accounting glue is not exercised over real HTTP by these suites. The
  `entity.too.large` / `entity.parse.failed` / generic 500 error-handling middleware (lines 163-172)
  is likewise not exercised — reaching it needs an oversized or malformed-JSON request body, which
  none of these suites send (in scope for a future hardening-focused suite, not this coverage pass).
  `isValidChatBody`'s newer stricter validation (message-count cap, per-message role/content typing,
  total-content-length cap, `model` string-length cap) is exercised only for the happy path and the
  original "missing messages" 400 case; the newer specific rejection reasons are not each individually
  asserted here.

## Known data-hygiene note (not a src bug fix, just context)

`data/usage.jsonl` is a shared, gitignored append-only log written by every test file in this
checkout (existing and new) plus any prior manual/dev runs. During this work, two malformed
historical lines were found with non-string `model` fields (`42` and `{"x":1}`), predating the
`isValidChatBody` hardening now in `src/server.js` (which would reject such requests with a 400
today). `test/contract.test.js`'s usage-summary/events assertions were written to be robust to this
kind of latent pollution (assert against a known-good bucket created by the suite itself, rather
than iterating blindly over the entire historical log) rather than asserting a src fix — see the
final task report for the full "model type not persisted-validated historically" note.
