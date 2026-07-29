import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { DataTable, type DataTableColumn } from "@/components/common/DataTable";
import { AdminPageHeader } from "../components/AdminPageHeader";
import { useAdminSession } from "../auth/adminSession";
import { useNotificationTemplates, useToggleTemplate } from "@/core/hooks/adminQueries";
import { useI18n } from "@/features/i18n/I18nProvider";
import { useLocalized } from "../lib/format";
import type { NotificationTemplateDTO } from "@/core/types/admin";

/** Notification templates across email, SMS, push and WhatsApp. */
export function AdminNotificationsPage() {
  const { t } = useI18n();
  const L = useLocalized();
  const { can } = useAdminSession();
  const canManage = can("notifications.manage");
  const { data = [], isLoading, isError, refetch } = useNotificationTemplates();
  const toggle = useToggleTemplate();

  const columns: DataTableColumn<NotificationTemplateDTO>[] = [
    {
      id: "template",
      header: t("adm.ntf.col.template"),
      cell: (row) => (
        <div className="min-w-0 max-w-md">
          <p className="truncate font-bold text-foreground">{L(row.name)}</p>
          <p className="truncate text-xs text-muted-foreground">{row.subject ? L(row.subject) : L(row.body)}</p>
        </div>
      ),
    },
    {
      id: "channel",
      header: t("adm.ntf.col.channel"),
      cell: (row) => <Badge variant="secondary">{t(`adm.ntf.channel.${row.channel}`)}</Badge>,
    },
    {
      id: "trigger",
      header: t("adm.ntf.col.trigger"),
      cell: (row) => <code className="text-xs text-muted-foreground">{row.trigger}</code>,
    },
    {
      id: "variables",
      header: t("adm.ntf.col.variables"),
      cell: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.variables.map((v) => (
            <code key={v} className="rounded bg-muted px-1.5 py-0.5 text-[11px] text-foreground">
              {`{{${v}}}`}
            </code>
          ))}
        </div>
      ),
    },
    { id: "updated", header: t("adm.ntf.col.updated"), cell: (row) => row.updatedAt.slice(0, 10) },
    {
      id: "enabled",
      header: t("adm.common.status"),
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Switch
            checked={row.enabled}
            disabled={!canManage || toggle.isPending}
            onCheckedChange={(checked) => toggle.mutate({ id: row.id, enabled: checked })}
            aria-label={L(row.name)}
          />
          <span className="text-xs text-muted-foreground">
            {row.enabled ? t("adm.common.enabled") : t("adm.common.disabled")}
          </span>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader title={t("adm.ntf.title")} description={t("adm.ntf.subtitle")} />
      <DataTable
        columns={columns}
        rows={data}
        rowKey={(row) => row.id}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
      />
    </div>
  );
}
