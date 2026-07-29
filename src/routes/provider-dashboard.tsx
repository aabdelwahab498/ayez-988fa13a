import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { ProviderDashboardPage } from "@/features/dashboard/ProviderDashboardPage";

export const Route = createFileRoute("/provider-dashboard")({
  head: () => ({
    meta: [
      { title: "لوحة تحكم مقدم الخدمة | دليل الخدمات" },
      {
        name: "description",
        content: "أدر طلباتك الواردة وخدماتك وأسعارك ومناطق تغطيتك داخل محافظات مصر.",
      },
      { property: "og:title", content: "لوحة تحكم مقدم الخدمة" },
      { property: "og:description", content: "طلبات، أسعار، تغطية، وتقييمات في مكان واحد." },
    ],
  }),
  component: ProviderDashboardRoute,
});

function ProviderDashboardRoute() {
  return (
    <AppShell>
      <ProviderDashboardPage />
    </AppShell>
  );
}
