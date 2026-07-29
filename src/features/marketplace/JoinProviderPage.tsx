import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, BadgeCheck, BarChart3, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useCategories, useGovernorates, usePlans, useSectors } from "@/core/hooks/queries";
import { formatEGP } from "@/core/utils";
import { useI18n } from "@/features/i18n/I18nProvider";
import { marketplaceRepository } from "@/core/repositories/marketplaceRepository";
import type { PlanTier, TranslationKeyLike } from "./types";

const schema = z.object({
  businessName: z.string().min(3),
  ownerName: z.string().min(3),
  phone: z.string().min(8),
  description: z.string().min(10),
  sector: z.string().min(1),
  categorySlug: z.string().min(1),
  governorate: z.string().min(1),
  city: z.string().optional(),
  planTier: z.string().min(1),
});

type FormValues = z.infer<typeof schema>;

const STEP_KEYS = [
  "mkt.join.step.business",
  "mkt.join.step.activity",
  "mkt.join.step.plan",
  "mkt.join.step.review",
] as const;

const STEP_FIELDS: (keyof FormValues)[][] = [
  ["businessName", "ownerName", "phone", "description"],
  ["sector", "categorySlug", "governorate"],
  ["planTier"],
  [],
];

export function JoinProviderPage({ initialPlan }: { initialPlan: PlanTier }) {
  const { t, td } = useI18n();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [reference, setReference] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: {
      businessName: "",
      ownerName: "",
      phone: "",
      description: "",
      sector: "services",
      categorySlug: "",
      governorate: "",
      city: "",
      planTier: initialPlan,
    },
  });

  const values = form.watch();
  const { data: sectors = [] } = useSectors();
  const { data: categories = [] } = useCategories();
  const { data: governorates = [] } = useGovernorates();
  const { data: subscriptionPlans = [] } = usePlans();
  const sectorCategories = categories.filter((c) => c.sector === values.sector);
  const cities = governorates.find((g) => g.slug === values.governorate)?.cities ?? [];

  const next = async () => {
    const ok = await form.trigger(STEP_FIELDS[step]);
    if (ok) setStep((s) => Math.min(s + 1, STEP_KEYS.length - 1));
  };

  const onSubmit = async (data: FormValues) => {
    const res = await marketplaceRepository.submitApplication(data);
    setReference(res.reference);
  };

  if (reference) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center lg:px-8">
        <CheckCircle2 className="mx-auto size-14 text-success" aria-hidden />
        <h1 className="mt-4 text-2xl font-extrabold text-foreground">
          {t("mkt.join.success.title")}
        </h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          {t("mkt.join.success.desc", { ref: reference })}
        </p>
        <Button className="mt-6" size="lg" onClick={() => navigate({ to: "/" })}>
          {t("mkt.join.success.cta")}
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 lg:px-8 lg:py-14">
      <header className="max-w-2xl">
        <h1 className="text-2xl font-extrabold text-foreground sm:text-3xl">
          {t("mkt.join.title")}
        </h1>
        <p className="mt-2 text-sm leading-7 text-muted-foreground">{t("mkt.join.subtitle")}</p>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="card-surface p-5 sm:p-6">
          <ol className="grid grid-cols-4 gap-2">
            {STEP_KEYS.map((key, i) => (
              <li key={key} className="min-w-0">
                <div
                  className={cn(
                    "h-1.5 rounded-full",
                    i <= step ? "bg-brand" : "bg-muted",
                  )}
                />
                <p
                  className={cn(
                    "mt-2 truncate text-xs font-bold",
                    i <= step ? "text-brand" : "text-muted-foreground",
                  )}
                >
                  {t(key)}
                </p>
              </li>
            ))}
          </ol>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-5">
              <motion.div key={step} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                {step === 0 && (
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="businessName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("mkt.join.field.businessName")}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="ownerName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("mkt.join.field.ownerName")}</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("mkt.join.field.phone")}</FormLabel>
                            <FormControl>
                              <Input inputMode="tel" dir="ltr" className="text-start" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("mkt.join.field.description")}</FormLabel>
                          <FormControl>
                            <Textarea
                              rows={4}
                              placeholder={t("mkt.join.field.descriptionPlaceholder")}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="sector"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("mkt.join.field.sector")}</FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={(v) => {
                              field.onChange(v);
                              form.setValue("categorySlug", "");
                            }}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {sectors.map((s) => (
                                <SelectItem key={s.slug} value={s.slug}>
                                  {td(s.name)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="categorySlug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("mkt.join.field.category")}</FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {sectorCategories.map((c) => (
                                <SelectItem key={c.slug} value={c.slug}>
                                  {td(c.name)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="governorate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("mkt.join.field.governorate")}</FormLabel>
                            <Select
                              value={field.value}
                              onValueChange={(v) => {
                                field.onChange(v);
                                form.setValue("city", "");
                              }}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {governorates.map((g) => (
                                  <SelectItem key={g.slug} value={g.slug}>
                                    {td(g.name)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("mkt.join.field.city")}</FormLabel>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                              disabled={cities.length === 0}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {cities.map((c) => (
                                  <SelectItem key={c.slug} value={c.slug}>
                                    {td(c.name)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="grid gap-3 sm:grid-cols-3">
                    {subscriptionPlans.map((plan) => {
                      const active = values.planTier === plan.tier;
                      return (
                        <button
                          type="button"
                          key={plan.id}
                          onClick={() => form.setValue("planTier", plan.tier)}
                          className={cn(
                            "rounded-xl border p-4 text-start transition-colors",
                            active
                              ? "border-brand bg-brand/5"
                              : "border-border hover:border-brand/50",
                          )}
                        >
                          <p className="font-extrabold text-foreground">{td(plan.name)}</p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {plan.monthlyPrice === 0
                              ? t("mkt.pricing.free")
                              : `${formatEGP(plan.monthlyPrice)} ${t("mkt.pricing.perMonth")}`}
                          </p>
                          <p className="mt-2 text-xs text-muted-foreground">{td(plan.tagline)}</p>
                        </button>
                      );
                    })}
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <h2 className="text-base font-extrabold text-foreground">
                      {t("mkt.join.review.title")}
                    </h2>
                    <dl className="mt-4 divide-y divide-border rounded-xl border border-border">
                      {[
                        [t("mkt.join.field.businessName"), values.businessName],
                        [t("mkt.join.field.ownerName"), values.ownerName],
                        [t("mkt.join.field.phone"), values.phone],
                        [
                          t("mkt.join.field.category"),
                          td(categories.find((c) => c.slug === values.categorySlug)?.name),
                        ],
                        [
                          t("mkt.join.field.governorate"),
                          td(governorates.find((g) => g.slug === values.governorate)?.name),
                        ],
                        [
                          t("mkt.join.selectedPlan"),
                          td(subscriptionPlans.find((p) => p.tier === values.planTier)?.name),
                        ],
                      ].map(([label, value]) => (
                        <div
                          key={label}
                          className="grid grid-cols-[140px_minmax(0,1fr)] gap-3 p-3 text-sm"
                        >
                          <dt className="text-muted-foreground">{label}</dt>
                          <dd className="min-w-0 break-words font-semibold text-foreground">
                            {value || "—"}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                )}
              </motion.div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  disabled={step === 0}
                >
                  {t("mkt.join.back")}
                </Button>
                {step < STEP_KEYS.length - 1 ? (
                  <Button type="button" onClick={next}>
                    {t("mkt.join.next")}
                  </Button>
                ) : (
                  <Button type="submit" size="lg" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting
                      ? t("mkt.join.submitting")
                      : t("mkt.join.submit")}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </div>

        <aside className="space-y-3">
          {(
            [
              ["mkt.join.benefit1", "mkt.join.benefit1.desc", Inbox],
              ["mkt.join.benefit2", "mkt.join.benefit2.desc", BadgeCheck],
              ["mkt.join.benefit3", "mkt.join.benefit3.desc", BarChart3],
            ] as const
          ).map(([titleKey, descKey, Icon]) => (
            <div key={titleKey} className="card-surface flex gap-3 p-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-brand/10 text-brand">
                <Icon className="size-5" aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="font-bold text-foreground">{t(titleKey as TranslationKeyLike)}</p>
                <p className="mt-1 text-xs leading-6 text-muted-foreground">
                  {t(descKey as TranslationKeyLike)}
                </p>
              </div>
            </div>
          ))}
          <Button asChild variant="soft" className="w-full">
            <Link to="/pricing">{t("mkt.home.cta.pricing")}</Link>
          </Button>
        </aside>
      </div>
    </div>
  );
}
