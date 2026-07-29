import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/EmptyState";
import { useI18n } from "@/features/i18n/I18nProvider";
import {
  marketplaceKeys,
  marketplaceRepository,
} from "@/core/repositories/marketplaceRepository";
import type { TranslationKeyLike } from "@/features/marketplace/types";

/** Provider onboarding approvals queue. */
export function ApprovalsPanel() {
  const { t, td } = useI18n();
  const { data: apps = [] } = useQuery({
    queryKey: marketplaceKeys.applications(),
    queryFn: () => marketplaceRepository.listApplications(),
  });

  if (apps.length === 0) {
    return <EmptyState title={t("mkt.admin.approvals.empty")} />;
  }

  return (
    <section>
      <h2 className="text-lg font-extrabold text-foreground">{t("mkt.admin.approvals.title")}</h2>
      <ul className="mt-4 grid gap-3 md:grid-cols-2">
        {apps.map((app) => (
          <li key={app.id} className="card-surface p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-extrabold text-foreground">{td(app.businessName)}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {td(app.categoryName)} • {td(app.governorate)}
                </p>
              </div>
              <Badge
                variant={
                  app.status === "approved"
                    ? "default"
                    : app.status === "rejected"
                      ? "destructive"
                      : "secondary"
                }
              >
                {t(`mkt.app.status.${app.status}` as TranslationKeyLike)}
              </Badge>
            </div>

            <p className="mt-3 text-xs text-muted-foreground">
              {td(app.ownerName)} • <span dir="ltr">{app.phone}</span>
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {app.documents.map((doc) => (
                <span
                  key={doc}
                  className="rounded-md bg-muted px-2 py-1 text-[11px] text-muted-foreground"
                >
                  {td(doc)}
                </span>
              ))}
            </div>

            {(app.status === "pending" || app.status === "in_review") && (
              <div className="mt-4 flex gap-2">
                <Button size="sm">{t("mkt.admin.approvals.approve")}</Button>
                <Button size="sm" variant="outline">
                  {t("mkt.admin.approvals.reject")}
                </Button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
