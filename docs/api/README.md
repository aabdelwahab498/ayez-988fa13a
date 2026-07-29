# AYEZ — Backend Handoff Package (Volume 2.9)

Contract-only deliverable. **No frontend behaviour, UI or architecture changed.**

| Document | For |
|---|---|
| [API_CONTRACTS.md](./API_CONTRACTS.md) | Full endpoint/DTO/pagination/error specification |
| [DTO_MAP.md](./DTO_MAP.md) | How each backend DTO becomes a frontend domain model |
| [REPOSITORY_MAPPING.md](./REPOSITORY_MAPPING.md) | Repository → endpoint → hook mapping and migration steps |
| [FEATURE_API_MAP.md](./FEATURE_API_MAP.md) | Screen → endpoint dependencies and delivery waves |
| [BACKEND_HANDOFF.md](./BACKEND_HANDOFF.md) | ASP.NET Core team notes, invariants, definition of done |
| [MOBILE_INTEGRATION.md](./MOBILE_INTEGRATION.md) | Flutter integration notes and parity checklist |

Machine-readable contracts live in **`src/core/contracts/`** (type-only TypeScript,
zero runtime impact). If a document and the TypeScript disagree, the TypeScript wins.

Stack the contracts target: ASP.NET Core Web API · Clean Architecture · PostgreSQL ·
Redis · Python AI services · React web · Flutter mobile.
