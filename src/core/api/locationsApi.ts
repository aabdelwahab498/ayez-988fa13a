/** Placeholder API service — `/api/v1/locations/`. */
import { ENDPOINTS, mockRequest } from "./http";
import { governorates } from "@/mocks/locations";
import { mapGovernorate } from "./mappers";
import type { Area, City, Governorate } from "@/core/types";

export const locationsApi = {
  /** GET /api/v1/locations/governorates/ */
  governorates: (): Promise<Governorate[]> => {
    void ENDPOINTS.locations.governorates;
    return mockRequest(governorates.map(mapGovernorate));
  },

  /** GET /api/v1/locations/governorates/{slug}/cities/ */
  cities: (governorateSlug: string): Promise<City[]> =>
    mockRequest(governorates.find((g) => g.slug === governorateSlug)?.cities ?? []),

  /** GET /api/v1/locations/governorates/{gov}/cities/{city}/areas/ */
  areas: (governorateSlug: string, citySlug: string): Promise<Area[]> =>
    mockRequest(
      governorates
        .find((g) => g.slug === governorateSlug)
        ?.cities.find((c) => c.slug === citySlug)?.areas ?? [],
    ),
};
