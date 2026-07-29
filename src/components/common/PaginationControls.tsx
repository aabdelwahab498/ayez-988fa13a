import { ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/features/i18n/I18nProvider";

interface PaginationControlsProps {
  page: number;
  totalPages: number;
  count: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  isFetching?: boolean;
}

/**
 * Server-pagination-ready controls. The component only knows page numbers, so
 * the switch from client slicing to DRF `?page=` needs no change here.
 */
export function PaginationControls({
  page,
  totalPages,
  count,
  pageSize,
  onPageChange,
  isFetching,
}: PaginationControlsProps) {
  const { lang, n } = useI18n();
  const ar = lang === "ar";
  if (totalPages <= 1) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, count);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
  );

  return (
    <nav
      aria-label={ar ? "تصفح النتائج" : "Pagination"}
      className="mt-8 flex flex-col items-center justify-between gap-3 sm:flex-row"
    >
      <p className="text-sm text-muted-foreground">
        {ar
          ? `عرض ${n(from)}–${n(to)} من ${n(count)}`
          : `Showing ${n(from)}–${n(to)} of ${n(count)}`}
      </p>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          aria-label={ar ? "السابق" : "Previous"}
          disabled={page <= 1 || isFetching}
          onClick={() => onPageChange(page - 1)}
        >
          {ar ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
        </Button>
        {pages.map((p, idx) => (
          <span key={p} className="flex items-center">
            {idx > 0 && p - pages[idx - 1] > 1 && (
              <span className="px-1 text-muted-foreground">…</span>
            )}
            <Button
              variant={p === page ? "default" : "outline"}
              size="icon"
              aria-current={p === page ? "page" : undefined}
              disabled={isFetching}
              onClick={() => onPageChange(p)}
            >
              {n(p)}
            </Button>
          </span>
        ))}
        <Button
          variant="outline"
          size="icon"
          aria-label={ar ? "التالي" : "Next"}
          disabled={page >= totalPages || isFetching}
          onClick={() => onPageChange(page + 1)}
        >
          {ar ? <ChevronLeft className="size-4" /> : <ChevronRight className="size-4" />}
        </Button>
      </div>
    </nav>
  );
}
