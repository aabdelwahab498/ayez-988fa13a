import { useI18n } from "@/features/i18n/I18nProvider";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function DashboardStatCard({
  label,
  value,
  icon: Icon,
  hint,
  tone = "brand",
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  hint?: string;
  tone?: "brand" | "orange" | "success" | "muted";
}) {
  const { n } = useI18n();
  const tones = {
    brand: "bg-brand-soft text-brand",
    orange: "bg-accent-orange-soft text-accent-orange",
    success: "bg-success-soft text-success",
    muted: "bg-secondary text-muted-foreground",
  } as const;

  return (
    <div className="card-surface p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-extrabold text-foreground">
            {typeof value === "number" ? n(value) : value}
          </p>
          {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
        </div>
        <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl", tones[tone])}>
          <Icon className="size-5" />
        </span>
      </div>
    </div>
  );
}
