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
import { governorates } from "@/mocks/locations";
import { categories } from "@/mocks/categories";

interface SearchBarWidgetProps {
  defaultCategory?: string;
  defaultGovernorate?: string;
  defaultCity?: string;
  variant?: "hero" | "inline";
}

export function SearchBarWidget({
  defaultCategory,
  defaultGovernorate,
  defaultCity,
  variant = "hero",
}: SearchBarWidgetProps) {
  const navigate = useNavigate();
  const [category, setCategory] = useState<string | undefined>(defaultCategory);
  const [governorate, setGovernorate] = useState<string | undefined>(defaultGovernorate);
  const [city, setCity] = useState<string | undefined>(defaultCity);

  const cities = governorates.find((g) => g.slug === governorate)?.cities ?? [];

  const submit = () => {
    navigate({
      to: "/services",
      search: {
        category: category ?? "",
        governorate: governorate ?? "",
        city: city ?? "",
        area: "",
        rating: 0,
        verified: false,
        available: false,
        maxPrice: 0,
        sort: "relevance",
        q: "",
      },
    });
  };

  return (
    <div
      className={
        variant === "hero"
          ? "rounded-2xl bg-card p-4 shadow-elevated sm:p-5"
          : "card-surface p-4"
      }
    >
      <div className="grid gap-3 lg:grid-cols-[1.2fr_1fr_1fr_auto]">
        <Select
          value={category ?? ALL_VALUE}
          onValueChange={(v) => setCategory(v === ALL_VALUE ? undefined : v)}
        >
          <SelectTrigger className="h-12" aria-label="نوع الخدمة">
            <SelectValue placeholder="ما هي الخدمة التي تحتاجها؟" />
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
          <SelectTrigger className="h-12" aria-label="المدينة أو المنطقة">
            <SelectValue placeholder={cities.length ? "كل المدن" : "المدينة / المنطقة"} />
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

        <Button variant="accent" size="lg" className="h-12 lg:px-8" onClick={submit}>
          <Search className="size-4" />
          ابحث الآن
        </Button>
      </div>

      <button
        type="button"
        className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline"
        onClick={() =>
          toast.info("تحديد الموقع الحالي غير مفعّل في النسخة التجريبية", {
            description: "سيتم ربطه لاحقًا بخدمة تحديد المواقع.",
          })
        }
      >
        <LocateFixed className="size-4" />
        استخدم موقعي الحالي
      </button>
    </div>
  );
}
