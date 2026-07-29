import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GovernorateSelector, ALL_VALUE } from "./GovernorateSelector";
import { CityAreaSelector } from "./CityAreaSelector";
import { categoriesBySector } from "@/mocks/categories";
import { sectors, sectorBySlug } from "@/mocks/sectors";
import { RATING_OPTIONS } from "@/core/constants";
import { formatEGP } from "@/core/utils";
import type { ServicesSearch } from "@/features/services/searchSchema";
import { useI18n } from "@/features/i18n/I18nProvider";

interface FilterPanelProps {
  filters: ServicesSearch;
  onChange: (patch: Partial<ServicesSearch>) => void;
  onClear: () => void;
}

export function FilterPanel({ filters, onChange, onClear }: FilterPanelProps) {
  const { t, td, dir } = useI18n();
  const sectorCategories = categoriesBySector(filters.sector || undefined);
  const categoryLabel = td(sectorBySlug(filters.sector)?.searchLabel) || t("dir.category");

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-foreground">{t("dir.filterResults")}</h2>
        <Button variant="ghost" size="sm" className="text-brand" onClick={onClear}>
          {t("dir.clearAll")}
        </Button>
      </div>

      <div className="space-y-2">
        <Label>{t("dir.sector")}</Label>
        <Select
          value={filters.sector || ALL_VALUE}
          onValueChange={(v) =>
            onChange({ sector: v === ALL_VALUE ? "" : v, category: "" })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder={t("dir.allSectors")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_VALUE}>{t("dir.allSectors")}</SelectItem>
            {sectors.map((s) => (
              <SelectItem key={s.slug} value={s.slug}>
                {td(s.name)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>{categoryLabel}</Label>
        <Select
          value={filters.category || ALL_VALUE}
          onValueChange={(v) => onChange({ category: v === ALL_VALUE ? "" : v })}
        >
          <SelectTrigger>
            <SelectValue placeholder={t("dir.allCategories")} />
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
      </div>

      <Separator />


      <div className="space-y-2">
        <Label>{t("dir.governorate")}</Label>
        <GovernorateSelector
          value={filters.governorate || undefined}
          onChange={(v) => onChange({ governorate: v ?? "", city: "", area: "" })}
        />
        <CityAreaSelector
          governorate={filters.governorate || undefined}
          city={filters.city || undefined}
          area={filters.area || undefined}
          onCityChange={(v) => onChange({ city: v ?? "", area: "" })}
          onAreaChange={(v) => onChange({ area: v ?? "" })}
        />
      </div>

      <Separator />

      <div className="space-y-2">
        <Label>{t("dir.rating")}</Label>
        <Select
          value={String(filters.rating)}
          onValueChange={(v) => onChange({ rating: Number(v) })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {RATING_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={String(o.value)}>
                {td(o.label)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <div className="space-y-3">
        <Label>
          {t("dir.maxPrice")}{" "}
          <span className="font-bold text-foreground">
            {filters.maxPrice ? formatEGP(filters.maxPrice) : t("dir.noLimit")}
          </span>
        </Label>
        <Slider
          dir={dir}
          value={[filters.maxPrice || 5000]}
          min={100}
          max={5000}
          step={100}
          onValueChange={([v]) => onChange({ maxPrice: v >= 5000 ? 0 : v })}
        />
      </div>

      <Separator />

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Checkbox
            id="verified"
            checked={filters.verified}
            onCheckedChange={(c) => onChange({ verified: Boolean(c) })}
          />
          <Label htmlFor="verified" className="cursor-pointer font-normal">
            {t("dir.verifiedOnly")}
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="available"
            checked={filters.available}
            onCheckedChange={(c) => onChange({ available: Boolean(c) })}
          />
          <Label htmlFor="available" className="cursor-pointer font-normal">
            {t("dir.availableNow")}
          </Label>
        </div>
      </div>
    </div>
  );
}
