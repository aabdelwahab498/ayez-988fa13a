import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { governorates } from "@/mocks/locations";
import { ALL_VALUE } from "./GovernorateSelector";

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
  const gov = governorates.find((g) => g.slug === governorate);
  const cities = gov?.cities ?? [];
  const areas = cities.find((c) => c.slug === city)?.areas ?? [];

  return (
    <div className={className}>
      <div className="grid gap-3 sm:grid-cols-2">
        <Select
          value={city ?? ALL_VALUE}
          onValueChange={(v) => onCityChange(v === ALL_VALUE ? undefined : v)}
          disabled={!gov}
        >
          <SelectTrigger aria-label="اختر المدينة">
            <SelectValue placeholder={gov ? "كل المدن" : "اختر المحافظة أولًا"} />
          </SelectTrigger>
          <SelectContent className="max-h-72">
            <SelectItem value={ALL_VALUE}>كل المدن</SelectItem>
            {cities.map((c) => (
              <SelectItem key={c.slug} value={c.slug}>
                {c.name}
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
            <SelectTrigger aria-label="اختر المنطقة">
              <SelectValue placeholder={areas.length ? "كل المناطق" : "المنطقة (اختياري)"} />
            </SelectTrigger>
            <SelectContent className="max-h-72">
              <SelectItem value={ALL_VALUE}>كل المناطق</SelectItem>
              {areas.map((a) => (
                <SelectItem key={a.slug} value={a.slug}>
                  {a.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  );
}
