import { LayoutTemplate } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AdminPageHeader, AdminSection } from "../components/AdminPageHeader";
import { CampaignsPanel } from "../panels/CampaignsPanel";
import { useI18n } from "@/features/i18n/I18nProvider";

const PLACEMENTS = [
  { key: "home_hero", price: 12000 },
  { key: "search_top", price: 8500 },
  { key: "category_banner", price: 6000 },
  { key: "provider_sidebar", price: 3500 },
] as const;

/** Advertising: sponsored placements inventory and live campaigns. */
export function AdminAdvertisingPage() {
  const { t, n } = useI18n();

  return (
    <div className="space-y-8">
      <AdminPageHeader title={t("adm.ads.title")} description={t("adm.ads.subtitle")} />

      <AdminSection title={t("adm.ads.placements")}>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {PLACEMENTS.map((placement) => (
            <article key={placement.key} className="card-surface p-5">
              <span className="grid size-10 place-items-center rounded-xl bg-accent-orange-soft text-accent-orange">
                <LayoutTemplate className="size-5" />
              </span>
              <h3 className="mt-3 font-bold text-foreground">{t(`adm.ads.placement.${placement.key}`)}</h3>
              <Badge variant="secondary" className="mt-2">
                {n(placement.price)} EGP
              </Badge>
            </article>
          ))}
        </div>
      </AdminSection>

      <CampaignsPanel />
    </div>
  );
}
