// Repositories
import { OrderRepository } from "../../Repositories/order.repository.ts";
import {
  OrderNotFoundError,
  OrderPaymentRequiredError,
} from "./order.errors.ts";

// Utils
import AppError from "../../Utils/AppError.ts";

// Types
import type { IOrder, PaymentStatus } from "../../Models/order.model.ts";
import type { OrderWithAction } from "../../Repositories/order.repository.ts";
import type { IUser } from "../../Models/user.model.ts";

export async function verifyOrderPayment(
  user: IUser,
  order: IOrder,
  verifiedAmount: number,
): Promise<OrderWithAction> {
  if (
    order.paymentStatus === "partial" ||
    order.paymentStatus === "completed"
  ) {
    throw new AppError("Order Payment is already verified", 400);
  }

  if (order.status !== "pending") {
    throw new OrderPaymentRequiredError(
      `Payment verification is only available for pending orders.`,
    );
  }

  if (verifiedAmount <= 0) {
    throw new OrderPaymentRequiredError(
      "Verified payment amount must be greater than zero.",
    );
  }

  const confirmationRemaining = Math.max(
    order.confirmationPaymentDue - order.prepaidAmount,
    0,
  );

  if (verifiedAmount < confirmationRemaining) {
    throw new OrderPaymentRequiredError(
      `Payment is insufficient. ${confirmationRemaining} is still required before confirmation.`,
    );
  }

  const newPrepaidAmount = order.prepaidAmount + verifiedAmount;

  const paymentStatus: PaymentStatus =
    newPrepaidAmount >= order.totalAmount ? "completed" : "partial";

  order.prepaidAmount = newPrepaidAmount;

  order.paymentStatus = paymentStatus;

  order.amountDueOnDelivery = Math.max(order.totalAmount - newPrepaidAmount, 0);

  await order.save();

  let orderData = await OrderRepository.adminOrderDetails(user, order);

  return orderData;
}
