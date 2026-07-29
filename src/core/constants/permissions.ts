/**
 * Permission catalog and role → permission bundles.
 *
 * The frontend authorizes on **permission strings**, never on role names, so
 * the ASP.NET Core Identity backend can reshape roles without a UI rewrite.
 */
import type {
  AdminRoleKey,
  PermissionDTO,
  PermissionGroup,
  PermissionKey,
} from "@/core/types/admin";

export const PERMISSION_CATALOG: PermissionDTO[] = [
  { key: "users.view", group: "users", label: { ar: "عرض المستخدمين", en: "View users" } },
  { key: "users.create", group: "users", label: { ar: "إنشاء مستخدم", en: "Create user" } },
  { key: "users.update", group: "users", label: { ar: "تعديل مستخدم", en: "Update user" } },
  { key: "users.delete", group: "users", label: { ar: "حذف مستخدم", en: "Delete user" } },
  { key: "users.suspend", group: "users", label: { ar: "إيقاف حساب", en: "Suspend account" } },

  { key: "providers.view", group: "providers", label: { ar: "عرض مقدمي الخدمة", en: "View providers" } },
  { key: "providers.approve", group: "providers", label: { ar: "اعتماد مقدم خدمة", en: "Approve provider" } },
  { key: "providers.reject", group: "providers", label: { ar: "رفض طلب انضمام", en: "Reject application" } },
  { key: "providers.suspend", group: "providers", label: { ar: "إيقاف مقدم خدمة", en: "Suspend provider" } },
  { key: "providers.verify", group: "providers", label: { ar: "توثيق المستندات", en: "Verify documents" } },
  { key: "providers.badge", group: "providers", label: { ar: "منح الشارات", en: "Assign badges" } },

  { key: "services.view", group: "services", label: { ar: "عرض التصنيفات", en: "View taxonomy" } },
  { key: "services.create", group: "services", label: { ar: "إضافة خدمة", en: "Create service" } },
  { key: "services.update", group: "services", label: { ar: "تعديل خدمة", en: "Update service" } },
  { key: "services.delete", group: "services", label: { ar: "حذف خدمة", en: "Delete service" } },

  { key: "locations.view", group: "locations", label: { ar: "عرض المواقع", en: "View locations" } },
  { key: "locations.manage", group: "locations", label: { ar: "إدارة المحافظات والمدن", en: "Manage locations" } },

  { key: "requests.view", group: "requests", label: { ar: "عرض الطلبات", en: "View requests" } },
  { key: "requests.assign", group: "requests", label: { ar: "توزيع الطلبات", en: "Assign requests" } },
  { key: "requests.manage", group: "requests", label: { ar: "إدارة حالة الطلب", en: "Manage requests" } },
  { key: "requests.escalate", group: "requests", label: { ar: "تصعيد ونزاعات", en: "Escalations & disputes" } },

  { key: "subscriptions.view", group: "subscriptions", label: { ar: "عرض الاشتراكات", en: "View subscriptions" } },
  { key: "subscriptions.manage", group: "subscriptions", label: { ar: "إدارة الباقات", en: "Manage plans" } },
  { key: "subscriptions.invoice", group: "subscriptions", label: { ar: "الفواتير", en: "Invoices" } },

  { key: "campaigns.view", group: "campaigns", label: { ar: "عرض الحملات", en: "View campaigns" } },
  { key: "campaigns.create", group: "campaigns", label: { ar: "إنشاء حملة", en: "Create campaign" } },
  { key: "campaigns.update", group: "campaigns", label: { ar: "تعديل حملة", en: "Update campaign" } },
  { key: "campaigns.publish", group: "campaigns", label: { ar: "نشر حملة", en: "Publish campaign" } },

  { key: "integrations.view", group: "integrations", label: { ar: "عرض التكاملات", en: "View integrations" } },
  { key: "integrations.manage", group: "integrations", label: { ar: "إدارة التكاملات", en: "Manage integrations" } },

  { key: "reports.view", group: "reports", label: { ar: "عرض التقارير", en: "View reports" } },
  { key: "reports.export", group: "reports", label: { ar: "تصدير التقارير", en: "Export reports" } },

  { key: "settings.view", group: "settings", label: { ar: "عرض الإعدادات", en: "View settings" } },
  { key: "settings.manage", group: "settings", label: { ar: "تعديل الإعدادات", en: "Manage settings" } },

  { key: "notifications.view", group: "notifications", label: { ar: "عرض القوالب", en: "View templates" } },
  { key: "notifications.manage", group: "notifications", label: { ar: "إدارة الإشعارات", en: "Manage notifications" } },

  { key: "audit.view", group: "audit", label: { ar: "سجل النشاط", en: "Audit log" } },

  { key: "roles.view", group: "roles", label: { ar: "عرض الأدوار", en: "View roles" } },
  { key: "roles.manage", group: "roles", label: { ar: "إدارة الأدوار والصلاحيات", en: "Manage roles" } },
];

export const ALL_PERMISSIONS: PermissionKey[] = PERMISSION_CATALOG.map((p) => p.key);

const VIEW_ONLY = ALL_PERMISSIONS.filter((k) => k.endsWith(".view"));

/** Role bundles. The backend owns the real mapping; this mirrors it for the UI. */
export const ROLE_PERMISSIONS: Record<AdminRoleKey, PermissionKey[]> = {
  super_admin: ALL_PERMISSIONS,
  operations: [
    "users.view",
    "users.update",
    "users.suspend",
    "providers.view",
    "providers.approve",
    "providers.reject",
    "providers.suspend",
    "providers.verify",
    "providers.badge",
    "services.view",
    "locations.view",
    "locations.manage",
    "requests.view",
    "requests.assign",
    "requests.manage",
    "requests.escalate",
    "reports.view",
    "audit.view",
  ],
  moderation: [
    "users.view",
    "users.suspend",
    "providers.view",
    "providers.approve",
    "providers.reject",
    "providers.suspend",
    "providers.verify",
    "requests.view",
    "requests.escalate",
    "audit.view",
  ],
  finance: [
    "users.view",
    "providers.view",
    "subscriptions.view",
    "subscriptions.manage",
    "subscriptions.invoice",
    "campaigns.view",
    "reports.view",
    "reports.export",
    "audit.view",
  ],
  marketing: [
    "services.view",
    "services.update",
    "campaigns.view",
    "campaigns.create",
    "campaigns.update",
    "campaigns.publish",
    "integrations.view",
    "integrations.manage",
    "notifications.view",
    "notifications.manage",
    "reports.view",
    "reports.export",
  ],
  analyst: [...VIEW_ONLY, "reports.export", "audit.view"],
  support: [
    "users.view",
    "providers.view",
    "requests.view",
    "requests.manage",
    "requests.assign",
    "notifications.view",
  ],
};

export const PERMISSION_GROUP_LABELS: Record<PermissionGroup, { ar: string; en: string }> = {
  users: { ar: "المستخدمون", en: "Users" },
  providers: { ar: "مقدمو الخدمة", en: "Providers" },
  services: { ar: "الخدمات والتصنيفات", en: "Services" },
  locations: { ar: "المواقع", en: "Locations" },
  requests: { ar: "الطلبات", en: "Requests" },
  subscriptions: { ar: "الاشتراكات", en: "Subscriptions" },
  campaigns: { ar: "التسويق والإعلانات", en: "Campaigns" },
  integrations: { ar: "التكاملات", en: "Integrations" },
  reports: { ar: "التقارير", en: "Reports" },
  settings: { ar: "الإعدادات", en: "Settings" },
  notifications: { ar: "الإشعارات", en: "Notifications" },
  audit: { ar: "سجل النشاط", en: "Audit" },
  roles: { ar: "الأدوار", en: "Roles" },
};

/** Pure authorization helper shared by guards, navigation and hooks. */
export function checkPermission(
  granted: readonly PermissionKey[],
  required?: PermissionKey | PermissionKey[],
): boolean {
  if (!required) return true;
  const list = Array.isArray(required) ? required : [required];
  return list.some((key) => granted.includes(key));
}
