// Lib
import { cn } from "@/lib/utils";

// Type
import type { LucideIcon } from "lucide-react";

const variants = {
  default: {
    card: "bg-card/60 border-border/60 hover:bg-card hover:border-border",
    icon: "text-foreground/80 group-hover:text-foreground",
    value: "text-foreground/80 group-hover:text-foreground",
  },

  primary: {
    card: "bg-primary/10 border-primary/20 hover:bg-primary/15 hover:primary/25",
    icon: "text-primary/80 group-hover:text-primary",
    value: "text-primary/80 group-hover:text-primary",
  },

  primary2: {
    card: "bg-primary2/10 border-primary2/20 hover:bg-primary2/15 hover:border-primary2/25",
    icon: "text-primary2/80 group-hover:text-primary2",
    value: "text-primary2/80 group-hover:text-primary2",
  },

  success: {
    card: "bg-green-500/10 border-green-500/20 hover:bg-green-500/15 hover:border-green-500/25",
    icon: "text-green-500/80 group-hover:text-green-500",
    value: "text-green-500/80 group-hover:text-green-500",
  },

  warning: {
    card: "bg-yellow-500/10 border-yellow-500/20 hover:bg-yellow-500/15 hover:border-yellow-500/25",
    icon: "text-yellow-500/80 group-hover:text-yellow-500",
    value: "text-yellow-500/80 group-hover:text-yellow-500",
  },

  destructive: {
    card: "bg-destructive/10 border-destructive/20 hover:bg-destructive/15 hover:border-destructive/25",
    icon: "text-destructive/80 group-hover:text-destructive",
    value: "text-destructive/80 group-hover:text-destructive",
  },

  info: {
    card: "bg-cyan-500/10 border-cyan-500/20 hover:bg-cyan-500/15 hover:border-cyan-500/25",
    icon: "text-cyan-500/80 group-hover:text-cyan-500",
    value: "text-cyan-500/80 group-hover:text-cyan-500",
  },
} as const;

type Variant = keyof typeof variants;

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  variant?: Variant;
  className?: string;
  trend?: {
    value: string | number;
    positive?: boolean;
  };
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  variant = "default",
  className,
  trend,
}: StatsCardProps) {
  const styles = variants[variant];

  return (
    <div
      className={cn(
        "rounded-2xl flex gap-y-2 border p-5 transition-all duration-300 group",
        styles.card,
        trend ? "flex-col" : "flex-row gap-x-2 justify-between",
        className,
      )}
    >
      {/* Icons & Trend */}
      <div
        className={cn(
          "flex flex-row justify-between",
          trend ? "order-1" : "order-2",
        )}
      >
        {Icon && (
          <Icon
            className={cn(
              "size-5 sm:size-6 transition-all duration-300",
              styles.icon,
            )}
          />
        )}

        {trend && (
          <span
            className={cn(
              "text-xs sm:text-sm font-medium",
              trend.positive ? "text-success" : "text-destructive",
            )}
          >
            {trend.positive ? "+" : "-"}
            {trend.value}%
          </span>
        )}
      </div>

      {/* Title & Value */}
      <div
        className={cn("flex flex-col", trend ? "order-2" : "order-1 gap-y-2")}
      >
        <p
          className={cn(
            "text-xl sm:text-2xl font-bold transition-all duration-300",
            styles.value,
            trend ? "order-1" : "order-2",
          )}
        >
          {value}
        </p>

        <p
          className={cn(
            "text-xs sm:text-sm font-medium text-muted-foreground line-clamp-1",
            trend ? "order-2" : "order-1",
          )}
        >
          {title}
        </p>
      </div>
    </div>
  );
}
