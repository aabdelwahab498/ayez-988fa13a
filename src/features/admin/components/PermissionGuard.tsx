import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/features/i18n/I18nProvider";
import { useAdminSession } from "@/features/admin/auth/adminSession";
import type { PermissionKey } from "@/core/types/admin";

interface PermissionGuardProps {
  /** Any one of these permissions unlocks the children. */
  permission?: PermissionKey | PermissionKey[];
  children: ReactNode;
  /** Render nothing instead of the denial card (used for inline controls). */
  silent?: boolean;
  fallback?: ReactNode;
}

/**
 * Permission-based authorization boundary.
 *
 * The backend remains the source of truth — this only prevents the UI from
 * offering actions the current admin cannot perform.
 */
export function PermissionGuard({ permission, children, silent, fallback }: PermissionGuardProps) {
  const { can } = useAdminSession();
  const { t } = useI18n();

  if (can(permission)) return <>{children}</>;
  if (fallback) return <>{fallback}</>;
  if (silent) return null;

  const required = Array.isArray(permission) ? permission.join(" · ") : permission;

  return (
    <div className="card-surface mx-auto max-w-lg p-8 text-center">
      <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <ShieldAlert className="size-6" />
      </div>
      <h2 className="mt-4 text-lg font-extrabold text-foreground">{t("adm.guard.title")}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{t("adm.guard.description")}</p>
      {required && (
        <p className="mt-4 text-xs text-muted-foreground">
          {t("adm.guard.required")}:{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-foreground">{required}</code>
        </p>
      )}
      <Button asChild variant="soft" className="mt-6">
        <Link to="/admin">{t("adm.guard.back")}</Link>
      </Button>
    </div>
  );
}

/** Hides an action when the admin lacks the permission. */
export function Can({
  permission,
  children,
}: {
  permission: PermissionKey | PermissionKey[];
  children: ReactNode;
}) {
  return (
    <PermissionGuard permission={permission} silent>
      {children}
    </PermissionGuard>
  );
}
