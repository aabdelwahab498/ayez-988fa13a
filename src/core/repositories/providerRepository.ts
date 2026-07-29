/**
 * ProviderRepository — the only door between the UI and provider data.
 * Today it delegates to the mock `providersApi`; tomorrow the same interface is
 * implemented against Django REST without touching any component.
 */
import { providersApi, type ProviderSearchParams } from "@/core/api/providersApi";
import type { Paginated } from "@/core/api/http";
import type { Provider } from "@/core/types";

export interface ProviderRepository {
  search(params: ProviderSearchParams): Promise<Paginated<Provider>>;
  featured(limit?: number): Promise<Provider[]>;
  getById(id: string): Promise<Provider | null>;
  related(id: string, limit?: number): Promise<Provider[]>;
}

class MockProviderRepository implements ProviderRepository {
  search(params: ProviderSearchParams) {
    return providersApi.search(params);
  }
  featured(limit = 6) {
    return providersApi.featured(limit);
  }
  getById(id: string) {
    return providersApi.getById(id);
  }
  related(id: string, limit = 3) {
    return providersApi.related(id, limit);
  }
}

export const providerRepository: ProviderRepository = new MockProviderRepository();
export type { ProviderSearchParams };
