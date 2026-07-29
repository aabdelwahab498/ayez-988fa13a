import { createFileRoute } from "@tanstack/react-router";
import { AdminProvidersPage } from "@/features/admin/pages/AdminProvidersPage";
import { PermissionGuard } from "@/features/admin/components/PermissionGuard";

export const Route = createFileRoute("/admin/providers")({
  component: () => (
    <PermissionGuard permission={"providers.view"}>
      <AdminProvidersPage />
    </PermissionGuard>
  ),
});
