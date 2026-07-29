import { useState } from "react";
import { Users, Briefcase, Inbox, Star, MapPinned } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DashboardStatCard } from "@/components/common/DashboardStatCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { VerifiedBadge } from "@/components/common/VerifiedBadge";
import { DataTable, type DataTableColumn } from "@/components/common/DataTable";
import { ListSkeleton, StatsSkeleton } from "@/components/common/Skeletons";
import { QueryBoundary } from "@/components/common/QueryBoundary";
import { useAdminOverview, useGovernorates, useProviderSearch } from "@/core/hooks/queries";
import type { Provider, SortKey } from "@/core/types";
import { formatArabicDate } from "@/core/utils";
import { useI18n } from "@/features/i18n/I18nProvider";

/** Admin › Overview — platform KPIs, provider moderation table and coverage. */
export function OverviewPanel() {
  const { t, td, n } = useI18n();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<{ by: string; dir: "asc" | "desc" }>({
    by: "rating",
    dir: "desc",
  });

  const overview = useAdminOverview();
  const { data: governorates = [] } = useGovernorates();
  const providersQuery = useProviderSearch({
    query: search || undefined,
    sort: (sort.by === "rating" ? "rating" : "reviews") as SortKey,
    page,
    pageSize: 8,
  });

  const stats = overview.data?.stats;
  const providersPage = providersQuery.data;

  const columns: DataTableColumn<Provider>[] = [
    {
      id: "name",
      header: t("dash.admin.providers.col.name"),
      cell: (p) => <span className="font-semibold text-foreground">{td(p.name)}</span>,
    },
    {
      id: "rating",
      header: t("dash.admin.providers.col.rating"),
      sortable: true,
      cell: (p) => p.rating.toFixed(1),
    },
    {
      id: "completedJobs",
      header: t("dash.admin.providers.col.completedJobs"),
      sortable: true,
      cell: (p) => n(p.completedJobs),
    },
    {
      id: "verification",
      header: t("dash.admin.providers.col.verification"),
      cell: (p) =>
        p.verified ? (
          <VerifiedBadge />
        ) : (
          <span className="text-xs text-muted-foreground">
            {t("dash.admin.providers.pendingReview")}
          </span>
        ),
    },
    {
      id: "action",
      header: t("dash.admin.providers.col.action"),
      cell: () => (
        <Button size="sm" variant="soft">
          {t("dash.admin.providers.review")}
        </Button>
      ),
    },
  ];

  return (
    <>
      <QueryBoundary
        isLoading={overview.isPending}
        isError={overview.isError}
        onRetry={() => overview.refetch()}
        skeleton={<StatsSkeleton count={5} />}
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <DashboardStatCard label={t("dash.admin.stat.users")} value={stats?.users ?? 0} icon={Users} />
          <DashboardStatCard
            label={t("dash.admin.stat.providers")}
            value={stats?.providers ?? 0}
            icon={Briefcase}
            tone="orange"
          />
          <DashboardStatCard
            label={t("dash.admin.stat.newRequests")}
            value={stats?.newRequests ?? 0}
            icon={Inbox}
            tone="success"
          />
          <DashboardStatCard
            label={t("dash.admin.stat.reviews")}
            value={stats?.reviews ?? 0}
            icon={Star}
            tone="muted"
          />
          <DashboardStatCard
            label={t("dash.admin.stat.activeGovernorates")}
            value={stats?.activeGovernorates ?? 0}
            icon={MapPinned}
          />
        </div>
      </QueryBoundary>

      <section className="mt-8">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <h2 className="min-w-0 truncate text-lg font-extrabold text-foreground">
            {t("dash.admin.providers.title")}
          </h2>
          <Input
            className="w-44 sm:w-64"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder={t("dash.admin.providers.searchPlaceholder")}
            aria-label={t("dash.admin.providers.searchAria")}
          />
        </div>
        <div className="mt-4">
          <DataTable
            columns={columns}
            rows={providersPage?.results ?? []}
            rowKey={(p) => p.id}
            isLoading={providersQuery.isPending}
            isError={providersQuery.isError}
            isFetching={providersQuery.isFetching}
            onRetry={() => providersQuery.refetch()}
            caption={t("dash.admin.providers.title")}
            sort={{
              ...sort,
              onChange: (by) =>
                setSort((prev) => ({
                  by,
                  dir: prev.by === by && prev.dir === "desc" ? "asc" : "desc",
                })),
            }}
            pagination={
              providersPage
                ? {
                    page: providersPage.page,
                    totalPages: providersPage.totalPages,
                    count: providersPage.count,
                    pageSize: providersPage.pageSize,
                    onPageChange: setPage,
                  }
                : undefined
            }
          />
        </div>
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section>
          <h2 className="text-lg font-extrabold text-foreground">
            {t("dash.admin.recentRequests.title")}
          </h2>
          <QueryBoundary
            isLoading={overview.isPending}
            isError={overview.isError}
            onRetry={() => overview.refetch()}
            skeleton={<div className="mt-4"><ListSkeleton count={4} /></div>}
          >
            <div className="mt-4 space-y-3">
              {(overview.data?.requests ?? []).slice(0, 4).map((r) => (
                <div key={r.id} className="card-surface p-4">
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-bold text-foreground">
                        {td(r.categoryName)} — {td(r.locationLabel)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {r.reference} • {formatArabicDate(r.createdAt)}
                      </p>
                    </div>
                    <StatusBadge status={r.status} />
                  </div>
                </div>
              ))}
            </div>
          </QueryBoundary>
        </section>

        <section>
          <h2 className="text-lg font-extrabold text-foreground">
            {t("dash.admin.coverageByGovernorate.title")}
          </h2>
          <div className="card-surface mt-4 divide-y divide-border">
            {governorates.slice(0, 6).map((g, i) => (
              <div key={g.id} className="flex items-center justify-between gap-4 p-4">
                <span className="min-w-0 truncate font-semibold text-foreground">{td(g.name)}</span>
                <span className="shrink-0 text-sm text-muted-foreground">
                  {t("dash.admin.coverageByGovernorate.providerCount", {
                    count: n((providersPage?.count ?? 0) * (6 - i) + 12),
                  })}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
