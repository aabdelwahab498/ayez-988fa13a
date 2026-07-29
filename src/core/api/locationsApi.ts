import { mockRequest } from "./client";
import { governorates } from "@/mocks/locations";
import type { Governorate } from "@/core/types";

export const locationsApi = {
  /** GET /api/v1/locations/governorates/ */
  listGovernorates: (): Promise<Governorate[]> => mockRequest(governorates),

  /** GET /api/v1/locations/governorates/{slug}/cities/ */
  listCities: (governorateSlug: string) =>
    mockRequest(governorates.find((g) => g.slug === governorateSlug)?.cities ?? []),

  /** GET /api/v1/locations/cities/{slug}/areas/ */
  listAreas: (governorateSlug: string, citySlug: string) =>
    mockRequest(
      governorates
        .find((g) => g.slug === governorateSlug)
        ?.cities.find((c) => c.slug === citySlug)?.areas ?? [],
    ),
};
