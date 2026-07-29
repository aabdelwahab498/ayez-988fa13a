import type { RequestStatus } from "@/core/types";
import { STATUS_LABELS } from "@/core/constants";
import { cn } from "@/lib/utils";

const styles: Record<RequestStatus, string> = {
  new: "bg-accent-orange-soft text-accent-orange border-accent-orange/25",
  in_contact: "bg-brand-soft text-brand border-brand/20",
  completed: "bg-success-soft text-success border-success/25",
  cancelled: "bg-muted text-muted-foreground border-border",
};

export function StatusBadge({
  status,
  className,
}: {
  status: RequestStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold",
        styles[status],
        className,
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
