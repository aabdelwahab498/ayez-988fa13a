/**
 * AI integration boundary (Python services behind the ASP.NET Core gateway).
 *
 * NOTHING is implemented here. These types only mark *where* AI plugs in so
 * the frontend never has to change shape when the models go live. Every AI
 * response must degrade gracefully: if the AI service is down, the gateway
 * returns the deterministic SQL result and sets `aiApplied: false`.
 */
import type { Uuid } from "./envelope";
import type { ProviderSummaryDtoContract } from "./marketplace.contract";
import type { SearchQueryContract } from "./search.contract";

/** Common envelope flag added to any AI-enhanced payload. */
export interface AiAugmented {
  aiApplied: boolean;
  modelVersion?: string;
  /** Milliseconds spent in the AI service; used for SLO dashboards. */
  latencyMs?: number;
}

/** 1) AI SEARCH — natural language → structured filters. */
export interface AiSearchRequestContract {
  /** e.g. "عايز سباك شاطر في المعادي دلوقتي". */
  utterance: string;
  locale: "ar" | "en";
  context?: { governorate?: string; lat?: number; lng?: number };
}

export interface AiSearchResponseContract extends AiAugmented {
  /** Structured filters the frontend can hand straight to `/search`. */
  filters: SearchQueryContract;
  intent: "find_provider" | "compare" | "price_question" | "support" | "unknown";
  confidence: number;
  clarifyingQuestion: string | null;
}

/** 2) AI MATCHING — rank providers for a service request. */
export interface AiMatchRequestContract {
  requestId: Uuid;
  limit?: number;
}

export interface AiMatchResponseContract extends AiAugmented {
  matches: Array<{
    providerId: Uuid;
    score: number;
    reasons: string[];
  }>;
}

/** 3) RECOMMENDATION ENGINE — personalised feeds for web and mobile. */
export interface AiRecommendationRequestContract {
  surface: "home_feed" | "provider_related" | "post_request" | "mobile_home";
  userId?: Uuid;
  providerId?: Uuid;
  governorate?: string;
  limit?: number;
}

export interface AiRecommendationResponseContract extends AiAugmented {
  items: Array<{ provider: ProviderSummaryDtoContract; score: number; reason: string }>;
}

/** 4) REVIEW ANALYSIS — sentiment, topics and abuse detection. */
export interface AiReviewAnalysisRequestContract {
  reviewIds: Uuid[];
}

export interface AiReviewAnalysisResponseContract extends AiAugmented {
  results: Array<{
    reviewId: Uuid;
    sentiment: "positive" | "neutral" | "negative";
    topics: string[];
    toxicity: number;
    spamProbability: number;
    suggestedModeration: "publish" | "flag" | "reject";
  }>;
}

/** 5) PROVIDER RANKING — quality score feeding search ordering. */
export interface AiProviderRankingRequestContract {
  providerIds: Uuid[];
  context?: { categorySlug?: string; governorate?: string };
}

export interface AiProviderRankingResponseContract extends AiAugmented {
  rankings: Array<{
    providerId: Uuid;
    qualityScore: number;
    responsivenessScore: number;
    reliabilityScore: number;
    explanation: string;
  }>;
}
