/**
 * Transport layer (placeholder).
 *
 * This module defines the *shape* of every future network call to the Django
 * REST API. Nothing here performs a real request today: `mockRequest` resolves
 * in-memory fixtures after a simulated latency so the UI exercises real
 * loading / error / retry paths.
 *
 * When the backend lands, only `request()` below changes (fetch + JWT header);
 * repositories, hooks, pages and components stay untouched.
 */

export const API_BASE_URL = "/api/v1";

/** Canonical REST endpoints the Django team will implement. */
export const ENDPOINTS = {
  auth: {
    login: "/auth/login/",
    refresh: "/auth/refresh/",
    me: "/auth/me/",
    logout: "/auth/logout/",
  },
  providers: {
    list: "/providers/",
    detail: (id: string) => `/providers/${id}/`,
    featured: "/providers/featured/",
    related: (id: string) => `/providers/${id}/related/`,
    reviews: (id: string) => `/providers/${id}/reviews/`,
  },
  locations: {
    governorates: "/locations/governorates/",
    cities: (gov: string) => `/locations/governorates/${gov}/cities/`,
    areas: (gov: string, city: string) =>
      `/locations/governorates/${gov}/cities/${city}/areas/`,
  },
  categories: { list: "/categories/", sectors: "/sectors/" },
  requests: { list: "/service-requests/", detail: (id: string) => `/service-requests/${id}/` },
  leads: { list: "/leads/", assign: (id: string) => `/leads/${id}/assign/` },
  reviews: { list: "/reviews/" },
  subscriptions: { plans: "/billing/plans/", list: "/billing/subscriptions/", markets: "/markets/" },
  campaigns: { list: "/ads/campaigns/" },
  notifications: { list: "/notifications/", read: (id: string) => `/notifications/${id}/read/` },
  analytics: { marketplace: "/analytics/marketplace/", admin: "/analytics/admin/", provider: "/analytics/provider/" },
  applications: { list: "/provider-applications/", create: "/provider-applications/" },
} as const;

/** Normalised API failure surfaced to the UI (never a raw fetch error). */
export class ApiError extends Error {
  status: number;
  code: string;
  constructor(message: string, status = 500, code = "unexpected_error") {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

/** DRF style pagination envelope. */
export interface Paginated<T> {
  results: T[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
  next: number | null;
  previous: number | null;
}

export interface PageQuery {
  page?: number;
  pageSize?: number;
}

export const DEFAULT_PAGE_SIZE = 9;

/** Client-side pagination that mirrors the future server response envelope. */
export function paginate<T>(items: T[], page = 1, pageSize = DEFAULT_PAGE_SIZE): Paginated<T> {
  const count = items.length;
  const totalPages = Math.max(1, Math.ceil(count / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  return {
    results: items.slice(start, start + pageSize),
    count,
    page: safePage,
    pageSize,
    totalPages,
    next: safePage < totalPages ? safePage + 1 : null,
    previous: safePage > 1 ? safePage - 1 : null,
  };
}

/** Serialise filters into a DRF friendly query string (used by future fetch). */
export function toQueryString(params: Record<string, unknown>): string {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "" || value === false) return;
    usp.set(key, String(value));
  });
  const qs = usp.toString();
  return qs ? `?${qs}` : "";
}

/**
 * Future implementation (kept documented, intentionally unused today):
 *
 * export async function request<T>(path: string, init?: RequestInit): Promise<T> {
 *   const res = await fetch(`${API_BASE_URL}${path}`, {
 *     ...init,
 *     headers: { "Content-Type": "application/json", ...authHeader(), ...init?.headers },
 *   });
 *   if (!res.ok) throw new ApiError(await res.text(), res.status);
 *   return res.json() as Promise<T>;
 * }
 */
export async function mockRequest<T>(data: T, ms = 220): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}
