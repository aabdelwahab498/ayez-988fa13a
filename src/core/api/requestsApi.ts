/** Placeholder API service — `/api/v1/service-requests/`. */
import { ENDPOINTS, mockRequest, paginate, type Paginated } from "./http";
import { customerRequests, providerLeads } from "@/mocks/requests";
import { mapServiceRequest } from "./mappers";
import type { RequestStatus, ServiceRequest } from "@/core/types";
import type { ServiceRequestCreateDTO } from "@/core/types/dto";

export interface RequestQuery {
  status?: RequestStatus;
  page?: number;
  pageSize?: number;
}

export const requestsApi = {
  /** GET /api/v1/service-requests/?mine=true&status=&page= */
  listMine: ({ status, page = 1, pageSize = 10 }: RequestQuery = {}): Promise<
    Paginated<ServiceRequest>
  > => {
    void ENDPOINTS.requests.list;
    const filtered = status ? customerRequests.filter((r) => r.status === status) : customerRequests;
    return mockRequest(paginate(filtered.map(mapServiceRequest), page, pageSize));
  },

  /** GET /api/v1/service-requests/?assigned_to=me */
  listLeads: ({ status, page = 1, pageSize = 10 }: RequestQuery = {}): Promise<
    Paginated<ServiceRequest>
  > => {
    const filtered = status ? providerLeads.filter((r) => r.status === status) : providerLeads;
    return mockRequest(paginate(filtered.map(mapServiceRequest), page, pageSize));
  },

  /** POST /api/v1/service-requests/ */
  create: (payload: ServiceRequestCreateDTO): Promise<{ reference: string }> =>
    mockRequest({ reference: `REQ-${Math.floor(10000 + Math.random() * 89999)}` }, 600).then(
      (res) => {
        void payload;
        return res;
      },
    ),
};
