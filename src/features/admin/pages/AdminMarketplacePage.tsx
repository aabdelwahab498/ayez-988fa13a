import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable, type DataTableColumn } from "@/components/common/DataTable";
import { AdminPageHeader } from "../components/AdminPageHeader";
import { Can } from "../components/PermissionGuard";
import { useAdminTaxonomy } from "@/core/hooks/adminQueries";
import { useI18n } from "@/features/i18n/I18nProvider";
import { useLocalized } from "../lib/format";
import type { TaxonomyNodeDTO } from "@/core/types/admin";

const SECTORS = ["services", "medical", "stores", "transport", "professional"];
const PAGE_SIZE = 8;

/** Marketplace taxonomy: sectors, categories and featured flags. */
export function AdminMarketplacePage() {
  const { t, n } = useI18n();
  const L = useLocalized();
  const [search, setSearch] = useState("");
  const [sector, setSector] = useState("all");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, isFetching, refetch } = useAdminTaxonomy({
    query: search,
    page,
    pageSize: PAGE_SIZE,
    sector: sector === "all" ? undefined : sector,
  });

  const columns: DataTableColumn<TaxonomyNodeDTO>[] = [
    {
      id: "name",
      header: t("adm.tax.col.name"),
      cell: (row) => <span className="font-bold text-foreground">{L(row.name)}</span>,
    },
    { id: "slug", header: t("adm.tax.col.slug"), cell: (row) => <code className="text-xs text-muted-foreground">{row.slug}</code> },
    { id: "sector", header: t("adm.tax.col.sector"), cell: (row) => <Badge variant="secondary">{row.sector}</Badge> },
    { id: "providers", header: t("adm.tax.col.providers"), cell: (row) => n(row.providersCount) },
    { id: "requests", header: t("adm.tax.col.requests"), cell: (row) => n(row.requestsCount) },
    {
      id: "featured",
      header: t("adm.tax.col.featured"),
      cell: (row) => (
        <span className={row.featured ? "font-bold text-accent-orange" : "text-muted-foreground"}>
          {row.featured ? t("adm.tax.featured.yes") : t("adm.tax.featured.no")}
        </span>
      ),
    },
    {
      id: "status",
      header: t("adm.common.status"),
      cell: (row) => (
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${
            row.active ? "bg-success-soft text-success" : "bg-secondary text-muted-foreground"
          }`}
        >
          {row.active ? t("adm.tax.status.active") : t("adm.tax.status.inactive")}
        </span>
      ),
    },
    {
      id: "actions",
      header: t("adm.common.actions"),
      cell: () => (
        <Can permission="services.update">
          <Button size="sm" variant="ghost">
            {t("adm.common.edit")}
          </Button>
        </Can>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={t("adm.tax.title")}
        description={t("adm.tax.subtitle")}
        actions={
          <Can permission="services.create">
            <Button className="gap-2">
              <Plus className="size-4" />
              {t("adm.tax.newCategory")}
            </Button>
          </Can>
        }
      />

      <DataTable
        columns={columns}
        rows={data?.results ?? []}
        rowKey={(row) => row.id}
        isLoading={isLoading}
        isError={isError}
        isFetching={isFetching}
        onRetry={() => refetch()}
        toolbar={
          <div className="grid w-full gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute inset-y-0 start-3 my-auto size-4 text-muted-foreground" />
              <Input
                className="ps-9"
                value={search}
                placeholder={t("adm.common.search")}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <Select
              value={sector}
              onValueChange={(v) => {
                setSector(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="sm:w-52">
                <SelectValue placeholder={t("adm.tax.filter.sector")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("adm.common.all")}</SelectItem>
                {SECTORS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        }
        pagination={{
          page,
          totalPages: Math.max(1, Math.ceil((data?.count ?? 0) / PAGE_SIZE)),
          count: data?.count ?? 0,
          pageSize: PAGE_SIZE,
          onPageChange: setPage,
        }}
      />
    </div>
  );
}
