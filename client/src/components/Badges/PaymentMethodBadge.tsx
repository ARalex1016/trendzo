import { PAYMENT_METHODS } from "@/data/paymentMethods";

// Types
import type {
  PaymentMethod,
  PaymentMethodOnline,
} from "@/types/order/shared.type";

type Props = {
  method: PaymentMethod | PaymentMethodOnline;
  variant?: "default" | "minimal";
};

export const PaymentMethodBadge = ({ method, variant = "default" }: Props) => {
  const payment = PAYMENT_METHODS[method];

  const Icon = payment.icon;

  const isDefault = variant === "default";

  return (
    <div
      className={`flex flex-row items-center gap-x-2 rounded-lg ${
        isDefault ? "h-fit border-2 border-border bg-black px-3 py-1" : ""
      }`}
    >
      <Icon
        className={`h-4 w-4 ${
          isDefault ? "text-foreground/80" : "text-foreground"
        }`}
      />

      <span
        className={`text-sm ${
          isDefault ? "text-foreground/80" : "text-foreground"
        }`}
      >
        {payment.label}
      </span>
    </div>
  );
};
