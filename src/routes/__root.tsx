import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { Toaster } from "@/components/ui/sonner";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { ThemeProvider } from "@/features/theme/ThemeProvider";
import { I18nProvider, useI18n } from "@/features/i18n/I18nProvider";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#1e2a4a" },
      { title: "دليل الخدمات | أفضل الخدمات بالقرب منك في جميع محافظات مصر" },
      {
        name: "description",
        content:
          "ابحث عن سباك أو كهربائي أو فني تكييف موثق في محافظتك، قارن التقييمات والأسعار وأرسل طلب الخدمة في دقائق.",
      },
      { property: "og:title", content: "دليل الخدمات | أفضل الخدمات بالقرب منك في جميع محافظات مصر" },
      {
        property: "og:description",
        content: "ابحث عن سباك أو كهربائي أو فني تكييف موثق في محافظتك، قارن التقييمات والأسعار وأرسل طلب الخدمة في دقائق.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "دليل الخدمات | أفضل الخدمات بالقرب منك في جميع محافظات مصر" },
      { name: "twitter:description", content: "ابحث عن سباك أو كهربائي أو فني تكييف موثق في محافظتك، قارن التقييمات والأسعار وأرسل طلب الخدمة في دقائق." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/e90df0ca-4305-4c10-8abd-09ab8eb65a67/id-preview-a4684118--7d9b240d-11cb-4030-8e3a-2fcf86164b57.lovable.app-1785366415432.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/e90df0ca-4305-4c10-8abd-09ab8eb65a67/id-preview-a4684118--7d9b240d-11cb-4030-8e3a-2fcf86164b57.lovable.app-1785366415432.png" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&display=swap",
      },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      { rel: "apple-touch-icon", href: "/favicon.png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

const appearanceScript = `(function(){try{var t=localStorage.getItem('ayez-theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}if(t==='dark'){document.documentElement.classList.add('dark');}document.documentElement.style.colorScheme=t;var l=localStorage.getItem('ayez-language');if(l==='en'){document.documentElement.lang='en';document.documentElement.dir='ltr';}}catch(e){}})();`;

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: appearanceScript }} />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}


function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <I18nProvider>
          {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
          <Outlet />
          <AppToaster />
        </I18nProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

function AppToaster() {
  const { dir } = useI18n();
  return <Toaster position="top-center" dir={dir} />;
}

