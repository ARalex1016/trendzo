import {
  Check,
  Clock3,
  PackageCheck,
  PackageOpen,
  Truck,
  XCircle,
  RotateCcw,
  CircleDollarSign,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// Adjust this import to your actual frontend Order type.
import type { OrderStatus } from "@/types/order/shared.type";

interface OrderProgressProps {
  status: OrderStatus;
}

interface TimelineStep {
  status: OrderStatus;
  label: string;
  description: string;
  icon: LucideIcon;
}

const STEPS: TimelineStep[] = [
  {
    status: "pending",
    label: "Order Placed",
    description: "Order has been received and is awaiting confirmation.",
    icon: Clock3,
  },
  {
    status: "confirmed",
    label: "Order Confirmed",
    description: "Payment verified and order has been confirmed.",
    icon: PackageOpen,
  },
  {
    status: "shipped",
    label: "Shipped",
    description: "Order has been handed over for delivery.",
    icon: Truck,
  },
  {
    status: "delivered",
    label: "Delivered",
    description: "Order has been successfully delivered.",
    icon: PackageCheck,
  },
];

const STATUS_ORDER: Record<OrderStatus, number> = {
  pending: 0,
  confirmed: 1,
  shipped: 2,
  delivered: 3,

  // Terminal states
  cancelled: -1,
  returned: -1,
  refunded: -1,
};

const EXCEPTION_STATES: Record<
  "cancelled" | "returned" | "refunded",
  {
    label: string;
    description: string;
    icon: LucideIcon;
  }
> = {
  cancelled: {
    label: "Order Cancelled",
    description: "This order has been cancelled.",
    icon: XCircle,
  },
  returned: {
    label: "Order Returned",
    description: "This order has been returned.",
    icon: RotateCcw,
  },
  refunded: {
    label: "Order Refunded",
    description: "Payment for this order has been refunded.",
    icon: CircleDollarSign,
  },
};

export function OrderProgress({ status }: OrderProgressProps) {
  const isException = status in EXCEPTION_STATES;

  return (
    <section className="rounded-2xl border border-white/[0.06] bg-[#161618] p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-base font-semibold text-[#F5F5F5] sm:text-lg">
          Order Progress
        </h2>

        <p className="mt-1 text-sm text-[#A8A8A8]">
          Track the current status of this order.
        </p>
      </div>

      {/* Exception state */}
      {isException ? (
        <ExceptionState status={status as keyof typeof EXCEPTION_STATES} />
      ) : (
        <StandardTimeline status={status} />
      )}
    </section>
  );
}

/* =========================================================
   Standard Timeline
========================================================= */

function StandardTimeline({ status }: { status: OrderStatus }) {
  const currentIndex = STATUS_ORDER[status];

  return (
    <div className="relative">
      {STEPS.map((step, index) => {
        const stepIndex = STATUS_ORDER[step.status];

        const isCompleted = stepIndex < currentIndex;
        const isCurrent = stepIndex === currentIndex;
        const isLast = index === STEPS.length - 1;

        const Icon = step.icon;

        return (
          <div key={step.status} className="relative flex gap-4">
            {/* Connector */}
            {!isLast && (
              <div
                className={[
                  "absolute left-[17px] top-9 h-[calc(100%-16px)] w-px",
                  isCompleted ? "bg-violet-500/70" : "bg-white/[0.08]",
                ].join(" ")}
              />
            )}

            {/* Icon */}
            <div
              className={[
                "relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors",
                isCompleted
                  ? "border-violet-400/30 bg-violet-500/15 text-violet-300"
                  : isCurrent
                    ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.12)]"
                    : "border-white/[0.08] bg-[#1A1A1D] text-[#66666D]",
              ].join(" ")}
            >
              {isCompleted ? (
                <Check className="h-4 w-4" strokeWidth={2.5} />
              ) : (
                <Icon className="h-4 w-4" />
              )}
            </div>

            {/* Content */}
            <div className={isLast ? "pb-0" : "pb-7"}>
              <div className="flex flex-wrap items-center gap-2">
                <h3
                  className={[
                    "text-sm font-medium",
                    isCurrent || isCompleted
                      ? "text-[#F5F5F5]"
                      : "text-[#77777F]",
                  ].join(" ")}
                >
                  {step.label}
                </h3>

                {isCurrent && (
                  <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-cyan-300">
                    Current
                  </span>
                )}
              </div>

              <p
                className={[
                  "mt-1 max-w-xl text-xs leading-5 sm:text-sm",
                  isCurrent || isCompleted
                    ? "text-[#A8A8A8]"
                    : "text-[#5F5F66]",
                ].join(" ")}
              >
                {step.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* =========================================================
   Exception State
========================================================= */

function ExceptionState({ status }: { status: keyof typeof EXCEPTION_STATES }) {
  const state = EXCEPTION_STATES[status];
  const Icon = state.icon;

  return (
    <div className="flex items-start gap-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-red-400/20 bg-red-400/10 text-red-300">
        <Icon className="h-4 w-4" />
      </div>

      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-medium text-[#F5F5F5]">{state.label}</h3>

          <span className="rounded-full border border-red-400/20 bg-red-400/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-red-300">
            Final Status
          </span>
        </div>

        <p className="mt-1 text-xs leading-5 text-[#A8A8A8] sm:text-sm">
          {state.description}
        </p>
      </div>
    </div>
  );
}
