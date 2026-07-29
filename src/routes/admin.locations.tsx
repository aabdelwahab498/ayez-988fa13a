import { createFileRoute } from "@tanstack/react-router";
import { AdminLocationsPage } from "@/features/admin/pages/AdminLocationsPage";
import { PermissionGuard } from "@/features/admin/components/PermissionGuard";

export const Route = createFileRoute("/admin/locations")({
  component: () => (
    <PermissionGuard permission={"locations.view"}>
      <AdminLocationsPage />
    </PermissionGuard>
  ),
});
