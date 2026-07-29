import { createFileRoute } from "@tanstack/react-router";
import { AdminSettingsPage } from "@/features/admin/pages/AdminSettingsPage";
import { PermissionGuard } from "@/features/admin/components/PermissionGuard";

export const Route = createFileRoute("/admin/settings")({
  component: () => (
    <PermissionGuard permission={"settings.view"}>
      <AdminSettingsPage />
    </PermissionGuard>
  ),
});
