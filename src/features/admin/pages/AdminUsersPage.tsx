import { useState } from "react";
import { Search } from "lucide-react";
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
import { useManagedUsers, useSetUserStatus } from "@/core/hooks/adminQueries";
import { useI18n } from "@/features/i18n/I18nProvider";
import { useLocalized } from "../lib/format";
import { formatEGP } from "@/core/utils";
import type { ManagedUserDTO } from "@/core/types/admin";

/** User management — customers and providers with status control. */
export function AdminUsersPage() {
  const { t, n } = useI18n();
  const L = useLocalized();
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);

  const query = {
    search,
    page,
    pageSize: 8,
    type: type === "all" ? undefined : (type as ManagedUserDTO["type"]),
    status: status === "all" ? undefined : (status as ManagedUserDTO["status"]),
  };
  const { data, isLoading, isError, isFetching, refetch } = useManagedUsers(query);
  const setStatusMutation = useSetUserStatus();

  const statusTone: Record<ManagedUserDTO["status"], string> = {
    active: "bg-success-soft text-success",
    suspended: "bg-destructive/10 text-destructive",
    pending: "bg-accent-orange-soft text-accent-orange",
  };

  const columns: DataTableColumn<ManagedUserDTO>[] = [
    {
      id: "name",
      header: t("adm.users.col.name"),
      cell: (row) => (
        <div className="min-w-0">
          <p className="truncate font-bold text-foreground">{L(row.name)}</p>
          <p className="truncate text-xs text-muted-foreground">{row.email}</p>
        </div>
      ),
    },
    { id: "contact", header: t("adm.users.col.contact"), cell: (row) => <span dir="ltr">{row.phone}</span> },
    {
      id: "type",
      header: t("adm.users.col.type"),
      cell: (row) => <Badge variant="secondary">{t(`adm.users.type.${row.type}`)}</Badge>,
    },
    { id: "governorate", header: t("adm.users.col.governorate"), cell: (row) => L(row.governorate) },
    { id: "requests", header: t("adm.users.col.requests"), cell: (row) => n(row.requestsCount), sortable: false },
    { id: "ltv", header: t("adm.users.col.ltv"), cell: (row) => formatEGP(row.lifetimeValue) },
    {
      id: "status",
      header: t("adm.common.status"),
      cell: (row) => (
        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${statusTone[row.status]}`}>
          {t(`adm.users.status.${row.status}`)}
        </span>
      ),
    },
    {
      id: "actions",
      header: t("adm.common.actions"),
      cell: (row) => (
        <Can permission="users.suspend">
          <Button
            size="sm"
            variant={row.status === "suspended" ? "soft" : "ghost"}
            disabled={setStatusMutation.isPending}
            onClick={() =>
              setStatusMutation.mutate({
                id: row.id,
                status: row.status === "suspended" ? "active" : "suspended",
              })
            }
          >
            {row.status === "suspended" ? t("adm.users.action.activate") : t("adm.users.action.suspend")}
          </Button>
        </Can>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader title={t("adm.users.title")} description={t("adm.users.subtitle")} />

      <DataTable
        columns={columns}
        rows={data?.results ?? []}
        rowKey={(row) => row.id}
        isLoading={isLoading}
        isError={isError}
        isFetching={isFetching}
        onRetry={() => refetch()}
        toolbar={
          <div className="grid w-full gap-2 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
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
              value={type}
              onValueChange={(v) => {
                setType(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="sm:w-44">
                <SelectValue placeholder={t("adm.users.filter.type")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("adm.common.all")}</SelectItem>
                <SelectItem value="customer">{t("adm.users.type.customer")}</SelectItem>
                <SelectItem value="provider">{t("adm.users.type.provider")}</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={status}
              onValueChange={(v) => {
                setStatus(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="sm:w-44">
                <SelectValue placeholder={t("adm.users.filter.status")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("adm.common.all")}</SelectItem>
                <SelectItem value="active">{t("adm.users.status.active")}</SelectItem>
                <SelectItem value="pending">{t("adm.users.status.pending")}</SelectItem>
                <SelectItem value="suspended">{t("adm.users.status.suspended")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
        pagination={{
          page,
          totalPages: Math.max(1, Math.ceil((data?.count ?? 0) / 8)),
          count: data?.count ?? 0,
          pageSize: 8,
          onPageChange: setPage,
        }}
      />
    </div>
  );
}
