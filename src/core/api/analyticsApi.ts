/** Placeholder API service — `/api/v1/analytics/`. */
import { ENDPOINTS, mockRequest } from "./http";
import { marketplaceMetrics } from "@/mocks/marketplace";
import { adminStats, customerRequests, providerLeads } from "@/mocks/requests";
import { providers } from "@/mocks/providers";
import type { MarketplaceMetrics } from "@/core/types/marketplace";
import type { ServiceRequest } from "@/core/types";

export interface AdminOverview {
  stats: typeof adminStats;
  requests: ServiceRequest[];
  providersCount: number;
}

export interface ProviderOverview {
  leads: ServiceRequest[];
  profileViews: number;
  conversionRate: number;
  rating: number;
}

export const analyticsApi = {
  /** GET /api/v1/analytics/marketplace/ */
  marketplace: (): Promise<MarketplaceMetrics> => {
    void ENDPOINTS.analytics.marketplace;
    return mockRequest(marketplaceMetrics);
  },

  /** GET /api/v1/analytics/admin/ */
  admin: (): Promise<AdminOverview> =>
    mockRequest({ stats: adminStats, requests: customerRequests, providersCount: providers.length }),

  /** GET /api/v1/analytics/provider/ */
  provider: (providerId: string): Promise<ProviderOverview> => {
    const current = providers.find((p) => p.id === providerId);
    return mockRequest({
      leads: providerLeads,
      profileViews: 1280,
      conversionRate: 0.34,
      rating: current?.rating ?? 4.7,
    });
  },
};
