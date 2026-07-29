import { BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/features/i18n/I18nProvider";

export function VerifiedBadge({
  className,
  withLabel = true,
}: {
  className?: string;
  withLabel?: boolean;
}) {
  const { t } = useI18n();
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-success-soft px-2 py-0.5 text-xs font-bold text-success",
        className,
      )}
      title={t("dir.verifiedProvider")}
    >
      <BadgeCheck className="size-3.5" />
      {withLabel && t("dir.verified")}
    </span>
  );
}
