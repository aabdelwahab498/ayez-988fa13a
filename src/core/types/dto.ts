/**
 * Data Transfer Objects.
 *
 * Every entity that crosses the (future) network boundary has a DTO. Today the
 * DTOs are structurally identical to the domain models, so the mappers are
 * identity functions. When Django returns snake_case payloads, only the
 * mappers in `src/core/api/mappers.ts` change — repositories keep returning
 * domain models and no component is affected.
 */
import type {
  Area,
  Category,
  City,
  Governorate,
  Provider,
  Review,
  Sector,
  ServiceRequest,
  User,
} from "./index";
import type {
  AdCampaign,
  Lead,
  Market,
  MarketplaceMetrics,
  ProviderApplication,
  ProviderSubscription,
  SubscriptionPlan,
} from "./marketplace";

export type ProviderDTO = Provider;
export type CustomerDTO = User;
export type CategoryDTO = Category;
export type SectorDTO = Sector;
export type GovernorateDTO = Governorate;
export type CityDTO = City;
export type AreaDTO = Area;
export type ReviewDTO = Review;
export type ServiceRequestDTO = ServiceRequest;
export type LeadDTO = Lead;
export type LeadStatusDTO = Lead["status"];
export type SubscriptionDTO = ProviderSubscription;
export type SubscriptionPlanDTO = SubscriptionPlan;
export type MarketDTO = Market;
export type CampaignDTO = AdCampaign;
export type AdvertisementDTO = AdCampaign;
export type AnalyticsDTO = MarketplaceMetrics;
export type ProviderApplicationDTO = ProviderApplication;

/** Notifications are frontend-only today; the DTO documents the future model. */
export interface NotificationDTO {
  id: string;
  title: string;
  body: string;
  kind: "lead" | "review" | "billing" | "system";
  read: boolean;
  createdAt: string;
  actionHref?: string;
}

/** JWT payload contract expected from `POST /api/v1/auth/login/`. */
export interface AuthenticationDTO {
  access: string;
  refresh: string;
  user: CustomerDTO;
}

/** Write DTOs (request bodies). */
export interface ServiceRequestCreateDTO {
  categorySlug: string;
  providerId?: string;
  governorate: string;
  city?: string;
  area?: string;
  description: string;
  /** "asap" | "today" | "this_week" | scheduled ISO date. */
  preferredTime?: string;
  customerName: string;
  customerPhone: string;
}

export interface ProviderApplicationCreateDTO {
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

export interface ReviewCreateDTO {
  providerId: string;
  rating: number;
  comment: string;
}
