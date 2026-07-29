import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "./EmptyState";
import { ErrorState } from "./ErrorState";
import { useI18n } from "@/features/i18n/I18nProvider";

interface QueryBoundaryProps {
  isLoading: boolean;
  isError: boolean;
  isEmpty?: boolean;
  onRetry?: () => void;
  skeleton: ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;
  children: ReactNode;
}

/**
 * Uniform loading / error / empty handling for every data-driven surface.
 * Keeps pages free of `isLoading ? ... : ...` ladders and guarantees the same
 * UX once real API latency and failures arrive.
 */
export function QueryBoundary({
  isLoading,
  isError,
  isEmpty,
  onRetry,
  skeleton,
  emptyTitle,
  emptyDescription,
  emptyAction,
  children,
}: QueryBoundaryProps) {
  const { lang } = useI18n();
  const ar = lang === "ar";

  if (isLoading) return <>{skeleton}</>;

  if (isError) {
    return (
      <ErrorState
        title={ar ? "تعذّر تحميل البيانات" : "We couldn't load this data"}
        description={
          ar
            ? "حدث خطأ في الاتصال بالخادم. تحقق من الإنترنت ثم أعد المحاولة."
            : "A network error occurred. Check your connection and try again."
        }
        onRetry={onRetry}
      />
    );
  }

  if (isEmpty) {
    return (
      <EmptyState
        title={emptyTitle ?? (ar ? "لا توجد نتائج" : "No results")}
        description={
          emptyDescription ??
          (ar ? "لم نعثر على بيانات مطابقة حتى الآن." : "Nothing matched your criteria yet.")
        }
      >
        {emptyAction}
      </EmptyState>
    );
  }

  return <>{children}</>;
}

/** Small inline retry used inside compact widgets. */
export function InlineRetry({ onRetry }: { onRetry?: () => void }) {
  const { lang } = useI18n();
  return (
    <div className="flex items-center justify-between rounded-lg border border-destructive/20 bg-card px-4 py-3 text-sm">
      <span className="text-muted-foreground">
        {lang === "ar" ? "تعذّر التحميل" : "Failed to load"}
      </span>
      {onRetry && (
        <Button size="sm" variant="outline" onClick={onRetry}>
          {lang === "ar" ? "إعادة المحاولة" : "Retry"}
        </Button>
      )}
    </div>
  );
}
