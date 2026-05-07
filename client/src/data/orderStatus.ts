// Icons
import {
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  RotateCcw,
  RefreshCw,
} from "lucide-react";

// Types
import type { OrderStatus } from "@/types/order/shared.type";
import type { LucideIcon } from "lucide-react";

export type StatusMeta = {
  key: OrderStatus;
  label: string;
  description: string;
  Icon: LucideIcon;
  color: string;
};

export const ORDER_FLOW = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
] as const;

export const orderStatus: StatusMeta[] = [
  {
    key: "pending",
    label: "Pending",
    description: "Our team will call you to confirm payment",
    Icon: Clock,
    color: "text-yellow-500",
  },
  {
    key: "confirmed",
    label: "Confirmed",
    description: "Your order has been confirmed",
    Icon: CheckCircle,
    color: "text-blue-500",
  },
  {
    key: "shipped",
    label: "Shipped",
    description: "Your order is on its way",
    Icon: Truck,
    color: "text-purple-500",
  },
  {
    key: "delivered",
    label: "Delivered",
    description: "Enjoy your purchase!",
    Icon: CheckCircle,
    color: "text-green-500",
  },
  {
    key: "cancelled",
    label: "Cancelled",
    description: "This order has been cancelled",
    Icon: XCircle,
    color: "text-red-500",
  },
  // {
  // key: "return-requested",
  //   label: "Return Requested",
  //   description: "We are reviewing your return request",
  //   Icon: RotateCcw,
  //   color: "text-orange-500",
  // },
  {
    key: "returned",
    label: "Returned",
    description: "The order has been returned",
    Icon: RotateCcw,
    color: "text-gray-500",
  },
  {
    key: "refunded",
    label: "Refunded",
    description: "Your payment has been refunded",
    Icon: RefreshCw,
    color: "text-green-600",
  },
];
