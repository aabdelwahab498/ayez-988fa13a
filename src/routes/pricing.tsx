import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PricingPage } from "@/features/marketplace/PricingPage";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "باقات الاشتراك للشركاء | عايز" },
      {
        name: "description",
        content:
          "اختر الباقة المناسبة لنشاطك على منصة عايز: طلبات عملاء مؤهلة، ظهور مميز، وتحليلات أداء في كل محافظات مصر.",
      },
      { property: "og:title", content: "باقات الاشتراك للشركاء | عايز" },
      {
        property: "og:description",
        content: "باقات مرنة لمقدمي الخدمات والعيادات والمتاجر على سوق عايز.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <AppShell>
      <PricingPage />
    </AppShell>
  ),
});
