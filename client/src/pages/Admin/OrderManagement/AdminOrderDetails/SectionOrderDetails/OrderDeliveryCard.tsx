import {
  Check,
  Clock3,
  Copy,
  ExternalLink,
  Mail,
  MapPin,
  Package,
  Phone,
  Truck,
} from "lucide-react";
import { useState } from "react";

import type {
  DeliveryAddress,
  OrderStatus,
  OrderType,
} from "@/types/order/shared.type";

interface OrderDeliveryCardProps {
  orderType: OrderType;
  status: OrderStatus;
  deliveryAddress?: DeliveryAddress;
  deliveryCharge?: number;
  shippedAt?: string;
  deliveredAt?: string;
  orderNote?: string;
  currency?: string;
}

const statusSteps: {
  status: OrderStatus;
  label: string;
}[] = [
  {
    status: "confirmed",
    label: "Confirmed",
  },
  {
    status: "shipped",
    label: "Shipped",
  },
  {
    status: "delivered",
    label: "Delivered",
  },
];

const statusOrder: OrderStatus[] = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
];

function formatDate(date?: string) {
  if (!date) return "—";

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

function getStatusIndex(status: OrderStatus) {
  return statusOrder.indexOf(status);
}

function isStepCompleted(currentStatus: OrderStatus, stepStatus: OrderStatus) {
  const currentIndex = getStatusIndex(currentStatus);
  const stepIndex = getStatusIndex(stepStatus);

  if (currentStatus === "cancelled" || currentStatus === "returned") {
    return false;
  }

  if (currentStatus === "refunded") {
    return true;
  }

  return currentIndex >= stepIndex;
}

function isCurrentStep(currentStatus: OrderStatus, stepStatus: OrderStatus) {
  return currentStatus === stepStatus;
}

export function OrderDeliveryCard({
  orderType,
  status,
  deliveryAddress,
  deliveryCharge,
  shippedAt,
  deliveredAt,
  orderNote,
  currency = "NPR",
}: OrderDeliveryCardProps) {
  const [copied, setCopied] = useState(false);

  const isInStore = orderType === "in_store";

  const addressText = deliveryAddress
    ? [
        deliveryAddress.address,
        deliveryAddress.city,
        deliveryAddress.postalCode,
        deliveryAddress.country,
      ]
        .filter(Boolean)
        .join(", ")
    : "";

  const handleCopyAddress = async () => {
    if (!addressText) return;

    try {
      await navigator.clipboard.writeText(addressText);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      // Clipboard may not be available in some browsers.
    }
  };

  return (
    <section className="rounded-2xl border border-white/[0.07] bg-[#161618] p-5 shadow-sm sm:p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
            {isInStore ? (
              <Package className="h-5 w-5" />
            ) : (
              <Truck className="h-5 w-5" />
            )}
          </div>

          <div>
            <h2 className="text-sm font-semibold text-white sm:text-base">
              {isInStore ? "Pickup Information" : "Delivery Information"}
            </h2>

            <p className="mt-0.5 text-xs text-zinc-500">
              {isInStore
                ? "Order is being fulfilled in-store"
                : "Shipping and delivery details"}
            </p>
          </div>
        </div>

        <span
          className={[
            "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize",
            status === "delivered" && "bg-emerald-500/10 text-emerald-400",
            status === "shipped" && "bg-blue-500/10 text-blue-400",
            status === "confirmed" && "bg-violet-500/10 text-violet-400",
            status === "pending" && "bg-amber-500/10 text-amber-400",
            ["cancelled", "returned", "refunded"].includes(status) &&
              "bg-red-500/10 text-red-400",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {status}
        </span>
      </div>

      {/* Cancelled / Returned / Refunded */}
      {["cancelled", "returned", "refunded"].includes(status) ? (
        <div className="mt-5 rounded-xl border border-red-500/10 bg-red-500/[0.04] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-500/10">
              <Clock3 className="h-4 w-4 text-red-400" />
            </div>

            <div>
              <p className="text-sm font-medium capitalize text-zinc-200">
                Order {status}
              </p>
              <p className="mt-0.5 text-xs text-zinc-500">
                Delivery process is no longer active.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Delivery timeline */
        <div className="mt-7">
          <div className="flex items-start">
            {statusSteps.map((step, index) => {
              const completed = isStepCompleted(status, step.status);
              const current = isCurrentStep(status, step.status);
              const isLast = index === statusSteps.length - 1;

              return (
                <div
                  key={step.status}
                  className={[
                    "flex min-w-0 flex-1 items-start",
                    !isLast ? "relative" : "",
                  ].join(" ")}
                >
                  <div className="flex w-full flex-col items-center">
                    <div className="flex w-full items-center">
                      {/* Left connector */}
                      {index > 0 && (
                        <div
                          className={[
                            "h-px flex-1",
                            completed ? "bg-emerald-500/60" : "bg-white/[0.08]",
                          ].join(" ")}
                        />
                      )}

                      {/* Circle */}
                      <div
                        className={[
                          "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors",
                          completed
                            ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                            : "border-white/[0.08] bg-[#1a1a1d] text-zinc-600",
                          current && "ring-4 ring-emerald-500/10",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      >
                        {completed ? (
                          <Check className="h-3.5 w-3.5" />
                        ) : (
                          <span className="h-2 w-2 rounded-full bg-current" />
                        )}
                      </div>

                      {/* Right connector */}
                      {!isLast && (
                        <div
                          className={[
                            "h-px flex-1",
                            getStatusIndex(status) > getStatusIndex(step.status)
                              ? "bg-emerald-500/60"
                              : "bg-white/[0.08]",
                          ].join(" ")}
                        />
                      )}
                    </div>

                    <div className="mt-2 text-center">
                      <p
                        className={[
                          "text-xs font-medium",
                          completed ? "text-zinc-200" : "text-zinc-600",
                        ].join(" ")}
                      >
                        {step.label}
                      </p>

                      {step.status === "shipped" && shippedAt && (
                        <p className="mt-1 text-[10px] text-zinc-600">
                          {formatDate(shippedAt)}
                        </p>
                      )}

                      {step.status === "delivered" && deliveredAt && (
                        <p className="mt-1 text-[10px] text-zinc-600">
                          {formatDate(deliveredAt)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* In-store */}
      {isInStore ? (
        <div className="mt-6 rounded-xl border border-white/[0.06] bg-[#1a1a1d] p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-500/10">
              <Package className="h-4 w-4 text-violet-400" />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-medium text-zinc-200">
                In-Store Order
              </p>

              <p className="mt-1 text-xs leading-5 text-zinc-500">
                This order does not require delivery. The order is handled
                directly at the store.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Recipient + Address */}
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {/* Recipient */}
            <div className="rounded-xl border border-white/[0.06] bg-[#1a1a1d] p-4">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04]">
                  <MapPin className="h-4 w-4 text-zinc-400" />
                </div>

                <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Recipient
                </p>
              </div>

              {deliveryAddress ? (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-zinc-100">
                    {deliveryAddress.name}
                  </p>

                  <div className="space-y-1.5">
                    {deliveryAddress.phone && (
                      <a
                        href={`tel:${deliveryAddress.phone}`}
                        className="flex items-center gap-2 text-xs text-zinc-400 transition-colors hover:text-white"
                      >
                        <Phone className="h-3.5 w-3.5" />
                        {deliveryAddress.phone}
                      </a>
                    )}

                    {deliveryAddress.email && (
                      <a
                        href={`mailto:${deliveryAddress.email}`}
                        className="flex items-center gap-2 truncate text-xs text-zinc-400 transition-colors hover:text-white"
                      >
                        <Mail className="h-3.5 w-3.5 shrink-0" />
                        {deliveryAddress.email}
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-zinc-600">
                  No recipient information
                </p>
              )}
            </div>

            {/* Address */}
            <div className="rounded-xl border border-white/[0.06] bg-[#1a1a1d] p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04]">
                    <MapPin className="h-4 w-4 text-zinc-400" />
                  </div>

                  <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                    Delivery Address
                  </p>
                </div>

                {addressText && (
                  <button
                    type="button"
                    onClick={handleCopyAddress}
                    className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs text-zinc-500 transition-colors hover:bg-white/[0.04] hover:text-zinc-200"
                    title="Copy address"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        Copy
                      </>
                    )}
                  </button>
                )}
              </div>

              {deliveryAddress ? (
                <div>
                  <p className="text-sm leading-6 text-zinc-300">
                    {deliveryAddress.address}
                  </p>

                  <p className="mt-1 text-xs text-zinc-500">
                    {[
                      deliveryAddress.city,
                      deliveryAddress.postalCode,
                      deliveryAddress.country,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-zinc-600">No delivery address</p>
              )}
            </div>
          </div>

          {/* Delivery metadata */}
          <div className="mt-4 grid grid-cols-1 divide-y divide-white/[0.06] rounded-xl border border-white/[0.06] bg-[#1a1a1d] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <div className="p-4">
              <p className="text-xs text-zinc-500">Delivery Charge</p>
              <p className="mt-1 text-sm font-semibold text-zinc-200">
                {typeof deliveryCharge === "number"
                  ? `${currency} ${deliveryCharge.toLocaleString()}`
                  : "—"}
              </p>
            </div>

            <div className="p-4">
              <p className="text-xs text-zinc-500">Shipped At</p>
              <p className="mt-1 text-sm font-medium text-zinc-300">
                {formatDate(shippedAt)}
              </p>
            </div>

            <div className="p-4">
              <p className="text-xs text-zinc-500">Delivered At</p>
              <p className="mt-1 text-sm font-medium text-zinc-300">
                {formatDate(deliveredAt)}
              </p>
            </div>
          </div>
        </>
      )}

      {/* Order note */}
      {orderNote && (
        <div className="mt-4 rounded-xl border border-amber-500/10 bg-amber-500/[0.03] p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-amber-400/70">
            Delivery Note
          </p>

          <p className="mt-2 text-sm leading-6 text-zinc-400">{orderNote}</p>
        </div>
      )}
    </section>
  );
}
