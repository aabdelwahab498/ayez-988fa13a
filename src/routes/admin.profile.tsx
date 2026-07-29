import { createFileRoute } from "@tanstack/react-router";
import { AdminProfilePage } from "@/features/admin/pages/AdminProfilePage";
import { PermissionGuard } from "@/features/admin/components/PermissionGuard";

export const Route = createFileRoute("/admin/profile")({
  component: () => (
    <PermissionGuard permission={undefined}>
      <AdminProfilePage />
    </PermissionGuard>
  ),
});
