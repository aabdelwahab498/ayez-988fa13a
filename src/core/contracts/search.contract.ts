/**
 * Unified search contract — `GET /api/v1/search`.
 *
 * One endpoint powers the hero search bar, the directory page, and the mobile
 * search screen. `type` selects the result shape; everything else is a filter.
 */
import type { ListQueryContract } from "./envelope";
import type {
  ProviderSummaryDtoContract,
  SectorSlugContract,
  ServiceDtoContract,
} from "./marketplace.contract";
import type {
  AreaDtoContract,
  CityDtoContract,
  GovernorateDtoContract,
} from "./location.contract";

export type SearchResultTypeContract = "provider" | "service" | "location" | "all";

export type SearchSortContract =
  | "relevance"
  | "rating"
  | "reviews"
  | "price_asc"
  | "price_desc"
  | "response_time"
  | "newest"
  | "distance";

export type AvailabilityFilterContract = "any" | "open_now" | "today" | "this_week" | "24_7";

/** SEARCH CONTRACT — every parameter the marketplace search must accept. */
export interface SearchQueryContract extends ListQueryContract {
  keyword?: string;
  type?: SearchResultTypeContract;
  sector?: SectorSlugContract;
  category?: string;
  service?: string;
  /** Medical specialty / product line slug. */
  specialty?: string;
  governorate?: string;
  city?: string;
  area?: string;
  providerType?: "individual" | "company" | "clinic" | "store" | "fleet";
  rating?: number;
  verified?: boolean;
  priceMin?: number;
  priceMax?: number;
  availability?: AvailabilityFilterContract;
  sponsoredFirst?: boolean;
  /** Geo search for mobile; radius in km. */
  lat?: number;
  lng?: number;
  radiusKm?: number;
  sort?: SearchSortContract;
}

export interface SearchFacetContract {
  key: string;
  label: { ar: string; en: string };
  values: Array<{ value: string; label: { ar: string; en: string }; count: number }>;
}

export interface SearchResultsContract {
  providers: ProviderSummaryDtoContract[];
  services: ServiceDtoContract[];
  locations: Array<
    | ({ kind: "governorate" } & GovernorateDtoContract)
    | ({ kind: "city" } & CityDtoContract)
    | ({ kind: "area" } & AreaDtoContract)
  >;
  /** SMART FILTERS — server-computed facet counts for the filter panel. */
  facets: SearchFacetContract[];
  /** Set when an AI service rewrote or expanded the query (see ai.contract). */
  interpretedQuery?: string;
  /** `keyword` → corrected spelling, e.g. "سباك" ← "سبااك". */
  didYouMean?: string;
}

export interface SearchSuggestQueryContract {
  keyword: string;
  limit?: number;
  governorate?: string;
}

export interface SearchSuggestionContract {
  type: "keyword" | "category" | "service" | "provider" | "location";
  value: string;
  label: { ar: string; en: string };
  href: string;
  score: number;
}
