import { Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  Star,
  MapPinned,
  ArrowLeft,
  Search,
  ListChecks,
  Send,
  Briefcase,
} from "lucide-react";
import heroImage from "@/assets/hero-technician.jpg";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/common/Section";
import { SearchBarWidget } from "@/components/business/SearchBarWidget";
import { CategoryCard } from "@/components/business/CategoryCard";
import { ProviderGrid } from "@/components/business/ProviderGrid";
import { categories } from "@/mocks/categories";
import { providers } from "@/mocks/providers";
import { APP_TAGLINE } from "@/core/constants";
import { defaultSearch } from "@/features/services/searchSchema";

const steps = [
  {
    icon: Search,
    title: "اختر الخدمة والمكان",
    text: "حدد نوع الخدمة والمحافظة والمدينة التي تحتاج الخدمة فيها.",
  },
  {
    icon: ListChecks,
    title: "قارن مقدمي الخدمة",
    text: "استعرض التقييمات والأسعار ومناطق التغطية وسرعة الاستجابة.",
  },
  {
    icon: Send,
    title: "أرسل طلبك",
    text: "أرسل تفاصيل طلبك وسيتواصل معك مقدم الخدمة في أسرع وقت.",
  },
];

const trust = [
  {
    icon: ShieldCheck,
    title: "مقدمو خدمة موثقون",
    text: "نتحقق من هوية وخبرة مقدمي الخدمة قبل ظهورهم على المنصة.",
  },
  {
    icon: Star,
    title: "تقييمات حقيقية من العملاء",
    text: "أكثر من 5,000 تقييم من عملاء أتموا خدمات فعلية عبر المنصة.",
  },
  {
    icon: MapPinned,
    title: "تغطية في جميع أنحاء مصر",
    text: "من الإسكندرية إلى أسوان، نغطي 27 محافظة بمقدمي خدمة محليين.",
  },
];

export function HomePage() {
  const featured = providers.filter((p) => p.verified && p.rating >= 4.6).slice(0, 6);

  return (
    <>
      <section className="hero-surface text-brand-foreground">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 lg:grid-cols-2 lg:items-center lg:gap-12 lg:px-8 lg:py-20">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-foreground/20 bg-card/10 px-3 py-1 text-xs font-semibold">
              <ShieldCheck className="size-3.5" />
              منصة الخدمات الأولى في مصر
            </span>
            <h1 className="mt-5 text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
              {APP_TAGLINE}
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-brand-foreground/80 sm:text-base">
              ابحث عن فنيين وشركات خدمات موثقة في جميع محافظات مصر، قارن التقييمات
              والأسعار ومناطق التغطية، وأرسل طلبك في خطوات بسيطة.
            </p>
            <div className="mt-6 flex flex-wrap gap-6 text-sm text-brand-foreground/80">
              <div>
                <p className="text-2xl font-extrabold text-brand-foreground">+٩٦٦</p>
                مقدم خدمة موثق
              </div>
              <div>
                <p className="text-2xl font-extrabold text-brand-foreground">٢٧</p>
                محافظة مغطاة
              </div>
              <div>
                <p className="text-2xl font-extrabold text-brand-foreground">+١٨ ألف</p>
                عميل مسجل
              </div>
            </div>
          </div>

          <div className="relative">
            <img
              src={heroImage}
              alt="فني خدمات مصري محترف داخل شقة سكنية"
              width={1200}
              height={1008}
              className="h-64 w-full rounded-2xl object-cover shadow-elevated sm:h-80 lg:h-[26rem]"
            />
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 pb-12 lg:px-8">
          <SearchBarWidget />
        </div>
      </section>

      <Section
        title="تصفّح الدليل حسب القطاع"
        description="خدمات فنية، عيادات ورعاية صحية، متاجر محلية، نقل وشحن، وخدمات مهنية"
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sectors.map((s) => (
            <SectorCard key={s.slug} sector={s} />
          ))}
        </div>
      </Section>

      <Section
        title="التصنيفات الأكثر بحثًا"
        description="اختر التصنيف الذي تحتاجه وابدأ البحث في محافظتك"
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {popularCategories.map((c) => (
            <CategoryCard key={c.id} category={c} />
          ))}
        </div>
      </Section>


      <Section
        title="مقدمو خدمة موثقون ومميزون"
        description="أعلى مقدمي الخدمة تقييمًا هذا الشهر"
        action={
          <Button asChild variant="soft" size="sm">
            <Link to="/services" search={defaultSearch}>
              عرض الكل
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
        }
      >
        <ProviderGrid providers={featured} />
      </Section>

      <section className="bg-card py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="text-center text-xl font-extrabold text-foreground sm:text-2xl">
            كيف يعمل دليل الخدمات؟
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {steps.map((s, i) => (
              <div key={s.title} className="rounded-xl border border-border bg-background p-6">
                <div className="flex items-center gap-3">
                  <span className="grid size-11 place-items-center rounded-xl bg-brand text-brand-foreground">
                    <s.icon className="size-5" />
                  </span>
                  <span className="text-3xl font-extrabold text-border">
                    {(i + 1).toLocaleString("ar-EG")}
                  </span>
                </div>
                <h3 className="mt-4 text-base font-bold text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Section title="لماذا يثق بنا العملاء؟" description="معايير واضحة لجودة الخدمة">
        <div className="grid gap-4 md:grid-cols-3">
          {trust.map((t) => (
            <div key={t.title} className="card-surface p-6">
              <span className="grid size-11 place-items-center rounded-xl bg-accent-orange-soft text-accent-orange">
                <t.icon className="size-5" />
              </span>
              <h3 className="mt-4 text-base font-bold text-foreground">{t.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <section className="mx-auto max-w-7xl px-4 pb-12 lg:px-8">
        <div className="grid items-center gap-6 rounded-2xl bg-brand p-8 text-brand-foreground md:grid-cols-[minmax(0,1fr)_auto] lg:p-10">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-2 rounded-full bg-card/10 px-3 py-1 text-xs font-semibold">
              <Briefcase className="size-3.5" />
              لمقدمي الخدمة
            </span>
            <h2 className="mt-4 text-xl font-extrabold sm:text-2xl">
              وسّع نشاطك واستقبل طلبات جديدة كل يوم
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-brand-foreground/80">
              انضم إلى آلاف الفنيين والشركات على دليل الخدمات، وحدد مناطق تغطيتك داخل
              محافظتك أو في جميع أنحاء مصر.
            </p>
          </div>
          <Button asChild variant="accent" size="lg">
            <Link to="/provider-dashboard">انضم كمقدم خدمة</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
