import { createFileRoute } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { AppShell } from "@/components/layout/AppShell";
import { JoinProviderPage } from "@/features/marketplace/JoinProviderPage";
import type { PlanTier } from "@/core/types/marketplace";

const searchSchema = z.object({
  plan: fallback(z.string(), "growth").default("growth"),
});

export const Route = createFileRoute("/join-provider")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "انضم كشريك على منصة عايز" },
      {
        name: "description",
        content:
          "سجّل نشاطك على عايز واستقبل طلبات عملاء حقيقية من محافظتك خلال دقائق مع لوحة تحكم كاملة.",
      },
      { property: "og:title", content: "انضم كشريك على منصة عايز" },
      {
        property: "og:description",
        content: "قدّم طلب انضمام لسوق عايز واحصل على طلبات عملاء مؤهلة.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: JoinProviderRoute,
});

function JoinProviderRoute() {
  const { plan } = Route.useSearch();
  const tier = (["free", "growth", "elite"].includes(plan) ? plan : "growth") as PlanTier;
  return (
    <AppShell>
      <JoinProviderPage initialPlan={tier} />
    </AppShell>
  );
}
