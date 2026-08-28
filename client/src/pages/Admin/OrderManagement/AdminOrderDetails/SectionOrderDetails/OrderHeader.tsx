// Components
import { OrderTypeBadge } from "../Components/OrderTypeBadge";
import { OrderActions } from "../Action/OrderActions";

// Icons
import {
  Banknote,
  CheckCircle2,
  Clock3,
  CreditCard,
  RotateCcw,
  ShoppingBag,
  Store,
  Truck,
  Undo2,
  XCircle,
} from "lucide-react";

// Utils
import { formatCurrency } from "@/utils/CurrencyManager";
import { formatDate, formatTime } from "@/utils/DateManager";

// Types
import type { OrderWithAction } from "@/types/order/order_response.type";

/* =========================================================
   Types
========================================================= */

interface OrderHeaderProps {
  order: OrderWithAction;
}

/* =========================================================
   Config
========================================================= */

/* =========================================================
   Status Config
========================================================= */

const ORDER_STATUS_CONFIG = {
  pending: {
    label: "Pending",
    icon: Clock3,
    className: "border-amber-500/20 bg-amber-500/10 text-amber-400",
    dotClassName: "bg-amber-400",
  },

  confirmed: {
    label: "Confirmed",
    icon: CheckCircle2,
    className: "border-blue-500/20 bg-blue-500/10 text-blue-400",
    dotClassName: "bg-blue-400",
  },

  shipped: {
    label: "Shipped",
    icon: Truck,
    className: "border-violet-500/20 bg-violet-500/10 text-violet-400",
    dotClassName: "bg-violet-400",
  },

  delivered: {
    label: "Delivered",
    icon: CheckCircle2,
    className: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
    dotClassName: "bg-emerald-400",
  },

  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    className: "border-red-500/20 bg-red-500/10 text-red-400",
    dotClassName: "bg-red-400",
  },

  returned: {
    label: "Returned",
    icon: RotateCcw,
    className: "border-orange-500/20 bg-orange-500/10 text-orange-400",
    dotClassName: "bg-orange-400",
  },

  refunded: {
    label: "Refunded",
    icon: Undo2,
    className: "border-pink-500/20 bg-pink-500/10 text-pink-400",
    dotClassName: "bg-pink-400",
  },
} as const;

/* =========================================================
   Payment Status Config
========================================================= */

const PAYMENT_STATUS_CONFIG = {
  pending: {
    label: "Payment Pending",
    className: "border-amber-500/20 bg-amber-500/10 text-amber-400",
  },

  partial: {
    label: "Partially Paid",
    className: "border-orange-500/20 bg-orange-500/10 text-orange-400",
  },

  completed: {
    label: "Paid",
    className: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  },

  failed: {
    label: "Payment Failed",
    className: "border-red-500/20 bg-red-500/10 text-red-400",
  },
} as const;

/* =========================================================
   Component
========================================================= */

export default function OrderHeader({ order }: OrderHeaderProps) {
  const statusConfig = ORDER_STATUS_CONFIG[order.status];
  const paymentConfig = PAYMENT_STATUS_CONFIG[order.paymentStatus];

  const StatusIcon = statusConfig.icon;

  return (
    <header className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#111113]">
      {/* =====================================================
          Subtle background glow
      ===================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-violet-500/[0.07] blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-20 h-64 w-64 rounded-full bg-blue-500/[0.04] blur-3xl"
      />

      {/* =====================================================
          Main content
      ===================================================== */}

      <div className="relative p-4 sm:p-5 lg:p-6">
        {/* ===================================================
            Header identity
        =================================================== */}

        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          {/* Left */}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Order icon */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.035]">
                {order.orderType === "online" ? (
                  <ShoppingBag className="h-5 w-5 text-violet-400" />
                ) : (
                  <Store className="h-5 w-5 text-cyan-400" />
                )}
              </div>

              {/* Order number */}
              <h1 className="truncate text-xl font-semibold tracking-tight text-white sm:text-2xl">
                {order.orderNumber}
              </h1>

              {/* Order type */}
              <OrderTypeBadge type={order.orderType} />
            </div>

            {/* Date */}
            <p className="mt-2 text-sm text-white/40">
              Placed on{" "}
              <span className="text-white/60 font-medium">
                {formatDate(order.createdAt)}
              </span>{" "}
              at{" "}
              <span className="text-white/60 font-medium">
                {formatTime(order.createdAt)}
              </span>
            </p>
          </div>

          {/* =================================================
              Actions
          ================================================= */}

          <OrderActions order={order} />

          {/* <div className="flex w-full items-center gap-2 lg:w-auto"> */}
          {/* Primary action */}
          {/* {primaryAction && (
              <ActionButton
                action={primaryAction}
                config={ACTION_CONFIG[primaryAction]}
                onClick={() => onAction?.(primaryAction)}
                fullWidthOnMobile
              />
            )} */}

          {/* More actions */}
          {/* {secondaryActions.length > 0 && (
              <div className="group relative">
                <button
                  type="button"
                  className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.035] px-3.5 text-sm font-medium text-white/70 transition-all hover:border-white/[0.12] hover:bg-white/[0.06] hover:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                  aria-label="More order actions"
                >
                  <span className="hidden sm:inline">More</span>

                  <ChevronDown className="h-4 w-4" />
                </button>

                <div className="invisible absolute right-0 top-full z-30 mt-2 w-52 translate-y-1 rounded-xl border border-white/[0.08] bg-[#18181b] p-1.5 opacity-0 shadow-2xl shadow-black/40 transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  {secondaryActions.map((action) => {
                    const config = ACTION_CONFIG[action];

                    return (
                      <DropdownAction
                        key={action}
                        action={action}
                        config={config}
                        onClick={() => onAction?.(action)}
                      />
                    );
                  })}
                </div>
              </div>
            )} */}
          {/* </div> */}
        </div>

        {/* ===================================================
            Status summary
        =================================================== */}
        <div className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
          {/* Order status */}
          <SummaryItem
            icon={<StatusIcon className="h-4 w-4" />}
            label="Order Status"
            value={statusConfig.label}
            valueClassName={statusConfig.className}
          />

          {/* Payment status */}
          <SummaryItem
            icon={<CreditCard className="h-4 w-4" />}
            label="Payment"
            value={paymentConfig.label}
            valueClassName={paymentConfig.className}
          />

          {/* Total */}
          <SummaryItem
            icon={<Banknote className="h-4 w-4" />}
            label="Order Total"
            value={formatCurrency(order.totalAmount)}
          />
        </div>
      </div>
    </header>
  );
}

/* =========================================================
   Summary Item
========================================================= */

interface SummaryItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueClassName?: string;
}

function SummaryItem({ icon, label, value, valueClassName }: SummaryItemProps) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-xl border border-white/[0.055] bg-white/[0.025] px-3.5 py-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.045] text-white/50">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-wider text-white/35">
          {label}
        </p>

        {valueClassName ? (
          <span
            className={`mt-1 inline-flex max-w-full items-center truncate rounded-full border px-2 py-0.5 text-xs font-medium ${valueClassName}`}
          >
            {value}
          </span>
        ) : (
          <p className="mt-0.5 truncate text-sm font-semibold text-white">
            {value}
          </p>
        )}
      </div>
    </div>
  );
}
