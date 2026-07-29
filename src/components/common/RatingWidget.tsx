import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingWidgetProps {
  rating: number;
  reviewsCount?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  className?: string;
}

export function RatingWidget({
  rating,
  reviewsCount,
  size = "sm",
  showValue = true,
  className,
}: RatingWidgetProps) {
  const starSize = size === "lg" ? "size-5" : size === "md" ? "size-4" : "size-3.5";
  const textSize = size === "lg" ? "text-base" : "text-sm";

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={cn(
              starSize,
              i <= Math.round(rating)
                ? "fill-accent-orange text-accent-orange"
                : "fill-muted text-muted-foreground/40",
            )}
          />
        ))}
      </div>
      {showValue && (
        <span className={cn("font-bold text-foreground", textSize)}>
          {rating.toFixed(1)}
        </span>
      )}
      {typeof reviewsCount === "number" && (
        <span className={cn("text-muted-foreground", textSize)}>
          ({reviewsCount.toLocaleString("ar-EG")} تقييم)
        </span>
      )}
    </div>
  );
}
