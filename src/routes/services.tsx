import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { ServicesPage } from "@/features/services/ServicesPage";
import { validateServicesSearch } from "@/features/services/searchSchema";

export const Route = createFileRoute("/services")({
  validateSearch: validateServicesSearch,
  head: () => ({
    meta: [
      { title: "ابحث عن مقدمي الخدمات في مصر | دليل الخدمات" },
      {
        name: "description",
        content:
          "قارن مقدمي الخدمات حسب نوع الخدمة والمحافظة والمدينة والتقييم والسعر وسرعة الاستجابة.",
      },
      { property: "og:title", content: "نتائج البحث عن مقدمي الخدمات" },
      {
        property: "og:description",
        content: "تصفية دقيقة حسب المحافظة والمدينة والتقييم والسعر.",
      },
    ],
  }),
  component: ServicesRoute,
});

function ServicesRoute() {
  return (
    <AppShell>
      <ServicesPage />
    </AppShell>
  );
}
