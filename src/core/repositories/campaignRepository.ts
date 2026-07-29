/** CampaignRepository / AdvertisementRepository — sponsored placements. */
import { campaignsApi, type CampaignQuery } from "@/core/api/campaignsApi";
import type { Paginated } from "@/core/api/http";
import type { AdCampaign } from "@/core/types/marketplace";

export interface CampaignRepository {
  list(query?: CampaignQuery): Promise<Paginated<AdCampaign>>;
}

class MockCampaignRepository implements CampaignRepository {
  list(query: CampaignQuery = {}) {
    return campaignsApi.list(query);
  }
}

export const campaignRepository: CampaignRepository = new MockCampaignRepository();
/** Advertisements are served by the same backend resource today. */
export const advertisementRepository: CampaignRepository = campaignRepository;
export type { CampaignQuery };
