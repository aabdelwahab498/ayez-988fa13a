import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable, type DataTableColumn } from "@/components/common/DataTable";
import { AdminPageHeader, AdminSection } from "../components/AdminPageHeader";
import { Can } from "../components/PermissionGuard";
import { LeadsPanel } from "../panels/LeadsPanel";
import { useDisputes } from "@/core/hooks/adminQueries";
import { useI18n } from "@/features/i18n/I18nProvider";
import { useLocalized } from "../lib/format";
import { formatEGP } from "@/core/utils";
import { cn } from "@/lib/utils";
import type { DisputeDTO } from "@/core/types/admin";

/** Requests & disputes moderation queue. */
export function AdminRequestsPage() {
  const { t, n } = useI18n();
  const L = useLocalized();
  const { data = [], isLoading, isError, refetch } = useDisputes();

  const tone: Record<DisputeDTO["status"], string> = {
    open: "bg-accent-orange-soft text-accent-orange",
    investigating: "bg-brand-soft text-brand",
    resolved: "bg-success-soft text-success",
    escalated: "bg-destructive/10 text-destructive",
  };

  const columns: DataTableColumn<DisputeDTO>[] = [
    {
      id: "reference",
      header: t("adm.req.col.reference"),
      cell: (row) => <span className="font-mono text-xs font-bold text-foreground">{row.reference}</span>,
    },
    { id: "request", header: t("adm.req.col.request"), cell: (row) => <span className="font-mono text-xs">{row.requestReference}</span> },
    { id: "customer", header: t("adm.req.col.customer"), cell: (row) => L(row.customerName) },
    { id: "provider", header: t("adm.req.col.provider"), cell: (row) => L(row.providerName) },
    { id: "reason", header: t("adm.req.col.reason"), cell: (row) => <span className="text-muted-foreground">{L(row.reason)}</span> },
    { id: "amount", header: t("adm.req.col.amount"), cell: (row) => formatEGP(row.amount) },
    {
      id: "sla",
      header: t("adm.req.col.sla"),
      cell: (row) =>
        row.slaHoursLeft <= 0 ? (
          <span className="font-bold text-destructive">{t("adm.req.sla.breached")}</span>
        ) : (
          <span className={cn(row.slaHoursLeft < 6 && "font-bold text-accent-orange")}>
            {n(row.slaHoursLeft)} {t("adm.req.sla.hours")}
          </span>
        ),
    },
    {
      id: "status",
      header: t("adm.common.status"),
      cell: (row) => (
        <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-bold", tone[row.status])}>
          {t(`adm.req.status.${row.status}`)}
        </span>
      ),
    },
    {
      id: "actions",
      header: t("adm.common.actions"),
      cell: () => (
        <Can permission="requests.manage">
          <Button size="sm" variant="ghost">
            {t("adm.req.resolve")}
          </Button>
        </Can>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={t("adm.req.title")}
        description={t("adm.req.subtitle")}
        actions={<Badge variant="secondary">{n(data.length)}</Badge>}
      />

      <Tabs defaultValue="disputes">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="disputes">{t("adm.req.tab.disputes")}</TabsTrigger>
          <TabsTrigger value="routing">{t("adm.req.tab.routing")}</TabsTrigger>
        </TabsList>

        <TabsContent value="disputes" className="mt-6">
          <AdminSection title={t("adm.req.disputes.title")}>
            <DataTable
              columns={columns}
              rows={data}
              rowKey={(row) => row.id}
              isLoading={isLoading}
              isError={isError}
              onRetry={() => refetch()}
            />
          </AdminSection>
        </TabsContent>

        <TabsContent value="routing" className="mt-6">
          <LeadsPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}
