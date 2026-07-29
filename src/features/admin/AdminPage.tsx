import { useI18n } from "@/features/i18n/I18nProvider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OverviewPanel } from "@/features/admin/panels/OverviewPanel";
import { LeadsPanel } from "@/features/admin/panels/LeadsPanel";
import { RevenuePanel } from "@/features/admin/panels/RevenuePanel";
import { ApprovalsPanel } from "@/features/admin/panels/ApprovalsPanel";
import { CampaignsPanel } from "@/features/admin/panels/CampaignsPanel";

export function AdminPage() {
  const { t } = useI18n();


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
          <OverviewPanel />
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
