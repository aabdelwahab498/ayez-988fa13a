import { Link } from "@tanstack/react-router";
import { Inbox, Star, Wallet, CheckCircle2, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardStatCard } from "@/components/common/DashboardStatCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ServiceCoverageBadge } from "@/components/common/ServiceCoverageBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { QueryBoundary } from "@/components/common/QueryBoundary";
import { ListSkeleton, ProfileSkeleton } from "@/components/common/Skeletons";
import { useProvider, useProviderOverview } from "@/core/hooks/queries";
import { formatArabicDate, formatEGP } from "@/core/utils";
import { useI18n } from "@/features/i18n/I18nProvider";

export function ProviderDashboardPage() {
  const { t, td, n } = useI18n();
  /** Session provider id — replaced by the authenticated user id later. */
  const providerId = "3";
  const { data: provider, isPending } = useProvider(providerId);
  const overview = useProviderOverview(providerId);
  const incoming = (overview.data?.leads ?? []).filter((r) => r.status !== "cancelled");

  if (isPending || !provider) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 lg:px-8">
        <ProfileSkeleton />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8 lg:py-12">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <img
            src={provider.profileImage}
            alt={t("dash.provider.image.alt", { name: td(provider.name) })}
            className="size-12 shrink-0 rounded-xl object-cover"
          />
          <div className="min-w-0">
            <h1 className="truncate text-xl font-extrabold text-foreground">{td(provider.name)}</h1>
            <p className="text-sm text-muted-foreground">{t("dash.provider.title")}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Switch id="available" defaultChecked={provider.availableNow} />
          <Label htmlFor="available" className="text-sm">
            {t("dash.provider.availableNow")}
          </Label>
        </div>
      </header>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardStatCard label={t("dash.provider.stat.newRequests")} value={7} icon={Inbox} tone="orange" />
        <DashboardStatCard
          label={t("dash.provider.stat.completedJobs")}
          value={provider.completedJobs}
          icon={CheckCircle2}
          tone="success"
        />
        <DashboardStatCard
          label={t("dash.provider.stat.avgRating")}
          value={provider.rating.toFixed(1)}
          icon={Star}
          hint={t("dash.provider.stat.reviewsHint", { count: n(provider.reviewsCount) })}
        />
        <DashboardStatCard
          label={t("dash.provider.stat.monthlyIncome")}
          value={formatEGP(48750)}
          icon={Wallet}
          tone="muted"
        />
      </div>

      <Tabs defaultValue="requests" className="mt-8">
        <TabsList className="flex w-full flex-wrap justify-start gap-1">
          <TabsTrigger value="requests">{t("dash.provider.tab.requests")}</TabsTrigger>
          <TabsTrigger value="services">{t("dash.provider.tab.services")}</TabsTrigger>
          <TabsTrigger value="coverage">{t("dash.provider.tab.coverage")}</TabsTrigger>
          <TabsTrigger value="reviews">{t("dash.provider.tab.reviews")}</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="mt-5 space-y-3">
          <QueryBoundary
            isLoading={overview.isPending}
            isError={overview.isError}
            isEmpty={incoming.length === 0}
            onRetry={() => overview.refetch()}
            skeleton={<ListSkeleton count={3} />}
            emptyTitle={t("dash.provider.requests.empty.title")}
            emptyDescription={t("dash.provider.requests.empty.desc")}
          >
            {incoming.map((r) => (
              <article key={r.id} className="card-surface p-4 sm:p-5">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate font-bold text-foreground">
                      {td(r.categoryName)} — {td(r.customerName)}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {r.reference} • {formatArabicDate(r.createdAt)}
                    </p>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
                <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{td(r.description)}</p>
                <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="size-3.5" />
                    {td(r.locationLabel)}
                  </span>
                  <span className="flex items-center gap-1.5" dir="ltr">
                    <Phone className="size-3.5" />
                    {r.customerPhone}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-3">
                  <Button size="sm" variant="brand">
                    {t("dash.provider.requests.accept")}
                  </Button>
                  <Button size="sm" variant="outline">
                    {t("dash.provider.requests.moreDetails")}
                  </Button>
                </div>
              </article>
            ))}
          </QueryBoundary>
        </TabsContent>

        <TabsContent value="services" className="mt-5">
          <div className="grid gap-3 md:grid-cols-2">
            {provider.services.map((s) => (
              <div key={s.id} className="card-surface flex items-center justify-between gap-4 p-4">
                <div className="min-w-0">
                  <p className="truncate font-bold text-foreground">{td(s.name)}</p>
                  <p className="text-xs text-muted-foreground">{td(s.unit)}</p>
                </div>
                <p className="shrink-0 text-sm font-bold text-brand">
                  {s.priceTo
                    ? t("dash.provider.services.priceRange", {
                        from: formatEGP(s.priceFrom),
                        to: formatEGP(s.priceTo),
                      })
                    : t("dash.provider.services.priceFrom", { price: formatEGP(s.priceFrom) })}
                </p>
              </div>
            ))}
          </div>
          <Button className="mt-4" variant="soft">
            {t("dash.provider.services.addNew")}
          </Button>
        </TabsContent>

        <TabsContent value="coverage" className="mt-5">
          <div className="card-surface p-5">
            <h2 className="text-base font-bold text-foreground">{t("dash.provider.coverage.title")}</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {provider.coverage.map((c) => (
                <ServiceCoverageBadge key={c.label} coverage={c} />
              ))}
            </div>
            <Button className="mt-5" variant="soft">
              {t("dash.provider.coverage.edit")}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="mt-5 space-y-3">
          {provider.reviews.map((r) => (
            <div key={r.id} className="card-surface p-4">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3">
                <div className="min-w-0">
                  <p className="truncate font-bold text-foreground">{td(r.authorName)}</p>
                  <p className="text-xs text-muted-foreground">
                    {td(r.location)} • {formatArabicDate(r.date)}
                  </p>
                </div>
                <span className="shrink-0 text-sm font-bold text-accent-orange">
                  {r.rating.toFixed(1)} ★
                </span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{td(r.comment)}</p>
            </div>
          ))}
        </TabsContent>
      </Tabs>

      <div className="mt-8 rounded-2xl bg-brand p-6 text-brand-foreground">
        <h2 className="text-lg font-extrabold">{t("dash.provider.cta.title")}</h2>
        <p className="mt-1.5 text-sm text-brand-foreground/80">{t("dash.provider.cta.text")}</p>
        <Button asChild className="mt-4" variant="accent">
          <Link to="/provider/$id" params={{ id: provider.id }}>
            {t("dash.provider.cta.viewProfile")}
          </Link>
        </Button>
      </div>
    </div>
  );
}
