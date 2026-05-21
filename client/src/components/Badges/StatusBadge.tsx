import * as React from "react";
import { cn } from "@/lib/utils";

// Utils
import { withOpacity } from "@/utils/ColorManager";

// -----------------------------
// Color Variants
// -----------------------------
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

type Size = "sm" | "md" | "lg";

// -----------------------------
// Props
// -----------------------------
interface StatusBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;

  variant?: Variant;

  /**
   * Override default variant color
   */
  baseColor?: string;

  size?: Size;

  rounded?: boolean;

  glow?: boolean;
}

// -----------------------------
// Component
// -----------------------------
export function StatusBadge({
  children,
  variant = "primary",
  baseColor,
  size = "md",
  rounded = true,
  glow = true,
  className,
  style,
  ...props
}: StatusBadgeProps) {
  const color = baseColor || colorVariants[variant];

  const backgroundColor = withOpacity(color, 0.15);
  const borderColor = withOpacity(color, 0.35);
  const shadowColor = withOpacity(color, 0.35);

  const sizes: Record<Size, string> = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-1.5",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center border font-medium transition-colors",
        rounded ? "rounded-full" : "rounded-lg",
        sizes[size],
        glow && "shadow-sm",
        className,
      )}
      style={{
        color,
        backgroundColor,
        borderColor,
        boxShadow: glow ? `0 0 10px ${shadowColor}` : undefined,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
