import { createFileRoute } from "@tanstack/react-router";
import { AdminMarketplacePage } from "@/features/admin/pages/AdminMarketplacePage";
import { PermissionGuard } from "@/features/admin/components/PermissionGuard";

export const Route = createFileRoute("/admin/marketplace")({
  component: () => (
    <PermissionGuard permission={"services.view"}>
      <AdminMarketplacePage />
    </PermissionGuard>
  ),
});
