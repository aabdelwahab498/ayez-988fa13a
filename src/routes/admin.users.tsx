import { createFileRoute } from "@tanstack/react-router";
import { AdminUsersPage } from "@/features/admin/pages/AdminUsersPage";
import { PermissionGuard } from "@/features/admin/components/PermissionGuard";

export const Route = createFileRoute("/admin/users")({
  component: () => (
    <PermissionGuard permission={"users.view"}>
      <AdminUsersPage />
    </PermissionGuard>
  ),
});
