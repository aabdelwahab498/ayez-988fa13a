import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable, type DataTableColumn } from "@/components/common/DataTable";
import { AdminPageHeader } from "../components/AdminPageHeader";
import { useAdminRoles, useAdminTeam } from "@/core/hooks/adminQueries";
import { useI18n } from "@/features/i18n/I18nProvider";
import { useLocalized } from "../lib/format";
import type { AdminUserDTO, RoleDTO } from "@/core/types/admin";

/** Admin team, roles and the permission matrix. */
export function AdminTeamPage() {
  const { t, n } = useI18n();
  const L = useLocalized();
  const { data: team = [], isLoading } = useAdminTeam();
  const { data: roles = [] } = useAdminRoles();

  const memberColumns: DataTableColumn<AdminUserDTO>[] = [
    {
      id: "member",
      header: t("adm.team.col.member"),
      cell: (row) => (
        <div className="min-w-0">
          <p className="truncate font-bold text-foreground">{L(row.name)}</p>
          <p className="truncate text-xs text-muted-foreground">{row.email}</p>
        </div>
      ),
    },
    { id: "role", header: t("adm.team.col.role"), cell: (row) => <Badge variant="secondary">{L(row.roleName)}</Badge> },
    { id: "twofa", header: t("adm.team.col.twofa"), cell: (row) => (row.twoFactorEnabled ? "✓" : "—") },
    { id: "lastLogin", header: t("adm.team.col.lastLogin"), cell: (row) => row.lastLoginAt.slice(0, 10) },
    {
      id: "status",
      header: t("adm.common.status"),
      cell: (row) => <span className="text-sm">{t(`adm.team.status.${row.status}`)}</span>,
    },
  ];

  const roleColumns: DataTableColumn<RoleDTO>[] = [
    {
      id: "role",
      header: t("adm.team.col.role"),
      cell: (row) => (
        <div className="min-w-0">
          <p className="truncate font-bold text-foreground">{L(row.name)}</p>
          <p className="truncate text-xs text-muted-foreground">{L(row.description)}</p>
        </div>
      ),
    },
    { id: "members", header: t("adm.team.col.members"), cell: (row) => n(row.membersCount) },
    { id: "permissions", header: t("adm.team.col.permissions"), cell: (row) => n(row.permissions.length) },
    { id: "system", header: t("adm.common.status"), cell: (row) => (row.system ? t("adm.team.system") : "—") },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader title={t("adm.team.title")} description={t("adm.team.subtitle")} />
      <Tabs defaultValue="members">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="members">{t("adm.team.tab.members")}</TabsTrigger>
          <TabsTrigger value="roles">{t("adm.team.tab.roles")}</TabsTrigger>
          <TabsTrigger value="matrix">{t("adm.team.tab.matrix")}</TabsTrigger>
        </TabsList>
        <TabsContent value="members" className="mt-6">
          <DataTable columns={memberColumns} rows={team} rowKey={(r) => r.id} isLoading={isLoading} />
        </TabsContent>
        <TabsContent value="roles" className="mt-6">
          <DataTable columns={roleColumns} rows={roles} rowKey={(r) => r.id} />
        </TabsContent>
        <TabsContent value="matrix" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            {roles.map((role) => (
              <article key={role.id} className="card-surface p-5">
                <h3 className="font-bold text-foreground">{L(role.name)}</h3>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {role.permissions.map((p) => (
                    <code key={p} className="rounded bg-muted px-1.5 py-0.5 text-[11px] text-foreground">
                      {p}
                    </code>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
