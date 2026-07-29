/** LocationRepository — governorates / cities / areas of Egypt. */
import { locationsApi } from "@/core/api/locationsApi";
import type { Area, City, Governorate } from "@/core/types";

export interface LocationRepository {
  listGovernorates(): Promise<Governorate[]>;
  listCities(governorateSlug: string): Promise<City[]>;
  listAreas(governorateSlug: string, citySlug: string): Promise<Area[]>;
}

class MockLocationRepository implements LocationRepository {
  listGovernorates() {
    return locationsApi.governorates();
  }
  listCities(governorateSlug: string) {
    return locationsApi.cities(governorateSlug);
  }
  listAreas(governorateSlug: string, citySlug: string) {
    return locationsApi.areas(governorateSlug, citySlug);
  }
}

export const locationRepository: LocationRepository = new MockLocationRepository();
