import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, ShieldCheck, LayoutDashboard, LogOut, UserRound } from "lucide-react";
import { BrandLogo } from "@/components/common/BrandLogo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { APP_NAME, PUBLIC_NAV } from "@/core/constants";
import { useI18n } from "@/features/i18n/I18nProvider";
import { LanguageToggle, ThemeToggle } from "./AppearanceControls";
import { useMockAuth } from "@/features/auth/useMockAuth";

function BrandMark() {
  return (
    <Link to="/" className="flex shrink-0 items-center" aria-label={APP_NAME}>
      <BrandLogo />
    </Link>
  );
}

export function PublicHeader() {
  const [open, setOpen] = useState(false);
  const { user, role, signInAs, signOut } = useMockAuth();
  const { t } = useI18n();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 lg:px-8">
        <div className="flex min-w-0 items-center gap-8">
          <BrandMark />
          <nav className="hidden items-center gap-6 lg:flex">
            {PUBLIC_NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                activeProps={{ className: "text-brand font-bold" }}
                inactiveProps={{ className: "text-muted-foreground" }}
                className="text-sm transition-colors hover:text-brand"
              >
                {t(item.labelKey)}
              </Link>
            ))}
            <Link
              to="/provider-dashboard"
              className="text-sm text-muted-foreground transition-colors hover:text-brand"
            >
              {t("nav.joinProvider")}
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <LanguageToggle />
          <ThemeToggle />
          <div className="hidden lg:block">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <UserRound className="size-4" />
                    {user.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuLabel>{t("auth.demoAccount")}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/my-requests">{t("nav.myRequests")}</Link>
                  </DropdownMenuItem>
                  {(role === "provider" || role === "admin") && (
                    <DropdownMenuItem asChild>
                      <Link to="/provider-dashboard">
                        <LayoutDashboard className="size-4" />
                        {t("nav.providerDashboard")}
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin">
                        <ShieldCheck className="size-4" />
                        {t("nav.adminDashboard")}
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="size-4" />
                    {t("auth.signOut")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    {t("auth.signIn")}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuLabel>{t("auth.signInAs")}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signInAs("customer")}>{t("auth.customer")}</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => signInAs("provider")}>
                    {t("auth.provider")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => signInAs("admin")}>{t("auth.admin")}</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <Button asChild variant="accent" size="sm" className="hidden sm:inline-flex">
            <Link to="/request-service">{t("nav.request")}</Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label={t("nav.menu")}>
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="text-right">{APP_NAME}</SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-1">
                {[...PUBLIC_NAV, { to: "/provider-dashboard", labelKey: "nav.providerDashboard" as const }, { to: "/admin", labelKey: "nav.adminDashboard" as const }].map(
                  (item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setOpen(false)}
                      className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-secondary"
                    >
                      {t(item.labelKey)}
                    </Link>
                  ),
                )}
              </nav>
              <div className="mt-6 space-y-2 border-t border-border pt-4">
                {user ? (
                  <>
                    <p className="text-sm text-muted-foreground">{t("auth.signedInAs")} {user.name}</p>
                    <Button variant="outline" className="w-full" onClick={signOut}>
                      {t("auth.signOut")}
                    </Button>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground">{t("auth.demoLogin")}</p>
                    <div className="grid grid-cols-3 gap-2">
                      <Button variant="secondary" size="sm" onClick={() => signInAs("customer")}>
                        {t("auth.customer")}
                      </Button>
                      <Button variant="secondary" size="sm" onClick={() => signInAs("provider")}>
                        {t("auth.providerShort")}
                      </Button>
                      <Button variant="secondary" size="sm" onClick={() => signInAs("admin")}>
                        {t("auth.admin")}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
