/**
 * Admin Control Plane API contract (ASP.NET Core Web API).
 *
 * Type-only. Mirrors `src/core/types/admin.ts` on the wire; the mapper layer is
 * the only place allowed to translate between the two.
 */
import type { PagedResult } from "./envelope";

export interface LocalizedText {
  ar: string;
  en: string;
}

/* --------------------------------- endpoints -------------------------------- */

export const ADMIN_ENDPOINTS = {
  auth: {
    login: "/admin/auth/login",
    refresh: "/admin/auth/refresh",
    logout: "/admin/auth/logout",
    me: "/admin/auth/me",
    changePassword: "/admin/auth/change-password",
    twoFactorSetup: "/admin/auth/2fa/setup",
  },
  team: {
    list: "/admin/team",
    detail: (id: string) => `/admin/team/${id}`,
    invite: "/admin/team/invite",
    status: (id: string) => `/admin/team/${id}/status`,
  },
  roles: { list: "/admin/roles", detail: (id: string) => `/admin/roles/${id}` },
  permissions: { list: "/admin/permissions" },
  dashboard: {
    executive: "/admin/dashboard/executive",
    growth: "/admin/dashboard/growth",
    revenue: "/admin/dashboard/revenue",
    acquisition: "/admin/dashboard/acquisition",
    demand: "/admin/dashboard/demand",
  },
  users: {
    list: "/admin/users",
    detail: (id: string) => `/admin/users/${id}`,
    status: (id: string) => `/admin/users/${id}/status`,
    history: (id: string) => `/admin/users/${id}/history`,
  },
  providers: {
    list: "/admin/providers",
    applications: "/admin/providers/applications",
    approve: (id: string) => `/admin/providers/${id}/approve`,
    reject: (id: string) => `/admin/providers/${id}/reject`,
    suspend: (id: string) => `/admin/providers/${id}/suspend`,
    verifyDocument: (id: string, docId: string) => `/admin/providers/${id}/documents/${docId}/verify`,
    badges: (id: string) => `/admin/providers/${id}/badges`,
  },
  taxonomy: {
    list: "/admin/taxonomy",
    detail: (id: string) => `/admin/taxonomy/${id}`,
    reorder: "/admin/taxonomy/reorder",
  },
  locations: {
    coverage: "/admin/locations/coverage",
    governorate: (slug: string) => `/admin/locations/governorates/${slug}`,
    availability: "/admin/locations/availability",
  },
  requests: {
    list: "/admin/service-requests",
    assign: (id: string) => `/admin/service-requests/${id}/assign`,
    status: (id: string) => `/admin/service-requests/${id}/status`,
    escalate: (id: string) => `/admin/service-requests/${id}/escalate`,
    disputes: "/admin/disputes",
    disputeResolve: (id: string) => `/admin/disputes/${id}/resolve`,
  },
  subscriptions: {
    plans: "/admin/billing/plans",
    list: "/admin/billing/subscriptions",
    invoices: "/admin/billing/invoices",
  },
  advertising: {
    campaigns: "/admin/ads/campaigns",
    banners: "/admin/ads/banners",
    sponsored: "/admin/ads/sponsored-providers",
    performance: "/admin/ads/performance",
  },
  integrations: {
    list: "/admin/integrations",
    detail: (key: string) => `/admin/integrations/${key}`,
    test: (key: string) => `/admin/integrations/${key}/test`,
  },
  notifications: {
    templates: "/admin/notification-templates",
    template: (id: string) => `/admin/notification-templates/${id}`,
    broadcast: "/admin/notifications/broadcast",
  },
  settings: { list: "/admin/settings", detail: (key: string) => `/admin/settings/${key}` },
  audit: { list: "/admin/audit-logs", export: "/admin/audit-logs/export" },
} as const;

/* ---------------------------------- identity -------------------------------- */

export interface AdminLoginRequestContract {
  email: string;
  password: string;
  twoFactorCode?: string;
  deviceName?: string;
}

export interface AdminLoginResponseContract {
  accessToken: string;
  refreshToken: string;
  expiresInSeconds: number;
  user: AdminUserDtoContract;
}

export interface AdminUserDtoContract {
  id: string;
  name: LocalizedText;
  email: string;
  phone: string;
  roleKey: string;
  roleName: LocalizedText;
  status: "active" | "suspended" | "invited";
  /** Effective permissions = role bundle + per-user overrides, resolved server-side. */
  permissions: string[];
  twoFactorEnabled: boolean;
  lastLoginAtUtc: string;
  createdAtUtc: string;
}

export interface RoleDtoContract {
  id: string;
  key: string;
  name: LocalizedText;
  description: LocalizedText;
  permissions: string[];
  membersCount: number;
  isSystem: boolean;
}

export interface PermissionDtoContract {
  key: string;
  group: string;
  label: LocalizedText;
}

/* --------------------------------- dashboard -------------------------------- */

export interface DashboardMetricDtoContract {
  key: string;
  label: LocalizedText;
  value: number;
  unit: "count" | "currency" | "percent" | "minutes";
  /** Percentage change vs the previous comparable period. */
  delta: number;
  trend: "up" | "down" | "flat";
}

export interface ExecutiveSummaryDtoContract {
  metrics: DashboardMetricDtoContract[];
  topGovernorates: { id: string; label: LocalizedText; value: number; share: number }[];
  topServices: { id: string; label: LocalizedText; value: number; share: number }[];
  series: { period: string; customers: number; providers: number; requests: number; revenue: number }[];
  funnel: { key: string; label: LocalizedText; value: number; rate: number }[];
  alerts: { id: string; label: LocalizedText; severity: string; count: number; href: string }[];
}

/* ------------------------------- administration ----------------------------- */

export interface ManagedUserDtoContract {
  id: string;
  name: LocalizedText;
  email: string;
  phone: string;
  type: "customer" | "provider";
  status: "active" | "suspended" | "pending";
  governorate: LocalizedText;
  isVerified: boolean;
  requestsCount: number;
  /** Minor units (piastres). */
  lifetimeValue: number;
  joinedAtUtc: string;
  lastActiveAtUtc: string;
}

export interface AuditLogDtoContract {
  id: string;
  actorId: string;
  actorName: LocalizedText;
  actorRole: string;
  action: string;
  entity: string;
  entityId: string;
  entityLabel: LocalizedText;
  field?: string | null;
  previousValue?: string | null;
  newValue?: string | null;
  ipAddress: string;
  userAgent: string;
  severity: "info" | "warning" | "critical";
  createdAtUtc: string;
}

export interface SystemSettingDtoContract {
  key: string;
  group: string;
  label: LocalizedText;
  help: LocalizedText;
  type: "text" | "textarea" | "number" | "boolean" | "select";
  value: string | number | boolean;
  options?: { value: string; label: LocalizedText }[];
}

export interface IntegrationDtoContract {
  key: string;
  name: string;
  category: string;
  description: LocalizedText;
  status: "connected" | "disconnected" | "error";
  fields: { key: string; label: LocalizedText; placeholder: string; isSecret: boolean }[];
  /** Secrets are masked server-side; the raw value never leaves the backend. */
  values: Record<string, string>;
  lastSyncAtUtc?: string | null;
}

export interface NotificationTemplateDtoContract {
  id: string;
  name: LocalizedText;
  channel: "email" | "sms" | "push" | "whatsapp";
  trigger: string;
  subject?: LocalizedText | null;
  body: LocalizedText;
  variables: string[];
  isEnabled: boolean;
  updatedAtUtc: string;
}

/* -------------------------------- paged aliases ------------------------------ */

export type PagedManagedUsers = PagedResult<ManagedUserDtoContract>;
export type PagedAuditLogs = PagedResult<AuditLogDtoContract>;
export type PagedAdminUsers = PagedResult<AdminUserDtoContract>;
