// Types
import type { LucideIcon } from "lucide-react";
import type { OrderAction } from "@/types/order/order_response.type";

export type OrderActionDialogType =
  | "confirmation"
  | "payment_verification"
  | "reason";

export interface OrderActionConfig {
  action: OrderAction;

  label: string;
  description?: string;

  icon: LucideIcon;

  variant: "default" | "primary" | "success" | "warning" | "danger";

  dialog: OrderActionDialogType;

  dialogTitle: string;
  dialogDescription: string;

  confirmLabel: string;
}

export interface OrderActionDialogProps {
  open: boolean;
  action: OrderAction | null;
  orderNumber: string;

  onClose: () => void;

  onSuccess?: () => void;
}
