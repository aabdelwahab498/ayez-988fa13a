import { useState } from "react";
import { Building2, MapPinned, Search, SignalHigh } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DashboardStatCard } from "@/components/common/DashboardStatCard";
import { DataTable, type DataTableColumn } from "@/components/common/DataTable";
import { AdminPageHeader } from "../components/AdminPageHeader";
import { useAdminCoverage } from "@/core/hooks/adminQueries";
import { useI18n } from "@/features/i18n/I18nProvider";
import { useLocalized } from "../lib/format";
import type { LocationCoverageDTO } from "@/core/types/admin";

const PAGE_SIZE = 10;

/** Location management — governorate coverage across the marketplace. */
export function AdminLocationsPage() {
  const { t, n } = useI18n();
  const L = useLocalized();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, isFetching, refetch } = useAdminCoverage({
    search,
    page,
    pageSize: PAGE_SIZE,
  });

  const rows = data?.results ?? [];
  const totals = rows.reduce(
    (acc, row) => ({
      cities: acc.cities + row.citiesCount,
      areas: acc.areas + row.areasCount,
      live: acc.live + (row.active ? 1 : 0),
    }),
    { cities: 0, areas: 0, live: 0 },
  );

  const columns: DataTableColumn<LocationCoverageDTO>[] = [
    {
      id: "name",
      header: t("adm.loc.col.governorate"),
      cell: (row) => (
        <div className="min-w-0">
          <p className="truncate font-bold text-foreground">{L(row.name)}</p>
          <code className="text-xs text-muted-foreground">{row.slug}</code>
        </div>
      ),
    },
    { id: "cities", header: t("adm.loc.col.cities"), cell: (row) => n(row.citiesCount) },
    { id: "areas", header: t("adm.loc.col.areas"), cell: (row) => n(row.areasCount) },
    { id: "providers", header: t("adm.loc.col.providers"), cell: (row) => n(row.providersCount) },
    { id: "requests", header: t("adm.loc.col.requests"), cell: (row) => n(row.requestsCount) },
    {
      id: "status",
      header: t("adm.common.status"),
      cell: (row) => (
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${
            row.active ? "bg-success-soft text-success" : "bg-secondary text-muted-foreground"
          }`}
        >
          {row.active ? t("adm.loc.status.live") : t("adm.loc.status.paused")}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader title={t("adm.loc.title")} description={t("adm.loc.subtitle")} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardStatCard label={t("adm.loc.stat.governorates")} value={data?.count ?? 0} icon={MapPinned} />
        <DashboardStatCard label={t("adm.loc.stat.cities")} value={totals.cities} icon={Building2} tone="orange" />
        <DashboardStatCard label={t("adm.loc.stat.areas")} value={totals.areas} icon={MapPinned} tone="muted" />
        <DashboardStatCard label={t("adm.loc.stat.live")} value={totals.live} icon={SignalHigh} tone="success" />
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        rowKey={(row) => row.id}
        isLoading={isLoading}
        isError={isError}
        isFetching={isFetching}
        onRetry={() => refetch()}
        toolbar={
          <div className="relative w-full sm:max-w-sm">
            <Search className="pointer-events-none absolute inset-y-0 start-3 my-auto size-4 text-muted-foreground" />
            <Input
              className="ps-9"
              value={search}
              placeholder={t("adm.common.search")}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
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
