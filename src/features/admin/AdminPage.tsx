import { Users, Briefcase, Inbox, Star, MapPinned } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DashboardStatCard } from "@/components/common/DashboardStatCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { VerifiedBadge } from "@/components/common/VerifiedBadge";
import { adminStats, customerRequests } from "@/mocks/requests";
import { providers } from "@/mocks/providers";
import { governorates } from "@/mocks/locations";
import { formatArabicDate } from "@/core/utils";

export function AdminPage() {
  const topGovernorates = governorates.slice(0, 6);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8 lg:py-12">
      <header>
        <h1 className="text-xl font-extrabold text-foreground sm:text-2xl">لوحة الإدارة</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          نظرة عامة على نشاط المنصة في جميع المحافظات
        </p>
      </header>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <DashboardStatCard label="المستخدمون" value={adminStats.users} icon={Users} />
        <DashboardStatCard
          label="مقدمو الخدمة"
          value={adminStats.providers}
          icon={Briefcase}
          tone="orange"
        />
        <DashboardStatCard
          label="طلبات جديدة"
          value={adminStats.newRequests}
          icon={Inbox}
          tone="success"
        />
        <DashboardStatCard label="التقييمات" value={adminStats.reviews} icon={Star} tone="muted" />
        <DashboardStatCard
          label="محافظات نشطة"
          value={adminStats.activeGovernorates}
          icon={MapPinned}
        />
      </div>

      <section className="mt-8">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <h2 className="min-w-0 truncate text-lg font-extrabold text-foreground">
            مقدمو الخدمة
          </h2>
          <Input className="w-44 sm:w-64" placeholder="بحث بالاسم..." aria-label="بحث" />
        </div>
        <div className="card-surface mt-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">الاسم</TableHead>
                <TableHead className="text-right">التقييم</TableHead>
                <TableHead className="text-right">خدمات منفذة</TableHead>
                <TableHead className="text-right">التوثيق</TableHead>
                <TableHead className="text-right">إجراء</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {providers.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-semibold text-foreground">{p.name}</TableCell>
                  <TableCell>{p.rating.toFixed(1)}</TableCell>
                  <TableCell>{p.completedJobs.toLocaleString("ar-EG")}</TableCell>
                  <TableCell>
                    {p.verified ? (
                      <VerifiedBadge />
                    ) : (
                      <span className="text-xs text-muted-foreground">بانتظار المراجعة</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="soft">
                      مراجعة
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section>
          <h2 className="text-lg font-extrabold text-foreground">أحدث الطلبات</h2>
          <div className="mt-4 space-y-3">
            {customerRequests.slice(0, 4).map((r) => (
              <div key={r.id} className="card-surface p-4">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-bold text-foreground">
                      {r.categoryName} — {r.locationLabel}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {r.reference} • {formatArabicDate(r.createdAt)}
                    </p>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-extrabold text-foreground">التغطية حسب المحافظة</h2>
          <div className="card-surface mt-4 divide-y divide-border">
            {topGovernorates.map((g, i) => {
              const count = providers.filter(
                (p) =>
                  p.canServeNationwide ||
                  p.coverage.some((c) => c.governorateSlug === g.slug),
              ).length;
              return (
                <div key={g.id} className="flex items-center justify-between gap-4 p-4">
                  <span className="min-w-0 truncate font-semibold text-foreground">{g.name}</span>
                  <span className="shrink-0 text-sm text-muted-foreground">
                    {(count * (6 - i) + 12).toLocaleString("ar-EG")} مقدم خدمة
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
