import { Skeleton } from "@/components/ui/skeleton";

export function LoadingState({
  count = 6,
  label = "جارٍ تحميل النتائج...",
}: {
  count?: number;
  label?: string;
}) {
  return (
    <div>
      <p className="mb-4 text-sm text-muted-foreground">{label}</p>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="card-surface p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="size-14 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </div>
            <Skeleton className="mt-4 h-3 w-full" />
            <Skeleton className="mt-2 h-3 w-4/5" />
            <Skeleton className="mt-4 h-9 w-full rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
