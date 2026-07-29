import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable, type DataTableColumn } from "@/components/common/DataTable";
import { AdminPageHeader } from "../components/AdminPageHeader";
import { Can } from "../components/PermissionGuard";
import { useAuditLogs } from "@/core/hooks/adminQueries";
import { useI18n } from "@/features/i18n/I18nProvider";
import { useLocalized } from "../lib/format";
import { cn } from "@/lib/utils";
import type { AuditLogDTO } from "@/core/types/admin";

const PAGE_SIZE = 8;

/** Immutable audit trail of every admin action. */
export function AdminAuditPage() {
  const { t } = useI18n();
  const L = useLocalized();
  const [severity, setSeverity] = useState("all");
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, isFetching, refetch } = useAuditLogs({
    page,
    pageSize: PAGE_SIZE,
    severity: severity as AuditLogDTO["severity"] | "all",
  });

  const tone: Record<AuditLogDTO["severity"], string> = {
    info: "bg-secondary text-muted-foreground",
    warning: "bg-accent-orange-soft text-accent-orange",
    critical: "bg-destructive/10 text-destructive",
  };

  const columns: DataTableColumn<AuditLogDTO>[] = [
    { id: "time", header: t("adm.audit.col.time"), cell: (row) => <span dir="ltr">{row.createdAt.replace("T", " ").slice(0, 16)}</span> },
    {
      id: "actor",
      header: t("adm.audit.col.actor"),
      cell: (row) => (
        <div className="min-w-0">
          <p className="truncate font-bold text-foreground">{L(row.actorName)}</p>
          <p className="text-xs text-muted-foreground">{row.actorRole}</p>
        </div>
      ),
    },
    {
      id: "action",
      header: t("adm.audit.col.action"),
      cell: (row) => (
        <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-bold", tone[row.severity])}>
          {row.action}
        </span>
      ),
    },
    {
      id: "entity",
      header: t("adm.audit.col.entity"),
      cell: (row) => (
        <div className="min-w-0">
          <p className="truncate text-sm text-foreground">{L(row.entityLabel)}</p>
          <code className="text-[11px] text-muted-foreground">{row.entity}</code>
        </div>
      ),
    },
    {
      id: "change",
      header: t("adm.audit.col.change"),
      cell: (row) =>
        row.field ? (
          <span className="text-xs text-muted-foreground" dir="ltr">
            {row.field}: {row.previousValue ?? "—"} → {row.newValue ?? "—"}
          </span>
        ) : (
          "—"
        ),
    },
    { id: "source", header: t("adm.audit.col.source"), cell: (row) => <span dir="ltr" className="text-xs">{row.ipAddress}</span> },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={t("adm.audit.title")}
        description={t("adm.audit.subtitle")}
        actions={
          <Can permission="reports.export">
            <Button variant="soft" className="gap-2">
              <Download className="size-4" />
              {t("adm.common.export")}
            </Button>
          </Can>
        }
      />
      <DataTable
        columns={columns}
        rows={data?.results ?? []}
        rowKey={(row) => row.id}
        isLoading={isLoading}
        isError={isError}
        isFetching={isFetching}
        onRetry={() => refetch()}
        toolbar={
          <Select value={severity} onValueChange={(v) => { setSeverity(v); setPage(1); }}>
            <SelectTrigger className="w-full sm:w-56">
              <SelectValue placeholder={t("adm.audit.filter.severity")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("adm.common.all")}</SelectItem>
              <SelectItem value="info">{t("adm.audit.severity.info")}</SelectItem>
              <SelectItem value="warning">{t("adm.audit.severity.warning")}</SelectItem>
              <SelectItem value="critical">{t("adm.audit.severity.critical")}</SelectItem>
            </SelectContent>
          </Select>
        }
        pagination={{
          page,
          totalPages: Math.max(1, Math.ceil((data?.count ?? 0) / PAGE_SIZE)),
          count: data?.count ?? 0,
          pageSize: PAGE_SIZE,
          onPageChange: setPage,
        }}
      />
    </div>
  );
}
