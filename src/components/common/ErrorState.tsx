import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ErrorState({
  title = "حدث خطأ غير متوقع",
  description = "تعذر تحميل البيانات في الوقت الحالي، برجاء المحاولة مرة أخرى.",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-destructive/20 bg-card px-6 py-12 text-center">
      <div className="mb-4 grid size-14 place-items-center rounded-full bg-destructive/10 text-destructive">
        <AlertTriangle className="size-7" />
      </div>
      <h3 className="text-lg font-bold text-foreground">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
      {onRetry && (
        <Button variant="outline" className="mt-5" onClick={onRetry}>
          إعادة المحاولة
        </Button>
      )}
    </div>
  );
}
