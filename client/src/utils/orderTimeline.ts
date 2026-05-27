// Types
import type { OrderStatus } from "@/types/order/shared.type";
import { ORDER_FLOW, type StatusMeta } from "@/data/orderStatus";

type TimelineStepState = "completed" | "current" | "upcoming";

type TimelineStep = StatusMeta & {
  state: TimelineStepState;
};

type TimelineLinear = {
  type: "linear";
  steps: TimelineStep[];
};

type TimelineTerminal = {
  type: "terminal";
  current: StatusMeta | undefined;
};

export type OrderTimelineResult = TimelineLinear | TimelineTerminal;

export function getOrderTimeline(
  currentStatus: OrderStatus,
  statuses: StatusMeta[],
): OrderTimelineResult {
  const flowStatuses = statuses.filter((s) =>
    ORDER_FLOW.includes(s.key as any),
  );

  const currentIndex = flowStatuses.findIndex((s) => s.key === currentStatus);

  if (currentIndex === -1) {
    return {
      type: "terminal",
      current: statuses.find((s) => s.key === currentStatus),
    };
  }

  const steps: TimelineStep[] = flowStatuses.map((status, index) => {
    if (index < currentIndex) return { ...status, state: "completed" };
    if (index === currentIndex) return { ...status, state: "current" };
    return { ...status, state: "upcoming" };
  });

  return {
    type: "linear",
    steps,
  };
}
