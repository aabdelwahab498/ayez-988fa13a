# Mobile Developer Integration Notes (Flutter)

The API is designed **mobile-first equal**: no endpoint assumes a browser, cookies,
a mouse, or a wide viewport. Everything the web app does, Flutter can do with the
same contracts.

## 1. Same contracts, different client

`src/core/contracts/*` is the shared truth. Generate Dart models from the published
OpenAPI spec — do not hand-write them, and do not fork field names.

Recommended Flutter layering, mirroring the web app so the two stay reviewable together:

```
data/api        Dio client + envelope interceptor
data/dto        generated from OpenAPI
data/repository same interfaces as src/core/repositories
domain/model    Dart domain models (mapper is the only translation point)
presentation    Riverpod/Bloc + widgets
```

## 2. Envelope handling

Unwrap once in a Dio interceptor:

```dart
if (!body['success']) {
  throw ApiException(
    code: body['errors'].isNotEmpty ? body['errors'][0]['code'] : 'common.server_error',
    messageKey: body['errors'].isNotEmpty ? body['errors'][0]['messageKey'] : null,
    traceId: body['traceId'],
  );
}
return body['data'];
```

Render copy from `messageKey` through Flutter's own ARB translations; use `message` only as a fallback.

## 3. Auth

- Phone + OTP is the primary mobile flow (`/identity/otp/request` → `/identity/otp/verify`).
- Store the refresh token in `flutter_secure_storage`; keep the access token in memory only.
- Single-flight refresh: queue concurrent 401s behind one `/identity/refresh` call.
- On refresh-token reuse rejection, wipe storage and return to the login screen.
- Send the device block on login so push registration happens in one round trip.

## 4. Offline & connectivity

| Data | Strategy |
|---|---|
| Governorates / cities / areas | Bundle a JSON snapshot in the app, refresh via ETag on launch |
| Sectors / categories | Cache 24 h in Hive/Isar |
| Search results | Memory cache per query for the session; never persist |
| Draft service request | Persist locally; submit with `clientRequestId` when back online |
| Authenticated lists | Cache last page for instant paint, then revalidate |

**Idempotency is mandatory on mobile.** Every `POST /service-requests` carries a
`clientRequestId` (UUID generated on the device) so a retry after a dropped connection
never creates a duplicate.

## 5. Pagination

Use `hasNextPage` for infinite scroll — never compare `items.length` to `pageSize`.
Keep `pageSize` at 20 on mobile (10 on the leads screen where rows are tall).

## 6. Deep links

`actionPath` (notifications) and `targetPath` (banners) are **paths, not URLs**:
`/provider/{id}`, `/my-requests`, `/provider-dashboard?tab=leads`.

Map them in one router table so web and mobile navigate to equivalent screens:

| Path | Web route | Flutter screen |
|---|---|---|
| `/` | Home | `HomeScreen` |
| `/services?...` | Directory | `SearchScreen` (query params → filter state) |
| `/provider/{id}` | Provider profile | `ProviderScreen` |
| `/request-service` | Wizard | `RequestWizardScreen` |
| `/my-requests` | My requests | `MyRequestsScreen` |
| `/provider-dashboard` | Dashboard | `ProviderDashboardScreen` |
| `/pricing`, `/join-provider` | Marketing | `PlansScreen`, `JoinProviderScreen` |

## 7. Push notifications

- Register with `POST /notifications/devices` after login **and** after every token refresh.
- Unregister on logout (`DELETE /notifications/devices/{token}`) or the user keeps receiving another account's alerts.
- Notification payload carries `kind`, `actionPath` and a `data` map of entity ids — use those ids to invalidate exactly the affected caches instead of refetching everything.
- Respect server-side `quietHours`; do not implement a second client-side muting rule.

## 8. Media upload

Identical two-step flow as web: `POST /media/upload-ticket` → `PUT` the bytes to `uploadUrl`
→ send `assetId` in the business DTO. Compress images to ≤ 1600 px / ~300 KB before upload;
Egyptian mobile networks are the constraint, not the server.

## 9. Localization & RTL

- Send `Accept-Language: ar|en`; the server localizes messages and template copy.
- Localized entity fields arrive as `{ ar, en }` — pick by active locale, fall back to `ar`.
- Arabic is the default locale and RTL is the default direction. Use logical (start/end) insets everywhere.
- Numbers, currency (EGP) and dates format via `intl` with the `ar_EG` locale.

## 10. Geo features

`/search` accepts `lat`, `lng`, `radiusKm` and `sort=distance` — mobile-only capabilities the
web app doesn't use. `POST /locations/resolve` reverse-geocodes GPS into governorate/city/area
so the request wizard can prefill location from one tap.

## 11. Parity checklist before release

- [ ] Same endpoints, same field names as web (no mobile-only forks)
- [ ] Envelope + error codes handled centrally
- [ ] Token refresh single-flight verified under airplane-mode toggling
- [ ] Idempotent create verified by double-submitting a request
- [ ] Deep links open the correct screen from a cold start
- [ ] Offline launch renders cached locations and categories
- [ ] Arabic RTL layout audited on the smallest supported device
