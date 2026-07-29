import { useState } from "react";
import { Loader2, Lock, Plug } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ListSkeleton } from "@/components/common/Skeletons";
import { AdminPageHeader } from "../components/AdminPageHeader";
import { useAdminSession } from "../auth/adminSession";
import { useIntegrations, useSaveIntegration } from "@/core/hooks/adminQueries";
import { useI18n } from "@/features/i18n/I18nProvider";
import { useLocalized } from "../lib/format";
import { cn } from "@/lib/utils";
import type { IntegrationDTO } from "@/core/types/admin";

/** Marketing & platform integrations (Meta Pixel, GTM, WhatsApp, Maps...). */
export function AdminIntegrationsPage() {
  const { t } = useI18n();
  const { data = [], isLoading } = useIntegrations();

  return (
    <div className="space-y-6">
      <AdminPageHeader title={t("adm.int.title")} description={t("adm.int.subtitle")} />
      {isLoading ? (
        <ListSkeleton count={4} />
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {data.map((integration) => (
            <IntegrationCard key={integration.key} integration={integration} />
          ))}
        </div>
      )}
    </div>
  );
}

function IntegrationCard({ integration }: { integration: IntegrationDTO }) {
  const { t } = useI18n();
  const L = useLocalized();
  const canManage = useAdminSession().can("integrations.manage");
  const save = useSaveIntegration();
  const [values, setValues] = useState<Record<string, string>>(integration.values);

  const statusTone = {
    connected: "bg-success-soft text-success",
    disconnected: "bg-secondary text-muted-foreground",
    error: "bg-destructive/10 text-destructive",
  } as const;

  return (
    <form
      className="card-surface p-5"
      onSubmit={(e) => {
        e.preventDefault();
        save.mutate({ key: integration.key, values });
      }}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
            <Plug className="size-5" />
          </span>
          <div className="min-w-0">
            <h3 className="truncate font-bold text-foreground">{integration.name}</h3>
            <p className="text-xs text-muted-foreground">{t(`adm.int.category.${integration.category}`)}</p>
          </div>
        </div>
        <span className={cn("rounded-full px-2.5 py-1 text-xs font-bold", statusTone[integration.status])}>
          {integration.status === "connected"
            ? t("adm.common.connected")
            : integration.status === "error"
              ? t("adm.common.error")
              : t("adm.common.disconnected")}
        </span>
      </div>

      <p className="mt-3 text-sm text-muted-foreground">{L(integration.description)}</p>

      <div className="mt-4 space-y-3">
        {integration.fields.map((field) => (
          <div key={field.key} className="space-y-1.5">
            <Label htmlFor={`${integration.key}-${field.key}`} className="flex items-center gap-1.5">
              {L(field.label)}
              {field.secret && <Lock className="size-3 text-muted-foreground" />}
            </Label>
            <Input
              id={`${integration.key}-${field.key}`}
              value={values[field.key] ?? ""}
              placeholder={field.placeholder}
              disabled={!canManage}
              dir="ltr"
              onChange={(e) => setValues((prev) => ({ ...prev, [field.key]: e.target.value }))}
            />
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          {integration.lastSyncAt ? `${t("adm.common.lastSync")}: ${integration.lastSyncAt}` : t("adm.int.secretNote")}
        </p>
        {canManage ? (
          <Button type="submit" size="sm" disabled={save.isPending} className="gap-2">
            {save.isPending && <Loader2 className="size-4 animate-spin" />}
            {save.isPending ? t("adm.common.saving") : t("adm.common.save")}
          </Button>
        ) : (
          <Badge variant="secondary">{t("adm.common.readOnly")}</Badge>
        )}
      </div>
    </form>
  );
}
