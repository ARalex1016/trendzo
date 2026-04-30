// Data
import { orderStatus } from "@/data/orderStatus";

// Utils
import { getOrderTimeline } from "@/utils/orderTimeline";

// Types
import type { OrderStatus } from "@/types/order.type";

type Props = {
  currentStatus: OrderStatus;
};

export function OrderTimeline({ currentStatus }: Props) {
  const timeline = getOrderTimeline(currentStatus, orderStatus);

  if (timeline.type === "terminal") {
    const status = timeline.current;

    if (!status) return null;

    const Icon = status.Icon;

    return (
      <div className="flex items-center gap-3 p-4 border rounded-xl bg-red-50">
        <Icon className={`w-6 h-6 ${status.color}`} />
        <div>
          <p className="font-semibold">{status.label}</p>
          <p className="text-sm text-gray-500">{status.description}</p>
        </div>
      </div>
    );
  }

  // ✅ Now TypeScript KNOWS this is linear
  return (
    <div className="flex flex-col gap-6">
      {timeline.steps.map((step) => {
        const Icon = step.Icon;

        return (
          <div key={step.key} className="flex gap-4">
            <div className="flex flex-col items-center">
              {/* Icons */}
              <div
                className={`size-10 flex items-center justify-center rounded-full border
                ${
                  step.state === "completed"
                    ? "bg-green-500 text-white"
                    : step.state === "current"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-400"
                }`}
              >
                <Icon className="size-5" />
              </div>

              <div
                className={`w-0.5 flex-1 mt-1
                ${step.state === "completed" ? "bg-green-500" : "bg-gray-200"}`}
              />
            </div>

            <div>
              <p
                className={`font-medium
                ${
                  step.state === "current"
                    ? "text-blue-600"
                    : step.state === "completed"
                      ? "text-gray-900"
                      : "text-gray-400"
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
