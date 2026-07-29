/**
 * DTO ➜ domain mappers.
 * Identity today (mock DTOs already match the domain). When Django returns
 * snake_case, implement the field mapping here only.
 */
import type {
  CampaignDTO,
  CategoryDTO,
  GovernorateDTO,
  LeadDTO,
  NotificationDTO,
  ProviderDTO,
  ReviewDTO,
  ServiceRequestDTO,
  SubscriptionDTO,
} from "@/core/types/dto";
import type {
  Category,
  Governorate,
  Provider,
  Review,
  ServiceRequest,
} from "@/core/types";
import type { AdCampaign, Lead, ProviderSubscription } from "@/core/types/marketplace";

export const mapProvider = (dto: ProviderDTO): Provider => dto;
export const mapCategory = (dto: CategoryDTO): Category => dto;
export const mapGovernorate = (dto: GovernorateDTO): Governorate => dto;
export const mapReview = (dto: ReviewDTO): Review => dto;
export const mapServiceRequest = (dto: ServiceRequestDTO): ServiceRequest => dto;
export const mapLead = (dto: LeadDTO): Lead => dto;
export const mapSubscription = (dto: SubscriptionDTO): ProviderSubscription => dto;
export const mapCampaign = (dto: CampaignDTO): AdCampaign => dto;
export const mapNotification = (dto: NotificationDTO): NotificationDTO => dto;
