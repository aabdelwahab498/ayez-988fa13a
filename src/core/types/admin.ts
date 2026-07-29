/**
 * Admin Control Plane domain models.
 *
 * Shapes mirror the future ASP.NET Core Web API DTOs (see
 * `src/core/contracts/admin.contract.ts`). Nothing here is rendered directly —
 * pages read through `src/core/repositories/adminRepository.ts`.
 */
import type { ID } from "./index";

/** Bilingual label carried by every admin-managed record. */
export interface Localized {
  ar: string;
  en: string;
}

/* ------------------------------- permissions ------------------------------- */

export type PermissionGroup =
  | "users"
  | "providers"
  | "services"
  | "locations"
  | "requests"
  | "subscriptions"
  | "campaigns"
  | "integrations"
  | "reports"
  | "settings"
  | "notifications"
  | "audit"
  | "roles";

export type PermissionKey =
  | "users.view"
  | "users.create"
  | "users.update"
  | "users.delete"
  | "users.suspend"
  | "providers.view"
  | "providers.approve"
  | "providers.reject"
  | "providers.suspend"
  | "providers.verify"
  | "providers.badge"
  | "services.view"
  | "services.create"
  | "services.update"
  | "services.delete"
  | "locations.view"
  | "locations.manage"
  | "requests.view"
  | "requests.assign"
  | "requests.manage"
  | "requests.escalate"
  | "subscriptions.view"
  | "subscriptions.manage"
  | "subscriptions.invoice"
  | "campaigns.view"
  | "campaigns.create"
  | "campaigns.update"
  | "campaigns.publish"
  | "integrations.view"
  | "integrations.manage"
  | "reports.view"
  | "reports.export"
  | "settings.view"
  | "settings.manage"
  | "notifications.view"
  | "notifications.manage"
  | "audit.view"
  | "roles.view"
  | "roles.manage";

export interface PermissionDTO {
  key: PermissionKey;
  group: PermissionGroup;
  label: Localized;
}

export type AdminRoleKey =
  | "super_admin"
  | "operations"
  | "moderation"
  | "finance"
  | "marketing"
  | "analyst"
  | "support";

export interface RoleDTO {
  id: ID;
  key: AdminRoleKey;
  name: Localized;
  description: Localized;
  permissions: PermissionKey[];
  membersCount: number;
  /** System roles cannot be deleted by an admin. */
  system: boolean;
}

/* -------------------------------- admin user ------------------------------- */

export type AdminAccountStatus = "active" | "suspended" | "invited";

export interface AdminUserDTO {
  id: ID;
  name: Localized;
  email: string;
  phone: string;
  roleKey: AdminRoleKey;
  roleName: Localized;
  status: AdminAccountStatus;
  permissions: PermissionKey[];
  twoFactorEnabled: boolean;
  lastLoginAt: string;
  createdAt: string;
  governorate?: string;
}

/* -------------------------------- audit logs ------------------------------- */

export type AuditSeverity = "info" | "warning" | "critical";

export interface AuditLogDTO {
  id: ID;
  actorId: ID;
  actorName: Localized;
  actorRole: AdminRoleKey;
  /** Dotted action key, e.g. `providers.approve`. */
  action: string;
  entity: string;
  entityId: ID;
  entityLabel: Localized;
  field?: string;
  previousValue?: string;
  newValue?: string;
  ipAddress: string;
  userAgent: string;
  severity: AuditSeverity;
  createdAt: string;
}

/* ---------------------------- executive dashboard --------------------------- */

export type MetricUnit = "count" | "currency" | "percent" | "minutes";

export interface DashboardMetricDTO {
  key: string;
  label: Localized;
  value: number;
  unit: MetricUnit;
  /** Percentage change vs the previous period. */
  delta: number;
  trend: "up" | "down" | "flat";
}

export interface RankedRowDTO {
  id: ID;
  label: Localized;
  value: number;
  share: number;
}

export interface TimeseriesPointDTO {
  period: string;
  customers: number;
  providers: number;
  requests: number;
  revenue: number;
}

export interface FunnelStageDTO {
  key: string;
  label: Localized;
  value: number;
  rate: number;
}

export interface ExecutiveSummaryDTO {
  metrics: DashboardMetricDTO[];
  topGovernorates: RankedRowDTO[];
  topServices: RankedRowDTO[];
  series: TimeseriesPointDTO[];
  funnel: FunnelStageDTO[];
  alerts: {
    id: ID;
    label: Localized;
    severity: AuditSeverity;
    count: number;
    href: string;
  }[];
}

/* ------------------------------ user management ----------------------------- */

export type ManagedUserType = "customer" | "provider";
export type ManagedUserStatus = "active" | "suspended" | "pending";

export interface ManagedUserDTO {
  id: ID;
  name: Localized;
  email: string;
  phone: string;
  type: ManagedUserType;
  status: ManagedUserStatus;
  governorate: Localized;
  verified: boolean;
  requestsCount: number;
  lifetimeValue: number;
  joinedAt: string;
  lastActiveAt: string;
}

/* -------------------------------- moderation -------------------------------- */

export type DisputeStatus = "open" | "investigating" | "resolved" | "escalated";

export interface DisputeDTO {
  id: ID;
  reference: string;
  requestReference: string;
  customerName: Localized;
  providerName: Localized;
  reason: Localized;
  status: DisputeStatus;
  amount: number;
  openedAt: string;
  slaHoursLeft: number;
}

/* ------------------------------- system config ------------------------------ */

export type SettingType = "text" | "textarea" | "number" | "boolean" | "select";
export type SettingGroup =
  | "platform"
  | "brand"
  | "localization"
  | "notifications"
  | "seo"
  | "security";

export interface SystemSettingDTO {
  key: string;
  group: SettingGroup;
  label: Localized;
  help: Localized;
  type: SettingType;
  value: string | number | boolean;
  options?: { value: string; label: Localized }[];
}

/* ----------------------------- marketing plumbing ---------------------------- */

export type IntegrationCategory =
  | "analytics"
  | "social"
  | "messaging"
  | "maps"
  | "email"
  | "sms";

export type IntegrationStatus = "connected" | "disconnected" | "error";

export interface IntegrationFieldDTO {
  key: string;
  label: Localized;
  placeholder: string;
  secret?: boolean;
}

export interface IntegrationDTO {
  key: string;
  name: string;
  category: IntegrationCategory;
  description: Localized;
  status: IntegrationStatus;
  fields: IntegrationFieldDTO[];
  values: Record<string, string>;
  lastSyncAt?: string;
}

export type NotificationChannel = "email" | "sms" | "push" | "whatsapp";

export interface NotificationTemplateDTO {
  id: ID;
  name: Localized;
  channel: NotificationChannel;
  trigger: string;
  subject?: Localized;
  body: Localized;
  variables: string[];
  enabled: boolean;
  updatedAt: string;
}

/* --------------------------- marketplace taxonomy --------------------------- */

export interface TaxonomyNodeDTO {
  id: ID;
  name: Localized;
  slug: string;
  sector: string;
  providersCount: number;
  requestsCount: number;
  featured: boolean;
  active: boolean;
}

export interface LocationCoverageDTO {
  id: ID;
  name: Localized;
  slug: string;
  citiesCount: number;
  areasCount: number;
  providersCount: number;
  requestsCount: number;
  active: boolean;
}
