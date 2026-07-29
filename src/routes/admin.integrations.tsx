import { createFileRoute } from "@tanstack/react-router";
import { AdminIntegrationsPage } from "@/features/admin/pages/AdminIntegrationsPage";
import { PermissionGuard } from "@/features/admin/components/PermissionGuard";

export const Route = createFileRoute("/admin/integrations")({
  component: () => (
    <PermissionGuard permission={"integrations.view"}>
      <AdminIntegrationsPage />
    </PermissionGuard>
  ),
});
