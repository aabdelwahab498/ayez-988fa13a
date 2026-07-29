/**
 * Domain models for "دليل الخدمات".
 * Shapes intentionally mirror a future Django REST API payload
 * (snake-free camelCase DTOs mapped in the api layer).
 */

export type ID = string;

export interface Area {
  id: ID;
  name: string;
  slug: string;
}

export interface City {
  id: ID;
  name: string;
  slug: string;
  areas: Area[];
}

export interface Governorate {
  id: ID;
  name: string;
  slug: string;
  cities: City[];
}

/** A concrete location selection made by a customer or provider. */
export interface EgyptLocation {
  governorate: string;
  city?: string;
  area?: string;
}

/** Top-level directory sectors covered by the platform. */
export type SectorSlug =
  | "services"
  | "medical"
  | "stores"
  | "transport"
  | "professional";

export interface Sector {
  slug: SectorSlug;
  name: string;
  shortName: string;
  icon: string;
  description: string;
  /** Label used for the category selector inside this sector. */
  searchLabel: string;
}

export interface Category {
  id: ID;
  name: string;
  slug: string;
  sector: SectorSlug;
  icon: string;
  description: string;
  providersCount: number;
}


export interface ProviderService {
  id: ID;
  name: string;
  categorySlug: string;
  priceFrom: number;
  priceTo?: number;
  unit: string;
}

export type CoverageScope = "area" | "city" | "governorate" | "nationwide";

export interface ServiceCoverage {
  scope: CoverageScope;
  governorateSlug?: string;
  citySlug?: string;
  areaSlug?: string;
  label: string;
}

export interface Review {
  id: ID;
  providerId: ID;
  authorName: string;
  rating: number;
  comment: string;
  date: string;
  location: string;
}

export interface Provider {
  id: ID;
  name: string;
  slug: string;
  sector: SectorSlug;
  /** Medical specialty, product line, or professional focus shown on the card. */
  specialty?: string;
  profileImage: string;

  categories: string[];
  services: ProviderService[];
  rating: number;
  reviewsCount: number;
  verified: boolean;
  shortDescription: string;
  about: string;
  priceFrom: number;
  priceTo?: number;
  coverage: ServiceCoverage[];
  canServeNationwide: boolean;
  responseTimeMinutes: number;
  availableNow: boolean;
  completedJobs: number;
  yearsExperience: number;
  phone: string;
  gallery: string[];
  reviews: Review[];
}

export type RequestStatus = "new" | "in_contact" | "completed" | "cancelled";

export interface ServiceRequest {
  id: ID;
  reference: string;
  categorySlug: string;
  categoryName: string;
  providerId?: ID;
  providerName?: string;
  location: EgyptLocation;
  locationLabel: string;
  description: string;
  customerName: string;
  customerPhone: string;
  status: RequestStatus;
  createdAt: string;
  images: string[];
}

export type UserRole = "guest" | "customer" | "provider" | "admin";

export interface User {
  id: ID;
  name: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  governorate?: string;
}

export type SortKey = "rating" | "relevance" | "response" | "price";

export interface ProviderFilters {
  category?: string;
  governorate?: string;
  city?: string;
  area?: string;
  minRating?: number;
  verifiedOnly?: boolean;
  availableNow?: boolean;
  maxPrice?: number;
  query?: string;
  sort?: SortKey;
}
