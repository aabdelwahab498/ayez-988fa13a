/**
 * Marketplace domain contract — sectors, categories, services, providers,
 * provider profiles and verification.
 */
import type { CoverageDtoContract, LocalizedNameContract } from "./location.contract";
import type { IsoDateTime, ListQueryContract, Uuid } from "./envelope";

export type SectorSlugContract =
  | "home-services"
  | "medical"
  | "stores"
  | "transport"
  | "professional";

export interface SectorDtoContract {
  id: Uuid;
  slug: SectorSlugContract;
  name: LocalizedNameContract;
  description: LocalizedNameContract;
  icon: string;
  categoryCount: number;
  providerCount: number;
  sortOrder: number;
}

export interface CategoryDtoContract {
  id: Uuid;
  slug: string;
  sector: SectorSlugContract;
  name: LocalizedNameContract;
  description: LocalizedNameContract | null;
  icon: string;
  /** Medical specialty / product line / professional discipline. */
  isSpecialty: boolean;
  providerCount: number;
  popular: boolean;
  sortOrder: number;
}

export interface ServiceDtoContract {
  id: Uuid;
  categoryId: Uuid;
  slug: string;
  name: LocalizedNameContract;
  description: LocalizedNameContract | null;
  /** Minor units (piastres) to avoid float drift; null = "on request". */
  priceFrom: number | null;
  priceTo: number | null;
  currency: "EGP";
  unit: "visit" | "hour" | "item" | "session" | "project" | null;
}

export type ProviderTypeContract =
  | "individual"
  | "company"
  | "clinic"
  | "store"
  | "fleet";

export type VerificationStatusContract =
  | "unverified"
  | "pending"
  | "documents_required"
  | "verified"
  | "rejected";

export interface AvailabilityWindowContract {
  /** 0 = Sunday … 6 = Saturday. */
  weekday: number;
  /** `HH:mm` in Africa/Cairo. */
  opensAt: string;
  closesAt: string;
}

export interface MediaAssetContract {
  id: Uuid;
  url: string;
  thumbnailUrl: string | null;
  mimeType: string;
  width: number | null;
  height: number | null;
  alt: LocalizedNameContract | null;
}

/** PROVIDER CONTRACT — the full profile payload. */
export interface ProviderDtoContract {
  id: Uuid;
  slug: string;
  name: LocalizedNameContract;
  type: ProviderTypeContract;
  logo: MediaAssetContract | null;
  profileImage: MediaAssetContract | null;
  sector: SectorSlugContract;
  categoryIds: Uuid[];
  primaryCategoryId: Uuid;
  specialty: LocalizedNameContract | null;
  services: ServiceDtoContract[];
  description: LocalizedNameContract;
  verified: boolean;
  verificationStatus: VerificationStatusContract;
  rating: number;
  reviewCount: number;
  priceRange: { from: number | null; to: number | null; currency: "EGP" };
  coverage: CoverageDtoContract;
  availability: {
    acceptingRequests: boolean;
    open24h: boolean;
    windows: AvailabilityWindowContract[];
  };
  /** Median first-response in minutes; drives the "fast reply" badge. */
  responseTimeMinutes: number | null;
  gallery: MediaAssetContract[];
  contact: {
    phone: string | null;
    whatsapp: string | null;
    website: string | null;
    /** Hidden until the lead is paid for, per subscription tier. */
    masked: boolean;
  };
  subscriptionPlan: { tier: "free" | "growth" | "elite"; sponsored: boolean };
  completedJobs: number;
  yearsActive: number;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}

/** Lightweight card payload used by lists, search and mobile feeds. */
export interface ProviderSummaryDtoContract {
  id: Uuid;
  slug: string;
  name: LocalizedNameContract;
  logoUrl: string | null;
  coverUrl: string | null;
  sector: SectorSlugContract;
  primaryCategoryId: Uuid;
  specialty: LocalizedNameContract | null;
  verified: boolean;
  rating: number;
  reviewCount: number;
  priceFrom: number | null;
  governorateCode: string;
  cityCode: string | null;
  responseTimeMinutes: number | null;
  sponsored: boolean;
}

export interface ProviderListQueryContract extends ListQueryContract {
  sector?: SectorSlugContract;
  categorySlug?: string;
  governorate?: string;
  city?: string;
  area?: string;
  verified?: boolean;
  minRating?: number;
}

/* ------------------------------------------------------- write contracts */

export interface ProviderApplicationRequestContract {
  businessName: string;
  ownerName: string;
  phone: string;
  email?: string;
  sector: SectorSlugContract;
  categorySlug: string;
  governorateCode: string;
  cityCode?: string;
  description: string;
  planTier: "free" | "growth" | "elite";
  documentAssetIds: Uuid[];
}

export interface ProviderApplicationDtoContract {
  id: Uuid;
  status: "submitted" | "under_review" | "approved" | "rejected";
  submittedAt: IsoDateTime;
  reviewedAt: IsoDateTime | null;
  reviewerId: Uuid | null;
  rejectionReason: string | null;
  documents: Array<{ id: Uuid; kind: string; verified: boolean }>;
  payload: ProviderApplicationRequestContract;
}

export interface UpdateProviderProfileRequestContract {
  name?: LocalizedNameContract;
  description?: LocalizedNameContract;
  categoryIds?: Uuid[];
  services?: Array<Omit<ServiceDtoContract, "id" | "categoryId">>;
  coverage?: CoverageDtoContract;
  availability?: { acceptingRequests?: boolean; windows?: AvailabilityWindowContract[] };
  galleryAssetIds?: Uuid[];
  logoAssetId?: Uuid;
  contact?: { phone?: string; whatsapp?: string; website?: string };
}

export interface VerificationDecisionRequestContract {
  decision: "approve" | "reject" | "request_documents";
  note?: string;
  requiredDocuments?: string[];
}
