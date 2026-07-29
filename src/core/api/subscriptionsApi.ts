/** Placeholder API service — `/api/v1/billing/`. */
import { ENDPOINTS, mockRequest, paginate, type Paginated } from "./http";
import { markets, providerSubscriptions, subscriptionPlans } from "@/mocks/marketplace";
import { mapSubscription } from "./mappers";
import type { Market, ProviderSubscription, SubscriptionPlan } from "@/core/types/marketplace";

export const subscriptionsApi = {
  /** GET /api/v1/billing/plans/ */
  plans: (): Promise<SubscriptionPlan[]> => {
    void ENDPOINTS.subscriptions.plans;
    return mockRequest(subscriptionPlans);
  },

  /** GET /api/v1/markets/ */
  markets: (): Promise<Market[]> => mockRequest(markets),

  /** GET /api/v1/billing/subscriptions/?page= */
  list: (page = 1, pageSize = 10): Promise<Paginated<ProviderSubscription>> =>
    mockRequest(paginate(providerSubscriptions.map(mapSubscription), page, pageSize)),
};
