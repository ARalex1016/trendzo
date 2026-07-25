import { cva, type VariantProps } from "class-variance-authority";

// Lib
import { cn } from "@/lib/utils";

const statsGridVariants = cva("grid gap-3 sm:gap-4", {
  variants: {
    variant: {
      default: "grid-cols-2 lg:grid-cols-3",
      large: "grid-cols-1 lg:grid-cols-2",
      compact: "grid-cols-2 md:grid-cols-4 lg:grid-cols-6",
      balanced: "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4",
      auto: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
      single: "grid-cols-1",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface StatsGridProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statsGridVariants> {}

export const StatsGrid = ({
  children,
  variant,
  className,
  ...props
}: StatsGridProps) => {
  return (
    <div className={cn(statsGridVariants({ variant }), className)} {...props}>
      {children}
    </div>
  );
};
