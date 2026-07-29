import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { ServicesPage } from "@/features/services/ServicesPage";
import { validateServicesSearch } from "@/features/services/searchSchema";

export const Route = createFileRoute("/services")({
  validateSearch: validateServicesSearch,
  head: () => ({
    meta: [
      { title: "دليل الخدمات والعيادات والمتاجر في مصر | بحث بالموقع" },
      {
        name: "description",
        content:
          "ابحث في دليل مصر الشامل: خدمات فنية، عيادات وتخصصات طبية، متاجر، شركات نقل وشحن، وخدمات مهنية — حسب التصنيف والمحافظة والتقييم والسعر.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "نتائج البحث في دليل الخدمات" },
      {
        property: "og:description",
        content: "تصفية دقيقة حسب القطاع والتخصص والمحافظة والمدينة والتقييم.",
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
