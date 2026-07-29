import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ALL_VALUE } from "./GovernorateSelector";
import { useAreas, useCities } from "@/core/hooks/queries";
import { useI18n } from "@/features/i18n/I18nProvider";

export function CityAreaSelector({
  governorate,
  city,
  area,
  onCityChange,
  onAreaChange,
  showArea = true,
  className,
}: {
  governorate?: string;
  city?: string;
  area?: string;
  onCityChange: (value?: string) => void;
  onAreaChange?: (value?: string) => void;
  showArea?: boolean;
  className?: string;
}) {
  const { t, td } = useI18n();
  const { data: cities = [] } = useCities(governorate);
  const { data: areas = [] } = useAreas(governorate, city);

  return (
    <div className={className}>
      <div className="grid gap-3 sm:grid-cols-2">
        <Select
          value={city ?? ALL_VALUE}
          onValueChange={(v) => onCityChange(v === ALL_VALUE ? undefined : v)}
          disabled={!governorate}
        >
          <SelectTrigger aria-label={t("dir.selectCity")}>
            <SelectValue
              placeholder={governorate ? t("dir.allCities") : t("dir.chooseGovernorateFirst")}
            />
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

        {showArea && onAreaChange && (
          <Select
            value={area ?? ALL_VALUE}
            onValueChange={(v) => onAreaChange(v === ALL_VALUE ? undefined : v)}
            disabled={!areas.length}
          >
            <SelectTrigger aria-label={t("dir.selectArea")}>
              <SelectValue
                placeholder={areas.length ? t("dir.allAreas") : t("dir.areaOptional")}
              />
            </SelectTrigger>
            <SelectContent className="max-h-72">
              <SelectItem value={ALL_VALUE}>{t("dir.allAreas")}</SelectItem>
              {areas.map((a) => (
                <SelectItem key={a.slug} value={a.slug}>
                  {td(a.name)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  );
}
