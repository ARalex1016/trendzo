import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";

export type TimelineStatus = "completed" | "current" | "pending" | "cancelled";

export type TimelineItem = {
  id: string;
  title: string;
  description?: string;
  date?: string | Date;
  status: TimelineStatus;

  /** Optional icon displayed inside the timeline circle */
  icon?: LucideIcon;
};

/* -------------------------------------------------------------------------- */
/*                                Size Variants                               */
/* -------------------------------------------------------------------------- */

const timelineCircleVariants = cva(
  "relative z-10 flex shrink-0 items-center justify-center rounded-full border",
  {
    variants: {
      size: {
        sm: "h-6 w-6",
        default: "h-6 w-6",
        lg: "h-7 w-7",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

const timelineIconVariants = cva("shrink-0", {
  variants: {
    size: {
      sm: "h-3.5 w-3.5",
      default: "h-4 w-4",
      lg: "h-4.5 w-4.5",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

const timelineTitleVariants = cva("font-medium", {
  variants: {
    size: {
      sm: "text-sm",
      default: "text-base",
      lg: "text-lg",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

const timelineDescriptionVariants = cva("mt-1", {
  variants: {
    size: {
      sm: "text-xs",
      default: "text-sm",
      lg: "text-base",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

const timelineDateVariants = cva("mt-1 text-zinc-500", {
  variants: {
    size: {
      sm: "text-[10px]",
      default: "text-xs",
      lg: "text-sm",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

const timelineContentVariants = cva("", {
  variants: {
    size: {
      sm: "pb-5",
      default: "pb-8",
      lg: "pb-10",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

const timelineGapVariants = cva("relative flex", {
  variants: {
    size: {
      sm: "gap-3",
      default: "gap-4",
      lg: "gap-5",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

/* -------------------------------------------------------------------------- */
/*                             Timeline Column                                */
/* -------------------------------------------------------------------------- */

const timelineColumnVariants = cva("relative flex shrink-0 justify-center", {
  variants: {
    size: {
      sm: "w-6",
      default: "w-6",
      lg: "w-7",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

/* -------------------------------------------------------------------------- */
/*                                  Timeline                                  */
/* -------------------------------------------------------------------------- */

interface TimelineProps extends VariantProps<typeof timelineCircleVariants> {
  items: TimelineItem[];
}

export function Timeline({ items, size = "default" }: TimelineProps) {
  return (
    <div className="relative">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const Icon = item.icon;

        return (
          <div key={item.id} className={timelineGapVariants({ size })}>
            {/* ---------------------------------------------------------------- */}
            {/* Timeline Column                                                  */}
            {/* ---------------------------------------------------------------- */}

            <div className={timelineColumnVariants({ size })}>
              {/* Line */}
              {!isLast && (
                <div
                  className={cn(
                    "absolute top-6 bottom-0 w-0.5 bg-zinc-700",
                    size === "lg" && "top-7",
                  )}
                />
              )}

              {/* Circle */}
              <div
                className={cn(
                  timelineCircleVariants({ size }),

                  item.status === "completed"
                    ? "border-success/60 bg-success/15"
                    : item.status === "current"
                      ? "border-primary2/60 bg-primary2/15"
                      : item.status === "cancelled"
                        ? "border-destructive/60 bg-destructive/15"
                        : "border-zinc-600/60 bg-zinc-900/15",
                )}
              >
                {Icon && (
                  <Icon
                    strokeWidth={2.5}
                    className={cn(
                      timelineIconVariants({ size }),

                      item.status === "completed"
                        ? "text-success"
                        : item.status === "current"
                          ? "text-primary2"
                          : item.status === "cancelled"
                            ? "text-destructive"
                            : "text-zinc-400",
                    )}
                  />
                )}
              </div>
            </div>

            {/* ---------------------------------------------------------------- */}
            {/* Content                                                          */}
            {/* ---------------------------------------------------------------- */}

            <div className={timelineContentVariants({ size })}>
              {/* Title */}
              <h3
                className={cn(
                  timelineTitleVariants({ size }),

                  item.status === "completed"
                    ? "text-foreground"
                    : item.status === "cancelled"
                      ? "text-destructive"
                      : item.status === "current"
                        ? "text-primary2"
                        : "text-foreground/60",
                )}
              >
                {item.title}
              </h3>

              {/* Description */}
              {item.description && (
                <p
                  className={cn(
                    timelineDescriptionVariants({ size }),

                    item.status === "completed"
                      ? "text-foreground/60"
                      : item.status === "cancelled"
                        ? "text-destructive"
                        : item.status === "current"
                          ? "text-primary2/60"
                          : "text-foreground/60",
                  )}
                >
                  {item.description}
                </p>
              )}

              {/* Date */}
              {item.date && (
                <p className={timelineDateVariants({ size })}>
                  {typeof item.date === "string"
                    ? item.date
                    : item.date.toLocaleString()}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
