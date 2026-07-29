# Repository Mapping

Each repository is the seam between the frontend and the API. Today every repository is
a `Mock*` implementation reading from `src/mocks/*`. Switching to the real backend means
writing an `Http*` sibling and changing **one exported const** per file — nothing else.

```ts
// today
export const providerRepository: ProviderRepository = new MockProviderRepository();
// after backend handoff
export const providerRepository: ProviderRepository = new HttpProviderRepository();
```

## Table

| Repository (`src/core/repositories/…`) | Interface methods | Endpoints it will call | Query hooks (`src/core/hooks/queries.ts`) |
|---|---|---|---|
| `providerRepository.ts` | `search`, `featured`, `byId`, `related` | `GET /search`, `/marketplace/providers/featured`, `/marketplace/providers/{id}`, `/{id}/related` | `useProviderSearch`, `useFeaturedProviders`, `useProvider`, `useRelatedProviders` |
| `categoryRepository.ts` | `sectors`, `list` | `GET /marketplace/sectors`, `/marketplace/categories` | `useSectors`, `useCategories` |
| `locationRepository.ts` | `governorates`, `cities`, `areas` | `GET /locations/governorates`, `/{gov}/cities`, `/{gov}/cities/{city}/areas` | `useGovernorates`, `useCities`, `useAreas` |
| `reviewRepository.ts` | `byProvider`, `create` | `GET /marketplace/providers/{id}/reviews`, `POST /reviews` | `useProviderReviews` |
| `requestRepository.ts` | `mine`, `create`, `providerLeads` | `GET /service-requests/mine`, `POST /service-requests`, `GET /leads` | `useMyRequests`, `useCreateRequest`, `useProviderLeads` |
| `leadRepository.ts` | `list`, `assign` | `GET /leads`, `POST /service-requests/{id}/assign` | `useLeads` |
| `subscriptionRepository.ts` | `plans`, `markets`, `list` | `GET /billing/plans`, `/billing/markets`, `/billing/subscriptions` | `usePlans`, `useMarkets`, `useSubscriptions` |
| `campaignRepository.ts` (+ `advertisementRepository` alias) | `list` | `GET /ads/campaigns` | `useCampaigns` |
| `notificationRepository.ts` | `list`, `markRead` | `GET /notifications`, `PUT /notifications/{id}/read` | `useNotifications` |
| `customerRepository.ts` | `me`, `signInAs`, `signOut` | `GET /identity/me`, `POST /identity/login`, `POST /identity/logout` | via `useMockAuth` → becomes `useAuth` |
| `dashboardRepository.ts` (`adminDashboardRepository`, `providerDashboardRepository`) | `overview` | `GET /analytics/admin`, `/analytics/providers/{id}` | `useAdminOverview`, `useProviderOverview` |
| `marketplaceRepository.ts` | metrics, applications, plans aggregate | `GET /analytics/marketplace`, `/marketplace/provider-applications` | `useMarketplaceMetrics` |

## Migration procedure per repository

1. Add `HttpXRepository` in the same file, implementing the **existing interface unchanged**.
2. Call `request<ContractDto>()` from `http.ts` with the endpoint from `API_ENDPOINTS`.
3. Convert the payload with a mapper from `src/core/api/mappers.ts`.
4. Flip the exported const behind an env flag during rollout:
   ```ts
   export const providerRepository: ProviderRepository =
     import.meta.env.VITE_API_LIVE === "true" ? new HttpProviderRepository() : new MockProviderRepository();
   ```
5. Delete the mock only after the endpoint is stable in production.

## Invariants that must survive the migration

- Repository **interfaces do not change**. If an interface must change, the contract was wrong — fix the contract, not the components.
- Repositories return **domain models**, never contract DTOs.
- No component, page or hook may import from `src/mocks/*` or `src/core/contracts/*`.
- Query keys stay in `src/core/repositories/queryKeys.ts`; the backend switch must not alter cache keys.
- Pagination stays server-shaped (`Paginated<T>`) — the UI already assumes server paging.
