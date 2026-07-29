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
      { property: "og:title", content: "دليل الخدمات | خدمات منزلية موثقة في مصر" },
      {
        property: "og:description",
        content: "منصة تربطك بمقدمي خدمات موثقين في 27 محافظة مصرية.",
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
