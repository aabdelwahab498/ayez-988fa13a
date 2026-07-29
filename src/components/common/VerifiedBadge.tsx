import { BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function VerifiedBadge({
  className,
  withLabel = true,
}: {
  className?: string;
  withLabel?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-success-soft px-2 py-0.5 text-xs font-bold text-success",
        className,
      )}
      title="مقدم خدمة موثق"
    >
      <BadgeCheck className="size-3.5" />
      {withLabel && "موثق"}
    </span>
  );
}
