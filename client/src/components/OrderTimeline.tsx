import { orderStatus } from "@/data/orderStatus";

// Utils
import { getOrderTimeline } from "@/utils/orderTimeline";

// Types
import type { OrderStatus } from "@/types/order/shared.type";

type Orientation = "vertical" | "horizontal";

type Props = {
  currentStatus: OrderStatus;
  orientation?: Orientation;
};

export function OrderTimeline({
  currentStatus,
  orientation = "horizontal",
}: Props) {
  const timeline = getOrderTimeline(currentStatus, orderStatus);

  if (timeline.type === "terminal") {
    const status = timeline.current;

    if (!status) return null;

    const Icon = status.Icon;

    return (
      <div className="flex items-center gap-3 rounded-xl border bg-red-50 p-4">
        <Icon className={`size-6 ${status.color}`} />

        <div>
          <p className="font-semibold">{status.label} </p>

          <p className="text-sm text-gray-500">{status.description}</p>
        </div>
      </div>
    );
  }

  const isVertical = orientation === "vertical";

  return (
    <div
      className={isVertical ? "flex flex-col gap-8" : "flex w-full items-start"}
    >
      {timeline.steps.map((step, index) => {
        const Icon = step.Icon;

        const isLast = index === timeline.steps.length - 1;

        const isCompleted = step.state === "completed";

        const isCurrent = step.state === "current";

        return (
          <div
            key={step.key}
            className={
              isVertical
                ? "relative flex gap-4"
                : "relative flex flex-1 flex-col items-center"
            }
          >
            {/* HORIZONTAL CONNECTOR */}
            {!isVertical && !isLast && (
              <div
                className={`absolute left-[calc(50%+1.25rem)] top-5 h-0.5 w-[calc(100%-2.5rem)]
                ${isCompleted ? "bg-green-500" : "bg-gray-200"}`}
              />
            )}

            {/* ICON + VERTICAL LINE */}
            <div className="relative flex shrink-0 flex-col items-center">
              {/* ICON */}
              <div
                className={`z-10 flex size-10 items-center justify-center rounded-full border
                ${
                  isCompleted
                    ? "border-green-500 bg-green-500 text-white"
                    : isCurrent
                      ? "border-blue-500 bg-blue-500 text-white"
                      : "border-gray-200 bg-gray-100 text-gray-400"
                }`}
              >
                <Icon className="size-5" />
              </div>

              {/* VERTICAL CONNECTOR */}
              {isVertical && !isLast && (
                <div
                  className={`absolute top-10 h-8 w-0.5
                  ${isCompleted ? "bg-green-500" : "bg-gray-200"}`}
                />
              )}
            </div>

            {/* CONTENT */}
            <div className={isVertical ? "pt-1" : "mt-3 max-w-35 text-center"}>
              <p
                className={`font-medium
                ${
                  isCurrent
                    ? "text-blue-600"
                    : isCompleted
                      ? "text-blue-600"
                      : "text-muted-foreground"
                }`}
              >
                {step.label}
              </p>

              <p className="text-sm text-gray-500">{step.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
