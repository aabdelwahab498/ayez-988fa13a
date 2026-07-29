# Section 7 — Final Delivery: Integration Checklist

## 1. Frontend → Backend mapping
See [BACKEND_READINESS.md](./BACKEND_READINESS.md) — 15 features, each with module,
entities, DTOs, endpoints and permissions.

## 2. Frontend → Flutter mapping
See [FLUTTER_READINESS.md](./FLUTTER_READINESS.md) — every web screen has a named Flutter
screen, navigation pattern, mobile features and API list.

## 3. Frontend → AI mapping
See [AI_READINESS.md](./AI_READINESS.md) — 7 AI capabilities with inputs, outputs,
frontend usage and deterministic fallbacks.

## 4. Domain ownership map
See [DOMAIN_OWNERSHIP.md](./DOMAIN_OWNERSHIP.md) — 14 modules, one owner per feature.

## 5. Future integration checklist

### Phase A — contract freeze (no code changes)
- [ ] .NET team reviews `src/core/contracts/` and signs off on the envelope + pagination standard
- [ ] Enum values, error codes and permission keys frozen and mirrored in C#
- [ ] OpenAPI document generated from the .NET solution and diffed against the contracts
- [ ] Design tokens exported from `src/styles.css` to a Flutter theme file
- [ ] i18n namespaces exported from `src/features/i18n/ns/*` to ARB

### Phase B — backend go-live per module
For each module, in this order: Identity → Locations → Marketplace → Providers → Services/Search
→ Requests → Leads → Reviews → Subscriptions → Notifications → Advertising → Analytics → CMS.
- [ ] Endpoints return the standard envelope, including on errors
- [ ] Pagination, sorting and filtering behave per `envelope.ts`
- [ ] `Idempotency-Key` honoured on request creation and lead responses
- [ ] Permissions enforced server-side; roles stored in a dedicated role table
- [ ] Seed data covers all 27 governorates and the full category taxonomy

### Phase C — frontend cutover (zero rewrite)
- [ ] Set the API base URL and JWT interceptor in `src/core/api/client.ts`
- [ ] Swap the mock call inside each repository in `src/core/repositories/*` for the real endpoint
- [ ] Adjust mappers in `src/core/api/mappers.ts` only if the wire shape differs
- [ ] No changes to components, routes, hooks or query keys — this is the acceptance test
- [ ] Verify each route against the live API and keep mocks as test fixtures

### Phase D — AI enablement
- [ ] Gateway proxies `/ai/*` to the Python services with a timeout and fallback
- [ ] Ranking and recommendations cached in Redis and recomputed on schedule
- [ ] `reasons[]` surfaced in search results and admin quality views
- [ ] Fallback path verified by disabling the AI service in staging

### Phase E — mobile enablement
- [ ] `POST /notifications/devices` live; push payloads carry deep links
- [ ] Media upload tickets live with signed direct-to-storage upload
- [ ] `POST /locations/resolve` accepts coordinates; `radiusKm` supported on search
- [ ] `lat/lng` and coverage polygons present on `ProviderDTO`
- [ ] Universal links / app links configured for the deep link table
- [ ] `GET /system/app-config` returns min version + maintenance flag
- [ ] Device-bound refresh tokens and device revocation for biometric login

### Phase F — operations
- [ ] `X-Request-Id` propagated end to end and echoed as `traceId`
- [ ] Rate limits on search, OTP and request creation
- [ ] Audit log written for every admin mutation
- [ ] Analytics read models materialised; export endpoints paginated/streamed
- [ ] Webhook signature verification on payment callbacks

## Zero-rewrite guarantees

| Guarantee | Enforced by |
|---|---|
| UI never imports mocks | components read repositories/hooks only |
| One translation point | `src/core/api/mappers.ts` |
| One transport point | `src/core/api/http.ts` + `client.ts` |
| Stable cache identity | `src/core/repositories/queryKeys.ts` |
| Contracts before code | `src/core/contracts/` is type-only and versioned |
| Client parity | React and Flutter consume identical DTOs and error codes |
