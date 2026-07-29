import { Link } from "@tanstack/react-router";
import { Phone, Mail, Smartphone } from "lucide-react";
import { BrandLogo } from "@/components/common/BrandLogo";
import { useI18n } from "@/features/i18n/I18nProvider";
import { categories } from "@/mocks/categories";
import { defaultSearch } from "@/features/services/searchSchema";

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="mt-16 border-t border-border bg-brand text-brand-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-1">
          <BrandLogo tone="invert" />
          <p className="mt-4 text-sm text-brand-foreground/70">
            {t("footer.about")}
          </p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-lg border border-brand-foreground/20 px-3 py-2 text-xs text-brand-foreground/80">
            <Smartphone className="size-4" />
            {t("footer.app")}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold">{t("footer.popular")}</h3>
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
          <h3 className="text-sm font-bold">{t("footer.quickLinks")}</h3>
          <ul className="mt-4 space-y-2 text-sm text-brand-foreground/70">
            <li>
              <Link to="/services" className="hover:text-accent-orange">
                {t("footer.browse")}
              </Link>
            </li>
            <li>
              <Link to="/request-service" className="hover:text-accent-orange">
                {t("nav.request")}
              </Link>
            </li>
            <li>
              <Link to="/my-requests" className="hover:text-accent-orange">
                {t("nav.myRequests")}
              </Link>
            </li>
            <li>
              <Link to="/provider-dashboard" className="hover:text-accent-orange">
                {t("nav.joinProvider")}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold">{t("footer.contact")}</h3>
          <ul className="mt-4 space-y-3 text-sm text-brand-foreground/70">
            <li className="flex items-center gap-2">
              <Phone className="size-4" />
              16789
            </li>
            <li className="flex items-center gap-2">
              <Mail className="size-4" />
              support@dalil-services.eg
            </li>
            <li>{t("footer.address")}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-brand-foreground/15 py-5 text-center text-xs text-brand-foreground/60">
        {t("footer.rights")} {new Date().getFullYear()} {t("app.name")}
      </div>
    </footer>
  );
}
