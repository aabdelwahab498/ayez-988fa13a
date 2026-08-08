import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { HomePage } from "@/features/home/HomePage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "دليل الخدمات | أفضل الخدمات بالقرب منك في جميع محافظات مصر" },
      {
        name: "description",
        content:
          "ابحث عن سباك أو كهربائي أو فني تكييف موثق في محافظتك، قارن التقييمات والأسعار وأرسل طلب الخدمة في دقائق.",
      },
      { property: "og:title", content: "دليل الخدمات | أفضل الخدمات بالقرب منك في جميع محافظات مصر" },
      {
        property: "og:description",
        content: "ابحث عن سباك أو كهربائي أو فني تكييف موثق في محافظتك، قارن التقييمات والأسعار وأرسل طلب الخدمة في دقائق.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <AppShell>
      <HomePage />
    </AppShell>
  );
}
