/** RequestRepository — customer service requests + provider inbox. */
import { requestsApi, type RequestQuery } from "@/core/api/requestsApi";
import type { Paginated } from "@/core/api/http";
import type { ServiceRequest } from "@/core/types";
import type { ServiceRequestCreateDTO } from "@/core/types/dto";

export interface RequestRepository {
  listMine(query?: RequestQuery): Promise<Paginated<ServiceRequest>>;
  listLeads(query?: RequestQuery): Promise<Paginated<ServiceRequest>>;
  create(payload: ServiceRequestCreateDTO): Promise<{ reference: string }>;
}

class MockRequestRepository implements RequestRepository {
  listMine(query: RequestQuery = {}) {
    return requestsApi.listMine(query);
  }
  listLeads(query: RequestQuery = {}) {
    return requestsApi.listLeads(query);
  }
  create(payload: ServiceRequestCreateDTO) {
    return requestsApi.create(payload);
  }
}

export const requestRepository: RequestRepository = new MockRequestRepository();
export type { RequestQuery };
