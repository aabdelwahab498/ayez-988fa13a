# Section 4 — Flutter Mobile Readiness

Two Flutter apps consume the same `/api/v1` contracts as the web client:
**AYEZ Customer** and **AYEZ Provider**. Nothing in this document requires a frontend change.

## Navigation model

| App | Root pattern | Tabs |
|---|---|---|
| Customer | `BottomNavigationBar` (5 tabs, RTL-first) | Home · Search · Request · My Requests · Account |
| Provider | `BottomNavigationBar` (4 tabs) | Dashboard · Leads · Profile · Billing |
| Admin | not a mobile app — responsive web only | — |

The web app already mirrors this: `MobileBottomNavigation.tsx` uses the same five
customer destinations, so IA parity is guaranteed.

Routing: `go_router` with paths identical to the web routes, which makes deep links,
analytics and QA scripts shared across platforms.

---

## Screen mapping — Customer app

| Web screen | Route | Flutter screen | Navigation | Mobile-specific features | Required APIs |
|---|---|---|---|---|---|
| Home | `/` | `HomeScreen` | tab 1 | GPS auto-governorate, sector grid, sponsored carousel | `/marketplace/sectors`, `/marketplace/categories`, `/marketplace/providers/featured`, `/ads/banners` |
| Directory search | `/services` | `SearchResultsScreen` | tab 2 → push filters sheet | infinite scroll, filter bottom sheet, map toggle, "near me" | `/search/providers`, `/search/filters`, `/locations/*`, `/ai/match` |
| Provider details | `/provider/$id` | `ProviderDetailsScreen` | push | call button, WhatsApp button, map location, save provider, share sheet | `/marketplace/providers/{id}` + `/services|coverage|gallery|reviews|related` |
| Request wizard | `/request-service` | `RequestServiceFlow` (stepper, 5 pages) | tab 3 / push from provider | camera + gallery upload, GPS pin, contact autofill, draft offline | `POST /service-requests`, `POST /media/upload-ticket`, `/locations/resolve` |
| My requests | `/my-requests` | `MyRequestsScreen` + `RequestDetailsScreen` | tab 4 | pull-to-refresh, push updates, timeline, cancel action | `/service-requests/mine`, `/service-requests/{id}`, `/timeline`, `/cancel` |
| Pricing | `/pricing` | `PlansScreen` | push from account | in-app purchase / local payment sheet | `/billing/plans`, `/billing/markets` |
| Join as provider | `/join-provider` | `ProviderOnboardingFlow` | push from account | document camera capture, OCR hint | `POST /marketplace/provider-applications`, `/media/upload-ticket` |
| Header account menu | — | `AccountScreen` | tab 5 | biometric lock, language + theme, notification prefs | `/identity/me`, `/notifications/preferences` |
| Auth (modal) | — | `AuthScreen` / `OtpScreen` | modal route | SMS autofill, biometric re-login | `/identity/login`, `/identity/otp/*`, `/identity/refresh` |

## Screen mapping — Provider app

| Web screen | Flutter screen | Mobile-specific features | Required APIs |
|---|---|---|---|
| Provider dashboard | `ProviderDashboardScreen` | availability toggle, KPI cards, push-driven refresh | `/analytics/providers/{id}`, `PUT /marketplace/providers/{id}` |
| Leads panel | `LeadsScreen` + `LeadDetailsScreen` | high-priority push, accept/decline swipe, one-tap call | `/leads`, `/leads/{id}/accept|decline|status` |
| Provider profile edit | `ProfileEditScreen` | camera gallery upload, coverage map picker | `PUT /marketplace/providers/{id}`, `/coverage`, `/gallery` |
| Subscription | `BillingScreen` | invoice PDF viewer/share, plan upgrade | `/billing/subscriptions/mine`, `/billing/invoices/{id}/pdf` |

---

## Shared client rules

1. **State:** Riverpod + `dio` mirrors the React repository layer — one repository class
   per backend module, identical method names to `src/core/repositories/*`.
2. **Envelope:** a single `ApiResponse<T>` / `PagedResult<T>` decoder, same as
   `src/core/contracts/envelope.ts`.
3. **Localisation:** `ar` default with `TextDirection.rtl`, `en` secondary; keys reuse the
   web namespaces in `src/features/i18n/ns/*` exported as ARB files.
4. **Design tokens:** navy primary / warm orange accent and the Cairo font are exported
   from `src/styles.css` into a Flutter `ThemeData` token file — no hand-picked colours.
5. **Error codes:** clients branch on `ERROR_CODES`, never on message text.
6. **Idempotency:** request creation and lead responses send `Idempotency-Key`.
