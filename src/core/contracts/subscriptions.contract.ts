/** Subscriptions, plans, invoices and payments. Money is in minor units (piastres). */
import type { IsoDateTime, ListQueryContract, Uuid } from "./envelope";
import type { LocalizedNameContract } from "./location.contract";

export type PlanTierContract = "free" | "growth" | "elite";
export type BillingCycleContract = "monthly" | "yearly";

export interface PlanDtoContract {
  id: Uuid;
  tier: PlanTierContract;
  audience: "provider" | "customer";
  name: LocalizedNameContract;
  tagline: LocalizedNameContract;
  monthlyPrice: number;
  yearlyPrice: number;
  currency: "EGP";
  leadsPerMonth: number | null; // null = unlimited
  featuredSlots: number;
  featureKeys: string[];
  recommended: boolean;
  availableMarkets: string[];
  sortOrder: number;
}

export type SubscriptionStatusContract =
  | "trialing"
  | "active"
  | "past_due"
  | "cancelled"
  | "expired";

export interface SubscriptionDtoContract {
  id: Uuid;
  subscriberId: Uuid;
  subscriberType: "provider" | "customer";
  planId: Uuid;
  tier: PlanTierContract;
  cycle: BillingCycleContract;
  status: SubscriptionStatusContract;
  currentPeriodStart: IsoDateTime;
  currentPeriodEnd: IsoDateTime;
  cancelAtPeriodEnd: boolean;
  amount: number;
  currency: "EGP";
  usage: { leadsUsed: number; leadsQuota: number | null; featuredUsed: number };
  createdAt: IsoDateTime;
}

export interface CreateSubscriptionContract {
  planId: Uuid;
  cycle: BillingCycleContract;
  paymentMethodId?: Uuid;
  couponCode?: string;
}

export interface CancelSubscriptionContract {
  atPeriodEnd: boolean;
  reason?: string;
}

export type InvoiceStatusContract = "draft" | "open" | "paid" | "void" | "uncollectible";

export interface InvoiceDtoContract {
  id: Uuid;
  number: string;
  subscriptionId: Uuid;
  subscriberId: Uuid;
  status: InvoiceStatusContract;
  subtotal: number;
  vat: number;
  total: number;
  currency: "EGP";
  issuedAt: IsoDateTime;
  dueAt: IsoDateTime;
  paidAt: IsoDateTime | null;
  pdfUrl: string | null;
  lines: Array<{ description: string; quantity: number; unitAmount: number; amount: number }>;
}

export interface PaymentMethodDtoContract {
  id: Uuid;
  kind: "card" | "wallet" | "fawry" | "instapay" | "bank_transfer";
  label: string;
  last4: string | null;
  expiryMonth: number | null;
  expiryYear: number | null;
  isDefault: boolean;
}

export interface SubscriptionListQueryContract extends ListQueryContract {
  status?: SubscriptionStatusContract;
  tier?: PlanTierContract;
  subscriberType?: "provider" | "customer";
}

export interface InvoiceListQueryContract extends ListQueryContract {
  status?: InvoiceStatusContract;
  subscriptionId?: Uuid;
  issuedFrom?: IsoDateTime;
  issuedTo?: IsoDateTime;
}
