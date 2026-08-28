import {
  Banknote,
  CheckCircle2,
  Clock3,
  CreditCard,
  Info,
  Landmark,
  Loader2,
  WalletCards,
  XCircle,
} from "lucide-react";

// Types
import type { IOrderRes } from "@/types/order/order_response.type";
import type {
  PaymentMethodInStore,
  PaymentMethodOnline,
} from "@/types/order/shared.type";

interface PaymentDetailsProps {
  order: IOrderRes;
  className?: string;
}

type PaymentMethod = PaymentMethodOnline | PaymentMethodInStore;

const PAYMENT_METHOD_CONFIG: Record<
  PaymentMethod,
  {
    label: string;
    icon: typeof CreditCard;
  }
> = {
  bank: {
    label: "Bank Transfer",
    icon: Landmark,
  },
  esewa: {
    label: "eSewa",
    icon: WalletCards,
  },
  khalti: {
    label: "Khalti",
    icon: WalletCards,
  },
  cod: {
    label: "Cash on Delivery",
    icon: Banknote,
  },
  cash: {
    label: "Cash",
    icon: Banknote,
  },
};

const PAYMENT_STATUS_CONFIG = {
  pending: {
    label: "Pending",
    icon: Clock3,
    className: "border-amber-500/20 bg-amber-500/10 text-amber-400",
  },
  partial: {
    label: "Partially Paid",
    icon: Clock3,
    className: "border-blue-500/20 bg-blue-500/10 text-blue-400",
  },
  completed: {
    label: "Paid",
    icon: CheckCircle2,
    className: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  },
  failed: {
    label: "Failed",
    icon: XCircle,
    className: "border-red-500/20 bg-red-500/10 text-red-400",
  },
} as const;

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-NP", {
    style: "currency",
    currency: "NPR",
    maximumFractionDigits: 0,
  }).format(amount);

const formatMethod = (method: PaymentMethod) =>
  PAYMENT_METHOD_CONFIG[method]?.label ?? method;

export function PaymentDetails({ order, className = "" }: PaymentDetailsProps) {
  const paymentMethod = order.paymentMethod as PaymentMethod;

  const methodConfig =
    PAYMENT_METHOD_CONFIG[paymentMethod] ?? PAYMENT_METHOD_CONFIG.cash;

  const MethodIcon = methodConfig.icon;

  const statusConfig = PAYMENT_STATUS_CONFIG[order.paymentStatus];

  const StatusIcon = statusConfig.icon;

  const totalAmount = order.totalAmount ?? 0;
  const prepaidAmount = order.prepaidAmount ?? 0;
  const dueOnDelivery = order.amountDueOnDelivery ?? 0;
  const confirmationDue = order.confirmationPaymentDue ?? 0;
  const deliveryCharge = order.deliveryCharge ?? 0;

  return (
    <section
      className={[
        "overflow-hidden rounded-2xl border border-white/[0.07]",
        "bg-[#111113] shadow-[0_8px_30px_rgba(0,0,0,0.18)]",
        className,
      ].join(" ")}
    >
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-white/[0.06] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.05]">
            <CreditCard className="h-5 w-5 text-white/80" />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-white">
              Payment Details
            </h2>

            <p className="mt-0.5 text-xs text-white/40">
              Payment information for this order
            </p>
          </div>
        </div>

        {/* Payment Status */}
        <div
          className={[
            "inline-flex w-fit items-center gap-1.5 rounded-full border",
            "px-2.5 py-1 text-xs font-medium",
            statusConfig.className,
          ].join(" ")}
        >
          <StatusIcon className="h-3.5 w-3.5" />
          {statusConfig.label}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6">
        {/* Payment Method */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-4">
            <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-white/35">
              Payment Method
            </p>

            <div className="mt-3 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.06]">
                <MethodIcon className="h-4 w-4 text-white/70" />
              </div>

              <div>
                <p className="text-sm font-medium text-white">
                  {formatMethod(paymentMethod)}
                </p>

                <p className="mt-0.5 text-xs text-white/35">
                  {order.orderType === "in_store"
                    ? "In-store payment"
                    : "Online order"}
                </p>
              </div>
            </div>
          </div>

          {/* Collection Type */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-4">
            <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-white/35">
              Collection
            </p>

            <p className="mt-3 text-sm font-medium capitalize text-white">
              {getCollectionLabel(order.paymentCollectionType)}
            </p>

            <p className="mt-1 text-xs leading-5 text-white/35">
              {getCollectionDescription(order.paymentCollectionType)}
            </p>
          </div>
        </div>

        {/* Amount Summary */}
        <div className="mt-5 overflow-hidden rounded-xl border border-white/[0.06]">
          <div className="border-b border-white/[0.06] px-4 py-3">
            <p className="text-xs font-semibold text-white/70">
              Payment Summary
            </p>
          </div>

          <div className="divide-y divide-white/[0.05]">
            <PaymentRow
              label="Order Total"
              value={formatCurrency(totalAmount)}
            />

            {deliveryCharge > 0 && (
              <PaymentRow
                label="Delivery Charge"
                value={formatCurrency(deliveryCharge)}
                muted
              />
            )}

            <PaymentRow
              label="Prepaid Amount"
              value={formatCurrency(prepaidAmount)}
              valueClassName={
                prepaidAmount > 0 ? "text-emerald-400" : undefined
              }
            />

            {confirmationDue > 0 && (
              <PaymentRow
                label="Confirmation Payment Due"
                value={formatCurrency(confirmationDue)}
                valueClassName="text-amber-400"
              />
            )}

            <PaymentRow
              label="Amount Due on Delivery"
              value={formatCurrency(dueOnDelivery)}
              valueClassName={
                dueOnDelivery > 0 ? "text-amber-400" : "text-white/50"
              }
              emphasized
            />
          </div>
        </div>

        {/* Payment State */}
        {order.paymentStatus !== "completed" && (
          <div className="mt-5 flex gap-3 rounded-xl border border-white/[0.06] bg-white/[0.025] p-4">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-white/40" />

            <div>
              <p className="text-xs font-medium text-white/70">
                {getPaymentMessage(order)}
              </p>

              <p className="mt-1 text-xs leading-5 text-white/35">
                Review the payment information before confirming or progressing
                this order.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* =========================================================
   Payment Row
========================================================= */

interface PaymentRowProps {
  label: string;
  value: string;
  muted?: boolean;
  emphasized?: boolean;
  valueClassName?: string;
}

function PaymentRow({
  label,
  value,
  muted = false,
  emphasized = false,
  valueClassName,
}: PaymentRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3.5">
      <span
        className={[
          "text-xs sm:text-sm",
          muted ? "text-white/35" : "text-white/55",
          emphasized ? "font-medium text-white/80" : "",
        ].join(" ")}
      >
        {label}
      </span>

      <span
        className={[
          "shrink-0 text-xs sm:text-sm",
          emphasized ? "font-semibold" : "font-medium",
          valueClassName ?? "text-white/80",
        ].join(" ")}
      >
        {value}
      </span>
    </div>
  );
}

/* =========================================================
   Helpers
========================================================= */

function getCollectionLabel(type: IOrderRes["paymentCollectionType"]) {
  switch (type) {
    case "delivery_only":
      return "Delivery Only";

    case "full":
      return "Full Payment";

    case "none":
      return "No Collection";

    default:
      return type;
  }
}

function getCollectionDescription(type: IOrderRes["paymentCollectionType"]) {
  switch (type) {
    case "delivery_only":
      return "Delivery charge collected before confirmation.";

    case "full":
      return "Entire order amount must be paid before confirmation.";

    case "none":
      return "No payment collection is required.";

    default:
      return "";
  }
}

function getPaymentMessage(order: IOrderRes) {
  if (order.paymentStatus === "failed") {
    return "Payment verification failed.";
  }

  if (order.paymentStatus === "partial") {
    return "This order has received a partial payment.";
  }

  if (order.confirmationPaymentDue > 0) {
    return "Payment is required before this order can be confirmed.";
  }

  if (order.amountDueOnDelivery > 0) {
    return "A remaining balance will be collected on delivery.";
  }

  return "Payment is awaiting verification.";
}
