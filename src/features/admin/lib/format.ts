/** Shared helpers for rendering admin control-plane data. */
import { useCallback } from "react";
import { useI18n } from "@/features/i18n/I18nProvider";
import { formatEGP } from "@/core/utils";
import type { Localized, MetricUnit } from "@/core/types/admin";

/** Picks the active language out of a `{ ar, en }` pair coming from the API. */
export function useLocalized() {
  const { lang } = useI18n();
  return useCallback((value?: Localized | null) => (value ? value[lang] : ""), [lang]);
}

/** Formats a metric according to its declared unit. */
export function useMetricFormatter() {
  const { n, lang } = useI18n();
  return useCallback(
    (value: number, unit: MetricUnit) => {
      switch (unit) {
        case "currency":
          return formatEGP(value);
        case "percent":
          return `${n(value)}%`;
        case "minutes":
          return lang === "ar" ? `${n(value)} دقيقة` : `${n(value)} min`;
        default:
          return n(value);
      }
    },
    [n, lang],
  );
}
