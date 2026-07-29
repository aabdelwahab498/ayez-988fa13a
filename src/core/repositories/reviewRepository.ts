/** ReviewRepository — provider reviews (paginated, server-ready). */
import { reviewsApi } from "@/core/api/reviewsApi";
import type { Paginated } from "@/core/api/http";
import type { Review } from "@/core/types";

export interface ReviewRepository {
  listByProvider(providerId: string, page?: number, pageSize?: number): Promise<Paginated<Review>>;
  latest(limit?: number): Promise<Review[]>;
}

class MockReviewRepository implements ReviewRepository {
  listByProvider(providerId: string, page = 1, pageSize = 5) {
    return reviewsApi.listByProvider(providerId, page, pageSize);
  }
  latest(limit = 6) {
    return reviewsApi.latest(limit);
  }
}

export const reviewRepository: ReviewRepository = new MockReviewRepository();
