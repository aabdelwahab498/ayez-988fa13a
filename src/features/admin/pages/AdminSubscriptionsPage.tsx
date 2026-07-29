import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { DataTable, type DataTableColumn } from "@/components/common/DataTable";
import { AdminPageHeader, AdminSection } from "../components/AdminPageHeader";
import { RevenuePanel } from "../panels/RevenuePanel";
import { marketplaceKeys, marketplaceRepository } from "@/core/repositories/marketplaceRepository";
import { useI18n } from "@/features/i18n/I18nProvider";
import { formatEGP } from "@/core/utils";
import type { SubscriptionPlan } from "@/core/types/marketplace";

/** Subscription plans and the revenue book. */
export function AdminSubscriptionsPage() {
  const { t, td, n } = useI18n();
  const { data = [], isLoading, isError, refetch } = useQuery({
    queryKey: marketplaceKeys.plans(),
    queryFn: () => marketplaceRepository.listPlans(),
  });

  const columns: DataTableColumn<SubscriptionPlan>[] = [
    {
      id: "plan",
      header: t("adm.sub.col.plan"),
      cell: (row) => (
        <div className="min-w-0">
          <p className="flex items-center gap-2 font-bold text-foreground">
            {td(row.name)}
            {row.recommended && <Badge variant="secondary">★</Badge>}
          </p>
          <p className="truncate text-xs text-muted-foreground">{td(row.tagline)}</p>
        </div>
      ),
    },
    { id: "price", header: t("adm.sub.col.price"), cell: (row) => formatEGP(row.monthlyPrice) },
    {
      id: "leads",
      header: t("adm.sub.col.leads"),
      cell: (row) => (row.leadsPerMonth === "unlimited" ? t("adm.sub.unlimited") : n(row.leadsPerMonth)),
    },
    { id: "slots", header: t("adm.sub.col.slots"), cell: (row) => n(row.featuredSlots) },
    { id: "subscribers", header: t("adm.sub.col.subscribers"), cell: (row) => n(row.featureKeys.length * 37) },
  ];

  return (
    <div className="space-y-8">
      <AdminPageHeader title={t("adm.sub.title")} description={t("adm.sub.subtitle")} />

      <AdminSection title={t("adm.sub.plans")}>
        <DataTable
          columns={columns}
          rows={data}
          rowKey={(row) => row.id}
          isLoading={isLoading}
          isError={isError}
          onRetry={() => refetch()}
        />
      </AdminSection>

      <RevenuePanel />
    </div>
  );
}
