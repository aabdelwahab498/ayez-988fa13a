/**
 * Admin control-plane query hooks.
 *
 * Same contract as `src/core/hooks/queries.ts`: components never touch the
 * repository directly, and every mutation invalidates the admin cache root so
 * the audit trail and dashboards stay consistent.
 */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adminRepository,
  type AdminListQuery,
  type AuditLogQuery,
  type ManagedUserQuery,
  type TaxonomyQuery,
} from "@/core/repositories/adminRepository";
import { adminKeys } from "@/core/repositories/queryKeys";
import type { ManagedUserDTO } from "@/core/types/admin";

const STATIC = { staleTime: 5 * 60 * 1000 };
const KEEP = { placeholderData: <T,>(prev: T) => prev };

export function useExecutiveSummary() {
  return useQuery({ queryKey: adminKeys.executive(), queryFn: () => adminRepository.executiveSummary() });
}

export function useAdminTeam() {
  return useQuery({ queryKey: adminKeys.team(), queryFn: () => adminRepository.listTeam(), ...STATIC });
}

export function useAdminRoles() {
  return useQuery({ queryKey: adminKeys.roles(), queryFn: () => adminRepository.listRoles(), ...STATIC });
}

export function useAdminPermissions() {
  return useQuery({ queryKey: adminKeys.permissions(), queryFn: () => adminRepository.listPermissions(), ...STATIC });
}

export function useManagedUsers(query: ManagedUserQuery) {
  return useQuery({
    queryKey: adminKeys.users(query),
    queryFn: () => adminRepository.listUsers(query),
    ...KEEP,
  });
}

export function useSetUserStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ManagedUserDTO["status"] }) =>
      adminRepository.setUserStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: adminKeys.all }),
  });
}

export function useDisputes() {
  return useQuery({ queryKey: adminKeys.disputes(), queryFn: () => adminRepository.listDisputes() });
}

export function useAuditLogs(query: AuditLogQuery) {
  return useQuery({
    queryKey: adminKeys.auditLogs(query),
    queryFn: () => adminRepository.listAuditLogs(query),
    ...KEEP,
  });
}

export function useAdminTaxonomy(query: TaxonomyQuery) {
  return useQuery({
    queryKey: adminKeys.taxonomy(query),
    queryFn: () => adminRepository.listTaxonomy(query),
    ...KEEP,
  });
}

export function useAdminCoverage(query: AdminListQuery) {
  return useQuery({
    queryKey: adminKeys.coverage(query),
    queryFn: () => adminRepository.listCoverage(query),
    ...KEEP,
  });
}

export function useSystemSettings() {
  return useQuery({ queryKey: adminKeys.settings(), queryFn: () => adminRepository.listSettings() });
}

export function useSaveSetting() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ key, value }: { key: string; value: string | number | boolean }) =>
      adminRepository.saveSetting(key, value),
    onSuccess: () => qc.invalidateQueries({ queryKey: adminKeys.settings() }),
  });
}

export function useIntegrations() {
  return useQuery({ queryKey: adminKeys.integrations(), queryFn: () => adminRepository.listIntegrations() });
}

export function useSaveIntegration() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ key, values }: { key: string; values: Record<string, string> }) =>
      adminRepository.saveIntegration(key, values),
    onSuccess: () => qc.invalidateQueries({ queryKey: adminKeys.integrations() }),
  });
}

export function useNotificationTemplates() {
  return useQuery({ queryKey: adminKeys.templates(), queryFn: () => adminRepository.listTemplates() });
}

export function useToggleTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, enabled }: { id: string; enabled: boolean }) =>
      adminRepository.toggleTemplate(id, enabled),
    onSuccess: () => qc.invalidateQueries({ queryKey: adminKeys.templates() }),
  });
}
