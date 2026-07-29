import { createFileRoute } from "@tanstack/react-router";
import { AdminRequestsPage } from "@/features/admin/pages/AdminRequestsPage";
import { PermissionGuard } from "@/features/admin/components/PermissionGuard";

export const Route = createFileRoute("/admin/requests")({
  component: () => (
    <PermissionGuard permission={"requests.view"}>
      <AdminRequestsPage />
    </PermissionGuard>
  ),
});
