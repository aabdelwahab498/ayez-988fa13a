/**
 * AYEZ backend contract barrel.
 *
 * Type-only, zero runtime cost apart from the endpoint/const maps. Import from
 * here in future repository implementations:
 *
 * ```ts
 * import { API_ENDPOINTS, type ApiResponse, type ProviderDtoContract } from "@/core/contracts";
 * ```
 *
 * The contracts describe the ASP.NET Core Web API. Domain models in
 * `src/core/types` stay frontend-owned; `src/core/api/mappers.ts` is the only
 * place allowed to translate between the two.
 */
export * from "./envelope";
export * from "./endpoints";
export * from "./identity.contract";
export * from "./location.contract";
export * from "./marketplace.contract";
export * from "./search.contract";
export * from "./requests.contract";
export * from "./reviews.contract";
export * from "./subscriptions.contract";
export * from "./ads.contract";
export * from "./notifications.contract";
export * from "./analytics.contract";
export * from "./ai.contract";
export * from "./admin.contract";
