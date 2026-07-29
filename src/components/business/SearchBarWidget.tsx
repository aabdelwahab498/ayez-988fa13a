import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search, LocateFixed } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GovernorateSelector, ALL_VALUE } from "./GovernorateSelector";
import { useCategories, useCities, useSectors } from "@/core/hooks/queries";
import { defaultSearch } from "@/features/services/searchSchema";
import { useI18n } from "@/features/i18n/I18nProvider";

interface SearchBarWidgetProps {
  defaultSector?: string;
  defaultCategory?: string;
  defaultGovernorate?: string;
  defaultCity?: string;
  variant?: "hero" | "inline";
}

export function SearchBarWidget({
  defaultSector,
  defaultCategory,
  defaultGovernorate,
  defaultCity,
  variant = "hero",
}: SearchBarWidgetProps) {
  const { t, td } = useI18n();
  const navigate = useNavigate();
  const [sector, setSector] = useState<string | undefined>(defaultSector);
  const [category, setCategory] = useState<string | undefined>(defaultCategory);
  const [governorate, setGovernorate] = useState<string | undefined>(defaultGovernorate);
  const [city, setCity] = useState<string | undefined>(defaultCity);

  const { data: sectors = [] } = useSectors();
  const { data: sectorCategories = [] } = useCategories(sector);
  const { data: cities = [] } = useCities(governorate);
  const activeSector = sectors.find((s) => s.slug === sector);
  const categoryLabel = td(activeSector?.searchLabel) || t("dir.whatAreYouLookingFor");

  const submit = () => {
    navigate({
      to: "/services",
      search: {
        ...defaultSearch,
        sector: sector ?? "",
        category: category ?? "",
        governorate: governorate ?? "",
        city: city ?? "",
      },
    });
  };

  return (
    <div
      className={
        variant === "hero"
          ? "rounded-2xl bg-card p-4 text-foreground shadow-elevated sm:p-5"
          : "card-surface p-4"
      }
    >
      <div className="grid gap-3 lg:grid-cols-[1fr_1.2fr_1fr_1fr_auto]">
        <Select
          value={sector ?? ALL_VALUE}
          onValueChange={(v) => {
            setSector(v === ALL_VALUE ? undefined : v);
            setCategory(undefined);
          }}
        >
          <SelectTrigger className="h-12" aria-label={t("dir.sector")}>
            <SelectValue>
              {sector ? td(activeSector?.name) : t("dir.allSectors")}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_VALUE}>{t("dir.allSectors")}</SelectItem>
            {sectors.map((s) => (
              <SelectItem key={s.slug} value={s.slug}>
                {td(s.shortName)} — {td(s.name)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={category ?? ALL_VALUE}
          onValueChange={(v) => setCategory(v === ALL_VALUE ? undefined : v)}
        >
          <SelectTrigger className="h-12" aria-label={categoryLabel}>
            <SelectValue>
              {category
                ? td(sectorCategories.find((c) => c.slug === category)?.name)
                : categoryLabel}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="max-h-72">
            <SelectItem value={ALL_VALUE}>{t("dir.allCategories")}</SelectItem>
            {sectorCategories.map((c) => (
              <SelectItem key={c.slug} value={c.slug}>
                {td(c.name)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <GovernorateSelector
          className="h-12"
          value={governorate}
          onChange={(v) => {
            setGovernorate(v);
            setCity(undefined);
          }}
        />

        <Select
          value={city ?? ALL_VALUE}
          onValueChange={(v) => setCity(v === ALL_VALUE ? undefined : v)}
          disabled={!cities.length}
        >
          <SelectTrigger className="h-12" aria-label={t("dir.cityArea")}>
            <SelectValue>
              {city
                ? td(cities.find((c) => c.slug === city)?.name)
                : cities.length
                  ? t("dir.allCities")
                  : t("dir.cityArea")}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="max-h-72">
            <SelectItem value={ALL_VALUE}>{t("dir.allCities")}</SelectItem>
            {cities.map((c) => (
              <SelectItem key={c.slug} value={c.slug}>
                {td(c.name)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="accent" size="lg" className="h-12 lg:px-8" onClick={submit}>
          <Search className="size-4" />
          {t("dir.searchNow")}
        </Button>
      </div>

      <button
        type="button"
        className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline"
        onClick={() =>
          toast.info(t("dir.geoDisabledTitle"), {
            description: t("dir.geoDisabledDesc"),
          })
        }
      >
        <LocateFixed className="size-4" />
        {t("dir.useCurrentLocation")}
      </button>
    </div>
  );
}
