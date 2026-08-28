// Icons
import {
  BadgeCheck,
  CheckCircle2,
  Truck,
  PackageCheck,
  XCircle,
  RotateCcw,
  RefreshCcw,
} from "lucide-react";

// Types
import type { OrderAction } from "@/types/order/order_response.type";
import type { OrderActionConfig } from "./order-action.types";

export const ORDER_ACTION_CONFIG: Record<OrderAction, OrderActionConfig> = {
  verify_payment: {
    action: "verify_payment",
    label: "Verify Payment",
    description: "Verify the amount received for this order.",
    icon: BadgeCheck,
    variant: "success",

    dialog: "payment_verification",

    dialogTitle: "Verify Payment",
    dialogDescription: "Enter the amount you have verified for this order.",

    confirmLabel: "Verify Payment",
  },

  confirm: {
    action: "confirm",
    label: "Confirm Order",
    description: "Confirm this order and prepare it for shipping.",
    icon: CheckCircle2,
    variant: "primary",

    dialog: "confirmation",

    dialogTitle: "Confirm Order",
    dialogDescription: "Are you sure you want to confirm this order?",

    confirmLabel: "Confirm Order",
  },

  ship: {
    action: "ship",
    label: "Mark as Shipped",
    description: "Mark this order as shipped.",
    icon: Truck,
    variant: "primary",

    dialog: "confirmation",

    dialogTitle: "Ship Order",
    dialogDescription: "Are you sure you want to mark this order as shipped?",

    confirmLabel: "Mark as Shipped",
  },

  deliver: {
    action: "deliver",
    label: "Mark as Delivered",
    description: "Mark this order as delivered.",
    icon: PackageCheck,
    variant: "success",

    dialog: "confirmation",

    dialogTitle: "Deliver Order",
    dialogDescription: "Are you sure you want to mark this order as delivered?",

    confirmLabel: "Mark as Delivered",
  },

  cancel: {
    action: "cancel",
    label: "Cancel Order",
    description: "Cancel this order.",
    icon: XCircle,
    variant: "danger",

    dialog: "reason",

    dialogTitle: "Cancel Order",
    dialogDescription: "Please provide a reason for cancelling this order.",

    confirmLabel: "Cancel Order",
  },

  return: {
    action: "return",
    label: "Return Order",
    description: "Mark this order as returned.",
    icon: RotateCcw,
    variant: "warning",

    dialog: "confirmation",

    dialogTitle: "Return Order",
    dialogDescription: "Are you sure you want to mark this order as returned?",

    confirmLabel: "Return Order",
  },

  refund: {
    action: "refund",
    label: "Refund Order",
    description: "Refund this order.",
    icon: RefreshCcw,
    variant: "warning",

    dialog: "confirmation",

    dialogTitle: "Refund Order",
    dialogDescription: "Are you sure you want to refund this order?",

    confirmLabel: "Refund Order",
  },
};
