import { Link } from "@tanstack/react-router";
import * as Icons from "lucide-react";
import { ArrowLeft } from "lucide-react";
import type { Sector } from "@/core/types";
import { defaultSearch } from "@/features/services/searchSchema";
import { categoriesBySector } from "@/mocks/categories";
import { useI18n } from "@/features/i18n/I18nProvider";

export function SectorCard({ sector }: { sector: Sector }) {
  const { t, td, n } = useI18n();
  const Icon = (Icons[sector.icon as keyof typeof Icons] ??
    Icons.LayoutGrid) as Icons.LucideIcon;
  const count = categoriesBySector(sector.slug).length;

  return (
    <Link
      to="/services"
      search={{ ...defaultSearch, sector: sector.slug }}
      className="card-surface group flex flex-col p-5 transition-all hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-elevated"
    >
      <span className="grid size-12 place-items-center rounded-xl bg-brand-soft text-brand transition-colors group-hover:bg-accent-orange-soft group-hover:text-accent-orange">
        <Icon className="size-6" />
      </span>
      <h3 className="mt-4 text-base font-bold text-foreground">{td(sector.name)}</h3>
      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{td(sector.description)}</p>
      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand">
        {t("dir.sector.browseCategories", { count: n(count) })}
        <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
      </span>
    </Link>
  );
}
