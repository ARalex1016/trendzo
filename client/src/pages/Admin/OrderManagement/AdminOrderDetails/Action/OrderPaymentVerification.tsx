import { useMemo } from "react";
import { CreditCard, Banknote, Calculator } from "lucide-react";

import { Input } from "@/components/ui/input";

import type { OrderWithAction } from "@/types/order/order_response.type";

interface OrderPaymentVerificationProps {
  order: OrderWithAction;
  amount: string;
  onAmountChange: (value: string) => void;
}

export function OrderPaymentVerification({
  order,
  amount,
  onAmountChange,
}: OrderPaymentVerificationProps) {
  const remainingAmount = useMemo(() => {
    return Math.max(order.confirmationPaymentDue - order.prepaidAmount, 0);
  }, [order.confirmationPaymentDue, order.prepaidAmount]);

  const isCOD = order.paymentCollectionType === "delivery_only";

  const isFullPayment = order.paymentCollectionType === "full";

  const isNone = order.paymentCollectionType === "none";

  const handlePresetAmount = (value: number) => {
    onAmountChange(value.toFixed(2));
  };

  return (
    <div className="space-y-4">
      {/* Payment summary */}
      <div className="rounded-xl border p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Payment Method</span>

          <span className="font-medium capitalize">
            {order.paymentMethod.toUpperCase()}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Required Before Confirmation
          </span>

          <span className="font-medium">
            {order.confirmationPaymentDue.toFixed(2)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Already Verified
          </span>

          <span className="font-medium">{order.prepaidAmount.toFixed(2)}</span>
        </div>

        <div className="border-t pt-3 flex items-center justify-between">
          <span className="text-sm font-medium">Remaining</span>

          <span className="text-lg font-semibold">
            {remainingAmount.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Payment options */}
      {!isNone && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Verification Amount</p>

          {/* Delivery charge */}
          {isCOD && (
            <button
              type="button"
              onClick={() => handlePresetAmount(order.deliveryCharge ?? 0)}
              className="
                w-full
                rounded-xl
                border
                p-4
                text-left
                transition
                hover:bg-muted/50
              "
            >
              <div className="flex items-center gap-3">
                <Banknote className="size-5" />

                <div className="flex-1">
                  <p className="font-medium">Delivery Charge</p>

                  <p className="text-sm text-muted-foreground">
                    Verify the delivery charge paid upfront
                  </p>
                </div>

                <span className="font-semibold">
                  {order?.deliveryCharge?.toFixed(2)}
                </span>
              </div>
            </button>
          )}

          {/* Full amount */}
          {isFullPayment && (
            <button
              type="button"
              onClick={() => handlePresetAmount(remainingAmount)}
              className="
                w-full
                rounded-xl
                border
                p-4
                text-left
                transition
                hover:bg-muted/50
              "
            >
              <div className="flex items-center gap-3">
                <CreditCard className="size-5" />

                <div className="flex-1">
                  <p className="font-medium">Full Amount</p>

                  <p className="text-sm text-muted-foreground">
                    Verify the remaining payment required
                  </p>
                </div>

                <span className="font-semibold">
                  {remainingAmount.toFixed(2)}
                </span>
              </div>
            </button>
          )}

          {/* Custom amount */}
          <div className="rounded-xl border p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Calculator className="size-4" />

              <p className="font-medium">Custom Amount</p>
            </div>

            <Input
              type="number"
              min="0"
              step="0.01"
              placeholder="Enter verified amount"
              value={amount}
              onChange={(event) => onAmountChange(event.target.value)}
            />

            <p className="text-xs text-muted-foreground">
              Enter the exact amount you verified from the customer's payment.
            </p>
          </div>
        </div>
      )}

      {isNone && (
        <div className="rounded-xl border p-4 text-sm text-muted-foreground">
          This order does not require payment verification before confirmation.
        </div>
      )}
    </div>
  );
}
