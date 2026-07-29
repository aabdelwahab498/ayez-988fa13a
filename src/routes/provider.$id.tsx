import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { ProviderDetailsPage } from "@/features/providers/ProviderDetailsPage";
import { providerById } from "@/mocks/providers";

export const Route = createFileRoute("/provider/$id")({
  head: ({ params }) => {
    const provider = providerById(params.id);
    const title = provider
      ? `${provider.name} | دليل الخدمات`
      : "مقدم خدمة غير متاح | دليل الخدمات";
    const description = provider
      ? provider.shortDescription
      : "لم يتم العثور على مقدم الخدمة المطلوب.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: ProviderRoute,
});

function ProviderRoute() {
  return (
    <AppShell>
      <ProviderDetailsPage />
    </AppShell>
  );
}
