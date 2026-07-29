import { createFileRoute } from "@tanstack/react-router";
import { AdminNotificationsPage } from "@/features/admin/pages/AdminNotificationsPage";
import { PermissionGuard } from "@/features/admin/components/PermissionGuard";

export const Route = createFileRoute("/admin/notifications")({
  component: () => (
    <PermissionGuard permission={"notifications.view"}>
      <AdminNotificationsPage />
    </PermissionGuard>
  ),
});
