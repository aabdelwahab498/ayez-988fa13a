import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export function RequestStepper({
  steps,
  current,
  className,
}: {
  steps: string[];
  current: number;
  className?: string;
}) {
  return (
    <ol className={cn("flex items-center gap-1 sm:gap-2", className)}>
      {steps.map((step, index) => {
        const done = index < current;
        const active = index === current;
        return (
          <li key={step} className="flex flex-1 items-center gap-1 sm:gap-2">
            <div className="flex min-w-0 flex-col items-center gap-1.5 sm:flex-row sm:gap-2">
              <span
                className={cn(
                  "grid size-7 shrink-0 place-items-center rounded-full border text-xs font-bold transition-colors sm:size-8",
                  done && "border-success bg-success text-primary-foreground",
                  active && "border-brand bg-brand text-brand-foreground",
                  !done && !active && "border-border bg-card text-muted-foreground",
                )}
              >
                {done ? <Check className="size-4" /> : index + 1}
              </span>
              <span
                className={cn(
                  "truncate text-[11px] font-medium sm:text-sm",
                  active ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <span
                className={cn(
                  "h-0.5 flex-1 rounded-full",
                  done ? "bg-success" : "bg-border",
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
