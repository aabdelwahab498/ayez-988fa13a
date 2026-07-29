import { mockRequest } from "./client";
import { categories, categoryBySlug } from "@/mocks/categories";
import type { Category } from "@/core/types";

export const servicesApi = {
  /** GET /api/v1/categories/ */
  listCategories: (): Promise<Category[]> => mockRequest(categories),

  /** GET /api/v1/categories/{slug}/ */
  getCategory: (slug: string) => mockRequest(categoryBySlug(slug) ?? null),
};
