/** CategoryRepository — sectors and their categories. */
import { categoriesApi } from "@/core/api/categoriesApi";
import type { Category, Sector } from "@/core/types";

export interface CategoryRepository {
  list(sector?: string): Promise<Category[]>;
  listSectors(): Promise<Sector[]>;
}

class MockCategoryRepository implements CategoryRepository {
  list(sector?: string) {
    return categoriesApi.list(sector);
  }
  listSectors() {
    return categoriesApi.sectors();
  }
}

export const categoryRepository: CategoryRepository = new MockCategoryRepository();
