import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { StatsSkeleton } from "@/components/common/Skeletons";
import { AdminPageHeader, AdminSection } from "../components/AdminPageHeader";
import { LeadsPanel } from "../panels/LeadsPanel";
import { RevenuePanel } from "../panels/RevenuePanel";
import { useExecutiveSummary } from "@/core/hooks/adminQueries";
import { useI18n } from "@/features/i18n/I18nProvider";
import { useLocalized } from "../lib/format";
import { formatEGP } from "@/core/utils";

/** Analytics workspace: acquisition, demand, revenue and growth. */
export function AdminAnalyticsPage() {
  const { t, n } = useI18n();
  const L = useLocalized();
  const { data, isLoading } = useExecutiveSummary();

  return (
    <div className="space-y-6">
      <AdminPageHeader title={t("adm.an.title")} description={t("adm.an.subtitle")} />

      <Tabs defaultValue="acquisition">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="acquisition">{t("adm.an.tab.acquisition")}</TabsTrigger>
          <TabsTrigger value="demand">{t("adm.an.tab.demand")}</TabsTrigger>
          <TabsTrigger value="revenue">{t("adm.an.tab.revenue")}</TabsTrigger>
          <TabsTrigger value="growth">{t("adm.an.tab.growth")}</TabsTrigger>
        </TabsList>

        <TabsContent value="acquisition" className="mt-6">
          {isLoading || !data ? (
            <StatsSkeleton count={4} />
          ) : (
            <AdminSection title={t("adm.an.conversion")}>
              <div className="card-surface divide-y divide-border">
                {data.funnel.map((stage) => (
                  <div key={stage.key} className="grid gap-2 p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-foreground">{L(stage.label)}</p>
                      <Progress value={stage.rate} className="mt-2 h-2" />
                    </div>
                    <p className="text-sm font-bold text-foreground sm:text-end">{n(stage.value)}</p>
                  </div>
                ))}
              </div>
            </AdminSection>
          )}
        </TabsContent>

        <TabsContent value="demand" className="mt-6">
          {data && (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {data.topServices.map((row) => (
                <article key={row.id} className="card-surface p-5">
                  <p className="truncate font-bold text-foreground">{L(row.label)}</p>
                  <p className="mt-1 text-2xl font-extrabold text-brand">{n(row.value)}</p>
                  <Progress value={row.share} className="mt-3 h-1.5" />
                </article>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="revenue" className="mt-6">
          <RevenuePanel />
          {data && (
            <p className="mt-4 text-sm text-muted-foreground">
              {t("adm.dash.revenue")}:{" "}
              <span className="font-bold text-foreground">
                {formatEGP(data.series.reduce((sum, point) => sum + point.revenue, 0))}
              </span>
            </p>
          )}
        </TabsContent>

        <TabsContent value="growth" className="mt-6">
          <AdminSection title={t("adm.an.leadPerformance")}>
            <LeadsPanel />
          </AdminSection>
        </TabsContent>
      </Tabs>
    </div>
  );
}
