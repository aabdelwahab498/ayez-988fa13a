import { createFileRoute } from "@tanstack/react-router";
import { AdminTeamPage } from "@/features/admin/pages/AdminTeamPage";
import { PermissionGuard } from "@/features/admin/components/PermissionGuard";

export const Route = createFileRoute("/admin/team")({
  component: () => (
    <PermissionGuard permission={"roles.view"}>
      <AdminTeamPage />
    </PermissionGuard>
  ),
});
