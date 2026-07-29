# Section 6 — Shared Platform-Neutral Data Contracts

One vocabulary for React, Flutter and ASP.NET Core. TypeScript definitions live in
`src/core/contracts/` and are the source of truth; the tables below are the language-neutral
view used by the .NET and Flutter teams.

## Universal conventions

| Concern | Rule |
|---|---|
| Envelope | `ApiResponse<T> { success, data, message, errors[], traceId? }` |
| Lists | `PagedResult<T> { items, page, pageSize, totalCount, totalPages, hasNextPage, hasPreviousPage }` |
| Casing | `camelCase` on the wire for every platform |
| Ids | UUID v4 as lowercase string; never numeric |
| Dates | ISO-8601 UTC (`2026-07-29T10:15:00Z`); clients localise |
| Money | integer minor units + `currency` (`EGP`); never floats |
| Phones | E.164 (`+201234567890`) |
| Enums | lowercase snake strings (`in_contact`), never ordinals |
| Localised text | `name` resolved by `Accept-Language`; `nameAr` / `nameEn` when both are needed |
| Nullability | explicit `null`, never omitted keys, never empty string as "no value" |
| Errors | machine code from `ERROR_CODES` + `messageKey` for client translation |

## Core models

### UserDTO
`id, name, phone, email?, role (guest|customer|provider|admin), avatar?, governorate?, locale, createdAt`

### ProviderDTO
`id, name, slug, sector, specialty?, profileImage, categories[], services[ProviderServiceDTO],
rating, reviewsCount, verified, shortDescription, about, priceFrom, priceTo?, currency,
coverage[ServiceCoverageDTO], canServeNationwide, responseTimeMinutes, availableNow,
completedJobs, yearsExperience, phone, whatsappNumber?, lat?, lng?, gallery[], rankScore?, createdAt`

### ServiceDTO (`ProviderServiceDTO`)
`id, providerId, name, categorySlug, priceFrom, priceTo?, currency, unit, active`

### LocationDTO
`GovernorateDTO { id, code, name, slug, cities[] }` ·
`CityDTO { id, name, slug, governorateSlug, areas[] }` ·
`AreaDTO { id, name, slug, citySlug }` ·
`ServiceCoverageDTO { scope: area|city|governorate|nationwide, governorateSlug?, citySlug?, areaSlug?, label }`

### RequestDTO (`ServiceRequestDTO`)
`id, reference, categorySlug, categoryName, providerId?, providerName?, location{governorate, city?, area?},
locationLabel, description, customerName, customerPhone, status (new|in_contact|completed|cancelled),
images[], attachments[], createdAt, updatedAt`

### LeadDTO
`id, requestId, providerId, status, receivedAt, respondedAt?, expiresAt, priority, contactRevealed`

### ReviewDTO
`id, providerId, requestId?, authorName, rating, comment, date, location, sentiment?, aspects[]`

### SubscriptionDTO
`id, providerId, planId, planTier (free|growth|elite), marketCode, status, currentPeriodStart,
currentPeriodEnd, leadQuota, leadsUsed, autoRenew, priceMinor, currency`

### AdvertisementDTO (`CampaignDTO`)
`id, name, type (banner|sponsored_provider), placement, providerId?, status, startsAt, endsAt,
budgetMinor, currency, targeting{sectors[], categories[], governorates[]}, impressions, clicks`

### NotificationDTO
`id, title, body, kind (lead|review|billing|system), read, createdAt, actionHref, deepLink, data{}`

### AnalyticsDTO
`period, kpis[{key, value, delta, unit}], series[{key, points[{t, v}]}], funnel[{stage, count}],
demand[{governorateSlug, requests, providers, gap}]`

## Platform type mapping

| Contract type | TypeScript | C# | Dart |
|---|---|---|---|
| Uuid | `string` | `Guid` | `String` |
| IsoDateTime | `string` | `DateTimeOffset` (UTC) | `DateTime` (UTC) |
| Money (minor) | `number` | `long` | `int` |
| Enum | string union | `enum` + `JsonStringEnumConverter` | `enum` + string map |
| Paged list | `PagedResult<T>` | `PagedResult<T>` | `PagedResult<T>` |
| Nullable | `T \| null` | `T?` + nullable reference types | `T?` |

## Versioning

- URL versioned: `/api/v1/...`. Breaking changes ship as `/api/v2`.
- Additive fields are non-breaking; all clients must ignore unknown fields.
- Removing or retyping a field requires a new version and a two-release deprecation window.
- Contract changes land in `src/core/contracts/` first, then in the .NET and Dart models.
