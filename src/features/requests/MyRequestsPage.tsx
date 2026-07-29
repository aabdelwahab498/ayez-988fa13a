import { Link } from "@tanstack/react-router";
import { Phone, MapPin, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/common/StatusBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { customerRequests } from "@/mocks/requests";
import { formatArabicDate } from "@/core/utils";
import type { RequestStatus, ServiceRequest } from "@/core/types";
import { defaultSearch } from "@/features/services/searchSchema";

const tabs: { key: "all" | RequestStatus; label: string }[] = [
  { key: "all", label: "الكل" },
  { key: "new", label: "جديد" },
  { key: "in_contact", label: "قيد التواصل" },
  { key: "completed", label: "مكتمل" },
  { key: "cancelled", label: "ملغي" },
];

function RequestCard({ request }: { request: ServiceRequest }) {
  return (
    <article className="card-surface p-4 sm:p-5">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-bold text-foreground">{request.categoryName}</h3>
          <p className="text-xs text-muted-foreground">طلب رقم {request.reference}</p>
        </div>
        <StatusBadge status={request.status} />
      </div>

      <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{request.description}</p>

      <dl className="mt-4 grid gap-2 text-xs text-muted-foreground sm:grid-cols-3">
        <div className="flex items-center gap-1.5">
          <MapPin className="size-3.5 shrink-0" />
          {request.locationLabel}
        </div>
        <div className="flex items-center gap-1.5">
          <CalendarDays className="size-3.5 shrink-0" />
          {formatArabicDate(request.createdAt)}
        </div>
        <div className="flex items-center gap-1.5">
          <Phone className="size-3.5 shrink-0" />
          {request.customerPhone}
        </div>
      </dl>

      {request.providerId && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
          <p className="min-w-0 truncate text-sm text-foreground">
            مقدم الخدمة: <span className="font-bold">{request.providerName}</span>
          </p>
          <Button asChild size="sm" variant="soft">
            <Link to="/provider/$id" params={{ id: request.providerId }}>
              عرض الملف
            </Link>
          </Button>
        </div>
      )}
    </article>
  );
}

export function MyRequestsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8 lg:py-12">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <div className="min-w-0">
          <h1 className="text-xl font-extrabold text-foreground sm:text-2xl">طلباتي</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            تابع حالة طلبات الخدمة التي أرسلتها
          </p>
        </div>
        <Button asChild variant="brand" size="sm">
          <Link to="/request-service">طلب جديد</Link>
        </Button>
      </header>

      <Tabs defaultValue="all" className="mt-6">
        <TabsList className="flex w-full flex-wrap justify-start gap-1">
          {tabs.map((t) => (
            <TabsTrigger key={t.key} value={t.key}>
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((t) => {
          const list =
            t.key === "all"
              ? customerRequests
              : customerRequests.filter((r) => r.status === t.key);
          return (
            <TabsContent key={t.key} value={t.key} className="mt-5 space-y-3">
              {list.length ? (
                list.map((r) => <RequestCard key={r.id} request={r} />)
              ) : (
                <EmptyState
                  title="لا توجد طلبات في هذه الحالة"
                  description="عندما ترسل طلب خدمة جديدًا سيظهر هنا مع حالته المحدثة."
                >
                  <Button asChild variant="soft">
                    <Link to="/services" search={defaultSearch}>
                      تصفح مقدمي الخدمة
                    </Link>
                  </Button>
                </EmptyState>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
