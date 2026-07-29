/**
 * Marketplace domain models (subscriptions, leads, ads, growth).
 * Shapes mirror the future Django REST API payloads; all data today is mocked
 * behind the repository layer in `src/core/repositories`.
 */
import type { ID, SectorSlug } from "./index";

/** Markets the marketplace serves today or is prepared to expand into. */
export interface Market {
  code: "EG" | "SA" | "AE" | "QA" | "KW" | "BH" | "JO";
  name: string;
  currency: string;
  dialCode: string;
  live: boolean;
}

export type PlanTier = "free" | "growth" | "elite";

export interface SubscriptionPlan {
  id: ID;
  tier: PlanTier;
  name: string;
  tagline: string;
  monthlyPrice: number;
  yearlyPrice: number;
  leadsPerMonth: number | "unlimited";
  featuredSlots: number;
  featureKeys: string[];
  recommended: boolean;
}

export type SubscriptionStatus = "active" | "trial" | "past_due" | "cancelled";

export interface ProviderSubscription {
  id: ID;
  providerId: ID;
  providerName: string;
  tier: PlanTier;
  status: SubscriptionStatus;
  monthlyValue: number;
  renewsAt: string;
  leadsUsed: number;
  leadsQuota: number | "unlimited";
}

export type LeadStatus = "new" | "assigned" | "contacted" | "won" | "lost";

/** A customer intent routed by the marketplace to one or more providers. */
export interface Lead {
  id: ID;
  reference: string;
  customerName: string;
  categoryName: string;
  sector: SectorSlug;
  locationLabel: string;
  budget: number;
  status: LeadStatus;
  matchedProviders: string[];
  assignedTo?: string;
  createdAt: string;
  score: number;
}

export type ApplicationStatus = "pending" | "in_review" | "approved" | "rejected";

export interface ProviderApplication {
  id: ID;
  businessName: string;
  ownerName: string;
  sector: SectorSlug;
  categoryName: string;
  governorate: string;
  phone: string;
  documents: string[];
  status: ApplicationStatus;
  submittedAt: string;
}

export type CampaignStatus = "running" | "scheduled" | "ended";

export interface AdCampaign {
  id: ID;
  name: string;
  advertiser: string;
  placement: "home_hero" | "search_top" | "category_banner" | "provider_sidebar";
  status: CampaignStatus;
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  startsAt: string;
  endsAt: string;
}

export interface RevenuePoint {
  month: string;
  subscriptions: number;
  ads: number;
  commissions: number;
}

export interface MarketplaceMetrics {
  gmv: number;
  mrr: number;
  activeProviders: number;
  activeCustomers: number;
  leadsThisMonth: number;
  leadConversionRate: number;
  avgResponseMinutes: number;
  satisfactionScore: number;
  pendingApplications: number;
  revenueSeries: RevenuePoint[];
}
