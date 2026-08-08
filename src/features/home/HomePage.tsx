import { Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  Star,
  MapPinned,
  ArrowLeft,
  Search,
  ListChecks,
  Send,
  Briefcase,
} from "lucide-react";
import heroAsset from "@/assets/hero-directory-team.jpg.asset.json";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/common/Section";
import { SearchBarWidget } from "@/components/business/SearchBarWidget";
import { CategoryCard } from "@/components/business/CategoryCard";
import { SectorCard } from "@/components/business/SectorCard";
import { ProviderGrid } from "@/components/business/ProviderGrid";
import { QueryBoundary } from "@/components/common/QueryBoundary";
import { CardGridSkeleton } from "@/components/common/Skeletons";
import { useCategories, useFeaturedProviders, useSectors } from "@/core/hooks/queries";
import { useI18n } from "@/features/i18n/I18nProvider";
import { defaultSearch } from "@/features/services/searchSchema";


const steps = [
  { icon: Search, key: "step1" },
  { icon: ListChecks, key: "step2" },
  { icon: Send, key: "step3" },
] as const;

const trust = [
  { icon: ShieldCheck, key: "1" },
  { icon: Star, key: "2" },
  { icon: MapPinned, key: "3" },
] as const;

export function HomePage() {
  const { t, lang } = useI18n();
  const locale = lang === "ar" ? "ar-EG" : "en-US";
  const { data: sectors = [] } = useSectors();
  const { data: categories = [] } = useCategories();
  const featuredQuery = useFeaturedProviders(6);
  const featured = featuredQuery.data ?? [];
  const popularCategories = [...categories]
    .sort((a, b) => b.providersCount - a.providersCount)
    .slice(0, 12);
  const countBySector = (slug: string) =>
    categories.filter((c) => c.sector === slug).length;


  return (
    <>
      <section className="hero-surface text-brand-foreground">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 lg:grid-cols-2 lg:items-center lg:gap-12 lg:px-8 lg:py-20">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-foreground/20 bg-card/10 px-3 py-1 text-xs font-semibold">
              <ShieldCheck className="size-3.5" />
              {t("home.badge")}
            </span>
            <h1 className="mt-5 text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
              {t("app.tagline")}
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-brand-foreground/80 sm:text-base">
              {t("home.heroText")}
            </p>

            <div className="mt-6 flex flex-wrap gap-6 text-sm text-brand-foreground/80">
              <div>
                <p className="text-2xl font-extrabold text-brand-foreground">
                  {(966).toLocaleString(locale)}+
                </p>
                {t("home.stat.providers")}
              </div>
              <div>
                <p className="text-2xl font-extrabold text-brand-foreground">
                  {(27).toLocaleString(locale)}
                </p>
                {t("home.stat.governorates")}
              </div>
              <div>
                <p className="text-2xl font-extrabold text-brand-foreground">
                  {(18000).toLocaleString(locale)}+
                </p>
                {t("home.stat.customers")}
              </div>
            </div>
          </div>

          <div className="relative">
            <img
              src={heroAsset.url}
              alt={t("home.heroAlt")}
              width={1200}
              height={912}
              className="h-64 w-full rounded-2xl object-cover shadow-elevated sm:h-80 lg:h-[26rem]"
            />
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 pb-12 lg:px-8">
          <SearchBarWidget />
        </div>
      </section>

      <Section
        title={t("home.sectors.title")}
        description={t("home.sectors.desc")}
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sectors.map((s) => (
            <SectorCard key={s.slug} sector={s} categoryCount={countBySector(s.slug)} />
          ))}
        </div>
      </Section>

      <Section
        title={t("home.categories.title")}
        description={t("home.categories.desc")}
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {popularCategories.map((c) => (
            <CategoryCard key={c.id} category={c} />
          ))}
        </div>
      </Section>


      <Section
        title={t("home.featured.title")}
        description={t("home.featured.desc")}
        action={
          <Button asChild variant="soft" size="sm">
            <Link to="/services" search={defaultSearch}>
              {t("home.featured.viewAll")}
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
        }
      >
        <QueryBoundary
          isLoading={featuredQuery.isPending}
          isError={featuredQuery.isError}
          isEmpty={featured.length === 0}
          onRetry={() => featuredQuery.refetch()}
          skeleton={<CardGridSkeleton count={6} />}
        >
          <ProviderGrid providers={featured} />
        </QueryBoundary>
      </Section>

      <section className="bg-card py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="text-center text-xl font-extrabold text-foreground sm:text-2xl">
            {t("home.how.title")}
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {steps.map((s, i) => (
              <div key={s.key} className="rounded-xl border border-border bg-background p-6">
                <div className="flex items-center gap-3">
                  <span className="grid size-11 place-items-center rounded-xl bg-brand text-brand-foreground">
                    <s.icon className="size-5" />
                  </span>
                  <span className="text-3xl font-extrabold text-border">
                    {(i + 1).toLocaleString(locale)}
                  </span>
                </div>
                <h3 className="mt-4 text-base font-bold text-foreground">
                  {t(`home.how.${s.key}.title`)}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t(`home.how.${s.key}.text`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Section title={t("home.trust.title")} description={t("home.trust.desc")}>
        <div className="grid gap-4 md:grid-cols-3">
          {trust.map((item) => (
            <div key={item.key} className="card-surface p-6">
              <span className="grid size-11 place-items-center rounded-xl bg-accent-orange-soft text-accent-orange">
                <item.icon className="size-5" />
              </span>
              <h3 className="mt-4 text-base font-bold text-foreground">
                {t(`home.trust.${item.key}.title`)}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {t(`home.trust.${item.key}.text`)}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <section className="mx-auto max-w-7xl px-4 pb-12 lg:px-8">
        <div className="grid items-center gap-6 rounded-2xl bg-brand p-8 text-brand-foreground md:grid-cols-[minmax(0,1fr)_auto] lg:p-10">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-2 rounded-full bg-card/10 px-3 py-1 text-xs font-semibold">
              <Briefcase className="size-3.5" />
              {t("home.cta.badge")}
            </span>
            <h2 className="mt-4 text-xl font-extrabold sm:text-2xl">
              {t("home.cta.title")}
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-brand-foreground/80">
              {t("home.cta.text")}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="accent" size="lg">
              <Link to="/join-provider">{t("mkt.home.cta.join")}</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/pricing">{t("mkt.home.cta.pricing")}</Link>
            </Button>
          </div>

        </div>
      </section>
    </>
  );
}
