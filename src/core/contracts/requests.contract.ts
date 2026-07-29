/**
 * Service requests and provider leads.
 * A ServiceRequest is the customer intent; a Lead is that intent routed to a
 * specific provider. One request fans out to many leads.
 */
import type { IsoDateTime, ListQueryContract, Uuid } from "./envelope";
import type { MediaAssetContract } from "./marketplace.contract";

export type ServiceRequestStatusContract =
  | "draft"
  | "new"
  | "matching"
  | "assigned"
  | "in_contact"
  | "scheduled"
  | "completed"
  | "cancelled"
  | "expired";

export type RequestUrgencyContract = "asap" | "today" | "this_week" | "scheduled";

export interface RequestLocationContract {
  governorateCode: string;
  cityCode: string | null;
  areaCode: string | null;
  addressLine: string | null;
  latitude: number | null;
  longitude: number | null;
}

export interface RequestTimelineEntryContract {
  id: Uuid;
  status: ServiceRequestStatusContract;
  actorType: "customer" | "provider" | "admin" | "system";
  actorId: Uuid | null;
  note: string | null;
  createdAt: IsoDateTime;
}

/** SERVICE REQUEST CONTRACT. */
export interface ServiceRequestDtoContract {
  id: Uuid;
  reference: string;
  customerId: Uuid;
  providerId: Uuid | null;
  serviceId: Uuid | null;
  categoryId: Uuid;
  location: RequestLocationContract;
  description: string;
  attachments: MediaAssetContract[];
  urgency: RequestUrgencyContract;
  scheduledFor: IsoDateTime | null;
  status: ServiceRequestStatusContract;
  contact: { name: string; phone: string; preferredChannel: "call" | "whatsapp" | "in_app" };
  budget: { from: number | null; to: number | null; currency: "EGP" } | null;
  leadCount: number;
  timeline: RequestTimelineEntryContract[];
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}

export interface CreateServiceRequestContract {
  categoryId: Uuid;
  serviceId?: Uuid;
  providerId?: Uuid;
  location: RequestLocationContract;
  description: string;
  attachmentAssetIds?: Uuid[];
  urgency: RequestUrgencyContract;
  scheduledFor?: IsoDateTime;
  contact: { name: string; phone: string; preferredChannel?: "call" | "whatsapp" | "in_app" };
  budget?: { from?: number; to?: number };
  /** Idempotency guard for mobile retries. */
  clientRequestId: string;
}

export interface UpdateServiceRequestContract {
  description?: string;
  location?: Partial<RequestLocationContract>;
  urgency?: RequestUrgencyContract;
  scheduledFor?: IsoDateTime;
  attachmentAssetIds?: Uuid[];
}

export interface UpdateRequestStatusContract {
  status: ServiceRequestStatusContract;
  note?: string;
}

export interface AssignProviderContract {
  providerId: Uuid;
  /** Admin override of the AI match score. */
  reason?: string;
  notifyProvider?: boolean;
}

export interface ServiceRequestListQueryContract extends ListQueryContract {
  status?: ServiceRequestStatusContract;
  categoryId?: Uuid;
  governorate?: string;
  customerId?: Uuid;
  providerId?: Uuid;
  createdFrom?: IsoDateTime;
  createdTo?: IsoDateTime;
}

/* ------------------------------------------------------------------ leads */

export type LeadStatusContract =
  | "new"
  | "assigned"
  | "viewed"
  | "contacted"
  | "quoted"
  | "won"
  | "lost"
  | "expired";

export interface LeadDtoContract {
  id: Uuid;
  requestId: Uuid;
  providerId: Uuid;
  customerName: string;
  /** Masked (`010****1234`) until the provider accepts and quota allows. */
  customerPhone: string;
  categoryId: Uuid;
  location: RequestLocationContract;
  summary: string;
  status: LeadStatusContract;
  /** 0–100, produced by the AI matching service. */
  matchScore: number;
  priceEstimate: number | null;
  /** Lead cost charged against the subscription quota. */
  creditCost: number;
  expiresAt: IsoDateTime | null;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}

export interface LeadListQueryContract extends ListQueryContract {
  status?: LeadStatusContract;
  providerId?: Uuid;
  minMatchScore?: number;
}

export interface UpdateLeadStatusContract {
  status: LeadStatusContract;
  note?: string;
  lostReason?: "price" | "unavailable" | "out_of_coverage" | "no_answer" | "other";
}
