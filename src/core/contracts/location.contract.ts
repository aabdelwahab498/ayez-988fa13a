/**
 * Location domain contract — Egypt first, multi-country ready.
 * Codes are stable slugs (`cairo`, `giza`) so mobile can cache offline.
 */
import type { ListQueryContract, Uuid } from "./envelope";

export interface LocalizedNameContract {
  ar: string;
  en: string;
}

export interface CountryDtoContract {
  code: "EG" | "SA" | "AE" | "QA" | "KW" | "BH" | "JO";
  name: LocalizedNameContract;
  currency: string;
  dialCode: string;
  live: boolean;
}

export interface GovernorateDtoContract {
  id: Uuid;
  code: string;
  countryCode: CountryDtoContract["code"];
  name: LocalizedNameContract;
  region: "cairo" | "delta" | "canal" | "upper" | "coastal" | "sinai" | "new_valley";
  cityCount: number;
  providerCount: number;
  latitude: number | null;
  longitude: number | null;
}

export interface CityDtoContract {
  id: Uuid;
  code: string;
  governorateCode: string;
  name: LocalizedNameContract;
  areaCount: number;
}

export interface AreaDtoContract {
  id: Uuid;
  code: string;
  cityCode: string;
  governorateCode: string;
  name: LocalizedNameContract;
}

/** Service coverage declared by a provider. */
export type CoverageScopeContract = "area" | "city" | "governorate" | "nationwide";

export interface CoverageDtoContract {
  scope: CoverageScopeContract;
  governorateCodes: string[];
  cityCodes: string[];
  areaCodes: string[];
  /** Optional radius model for transport / mobile services. */
  radiusKm?: number;
  centerLat?: number;
  centerLng?: number;
}

export interface LocationListQueryContract extends ListQueryContract {
  countryCode?: string;
  governorateCode?: string;
  cityCode?: string;
}

/** Reverse geocoding for the mobile "use my location" flow. */
export interface ResolveLocationRequestContract {
  latitude: number;
  longitude: number;
}

export interface ResolveLocationResponseContract {
  governorate: GovernorateDtoContract | null;
  city: CityDtoContract | null;
  area: AreaDtoContract | null;
  accuracyMeters: number;
}
