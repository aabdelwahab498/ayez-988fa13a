# Section 1 — ASP.NET Core Backend Readiness

Every shipped frontend feature, with the backend it will require. Paths are relative
to `API_V1_BASE` (`/api/v1`, see `src/core/contracts/endpoints.ts`). Permission keys
match `src/core/constants/permissions.ts`.

---

## 1. Authentication & Session

**Business purpose:** identify customers, providers and admins; issue JWT access +
refresh pairs; support OTP phone login used across Egypt.
**Backend module:** Identity
**Entities:** `AppUser`, `Role`, `Permission`, `RefreshToken`, `OtpChallenge`, `Device`
**DTOs:** `UserDTO`, `AuthenticationDTO`, `LoginRequestDTO`, `OtpRequestDTO`, `TokenPairDTO`
**APIs:**
- `POST /identity/register`
- `POST /identity/login`
- `POST /identity/refresh`
- `POST /identity/logout`
- `GET|PUT /identity/me`
- `POST /identity/otp/request`, `POST /identity/otp/verify`

**Permissions:** public for login/OTP; `identity.me.read`, `identity.me.edit` for self-service.
**Frontend touch points:** `src/features/auth/useMockAuth.ts`, `src/features/admin/auth/adminSession.ts`.

---

## 2. Sector & Category Directory

**Business purpose:** taxonomy that powers home page browsing and all search filters
(5 sectors, 32+ categories).
**Backend module:** Marketplace
**Entities:** `Sector`, `Category`, `CategoryTranslation`
**DTOs:** `SectorDTO`, `CategoryDTO`
**APIs:** `GET /marketplace/sectors`, `GET /marketplace/categories`, `GET /marketplace/categories/{slug}`
**Permissions:** public read; `marketplace.taxonomy.manage` for admin writes.
**Frontend:** `categoryRepository`, `HomePage`, `FilterPanel`, `AdminMarketplacePage`.

---

## 3. Provider Profile

**Business purpose:** the sellable unit of the marketplace — what a customer evaluates
before requesting service.
**Backend module:** Providers
**Entities:** `Provider`, `ProviderService`, `ProviderCoverage`, `ProviderGalleryItem`, `ProviderVerification`
**DTOs:** `ProviderDTO`, `ProviderServiceDTO`, `ServiceCoverageDTO`
**APIs:**
- `GET /marketplace/providers/{id}`
- `PUT /marketplace/providers/{id}`
- `GET /marketplace/providers/{id}/services|coverage|gallery|related`
- `GET /marketplace/providers/featured`

**Permissions:** public read; `provider.profile.edit` (owner), `provider.verify` (admin).
**Frontend:** `providerRepository`, `ProviderDetailsPage`, `ProviderCard`.

---

## 4. Directory Search & Filtering

**Business purpose:** match demand to supply by sector, category, governorate/city/area,
rating, price, availability and verification.
**Backend module:** Services (read model) + Locations
**Entities:** `ProviderSearchProjection`, `Governorate`, `City`, `Area`
**DTOs:** `SearchQueryDTO`, `PagedResult<ProviderDTO>`, `SearchFacetsDTO`
**APIs:** `GET /search`, `GET /search/providers`, `GET /search/suggest`, `GET /search/filters`
**Permissions:** public read; rate limited per IP.
**Frontend:** `ServicesPage` with URL-driven state (`searchSchema.ts`), `SearchBarWidget`.
**Notes:** page/pageSize/sort/filters follow the envelope standard; unknown sort fields must be ignored, never 400.

---

## 5. Egypt Location Model

**Business purpose:** all 27 governorates → cities → areas; drives coverage and pricing markets.
**Backend module:** Locations
**Entities:** `Country`, `Governorate`, `City`, `Area`, `CoverageZone`
**DTOs:** `GovernorateDTO`, `CityDTO`, `AreaDTO`, `LocationResolveDTO`
**APIs:** `GET /locations/governorates`, `.../cities`, `.../areas`, `POST /locations/resolve`, `GET /locations/coverage`
**Permissions:** public read; `locations.manage` for admin edits.
**Frontend:** `locationRepository`, `EgyptLocationSelector`, `AdminLocationsPage`.

---

## 6. Service Request (customer intake)

**Business purpose:** the conversion event — a customer describes a need and the platform
turns it into provider leads.
**Backend module:** Requests
**Entities:** `ServiceRequest`, `RequestAttachment`, `RequestTimelineEntry`, `RequestAssignment`
**DTOs:** `ServiceRequestDTO`, `ServiceRequestCreateDTO`, `RequestTimelineDTO`
**APIs:**
- `POST /service-requests` (idempotency key required)
- `GET /service-requests/mine`, `GET /service-requests/{id}`
- `PATCH /service-requests/{id}/status`, `POST /service-requests/{id}/cancel`
- `POST /service-requests/{id}/attachments`

**Permissions:** `request.create` (customer), `request.read.own`, `request.manage` (admin).
**Frontend:** `RequestServicePage` (5-step wizard), `MyRequestsPage`.

---

## 7. Leads (provider side of a request)

**Business purpose:** monetised distribution of requests to subscribed providers.
**Backend module:** Leads
**Entities:** `Lead`, `LeadQuota`, `LeadEvent`
**DTOs:** `LeadDTO`, `LeadStatusDTO`
**APIs:** `GET /leads`, `GET /leads/{id}`, `PATCH /leads/{id}/status`, `POST /leads/{id}/accept|decline`
**Permissions:** `lead.read.own`, `lead.respond`, `lead.manage` (admin).
**Business rules for backend:** quota enforced by plan tier; exceeding returns `billing.lead_quota_exceeded`.
**Frontend:** `ProviderDashboardPage`, `LeadsPanel`.

---

## 8. Reviews & Ratings

**Business purpose:** trust signal driving ranking and conversion.
**Backend module:** Reviews
**Entities:** `Review`, `ReviewReport`, `ProviderRatingAggregate`
**DTOs:** `ReviewDTO`, `ReviewCreateDTO`, `ProviderRatingDTO`
**APIs:** `GET|POST /reviews`, `GET /marketplace/providers/{id}/reviews`, `GET .../rating`,
`POST /reviews/{id}/report`, `PATCH /reviews/{id}/moderation`
**Permissions:** `review.create` (verified completed request only), `review.moderate` (admin).
**Frontend:** `ProviderDetailsPage` reviews tab, `RatingWidget`.

---

## 9. Provider Onboarding & Applications

**Business purpose:** supply acquisition funnel with manual moderation.
**Backend module:** Providers (onboarding submodule)
**Entities:** `ProviderApplication`, `ApplicationDocument`, `ModerationDecision`
**DTOs:** `ProviderApplicationDTO`, `ProviderApplicationCreateDTO`
**APIs:** `POST|GET /marketplace/provider-applications`, `GET|PATCH .../{id}`, `POST /marketplace/providers/{id}/verification`
**Permissions:** public submit; `provider.application.review`, `provider.verify`.
**Frontend:** `JoinProviderPage`, `ApprovalsPanel`, `AdminProvidersPage`.

---

## 10. Subscriptions & Billing

**Business purpose:** revenue — Free / Growth / Elite tiers priced per market.
**Backend module:** Subscriptions
**Entities:** `Plan`, `PlanPrice`, `Market`, `Subscription`, `Invoice`, `PaymentMethod`
**DTOs:** `SubscriptionPlanDTO`, `SubscriptionDTO`, `MarketDTO`, `InvoiceDTO`
**APIs:** `GET /billing/plans|markets`, `POST /billing/subscriptions`, `GET /billing/subscriptions/mine`,
`POST /billing/subscriptions/{id}/cancel`, `GET /billing/invoices`, `POST /billing/webhooks/payment`
**Permissions:** `billing.subscribe`, `billing.read.own`, `billing.manage` (admin).
**Frontend:** `PricingPage`, `AdminSubscriptionsPage`, `RevenuePanel`.

---

## 11. Advertising

**Business purpose:** sponsored placement inventory on home and search.
**Backend module:** Advertising
**Entities:** `Campaign`, `Banner`, `SponsoredSlot`, `AdEvent`
**DTOs:** `CampaignDTO`, `AdvertisementDTO`, `AdTargetingDTO`
**APIs:** `GET|POST /ads/campaigns`, `GET /ads/banners|sponsored-providers|targeting-options`,
`POST /ads/events/impression`, `POST /ads/events/click`
**Permissions:** `ads.manage`, `ads.read`.
**Frontend:** `CampaignsPanel`, `AdminAdvertisingPage`.

---

## 12. Notifications

**Business purpose:** lead alerts, request status changes, billing reminders.
**Backend module:** Notifications
**Entities:** `Notification`, `NotificationTemplate`, `NotificationPreference`, `DeviceToken`
**DTOs:** `NotificationDTO`, `NotificationTemplateDTO`, `DevicePreferenceDTO`
**APIs:** `GET /notifications`, `POST /notifications/{id}/read`, `POST /notifications/read-all`,
`GET /notifications/unread-count`, `GET|PUT /notifications/preferences`,
`POST|DELETE /notifications/devices`
**Permissions:** `notification.read.own`, `notification.template.manage` (admin).
**Frontend:** `notificationRepository`, `AdminNotificationsPage`, header bell.

---

## 13. Analytics & Executive Dashboard

**Business purpose:** operator visibility into demand, supply, conversion and revenue.
**Backend module:** Analytics
**Entities:** read-model projections + materialised views (`DailyKpi`, `FunnelStage`, `DemandByGovernorate`)
**DTOs:** `AnalyticsDTO`, `KpiSeriesDTO`, `FunnelDTO`, `HeatmapCellDTO`
**APIs:** `GET /analytics/marketplace|admin|kpis`, `GET /analytics/providers/{id}`,
`GET /analytics/reports/{key}`, `GET /analytics/reports/{key}/export`
**Permissions:** `analytics.view`, `analytics.export`.
**Frontend:** `AdminDashboardPage`, `AdminAnalyticsPage`, `OverviewPanel`.

---

## 14. Admin Control Plane (users, team, audit, settings, integrations)

**Business purpose:** operate the platform safely with RBAC and an immutable trail.
**Backend module:** Identity (RBAC) + CMS (settings, templates, integrations)
**Entities:** `AdminUser`, `Role`, `Permission`, `AuditLogEntry`, `PlatformSetting`, `IntegrationConfig`, `Dispute`
**DTOs:** `AdminUserDTO`, `RoleDTO`, `AuditLogDTO`, `PlatformSettingsDTO`, `IntegrationConfigDTO`, `DisputeDTO`
**APIs:** `GET|POST /identity/users`, `POST /identity/users/{id}/roles`, `GET /identity/roles|permissions`,
plus CMS routes for settings, integrations, templates and audit queries.
**Permissions:** `admin.users.manage`, `admin.team.manage`, `admin.audit.view`, `admin.settings.manage`, `admin.integrations.manage`.
**Frontend:** all pages under `src/features/admin/pages/`.
**Invariant:** roles live in a dedicated role table, never on the user/profile row.

---

## 15. Media & File Upload

**Business purpose:** provider galleries and request attachments.
**Backend module:** Marketplace (media submodule)
**Entities:** `MediaAsset`, `UploadTicket`
**DTOs:** `UploadTicketDTO`, `MediaAssetDTO`
**APIs:** `POST /media/upload-ticket`, `GET /media/assets/{id}`
**Permissions:** `media.upload` (authenticated); direct-to-storage upload with a short-lived signed ticket.
**Frontend:** request wizard image step, provider gallery editor.
