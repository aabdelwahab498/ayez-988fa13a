import { MapPin, Globe2 } from "lucide-react";
import type { ServiceCoverage } from "@/core/types";
import { cn } from "@/lib/utils";
import { useI18n } from "@/features/i18n/I18nProvider";

export function ServiceCoverageBadge({
  coverage,
  className,
}: {
  coverage: ServiceCoverage;
  className?: string;
}) {
  const { lang, td } = useI18n();
  const nationwide = coverage.scope === "nationwide";
  const Icon = nationwide ? Globe2 : MapPin;

  const label =
    lang === "ar"
      ? coverage.label
      : coverage.label.startsWith("يخدم:")
        ? `Serves: ${td(coverage.label.replace("يخدم:", "").trim())}`
        : td(coverage.label);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium",
        nationwide
          ? "border-accent-orange/30 bg-accent-orange-soft text-accent-orange"
          : "border-border bg-secondary text-secondary-foreground",
        className,
      )}
    >
      <Icon className="size-3.5 shrink-0" />
      <span className="truncate">{label}</span>
    </span>
  );
}
