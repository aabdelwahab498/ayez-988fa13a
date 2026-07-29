# Feature → API Dependency Map

Which endpoints each screen needs, and in what order they must ship. Use this to
sequence backend delivery so whole features light up at once instead of half-working.

## Screens

| Route / Feature | Component | Endpoints required | Blocking? |
|---|---|---|---|
| `/` Home | `features/home/HomePage.tsx` | `GET /marketplace/sectors`, `/marketplace/categories`, `/marketplace/providers/featured`, `/analytics/marketplace`, `/ads/banners?placement=home_hero` | Sectors + categories block first paint |
| `/services` Directory | `features/services/ServicesPage.tsx` | `GET /search` (with facets), `/marketplace/categories`, `/locations/*` | `GET /search` is the single hard dependency |
| Search bar (global) | `components/business/SearchBarWidget.tsx` | `GET /search/suggest`, `/marketplace/categories`, `/locations/governorates` | Suggest is optional; degrade to plain input |
| Filter panel | `components/business/FilterPanel.tsx` | `GET /search/filters` + facets from `/search` | Falls back to static filter list |
| `/provider/$id` Profile | `features/providers/ProviderDetailsPage.tsx` | `GET /marketplace/providers/{id}`, `/{id}/reviews`, `/{id}/rating`, `/{id}/related` | Profile blocks; reviews load independently |
| `/request-service` Wizard | `features/requests/RequestServicePage.tsx` | `GET /marketplace/categories`, `/locations/*`, `POST /media/upload-ticket`, `POST /service-requests` | Create endpoint is the hard dependency |
| `/my-requests` | `features/requests/MyRequestsPage.tsx` | `GET /service-requests/mine`, `/{id}/timeline`, `POST /{id}/cancel` | Requires auth |
| `/provider-dashboard` | `features/dashboard/ProviderDashboardPage.tsx` | `GET /analytics/providers/{id}`, `/leads`, `PUT /leads/{id}/status`, `GET /billing/subscriptions/mine`, `PATCH /marketplace/providers/{id}` | Requires auth + provider role |
| `/admin` → Overview | `features/admin/panels/OverviewPanel.tsx` | `GET /analytics/admin` | Requires admin role |
| `/admin` → Leads | `panels/LeadsPanel.tsx` | `GET /leads`, `POST /service-requests/{id}/assign`, `POST /ai/match` | AI match optional |
| `/admin` → Revenue | `panels/RevenuePanel.tsx` | `GET /billing/subscriptions`, `/billing/invoices`, `/analytics/kpis` | |
| `/admin` → Approvals | `panels/ApprovalsPanel.tsx` | `GET /marketplace/provider-applications`, `PUT /marketplace/providers/{id}/verification` | |
| `/admin` → Campaigns | `panels/CampaignsPanel.tsx` | `GET /ads/campaigns`, `/ads/campaigns/{id}/metrics`, `PATCH /ads/campaigns/{id}` | |
| `/pricing` | `features/marketplace/PricingPage.tsx` | `GET /billing/plans`, `/billing/markets` | |
| `/join-provider` | `features/marketplace/JoinProviderPage.tsx` | `GET /marketplace/sectors`, `/marketplace/categories`, `/locations/governorates`, `/billing/plans`, `POST /marketplace/provider-applications` | Submit is the hard dependency |
| Header / auth | `components/layout/PublicHeader.tsx`, `features/auth/useMockAuth.ts` | `POST /identity/login`, `/identity/otp/*`, `GET /identity/me`, `POST /identity/refresh`, `GET /notifications/unread-count` | Unlocks all authed screens |
| Footer | `components/layout/Footer.tsx` | `GET /marketplace/categories` | Cached |

## Recommended delivery waves

**Wave 1 — Read-only public marketplace**
`/locations/*`, `/marketplace/sectors|categories|providers|providers/{id}`, `/search`, `/analytics/marketplace`
→ Home, Directory, Provider profile go live.

**Wave 2 — Identity**
`/identity/*` (register, OTP, login, refresh, me)
→ Header auth, protected route gates.

**Wave 3 — Transactions**
`/service-requests/*`, `/leads/*`, `/media/upload-ticket`, `/notifications/*`
→ Request wizard, My Requests, Provider dashboard leads.

**Wave 4 — Monetisation**
`/billing/*`, `/marketplace/provider-applications`, `/marketplace/providers/{id}/verification`
→ Pricing, Join-provider, Admin approvals & revenue.

**Wave 5 — Growth & intelligence**
`/ads/*`, `/reviews/moderation`, `/analytics/admin|providers`, then `/ai/*`
→ Campaigns, moderation, dashboards, AI ranking and matching.

## Cross-cutting dependencies

| Concern | Needed by | Note |
|---|---|---|
| Localized `{ ar, en }` fields | Every screen | The i18n layer expects both; missing `en` falls back to `ar` |
| Facet counts on `/search` | Filter panel | Without them the panel shows filters with no counts |
| `traceId` in errors | `ErrorState` / `QueryBoundary` | Surfaced in support copy |
| `Retry-After` on 429 | TanStack Query retry policy | Client backs off instead of hammering |
| Deep-link `actionPath` | Notifications, banners | Must be a path, not a URL — Flutter maps it to a route |
