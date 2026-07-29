/** Placeholder API service — `/api/v1/leads/`. */
import { ENDPOINTS, mockRequest, paginate, type Paginated } from "./http";
import { leads } from "@/mocks/marketplace";
import { mapLead } from "./mappers";
import type { Lead, LeadStatus } from "@/core/types/marketplace";

export interface LeadQuery {
  status?: LeadStatus;
  page?: number;
  pageSize?: number;
}

export const leadsApi = {
  /** GET /api/v1/leads/?status=&page= */
  list: ({ status, page = 1, pageSize = 10 }: LeadQuery = {}): Promise<Paginated<Lead>> => {
    void ENDPOINTS.leads.list;
    const filtered = status ? leads.filter((l) => l.status === status) : leads;
    return mockRequest(paginate(filtered.map(mapLead), page, pageSize));
  },

  /** POST /api/v1/leads/{id}/assign/ */
  assign: (id: string, providerId: string): Promise<{ id: string; providerId: string }> =>
    mockRequest({ id, providerId }, 400),
};
