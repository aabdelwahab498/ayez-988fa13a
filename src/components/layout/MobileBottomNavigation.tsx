import { Link } from "@tanstack/react-router";
import { Home, Search, PlusCircle, ClipboardList, LayoutDashboard } from "lucide-react";
import { defaultSearch } from "@/features/services/searchSchema";

const items = [
  { to: "/", label: "الرئيسية", icon: Home, exact: true },
  { to: "/services", label: "الخدمات", icon: Search, exact: false },
  { to: "/request-service", label: "اطلب", icon: PlusCircle, exact: false },
  { to: "/my-requests", label: "طلباتي", icon: ClipboardList, exact: false },
  { to: "/provider-dashboard", label: "لوحتي", icon: LayoutDashboard, exact: false },
];

export function MobileBottomNavigation() {
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
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
