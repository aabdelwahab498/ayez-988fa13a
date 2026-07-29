import type { Language } from "@/features/i18n/translations";
import { dataDictionary } from "@/features/i18n/dataDictionary";

/**
 * Module-level current language, kept in sync by <I18nProvider />.
 * Lets pure formatting helpers in @/core/utils stay language aware
 * without threading the locale through every call site.
 */
let currentLang: Language = "ar";

export function setUtilLanguage(lang: Language) {
  currentLang = lang;
}

export function utilLanguage(): Language {
  return currentLang;
}

export function utilLocale(): string {
  return currentLang === "ar" ? "ar-EG" : "en-US";
}

/** Translate a mock-data Arabic string outside React components. */
export function tdRaw(text?: string | null): string {
  if (!text) return "";
  if (currentLang === "ar") return text;
  return dataDictionary[text.trim()] ?? text;
}
