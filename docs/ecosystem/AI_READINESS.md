# Section 3 — Python AI Services Readiness

AI is a separate service layer behind the ASP.NET gateway. Clients never call Python
directly; they call `/api/v1/ai/*` (see `src/core/contracts/endpoints.ts` → `API_ENDPOINTS.ai`)
and receive the standard envelope. Every AI response must degrade gracefully: if the AI
service is unavailable, the gateway returns the deterministic fallback and sets
`meta.aiFallback = true` — the frontend already renders plain search results in that case.

---

## 1. Smart Search

- **Input:** raw Arabic/English query text, detected locale, optional governorate/city,
  active sector, recent user queries.
- **Processing:** intent + entity extraction (category, specialty, product, location),
  Arabic normalisation (ال prefix, hamza/ya variants, dialect synonyms).
- **Output:** `{ normalizedQuery, categorySlugs[], sectorSlug?, location?, confidence }`.
- **Endpoint:** `POST /ai/search`
- **Frontend usage:** `SearchBarWidget` suggestions and `/services` query pre-fill —
  result is applied to the existing Zod search schema, no new UI state.
- **Fallback:** literal text match against category names.

## 2. Provider Matching

- **Input:** service/category, location (governorate/city/area), budget range, urgency,
  requested time window, provider availability, rating, verification, response time.
- **Output:** ranked provider ids with `{ providerId, score, reasons[] }`.
- **Endpoint:** `POST /ai/match`
- **Frontend usage:** ordering of `/services` results and the "أفضل مطابقة" sort option;
  also picks the shortlist of providers a new service request is distributed to.
- **Fallback:** current deterministic sort (rating → response time → distance).

## 3. Recommendation Engine

- **Input:** user history (viewed providers, past requests, categories), location,
  season/time-of-day, co-visitation graph.
- **Output:** ordered provider/category recommendations with a reason code.
- **Endpoint:** `GET /ai/recommendations`
- **Frontend usage:** home page "مقترح لك" rail, related providers on the details page,
  empty-state suggestions in My Requests.
- **Fallback:** featured + top-rated providers in the user's governorate.

## 4. Provider Ranking

- **Input:** rating aggregate, review sentiment, completion rate, response latency,
  cancellation rate, subscription tier, recency of activity, dispute count.
- **Output:** normalised `rankScore` (0–100) plus component breakdown per provider.
- **Endpoint:** `POST /ai/ranking` (batch) — recomputed nightly, cached in Redis.
- **Frontend usage:** default relevance ordering; admin quality column in
  `AdminProvidersPage`.
- **Fairness rule:** paid tier may boost, never fabricate — score components must be
  auditable and exposed to admins.

## 5. Review Sentiment Analysis

- **Input:** review text (Arabic dialects + English), rating, category context.
- **Output:** `{ sentiment: positive|neutral|negative, aspects[], toxicity, spamScore }`.
- **Endpoint:** `POST /ai/reviews/analyze`
- **Frontend usage:** review moderation queue prioritisation in admin, aspect chips
  ("سعر مناسب", "التزام بالموعد") on the provider reviews tab.
- **Fallback:** manual moderation queue ordered by report count.

## 6. Customer Assistant

- **Input:** conversation turns, current route context, user location, catalogue snapshot.
- **Output:** streamed assistant message + optional structured action
  (`open_search`, `start_request`, `call_provider`).
- **Endpoint:** `POST /ai/assistant` (SSE stream)
- **Frontend usage:** future help widget; structured actions map onto existing routes so
  no business logic moves into the client.
- **Safety:** assistant may propose actions, never execute writes on the user's behalf.

## 7. Demand Prediction

- **Input:** historical requests by category × governorate × time, seasonality, campaign
  spend, supply density.
- **Output:** forecast series with confidence bands and supply-gap flags.
- **Endpoint:** `GET /ai/forecast` (admin scope)
- **Frontend usage:** `AdminAnalyticsPage` demand heatmap and "نقص في العرض" alerts;
  provider-side hints about high-demand categories.

---

## Integration invariants

| Rule | Detail |
|---|---|
| Envelope | AI endpoints return `ApiResponse<T>` like every other endpoint |
| Latency budget | 300 ms p95 for search/match; the gateway times out at 800 ms and falls back |
| Caching | ranking + recommendations cached in Redis; search intent cached per normalised query |
| Explainability | every ranked item carries `reasons[]` so the UI can show why |
| Privacy | no raw phone numbers or free-text customer contact data leaves the gateway |
| Language | models must handle Arabic (MSA + Egyptian dialect) and English |
| Contract home | `src/core/contracts/ai.contract.ts` |
