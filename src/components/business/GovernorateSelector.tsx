import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { governorates } from "@/mocks/locations";
import { useI18n } from "@/features/i18n/I18nProvider";

export const ALL_VALUE = "__all__";

export function GovernorateSelector({
  value,
  onChange,
  placeholder,
  className,
}: {
  value?: string;
  onChange: (value?: string) => void;
  placeholder?: string;
  className?: string;
}) {
  const { t, td } = useI18n();
  const allLabel = placeholder ?? t("dir.allGovernorates");

  return (
    <Select
      value={value ?? ALL_VALUE}
      onValueChange={(v) => onChange(v === ALL_VALUE ? undefined : v)}
    >
      <SelectTrigger className={className} aria-label={t("dir.selectGovernorate")}>
        <SelectValue>
          {td(governorates.find((g) => g.slug === value)?.name) || allLabel}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="max-h-72">
        <SelectItem value={ALL_VALUE}>{allLabel}</SelectItem>
        {governorates.map((g) => (
          <SelectItem key={g.slug} value={g.slug}>
            {td(g.name)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
