/** Role-aware admin navigation. Every entry declares the permission it needs. */
import {
  LayoutDashboard,
  Users,
  BadgeCheck,
  LayoutGrid,
  MapPinned,
  ClipboardList,
  CreditCard,
  Megaphone,
  Plug,
  BarChart3,
  BellRing,
  ScrollText,
  Settings,
  ShieldCheck,
  UserCog,
  type LucideIcon,
} from "lucide-react";
import type { PermissionKey } from "@/core/types/admin";
import type { TranslationKey } from "@/features/i18n/translations";

export type AdminNavGroup = "overview" | "operations" | "growth" | "system";

export interface AdminNavItem {
  to: string;
  labelKey: TranslationKey;
  icon: LucideIcon;
  group: AdminNavGroup;
  /** Any one of these permissions unlocks the entry. */
  permission?: PermissionKey | PermissionKey[];
}

export const ADMIN_NAV: AdminNavItem[] = [
  { to: "/admin", labelKey: "adm.nav.dashboard", icon: LayoutDashboard, group: "overview" },
  { to: "/admin/analytics", labelKey: "adm.nav.analytics", icon: BarChart3, group: "overview", permission: "reports.view" },

  { to: "/admin/users", labelKey: "adm.nav.users", icon: Users, group: "operations", permission: "users.view" },
  { to: "/admin/providers", labelKey: "adm.nav.providers", icon: BadgeCheck, group: "operations", permission: "providers.view" },
  { to: "/admin/requests", labelKey: "adm.nav.requests", icon: ClipboardList, group: "operations", permission: "requests.view" },
  { to: "/admin/marketplace", labelKey: "adm.nav.marketplace", icon: LayoutGrid, group: "operations", permission: "services.view" },
  { to: "/admin/locations", labelKey: "adm.nav.locations", icon: MapPinned, group: "operations", permission: "locations.view" },

  { to: "/admin/subscriptions", labelKey: "adm.nav.subscriptions", icon: CreditCard, group: "growth", permission: "subscriptions.view" },
  { to: "/admin/advertising", labelKey: "adm.nav.advertising", icon: Megaphone, group: "growth", permission: "campaigns.view" },
  { to: "/admin/integrations", labelKey: "adm.nav.integrations", icon: Plug, group: "growth", permission: "integrations.view" },
  { to: "/admin/notifications", labelKey: "adm.nav.notifications", icon: BellRing, group: "growth", permission: "notifications.view" },

  { to: "/admin/team", labelKey: "adm.nav.team", icon: ShieldCheck, group: "system", permission: "roles.view" },
  { to: "/admin/audit", labelKey: "adm.nav.audit", icon: ScrollText, group: "system", permission: "audit.view" },
  { to: "/admin/settings", labelKey: "adm.nav.settings", icon: Settings, group: "system", permission: "settings.view" },
  { to: "/admin/profile", labelKey: "adm.nav.profile", icon: UserCog, group: "system" },
];

export const ADMIN_NAV_GROUPS: { key: AdminNavGroup; labelKey: TranslationKey }[] = [
  { key: "overview", labelKey: "adm.nav.group.overview" },
  { key: "operations", labelKey: "adm.nav.group.operations" },
  { key: "growth", labelKey: "adm.nav.group.growth" },
  { key: "system", labelKey: "adm.nav.group.system" },
];
