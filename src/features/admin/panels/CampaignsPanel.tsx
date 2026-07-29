import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatEGP } from "@/core/utils";
import { useI18n } from "@/features/i18n/I18nProvider";
import {
  marketplaceKeys,
  marketplaceRepository,
} from "@/core/repositories/marketplaceRepository";
import type { TranslationKeyLike } from "@/features/marketplace/types";

/** Sponsored placements / ads performance. */
export function CampaignsPanel() {
  const { t, td, n } = useI18n();
  const { data: campaigns = [] } = useQuery({
    queryKey: marketplaceKeys.campaigns(),
    queryFn: () => marketplaceRepository.listCampaigns(),
  });

  return (
    <section>
      <h2 className="text-lg font-extrabold text-foreground">{t("mkt.admin.ads.title")}</h2>
      <ul className="mt-4 grid gap-3 lg:grid-cols-2">
        {campaigns.map((c) => {
          const spendPct = Math.min(100, Math.round((c.spent / c.budget) * 100));
          const ctr = c.impressions > 0 ? (c.clicks / c.impressions) * 100 : 0;
          return (
            <li key={c.id} className="card-surface p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-extrabold text-foreground">{td(c.name)}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {td(c.advertiser)} • {t("mkt.admin.ads.placement")}: {c.placement}
                  </p>
                </div>
                <Badge variant={c.status === "running" ? "default" : "secondary"}>
                  {t(`mkt.campaign.status.${c.status}` as TranslationKeyLike)}
                </Badge>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                {[
                  [t("mkt.admin.ads.impressions"), n(c.impressions)],
                  [t("mkt.admin.ads.clicks"), n(c.clicks)],
                  [t("mkt.admin.ads.ctr"), `${n(Number(ctr.toFixed(1)))}%`],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg bg-muted/50 p-2">
                    <p className="text-sm font-extrabold text-foreground">{value}</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{t("mkt.admin.ads.spend")}</span>
                  <span>
                    {formatEGP(c.spent)} / {formatEGP(c.budget)}
                  </span>
                </div>
                <Progress value={spendPct} className="mt-2 h-1.5" />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
