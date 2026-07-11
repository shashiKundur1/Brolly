# Mesh API (meshapi.ai) Research

Research for hack.meshapi.ai, whose hard rule is: **every AI call in the project must visibly route through the Mesh API**, or the submission is disqualified. This doc captures the verified API shape needed to integrate.

## Base URL & auth

- **Base URL:** `https://api.meshapi.ai/v1`
  - Confirmed two ways: the quickstart guide's curl example targets `https://api.meshapi.ai/v1/chat/completions`, and the OpenAPI spec declares `servers: [{"url": "https://api.meshapi.ai"}]` with endpoint paths written as `/v1/chat/completions`, `/v1/models`, etc. Combined, the effective base is `https://api.meshapi.ai/v1`.
- **Auth header:**
  ```
  Authorization: Bearer rsk_<RANDOM_CHARACTERS>
  ```
  - Keys are called **RSK** ("Router Service Key"), prefixed `rsk_`.
  - The OpenAPI security scheme is `HTTPBearer` (`type: http`, `scheme: bearer`).
  - Keys are created/managed in the Mesh dashboard's **API Keys** section; each key can carry its own rate limits (RPM/RPD/TPM) and an optional USD spend cap.
  - No other required headers were documented beyond standard `Content-Type: application/json` for JSON bodies.
- **Prerequisite:** the docs note you must add a small balance (starting ~₹100 or $5) in the dashboard's Billing section before paid inference will work. Free-tier models (`is_free: true`) don't require this.

Source: `docs/guides/authentication.md`, `docs/guides/quickstart.md`, `openapi.json`.

## Chat completions

**POST** `https://api.meshapi.ai/v1/chat/completions`

OpenAI-compatible shape. Verified request parameters (from the API reference page):

| Parameter | Type | Notes |
|---|---|---|
| `model` | string | e.g. `"openai/gpt-4o"` (default shown in docs) |
| `messages` | array of message objects | required |
| `stream` | boolean | default `false`; `true` returns SSE chunks |
| `temperature` | number | optional |
| `max_tokens` | integer | optional |
| `top_p` | number | optional |
| `frequency_penalty` | number | optional |
| `presence_penalty` | number | optional |
| `stop` | string or array | optional |
| `seed` | integer | optional |
| `tools` | array of Tool objects | optional |
| `tool_choice` | string or object | optional |
| `response_format` | object | optional (structured output) |
| `modalities` | array | optional; items `"text"`, `"audio"`, `"image"` |
| `audio` | AudioOutputOptions object | optional |
| `user` | string | optional (seen in example body) |

### Example request (verbatim from docs)

```json
{
  "messages": [
    {
      "role": "user",
      "content": "Can you provide a brief summary of the latest advancements in renewable energy?"
    }
  ],
  "model": "openai/gpt-4o",
  "stream": false,
  "temperature": 0.7,
  "max_tokens": 150,
  "top_p": 0.9,
  "frequency_penalty": 0,
  "presence_penalty": 0,
  "user": "user_12345"
}
```

Quickstart curl form:

```bash
curl https://api.meshapi.ai/v1/chat/completions \
  -H "Authorization: Bearer <YOUR_RSK_KEY>" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-4o",
    "messages": [
      {"role": "user", "content": "Explain quantum computing in one sentence."}
    ]
  }'
```

### Example response (verbatim from docs)

```json
{
  "id": "chatcmpl-DxC3eeQ6uBWSljHJ0MzxY3ZcGykl0",
  "object": "chat.completion",
  "created": 1712345678,
  "model": "gpt-4o-2024-08-06",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Recent advancements in renewable energy include improvements in solar panel efficiency..."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 18,
    "completion_tokens": 54,
    "total_tokens": 72
  }
}
```

Note the response `model` field can return the upstream provider's own version string (`gpt-4o-2024-08-06`) even though the request `model` used the Mesh alias (`openai/gpt-4o`).

Source: `api-reference/mesh-api/chat/completions.md`, `docs/guides/quickstart.md`.

## Streaming (SSE)

Verified facts only:
- Set `"stream": true` on the chat completions request to receive **SSE chunks** instead of a single JSON object (this is stated explicitly: "Completion (JSON), or an SSE stream when `stream=true`").
- The troubleshooting page confirms mid-stream provider errors "arrive as SSE frames before `[DONE]`" — implying a terminal `[DONE]` sentinel frame exists, consistent with OpenAI-style streaming.
- **Not verified:** the exact per-chunk JSON structure (e.g. `object: "chat.completion.chunk"`, `choices[].delta.content` field names) was not shown on any fetched page — the docs describe streaming behavior but no page rendered a literal `data: {...}` example.

See the UNVERIFIED section below for the assumed chunk shape.

Source: `api-reference/mesh-api/chat/completions.md`, `debug/mesh-api.md`.

## Models

**GET** `https://api.meshapi.ai/v1/models`

- Auth: Bearer token (dashboard JWT or RSK API key) via `Authorization` header.
- Query parameters (verified as documented, exact semantics of `free` not fully spelled out):
  - `free` — filter free vs. paid models
  - `type` — filter by `model_type` (`text`, `embedding`, `image`, `audio`, `video`)
  - `provider` — filter by provider slug (examples given: `amazon-bedrock`, `vertex`, `openai`)
- Response: JSON array of model objects. Only models with `is_enabled=true` in the backing `models` table are returned. Response is cached ~5 minutes server-side (admin writes invalidate immediately).
- Model object includes (field names as documented, not a full literal JSON example): `id`, `name`, `context_length`, `is_free`, `pricing`, `supports_*` capability flags, `model_type`, input/output modalities, optional `composite_models` array.
- HTTP status codes: `200` success, `422` validation error.
- Related listing endpoints also exist per the docs index: `GET /v1/models/free`-equivalent (list-free-models), list-paid-models, search-models, and `get-model` (single model by id) — paths not individually confirmed beyond their llms.txt slugs (`api-reference/mesh-api/models/list-free-models`, `list-paid-models`, `search-models`, `get-model`).

### Model naming convention

Format: **`<provider>/<model_name>`**

Verified example IDs from the docs:
- `openai/gpt-4o-mini`
- `openai/gpt-4o` (used as the default model in the chat completions example)
- `anthropic/claude-haiku-4.5`

(`llama-3` and bare `gpt-4o` were mentioned in prose as generic size/tier examples, not as literal API model-id strings — treat the `<provider>/<model_name>` pattern as the confirmed convention.)

Source: `api-reference/mesh-api/models/list-models.md`, `docs/introduction/model-explanation.md`.

## Usage / pricing / limits endpoints

- **No public API endpoint exists for querying usage, balance, credits, or spend.** This was explicitly checked against the full `openapi.json` paths list — the spec covers chat/completions, responses, images, video, audio, embeddings, moderations, batch, RAG/files, models, templates, and web search, but **no** account/usage/billing endpoint.
- Usage, balance, and spend data are only exposed via the **dashboard UI**:
  - "Current Balance" — real-time pre-paid credit balance
  - "Logs" section — historical record of every request, with per-request token breakdown (prompt/completion), latency, and a `req_...` request ID
  - "Spend History" — cost breakdown per provider and per model
- **Pricing model:** token-based, per 1,000 tokens, two components documented by exact field name:
  - `prompt_usd_per_1k` — cost per 1k prompt/context tokens
  - `completion_usd_per_1k` — cost per 1k completion tokens
  - Free models (`is_free: true`) cost $0 for both.
- **Insufficient balance behavior:** paid requests return **HTTP 402** with error code `spend_limit_exceeded` when funds are depleted or a spend cap is hit.

Source: `docs/introduction/pricing.md`, `docs/guides/dashboard-guide.md`, `openapi.json` (full path enumeration).

## Rate limits

- Enforced **per API key**, three configurable types (set in the dashboard's API Keys section):
  - **RPM** — requests per minute
  - **RPD** — requests per day
  - **TPM** — tokens per minute
- Enforcement mechanism: "RPM and RPD enforced per key via Redis fixed-window counters" (per the authentication guide).
- Each key can also carry an optional maximum USD spend cap.
- On limit breach, the documented error response (HTTP 429):
  ```json
  {
    "error": {
      "code": "rate_limit_exceeded",
      "message": "Requests-per-minute limit exceeded",
      "request_id": "req_a1b2c3d4"
    }
  }
  ```
- **Not verified:** no numeric default limits (e.g. "60 RPM on free tier") were shown on any fetched page, and no rate-limit-related response *headers* (e.g. `X-RateLimit-Remaining`) were documented.
- Other documented error codes/status pairs (from the troubleshooting/error-reference page): `401` unauthorized, `402 spend_limit_exceeded`, `403` forbidden, `404 model_not_found`/`not_found`, `422 validation_error`, `429 rate_limit_exceeded`, `500 upstream_error`, `503 provider_not_available`, `504 gateway_timeout`.

Source: `docs/guides/authentication.md`, `docs/guides/dashboard-guide.md`, `debug/mesh-api.md`.

## Hackathon integration note (hack.meshapi.ai)

- Hard rule: every AI call in the project must **visibly** route through the Mesh API, or the submission is disqualified.
- Submission verification requires: a public GitHub repo (or private with read access granted to `contact@meshapi.ai`), an honest incremental commit history, a 2-3 minute demo video (screen + webcam), and a Mesh account registered with the same email used for submission.
- The hackathon page itself contains no additional technical detail beyond directing participants to the quickstart, model-routing guide, and RAG guide at developers.meshapi.ai (all covered above).

Source: `https://hack.meshapi.ai`.

---

## UNVERIFIED — assumed OpenAI-compatible

Everything below was **not** confirmed on a live Mesh API page during this research pass. It is included only because Mesh documents itself as an "OpenAI-compatible endpoint," so these are reasonable assumptions if the real behavior is needed before it can be verified against a live key/response.

- **SSE streaming chunk shape** — assumed identical to OpenAI's `chat.completion.chunk` format:
  ```
  data: {"id":"chatcmpl-...","object":"chat.completion.chunk","created":1712345678,"model":"openai/gpt-4o","choices":[{"index":0,"delta":{"content":"Hello"},"finish_reason":null}]}

  data: {"id":"chatcmpl-...","object":"chat.completion.chunk","created":1712345678,"model":"openai/gpt-4o","choices":[{"index":0,"delta":{},"finish_reason":"stop"}]}

  data: [DONE]
  ```
  This was not shown verbatim anywhere in the fetched docs — only the general statement that `stream=true` yields "SSE chunks" and that `[DONE]` terminates the stream.
- **Rate limit response headers** (e.g. `X-RateLimit-Limit-Requests`, `X-RateLimit-Remaining-Requests`, `Retry-After`) — not documented on any fetched page; assumed to exist in some form given RPM/RPD/TPM enforcement is real, but exact header names are unverified.
- **Default numeric rate limits** for a new/free-tier key (e.g. "X requests/minute") — not published anywhere found.
- **Exact JSON shape of a `models/list-models` array element** — field *names* are documented (`id`, `name`, `context_length`, `is_free`, `pricing`, `supports_*`, `model_type`, `composite_models`, etc.) but no literal full example object was rendered by any fetched page, so nested structure (e.g. whether `pricing` is a flat object with `prompt_usd_per_1k`/`completion_usd_per_1k` keys) is inferred, not confirmed line-by-line.
- **`GET /v1/models/free`, `/models/paid`, `/models/search`, `/models/{id}` exact paths** — inferred from the llms.txt page-slug names (`list-free-models`, `list-paid-models`, `search-models`, `get-model`); actual path strings were not individually pulled from `openapi.json`.

---

## Sources (URLs + fetched date)

All fetched 2026-07-11.

- https://meshapi.ai/llms.txt
- https://docs.meshapi.ai/llms.txt
- https://developers.meshapi.ai/ (product overview)
- https://developers.meshapi.ai/llms.txt (full doc index)
- https://developers.meshapi.ai/docs/guides/authentication.md
- https://developers.meshapi.ai/docs/guides/quickstart.md
- https://developers.meshapi.ai/docs/guides/dashboard-guide.md
- https://developers.meshapi.ai/docs/introduction/pricing.md
- https://developers.meshapi.ai/docs/introduction/model-explanation.md
- https://developers.meshapi.ai/api-reference.md
- https://developers.meshapi.ai/api-reference/mesh-api/chat/completions.md
- https://developers.meshapi.ai/api-reference/mesh-api/models/list-models.md
- https://developers.meshapi.ai/debug/mesh-api.md
- https://developers.meshapi.ai/openapi.json
- https://hack.meshapi.ai
