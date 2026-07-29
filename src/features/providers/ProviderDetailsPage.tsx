import { getRouteApi, Link } from "@tanstack/react-router";
import { Clock, Briefcase, CalendarCheck, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { RatingWidget } from "@/components/common/RatingWidget";
import { VerifiedBadge } from "@/components/common/VerifiedBadge";
import { ServiceCoverageBadge } from "@/components/common/ServiceCoverageBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { ProviderGrid } from "@/components/business/ProviderGrid";
import { providers, providerById } from "@/mocks/providers";
import { categories } from "@/mocks/categories";
import { formatPriceRange, formatResponseTime, formatEGP, formatArabicDate } from "@/core/utils";

const routeApi = getRouteApi("/provider/$id");

export function ProviderDetailsPage() {
  const { id } = routeApi.useParams();
  const provider = providerById(id);

  if (!provider) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 lg:px-8">
        <EmptyState
          title="مقدم الخدمة غير موجود"
          description="ربما تم حذف هذا الملف أو أن الرابط غير صحيح."
        >
          <Button asChild variant="brand">
            <Link to="/">العودة للرئيسية</Link>
          </Button>
        </EmptyState>
      </div>
    );
  }

  const related = providers
    .filter((p) => p.id !== provider.id && p.categories.some((c) => provider.categories.includes(c)))
    .slice(0, 3);

  const categoryNames = provider.categories
    .map((slug) => categories.find((c) => c.slug === slug)?.name)
    .filter(Boolean)
    .join(" • ");

  const coverageList = provider.canServeNationwide
    ? [{ scope: "nationwide" as const, label: "متاح في جميع محافظات مصر" }]
    : provider.coverage;

  return (
    <div className="pb-24 lg:pb-0">
      <section className="hero-surface text-brand-foreground">
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8 lg:py-12">
          <div className="grid gap-6 md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-center">
            <img
              src={provider.profileImage}
              alt={`صورة ${provider.name}`}
              className="size-24 rounded-2xl object-cover md:size-28"
            />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-extrabold">{provider.name}</h1>
                {provider.verified && <VerifiedBadge />}
              </div>
              <p className="mt-1 text-sm text-brand-foreground/75">{categoryNames}</p>
              <div className="mt-3 flex flex-wrap items-center gap-4">
                <RatingWidget rating={provider.rating} reviewsCount={provider.reviewsCount} size="md" />
                <span className="flex items-center gap-1.5 text-sm text-brand-foreground/80">
                  <Clock className="size-4" />
                  {formatResponseTime(provider.responseTimeMinutes)}
                </span>
                <span className="flex items-center gap-1.5 text-sm text-brand-foreground/80">
                  <Briefcase className="size-4" />
                  خبرة {provider.yearsExperience} سنة
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {coverageList.slice(0, 3).map((c) => (
                  <ServiceCoverageBadge key={c.label} coverage={c} />
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-brand-foreground/20 bg-card/10 p-4 md:w-56">
              <p className="text-xs text-brand-foreground/70">نطاق الأسعار</p>
              <p className="mt-1 text-lg font-extrabold">
                {formatPriceRange(provider.priceFrom, provider.priceTo)}
              </p>
              <Button asChild variant="accent" className="mt-4 hidden w-full md:inline-flex">
                <Link to="/request-service" search={{ provider: provider.id }}>
                  اطلب الخدمة الآن
                </Link>
              </Button>
              <p className="mt-3 flex items-center gap-1.5 text-xs text-brand-foreground/70">
                <Phone className="size-3.5" />
                {provider.phone}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <Tabs defaultValue="about">
          <TabsList className="flex w-full flex-wrap justify-start gap-1">
            <TabsTrigger value="about">نبذة</TabsTrigger>
            <TabsTrigger value="services">الخدمات</TabsTrigger>
            <TabsTrigger value="coverage">مناطق التغطية</TabsTrigger>
            <TabsTrigger value="gallery">معرض الأعمال</TabsTrigger>
            <TabsTrigger value="reviews">التقييمات</TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="mt-6">
            <div className="card-surface p-6">
              <h2 className="text-base font-bold text-foreground">نبذة عن مقدم الخدمة</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{provider.about}</p>
              <Separator className="my-5" />
              <dl className="grid gap-4 sm:grid-cols-3">
                <div>
                  <dt className="text-xs text-muted-foreground">خدمات منفذة</dt>
                  <dd className="text-lg font-bold text-foreground">
                    {provider.completedJobs.toLocaleString("ar-EG")}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">متوسط التقييم</dt>
                  <dd className="text-lg font-bold text-foreground">{provider.rating.toFixed(1)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">الحالة</dt>
                  <dd className="text-lg font-bold text-foreground">
                    {provider.availableNow ? "متاح الآن" : "يستقبل الحجوزات"}
                  </dd>
                </div>
              </dl>
            </div>
          </TabsContent>

          <TabsContent value="services" className="mt-6">
            <div className="grid gap-3 md:grid-cols-2">
              {provider.services.map((s) => (
                <div key={s.id} className="card-surface flex items-center justify-between gap-4 p-4">
                  <div className="min-w-0">
                    <p className="truncate font-bold text-foreground">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.unit}</p>
                  </div>
                  <p className="shrink-0 text-sm font-bold text-brand">
                    {s.priceTo ? `${formatEGP(s.priceFrom)} - ${formatEGP(s.priceTo)}` : `من ${formatEGP(s.priceFrom)}`}
                  </p>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="coverage" className="mt-6">
            <div className="card-surface p-6">
              <h2 className="text-base font-bold text-foreground">مناطق التغطية</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {provider.canServeNationwide
                  ? "هذا المقدم يقدم خدماته في جميع محافظات مصر."
                  : "المناطق التي يمكن لمقدم الخدمة الوصول إليها:"}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {coverageList.map((c) => (
                  <ServiceCoverageBadge key={c.label} coverage={c} />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="gallery" className="mt-6">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {provider.gallery.map((src, i) => (
                <img
                  key={src}
                  src={src}
                  loading="lazy"
                  alt={`عمل سابق ${i + 1} لـ ${provider.name}`}
                  className="aspect-[4/3] w-full rounded-xl object-cover"
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            {provider.reviews.length ? (
              <div className="space-y-3">
                {provider.reviews.map((r) => (
                  <div key={r.id} className="card-surface p-4">
                    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-bold text-foreground">{r.authorName}</p>
                        <p className="text-xs text-muted-foreground">
                          {r.location} • {formatArabicDate(r.date)}
                        </p>
                      </div>
                      <RatingWidget rating={r.rating} showValue={false} />
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">{r.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="لا توجد تقييمات بعد" description="كن أول من يقيّم هذا المقدم." />
            )}
          </TabsContent>
        </Tabs>

        {related.length > 0 && (
          <section className="mt-10">
            <h2 className="text-lg font-extrabold text-foreground">مقدمو خدمة مشابهون</h2>
            <div className="mt-4">
              <ProviderGrid providers={related} />
            </div>
          </section>
        )}
      </div>

      <div className="fixed inset-x-0 bottom-16 z-30 border-t border-border bg-card p-3 lg:hidden">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <div className="min-w-0">
            <p className="text-[11px] text-muted-foreground">السعر يبدأ من</p>
            <p className="truncate text-sm font-bold text-foreground">
              {formatEGP(provider.priceFrom)}
            </p>
          </div>
          <Button asChild variant="accent">
            <Link to="/request-service" search={{ provider: provider.id }}>
              <CalendarCheck className="size-4" />
              اطلب الخدمة الآن
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
