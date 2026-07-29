import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Check, Crown, Globe2, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { formatEGP } from "@/core/utils";
import { useI18n } from "@/features/i18n/I18nProvider";
import {
  marketplaceKeys,
  marketplaceRepository,
} from "@/core/repositories/marketplaceRepository";
import type { SubscriptionPlan, TranslationKeyLike } from "./types";

type Cycle = "monthly" | "yearly";

export function PricingPage() {
  const { t, td, n } = useI18n();
  const [cycle, setCycle] = useState<Cycle>("monthly");

  const { data: plans = [] } = useQuery({
    queryKey: marketplaceKeys.plans(),
    queryFn: () => marketplaceRepository.listPlans(),
  });
  const { data: markets = [] } = useQuery({
    queryKey: marketplaceKeys.markets(),
    queryFn: () => marketplaceRepository.listMarkets(),
  });

  const faqs = useMemo(
    () => [
      { q: t("mkt.pricing.faq.q1"), a: t("mkt.pricing.faq.a1") },
      { q: t("mkt.pricing.faq.q2"), a: t("mkt.pricing.faq.a2") },
      { q: t("mkt.pricing.faq.q3"), a: t("mkt.pricing.faq.a3") },
    ],
    [t],
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8 lg:py-16">
      <header className="mx-auto max-w-2xl text-center">
        <Badge variant="secondary" className="gap-1.5">
          <Sparkles className="size-3.5" aria-hidden />
          {t("mkt.pricing.badge")}
        </Badge>
        <h1 className="mt-4 text-2xl font-extrabold text-foreground sm:text-3xl lg:text-4xl">
          {t("mkt.pricing.title")}
        </h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
          {t("mkt.pricing.subtitle")}
        </p>

        <div
          role="tablist"
          aria-label={t("mkt.pricing.badge")}
          className="mx-auto mt-6 inline-grid grid-cols-2 gap-1 rounded-full border border-border bg-muted p-1"
        >
          {(["monthly", "yearly"] as Cycle[]).map((c) => (
            <button
              key={c}
              role="tab"
              aria-selected={cycle === c}
              onClick={() => setCycle(c)}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-bold transition-colors",
                cycle === c
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {c === "monthly" ? t("mkt.pricing.monthly") : t("mkt.pricing.yearly")}
            </button>
          ))}
        </div>
        {cycle === "yearly" && (
          <p className="mt-2 text-xs font-bold text-accent">{t("mkt.pricing.yearlyHint")}</p>
        )}
      </header>

      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {plans.map((plan: SubscriptionPlan, i: number) => {
          const price = cycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
          return (
            <motion.article
              key={plan.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.07 }}
              className={cn(
                "card-surface relative flex flex-col p-6",
                plan.recommended && "border-accent shadow-elevated lg:-mt-3 lg:pb-8",
              )}
            >
              {plan.recommended && (
                <span className="absolute -top-3 start-6 rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
                  {t("mkt.pricing.recommended")}
                </span>
              )}
              <div className="flex items-center gap-2">
                {plan.tier === "elite" && <Crown className="size-4 text-accent" aria-hidden />}
                <h2 className="text-lg font-extrabold text-foreground">{td(plan.name)}</h2>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{td(plan.tagline)}</p>

              <p className="mt-5 flex items-end gap-2">
                <span className="text-3xl font-extrabold text-foreground">
                  {price === 0 ? t("mkt.pricing.free") : formatEGP(price)}
                </span>
                {price > 0 && (
                  <span className="pb-1 text-xs text-muted-foreground">
                    {cycle === "monthly" ? t("mkt.pricing.perMonth") : t("mkt.pricing.perYear")}
                  </span>
                )}
              </p>

              <ul className="mt-5 space-y-2.5 text-sm">
                <li className="flex items-start gap-2 font-bold text-foreground">
                  <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
                  {plan.leadsPerMonth === "unlimited"
                    ? t("mkt.pricing.leadsUnlimited")
                    : t("mkt.pricing.leads", { count: n(plan.leadsPerMonth) })}
                </li>
                {plan.featuredSlots > 0 && (
                  <li className="flex items-start gap-2 font-bold text-foreground">
                    <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
                    {t("mkt.pricing.featured", { count: n(plan.featuredSlots) })}
                  </li>
                )}
                {plan.featureKeys.map((key: string) => (
                  <li key={key} className="flex items-start gap-2 text-muted-foreground">
                    <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
                    {t(key as TranslationKeyLike)}
                  </li>
                ))}
              </ul>

              <Button
                asChild
                size="lg"
                variant={plan.recommended ? "default" : "soft"}
                className="mt-6 w-full"
              >
                <Link to="/join-provider" search={{ plan: plan.tier }}>
                  {plan.monthlyPrice === 0 ? t("mkt.pricing.ctaFree") : t("mkt.pricing.cta")}
                </Link>
              </Button>
            </motion.article>
          );
        })}
      </div>

      <section className="mt-14">
        <h2 className="flex items-center gap-2 text-lg font-extrabold text-foreground">
          <Globe2 className="size-5 text-brand" aria-hidden />
          {t("mkt.pricing.markets.title")}
        </h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {markets.map((m) => (
            <span
              key={m.code}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-semibold",
                m.live
                  ? "border-success/40 bg-success/10 text-success"
                  : "border-border bg-muted text-muted-foreground",
              )}
            >
              {td(m.name)} ·{" "}
              {m.live ? t("mkt.pricing.markets.live") : t("mkt.pricing.markets.soon")}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-14 mx-auto max-w-3xl">
        <h2 className="text-lg font-extrabold text-foreground">{t("mkt.pricing.faq.title")}</h2>
        <Accordion type="single" collapsible className="mt-4">
          {faqs.map((f, i) => (
            <AccordionItem key={f.q} value={`faq-${i}`}>
              <AccordionTrigger className="text-start text-sm font-bold">{f.q}</AccordionTrigger>
              <AccordionContent className="text-sm leading-7 text-muted-foreground">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  );
}
