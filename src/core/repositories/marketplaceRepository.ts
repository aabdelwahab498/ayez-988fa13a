/**
 * Repository pattern.
 *
 * Every screen talks to an interface, never to mock data directly. When the
 * Django REST API is ready, implement the same interfaces with `fetch`
 * against API_BASE_URL and swap the export at the bottom of this file —
 * no feature code changes.
 */
import { mockRequest } from "@/core/api/client";
import {
  adCampaigns,
  leads,
  marketplaceMetrics,
  markets,
  providerApplications,
  providerSubscriptions,
  subscriptionPlans,
} from "@/mocks/marketplace";
import type {
  AdCampaign,
  Lead,
  Market,
  MarketplaceMetrics,
  ProviderApplication,
  ProviderSubscription,
  SubscriptionPlan,
} from "@/core/types/marketplace";

export interface MarketplaceRepository {
  listMarkets(): Promise<Market[]>;
  listPlans(): Promise<SubscriptionPlan[]>;
  listSubscriptions(): Promise<ProviderSubscription[]>;
  listLeads(): Promise<Lead[]>;
  listApplications(): Promise<ProviderApplication[]>;
  listCampaigns(): Promise<AdCampaign[]>;
  getMetrics(): Promise<MarketplaceMetrics>;
  submitApplication(payload: ProviderApplicationDraft): Promise<{ reference: string }>;
}

export interface ProviderApplicationDraft {
  businessName: string;
  ownerName: string;
  phone: string;
  sector: string;
  categorySlug: string;
  governorate: string;
  city?: string;
  description: string;
  planTier: string;
}

class MockMarketplaceRepository implements MarketplaceRepository {
  listMarkets() {
    return mockRequest(markets);
  }
  listPlans() {
    return mockRequest(subscriptionPlans);
  }
  listSubscriptions() {
    return mockRequest(providerSubscriptions);
  }
  listLeads() {
    return mockRequest(leads);
  }
  listApplications() {
    return mockRequest(providerApplications);
  }
  listCampaigns() {
    return mockRequest(adCampaigns);
  }
  getMetrics() {
    return mockRequest(marketplaceMetrics);
  }
  submitApplication(payload: ProviderApplicationDraft) {
    const reference = `AP-${Math.floor(10000 + Math.random() * 89999)}`;
    return mockRequest({ reference, ...{} }, 600).then(() => {
      void payload;
      return { reference };
    });
  }
}

export const marketplaceRepository: MarketplaceRepository =
  new MockMarketplaceRepository();

/** Query keys shared by TanStack Query consumers. */
export const marketplaceKeys = {
  all: ["marketplace"] as const,
  plans: () => [...marketplaceKeys.all, "plans"] as const,
  markets: () => [...marketplaceKeys.all, "markets"] as const,
  subscriptions: () => [...marketplaceKeys.all, "subscriptions"] as const,
  leads: () => [...marketplaceKeys.all, "leads"] as const,
  applications: () => [...marketplaceKeys.all, "applications"] as const,
  campaigns: () => [...marketplaceKeys.all, "campaigns"] as const,
  metrics: () => [...marketplaceKeys.all, "metrics"] as const,
};
