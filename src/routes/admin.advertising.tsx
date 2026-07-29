import { createFileRoute } from "@tanstack/react-router";
import { AdminAdvertisingPage } from "@/features/admin/pages/AdminAdvertisingPage";
import { PermissionGuard } from "@/features/admin/components/PermissionGuard";

export const Route = createFileRoute("/admin/advertising")({
  component: () => (
    <PermissionGuard permission={"campaigns.view"}>
      <AdminAdvertisingPage />
    </PermissionGuard>
  ),
});
