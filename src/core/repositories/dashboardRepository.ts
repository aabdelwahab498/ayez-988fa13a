/** Dashboard repositories — aggregated analytics for provider & admin consoles. */
import { analyticsApi, type AdminOverview, type ProviderOverview } from "@/core/api/analyticsApi";
import type { MarketplaceMetrics } from "@/core/types/marketplace";

export interface ProviderDashboardRepository {
  overview(providerId: string): Promise<ProviderOverview>;
}

export interface AdminDashboardRepository {
  overview(): Promise<AdminOverview>;
  marketplaceMetrics(): Promise<MarketplaceMetrics>;
}

class MockProviderDashboardRepository implements ProviderDashboardRepository {
  overview(providerId: string) {
    return analyticsApi.provider(providerId);
  }
}

class MockAdminDashboardRepository implements AdminDashboardRepository {
  overview() {
    return analyticsApi.admin();
  }
  marketplaceMetrics() {
    return analyticsApi.marketplace();
  }
}

export const providerDashboardRepository: ProviderDashboardRepository =
  new MockProviderDashboardRepository();
export const adminDashboardRepository: AdminDashboardRepository =
  new MockAdminDashboardRepository();
export type { AdminOverview, ProviderOverview };
