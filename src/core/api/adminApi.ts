/**
 * Placeholder API service — `/api/v1/admin/*`.
 *
 * Every function documents the future ASP.NET Core endpoint it will call and
 * resolves mock fixtures through `mockRequest` so the UI exercises real
 * loading / error / retry paths today.
 */
import { mockRequest, paginate, type Paginated } from "./http";
import {
  adminRoles,
  adminUsers,
  auditLogs,
  disputes,
  executiveSummary,
  integrations,
  locationCoverage,
  managedUsers,
  notificationTemplates,
  systemSettings,
  taxonomyNodes,
} from "@/mocks/admin";
import { PERMISSION_CATALOG } from "@/core/constants/permissions";
import type {
  AdminUserDTO,
  AuditLogDTO,
  DisputeDTO,
  ExecutiveSummaryDTO,
  IntegrationDTO,
  LocationCoverageDTO,
  ManagedUserDTO,
  NotificationTemplateDTO,
  PermissionDTO,
  RoleDTO,
  SystemSettingDTO,
  TaxonomyNodeDTO,
} from "@/core/types/admin";

export interface AdminListQuery {
  query?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}

export interface ManagedUserQuery extends AdminListQuery {
  type?: ManagedUserDTO["type"] | "all";
  status?: ManagedUserDTO["status"] | "all";
  governorate?: string;
}

export interface AuditLogQuery extends AdminListQuery {
  severity?: AuditLogDTO["severity"] | "all";
  entity?: string;
  actorId?: string;
}

export interface TaxonomyQuery extends AdminListQuery {
  sector?: string;
}

const matches = (haystack: string[], needle?: string) =>
  !needle || haystack.some((v) => v.toLowerCase().includes(needle.trim().toLowerCase()));

function sortRows<T>(rows: T[], sortBy: string | undefined, dir: "asc" | "desc", pick: (row: T, key: string) => unknown) {
  if (!sortBy) return rows;
  const sign = dir === "asc" ? 1 : -1;
  return [...rows].sort((a, b) => {
    const av = pick(a, sortBy);
    const bv = pick(b, sortBy);
    if (typeof av === "number" && typeof bv === "number") return (av - bv) * sign;
    return String(av ?? "").localeCompare(String(bv ?? ""), "ar") * sign;
  });
}

export const adminApi = {
  /* --------------------------------- identity -------------------------------- */

  /** POST /api/v1/admin/auth/login — future: JWT + refresh token pair. */
  login: (email: string): Promise<AdminUserDTO> => {
    const found = adminUsers.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    return mockRequest(found ?? adminUsers[0], 420);
  },

  /** GET /api/v1/admin/auth/me */
  me: (id: string): Promise<AdminUserDTO | undefined> =>
    mockRequest(adminUsers.find((u) => u.id === id)),

  /** GET /api/v1/admin/team */
  team: (): Promise<AdminUserDTO[]> => mockRequest(adminUsers),

  /** GET /api/v1/admin/roles */
  roles: (): Promise<RoleDTO[]> => mockRequest(adminRoles),

  /** GET /api/v1/admin/permissions */
  permissions: (): Promise<PermissionDTO[]> => mockRequest(PERMISSION_CATALOG, 120),

  /* -------------------------------- dashboard -------------------------------- */

  /** GET /api/v1/admin/dashboard/executive */
  executive: (): Promise<ExecutiveSummaryDTO> => mockRequest(executiveSummary, 300),

  /* ----------------------------- user management ----------------------------- */

  /** GET /api/v1/admin/users */
  users: (q: ManagedUserQuery = {}): Promise<Paginated<ManagedUserDTO>> => {
    let rows = managedUsers.filter(
      (u) =>
        matches([u.name.ar, u.name.en, u.email, u.phone], q.query) &&
        (!q.type || q.type === "all" || u.type === q.type) &&
        (!q.status || q.status === "all" || u.status === q.status) &&
        (!q.governorate || q.governorate === "all" || u.governorate.en === q.governorate),
    );
    rows = sortRows(rows, q.sortBy, q.sortDir ?? "desc", (row, key) =>
      key === "name" ? row.name.ar : (row as unknown as Record<string, unknown>)[key],
    );
    return mockRequest(paginate(rows, q.page ?? 1, q.pageSize ?? 8));
  },

  /** PATCH /api/v1/admin/users/{id}/status */
  setUserStatus: (id: string, status: ManagedUserDTO["status"]): Promise<ManagedUserDTO> => {
    const row = managedUsers.find((u) => u.id === id)!;
    row.status = status;
    return mockRequest(row, 260);
  },

  /* -------------------------------- moderation ------------------------------- */

  /** GET /api/v1/admin/disputes */
  disputes: (): Promise<DisputeDTO[]> => mockRequest(disputes),

  /* -------------------------------- audit trail ------------------------------ */

  /** GET /api/v1/admin/audit-logs */
  auditLogs: (q: AuditLogQuery = {}): Promise<Paginated<AuditLogDTO>> => {
    const rows = auditLogs.filter(
      (l) =>
        matches([l.actorName.ar, l.actorName.en, l.action, l.entity, l.entityLabel.ar, l.entityLabel.en], q.query) &&
        (!q.severity || q.severity === "all" || l.severity === q.severity) &&
        (!q.entity || q.entity === "all" || l.entity === q.entity),
    );
    return mockRequest(paginate(rows, q.page ?? 1, q.pageSize ?? 6));
  },

  /* ------------------------------ marketplace ops ---------------------------- */

  /** GET /api/v1/admin/taxonomy */
  taxonomy: (q: TaxonomyQuery = {}): Promise<Paginated<TaxonomyNodeDTO>> => {
    let rows = taxonomyNodes.filter(
      (c) =>
        matches([c.name.ar, c.name.en, c.slug], q.query) &&
        (!q.sector || q.sector === "all" || c.sector === q.sector),
    );
    rows = sortRows(rows, q.sortBy, q.sortDir ?? "desc", (row, key) =>
      key === "name" ? row.name.ar : (row as unknown as Record<string, unknown>)[key],
    );
    return mockRequest(paginate(rows, q.page ?? 1, q.pageSize ?? 8));
  },

  /** GET /api/v1/admin/locations/coverage */
  coverage: (q: AdminListQuery = {}): Promise<Paginated<LocationCoverageDTO>> => {
    let rows = locationCoverage.filter((g) => matches([g.name.ar, g.name.en, g.slug], q.query));
    rows = sortRows(rows, q.sortBy, q.sortDir ?? "desc", (row, key) =>
      key === "name" ? row.name.ar : (row as unknown as Record<string, unknown>)[key],
    );
    return mockRequest(paginate(rows, q.page ?? 1, q.pageSize ?? 9));
  },

  /* ---------------------------------- config --------------------------------- */

  /** GET /api/v1/admin/settings */
  settings: (): Promise<SystemSettingDTO[]> => mockRequest(systemSettings),

  /** PUT /api/v1/admin/settings/{key} */
  saveSetting: (key: string, value: string | number | boolean): Promise<SystemSettingDTO> => {
    const row = systemSettings.find((s) => s.key === key)!;
    row.value = value;
    return mockRequest(row, 240);
  },

  /** GET /api/v1/admin/integrations */
  integrations: (): Promise<IntegrationDTO[]> => mockRequest(integrations),

  /** PUT /api/v1/admin/integrations/{key} */
  saveIntegration: (key: string, values: Record<string, string>): Promise<IntegrationDTO> => {
    const row = integrations.find((i) => i.key === key)!;
    row.values = { ...row.values, ...values };
    row.status = Object.values(row.values).some(Boolean) ? "connected" : "disconnected";
    return mockRequest(row, 320);
  },

  /** GET /api/v1/admin/notification-templates */
  templates: (): Promise<NotificationTemplateDTO[]> => mockRequest(notificationTemplates),

  /** PATCH /api/v1/admin/notification-templates/{id} */
  toggleTemplate: (id: string, enabled: boolean): Promise<NotificationTemplateDTO> => {
    const row = notificationTemplates.find((t) => t.id === id)!;
    row.enabled = enabled;
    return mockRequest(row, 200);
  },
};
