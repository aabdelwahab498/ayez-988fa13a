import { useState } from "react";
import { getRouteApi, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { CheckCircle2, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RequestStepper } from "@/components/common/RequestStepper";
import { EgyptLocationSelector } from "@/components/business/EgyptLocationSelector";
import { REQUEST_STEPS } from "@/core/constants";
import { useCategories, useCreateRequest, useProvider } from "@/core/hooks/queries";
import { locationLabel } from "@/core/utils";
import type { EgyptLocation } from "@/core/types";
import { defaultSearch } from "@/features/services/searchSchema";
import { useI18n } from "@/features/i18n/I18nProvider";

const routeApi = getRouteApi("/request-service");

export function RequestServicePage() {
  const { t, td } = useI18n();
  const { provider: providerId, category: presetCategory } = routeApi.useSearch();
  const { data: provider } = useProvider(providerId || undefined);
  const { data: categories = [] } = useCategories();
  const createRequest = useCreateRequest();

  const stepLabels = [
    t("req.step.service"),
    t("req.step.location"),
    t("req.step.details"),
    t("req.step.contact"),
    t("req.step.confirm"),
  ];

  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [category, setCategory] = useState(presetCategory || provider?.categories[0] || "");
  const [location, setLocation] = useState<EgyptLocation>({ governorate: "" });
  const [description, setDescription] = useState("");
  const [preferredTime, setPreferredTime] = useState("asap");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const canContinue =
    (step === 0 && Boolean(category)) ||
    (step === 1 && Boolean(location.governorate)) ||
    (step === 2 && description.trim().length >= 10) ||
    (step === 3 && name.trim().length >= 3 && phone.trim().length >= 8) ||
    step === 4;

  const next = () => {
    if (!canContinue) {
      toast.error(t("req.toast.incomplete"));
      return;
    }
    setStep((s) => Math.min(s + 1, REQUEST_STEPS.length - 1));
  };

  const [reference, setReference] = useState("");

  const submit = () => {
    createRequest.mutate(
      {
        categorySlug: category,
        governorate: location.governorate,
        city: location.city,
        area: location.area,
        description,
        preferredTime,
        customerName: name,
        customerPhone: phone,
        providerId: providerId || undefined,
      },
      {
        onSuccess: (res) => {
          setReference(res.reference);
          setSubmitted(true);
          toast.success(t("req.toast.success"));
        },
        onError: () => toast.error(t("req.toast.incomplete")),
      },
    );
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center lg:px-8">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-success-soft text-success">
          <CheckCircle2 className="size-8" />
        </span>
        <h1 className="mt-5 text-2xl font-extrabold text-foreground">{t("req.success.title")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("req.success.body", { ref: reference, phone })}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild variant="brand">
            <Link to="/my-requests">{t("req.success.myRequests")}</Link>
          </Button>
          <Button asChild variant="soft">
            <Link to="/services" search={defaultSearch}>
              {t("req.success.browse")}
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 lg:px-8 lg:py-12">
      <h1 className="text-xl font-extrabold text-foreground sm:text-2xl">{t("req.request.title")}</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        {provider
          ? t("req.request.subtitle.forProvider", { name: td(provider.name) })
          : t("req.request.subtitle.default")}
      </p>

      <RequestStepper steps={stepLabels} current={step} className="mt-6" />

      <div className="card-surface mt-6 p-5 sm:p-6">
        {step === 0 && (
          <div className="space-y-3">
            <Label>{t("req.form.serviceType")}</Label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {categories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategory(c.slug)}
                  className={`rounded-xl border p-3 text-sm font-semibold transition-colors ${
                    category === c.slug
                      ? "border-brand bg-brand-soft text-brand"
                      : "border-border bg-card text-foreground hover:border-brand/40"
                  }`}
                >
                  {td(c.name)}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-3">
            <Label>{t("req.form.location")}</Label>
            <EgyptLocationSelector value={location} onChange={setLocation} />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="desc">{t("req.form.descLabel")}</Label>
              <Textarea
                id="desc"
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t("req.form.descPlaceholder")}
              />
              <p className="text-xs text-muted-foreground">{t("req.form.descHint")}</p>
            </div>
            <div className="space-y-2">
              <Label>{t("req.form.timeLabel")}</Label>
              <Select value={preferredTime} onValueChange={setPreferredTime}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asap">{t("req.time.asap")}</SelectItem>
                  <SelectItem value="morning">{t("req.time.morning")}</SelectItem>
                  <SelectItem value="afternoon">{t("req.time.afternoon")}</SelectItem>
                  <SelectItem value="evening">{t("req.time.evening")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">{t("req.form.nameLabel")}</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("req.form.namePlaceholder")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">{t("req.form.phoneLabel")}</Label>
              <Input
                id="phone"
                inputMode="tel"
                dir="ltr"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t("req.form.phonePlaceholder")}
              />
            </div>
          </div>
        )}

        {step === 4 && (
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            {[
              [t("req.summary.service"), td(categories.find((c) => c.slug === category)?.name) || "-"],
              [t("req.summary.location"), locationLabel(location)],
              [
                t("req.summary.time"),
                preferredTime === "asap" ? t("req.summary.timeAsap") : t("req.summary.timeScheduled"),
              ],
              [t("req.summary.name"), name],
              [t("req.summary.phone"), phone],
              [t("req.summary.provider"), provider ? td(provider.name) : t("req.summary.providerTbd")],
            ].map(([k, v]) => (
              <div key={k} className="rounded-lg border border-border p-3">
                <dt className="text-xs text-muted-foreground">{k}</dt>
                <dd className="mt-0.5 font-semibold text-foreground">{v}</dd>
              </div>
            ))}
            <div className="rounded-lg border border-border p-3 sm:col-span-2">
              <dt className="text-xs text-muted-foreground">{t("req.summary.description")}</dt>
              <dd className="mt-0.5 text-foreground">{description}</dd>
            </div>
          </dl>
        )}

        <div className="mt-6 flex items-center justify-between gap-3">
          <Button
            variant="ghost"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
          >
            <ArrowRight className="size-4" />
            {t("req.nav.prev")}
          </Button>
          {step < REQUEST_STEPS.length - 1 ? (
            <Button variant="brand" onClick={next}>
              {t("req.nav.next")}
              <ArrowLeft className="size-4" />
            </Button>
          ) : (
            <Button variant="accent" onClick={submit} disabled={createRequest.isPending}>
              {t("req.nav.submit")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
