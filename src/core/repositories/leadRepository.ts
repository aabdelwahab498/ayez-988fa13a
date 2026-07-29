/** LeadRepository — marketplace lead routing. */
import { leadsApi, type LeadQuery } from "@/core/api/leadsApi";
import type { Paginated } from "@/core/api/http";
import type { Lead } from "@/core/types/marketplace";

export interface LeadRepository {
  list(query?: LeadQuery): Promise<Paginated<Lead>>;
  assign(id: string, providerId: string): Promise<{ id: string; providerId: string }>;
}

class MockLeadRepository implements LeadRepository {
  list(query: LeadQuery = {}) {
    return leadsApi.list(query);
  }
  assign(id: string, providerId: string) {
    return leadsApi.assign(id, providerId);
  }
}

export const leadRepository: LeadRepository = new MockLeadRepository();
export type { LeadQuery };
