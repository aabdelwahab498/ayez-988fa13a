import { Badge } from "@/components/ui/badge";
import { AdminPageHeader, AdminSection } from "../components/AdminPageHeader";
import { useAdminSession } from "../auth/adminSession";
import { useI18n } from "@/features/i18n/I18nProvider";
import { useLocalized } from "../lib/format";

/** The signed-in admin's account, security posture and effective permissions. */
export function AdminProfilePage() {
  const { t } = useI18n();
  const L = useLocalized();
  const { admin, permissions } = useAdminSession();
  if (!admin) return null;

  const rows = [
    { label: t("adm.login.email"), value: admin.email },
    { label: t("adm.header.role"), value: L(admin.roleName) },
    { label: t("adm.prof.lastLogin"), value: admin.lastLoginAt.slice(0, 16).replace("T", " ") },
    { label: t("adm.prof.createdAt"), value: admin.createdAt.slice(0, 10) },
  ];

  return (
    <div className="space-y-8">
      <AdminPageHeader title={t("adm.prof.title")} description={t("adm.prof.subtitle")} />

      <div className="grid gap-6 lg:grid-cols-2">
        <AdminSection title={t("adm.prof.account")}>
          <dl className="card-surface divide-y divide-border">
            {rows.map((row) => (
              <div key={row.label} className="grid grid-cols-2 gap-3 p-4 text-sm">
                <dt className="text-muted-foreground">{row.label}</dt>
                <dd className="truncate font-bold text-foreground" dir="auto">{row.value}</dd>
              </div>
            ))}
          </dl>
        </AdminSection>

        <AdminSection title={t("adm.prof.security")}>
          <div className="card-surface space-y-3 p-5 text-sm">
            <p className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">{t("adm.prof.twofa")}</span>
              <Badge variant={admin.twoFactorEnabled ? "secondary" : "destructive"}>
                {admin.twoFactorEnabled ? t("adm.common.enabled") : t("adm.common.disabled")}
              </Badge>
            </p>
            <p className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">{t("adm.prof.activity")}</span>
              <span className="font-bold text-foreground">{admin.phone}</span>
            </p>
          </div>
        </AdminSection>
      </div>

      <AdminSection title={t("adm.prof.myPermissions")}>
        <div className="card-surface flex flex-wrap gap-1.5 p-5">
          {permissions.map((permission) => (
            <code key={permission} className="rounded bg-muted px-1.5 py-0.5 text-[11px] text-foreground">
              {permission}
            </code>
          ))}
        </div>
      </AdminSection>
    </div>
  );
}
