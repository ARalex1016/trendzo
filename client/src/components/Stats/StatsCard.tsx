import { cn } from "@/lib/utils";

// Utils
import { withOpacity } from "@/utils/ColorManager";

// Types
import type { LucideIcon } from "lucide-react";

// --- Color System ---
const colorVariants = {
  primary: "#3b82f6",
  success: "#22c55e",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#06b6d4",
  purple: "#8b5cf6",
  pink: "#ec4899",
  gray: "#6b7280",
} as const;

type Variant = keyof typeof colorVariants;

// --- Component ---
interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  variant?: Variant;
  baseColor?: string; // override variant
  className?: string;
  iconClass?: string;
  trend?: {
    value: string;
    positive?: boolean;
  };
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  variant = "primary",
  baseColor,
  className,
  iconClass,
  trend,
}: StatsCardProps) {
  const color = baseColor || colorVariants[variant];
  const bgColor = withOpacity(color, 0.15);
  const borderColor = withOpacity(color, 0.3);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border p-5 transition-all hover:shadow-md",
        className,
      )}
      style={{
        backgroundColor: bgColor,
        borderColor: borderColor,
      }}
    >
      {/* Icon */}
      {Icon && (
        <div
          className={cn(
            "absolute right-4 top-4 opacity-80 text-5xl",
            iconClass,
          )}
          //   style={{ color }}
        >
          <Icon style={{ color: color }} />
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col gap-2">
        <span className="text-sm text-muted-foreground font-medium">
          {title}
        </span>

        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold" style={{ color }}>
            {value}
          </h3>

          {trend && (
            <span
              className={cn(
                "text-sm font-medium",
                trend.positive ? "text-green-600" : "text-red-600",
              )}
            >
              {trend.value}
            </span>
          )}
        </div>
      </div>

      {/* Subtle Gradient Overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          background: `linear-gradient(135deg, ${color}, transparent)`,
        }}
      />
    </div>
  );
}
