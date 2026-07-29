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
import { categories } from "@/mocks/categories";
import { RATING_OPTIONS } from "@/core/constants";
import { formatEGP } from "@/core/utils";
import type { ServicesSearch } from "@/features/services/searchSchema";

interface FilterPanelProps {
  filters: ServicesSearch;
  onChange: (patch: Partial<ServicesSearch>) => void;
  onClear: () => void;
}

export function FilterPanel({ filters, onChange, onClear }: FilterPanelProps) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-foreground">تصفية النتائج</h2>
        <Button variant="ghost" size="sm" className="text-brand" onClick={onClear}>
          مسح الكل
        </Button>
      </div>

      <div className="space-y-2">
        <Label>نوع الخدمة</Label>
        <Select
          value={filters.category || ALL_VALUE}
          onValueChange={(v) => onChange({ category: v === ALL_VALUE ? "" : v })}
        >
          <SelectTrigger>
            <SelectValue placeholder="كل الخدمات" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_VALUE}>كل الخدمات</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.slug} value={c.slug}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <div className="space-y-2">
        <Label>المحافظة</Label>
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
        <Label>التقييم</Label>
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
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <div className="space-y-3">
        <Label>
          الحد الأقصى لسعر البداية:{" "}
          <span className="font-bold text-foreground">
            {filters.maxPrice ? formatEGP(filters.maxPrice) : "بدون حد"}
          </span>
        </Label>
        <Slider
          dir="rtl"
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
            مقدمو خدمة موثقون فقط
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="available"
            checked={filters.available}
            onCheckedChange={(c) => onChange({ available: Boolean(c) })}
          />
          <Label htmlFor="available" className="cursor-pointer font-normal">
            متاح الآن
          </Label>
        </div>
      </div>
    </div>
  );
}
