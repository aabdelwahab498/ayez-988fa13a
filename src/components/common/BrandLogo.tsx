import logoMark from "@/assets/logo-mark.png.asset.json";
import { APP_NAME } from "@/core/constants";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  /** Text color tone: default follows foreground, "invert" for dark backgrounds. */
  tone?: "default" | "invert";
  size?: "sm" | "md";
  showText?: boolean;
}

export function BrandLogo({
  className,
  tone = "default",
  size = "md",
  showText = true,
}: BrandLogoProps) {
  const box = size === "sm" ? "size-9" : "size-10";
  const text = size === "sm" ? "text-base" : "text-lg";

  return (
    <span className={cn("flex shrink-0 items-center gap-2.5", className)}>
      <span
        className={cn(
          "grid place-items-center rounded-xl bg-card p-1.5 shadow-sm ring-1 ring-border/60",
          box,
        )}
      >
        <img
          src={logoMark.url}
          alt={`شعار ${APP_NAME}`}
          width={40}
          height={40}
          className="size-full object-contain"
        />
      </span>
      {showText && (
        <span
          className={cn(
            "font-extrabold tracking-tight",
            text,
            tone === "invert" ? "text-brand-foreground" : "text-foreground",
          )}
        >
          {APP_NAME}
        </span>
      )}
    </span>
  );
}
