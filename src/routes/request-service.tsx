import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { AppShell } from "@/components/layout/AppShell";
import { RequestServicePage } from "@/features/requests/RequestServicePage";

const searchSchema = z.object({
  provider: fallback(z.string(), "").default(""),
  category: fallback(z.string(), "").default(""),
});

export const Route = createFileRoute("/request-service")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "اطلب خدمة الآن | دليل الخدمات" },
      {
        name: "description",
        content: "أرسل تفاصيل الخدمة التي تحتاجها وموقعك، وسيتواصل معك مقدمو خدمة موثقون.",
      },
      { property: "og:title", content: "اطلب خدمة الآن" },
      { property: "og:description", content: "خمس خطوات بسيطة لإرسال طلب خدمة في أي محافظة." },
    ],
  }),
  component: RequestRoute,
});

function RequestRoute() {
  return (
    <AppShell>
      <RequestServicePage />
    </AppShell>
  );
}
