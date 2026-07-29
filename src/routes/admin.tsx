import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { AdminPage } from "@/features/admin/AdminPage";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "لوحة الإدارة | دليل الخدمات" },
      {
        name: "description",
        content: "إحصائيات المنصة، مراجعة مقدمي الخدمة، ومتابعة الطلبات في جميع المحافظات.",
      },
      { property: "og:title", content: "لوحة إدارة دليل الخدمات" },
      { property: "og:description", content: "متابعة نشاط المنصة والتوثيق والطلبات." },
    ],
  }),
  component: AdminRoute,
});

function AdminRoute() {
  return (
    <AppShell>
      <AdminPage />
    </AppShell>
  );
}
