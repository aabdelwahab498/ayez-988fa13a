import { Link } from "@tanstack/react-router";
import { Clock, MapPin, CheckCircle2 } from "lucide-react";
import type { Provider } from "@/core/types";
import { Button } from "@/components/ui/button";
import { RatingWidget } from "@/components/common/RatingWidget";
import { VerifiedBadge } from "@/components/common/VerifiedBadge";
import { ServiceCoverageBadge } from "@/components/common/ServiceCoverageBadge";
import { formatPriceRange, formatResponseTime } from "@/core/utils";
import { useCategories } from "@/core/hooks/queries";
import { useI18n } from "@/features/i18n/I18nProvider";

export function ProviderCard({ provider }: { provider: Provider }) {
  const { t, td, n } = useI18n();
  const { data: categories = [] } = useCategories();
  const mainCoverage = provider.canServeNationwide
    ? { scope: "nationwide" as const, label: t("dir.nationwideCoverage") }
    : provider.coverage[0];

  const categoryNames =
    (provider.specialty
      ? provider.specialty.split(" • ").map((part) => td(part)).join(" • ")
      : "") ||
    provider.categories
      .map((slug) => td(categories.find((c) => c.slug === slug)?.name))
      .filter(Boolean)
      .join(" • ");


  return (
    <article className="card-surface flex flex-col p-4 transition-shadow hover:shadow-elevated">
      <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3">
        <img
          src={provider.profileImage}
          alt={t("dir.card.image", { name: td(provider.name) })}
          loading="lazy"
          className="size-16 shrink-0 rounded-xl object-cover"
        />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-base font-bold text-foreground">{td(provider.name)}</h3>
            {provider.verified && <VerifiedBadge />}
          </div>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">{categoryNames}</p>
          <RatingWidget
            className="mt-1.5"
            rating={provider.rating}
            reviewsCount={provider.reviewsCount}
          />
        </div>
      </div>

      <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
        {td(provider.shortDescription)}
      </p>

      {mainCoverage && (
        <div className="mt-3">
          <ServiceCoverageBadge coverage={mainCoverage} />
        </div>
      )}

      <dl className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Clock className="size-3.5 shrink-0" />
          <span className="truncate">{formatResponseTime(provider.responseTimeMinutes)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {provider.availableNow ? (
            <>
              <CheckCircle2 className="size-3.5 shrink-0 text-success" />
              <span className="text-success">{t("dir.card.availableNow")}</span>
            </>
          ) : (
            <>
              <MapPin className="size-3.5 shrink-0" />
              <span className="truncate">
                {t("dir.card.completedServices", { count: n(provider.completedJobs) })}
              </span>
            </>
          )}
        </div>
      </dl>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-3">
        <div className="min-w-0">
          <p className="text-[11px] text-muted-foreground">{t("dir.card.price")}</p>
          <p className="truncate text-sm font-bold text-foreground">
            {formatPriceRange(provider.priceFrom, provider.priceTo)}
          </p>
        </div>
        <Button asChild size="sm" variant="brand">
          <Link to="/provider/$id" params={{ id: provider.id }}>
            {t("dir.card.viewProfile")}
          </Link>
        </Button>
      </div>
    </article>
  );
}
