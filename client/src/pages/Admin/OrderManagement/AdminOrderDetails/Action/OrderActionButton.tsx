// lib
import { cn } from "@/lib/utils";

// Config
import { ORDER_ACTION_CONFIG } from "./order-action.config";

// Types
import type { OrderAction } from "@/types/order/order_response.type";

interface OrderActionButtonProps {
  action: OrderAction;
  onClick: (action: OrderAction) => void;
  disabled?: boolean;
  className?: string;
}

export function OrderActionButton({
  action,
  onClick,
  disabled = false,
  className,
}: OrderActionButtonProps) {
  const config = ORDER_ACTION_CONFIG[action];

  if (!config) {
    return null;
  }

  const Icon = config.icon;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onClick(action)}
      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition disabled:pointer-events-none disabled:opacity-50 ${className}`}
    >
      <Icon size={17} />

      <span>{config.label}</span>
    </button>
  );
}
