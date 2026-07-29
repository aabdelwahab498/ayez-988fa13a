/**
 * AYEZ API — Transport envelope contract (v1).
 *
 * These types describe the *wire format* the future ASP.NET Core Web API must
 * return. They are intentionally standalone: they never import domain models,
 * so the backend team can treat this file as the single source of truth and
 * the frontend mappers stay the only translation point.
 *
 * Nothing here executes at runtime — it is a compile-time contract only.
 */

/** ISO-8601 UTC timestamp, e.g. `2026-07-29T10:15:00Z`. */
export type IsoDateTime = string;

/** UUID v4 rendered as a lowercase string. */
export type Uuid = string;

/** Machine readable error code, e.g. `provider.not_found`. */
export type ErrorCode = string;

/** A single validation / business error. `field` is null for global errors. */
export interface ApiErrorItem {
  code: ErrorCode;
  field: string | null;
  message: string;
  /** Optional localisation key so mobile + web can translate consistently. */
  messageKey?: string;
}

/**
 * STANDARD RESPONSE FORMAT — every endpoint, success or failure.
 *
 * ```json
 * { "success": true, "data": { }, "message": "OK", "errors": [] }
 * ```
 */
export interface ApiResponse<TData> {
  success: boolean;
  data: TData | null;
  message: string;
  errors: ApiErrorItem[];
  /** Correlation id echoed from `X-Request-Id`; used for support tickets. */
  traceId?: string;
}

/** Convenience alias for endpoints that return no payload (204-like). */
export type ApiEmptyResponse = ApiResponse<null>;

/** PAGINATION STANDARD — required by every list endpoint. */
export interface PagedResult<TItem> {
  items: TItem[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export type PagedResponse<TItem> = ApiResponse<PagedResult<TItem>>;

/** Query parameters accepted by every list endpoint. */
export interface PageQueryContract {
  /** 1-based. Default `1`. */
  page?: number;
  /** Default `20`, maximum `100`. */
  pageSize?: number;
}

export type SortDirection = "asc" | "desc";

/**
 * SORTING STANDARD — `?sort=rating:desc,name:asc`.
 * Backend parses the comma separated list; unknown fields are ignored (never 400).
 */
export interface SortQueryContract {
  sort?: string;
}

export interface SortDescriptor {
  field: string;
  direction: SortDirection;
}

/** FILTERING STANDARD — operators the backend must support on list endpoints. */
export type FilterOperator =
  | "eq"
  | "neq"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "in"
  | "contains"
  | "between";

export interface FilterDescriptor {
  field: string;
  operator: FilterOperator;
  value: string | number | boolean | Array<string | number>;
}

/** Common query shape shared by list endpoints. */
export interface ListQueryContract extends PageQueryContract, SortQueryContract {
  /** Free-text search scoped to the resource. */
  q?: string;
  /** ISO language for localized fields. Defaults to `ar`. */
  lang?: "ar" | "en";
}

/** HTTP status codes the frontend explicitly handles. */
export const API_STATUS = {
  ok: 200,
  created: 201,
  noContent: 204,
  badRequest: 400,
  unauthorized: 401,
  forbidden: 403,
  notFound: 404,
  conflict: 409,
  unprocessable: 422,
  tooManyRequests: 429,
  serverError: 500,
} as const;

/** Canonical error codes shared between backend, web and mobile. */
export const ERROR_CODES = {
  validationFailed: "common.validation_failed",
  unauthorized: "auth.unauthorized",
  tokenExpired: "auth.token_expired",
  forbidden: "auth.forbidden",
  notFound: "common.not_found",
  conflict: "common.conflict",
  rateLimited: "common.rate_limited",
  serverError: "common.server_error",
  subscriptionRequired: "billing.subscription_required",
  leadQuotaExceeded: "billing.lead_quota_exceeded",
  providerNotVerified: "provider.not_verified",
} as const;

export type KnownErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];
