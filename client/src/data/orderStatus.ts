// Icons
import {
  Clock,
  CheckCircle,
  Package,
  Truck,
  XCircle,
  RotateCcw,
  RefreshCw,
} from "lucide-react";

// Types
import type { LucideIcon } from "lucide-react";

type StatusMeta = {
  label: string;
  description: string;
  Icon: LucideIcon;
  color: string;
  step?: number;
};

export const orderStatus: StatusMeta[] = [
  {
    label: "Pending",
    description: "Our team will call you to confirm payment",
    Icon: Clock,
    color: "text-yellow-500",
    step: 1,
  },
  {
    label: "Confirmed",
    description: "Your order has been confirmed",
    Icon: CheckCircle,
    color: "text-blue-500",
    step: 2,
  },
  {
    label: "Processing",
    description: "We’re preparing your items for shipping",
    Icon: Package,
    color: "text-indigo-500",
    step: 3,
  },
  {
    label: "Shipped",
    description: "Your order is on its way",
    Icon: Truck,
    color: "text-purple-500",
    step: 4,
  },
  {
    label: "Delivered",
    description: "Enjoy your purchase!",
    Icon: CheckCircle,
    color: "text-green-500",
    step: 5,
  },
  {
    label: "Cancelled",
    description: "This order has been cancelled",
    Icon: XCircle,
    color: "text-red-500",
  },
  {
    label: "Return Requested",
    description: "We are reviewing your return request",
    Icon: RotateCcw,
    color: "text-orange-500",
  },
  {
    label: "Returned",
    description: "The order has been returned",
    Icon: RotateCcw,
    color: "text-gray-500",
  },
  {
    label: "Refunded",
    description: "Your payment has been refunded",
    Icon: RefreshCw,
    color: "text-green-600",
  },
];
