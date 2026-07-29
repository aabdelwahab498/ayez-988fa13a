import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { governorates } from "@/mocks/locations";

export const ALL_VALUE = "__all__";

export function GovernorateSelector({
  value,
  onChange,
  placeholder = "كل المحافظات",
  className,
}: {
  value?: string;
  onChange: (value?: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <Select
      value={value ?? ALL_VALUE}
      onValueChange={(v) => onChange(v === ALL_VALUE ? undefined : v)}
    >
      <SelectTrigger className={className} aria-label="اختر المحافظة">
        <SelectValue>
          {governorates.find((g) => g.slug === value)?.name ?? placeholder}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="max-h-72">
        <SelectItem value={ALL_VALUE}>{placeholder}</SelectItem>
        {governorates.map((g) => (
          <SelectItem key={g.slug} value={g.slug}>
            {g.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
