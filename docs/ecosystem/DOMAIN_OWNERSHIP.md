# Sections 2 & 4 (deliverable) — Domain Ownership Map

Every frontend feature has exactly one owning backend module. Cross-module reads go
through the owner's public API or a read model — never a direct table read.

## Module catalogue

| Module | Owns | Publishes to |
|---|---|---|
| **Identity** | users, roles, permissions, sessions, OTP, devices | every module (claims) |
| **Marketplace** | sectors, categories, taxonomy, media | Providers, Services, CMS |
| **Providers** | provider profile, services, coverage, gallery, verification, applications | Search, Leads, Reviews, Ads |
| **Customers** | customer profile, saved providers, addresses | Requests, Notifications |
| **Locations** | governorates, cities, areas, coverage zones, markets | Providers, Requests, Subscriptions |
| **Services** | provider-service catalogue + search read model | Search, AI |
| **Requests** | service requests, timeline, attachments | Leads, Notifications, Analytics |
| **Leads** | lead distribution, quota, lead lifecycle | Subscriptions, Notifications |
| **Reviews** | reviews, reports, rating aggregates | Providers (rating), AI |
| **Subscriptions** | plans, prices, markets, subscriptions, invoices | Leads (quota), Ads (eligibility) |
| **Advertising** | campaigns, banners, sponsored slots, ad events | Search, Home |
| **Notifications** | notifications, templates, preferences, device tokens | all clients |
| **Analytics** | KPIs, funnels, heatmaps, reports, exports | Admin |
| **CMS** | platform settings, integrations, static content, audit log | Admin |

## Feature → owner

| Frontend feature | Route(s) | Owner module | Contributing modules |
|---|---|---|---|
| Home & sector browsing | `/` | Marketplace | Providers, Advertising |
| Directory search | `/services` | Services | Locations, Providers, Advertising, AI |
| Provider details | `/provider/$id` | Providers | Reviews, Locations, Services |
| Request wizard | `/request-service` | Requests | Locations, Marketplace, Customers |
| My requests | `/my-requests` | Requests | Customers, Notifications |
| Provider dashboard | `/provider-dashboard` | Leads | Providers, Subscriptions, Analytics |
| Pricing | `/pricing` | Subscriptions | Locations (markets) |
| Join as provider | `/join-provider` | Providers | Subscriptions, Locations |
| Admin dashboard / analytics | `/admin`, `/admin/analytics` | Analytics | all |
| Admin users / team | `/admin/users`, `/admin/team` | Identity | CMS (audit) |
| Admin providers | `/admin/providers` | Providers | Identity |
| Admin requests & disputes | `/admin/requests` | Requests | Leads |
| Admin marketplace taxonomy | `/admin/marketplace` | Marketplace | — |
| Admin locations | `/admin/locations` | Locations | Providers |
| Admin subscriptions | `/admin/subscriptions` | Subscriptions | Analytics |
| Admin advertising | `/admin/advertising` | Advertising | Providers |
| Admin notifications | `/admin/notifications` | Notifications | CMS |
| Admin integrations / settings | `/admin/integrations`, `/admin/settings` | CMS | Identity |
| Admin audit | `/admin/audit` | CMS | Identity |

## Frontend ↔ module boundary

```text
React / Flutter client
        │  HTTP + JWT (ApiResponse<T> envelope)
        ▼
API Gateway (ASP.NET Core)
        │
   ┌────┴──────────────────────────────┐
   │ Application layer (per module)    │
   │ Identity · Marketplace · Providers│
   │ Requests · Leads · Subscriptions …│
   └────┬──────────────────────────────┘
        │  domain events (lead.created, request.completed…)
        ▼
Python AI services (read-only consumers + ranking APIs)
```

## Rules

1. One writer per entity — the owning module. Others react to domain events.
2. Clients never join data locally that a read model should provide (search results,
   dashboard metrics, provider cards ship pre-joined).
3. Every response uses the `ApiResponse<T>` / `PagedResult<T>` envelope
   (`src/core/contracts/envelope.ts`). No module invents its own shape.
4. Permission keys are owned by Identity but declared by the module that enforces them.
