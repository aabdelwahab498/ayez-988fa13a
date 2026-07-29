/** SubscriptionRepository — plans, markets and the subscription book. */
import { subscriptionsApi } from "@/core/api/subscriptionsApi";
import type { Paginated } from "@/core/api/http";
import type { Market, ProviderSubscription, SubscriptionPlan } from "@/core/types/marketplace";

export interface SubscriptionRepository {
  listPlans(): Promise<SubscriptionPlan[]>;
  listMarkets(): Promise<Market[]>;
  list(page?: number, pageSize?: number): Promise<Paginated<ProviderSubscription>>;
}

class MockSubscriptionRepository implements SubscriptionRepository {
  listPlans() {
    return subscriptionsApi.plans();
  }
  listMarkets() {
    return subscriptionsApi.markets();
  }
  list(page = 1, pageSize = 10) {
    return subscriptionsApi.list(page, pageSize);
  }
}

export const subscriptionRepository: SubscriptionRepository = new MockSubscriptionRepository();
