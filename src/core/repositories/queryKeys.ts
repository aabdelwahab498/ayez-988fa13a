/** Centralised TanStack Query keys — one source of truth for cache invalidation. */
import type { ProviderSearchParams } from "@/core/api/providersApi";

export const queryKeys = {
  providers: {
    all: ["providers"] as const,
    search: (params: ProviderSearchParams) => ["providers", "search", params] as const,
    featured: (limit: number) => ["providers", "featured", limit] as const,
    detail: (id: string) => ["providers", "detail", id] as const,
    related: (id: string) => ["providers", "related", id] as const,
  },
  locations: {
    governorates: () => ["locations", "governorates"] as const,
    cities: (gov: string) => ["locations", "cities", gov] as const,
    areas: (gov: string, city: string) => ["locations", "areas", gov, city] as const,
  },
  categories: {
    list: (sector?: string) => ["categories", sector ?? "all"] as const,
    sectors: () => ["sectors"] as const,
  },
  reviews: {
    byProvider: (id: string, page: number) => ["reviews", id, page] as const,
  },
  requests: {
    mine: (page: number, status?: string) => ["requests", "mine", page, status ?? "all"] as const,
    leads: (page: number, status?: string) => ["requests", "leads", page, status ?? "all"] as const,
  },
  leads: {
    list: (page: number, status?: string) => ["leads", page, status ?? "all"] as const,
  },
  notifications: {
    list: () => ["notifications"] as const,
  },
  subscriptions: {
    plans: () => ["subscriptions", "plans"] as const,
    markets: () => ["subscriptions", "markets"] as const,
    list: (page: number) => ["subscriptions", "list", page] as const,
  },
  campaigns: {
    list: (page: number, status?: string) => ["campaigns", page, status ?? "all"] as const,
  },
  analytics: {
    marketplace: () => ["analytics", "marketplace"] as const,
    admin: () => ["analytics", "admin"] as const,
    provider: (id: string) => ["analytics", "provider", id] as const,
  },
  customers: {
    me: () => ["customers", "me"] as const,
  },
} as const;
