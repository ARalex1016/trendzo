// Store
import useOrderStore from "@/store/useOrderStore";

// Types
import type { OrderAction } from "@/types/order/order_response.type";

interface ExecuteOrderActionParams {
  action: OrderAction;
  orderNumber: string;

  amount?: number;
  reason?: string;
}

export function useOrderActions() {
  const {
    verifyManualPayment,
    confirmOrder,
    shipOrder,
    deliverOrder,
    cancelOrder,
    returnOrder,
    refundOrder,
  } = useOrderStore();

  const executeOrderAction = async ({
    action,
    orderNumber,
    amount,
    reason,
  }: ExecuteOrderActionParams) => {
    switch (action) {
      case "verify_payment":
        if (amount === undefined) {
          throw new Error("Payment amount is required.");
        }

        return verifyManualPayment({
          orderNumber,
          amount,
        });

      case "confirm":
        return confirmOrder({
          orderNumber,
        });

      case "ship":
        return shipOrder({
          orderNumber,
        });

      case "deliver":
        return deliverOrder({
          orderNumber,
        });

      case "cancel":
        if (!reason?.trim()) {
          throw new Error("Cancellation reason is required.");
        }

        return cancelOrder({
          orderNumber,
          reason,
        });

      case "return":
        return returnOrder({
          orderNumber,
        });

      case "refund":
        return refundOrder({
          orderNumber,
        });

      default: {
        const exhaustiveCheck: never = action;
        return exhaustiveCheck;
      }
    }
  };

  return {
    executeOrderAction,
  };
}
