import { Banknote, Truck } from "lucide-react";

// Components
import { EsewaIcon, KhaltiIcon, BankIcon } from "@/components/ImgIconComp";

// Types
import type {
  PaymentMethod,
  PaymentMethodOnline,
} from "@/types/order/shared.type";

type PaymentMethodConfig = {
  label: string;
  icon: React.ComponentType<{ className?: string }> | string;
};

export const PAYMENT_METHODS: Record<
  PaymentMethod | PaymentMethodOnline,
  PaymentMethodConfig
> = {
  bank: {
    label: "Bank Transfer",
    icon: BankIcon,
  },

  esewa: {
    label: "eSewa",
    icon: EsewaIcon,
  },

  khalti: {
    label: "Khalti",
    icon: KhaltiIcon,
  },

  cod: {
    label: "Cash on Delivery",
    icon: Truck,
  },

  cash: {
    label: "Cash",
    icon: Banknote,
  },
};
