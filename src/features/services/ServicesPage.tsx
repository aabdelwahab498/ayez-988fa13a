// Directory / search results page + filters + cards
import { useMemo, useState } from "react";
import { getRouteApi, useNavigate, Link } from "@tanstack/react-router";
import { SlidersHorizontal, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilterPanel } from "@/components/business/FilterPanel";
import { ProviderGrid } from "@/components/business/ProviderGrid";
import { EmptyState } from "@/components/common/EmptyState";
import { providers } from "@/mocks/providers";
import { categoryBySlug } from "@/mocks/categories";
import { sectors, sectorBySlug } from "@/mocks/sectors";
import { filterProviders, locationLabel } from "@/core/utils";
import { SORT_OPTIONS } from "@/core/constants";
import { defaultSearch, type ServicesSearch } from "./searchSchema";
import type { SortKey, SectorSlug } from "@/core/types";
import { useI18n } from "@/features/i18n/I18nProvider";

const routeApi = getRouteApi("/services");

export function ServicesPage() {
  const { t, td, n } = useI18n();
  const search = routeApi.useSearch();
  const navigate = routeApi.useNavigate();
  const [sheetOpen, setSheetOpen] = useState(false);

  const patch = (values: Partial<ServicesSearch>) => {
    navigate({ to: ".", search: (prev: ServicesSearch) => ({ ...prev, ...values }) });
  };

  const results = useMemo(
    () =>
      filterProviders(providers, {
        sector: (search.sector || undefined) as SectorSlug | undefined,
        category: search.category || undefined,
        governorate: search.governorate || undefined,
        city: search.city || undefined,
        minRating: search.rating || undefined,
        verifiedOnly: search.verified || undefined,
        availableNow: search.available || undefined,
        maxPrice: search.maxPrice || undefined,
        query: search.q || undefined,
        sort: search.sort as SortKey,
      }),
    [search],
  );

  const activeSector = sectorBySlug(search.sector);
  const headingSubject =
    td(categoryBySlug(search.category)?.name) || td(activeSector?.name) || t("dir.allActivities");
  const categoryName = headingSubject;
  const place = td(
    locationLabel({
      governorate: search.governorate || undefined,
      city: search.city || undefined,
      area: search.area || undefined,
    }),
  );

  const clear = () => navigate({ to: ".", search: defaultSearch });

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8 lg:py-10">
      <header className="mb-6">
        <h1 className="text-xl font-extrabold text-foreground sm:text-2xl">
          {t("dir.heading.inLocation", { subject: headingSubject, place })}
        </h1>
        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-4 shrink-0" />
          {t("dir.results.count", { count: n(results.length) })}
        </p>

        <div className="mt-4 -mx-4 overflow-x-auto px-4 lg:mx-0 lg:px-0">
          <div className="flex w-max gap-2">
            <Button
              variant={search.sector ? "outline" : "brand"}
              size="sm"
              onClick={() => patch({ sector: "", category: "" })}
            >
              {t("dir.allSectors")}
            </Button>
            {sectors.map((s) => (
              <Button
                key={s.slug}
                variant={search.sector === s.slug ? "brand" : "outline"}
                size="sm"
                onClick={() => patch({ sector: s.slug, category: "" })}
              >
                {td(s.shortName)}
              </Button>
            ))}
          </div>
        </div>
      </header>


      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="card-surface sticky top-20 p-5">
            <FilterPanel filters={search} onChange={patch} onClear={clear} />
          </div>
        </aside>

        <div className="min-w-0">
          <div className="mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden">
                  <SlidersHorizontal className="size-4" />
                  {t("dir.filter")}
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle className="text-right">{t("dir.filterResults")}</SheetTitle>
                </SheetHeader>
                <div className="mt-4">
                  <FilterPanel filters={search} onChange={patch} onClear={clear} />
                </div>
                <Button className="mt-6 w-full" variant="brand" onClick={() => setSheetOpen(false)}>
                  {t("dir.showResults", { count: n(results.length) })}
                </Button>
              </SheetContent>
            </Sheet>
            <div className="hidden lg:block" />

            <Select value={search.sort} onValueChange={(v) => patch({ sort: v })}>
              <SelectTrigger className="w-44" aria-label={t("dir.sortResults")}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((o) => (
                  <SelectItem key={o.key} value={o.key}>
                    {td(o.label)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {results.length > 0 ? (
            <ProviderGrid providers={results} columns={2} />
          ) : (
            <EmptyState
              title={t("dir.emptyTitle")}
              description={t("dir.emptyDescription", { category: categoryName, place })}
              actionLabel={t("dir.clearFilters")}
              onAction={clear}
            >
              <Button asChild variant="soft">
                <Link to="/request-service">{t("dir.sendRequest")}</Link>
              </Button>
            </EmptyState>
          )}
        </div>
      </div>
    </div>
  );
}
