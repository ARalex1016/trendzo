// Types
import type { OrderStatus } from "../../Models/order.model.ts";

/**
 * Defines which status can follow each current status.
 *
 * IMPORTANT:
 * A status not listed here cannot transition to anything.
 */
export const ORDER_STATUS_TRANSITIONS: Record<
  OrderStatus,
  readonly OrderStatus[]
> = {
  pending: ["confirmed", "cancelled"],

  confirmed: ["shipped", "cancelled"],

  shipped: ["delivered", "cancelled"],

  delivered: ["returned"],

  returned: ["refunded"],

  cancelled: ["refunded"],

  refunded: [],
} as const;

export function canTransitionOrderStatus(
  currentStatus: OrderStatus,
  nextStatus: OrderStatus,
): boolean {
  return ORDER_STATUS_TRANSITIONS[currentStatus].includes(nextStatus);
}

export function getAvailableOrderStatuses(
  currentStatus: OrderStatus,
): readonly OrderStatus[] {
  return ORDER_STATUS_TRANSITIONS[currentStatus];
}

export function assertValidOrderTransition(
  currentStatus: OrderStatus,
  nextStatus: OrderStatus,
): void {
  if (currentStatus === nextStatus) {
    throw new Error(`Order is already in "${currentStatus}" status.`);
  }

  if (!canTransitionOrderStatus(currentStatus, nextStatus)) {
    throw new Error(
      `Invalid order status transition: "${currentStatus}" → "${nextStatus}".`,
    );
  }
}
