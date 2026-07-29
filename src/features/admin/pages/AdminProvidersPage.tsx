import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BadgeCheck, Rocket, Star, Timer } from "lucide-react";
import { AdminPageHeader } from "../components/AdminPageHeader";
import { ApprovalsPanel } from "../panels/ApprovalsPanel";
import { OverviewPanel } from "../panels/OverviewPanel";
import { useI18n } from "@/features/i18n/I18nProvider";

/** Provider moderation: directory, onboarding queue and badge rules. */
export function AdminProvidersPage() {
  const { t } = useI18n();

  const badges = [
    { icon: BadgeCheck, title: t("adm.providers.badges.verified"), rule: t("adm.providers.badges.verifiedRule") },
    { icon: Star, title: t("adm.providers.badges.topRated"), rule: t("adm.providers.badges.topRatedRule") },
    { icon: Timer, title: t("adm.providers.badges.fast"), rule: t("adm.providers.badges.fastRule") },
    { icon: Rocket, title: t("adm.providers.badges.elite"), rule: t("adm.providers.badges.eliteRule") },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader title={t("adm.providers.title")} description={t("adm.providers.subtitle")} />

      <Tabs defaultValue="directory">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="directory">{t("adm.providers.tab.directory")}</TabsTrigger>
          <TabsTrigger value="applications">{t("adm.providers.tab.applications")}</TabsTrigger>
          <TabsTrigger value="badges">{t("adm.providers.tab.badges")}</TabsTrigger>
        </TabsList>

        <TabsContent value="directory" className="mt-6">
          <OverviewPanel />
        </TabsContent>

        <TabsContent value="applications" className="mt-6">
          <ApprovalsPanel />
        </TabsContent>

        <TabsContent value="badges" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            {badges.map((badge) => (
              <article key={badge.title} className="card-surface flex gap-3 p-5">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
                  <badge.icon className="size-5" />
                </span>
                <div className="min-w-0">
                  <h3 className="font-bold text-foreground">{badge.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{badge.rule}</p>
                </div>
              </article>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
