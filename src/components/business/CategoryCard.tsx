import { Link } from "@tanstack/react-router";
import * as Icons from "lucide-react";
import type { Category } from "@/core/types";
import { defaultSearch } from "@/features/services/searchSchema";

export function CategoryCard({ category }: { category: Category }) {
  const Icon = (Icons[category.icon as keyof typeof Icons] ??
    Icons.Wrench) as Icons.LucideIcon;

  return (
    <Link
      to="/services"
      search={{ ...defaultSearch, category: category.slug }}
      className="card-surface group flex flex-col items-center gap-3 p-4 text-center transition-all hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-elevated sm:p-5"
    >
      <span className="grid size-12 place-items-center rounded-xl bg-brand-soft text-brand transition-colors group-hover:bg-accent-orange-soft group-hover:text-accent-orange">
        <Icon className="size-6" />
      </span>
      <span className="font-bold text-foreground">{category.name}</span>
      <span className="text-xs text-muted-foreground">
        {category.providersCount.toLocaleString("ar-EG")} مقدم خدمة
      </span>
    </Link>
  );
}
