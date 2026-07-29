# AYEZ Marketplace — API Contract Specification (v1)

> Status: **Contract only.** No backend code, no live HTTP calls. The frontend
> keeps running on the mock repository layer until each endpoint below ships.
>
> Machine-readable source of truth: `src/core/contracts/*` (TypeScript, type-only).
> This document is the human-readable mirror. If the two disagree, the TypeScript wins.

**Target backend:** ASP.NET Core Web API · Clean Architecture · PostgreSQL · Redis
**Consumers:** React web (this repo), Flutter Android/iOS, internal admin, Python AI services

---

## 1. Conventions

| Topic | Rule |
|---|---|
| Base URL | `https://api.ayez.eg/api/v1` (`API_V1_BASE`) |
| Versioning | Path-based (`/api/v1`). Breaking changes → `/api/v2`. Never break v1 in place. |
| Auth | `Authorization: Bearer <accessToken>` (JWT, 15 min) + rotating refresh token (30 days) |
| Content type | `application/json; charset=utf-8` |
| Localization | `Accept-Language: ar` (default) or `en`. Localized fields return `{ ar, en }` objects. |
| Timestamps | ISO-8601 UTC (`2026-07-29T10:15:00Z`). Clients convert to `Africa/Cairo`. |
| Money | Integer **minor units** (piastres). `15000` = 150.00 EGP. Currency always explicit. |
| IDs | UUID v4 strings. Never sequential integers in payloads. |
| Idempotency | Every POST that creates a resource accepts `clientRequestId` (or `Idempotency-Key` header). |
| Correlation | Client sends `X-Request-Id`; server echoes it as `traceId`. |
| Rate limits | `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `Retry-After` on 429. |

### 1.1 Standard response envelope

Every endpoint — success or failure — returns:

```json
{
  "success": true,
  "data": { },
  "message": "OK",
  "errors": [],
  "traceId": "0HN7…"
}
```

Failure:

```json
{
  "success": false,
  "data": null,
  "message": "Validation failed",
  "errors": [
    { "code": "common.validation_failed", "field": "phone", "message": "رقم غير صالح", "messageKey": "errors.phone_invalid" }
  ],
  "traceId": "0HN7…"
}
```

`messageKey` lets web and Flutter render their own translated copy instead of trusting server text.

### 1.2 Pagination standard

Every list endpoint returns:

```json
{
  "items": [],
  "page": 1,
  "pageSize": 20,
  "totalCount": 137,
  "totalPages": 7,
  "hasNextPage": true,
  "hasPreviousPage": false
}
```

Query: `?page=1&pageSize=20` — `page` is 1-based, `pageSize` max 100, default 20.

### 1.3 Sorting standard

`?sort=field:direction[,field:direction]` — e.g. `?sort=rating:desc,reviewCount:desc`.
Unknown sort fields are **ignored**, never a 400.

### 1.4 Filtering standard

Simple filters are flat query params (`?verified=true&minRating=4`).
Advanced filters use the operator form on admin/report endpoints:
`?filter=createdAt:between:2026-01-01,2026-06-30&filter=status:in:new,assigned`.
Operators: `eq, neq, gt, gte, lt, lte, in, contains, between`.

### 1.5 Error codes

| HTTP | Code | Meaning |
|---|---|---|
| 400 | `common.validation_failed` | Body/query failed validation |
| 401 | `auth.unauthorized` / `auth.token_expired` | Missing/expired token — client refreshes once, then logs out |
| 403 | `auth.forbidden` | Authenticated but lacks permission |
| 404 | `common.not_found` | Resource missing |
| 409 | `common.conflict` | Duplicate / state conflict |
| 422 | `billing.lead_quota_exceeded`, `provider.not_verified` | Business rule blocked the action |
| 429 | `common.rate_limited` | Throttled |
| 500 | `common.server_error` | Unhandled — always includes `traceId` |

---

## 2. Identity

| Method | Endpoint | Request DTO | Response DTO |
|---|---|---|---|
| POST | `/identity/register` | `RegisterRequest` | `AuthSessionDto` |
| POST | `/identity/login` | `LoginRequest` | `AuthSessionDto` |
| POST | `/identity/otp/request` | `OtpRequest` | `null` |
| POST | `/identity/otp/verify` | `OtpVerify` | `AuthSessionDto` |
| POST | `/identity/refresh` | `RefreshRequest` | `AuthTokens` |
| POST | `/identity/logout` | `RefreshRequest` | `null` |
| GET | `/identity/me` | — | `UserDto` |
| PATCH | `/identity/me` | `UpdateProfileRequest` | `UserDto` |
| PUT | `/identity/me/password` | `ChangePasswordRequest` | `null` |
| GET | `/identity/users` | `UserListQuery` | `Paged<UserDto>` |
| GET | `/identity/users/{id}` | — | `UserDto` |
| PUT | `/identity/users/{id}/roles` | `AssignRoleRequest` | `UserDto` |
| GET | `/identity/roles` | — | `RoleDto[]` |
| GET | `/identity/permissions` | — | `string[]` |

**Roles:** `customer`, `provider`, `provider_staff`, `admin`, `support`.
**Permissions** are strings (`leads.assign`, `providers.approve`, `reviews.moderate`, `billing.read`) embedded in the JWT and returned on `UserDto` so the UI can hide controls — the server still enforces them.

**Auth notes**
- Phone-first (E.164 `+20…`); OTP login is the primary mobile path, password the web path.
- Refresh tokens rotate on every use; reuse of a consumed refresh token revokes the family.
- `UserDto.providerId` is set for provider accounts so the dashboard needs no extra lookup.

---

## 3. Marketplace

| Method | Endpoint | Query / Body | Response |
|---|---|---|---|
| GET | `/marketplace/sectors` | — | `SectorDto[]` |
| GET | `/marketplace/categories` | `?sector=&popular=` | `CategoryDto[]` |
| GET | `/marketplace/categories/{slug}` | — | `CategoryDto` |
| GET | `/marketplace/services` | `?categoryId=` | `Paged<ServiceDto>` |
| GET | `/marketplace/providers` | `ProviderListQuery` | `Paged<ProviderSummaryDto>` |
| GET | `/marketplace/providers/featured` | `?limit=6&governorate=` | `ProviderSummaryDto[]` |
| GET | `/marketplace/providers/{id}` | — | `ProviderDto` |
| GET | `/marketplace/providers/{id}/related` | `?limit=4` | `ProviderSummaryDto[]` |
| GET | `/marketplace/providers/{id}/services` | — | `ServiceDto[]` |
| GET | `/marketplace/providers/{id}/coverage` | — | `CoverageDto` |
| GET | `/marketplace/providers/{id}/gallery` | — | `MediaAsset[]` |
| PATCH | `/marketplace/providers/{id}` | `UpdateProviderProfileRequest` | `ProviderDto` |
| POST | `/marketplace/provider-applications` | `ProviderApplicationRequest` | `ProviderApplicationDto` |
| GET | `/marketplace/provider-applications` | `?status=` | `Paged<ProviderApplicationDto>` |
| PUT | `/marketplace/providers/{id}/verification` | `VerificationDecisionRequest` | `ProviderDto` |

**Provider entity** carries: `id, slug, name, type, logo, profileImage, sector, categoryIds, specialty, services, description, verified, verificationStatus, rating, reviewCount, priceRange, coverage, availability, responseTimeMinutes, gallery, contact, subscriptionPlan, completedJobs, yearsActive`. Reviews are a separate paged endpoint (never inlined — mobile payload size).

**Contact masking:** `contact.masked = true` hides phone/WhatsApp until the viewer is entitled (own lead, paid tier, or admin). Never return the real number and a mask flag together.

**Sectors:** `home-services`, `medical`, `stores`, `transport`, `professional`.

---

## 4. Location

| Method | Endpoint | Response |
|---|---|---|
| GET | `/locations/countries` | `CountryDto[]` |
| GET | `/locations/governorates` | `GovernorateDto[]` (all 27 Egyptian governorates) |
| GET | `/locations/governorates/{code}` | `GovernorateDto` |
| GET | `/locations/governorates/{gov}/cities` | `CityDto[]` |
| GET | `/locations/governorates/{gov}/cities/{city}/areas` | `AreaDto[]` |
| POST | `/locations/resolve` | `ResolveLocationResponse` (reverse geocode for mobile GPS) |
| GET | `/locations/coverage` | `?providerId=` → `CoverageDto` |

- Location payloads are **immutable reference data**: `Cache-Control: public, max-age=86400` + `ETag`. Redis-backed, and Flutter ships a bundled snapshot for offline first-run.
- Codes are stable slugs (`cairo`, `giza`, `alexandria`) — never renumber.
- Coverage scopes: `area | city | governorate | nationwide`, plus optional radius model for transport providers.

---

## 5. Search (unified)

```
GET /api/v1/search
```

| Param | Type | Notes |
|---|---|---|
| `keyword` | string | Arabic + English, diacritic-insensitive |
| `type` | `provider \| service \| location \| all` | default `provider` |
| `sector`, `category`, `service`, `specialty` | slug | |
| `governorate`, `city`, `area` | slug | |
| `providerType` | `individual \| company \| clinic \| store \| fleet` | |
| `rating` | number | minimum average |
| `verified` | boolean | |
| `priceMin`, `priceMax` | int (piastres) | |
| `availability` | `any \| open_now \| today \| this_week \| 24_7` | |
| `lat`, `lng`, `radiusKm` | number | mobile geo search |
| `sort` | `relevance \| rating \| reviews \| price_asc \| price_desc \| response_time \| newest \| distance` | |
| `page`, `pageSize` | int | standard pagination |

**Response** = `Paged<...>` wrapper around `SearchResults`: `providers[]`, `services[]`, `locations[]`, plus **`facets[]`** (server-computed counts that drive the filter panel — the client must never count facets locally) and optional `didYouMean` / `interpretedQuery`.

Support endpoints: `/search/suggest` (autocomplete, ≤50 ms, Redis), `/search/filters` (filter schema so mobile builds its UI dynamically), and the type-scoped `/search/providers|services|locations`.

Sponsored results are injected by the ads service, flagged `sponsored: true`, and are **not** counted in `totalCount`.

---

## 6. Service Requests & Leads

| Method | Endpoint | Request | Response |
|---|---|---|---|
| POST | `/service-requests` | `CreateServiceRequest` | `ServiceRequestDto` |
| GET | `/service-requests` | `ServiceRequestListQuery` | `Paged<ServiceRequestDto>` |
| GET | `/service-requests/mine` | `?status=&page=` | `Paged<ServiceRequestDto>` |
| GET | `/service-requests/{id}` | — | `ServiceRequestDto` |
| PATCH | `/service-requests/{id}` | `UpdateServiceRequest` | `ServiceRequestDto` |
| PUT | `/service-requests/{id}/status` | `UpdateRequestStatus` | `ServiceRequestDto` |
| POST | `/service-requests/{id}/cancel` | `{ reason }` | `ServiceRequestDto` |
| POST | `/service-requests/{id}/assign` | `AssignProvider` | `ServiceRequestDto` |
| GET | `/service-requests/{id}/timeline` | — | `RequestTimelineEntry[]` |
| POST | `/service-requests/{id}/attachments` | asset ids | `MediaAsset[]` |
| GET | `/leads` | `LeadListQuery` | `Paged<LeadDto>` |
| GET | `/leads/{id}` | — | `LeadDto` |
| PUT | `/leads/{id}/status` | `UpdateLeadStatus` | `LeadDto` |
| POST | `/leads/{id}/accept` \| `/decline` | `{ note? }` | `LeadDto` |

**Model:** one `ServiceRequest` (customer intent) fans out to N `Lead` rows (one per matched provider).
Status machine: `draft → new → matching → assigned → in_contact → scheduled → completed`, with `cancelled` / `expired` reachable from any pre-completed state. Every transition appends a `RequestTimelineEntry` — the timeline is append-only and never rewritten.

`clientRequestId` on create is mandatory: mobile retries on flaky networks must not duplicate requests.

Accepting a lead decrements the subscription quota; when exhausted the API returns 422 `billing.lead_quota_exceeded` with an upgrade path in `errors[0].message`.

---

## 7. Reviews

| Method | Endpoint | Request | Response |
|---|---|---|---|
| POST | `/reviews` | `CreateReview` | `ReviewDto` |
| GET | `/marketplace/providers/{id}/reviews` | `ReviewListQuery` | `Paged<ReviewDto>` |
| GET | `/marketplace/providers/{id}/rating` | — | `ProviderRatingDto` |
| GET | `/reviews/moderation` | `?status=pending` | `Paged<ReviewDto>` |
| PUT | `/reviews/{id}/moderation` | `ModerateReview` | `ReviewDto` |
| POST | `/reviews/{id}/report` | `ReportReview` | `null` |

- New reviews land as `pending`; the AI review-analysis service proposes `publish/flag/reject`, a human confirms for anything non-`publish`.
- `verifiedPurchase` is true only when linked to a `completed` request.
- `ProviderRatingDto` carries the star distribution and 4 criteria averages so clients never aggregate client-side.

---

## 8. Subscriptions & Billing

| Method | Endpoint | Request | Response |
|---|---|---|---|
| GET | `/billing/plans` | `?audience=provider` | `PlanDto[]` |
| GET | `/billing/markets` | — | `CountryDto[]` |
| GET | `/billing/subscriptions` | `SubscriptionListQuery` | `Paged<SubscriptionDto>` |
| GET | `/billing/subscriptions/mine` | — | `SubscriptionDto` |
| POST | `/billing/subscriptions` | `CreateSubscription` | `SubscriptionDto` |
| POST | `/billing/subscriptions/{id}/cancel` | `CancelSubscription` | `SubscriptionDto` |
| GET | `/billing/invoices` | `InvoiceListQuery` | `Paged<InvoiceDto>` |
| GET | `/billing/invoices/{id}/pdf` | — | signed URL |
| GET/POST | `/billing/payment-methods` | — | `PaymentMethodDto[]` |
| POST | `/billing/webhooks/payment` | PSP payload | `null` (signature-verified, public route) |

Tiers `free | growth | elite`, cycles `monthly | yearly`. Egyptian payment methods to support: card, wallet, Fawry, InstaPay, bank transfer. VAT is computed server-side and itemised on the invoice.

---

## 9. Advertisements

| Method | Endpoint | Request | Response |
|---|---|---|---|
| GET | `/ads/campaigns` | `CampaignListQuery` | `Paged<CampaignDto>` |
| POST | `/ads/campaigns` | `CreateCampaign` | `CampaignDto` |
| PATCH | `/ads/campaigns/{id}` | `UpdateCampaign` | `CampaignDto` |
| GET | `/ads/campaigns/{id}/metrics` | `?from=&to=` | `CampaignMetrics` |
| GET | `/ads/sponsored-providers` | `?placement=&governorate=&category=` | `SponsoredProvider[]` |
| GET | `/ads/banners` | `?placement=&platform=` | `BannerDto[]` |
| GET | `/ads/targeting-options` | — | targeting schema |
| POST | `/ads/events/impression` \| `/click` | `AdEvent` | `null` |

Placements: `home_hero, home_featured, search_top, search_inline, category_banner, provider_related, mobile_feed`.
Banners provide `imageUrl` **and** `mobileImageUrl`, plus `targetPath` as a platform-neutral deep link (`/provider/{id}`) that Flutter maps to a route — never a full web URL.
Impression/click events are fire-and-forget, batched, and carry an opaque `trackingToken` for billing integrity.

---

## 10. Notifications

| Method | Endpoint | Request | Response |
|---|---|---|---|
| GET | `/notifications` | `NotificationListQuery` | `Paged<NotificationDto>` |
| GET | `/notifications/unread-count` | — | `UnreadCount` |
| PUT | `/notifications/{id}/read` | — | `NotificationDto` |
| PUT | `/notifications/read-all` | — | `null` |
| GET/PUT | `/notifications/preferences` | `NotificationPreferences` | `NotificationPreferences` |
| POST | `/notifications/devices` | `RegisterPushDevice` | `null` |
| DELETE | `/notifications/devices/{token}` | — | `null` |

Channels: `in_app`, `push` (FCM for web + Android, APNs for iOS), `email`, `whatsapp` (Business templates), `sms` (OTP fallback).
Copy lives in **server-side templates**; clients render `title`/`body` as delivered and use `actionPath` for deep linking. Preferences are a `kind × channel` matrix plus quiet hours.

---

## 11. Analytics

| Method | Endpoint | Query | Response |
|---|---|---|---|
| GET | `/analytics/marketplace` | — | `MarketplaceMetrics` (public, cached 5 min) |
| GET | `/analytics/admin` | `AnalyticsQuery` | `AdminDashboard` |
| GET | `/analytics/providers/{id}` | `AnalyticsQuery` | `ProviderDashboard` |
| GET | `/analytics/kpis` | `AnalyticsQuery` | `Metric[]` |
| GET | `/analytics/reports` | `ReportListQuery` | `Paged<ReportDefinition>` |
| GET | `/analytics/reports/{key}/export` | `?format=csv` | signed URL |

Metrics are pre-formatted contracts (`value`, `changePct`, `trend`, `format`) so web and mobile render identical cards without duplicating business math.

---

## 12. AI integration points (define now, build later)

| Purpose | Endpoint | Contract |
|---|---|---|
| AI search (NL → filters) | `POST /ai/search` | `AiSearchRequest → AiSearchResponse` |
| AI matching (request → providers) | `POST /ai/match` | `AiMatchRequest → AiMatchResponse` |
| Recommendations | `POST /ai/recommendations` | `AiRecommendationRequest → AiRecommendationResponse` |
| Review analysis | `POST /ai/reviews/analyze` | `AiReviewAnalysisRequest → AiReviewAnalysisResponse` |
| Provider ranking | `POST /ai/ranking` | `AiProviderRankingRequest → AiProviderRankingResponse` |

Rules:
1. Python AI services sit **behind** the ASP.NET Core gateway. Clients never call them directly.
2. Every AI-enhanced payload carries `aiApplied`, `modelVersion`, `latencyMs`.
3. **Graceful degradation is mandatory:** if the AI service times out, the gateway returns the deterministic SQL result with `aiApplied: false`. No client-visible error.
4. AI never changes payload *shape* — only ordering, scores and optional advisory fields.

---

## 13. Media uploads

Direct-to-storage, two steps, identical on web and mobile:

1. `POST /media/upload-ticket` → `{ assetId, uploadUrl, fields, expiresAt }`
2. Client PUTs the binary to `uploadUrl`, then submits `assetId` inside the business DTO
   (`attachmentAssetIds`, `galleryAssetIds`, `logoAssetId`, …).

The API never accepts multipart business payloads — keeps request bodies small on mobile networks.
