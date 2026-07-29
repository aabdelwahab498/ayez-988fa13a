/** Placeholder API service — `/api/v1/reviews/`. */
import { mockRequest, paginate, type Paginated } from "./http";
import { providers } from "@/mocks/providers";
import { mapReview } from "./mappers";
import type { Review } from "@/core/types";

export const reviewsApi = {
  /** GET /api/v1/providers/{id}/reviews/?page= */
  listByProvider: (providerId: string, page = 1, pageSize = 5): Promise<Paginated<Review>> => {
    const list = providers.find((p) => p.id === providerId)?.reviews ?? [];
    return mockRequest(paginate(list.map(mapReview), page, pageSize));
  },

  /** GET /api/v1/reviews/?latest= */
  latest: (limit = 6): Promise<Review[]> =>
    mockRequest(
      providers
        .flatMap((p) => p.reviews)
        .sort((a, b) => +new Date(b.date) - +new Date(a.date))
        .slice(0, limit),
    ),
};
