import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, ShieldCheck, LayoutDashboard, LogOut, UserRound, Wrench } from "lucide-react";
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
import { useMockAuth } from "@/features/auth/useMockAuth";

function BrandMark() {
  return (
    <Link to="/" className="flex shrink-0 items-center gap-2">
      <span className="grid size-9 place-items-center rounded-xl bg-brand text-brand-foreground">
        <Wrench className="size-5" />
      </span>
      <span className="text-lg font-extrabold text-foreground">{APP_NAME}</span>
    </Link>
  );
}

export function PublicHeader() {
  const [open, setOpen] = useState(false);
  const { user, role, signInAs, signOut } = useMockAuth();

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
                {item.label}
              </Link>
            ))}
            <Link
              to="/provider-dashboard"
              className="text-sm text-muted-foreground transition-colors hover:text-brand"
            >
              انضم كمقدم خدمة
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
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
                  <DropdownMenuLabel>حسابي التجريبي</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/my-requests">طلباتي</Link>
                  </DropdownMenuItem>
                  {(role === "provider" || role === "admin") && (
                    <DropdownMenuItem asChild>
                      <Link to="/provider-dashboard">
                        <LayoutDashboard className="size-4" />
                        لوحة مقدم الخدمة
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin">
                        <ShieldCheck className="size-4" />
                        لوحة الإدارة
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="size-4" />
                    تسجيل الخروج
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    تسجيل الدخول
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuLabel>الدخول كـ (وضع تجريبي)</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signInAs("customer")}>عميل</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => signInAs("provider")}>
                    مقدم خدمة
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => signInAs("admin")}>مسؤول</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <Button asChild variant="accent" size="sm" className="hidden sm:inline-flex">
            <Link to="/request-service">اطلب خدمة</Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="القائمة">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="text-right">{APP_NAME}</SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-1">
                {[...PUBLIC_NAV, { to: "/provider-dashboard", label: "لوحة مقدم الخدمة" }, { to: "/admin", label: "لوحة الإدارة" }].map(
                  (item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setOpen(false)}
                      className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-secondary"
                    >
                      {item.label}
                    </Link>
                  ),
                )}
              </nav>
              <div className="mt-6 space-y-2 border-t border-border pt-4">
                {user ? (
                  <>
                    <p className="text-sm text-muted-foreground">مسجل الدخول: {user.name}</p>
                    <Button variant="outline" className="w-full" onClick={signOut}>
                      تسجيل الخروج
                    </Button>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground">الدخول التجريبي</p>
                    <div className="grid grid-cols-3 gap-2">
                      <Button variant="secondary" size="sm" onClick={() => signInAs("customer")}>
                        عميل
                      </Button>
                      <Button variant="secondary" size="sm" onClick={() => signInAs("provider")}>
                        مقدم
                      </Button>
                      <Button variant="secondary" size="sm" onClick={() => signInAs("admin")}>
                        مسؤول
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
