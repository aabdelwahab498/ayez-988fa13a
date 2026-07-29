import { createFileRoute } from "@tanstack/react-router";
import { AdminSubscriptionsPage } from "@/features/admin/pages/AdminSubscriptionsPage";
import { PermissionGuard } from "@/features/admin/components/PermissionGuard";

export const Route = createFileRoute("/admin/subscriptions")({
  component: () => (
    <PermissionGuard permission={"subscriptions.view"}>
      <AdminSubscriptionsPage />
    </PermissionGuard>
  ),
});
