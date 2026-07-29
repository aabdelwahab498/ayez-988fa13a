import { Languages, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/features/i18n/I18nProvider";
import { useTheme } from "@/features/theme/ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useI18n();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={t("theme.toggle")}
      title={theme === "dark" ? t("theme.light") : t("theme.dark")}
    >
      {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
    </Button>
  );
}

export function LanguageToggle() {
  const { lang, toggleLang, t } = useI18n();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLang}
      aria-label={t("lang.toggle")}
      className="gap-1.5 font-semibold"
    >
      <Languages className="size-4" />
      {lang === "ar" ? "EN" : "ع"}
    </Button>
  );
}
