import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AlertTriangle, ArrowLeft, Info, ShieldAlert, TrendingDown, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StatsSkeleton } from "@/components/common/Skeletons";
import { AdminPageHeader, AdminSection } from "../components/AdminPageHeader";
import { useExecutiveSummary } from "@/core/hooks/adminQueries";
import { useI18n } from "@/features/i18n/I18nProvider";
import { useLocalized, useMetricFormatter } from "../lib/format";
import { cn } from "@/lib/utils";
import type { RankedRowDTO } from "@/core/types/admin";

/** Executive dashboard — platform health at a glance. */
export function AdminDashboardPage() {
  const { t, n, lang } = useI18n();
  const L = useLocalized();
  const fmt = useMetricFormatter();
  const { data, isLoading } = useExecutiveSummary();

  return (
    <div className="space-y-8">
      <AdminPageHeader title={t("adm.dash.title")} description={t("adm.dash.subtitle")} />

      {isLoading || !data ? (
        <StatsSkeleton count={6} />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {data.metrics.map((metric, i) => {
              const positive = metric.trend === "up";
              const Trend = positive ? TrendingUp : TrendingDown;
              return (
                <motion.article
                  key={metric.key}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.25 }}
                  className="card-surface p-5"
                >
                  <p className="truncate text-sm text-muted-foreground">{L(metric.label)}</p>
                  <p className="mt-2 text-2xl font-extrabold text-foreground">{fmt(metric.value, metric.unit)}</p>
                  <p className="mt-2 flex items-center gap-1.5 text-xs">
                    {metric.trend !== "flat" && (
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-bold",
                          positive ? "bg-success-soft text-success" : "bg-destructive/10 text-destructive",
                        )}
                      >
                        <Trend className="size-3" />
                        {n(Math.abs(metric.delta))}%
                      </span>
                    )}
                    <span className="text-muted-foreground">{t("adm.common.vsPrev")}</span>
                  </p>
                </motion.article>
              );
            })}
          </div>

          <AdminSection title={t("adm.dash.alerts")}>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {data.alerts.map((alert) => {
                const Icon =
                  alert.severity === "critical" ? ShieldAlert : alert.severity === "warning" ? AlertTriangle : Info;
                return (
                  <Link
                    key={alert.id}
                    to={alert.href}
                    className="card-surface flex items-center gap-3 p-4 transition-colors hover:border-brand/40"
                  >
                    <span
                      className={cn(
                        "grid size-10 shrink-0 place-items-center rounded-xl",
                        alert.severity === "critical"
                          ? "bg-destructive/10 text-destructive"
                          : alert.severity === "warning"
                            ? "bg-accent-orange-soft text-accent-orange"
                            : "bg-brand-soft text-brand",
                      )}
                    >
                      <Icon className="size-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-bold text-foreground">{L(alert.label)}</span>
                      <span className="block text-xs text-muted-foreground">
                        {n(alert.count)} · {t("adm.dash.openModule")}
                      </span>
                    </span>
                    <ArrowLeft className="size-4 shrink-0 text-muted-foreground rtl:rotate-0 ltr:rotate-180" />
                  </Link>
                );
              })}
            </div>
          </AdminSection>

          <AdminSection title={t("adm.dash.growth")}>
            <div className="card-surface p-4 sm:p-5">
              <div className="h-72 w-full" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.series} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                    <defs>
                      <linearGradient id="gReq" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--chart-1, 220 70% 50%))" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="hsl(var(--chart-1, 220 70% 50%))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="period" tickLine={false} axisLine={false} fontSize={12} />
                    <YAxis tickLine={false} axisLine={false} fontSize={12} width={48} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: "1px solid hsl(var(--border))",
                        background: "hsl(var(--card))",
                        fontSize: 12,
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="requests"
                      name={lang === "ar" ? "الطلبات" : "Requests"}
                      stroke="var(--color-brand, currentColor)"
                      fill="url(#gReq)"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="providers"
                      name={lang === "ar" ? "مقدمو الخدمة" : "Providers"}
                      stroke="var(--color-accent-orange, currentColor)"
                      fill="transparent"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </AdminSection>

          <div className="grid gap-6 lg:grid-cols-2">
            <RankedList title={t("adm.dash.topGovernorates")} rows={data.topGovernorates} />
            <RankedList title={t("adm.dash.topServices")} rows={data.topServices} />
          </div>

          <AdminSection title={t("adm.dash.funnel")}>
            <div className="card-surface divide-y divide-border">
              {data.funnel.map((stage) => (
                <div key={stage.key} className="grid gap-2 p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-foreground">{L(stage.label)}</p>
                    <Progress value={stage.rate} className="mt-2 h-2" />
                  </div>
                  <p className="text-sm font-bold text-foreground sm:text-end">
                    {n(stage.value)}{" "}
                    <span className="text-xs font-normal text-muted-foreground">({n(stage.rate)}%)</span>
                  </p>
                </div>
              ))}
            </div>
          </AdminSection>
        </>
      )}
    </div>
  );
}

function RankedList({ title, rows }: { title: string; rows: RankedRowDTO[] }) {
  const { t, n } = useI18n();
  const L = useLocalized();
  return (
    <AdminSection title={title}>
      <ul className="card-surface divide-y divide-border">
        {rows.map((row, i) => (
          <li key={row.id} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 p-4">
            <span className="grid size-7 place-items-center rounded-lg bg-secondary text-xs font-bold text-muted-foreground">
              {n(i + 1)}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-bold text-foreground">{L(row.label)}</span>
              <Progress value={row.share} className="mt-1.5 h-1.5" />
            </span>
            <span className="text-end text-xs text-muted-foreground">
              <span className="block font-bold text-foreground">{n(row.value)}</span>
              {n(row.share)}% {t("adm.dash.share")}
            </span>
          </li>
        ))}
      </ul>
    </AdminSection>
  );
}

export { RankedList };
export const AdminDashboardActions = Button;
