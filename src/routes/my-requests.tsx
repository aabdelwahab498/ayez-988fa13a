import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { MyRequestsPage } from "@/features/requests/MyRequestsPage";

export const Route = createFileRoute("/my-requests")({
  head: () => ({
    meta: [
      { title: "طلباتي | دليل الخدمات" },
      {
        name: "description",
        content: "تابع حالة طلبات الخدمة الخاصة بك: جديد، قيد التواصل، مكتمل أو ملغي.",
      },
      { property: "og:title", content: "متابعة طلبات الخدمة" },
      { property: "og:description", content: "كل طلباتك وحالتها في مكان واحد." },
    ],
  }),
  component: MyRequestsRoute,
});

function MyRequestsRoute() {
  return (
    <AppShell>
      <MyRequestsPage />
    </AppShell>
  );
}
