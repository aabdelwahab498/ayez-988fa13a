import { createFileRoute } from "@tanstack/react-router";
import { AdminAnalyticsPage } from "@/features/admin/pages/AdminAnalyticsPage";
import { PermissionGuard } from "@/features/admin/components/PermissionGuard";

export const Route = createFileRoute("/admin/analytics")({
  component: () => (
    <PermissionGuard permission={"reports.view"}>
      <AdminAnalyticsPage />
    </PermissionGuard>
  ),
});
