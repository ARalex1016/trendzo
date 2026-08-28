// Config
import { cn } from "@/lib/utils";

// Icons
import { Globe2, Store } from "lucide-react";

// Types
import type { LucideIcon } from "lucide-react";

export type OrderType = "online" | "in_store";

interface OrderTypeBadgeProps {
  type: OrderType;
  className?: string;
}

const orderTypeConfig: Record<
  OrderType,
  {
    label: string;
    icon: LucideIcon;
  }
> = {
  online: {
    label: "Online",
    icon: Globe2,
  },
  in_store: {
    label: "In Store",
    icon: Store,
  },
};

export const OrderTypeBadge = ({
  type,
  className = "",
}: OrderTypeBadgeProps) => {
  const config = orderTypeConfig[type];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs text-foreground/80 font-medium bg-accent/40 rounded-xl border border-border px-3 py-1",
        className,
      )}
    >
      <Icon className="size-3.5" />

      {config.label}
    </span>
  );
};
