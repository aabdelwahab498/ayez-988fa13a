import type { ReactNode } from "react";
import { PublicHeader } from "./PublicHeader";
import { Footer } from "./Footer";
import { MobileBottomNavigation } from "./MobileBottomNavigation";

export function AppShell({
  children,
  withFooter = true,
}: {
  children: ReactNode;
  withFooter?: boolean;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PublicHeader />
      <main className="flex-1 pb-20 lg:pb-0">{children}</main>
      {withFooter && <Footer />}
      <MobileBottomNavigation />
    </div>
  );
}
