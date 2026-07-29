/** Placeholder API service — `/api/v1/ads/campaigns/`. */
import { ENDPOINTS, mockRequest, paginate, type Paginated } from "./http";
import { adCampaigns } from "@/mocks/marketplace";
import { mapCampaign } from "./mappers";
import type { AdCampaign, CampaignStatus } from "@/core/types/marketplace";

export interface CampaignQuery {
  status?: CampaignStatus;
  page?: number;
  pageSize?: number;
}

export const campaignsApi = {
  /** GET /api/v1/ads/campaigns/?status=&page= */
  list: ({ status, page = 1, pageSize = 10 }: CampaignQuery = {}): Promise<Paginated<AdCampaign>> => {
    void ENDPOINTS.campaigns.list;
    const filtered = status ? adCampaigns.filter((c) => c.status === status) : adCampaigns;
    return mockRequest(paginate(filtered.map(mapCampaign), page, pageSize));
  },
};
