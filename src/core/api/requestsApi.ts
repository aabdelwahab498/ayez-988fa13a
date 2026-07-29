import { mockRequest } from "./client";
import { customerRequests, providerLeads } from "@/mocks/requests";
import type { ServiceRequest } from "@/core/types";

export const requestsApi = {
  /** GET /api/v1/requests/mine/ */
  listMine: (): Promise<ServiceRequest[]> => mockRequest(customerRequests),

  /** GET /api/v1/requests/leads/ */
  listLeads: (): Promise<ServiceRequest[]> => mockRequest(providerLeads),

  /** POST /api/v1/requests/ */
  create: (payload: Partial<ServiceRequest>) =>
    mockRequest({
      ...payload,
      id: `${Date.now()}`,
      reference: `REQ-${Math.floor(10000 + Math.random() * 89999)}`,
      status: "new" as const,
      createdAt: new Date().toISOString(),
    }),
};
