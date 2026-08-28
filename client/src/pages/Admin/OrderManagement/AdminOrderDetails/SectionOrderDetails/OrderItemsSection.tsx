import { Package, Tag, Palette, Ruler, ShoppingBag } from "lucide-react";
import type { LucideIcon } from "lucide-react";

// Types
import type { IOrderItemRes } from "@/types/order/order_response.type";

/* =========================================================
   Types
========================================================= */

interface OrderItemsProps {
  items: IOrderItemRes[];
  currency?: string;
}

/* =========================================================
   Helpers
========================================================= */

const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat("en-NP", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
};

/* =========================================================
   Small Info Item
========================================================= */

interface ItemMetaProps {
  icon: LucideIcon;
  label: string;
}

function ItemMeta({ icon: Icon, label }: ItemMetaProps) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-zinc-400">
      <Icon className="h-3.5 w-3.5 text-zinc-500" />
      {label}
    </span>
  );
}

/* =========================================================
   Order Items
========================================================= */

export default function OrderItems({
  items,
  currency = "NPR",
}: OrderItemsProps) {
  if (!items.length) {
    return (
      <section className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#161618]">
        <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.03]">
            <ShoppingBag className="h-5 w-5 text-zinc-500" />
          </div>

          <h3 className="text-sm font-medium text-zinc-200">No order items</h3>

          <p className="mt-1 max-w-sm text-xs text-zinc-500">
            There are no products associated with this order.
          </p>
        </div>
      </section>
    );
  }

  const subtotal = items.reduce(
    (sum, item) => sum + item.sellingPrice * item.quantity,
    0,
  );

  const totalDiscount = items.reduce(
    (sum, item) => sum + (item.discount ?? 0) * item.quantity,
    0,
  );

  const total = items.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <section className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#161618]">
      {/* =====================================================
          Header
      ===================================================== */}

      <div className="flex flex-col gap-3 border-b border-white/[0.06] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.03]">
            <Package className="h-4 w-4 text-zinc-300" />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-zinc-100">Order Items</h2>

            <p className="mt-0.5 text-xs text-zinc-500">
              {items.length} {items.length === 1 ? "product" : "products"}
            </p>
          </div>
        </div>

        <div className="self-start rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1 text-xs font-medium text-zinc-400 sm:self-auto">
          {items.reduce((sum, item) => sum + item.quantity, 0)} units
        </div>
      </div>

      {/* =====================================================
          Items
      ===================================================== */}

      <div className="divide-y divide-white/[0.05]">
        {items.map((item, index) => (
          <div
            key={item._id}
            className="group px-4 py-4 transition-colors hover:bg-white/[0.015] sm:px-5"
          >
            <div className="flex gap-3 sm:gap-4">
              {/* Product Image */}

              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-white/[0.06] bg-[#1A1A1D] sm:h-24 sm:w-24">
                {item.productImage.url ? (
                  <img
                    src={item.productImage.url}
                    alt={item.productImage.publicId}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Package className="h-6 w-6 text-zinc-600" />
                  </div>
                )}
              </div>

              {/* Product Content */}

              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex items-start gap-2">
                      <span className="mt-0.5 text-[11px] font-medium text-zinc-600">
                        #{String(index + 1).padStart(2, "0")}
                      </span>

                      <h3 className="line-clamp-2 text-sm font-medium leading-5 text-zinc-100">
                        {item.productName}
                      </h3>
                    </div>

                    {/* Variant information */}

                    {(item.color || item.size) && (
                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5">
                        {item.color && (
                          <ItemMeta icon={Palette} label={item.color.name} />
                        )}

                        {item.size && (
                          <ItemMeta icon={Ruler} label={`Size ${item.size}`} />
                        )}
                      </div>
                    )}

                    {/* SKU / product identifier */}

                    {item._id && (
                      <p className="mt-2 truncate text-[11px] text-zinc-600">
                        Product ID: {item._id}
                      </p>
                    )}
                  </div>

                  {/* Price */}

                  <div className="shrink-0 sm:text-right">
                    <p className="text-sm font-semibold text-zinc-100">
                      {formatCurrency(item.totalPrice, currency)}
                    </p>

                    <p className="mt-1 text-xs text-zinc-500">
                      {formatCurrency(item.sellingPrice, currency)} ×{" "}
                      {item.quantity}
                    </p>
                  </div>
                </div>

                {/* Bottom row */}

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.06] bg-white/[0.025] px-2 py-1 text-[11px] font-medium text-zinc-400">
                      <ShoppingBag className="h-3 w-3" />
                      Qty: {item.quantity}
                    </span>

                    {(item.discount ?? 0) > 0 && (
                      <span className="inline-flex items-center gap-1 rounded-md border border-emerald-400/10 bg-emerald-400/[0.06] px-2 py-1 text-[11px] font-medium text-emerald-400">
                        <Tag className="h-3 w-3" />
                        {formatCurrency(item.discount ?? 0, currency)} off
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* =====================================================
          Summary
      ===================================================== */}

      <div className="border-t border-white/[0.06] bg-white/[0.015] px-4 py-4 sm:px-5">
        <div className="ml-auto w-full space-y-2.5 sm:max-w-sm">
          {/* Subtotal */}

          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-500">Items subtotal</span>

            <span className="font-medium text-zinc-300">
              {formatCurrency(subtotal, currency)}
            </span>
          </div>

          {/* Discount */}

          {totalDiscount > 0 && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500">Item discounts</span>

              <span className="font-medium text-emerald-400">
                −{formatCurrency(totalDiscount, currency)}
              </span>
            </div>
          )}

          {/* Total */}

          <div className="flex items-center justify-between border-t border-white/[0.06] pt-3">
            <span className="text-sm font-semibold text-zinc-200">
              Items Total
            </span>

            <span className="text-base font-bold text-white">
              {formatCurrency(total, currency)}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
