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
import { customerRequests } from "@/mocks/requests";
import { providerById } from "@/mocks/providers";
import { formatArabicDate, formatEGP } from "@/core/utils";

export function ProviderDashboardPage() {
  const provider = providerById("3")!;
  const incoming = customerRequests.filter((r) => r.status !== "cancelled");

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8 lg:py-12">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <img
            src={provider.profileImage}
            alt={`صورة ${provider.name}`}
            className="size-12 shrink-0 rounded-xl object-cover"
          />
          <div className="min-w-0">
            <h1 className="truncate text-xl font-extrabold text-foreground">{provider.name}</h1>
            <p className="text-sm text-muted-foreground">لوحة تحكم مقدم الخدمة</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Switch id="available" defaultChecked={provider.availableNow} />
          <Label htmlFor="available" className="text-sm">
            متاح الآن
          </Label>
        </div>
      </header>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardStatCard label="طلبات جديدة" value={7} icon={Inbox} tone="orange" />
        <DashboardStatCard
          label="خدمات منفذة"
          value={provider.completedJobs}
          icon={CheckCircle2}
          tone="success"
        />
        <DashboardStatCard
          label="متوسط التقييم"
          value={provider.rating.toFixed(1)}
          icon={Star}
          hint={`${provider.reviewsCount.toLocaleString("ar-EG")} تقييم`}
        />
        <DashboardStatCard
          label="دخل الشهر"
          value={formatEGP(48750)}
          icon={Wallet}
          tone="muted"
        />
      </div>

      <Tabs defaultValue="requests" className="mt-8">
        <TabsList className="flex w-full flex-wrap justify-start gap-1">
          <TabsTrigger value="requests">الطلبات الواردة</TabsTrigger>
          <TabsTrigger value="services">خدماتي وأسعاري</TabsTrigger>
          <TabsTrigger value="coverage">مناطق التغطية</TabsTrigger>
          <TabsTrigger value="reviews">التقييمات</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="mt-5 space-y-3">
          {incoming.length ? (
            incoming.map((r) => (
              <article key={r.id} className="card-surface p-4 sm:p-5">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate font-bold text-foreground">
                      {r.categoryName} — {r.customerName}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {r.reference} • {formatArabicDate(r.createdAt)}
                    </p>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
                <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{r.description}</p>
                <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="size-3.5" />
                    {r.locationLabel}
                  </span>
                  <span className="flex items-center gap-1.5" dir="ltr">
                    <Phone className="size-3.5" />
                    {r.customerPhone}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-3">
                  <Button size="sm" variant="brand">
                    قبول الطلب
                  </Button>
                  <Button size="sm" variant="outline">
                    طلب تفاصيل إضافية
                  </Button>
                </div>
              </article>
            ))
          ) : (
            <EmptyState title="لا توجد طلبات واردة" description="ستظهر الطلبات الجديدة هنا." />
          )}
        </TabsContent>

        <TabsContent value="services" className="mt-5">
          <div className="grid gap-3 md:grid-cols-2">
            {provider.services.map((s) => (
              <div key={s.id} className="card-surface flex items-center justify-between gap-4 p-4">
                <div className="min-w-0">
                  <p className="truncate font-bold text-foreground">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.unit}</p>
                </div>
                <p className="shrink-0 text-sm font-bold text-brand">
                  {s.priceTo
                    ? `${formatEGP(s.priceFrom)} - ${formatEGP(s.priceTo)}`
                    : `من ${formatEGP(s.priceFrom)}`}
                </p>
              </div>
            ))}
          </div>
          <Button className="mt-4" variant="soft">
            إضافة خدمة جديدة
          </Button>
        </TabsContent>

        <TabsContent value="coverage" className="mt-5">
          <div className="card-surface p-5">
            <h2 className="text-base font-bold text-foreground">المناطق التي تخدمها</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {provider.coverage.map((c) => (
                <ServiceCoverageBadge key={c.label} coverage={c} />
              ))}
            </div>
            <Button className="mt-5" variant="soft">
              تعديل مناطق التغطية
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="mt-5 space-y-3">
          {provider.reviews.map((r) => (
            <div key={r.id} className="card-surface p-4">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3">
                <div className="min-w-0">
                  <p className="truncate font-bold text-foreground">{r.authorName}</p>
                  <p className="text-xs text-muted-foreground">
                    {r.location} • {formatArabicDate(r.date)}
                  </p>
                </div>
                <span className="shrink-0 text-sm font-bold text-accent-orange">
                  {r.rating.toFixed(1)} ★
                </span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{r.comment}</p>
            </div>
          ))}
        </TabsContent>
      </Tabs>

      <div className="mt-8 rounded-2xl bg-brand p-6 text-brand-foreground">
        <h2 className="text-lg font-extrabold">اجعل ملفك أكثر جذبًا للعملاء</h2>
        <p className="mt-1.5 text-sm text-brand-foreground/80">
          أضف صور أعمال سابقة ووثّق حسابك لزيادة فرص ظهورك في نتائج البحث.
        </p>
        <Button asChild className="mt-4" variant="accent">
          <Link to="/provider/$id" params={{ id: provider.id }}>
            عرض ملفي العام
          </Link>
        </Button>
      </div>
    </div>
  );
}
