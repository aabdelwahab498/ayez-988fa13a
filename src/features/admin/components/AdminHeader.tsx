import { Link } from "@tanstack/react-router";
import { Bell, ExternalLink, LogOut, Menu, Search, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LanguageToggle, ThemeToggle } from "@/components/layout/AppearanceControls";
import { useI18n } from "@/features/i18n/I18nProvider";
import { useAdminSession } from "@/features/admin/auth/adminSession";
import { useLocalized } from "@/features/admin/lib/format";

/** Admin top bar: global search, alerts, appearance, identity and sign-out. */
export function AdminHeader({ onOpenMenu, alertCount }: { onOpenMenu: () => void; alertCount: number }) {
  const { t, n } = useI18n();
  const { admin, signOut } = useAdminSession();
  const L = useLocalized();

  const initials = (admin ? L(admin.name) : "AY").slice(0, 2);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b border-border bg-card/95 px-3 backdrop-blur sm:gap-3 sm:px-5">
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={onOpenMenu} aria-label={t("adm.header.openMenu")}>
        <Menu className="size-5" />
      </Button>

      <div className="relative hidden min-w-0 flex-1 md:block">
        <Search className="pointer-events-none absolute inset-y-0 start-3 my-auto size-4 text-muted-foreground" />
        <Input
          className="ps-9"
          placeholder={t("adm.header.searchPlaceholder")}
          aria-label={t("adm.common.search")}
        />
      </div>
      <div className="flex-1 md:hidden" />

      <Button asChild variant="ghost" size="sm" className="hidden gap-2 sm:inline-flex">
        <Link to="/">
          <ExternalLink className="size-4" />
          <span className="hidden lg:inline">{t("adm.header.backToSite")}</span>
        </Link>
      </Button>

      <Button variant="ghost" size="icon" className="relative" aria-label={`${n(alertCount)} ${t("adm.header.alerts")}`}>
        <Bell className="size-5" />
        {alertCount > 0 && (
          <span className="absolute -top-0.5 -end-0.5 grid size-4 place-items-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
            {alertCount}
          </span>
        )}
      </Button>

      <span className="flex items-center gap-1"><LanguageToggle /><ThemeToggle /></span>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="gap-2 px-1.5 sm:px-2">
            <Avatar className="size-8">
              <AvatarFallback className="bg-brand-soft text-xs font-bold text-brand">{initials}</AvatarFallback>
            </Avatar>
            <span className="hidden min-w-0 text-start lg:block">
              <span className="block truncate text-sm font-bold text-foreground">{admin ? L(admin.name) : ""}</span>
              <span className="block truncate text-[11px] text-muted-foreground">
                {admin ? L(admin.roleName) : ""}
              </span>
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-60">
          <DropdownMenuLabel className="space-y-1">
            <p className="truncate text-sm font-bold">{admin ? L(admin.name) : ""}</p>
            <p className="truncate text-xs font-normal text-muted-foreground">{admin?.email}</p>
            <Badge variant="secondary" className="mt-1 gap-1">
              <ShieldCheck className="size-3" />
              {admin ? L(admin.roleName) : ""}
            </Badge>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/admin/profile">{t("adm.nav.profile")}</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/">{t("adm.header.backToSite")}</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => signOut()} className="text-destructive focus:text-destructive">
            <LogOut className="size-4" />
            {t("adm.header.signOut")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
