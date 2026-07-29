import type { Provider, ProviderFilters, ServiceCoverage } from "@/core/types";
import { governorates } from "@/mocks/locations";
import { utilLanguage, utilLocale, tdRaw } from "./locale";

export function formatEGP(value: number): string {
  const formatted = value.toLocaleString(utilLocale());
  return utilLanguage() === "ar" ? `${formatted} ج.م` : `EGP ${formatted}`;
}

export function formatPriceRange(from: number, to?: number): string {
  if (to) return `${formatEGP(from)} - ${formatEGP(to)}`;
  return utilLanguage() === "ar"
    ? `تبدأ من ${formatEGP(from)}`
    : `From ${formatEGP(from)}`;
}

export function formatResponseTime(minutes: number): string {
  const ar = utilLanguage() === "ar";
  if (minutes < 60) {
    return ar ? `يرد خلال ${minutes} دقيقة` : `Replies in ${minutes} min`;
  }
  const hours = Math.round(minutes / 60);
  if (ar) return `يرد خلال ${hours} ساعة`;
  return `Replies in ${hours} ${hours === 1 ? "hour" : "hours"}`;
}

export function formatArabicDate(iso: string): string {
  return new Date(iso).toLocaleDateString(utilLocale(), {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function governorateName(slug?: string): string | undefined {
  const name = governorates.find((g) => g.slug === slug)?.name;
  return name ? tdRaw(name) : undefined;
}

export function cityName(govSlug?: string, citySlug?: string): string | undefined {
  const gov = governorates.find((g) => g.slug === govSlug);
  const name = gov?.cities.find((c) => c.slug === citySlug)?.name;
  return name ? tdRaw(name) : undefined;
}

export function areaName(
  govSlug?: string,
  citySlug?: string,
  areaSlug?: string,
): string | undefined {
  const gov = governorates.find((g) => g.slug === govSlug);
  const city = gov?.cities.find((c) => c.slug === citySlug);
  const name = city?.areas.find((a) => a.slug === areaSlug)?.name;
  return name ? tdRaw(name) : undefined;
}

export function locationLabel(filters: {
  governorate?: string;
  city?: string;
  area?: string;
}): string {
  const parts = [
    governorateName(filters.governorate),
    cityName(filters.governorate, filters.city),
    areaName(filters.governorate, filters.city, filters.area),
  ].filter(Boolean);
  if (parts.length) return parts.join(" - ");
  return utilLanguage() === "ar" ? "جميع محافظات مصر" : "all Egyptian governorates";
}

/** Does a provider cover the requested location? */
export function coversLocation(
  provider: Provider,
  governorate?: string,
  city?: string,
): boolean {
  if (!governorate) return true;
  if (provider.canServeNationwide) return true;
  return provider.coverage.some((c: ServiceCoverage) => {
    if (c.scope === "nationwide") return true;
    if (c.governorateSlug !== governorate) return false;
    if (c.scope === "governorate") return true;
    if (!city) return true;
    return c.citySlug === city;
  });
}

export function filterProviders(
  providers: Provider[],
  filters: ProviderFilters,
): Provider[] {
  const result = providers.filter((p) => {
    if (filters.sector && p.sector !== filters.sector) return false;
    if (filters.category && !p.categories.includes(filters.category)) return false;
    if (!coversLocation(p, filters.governorate, filters.city)) return false;
    if (filters.minRating && p.rating < filters.minRating) return false;
    if (filters.verifiedOnly && !p.verified) return false;
    if (filters.availableNow && !p.availableNow) return false;
    if (filters.maxPrice && p.priceFrom > filters.maxPrice) return false;
    if (filters.query) {
      const q = filters.query.trim();
      const haystack = `${p.name} ${p.specialty ?? ""} ${p.shortDescription} ${p.services
        .map((s) => s.name)
        .join(" ")}`;
      if (q && !haystack.includes(q)) return false;
    }
    return true;
  });


  const sort = filters.sort ?? "relevance";
  return [...result].sort((a, b) => {
    switch (sort) {
      case "rating":
        return b.rating - a.rating;
      case "response":
        return a.responseTimeMinutes - b.responseTimeMinutes;
      case "price":
        return a.priceFrom - b.priceFrom;
      default:
        return (
          Number(b.verified) - Number(a.verified) ||
          b.rating * b.reviewsCount - a.rating * a.reviewsCount
        );
    }
  });
}

export function delay<T>(value: T, ms = 350): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}
