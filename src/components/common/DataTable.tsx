import type { ReactNode } from "react";
import { ArrowUpDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { TableSkeleton } from "./Skeletons";
import { EmptyState } from "./EmptyState";
import { ErrorState } from "./ErrorState";
import { PaginationControls } from "./PaginationControls";
import { useI18n } from "@/features/i18n/I18nProvider";

export interface DataTableColumn<T> {
  id: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  /** Enables the sort toggle in the header cell. */
  sortable?: boolean;
  className?: string;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  isLoading?: boolean;
  isError?: boolean;
  isFetching?: boolean;
  onRetry?: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
  caption?: string;
  /** Server-ready pagination; omit for non-paginated tables. */
  pagination?: {
    page: number;
    totalPages: number;
    count: number;
    pageSize: number;
    onPageChange: (page: number) => void;
  };
  sort?: { by: string; dir: "asc" | "desc"; onChange: (by: string) => void };
  toolbar?: ReactNode;
}

/**
 * Shared enterprise table: loading, empty, error + retry, sorting and
 * pagination are handled once, so every admin/dashboard table behaves the same
 * and is ready for server-side paging.
 */
export function DataTable<T>({
  columns,
  rows,
  rowKey,
  isLoading,
  isError,
  isFetching,
  onRetry,
  emptyTitle,
  emptyDescription,
  caption,
  pagination,
  sort,
  toolbar,
}: DataTableProps<T>) {
  const { lang } = useI18n();
  const ar = lang === "ar";

  return (
    <div>
      {toolbar && <div className="mb-3 flex flex-wrap items-center gap-2">{toolbar}</div>}
      <div className="card-surface overflow-x-auto">
        {isLoading ? (
          <TableSkeleton columns={columns.length} />
        ) : isError ? (
          <div className="p-4">
            <ErrorState
              title={ar ? "تعذّر تحميل الجدول" : "Couldn't load this table"}
              description={
                ar
                  ? "حدث خطأ أثناء الاتصال بالخادم، برجاء إعادة المحاولة."
                  : "A server error occurred while loading rows."
              }
              onRetry={onRetry}
            />
          </div>
        ) : rows.length === 0 ? (
          <div className="p-4">
            <EmptyState
              title={emptyTitle ?? (ar ? "لا توجد بيانات" : "No data")}
              description={
                emptyDescription ??
                (ar ? "لا توجد سجلات مطابقة للفلاتر الحالية." : "No records match the current filters.")
              }
            />
          </div>
        ) : (
          <Table>
            {caption && <caption className="sr-only">{caption}</caption>}
            <TableHeader>
              <TableRow>
                {columns.map((col) => (
                  <TableHead key={col.id} className={col.className} scope="col">
                    {col.sortable && sort ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="-mx-2 h-8 gap-1 px-2 font-semibold"
                        onClick={() => sort.onChange(col.id)}
                        aria-label={ar ? "ترتيب" : "Sort"}
                      >
                        {col.header}
                        <ArrowUpDown className="size-3.5 opacity-60" />
                      </Button>
                    ) : (
                      col.header
                    )}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className={isFetching ? "opacity-60 transition-opacity" : undefined}>
              {rows.map((row) => (
                <TableRow key={rowKey(row)}>
                  {columns.map((col) => (
                    <TableCell key={col.id} className={col.className}>
                      {col.cell(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
      {pagination && !isLoading && !isError && rows.length > 0 && (
        <PaginationControls {...pagination} isFetching={isFetching} />
      )}
    </div>
  );
}
