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
import { categories, categoryBySlug } from "@/mocks/categories";
import { providerById } from "@/mocks/providers";
import { locationLabel } from "@/core/utils";
import type { EgyptLocation } from "@/core/types";
import { defaultSearch } from "@/features/services/searchSchema";

const routeApi = getRouteApi("/request-service");

export function RequestServicePage() {
  const { provider: providerId, category: presetCategory } = routeApi.useSearch();
  const provider = providerById(providerId);

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
      toast.error("من فضلك أكمل بيانات هذه الخطوة قبل المتابعة");
      return;
    }
    setStep((s) => Math.min(s + 1, REQUEST_STEPS.length - 1));
  };

  const submit = () => {
    setSubmitted(true);
    toast.success("تم إرسال طلبك بنجاح");
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center lg:px-8">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-success-soft text-success">
          <CheckCircle2 className="size-8" />
        </span>
        <h1 className="mt-5 text-2xl font-extrabold text-foreground">تم إرسال طلبك بنجاح</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          رقم الطلب <span className="font-bold text-foreground">REQ-10312</span> — سيتواصل معك
          مقدم الخدمة خلال وقت قصير على الرقم {phone}.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild variant="brand">
            <Link to="/my-requests">متابعة طلباتي</Link>
          </Button>
          <Button asChild variant="soft">
            <Link to="/services" search={defaultSearch}>
              تصفح مقدمي الخدمة
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 lg:px-8 lg:py-12">
      <h1 className="text-xl font-extrabold text-foreground sm:text-2xl">اطلب خدمة</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        {provider
          ? `طلب موجّه إلى ${provider.name}`
          : "أكمل الخطوات وسنوصل طلبك لمقدمي الخدمة المناسبين في منطقتك"}
      </p>

      <RequestStepper steps={REQUEST_STEPS} current={step} className="mt-6" />

      <div className="card-surface mt-6 p-5 sm:p-6">
        {step === 0 && (
          <div className="space-y-3">
            <Label>نوع الخدمة</Label>
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
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-3">
            <Label>موقع تنفيذ الخدمة</Label>
            <EgyptLocationSelector value={location} onChange={setLocation} />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="desc">اشرح المشكلة أو الخدمة المطلوبة</Label>
              <Textarea
                id="desc"
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="مثال: تسريب مياه أسفل حوض المطبخ منذ يومين ويحتاج كشف وإصلاح."
              />
              <p className="text-xs text-muted-foreground">10 أحرف على الأقل</p>
            </div>
            <div className="space-y-2">
              <Label>الوقت المفضل</Label>
              <Select value={preferredTime} onValueChange={setPreferredTime}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asap">في أقرب وقت</SelectItem>
                  <SelectItem value="morning">صباحًا (٩ص - ١٢م)</SelectItem>
                  <SelectItem value="afternoon">ظهرًا (١٢م - ٥م)</SelectItem>
                  <SelectItem value="evening">مساءً (٥م - ٩م)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">الاسم بالكامل</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="أحمد سمير" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">رقم الهاتف</Label>
              <Input
                id="phone"
                inputMode="tel"
                dir="ltr"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0100 123 4567"
              />
            </div>
          </div>
        )}

        {step === 4 && (
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            {[
              ["الخدمة", categoryBySlug(category)?.name ?? "-"],
              ["الموقع", locationLabel(location)],
              ["الوقت المفضل", preferredTime === "asap" ? "في أقرب وقت" : "موعد محدد"],
              ["الاسم", name],
              ["الهاتف", phone],
              ["مقدم الخدمة", provider?.name ?? "سيتم ترشيح الأنسب"],
            ].map(([k, v]) => (
              <div key={k} className="rounded-lg border border-border p-3">
                <dt className="text-xs text-muted-foreground">{k}</dt>
                <dd className="mt-0.5 font-semibold text-foreground">{v}</dd>
              </div>
            ))}
            <div className="rounded-lg border border-border p-3 sm:col-span-2">
              <dt className="text-xs text-muted-foreground">الوصف</dt>
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
            السابق
          </Button>
          {step < REQUEST_STEPS.length - 1 ? (
            <Button variant="brand" onClick={next}>
              التالي
              <ArrowLeft className="size-4" />
            </Button>
          ) : (
            <Button variant="accent" onClick={submit}>
              تأكيد وإرسال الطلب
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
