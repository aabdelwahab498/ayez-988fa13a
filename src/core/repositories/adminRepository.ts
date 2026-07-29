/**
 * Admin Control Plane repository.
 *
 * Presentation ➜ Feature ➜ **Repository** ➜ Mock API ➜ (future) ASP.NET Core.
 * Swapping to HTTP means replacing `MockAdminRepository` only.
 */
import {
  adminApi,
  type AdminListQuery,
  type AuditLogQuery,
  type ManagedUserQuery,
  type TaxonomyQuery,
} from "@/core/api/adminApi";
import type { Paginated } from "@/core/api/http";
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

export interface AdminRepository {
  login(email: string, password: string): Promise<AdminUserDTO>;
  me(id: string): Promise<AdminUserDTO | undefined>;
  listTeam(): Promise<AdminUserDTO[]>;
  listRoles(): Promise<RoleDTO[]>;
  listPermissions(): Promise<PermissionDTO[]>;
  executiveSummary(): Promise<ExecutiveSummaryDTO>;
  listUsers(query?: ManagedUserQuery): Promise<Paginated<ManagedUserDTO>>;
  setUserStatus(id: string, status: ManagedUserDTO["status"]): Promise<ManagedUserDTO>;
  listDisputes(): Promise<DisputeDTO[]>;
  listAuditLogs(query?: AuditLogQuery): Promise<Paginated<AuditLogDTO>>;
  listTaxonomy(query?: TaxonomyQuery): Promise<Paginated<TaxonomyNodeDTO>>;
  listCoverage(query?: AdminListQuery): Promise<Paginated<LocationCoverageDTO>>;
  listSettings(): Promise<SystemSettingDTO[]>;
  saveSetting(key: string, value: string | number | boolean): Promise<SystemSettingDTO>;
  listIntegrations(): Promise<IntegrationDTO[]>;
  saveIntegration(key: string, values: Record<string, string>): Promise<IntegrationDTO>;
  listTemplates(): Promise<NotificationTemplateDTO[]>;
  toggleTemplate(id: string, enabled: boolean): Promise<NotificationTemplateDTO>;
}

class MockAdminRepository implements AdminRepository {
  /** Password is accepted but never checked — real verification is backend-side. */
  login(email: string, _password: string) {
    void _password;
    return adminApi.login(email);
  }
  me(id: string) {
    return adminApi.me(id);
  }
  listTeam() {
    return adminApi.team();
  }
  listRoles() {
    return adminApi.roles();
  }
  listPermissions() {
    return adminApi.permissions();
  }
  executiveSummary() {
    return adminApi.executive();
  }
  listUsers(query: ManagedUserQuery = {}) {
    return adminApi.users(query);
  }
  setUserStatus(id: string, status: ManagedUserDTO["status"]) {
    return adminApi.setUserStatus(id, status);
  }
  listDisputes() {
    return adminApi.disputes();
  }
  listAuditLogs(query: AuditLogQuery = {}) {
    return adminApi.auditLogs(query);
  }
  listTaxonomy(query: TaxonomyQuery = {}) {
    return adminApi.taxonomy(query);
  }
  listCoverage(query: AdminListQuery = {}) {
    return adminApi.coverage(query);
  }
  listSettings() {
    return adminApi.settings();
  }
  saveSetting(key: string, value: string | number | boolean) {
    return adminApi.saveSetting(key, value);
  }
  listIntegrations() {
    return adminApi.integrations();
  }
  saveIntegration(key: string, values: Record<string, string>) {
    return adminApi.saveIntegration(key, values);
  }
  listTemplates() {
    return adminApi.templates();
  }
  toggleTemplate(id: string, enabled: boolean) {
    return adminApi.toggleTemplate(id, enabled);
  }
}

export const adminRepository: AdminRepository = new MockAdminRepository();
export type { AdminListQuery, AuditLogQuery, ManagedUserQuery, TaxonomyQuery };
