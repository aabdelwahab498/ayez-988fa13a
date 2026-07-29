import { mockRequest } from "./client";
import { providers, providerById } from "@/mocks/providers";
import { filterProviders } from "@/core/utils";
import type { Provider, ProviderFilters } from "@/core/types";

export const providersApi = {
  /** GET /api/v1/providers/?category=&governorate=&city= */
  search: (filters: ProviderFilters): Promise<Provider[]> =>
    mockRequest(filterProviders(providers, filters)),

  /** GET /api/v1/providers/featured/ */
  featured: (): Promise<Provider[]> =>
    mockRequest(
      providers.filter((p) => p.verified && p.rating >= 4.6).slice(0, 6),
    ),

  /** GET /api/v1/providers/{id}/ */
  getById: (id: string) => mockRequest(providerById(id) ?? null),

  /** GET /api/v1/providers/{id}/related/ */
  related: (id: string) => {
    const current = providerById(id);
    return mockRequest(
      providers
        .filter(
          (p) =>
            p.id !== id &&
            p.categories.some((c) => current?.categories.includes(c)),
        )
        .slice(0, 3),
    );
  },
};
