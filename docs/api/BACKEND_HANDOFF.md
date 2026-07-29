# Backend Developer Handoff Notes

**Audience:** ASP.NET Core team (Clean Architecture · PostgreSQL · Redis)
**Read first:** [`API_CONTRACTS.md`](./API_CONTRACTS.md) · machine-readable source: `src/core/contracts/*`

---

## 1. What the frontend already guarantees

- Every list screen already does **server-side** pagination, sorting and filtering. Do not build client-paged endpoints.
- Loading, empty, error and retry states exist for every surface (`QueryBoundary`, `DataTable`, `Skeletons`). Return proper status codes — the UI already handles them.
- All data access goes through repositories. When your endpoint ships, one file changes on our side.
- The UI is bilingual (ar/en) and RTL-first. Any user-visible string you own must be returned in both languages or as a `messageKey`.

## 2. Non-negotiables

1. **Envelope on every response** — `{ success, data, message, errors, traceId }`. Including errors. Including 500s.
2. **Pagination block on every list** — `items, page, pageSize, totalCount, totalPages, hasNextPage, hasPreviousPage`.
3. **Money in minor units** (piastres) as integers, with an explicit `currency`. No decimals on the wire.
4. **UTC ISO-8601** timestamps only. No local time, no epoch numbers.
5. **UUIDs** in payloads. Sequential ids are an enumeration leak.
6. **Stable slugs** for reference data (`cairo`, `home-services`). They appear in URLs and are bookmarked.
7. **Localized fields as `{ ar, en }`** for anything the admin can edit (names, descriptions, banner copy).
8. **Never break v1 in place.** Additive fields are fine; removals and renames go to v2.

## 3. Suggested Clean Architecture slice

```
Ayez.Domain            entities, value objects, domain events (no EF, no HTTP)
Ayez.Application       CQRS handlers, validators, DTOs matching src/core/contracts
Ayez.Infrastructure    EF Core + PostgreSQL, Redis, storage, PSP, AI HTTP clients
Ayez.Api               controllers, envelope middleware, auth, rate limiting, Swagger
```

- One handler per endpoint; validators (FluentValidation) map 1:1 to the `errors[]` array.
- Envelope + exception handling belong in middleware, never in controllers.
- Application DTOs should be generated/kept in sync with `src/core/contracts` — treat mismatches as bugs.

## 4. Data model notes that matter to the UI

| Area | Note |
|---|---|
| Provider ↔ Category | Many-to-many, plus one `primaryCategoryId` used for the card label |
| Coverage | Scope enum + join tables for governorate/city/area; transport providers also use radius |
| ServiceRequest ↔ Lead | 1:N. Requests are customer-owned; leads are provider-owned. Never expose another provider's lead |
| Timeline | Append-only table. Status changes write a row in the same transaction |
| Reviews | `pending` by default; only `completed` requests set `verifiedPurchase` |
| Subscription usage | Lead consumption is transactional with lead acceptance; 422 when quota is exhausted |
| Sponsored slots | Injected into search results but excluded from `totalCount` |
| Media | Assets are separate rows referenced by id; business DTOs carry `assetId` only |

## 5. Performance and caching

| Endpoint group | Cache | TTL |
|---|---|---|
| `/locations/*` | Redis + `Cache-Control: public, max-age=86400` + ETag | 24 h |
| `/marketplace/sectors|categories` | Redis + public cache | 1 h |
| `/search/suggest` | Redis, prefix-keyed | 5 min, p95 ≤ 50 ms |
| `/search` | Redis by normalised query hash | 60 s, p95 ≤ 300 ms |
| `/analytics/*` | Materialised views refreshed on schedule | 5–15 min |
| Authenticated reads | `Cache-Control: private, no-store` | — |

Search should use PostgreSQL full-text with an Arabic configuration plus trigram similarity for typo tolerance; normalise alef/hamza/taa-marbuta and strip diacritics on both index and query.

## 6. Security

- JWT access 15 min, refresh 30 days with rotation and reuse detection.
- Authorize by **permission string**, not by role name — roles are just permission bundles.
- Row-level ownership checks on every request/lead/subscription read. Never trust an id from the client.
- Contact masking is server-side. The client must never receive a real phone it isn't entitled to.
- Rate limit: OTP 5/hour/phone, search 60/min/IP, writes 30/min/user.
- Webhooks (`/billing/webhooks/payment`) are public routes — verify the PSP signature before touching any data.
- PII (phone, address) is encrypted at rest; analytics exports are aggregated only.

## 7. Definition of done per endpoint

- [ ] Matches the TypeScript contract field-for-field (names, nullability, casing)
- [ ] Envelope + pagination block correct
- [ ] `camelCase` JSON (configure `JsonNamingPolicy.CamelCase`)
- [ ] Validation errors return `field` + `code` + `messageKey`
- [ ] Authorization enforced and covered by a test
- [ ] OpenAPI/Swagger annotated and published to the shared spec URL
- [ ] Seeded sample data available on staging (used by web + Flutter QA)

## 8. Open decisions for the backend team

1. PSP selection (Paymob / Fawry / Stripe MENA) — affects `PaymentMethodDto.kind` values.
2. WhatsApp BSP — affects template naming in `NotificationTemplate`.
3. Whether provider ranking runs synchronously inside `/search` or as a nightly precompute (frontend supports either).
4. Soft-delete vs archive semantics for providers and reviews.
