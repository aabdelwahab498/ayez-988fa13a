# Section 5 — Mobile Capability Requirements

Where the Flutter apps need native capabilities, what the backend must expose for each,
and how the web client behaves in the same place today.

| Capability | Screens | Backend requirement | Web equivalent today |
|---|---|---|---|
| **GPS location** | Home (auto governorate), Search ("قريب مني"), Request wizard (pin) | `POST /locations/resolve` accepting `{ lat, lng }` → governorate/city/area; optional `radiusKm` filter on `/search/providers` | manual governorate/city/area selectors |
| **Camera / gallery upload** | Request wizard attachments, provider gallery, onboarding documents | `POST /media/upload-ticket` returning a short-lived signed URL + `assetId`; client uploads direct to storage, then posts asset ids | file input on the request wizard |
| **Push notifications** | Leads (provider), request status (customer), billing reminders | `POST /notifications/devices` (token, platform, locale), `DELETE /notifications/devices/{token}`; per-type preferences; payload carries a deep link | in-app notification list + unread count |
| **Offline cache** | Home, Search results, My Requests, Provider details | `ETag` + `Cache-Control` on read endpoints; cursor-stable pagination; drafts synced with `Idempotency-Key` on reconnect | TanStack Query cache only |
| **Biometric login** | App unlock, re-auth before billing actions | long-lived refresh token bound to device id; `POST /identity/refresh` with device binding and revocation via `/identity/me/devices` | password/OTP session in `useMockAuth` |
| **Deep links** | Shared provider, shared request, campaign landing, push payloads | canonical URL scheme identical to web routes + universal links / app links host config | plain web URLs already canonical |
| **File upload** | Onboarding documents, invoices, dispute evidence | same upload-ticket flow; MIME + size validation server-side; virus scan before publish | request wizard images |
| **Maps** | Provider details, coverage picker, request location | provider `lat/lng` and coverage polygons on `ProviderDTO`/`ServiceCoverageDTO`; geocoding through `/locations/resolve` | coverage badges, no map |
| **Phone / WhatsApp** | Provider details, lead details | `phone` in E.164, optional `whatsappNumber`; click tracked via `POST /ads/events/click` or a contact event | `tel:` / `wa.me` links |
| **Share sheet** | Provider details, request reference | shareable canonical URLs with OG metadata | web share links |
| **In-app purchase / payments** | Plans, upgrade | store receipt validation endpoint alongside `POST /billing/webhooks/payment` | pricing page CTA |
| **SMS autofill** | OTP screen | OTP message format with the app hash appended | not applicable |
| **App version gate** | Startup | `GET /system/app-config` returning min supported version + maintenance flag | not applicable |

## Deep link table

| Link | Web route | Customer app | Provider app |
|---|---|---|---|
| `/` | Home | `HomeScreen` | `DashboardScreen` |
| `/services?category=&governorate=` | Search | `SearchResultsScreen` (query params preserved) | — |
| `/provider/{id}` | Provider details | `ProviderDetailsScreen` | `ProfilePreviewScreen` |
| `/request-service?providerId=` | Request wizard | `RequestServiceFlow` | — |
| `/my-requests/{id}` | My requests | `RequestDetailsScreen` | — |
| `/leads/{id}` | (admin/provider dashboard) | — | `LeadDetailsScreen` |
| `/pricing` | Pricing | `PlansScreen` | `BillingScreen` |

## Permission prompts (ask late, explain first)

| Native permission | Requested at | Fallback if denied |
|---|---|---|
| Location | first "near me" tap | manual governorate selector |
| Camera / photos | first attachment tap | skip attachments |
| Notifications | after first successful request or lead | in-app inbox only |
| Biometrics | opt-in from Account | password/OTP |
