import { createFileRoute } from "@tanstack/react-router";
import { AdminDashboardPage } from "@/features/admin/pages/AdminDashboardPage";
import { PermissionGuard } from "@/features/admin/components/PermissionGuard";

export const Route = createFileRoute("/admin/")({
  component: () => (
    <PermissionGuard permission={undefined}>
      <AdminDashboardPage />
    </PermissionGuard>
  ),
});
