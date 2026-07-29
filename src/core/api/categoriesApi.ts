/** Placeholder API service — `/api/v1/categories/` and `/api/v1/sectors/`. */
import { ENDPOINTS, mockRequest } from "./http";
import { categories } from "@/mocks/categories";
import { sectors } from "@/mocks/sectors";
import { mapCategory } from "./mappers";
import type { Category, Sector } from "@/core/types";

export const categoriesApi = {
  /** GET /api/v1/categories/?sector= */
  list: (sector?: string): Promise<Category[]> => {
    void ENDPOINTS.categories.list;
    const list = sector ? categories.filter((c) => c.sector === sector) : categories;
    return mockRequest(list.map(mapCategory));
  },

  /** GET /api/v1/sectors/ */
  sectors: (): Promise<Sector[]> => mockRequest(sectors),
};
