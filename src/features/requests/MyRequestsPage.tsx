import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Phone, MapPin, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/common/StatusBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { QueryBoundary } from "@/components/common/QueryBoundary";
import { ListSkeleton } from "@/components/common/Skeletons";
import { PaginationControls } from "@/components/common/PaginationControls";
import { useMyRequests } from "@/core/hooks/queries";
import type { RequestStatus, ServiceRequest } from "@/core/types";
import { defaultSearch } from "@/features/services/searchSchema";
import { useI18n } from "@/features/i18n/I18nProvider";

function RequestCard({ request }: { request: ServiceRequest }) {
  const { t, td, lang } = useI18n();
  const formattedDate = new Intl.DateTimeFormat(lang === "ar" ? "ar-EG" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(request.createdAt));

  return (
    <article className="card-surface p-4 sm:p-5">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-bold text-foreground">{td(request.categoryName)}</h3>
          <p className="text-xs text-muted-foreground">
            {t("req.card.reference", { ref: request.reference })}
          </p>
        </div>
        <StatusBadge status={request.status} />
      </div>

      <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{td(request.description)}</p>

      <dl className="mt-4 grid gap-2 text-xs text-muted-foreground sm:grid-cols-3">
        <div className="flex items-center gap-1.5">
          <MapPin className="size-3.5 shrink-0" />
          {td(request.locationLabel)}
        </div>
        <div className="flex items-center gap-1.5">
          <CalendarDays className="size-3.5 shrink-0" />
          {formattedDate}
        </div>
        <div className="flex items-center gap-1.5">
          <Phone className="size-3.5 shrink-0" />
          {request.customerPhone}
        </div>
      </dl>

      {request.providerId && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
          <p className="min-w-0 truncate text-sm text-foreground">
            {t("req.card.provider", { name: td(request.providerName) })}
          </p>
          <Button asChild size="sm" variant="soft">
            <Link to="/provider/$id" params={{ id: request.providerId }}>
              {t("req.card.viewProfile")}
            </Link>
          </Button>
        </div>
      )}
    </article>
  );
}

export function MyRequestsPage() {
  const { t } = useI18n();
  const [tab, setTab] = useState<"all" | RequestStatus>("all");
  const [page, setPage] = useState(1);
  const query = useMyRequests(page, tab === "all" ? undefined : tab);
  const result = query.data;
  const list = result?.results ?? [];

  const tabs: { key: "all" | RequestStatus; label: string }[] = [
    { key: "all", label: t("req.tabs.all") },
    { key: "new", label: t("req.tabs.new") },
    { key: "in_contact", label: t("req.tabs.inContact") },
    { key: "completed", label: t("req.tabs.completed") },
    { key: "cancelled", label: t("req.tabs.cancelled") },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8 lg:py-12">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <div className="min-w-0">
          <h1 className="text-xl font-extrabold text-foreground sm:text-2xl">
            {t("req.myRequests.title")}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">{t("req.myRequests.subtitle")}</p>
        </div>
        <Button asChild variant="brand" size="sm">
          <Link to="/request-service">{t("req.myRequests.newRequest")}</Link>
        </Button>
      </header>

      <Tabs
        value={tab}
        onValueChange={(v) => {
          setTab(v as "all" | RequestStatus);
          setPage(1);
        }}
        className="mt-6"
      >
        <TabsList className="flex w-full flex-wrap justify-start gap-1">
          {tabs.map((item) => (
            <TabsTrigger key={item.key} value={item.key}>
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((item) => (
          <TabsContent key={item.key} value={item.key} className="mt-5 space-y-3">
            <QueryBoundary
              isLoading={query.isPending}
              isError={query.isError}
              isEmpty={list.length === 0}
              onRetry={() => query.refetch()}
              skeleton={<ListSkeleton count={3} />}
              emptyTitle={t("req.empty.title")}
              emptyDescription={t("req.empty.description")}
              emptyAction={
                <Button asChild variant="soft">
                  <Link to="/services" search={defaultSearch}>
                    {t("req.empty.browse")}
                  </Link>
                </Button>
              }
            >
              <div className={query.isFetching ? "space-y-3 opacity-60" : "space-y-3"}>
                {list.map((r) => (
                  <RequestCard key={r.id} request={r} />
                ))}
              </div>
              {result && (
                <PaginationControls
                  page={result.page}
                  totalPages={result.totalPages}
                  count={result.count}
                  pageSize={result.pageSize}
                  isFetching={query.isFetching}
                  onPageChange={setPage}
                />
              )}
            </QueryBoundary>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
