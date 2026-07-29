/**
 * Placeholder API service — GET/POST contracts for `/api/v1/providers/`.
 * Returns mock fixtures today; swap the bodies for `request()` calls later.
 */
import { ENDPOINTS, mockRequest, paginate, toQueryString, type Paginated } from "./http";
import { providers, providerById } from "@/mocks/providers";
import { filterProviders } from "@/core/utils";
import { mapProvider } from "./mappers";
import type { ProviderDTO } from "@/core/types/dto";
import type { Provider, ProviderFilters } from "@/core/types";

export interface ProviderSearchParams extends ProviderFilters {
  page?: number;
  pageSize?: number;
}

export const providersApi = {
  /** GET /api/v1/providers/?category=&governorate=&page= */
  search: (params: ProviderSearchParams): Promise<Paginated<Provider>> => {
    const { page = 1, pageSize = 9, ...filters } = params;
    void `${ENDPOINTS.providers.list}${toQueryString({ ...filters, page, pageSize })}`;
    const filtered = filterProviders(providers as ProviderDTO[], filters).map(mapProvider);
    return mockRequest(paginate(filtered, page, pageSize));
  },

  /** GET /api/v1/providers/featured/ */
  featured: (limit = 6): Promise<Provider[]> =>
    mockRequest(
      providers.filter((p) => p.verified && p.rating >= 4.6).slice(0, limit).map(mapProvider),
    ),

  /** GET /api/v1/providers/{id}/ */
  getById: (id: string): Promise<Provider | null> =>
    mockRequest(providerById(id) ? mapProvider(providerById(id)!) : null),

  /** GET /api/v1/providers/{id}/related/ */
  related: (id: string, limit = 3): Promise<Provider[]> => {
    const current = providerById(id);
    return mockRequest(
      providers
        .filter((p) => p.id !== id && p.categories.some((c) => current?.categories.includes(c)))
        .slice(0, limit)
        .map(mapProvider),
    );
  },
};
