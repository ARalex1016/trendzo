import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { OrderPaymentVerification } from "./OrderPaymentVerification";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

// Types
import type {
  OrderAction,
  OrderWithAction,
} from "@/types/order/order_response.type";

import { ORDER_ACTION_CONFIG } from "./order-action.config";
import { useOrderActions } from "@/hooks/orders/useOrderActions";

interface OrderActionDialogProps {
  open: boolean;
  action: OrderAction | null;
  order: OrderWithAction;
  onClose: () => void;
  onSuccess?: () => void;
}

export function OrderActionDialog({
  open,
  action,
  order,
  onClose,
  onSuccess,
}: OrderActionDialogProps) {
  const { executeOrderAction } = useOrderActions();

  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const config = action ? ORDER_ACTION_CONFIG[action] : null;

  useEffect(() => {
    if (!open) {
      setAmount("");
      setReason("");
      setLoading(false);
    }
  }, [open]);

  if (!action || !config) {
    return null;
  }

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const numericAmount = amount.trim() !== "" ? Number(amount) : undefined;

      await executeOrderAction({
        action,
        orderNumber: order.orderNumber,
        amount: numericAmount,
        reason,
      });

      toast.success(`${config.label} successful`);

      onClose();
      onSuccess?.();
    } catch (error: any) {
      toast.error(error?.message || `Failed to ${config.label.toLowerCase()}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) {
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{config.dialogTitle}</DialogTitle>

          <DialogDescription>{config.dialogDescription}</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {config.dialog === "payment_verification" && (
            <OrderPaymentVerification
              order={order}
              amount={amount}
              onAmountChange={setAmount}
            />
          )}

          {/* {config.dialog === "payment_verification" && (
            <div className="space-y-2">
              <label htmlFor="verified-amount" className="text-sm font-medium">
                Verified Amount
              </label>

              <Input
                id="verified-amount"
                type="number"
                min="0"
                step="0.01"
                placeholder="Enter verified amount"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
              />
            </div>
          )} */}

          {config.dialog === "reason" && (
            <div className="space-y-2">
              <label htmlFor="action-reason" className="text-sm font-medium">
                Reason
              </label>

              <Textarea
                id="action-reason"
                placeholder="Enter cancellation reason"
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                rows={4}
              />
            </div>
          )}

          {config.dialog === "confirmation" && (
            <div className="rounded-xl border p-4 text-sm">
              {config.dialogDescription}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleSubmit}
            disabled={
              loading ||
              (config.dialog === "payment_verification" &&
                (!amount || Number(amount) <= 0)) ||
              (config.dialog === "reason" && !reason.trim())
            }
          >
            {loading ? "Processing..." : config.confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
