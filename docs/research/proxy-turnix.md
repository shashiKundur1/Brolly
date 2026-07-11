# proxy.turnix.co API Reference

## Overview

proxy.turnix.co is the user's self-hosted proxy service that exposes a Verifox Proxy Dashboard API. The service aggregates free proxies scraped from GitHub, categorized by type (HTTP, HTTPS, SOCKS4, SOCKS5) and updated hourly. The API is JSON-based and provides endpoints for querying proxy data and service statistics.

**Base URL:** `https://proxy.turnix.co`  
**Docs/Dashboard:** `https://proxy.turnix.co/` (Next.js frontend)

---

## Routes & Capabilities

| Method | Path | Parameters | Purpose |
|--------|------|------------|---------|
| GET | `/api/proxies` | `type`, `status`, `country`, `source`, `validated`, `page`, `limit` | List proxies with filters; defaults to limit=50, page=1 |
| GET | `/api/stats` | — | Aggregate proxy statistics (counts by type, status, country, port) |

---

## Detailed Endpoint Documentation

### 1. GET `/api/proxies`

**Purpose:** Retrieve a paginated list of proxies with optional filtering.

**Query Parameters:**

| Parameter | Type | Default | Example | Description |
|-----------|------|---------|---------|-------------|
| `type` | string | (all) | `http`, `https`, `socks4`, `socks5` | Proxy protocol type |
| `status` | string | (all) | `active`, `inactive` | Proxy availability status |
| `country` | string | (all) | `US`, `PH`, `CN` | ISO 2-letter country code |
| `source` | string | (all) | `databay-labs`, `TheSpeedX`, `TuanMinPay` | GitHub source repository |
| `validated` | boolean | (all) | `true`, `false` | Whether proxy has been validated as working |
| `page` | integer | 1 | 2, 3, ... | 1-indexed page number for pagination |
| `limit` | integer | 50 | 1-100 | Results per page |

**Response Schema:**

```json
{
  "proxies": [
    {
      "_id": "6a5268c814b65df0a7e2f7c0",
      "ip": "173.254.211.148",
      "port": 10801,
      "type": "socks5",
      "status": "active",
      "country": "US",
      "city": "Los Angeles",
      "source": "databay-labs",
      "validated": false,
      "validatedAt": null,
      "hasAuth": false,
      "user": "",
      "pass": "",
      "httpPorts": [8080],
      "smtpPorts": [],
      "openPorts": [8080],
      "firstSeen": "2026-07-11T16:00:11.150Z",
      "scrapedAt": "2026-07-11T16:00:11.150Z",
      "lastCommit": "2026-07-11T15:55:08.000Z",
      "portScannedAt": "2026-07-11T16:02:45.736Z",
      "authRequired": false  // Only when validated=true
    }
  ],
  "total": 189234,
  "page": 1,
  "limit": 50,
  "pages": 3785
}
```

**Example Calls:**

```bash
# Get first 50 proxies (all types)
curl -s "https://proxy.turnix.co/api/proxies"

# Get active HTTP proxies in the US
curl -s "https://proxy.turnix.co/api/proxies?type=http&status=active&country=US&limit=10"

# Get validated SOCKS5 proxies from a specific source
curl -s "https://proxy.turnix.co/api/proxies?type=socks5&validated=true&source=databay-labs&limit=5"

# Paginate through results
curl -s "https://proxy.turnix.co/api/proxies?page=2&limit=100"

# Get inactive HTTPS proxies
curl -s "https://proxy.turnix.co/api/proxies?type=https&status=inactive"
```

---

### 2. GET `/api/stats`

**Purpose:** Retrieve aggregate statistics about all proxies in the database.

**Query Parameters:** None

**Response Schema:**

```json
{
  "total": 189234,
  "byType": {
    "socks5": 35480,
    "http": 129683,
    "socks4": 13870,
    "https": 10201
  },
  "byStatus": {
    "inactive": 157634,
    "active": 31600
  },
  "activeByType": {
    "socks4": 2119,
    "https": 1922,
    "socks5": 628,
    "http": 26931
  },
  "ports": {
    "smtp": {
      "25": 186,
      "587": 163,
      "any": 234
    },
    "http": {
      "80": 2577,
      "443": 2481,
      "any": 3825
    }
  },
  "byCountry": [
    { "code": "US", "count": 52208 },
    { "code": "ID", "count": 10519 },
    { "code": "CN", "count": 8910 },
    // ... more countries
  ],
  "bySource": [
    { "name": "ErcinDedeoglu", "count": 57308 },
    { "name": "MuRongPIG", "count": 51287 },
    // ... more sources
  ]
}
```

**Example Call:**

```bash
curl -s "https://proxy.turnix.co/api/stats" | jq .
```

**Note:** This endpoint provides summary data only; no aggregation parameters are supported.

---

## Known Limitations & Unreachable Endpoints

| Endpoint | Status | Notes |
|----------|--------|-------|
| `/api/health` | 404 | Not implemented |
| `/api/sources` | 404 | Not implemented |
| `/api/countries` | 404 | Not implemented |
| `/api/proxies/{id}` | 404 | Single proxy lookup by ID not available |
| `/api/proxies/search` | 404 | Dedicated search endpoint not available (use query params on `/api/proxies` instead) |
| `/docs`, `/openapi.json`, `/help`, `/routes` | 404 | OpenAPI/Swagger docs not exposed |

---

## Filter Value Reference

### Proxy Types
- `http` — HTTP protocol (129,683 total)
- `https` — HTTPS protocol (10,201 total)
- `socks4` — SOCKS4 protocol (13,870 total)
- `socks5` — SOCKS5 protocol (35,480 total)

### Proxy Status
- `active` — Verified working (31,600 total)
- `inactive` — Not responding or failed validation (157,634 total)

### Common Country Codes (Top 10 by count)
- `US` — United States (52,208)
- `ID` — Indonesia (10,519)
- `CN` — China (8,910)
- `VN` — Vietnam (7,791)
- `RU` — Russia (6,960)
- `GB` — United Kingdom (6,689)
- `NL` — Netherlands (5,462)
- `DE` — Germany (4,690)
- `BR` — Brazil (4,076)
- `IN` — India (3,747)

### Sample Sources
- `databay-labs`
- `TheSpeedX`
- `TuanMinPay`
- `ErcinDedeoglu`
- `MuRongPIG`
- `Anonym0usWork1221`
- `ALIILAPRO`
- `Jakee8718`
- (See `/api/stats` for complete list)

---

## Integration Notes

### Use in Hackathon Project

To route outbound HTTP through proxy.turnix.co proxies:

1. **Fetch active proxies** with desired filters:
   ```bash
   curl -s "https://proxy.turnix.co/api/proxies?status=active&type=http&country=US&limit=5"
   ```

2. **Select a proxy** from response (e.g., first result)

3. **Configure HTTP client** to use the proxy:
   ```bash
   # For curl
   curl -x "http://IP:PORT" "https://target.com"
   
   # For Node.js (using axios or similar)
   const proxy = `http://${result.ip}:${result.port}`;
   // Pass proxy URL to HTTP client
   
   # For Python (requests)
   proxies = {"http": f"http://{ip}:{port}"}
   requests.get("https://target.com", proxies=proxies)
   ```

4. **Fallback strategy:** If active proxy becomes unavailable, fetch another from `/api/proxies?status=active`

5. **Respect SMTP capabilities:** Check `smtpPorts` array if routing SMTP through proxy

### Rate Limiting & Reliability

- **No documented rate limits** found in API responses
- **Proxy uptime varies:** Only ~31,600 of 189,234 proxies are actively working
- **Validation lag:** `validated` flag may be stale; test proxy connectivity before heavy use
- **Port availability:** Check `openPorts` and protocol-specific arrays (`httpPorts`, `smtpPorts`)

---

## Data Discovery Timestamp

- **Survey Date:** 2026-07-11 16:55 UTC
- **Total Proxies:** 189,234
- **Active Proxies:** 31,600
- **Last API Stats Update:** 2026-07-11 16:55:08 UTC
