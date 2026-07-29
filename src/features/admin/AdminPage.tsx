import { Users, Briefcase, Inbox, Star, MapPinned } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DashboardStatCard } from "@/components/common/DashboardStatCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { VerifiedBadge } from "@/components/common/VerifiedBadge";
import { adminStats, customerRequests } from "@/mocks/requests";
import { providers } from "@/mocks/providers";
import { governorates } from "@/mocks/locations";
import { formatArabicDate } from "@/core/utils";
import { useI18n } from "@/features/i18n/I18nProvider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LeadsPanel } from "@/features/admin/panels/LeadsPanel";
import { RevenuePanel } from "@/features/admin/panels/RevenuePanel";
import { ApprovalsPanel } from "@/features/admin/panels/ApprovalsPanel";
import { CampaignsPanel } from "@/features/admin/panels/CampaignsPanel";


export function AdminPage() {
  const { t, td, n } = useI18n();
  const topGovernorates = governorates.slice(0, 6);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8 lg:py-12">
      <header>
        <h1 className="text-xl font-extrabold text-foreground sm:text-2xl">{t("dash.admin.title")}</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">{t("dash.admin.subtitle")}</p>
      </header>

      <Tabs defaultValue="overview" className="mt-6">
        <TabsList className="flex w-full flex-wrap justify-start gap-1 overflow-x-auto">
          {(
            [
              ["overview", "mkt.admin.tab.overview"],
              ["leads", "mkt.admin.tab.leads"],
              ["revenue", "mkt.admin.tab.revenue"],
              ["approvals", "mkt.admin.tab.approvals"],
              ["campaigns", "mkt.admin.tab.campaigns"],
            ] as const
          ).map(([value, key]) => (
            <TabsTrigger key={value} value={value}>
              {t(key)}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="mt-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

        <DashboardStatCard label={t("dash.admin.stat.users")} value={adminStats.users} icon={Users} />
        <DashboardStatCard
          label={t("dash.admin.stat.providers")}
          value={adminStats.providers}
          icon={Briefcase}
          tone="orange"
        />
        <DashboardStatCard
          label={t("dash.admin.stat.newRequests")}
          value={adminStats.newRequests}
          icon={Inbox}
          tone="success"
        />
        <DashboardStatCard
          label={t("dash.admin.stat.reviews")}
          value={adminStats.reviews}
          icon={Star}
          tone="muted"
        />
        <DashboardStatCard
          label={t("dash.admin.stat.activeGovernorates")}
          value={adminStats.activeGovernorates}
          icon={MapPinned}
        />
      </div>

      <section className="mt-8">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <h2 className="min-w-0 truncate text-lg font-extrabold text-foreground">
            {t("dash.admin.providers.title")}
          </h2>
          <Input
            className="w-44 sm:w-64"
            placeholder={t("dash.admin.providers.searchPlaceholder")}
            aria-label={t("dash.admin.providers.searchAria")}
          />
        </div>
        <div className="card-surface mt-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">{t("dash.admin.providers.col.name")}</TableHead>
                <TableHead className="text-right">{t("dash.admin.providers.col.rating")}</TableHead>
                <TableHead className="text-right">
                  {t("dash.admin.providers.col.completedJobs")}
                </TableHead>
                <TableHead className="text-right">
                  {t("dash.admin.providers.col.verification")}
                </TableHead>
                <TableHead className="text-right">{t("dash.admin.providers.col.action")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {providers.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-semibold text-foreground">{td(p.name)}</TableCell>
                  <TableCell>{p.rating.toFixed(1)}</TableCell>
                  <TableCell>{n(p.completedJobs)}</TableCell>
                  <TableCell>
                    {p.verified ? (
                      <VerifiedBadge />
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        {t("dash.admin.providers.pendingReview")}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="soft">
                      {t("dash.admin.providers.review")}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section>
          <h2 className="text-lg font-extrabold text-foreground">
            {t("dash.admin.recentRequests.title")}
          </h2>
          <div className="mt-4 space-y-3">
            {customerRequests.slice(0, 4).map((r) => (
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
        </section>

        <section>
          <h2 className="text-lg font-extrabold text-foreground">
            {t("dash.admin.coverageByGovernorate.title")}
          </h2>
          <div className="card-surface mt-4 divide-y divide-border">
            {topGovernorates.map((g, i) => {
              const count = providers.filter(
                (p) =>
                  p.canServeNationwide ||
                  p.coverage.some((c) => c.governorateSlug === g.slug),
              ).length;
              return (
                <div key={g.id} className="flex items-center justify-between gap-4 p-4">
                  <span className="min-w-0 truncate font-semibold text-foreground">{td(g.name)}</span>
                  <span className="shrink-0 text-sm text-muted-foreground">
                    {t("dash.admin.coverageByGovernorate.providerCount", {
                      count: n(count * (6 - i) + 12),
                    })}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      </div>
        </TabsContent>

        <TabsContent value="leads" className="mt-6">
          <LeadsPanel />
        </TabsContent>
        <TabsContent value="revenue" className="mt-6">
          <RevenuePanel />
        </TabsContent>
        <TabsContent value="approvals" className="mt-6">
          <ApprovalsPanel />
        </TabsContent>
        <TabsContent value="campaigns" className="mt-6">
          <CampaignsPanel />
        </TabsContent>
      </Tabs>
    </div>

  );
}
