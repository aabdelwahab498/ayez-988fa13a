import { Link } from "@tanstack/react-router";
import { Wrench, Phone, Mail, Smartphone } from "lucide-react";
import { APP_NAME } from "@/core/constants";
import { categories } from "@/mocks/categories";
import { defaultSearch } from "@/features/services/searchSchema";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-brand text-brand-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-xl bg-accent-orange text-accent-orange-foreground">
              <Wrench className="size-5" />
            </span>
            <span className="text-lg font-extrabold">{APP_NAME}</span>
          </div>
          <p className="mt-4 text-sm text-brand-foreground/70">
            منصة مصرية تربط العملاء بمقدمي خدمات موثقين في جميع محافظات الجمهورية.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-lg border border-brand-foreground/20 px-3 py-2 text-xs text-brand-foreground/80">
            <Smartphone className="size-4" />
            التطبيق قريبًا على أندرويد و iOS
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold">أشهر الخدمات</h3>
          <ul className="mt-4 space-y-2 text-sm text-brand-foreground/70">
            {categories.slice(0, 6).map((c) => (
              <li key={c.slug}>
                <Link
                  to="/services"
                  search={{ ...defaultSearch, category: c.slug }}
                  className="hover:text-accent-orange"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold">روابط سريعة</h3>
          <ul className="mt-4 space-y-2 text-sm text-brand-foreground/70">
            <li>
              <Link to="/services" className="hover:text-accent-orange">
                تصفح مقدمي الخدمة
              </Link>
            </li>
            <li>
              <Link to="/request-service" className="hover:text-accent-orange">
                اطلب خدمة
              </Link>
            </li>
            <li>
              <Link to="/my-requests" className="hover:text-accent-orange">
                طلباتي
              </Link>
            </li>
            <li>
              <Link to="/provider-dashboard" className="hover:text-accent-orange">
                انضم كمقدم خدمة
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold">تواصل معنا</h3>
          <ul className="mt-4 space-y-3 text-sm text-brand-foreground/70">
            <li className="flex items-center gap-2">
              <Phone className="size-4" />
              16789
            </li>
            <li className="flex items-center gap-2">
              <Mail className="size-4" />
              support@dalil-services.eg
            </li>
            <li>القاهرة الجديدة، جمهورية مصر العربية</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-brand-foreground/15 py-5 text-center text-xs text-brand-foreground/60">
        جميع الحقوق محفوظة © {new Date().getFullYear()} {APP_NAME}
      </div>
    </footer>
  );
}
