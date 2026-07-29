import { Link, useRouterState } from "@tanstack/react-router";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/common/BrandLogo";
import { useI18n } from "@/features/i18n/I18nProvider";
import { useAdminSession } from "@/features/admin/auth/adminSession";
import { ADMIN_NAV, ADMIN_NAV_GROUPS } from "@/features/admin/adminNav";

/**
 * Role-aware admin navigation. Entries the current admin cannot access are
 * never rendered, so the sidebar always reflects the permission bundle.
 */
export function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { t } = useI18n();
  const { can, admin } = useAdminSession();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const isActive = (to: string) => (to === "/admin" ? pathname === "/admin" : pathname.startsWith(to));

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center justify-between gap-2 border-b border-sidebar-border px-4 py-4">
        <Link to="/admin" onClick={onNavigate} className="flex items-center gap-3">
          <BrandLogo size="sm" />
          <span className="min-w-0">
            <span className="block truncate text-sm font-extrabold">{t("adm.brand")}</span>
            <span className="block truncate text-xs text-sidebar-foreground/60">{t("adm.brand.sub")}</span>
          </span>
        </Link>
        {onNavigate && (
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onNavigate}
            aria-label={t("adm.header.closeMenu")}
          >
            <X className="size-4" />
          </Button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label={t("adm.brand")}>
        {ADMIN_NAV_GROUPS.map((group) => {
          const items = ADMIN_NAV.filter((i) => i.group === group.key && can(i.permission));
          if (items.length === 0) return null;
          return (
            <div key={group.key} className="mb-5">
              <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wide text-sidebar-foreground/50">
                {t(group.labelKey)}
              </p>
              <ul className="space-y-0.5">
                {items.map((item) => {
                  const active = isActive(item.to);
                  return (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        onClick={onNavigate}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
                          active
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-sidebar-foreground/75 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                        )}
                      >
                        <item.icon className="size-4 shrink-0" />
                        <span className="min-w-0 truncate">{t(item.labelKey)}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border px-4 py-3 text-xs text-sidebar-foreground/60">
        <p className="truncate font-semibold text-sidebar-foreground">{admin?.email}</p>
        <p className="mt-0.5 truncate">
          {t("adm.header.role")}: {admin?.roleKey}
        </p>
      </div>
    </div>
  );
}
