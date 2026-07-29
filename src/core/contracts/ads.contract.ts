/** Advertisements — sponsored providers, campaigns, banners and targeting. */
import type { IsoDateTime, ListQueryContract, Uuid } from "./envelope";
import type { LocalizedNameContract } from "./location.contract";
import type { ProviderSummaryDtoContract, SectorSlugContract } from "./marketplace.contract";

export type CampaignStatusContract =
  | "draft"
  | "pending_review"
  | "active"
  | "paused"
  | "completed"
  | "rejected";

export type CampaignObjectiveContract = "leads" | "visibility" | "calls" | "profile_visits";

export type AdPlacementContract =
  | "home_hero"
  | "home_featured"
  | "search_top"
  | "search_inline"
  | "category_banner"
  | "provider_related"
  | "mobile_feed";

export interface TargetingContract {
  sectors: SectorSlugContract[];
  categorySlugs: string[];
  governorateCodes: string[];
  cityCodes: string[];
  keywords: string[];
  platforms: Array<"web" | "android" | "ios">;
  /** Optional audience hints for the future recommendation engine. */
  audienceSegments?: string[];
  dayParting?: Array<{ weekday: number; startHour: number; endHour: number }>;
}

export interface CampaignMetricsContract {
  impressions: number;
  clicks: number;
  ctr: number;
  leads: number;
  costPerLead: number;
  spend: number;
  currency: "EGP";
}

export interface CampaignDtoContract {
  id: Uuid;
  providerId: Uuid;
  name: string;
  objective: CampaignObjectiveContract;
  status: CampaignStatusContract;
  placements: AdPlacementContract[];
  targeting: TargetingContract;
  budget: { total: number; daily: number; spent: number; currency: "EGP" };
  schedule: { startAt: IsoDateTime; endAt: IsoDateTime | null };
  metrics: CampaignMetricsContract;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}

export interface CreateCampaignContract {
  providerId: Uuid;
  name: string;
  objective: CampaignObjectiveContract;
  placements: AdPlacementContract[];
  targeting: TargetingContract;
  budget: { total: number; daily: number };
  schedule: { startAt: IsoDateTime; endAt?: IsoDateTime };
  creativeAssetIds?: Uuid[];
}

export interface UpdateCampaignContract extends Partial<CreateCampaignContract> {
  status?: Extract<CampaignStatusContract, "active" | "paused" | "draft">;
}

export interface BannerDtoContract {
  id: Uuid;
  campaignId: Uuid | null;
  placement: AdPlacementContract;
  title: LocalizedNameContract;
  subtitle: LocalizedNameContract | null;
  imageUrl: string;
  /** Separate art for narrow mobile viewports. */
  mobileImageUrl: string | null;
  ctaLabel: LocalizedNameContract;
  /** Deep link path shared by web and Flutter, e.g. `/provider/{id}`. */
  targetPath: string;
  priority: number;
  startAt: IsoDateTime;
  endAt: IsoDateTime | null;
}

export interface SponsoredProviderContract {
  slotId: Uuid;
  campaignId: Uuid;
  placement: AdPlacementContract;
  provider: ProviderSummaryDtoContract;
  /** Opaque token echoed back on impression/click events for billing. */
  trackingToken: string;
}

export interface AdEventContract {
  trackingToken: string;
  placement: AdPlacementContract;
  platform: "web" | "android" | "ios";
  occurredAt: IsoDateTime;
}

export interface CampaignListQueryContract extends ListQueryContract {
  status?: CampaignStatusContract;
  providerId?: Uuid;
  placement?: AdPlacementContract;
}
