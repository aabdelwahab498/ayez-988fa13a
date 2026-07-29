import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { KeyRound, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { BrandLogo } from "@/components/common/BrandLogo";
import { AppearanceControls } from "@/components/layout/AppearanceControls";
import { useI18n } from "@/features/i18n/I18nProvider";
import { adminSession } from "@/features/admin/auth/adminSession";
import { useAdminTeam } from "@/core/hooks/adminQueries";
import { useLocalized } from "@/features/admin/lib/format";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  twoFactorCode: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

/**
 * Admin sign-in surface.
 *
 * Frontend architecture only: `adminSession.signIn` resolves a mock identity
 * today and will exchange credentials for a JWT + refresh token pair once
 * ASP.NET Core Identity is wired up.
 */
export function AdminLoginScreen() {
  const { t } = useI18n();
  const L = useLocalized();
  const [failed, setFailed] = useState(false);
  const { data: team = [] } = useAdminTeam();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "ahmed.admin@ayez.eg", password: "ayez-demo", twoFactorCode: "" },
  });

  const onSubmit = async (values: FormValues) => {
    setFailed(false);
    try {
      await adminSession.signIn(values.email, values.password);
    } catch {
      setFailed(true);
    }
  };

  const quickSignIn = async (email: string) => {
    form.setValue("email", email);
    await adminSession.signIn(email, "ayez-demo");
  };

  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-2">
      <section className="relative hidden flex-col justify-between bg-sidebar p-10 text-sidebar-foreground lg:flex">
        <BrandLogo tone="invert" showText={false} />
        <div>
          <Badge className="bg-sidebar-accent text-sidebar-accent-foreground">{t("adm.login.badge")}</Badge>
          <h2 className="mt-4 text-3xl font-extrabold leading-tight">{t("adm.login.title")}</h2>
          <p className="mt-3 max-w-md text-sm text-sidebar-foreground/70">{t("adm.login.subtitle")}</p>
        </div>
        <p className="flex items-center gap-2 text-xs text-sidebar-foreground/60">
          <ShieldCheck className="size-4" />
          {t("adm.login.secure")}
        </p>
      </section>

      <section className="flex flex-col p-6 sm:p-10">
        <div className="flex items-center justify-between">
          <BrandLogo size="sm" />
          <AppearanceControls />
        </div>

        <div className="mx-auto my-auto w-full max-w-sm py-10">
          <h1 className="text-2xl font-extrabold text-foreground">{t("adm.login.title")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t("adm.login.subtitle")}</p>

          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-4" noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="admin-email">{t("adm.login.email")}</Label>
              <Input id="admin-email" type="email" autoComplete="username" {...form.register("email")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="admin-password">{t("adm.login.password")}</Label>
              <Input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                {...form.register("password")}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="admin-2fa">{t("adm.login.twofa")}</Label>
              <Input id="admin-2fa" inputMode="numeric" placeholder="••••••" {...form.register("twoFactorCode")} />
            </div>

            {failed && <p className="text-sm font-semibold text-destructive">{t("adm.login.error")}</p>}

            <Button type="submit" className="w-full gap-2" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  {t("adm.login.submitting")}
                </>
              ) : (
                <>
                  <KeyRound className="size-4" />
                  {t("adm.login.submit")}
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 rounded-xl border border-dashed border-border p-4">
            <p className="text-xs font-bold text-foreground">{t("adm.login.demoTitle")}</p>
            <p className="mt-1 text-xs text-muted-foreground">{t("adm.login.demoHint")}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {team.slice(0, 5).map((member) => (
                <Button
                  key={member.id}
                  type="button"
                  size="sm"
                  variant="soft"
                  onClick={() => quickSignIn(member.email)}
                >
                  {L(member.roleName)}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
