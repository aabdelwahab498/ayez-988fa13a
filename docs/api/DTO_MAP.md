# Frontend DTO Map

How every backend contract type reaches a React component. **The mapper layer is the
only translation point** — this is what keeps the Zero-Rewrite promise.

```
ASP.NET Core JSON
   └─ src/core/contracts/*.contract.ts   ← backend wire shape (this is new)
        └─ src/core/api/mappers.ts       ← the ONLY translation layer
             └─ src/core/types/*         ← frontend domain model (unchanged)
                  └─ repositories → query hooks → components
```

## Rules

1. Contracts (`*Contract`) describe the API. They are **type-only** and never imported by a component.
2. Domain models (`src/core/types`) are frontend-owned. Components import these.
3. When the API changes shape, only `mappers.ts` changes. Components stay untouched.
4. Money crosses the boundary in **piastres** and is divided by 100 in the mapper.
5. Localized `{ ar, en }` objects collapse to a single string in the mapper using the active locale.

## Mapping table

| Backend contract | Frontend domain model | Mapper function (to add) | Notes |
|---|---|---|---|
| `UserDtoContract` | `User` (`types/index.ts`) | `mapUser` | `role` narrows `provider_staff → provider` for UI purposes |
| `AuthSessionDtoContract` | `User` + token store | `mapAuthSession` | Tokens never enter React state; store in memory + refresh cookie |
| `RoleDtoContract` | `UserRole` | `mapRole` | |
| `SectorDtoContract` | `Sector` | `mapSector` | `name.{lang}` → `name` |
| `CategoryDtoContract` | `Category` | `mapCategory` | `isSpecialty` drives the "specialty vs service" label logic |
| `ServiceDtoContract` | `ProviderService` | `mapService` | `priceFrom/To` ÷ 100 |
| `ProviderDtoContract` | `Provider` | `mapProvider` | Full profile page |
| `ProviderSummaryDtoContract` | `Provider` (partial) | `mapProviderSummary` | Cards/lists; missing fields stay `undefined` |
| `ProviderApplicationDtoContract` | `ProviderApplication` (`types/marketplace.ts`) | `mapApplication` | |
| `CoverageDtoContract` | `ServiceCoverage` | `mapCoverage` | `scope` values already match |
| `GovernorateDtoContract` | `Governorate` | `mapGovernorate` | `code` → `slug` |
| `CityDtoContract` | `City` | `mapCity` | |
| `AreaDtoContract` | `Area` | `mapArea` | |
| `CountryDtoContract` | `Market` (`types/marketplace.ts`) | `mapMarket` | `live` flag already matches |
| `SearchResultsContract` | `Paginated<Provider>` + facets | `mapSearchResults` | Facets feed `FilterPanel` counts |
| `SearchSuggestionContract` | suggestion view model | `mapSuggestion` | |
| `ServiceRequestDtoContract` | `ServiceRequest` | `mapServiceRequest` | `status` maps `matching/assigned → in_contact` for the customer view |
| `RequestTimelineEntryContract` | timeline view model | `mapTimeline` | |
| `LeadDtoContract` | `Lead` (`types/marketplace.ts`) | `mapLead` | `matchScore` already 0–100 |
| `ReviewDtoContract` | `Review` | `mapReview` | |
| `ProviderRatingDtoContract` | rating summary view model | `mapProviderRating` | Replaces client-side averaging |
| `PlanDtoContract` | `SubscriptionPlan` | `mapPlan` | `leadsPerMonth: null` → `"unlimited"` |
| `SubscriptionDtoContract` | `ProviderSubscription` | `mapSubscription` | |
| `InvoiceDtoContract` | *(new)* `Invoice` | `mapInvoice` | Domain type added when billing UI ships |
| `CampaignDtoContract` | `AdCampaign` | `mapCampaign` | |
| `BannerDtoContract` / `SponsoredProviderContract` | *(new)* `Banner` / sponsored slot | `mapBanner` | |
| `NotificationDtoContract` | `NotificationDTO` (`types/dto.ts`) | `mapNotification` | |
| `MarketplaceMetricsContract` | `MarketplaceMetrics` | `mapMarketplaceMetrics` | |
| `AdminDashboardContract` | admin overview view model | `mapAdminOverview` | |
| `ProviderDashboardContract` | provider overview view model | `mapProviderOverview` | |
| `Ai*ResponseContract` | merged into existing view models | — | AI output is advisory; never a new UI shape |

## Envelope handling (single place)

The future `request()` in `src/core/api/http.ts` unwraps the envelope so no other
file ever sees `success` / `errors`:

```ts
const body: ApiResponse<T> = await res.json();
if (!res.ok || !body.success) {
  throw new ApiError(body.errors[0]?.message ?? body.message, res.status, body.errors[0]?.code);
}
return body.data as T;
```

`PagedResult<T>` maps to the existing frontend `Paginated<T>`:

| Backend | Frontend (`http.ts`) |
|---|---|
| `items` | `results` |
| `totalCount` | `count` |
| `totalPages` | `totalPages` |
| `hasNextPage` | `next` (page number or `null`) |
| `hasPreviousPage` | `previous` (page number or `null`) |

## Existing DTO file

`src/core/types/dto.ts` currently aliases domain models 1:1 (identity mappers, by design).
Those aliases stay as the *frontend* DTO surface; the new `src/core/contracts/*` files are
the *backend* surface. When an endpoint goes live, the corresponding alias in `dto.ts` is
replaced by the real contract type and the mapper stops being an identity function.
