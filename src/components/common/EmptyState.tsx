import { SearchX } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  children?: ReactNode;
}

export function EmptyState({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  children,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card px-6 py-14 text-center">
      <div className="mb-4 grid size-14 place-items-center rounded-full bg-secondary text-muted-foreground">
        {icon ?? <SearchX className="size-7" />}
      </div>
      <h3 className="text-lg font-bold text-foreground">{title}</h3>
      {description && (
        <p className="mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button className="mt-5" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
      {children && <div className="mt-5">{children}</div>}
    </div>
  );
}
