import type { Provider, ProviderFilters, ServiceCoverage } from "@/core/types";
import { governorates } from "@/mocks/locations";

export function formatEGP(value: number): string {
  return `${value.toLocaleString("ar-EG")} ج.م`;
}

export function formatPriceRange(from: number, to?: number): string {
  return to ? `${formatEGP(from)} - ${formatEGP(to)}` : `تبدأ من ${formatEGP(from)}`;
}

export function formatResponseTime(minutes: number): string {
  if (minutes < 60) return `يرد خلال ${minutes} دقيقة`;
  const hours = Math.round(minutes / 60);
  return `يرد خلال ${hours} ساعة`;
}

export function formatArabicDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ar-EG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function governorateName(slug?: string): string | undefined {
  return governorates.find((g) => g.slug === slug)?.name;
}

export function cityName(govSlug?: string, citySlug?: string): string | undefined {
  const gov = governorates.find((g) => g.slug === govSlug);
  return gov?.cities.find((c) => c.slug === citySlug)?.name;
}

export function areaName(
  govSlug?: string,
  citySlug?: string,
  areaSlug?: string,
): string | undefined {
  const gov = governorates.find((g) => g.slug === govSlug);
  const city = gov?.cities.find((c) => c.slug === citySlug);
  return city?.areas.find((a) => a.slug === areaSlug)?.name;
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
  return parts.length ? parts.join(" - ") : "جميع محافظات مصر";
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
