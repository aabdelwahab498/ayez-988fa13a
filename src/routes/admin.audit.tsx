import { createFileRoute } from "@tanstack/react-router";
import { AdminAuditPage } from "@/features/admin/pages/AdminAuditPage";
import { PermissionGuard } from "@/features/admin/components/PermissionGuard";

export const Route = createFileRoute("/admin/audit")({
  component: () => (
    <PermissionGuard permission={"audit.view"}>
      <AdminAuditPage />
    </PermissionGuard>
  ),
});
