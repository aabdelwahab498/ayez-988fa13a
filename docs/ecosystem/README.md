# AYEZ — Multi-Platform Readiness (Volume 2.12)

Documentation-only deliverable. **No frontend behaviour, UI, routing or architecture changed.**

The React web app is client #1 of a six-part ecosystem:

| # | Client / Service | Status |
|---|---|---|
| 1 | React Web Application | built |
| 2 | Flutter Customer App | planned |
| 3 | Flutter Provider App | planned |
| 4 | React Admin Control Center | built (`/admin`) |
| 5 | ASP.NET Core Backend Platform | planned |
| 6 | Python AI Services | planned |

## Core principle

Build once, serve many clients. Business logic lives in backend services;
experience lives in clients. React and Flutter are peers consuming the same
platform contracts.

## Documents

| Document | Purpose |
|---|---|
| [BACKEND_READINESS.md](./BACKEND_READINESS.md) | Section 1 — feature → module / entities / DTOs / endpoints / permissions |
| [DOMAIN_OWNERSHIP.md](./DOMAIN_OWNERSHIP.md) | Section 2 + 4 — backend module map, every feature has one owner |
| [AI_READINESS.md](./AI_READINESS.md) | Section 3 — AI capability inputs, outputs, frontend usage |
| [FLUTTER_READINESS.md](./FLUTTER_READINESS.md) | Section 4 — web screen → Flutter screen mapping and navigation |
| [MOBILE_CAPABILITIES.md](./MOBILE_CAPABILITIES.md) | Section 5 — GPS, camera, push, offline, biometric, deep links, maps |
| [SHARED_CONTRACTS.md](./SHARED_CONTRACTS.md) | Section 6 — platform-neutral DTOs valid for React / Flutter / .NET |
| [INTEGRATION_CHECKLIST.md](./INTEGRATION_CHECKLIST.md) | Section 7 — phased cutover checklist, zero-rewrite guarantees |

Machine-readable source of truth stays in **`src/core/contracts/`** (type-only).
Volume 2.9 handoff docs remain valid in [`../api/`](../api/README.md); this volume
sits above them and adds mobile + AI + ownership layers. If a document and the
TypeScript disagree, the TypeScript wins.
