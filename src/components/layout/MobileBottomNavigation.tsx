import { Link } from "@tanstack/react-router";
import { Home, Search, PlusCircle, ClipboardList, LayoutDashboard } from "lucide-react";
import { defaultSearch } from "@/features/services/searchSchema";
import { useI18n } from "@/features/i18n/I18nProvider";

const items = [
  { to: "/", labelKey: "nav.mobile.home" as const, icon: Home, exact: true },
  { to: "/services", labelKey: "nav.mobile.directory" as const, icon: Search, exact: false },
  { to: "/request-service", labelKey: "nav.mobile.request" as const, icon: PlusCircle, exact: false },
  { to: "/my-requests", labelKey: "nav.mobile.myRequests" as const, icon: ClipboardList, exact: false },
  { to: "/provider-dashboard", labelKey: "nav.mobile.dashboard" as const, icon: LayoutDashboard, exact: false },
];

export function MobileBottomNavigation() {
  const { t } = useI18n();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
      <ul className="grid grid-cols-5">
        {items.map((item) => (
          <li key={item.to}>
            <Link
              to={item.to}
              search={item.to === "/services" ? defaultSearch : undefined}
              activeOptions={{ exact: item.exact }}
              activeProps={{ className: "text-brand" }}
              inactiveProps={{ className: "text-muted-foreground" }}
              className="flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium"
            >
              <item.icon className="size-5" />
              {t(item.labelKey)}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
