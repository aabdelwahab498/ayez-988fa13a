/** Reviews, provider ratings and moderation. */
import type { IsoDateTime, ListQueryContract, Uuid } from "./envelope";
import type { MediaAssetContract } from "./marketplace.contract";

export type ReviewStatusContract = "pending" | "published" | "rejected" | "flagged";

export interface ReviewDtoContract {
  id: Uuid;
  providerId: Uuid;
  requestId: Uuid | null;
  authorId: Uuid;
  authorName: string;
  authorAvatarUrl: string | null;
  rating: number;
  comment: string;
  photos: MediaAssetContract[];
  /** True when tied to a completed request — drives the "verified" chip. */
  verifiedPurchase: boolean;
  status: ReviewStatusContract;
  helpfulCount: number;
  providerReply: { comment: string; createdAt: IsoDateTime } | null;
  /** Populated by the AI review-analysis service; null until it runs. */
  sentiment: "positive" | "neutral" | "negative" | null;
  createdAt: IsoDateTime;
}

export interface CreateReviewContract {
  providerId: Uuid;
  requestId?: Uuid;
  rating: number;
  comment: string;
  photoAssetIds?: Uuid[];
}

export interface ProviderRatingDtoContract {
  providerId: Uuid;
  average: number;
  count: number;
  /** Key = star value "1".."5". */
  distribution: Record<"1" | "2" | "3" | "4" | "5", number>;
  criteria: {
    quality: number;
    punctuality: number;
    price: number;
    communication: number;
  };
  lastReviewAt: IsoDateTime | null;
}

export interface ReviewListQueryContract extends ListQueryContract {
  providerId?: Uuid;
  status?: ReviewStatusContract;
  minRating?: number;
  maxRating?: number;
  verifiedOnly?: boolean;
}

export interface ModerateReviewContract {
  decision: "publish" | "reject" | "flag";
  reason?: string;
}

export interface ReportReviewContract {
  reason: "spam" | "abuse" | "fake" | "privacy" | "other";
  details?: string;
}
