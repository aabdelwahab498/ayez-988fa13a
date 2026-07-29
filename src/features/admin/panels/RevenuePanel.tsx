import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatEGP } from "@/core/utils";
import { useI18n } from "@/features/i18n/I18nProvider";
import {
  marketplaceKeys,
  marketplaceRepository,
} from "@/core/repositories/marketplaceRepository";
import type { TranslationKeyLike } from "@/features/marketplace/types";

/** Revenue mix chart + subscription book. */
export function RevenuePanel() {
  const { t, td, n } = useI18n();
  const { data: metrics } = useQuery({
    queryKey: marketplaceKeys.metrics(),
    queryFn: () => marketplaceRepository.getMetrics(),
  });
  const { data: subs = [] } = useQuery({
    queryKey: marketplaceKeys.subscriptions(),
    queryFn: () => marketplaceRepository.listSubscriptions(),
  });

  const series = metrics?.revenueSeries ?? [];
  const max = Math.max(
    1,
    ...series.map((p) => p.subscriptions + p.ads + p.commissions),
  );

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-lg font-extrabold text-foreground">{t("mkt.admin.revenue.title")}</h2>
        <div className="card-surface mt-4 p-5">
          <div className="flex h-52 items-end gap-3">
            {series.map((p) => {
              const total = p.subscriptions + p.ads + p.commissions;
              return (
                <div key={p.month} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                  <div
                    className="flex w-full max-w-14 flex-col justify-end overflow-hidden rounded-md"
                    style={{ height: `${(total / max) * 100}%` }}
                    title={formatEGP(total)}
                  >
                    <div
                      className="bg-brand"
                      style={{ height: `${(p.subscriptions / total) * 100}%` }}
                    />
                    <div className="bg-accent" style={{ height: `${(p.ads / total) * 100}%` }} />
                    <div
                      className="bg-success"
                      style={{ height: `${(p.commissions / total) * 100}%` }}
                    />
                  </div>
                  <span className="truncate text-xs text-muted-foreground">{td(p.month)}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
            {[
              ["bg-brand", "mkt.admin.revenue.subscriptions"],
              ["bg-accent", "mkt.admin.revenue.ads"],
              ["bg-success", "mkt.admin.revenue.commissions"],
            ].map(([color, key]) => (
              <span key={key} className="flex items-center gap-2">
                <span className={`size-3 rounded-sm ${color}`} aria-hidden />
                {t(key as TranslationKeyLike)}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-extrabold text-foreground">{t("mkt.admin.subs.title")}</h2>
        <div className="card-surface mt-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {[
                  "mkt.admin.subs.col.provider",
                  "mkt.admin.subs.col.plan",
                  "mkt.admin.subs.col.value",
                  "mkt.admin.subs.col.usage",
                  "mkt.admin.subs.col.renews",
                  "mkt.admin.subs.col.status",
                ].map((k) => (
                  <TableHead key={k} className="text-start">
                    {t(k as TranslationKeyLike)}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {subs.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-semibold text-foreground">
                    {td(s.providerName)}
                  </TableCell>
                  <TableCell className="uppercase">{s.tier}</TableCell>
                  <TableCell>{formatEGP(s.monthlyValue)}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {n(s.leadsUsed)} /{" "}
                    {s.leadsQuota === "unlimited" ? "∞" : n(s.leadsQuota)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{s.renewsAt}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        s.status === "active"
                          ? "default"
                          : s.status === "past_due"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {t(`mkt.sub.status.${s.status}` as TranslationKeyLike)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}
