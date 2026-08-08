import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { translations, type Language, type TranslationKey } from "./translations";
import { dataDictionary } from "./dataDictionary";
import { setUtilLanguage } from "@/core/utils/locale";

const STORAGE_KEY = "ayez-language";

interface I18nContextValue {
  lang: Language;
  dir: "rtl" | "ltr";
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  /** UI string by key, with optional {placeholders} */
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
  /** Translate a mock-data Arabic string (category, city, provider name...) */
  td: (text?: string | null) => string;
  /** Locale aware number formatting */
  n: (value: number) => string;
  locale: string;
}

const I18nContext = createContext<I18nContextValue | null>(null);
console.log("DBG i18n module eval", Math.random());

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("ar");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "ar") setLangState(stored);
  }, []);

  useEffect(() => {
    const dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang]);

  const setLang = useCallback((next: Language) => {
    setLangState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const value = useMemo<I18nContextValue>(() => {
    setUtilLanguage(lang);
    const dict = translations[lang];
    const locale = lang === "ar" ? "ar-EG" : "en-US";
    return {
      lang,
      locale,
      dir: lang === "ar" ? "rtl" : "ltr",
      setLang,
      toggleLang: () => setLang(lang === "ar" ? "en" : "ar"),
      t: (key: TranslationKey, vars?: Record<string, string | number>) => {
        const raw = dict[key] ?? translations.ar[key] ?? key;
        if (!vars) return raw;
        return Object.entries(vars).reduce(
          (acc, [k, v]) => acc.replaceAll(`{${k}}`, String(v)),
          raw,
        );
      },
      td: (text?: string | null) => {
        if (!text) return "";
        if (lang === "ar") return text;
        return dataDictionary[text.trim()] ?? text;
      },
      n: (value: number) => value.toLocaleString(locale),
    };
  }, [lang, setLang]);

  console.log("DBG provider render");
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
