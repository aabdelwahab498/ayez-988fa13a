import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ListSkeleton } from "@/components/common/Skeletons";
import { AdminPageHeader, AdminSection } from "../components/AdminPageHeader";
import { useAdminSession } from "../auth/adminSession";
import { useSaveSetting, useSystemSettings } from "@/core/hooks/adminQueries";
import { useI18n } from "@/features/i18n/I18nProvider";
import { useLocalized } from "../lib/format";
import type { SettingGroup, SystemSettingDTO } from "@/core/types/admin";

const GROUPS: SettingGroup[] = ["platform", "brand", "localization", "notifications", "seo", "security"];

/** System settings grouped by domain. */
export function AdminSettingsPage() {
  const { t } = useI18n();
  const { data = [], isLoading } = useSystemSettings();

  return (
    <div className="space-y-8">
      <AdminPageHeader title={t("adm.set.title")} description={t("adm.set.subtitle")} />
      {isLoading ? (
        <ListSkeleton count={5} />
      ) : (
        GROUPS.map((group) => {
          const rows = data.filter((s) => s.group === group);
          if (rows.length === 0) return null;
          return (
            <AdminSection key={group} title={t(`adm.set.group.${group}`)}>
              <div className="card-surface divide-y divide-border">
                {rows.map((setting) => (
                  <SettingRow key={setting.key} setting={setting} />
                ))}
              </div>
            </AdminSection>
          );
        })
      )}
    </div>
  );
}

function SettingRow({ setting }: { setting: SystemSettingDTO }) {
  const L = useLocalized();
  const canManage = useAdminSession().can("settings.manage");
  const save = useSaveSetting();
  const commit = (value: string | number | boolean) => save.mutate({ key: setting.key, value });

  return (
    <div className="grid gap-3 p-4 md:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] md:items-center">
      <div className="min-w-0">
        <Label htmlFor={setting.key} className="font-bold text-foreground">
          {L(setting.label)}
        </Label>
        <p className="mt-1 text-xs text-muted-foreground">{L(setting.help)}</p>
      </div>
      <div>
        {setting.type === "boolean" ? (
          <Switch
            id={setting.key}
            checked={Boolean(setting.value)}
            disabled={!canManage}
            onCheckedChange={commit}
          />
        ) : setting.type === "textarea" ? (
          <Textarea
            id={setting.key}
            defaultValue={String(setting.value)}
            disabled={!canManage}
            onBlur={(e) => commit(e.target.value)}
          />
        ) : setting.type === "select" ? (
          <Select defaultValue={String(setting.value)} disabled={!canManage} onValueChange={commit}>
            <SelectTrigger id={setting.key}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(setting.options ?? []).map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {L(option.label)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Input
            id={setting.key}
            type={setting.type === "number" ? "number" : "text"}
            defaultValue={String(setting.value)}
            disabled={!canManage}
            onBlur={(e) => commit(setting.type === "number" ? Number(e.target.value) : e.target.value)}
          />
        )}
      </div>
    </div>
  );
}
