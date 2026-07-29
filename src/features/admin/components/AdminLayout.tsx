import { useEffect, useState } from "react";
import { Outlet } from "@tanstack/react-router";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { adminSession, useAdminSession } from "@/features/admin/auth/adminSession";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { AdminLoginScreen } from "./AdminLoginScreen";
import { useExecutiveSummary } from "@/core/hooks/adminQueries";
import { StatsSkeleton } from "@/components/common/Skeletons";

/**
 * Admin control-plane shell.
 *
 * Renders the sign-in surface inline until an admin session exists, so the
 * `/admin/*` URL never changes and no protected data is fetched beforehand.
 */
export function AdminLayout() {
  const { isAuthenticated } = useAdminSession();
  const [restoring, setRestoring] = useState(!adminSession.isRestored());
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let alive = true;
    adminSession.restore().finally(() => {
      if (alive) setRestoring(false);
    });
    return () => {
      alive = false;
    };
  }, []);

  if (restoring) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16">
        <StatsSkeleton />
      </div>
    );
  }

  if (!isAuthenticated) return <AdminLoginScreen />;

  return <AdminShell menuOpen={menuOpen} setMenuOpen={setMenuOpen} />;
}

function AdminShell({
  menuOpen,
  setMenuOpen,
}: {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}) {
  const { data: summary } = useExecutiveSummary();
  const alertCount = (summary?.alerts ?? []).filter((a) => a.severity !== "info").length;

  return (
    <div className="flex min-h-screen bg-muted/30">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-e border-sidebar-border lg:block">
        <AdminSidebar />
      </aside>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="right" className="w-72 p-0">
          <AdminSidebar onNavigate={() => setMenuOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminHeader onOpenMenu={() => setMenuOpen(true)} alertCount={alertCount} />
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
