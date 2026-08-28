import React from "react";
import {
  Banknote,
  CircleDollarSign,
  ReceiptText,
  Truck,
  Tag,
  Wallet,
} from "lucide-react";
import type { IOrderRes } from "@/types/order/order_response.type";

// Config
import { BRAND } from "@/config/brand";

interface FinancialSummaryProps {
  order: IOrderRes;
  className?: string;
}

const formatCurrency = (amount: number, currency: string = "NPR"): string => {
  return new Intl.NumberFormat("en-NP", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

interface SummaryRowProps {
  icon: React.ElementType;
  label: string;
  value: string;
  valueClassName?: string;
}

const SummaryRow: React.FC<SummaryRowProps> = ({
  icon: Icon,
  label,
  value,
  valueClassName = "text-zinc-200",
}) => {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <div className="flex min-w-0 items-center gap-2.5">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-zinc-800/70 text-zinc-400">
          <Icon className="h-3.5 w-3.5" />
        </div>

        <span className="truncate text-sm text-zinc-400">{label}</span>
      </div>

      <span
        className={`shrink-0 text-sm font-medium tabular-nums ${valueClassName}`}
      >
        {value}
      </span>
    </div>
  );
};

const FinancialSummary: React.FC<FinancialSummaryProps> = ({
  order,
  className = "",
}) => {
  const currency = BRAND.currency.code;

  return (
    <section
      className={`overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/60 shadow-[0_8px_30px_rgba(0,0,0,0.18)] ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800/70 px-4 py-4 sm:px-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-800 text-zinc-300">
            <ReceiptText className="h-4 w-4" />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-zinc-100">
              Financial Summary
            </h2>
            <p className="mt-0.5 text-xs text-zinc-500">
              Order payment breakdown
            </p>
          </div>
        </div>

        <CircleDollarSign className="hidden h-5 w-5 text-zinc-600 sm:block" />
      </div>

      {/* Breakdown */}
      <div className="px-4 py-3 sm:px-5">
        <SummaryRow
          icon={Banknote}
          label="Subtotal"
          value={formatCurrency(order.subtotal, currency)}
        />

        {order?.discount && order?.discount
          ? 0 && (
              <SummaryRow
                icon={Tag}
                label="Discount"
                value={`−${formatCurrency(order.discount, currency)}`}
                valueClassName="text-emerald-400"
              />
            )
          : ""}

        <SummaryRow
          icon={Truck}
          label="Shipping"
          value={
            order.deliveryCharge === 0
              ? "Free"
              : formatCurrency(order.deliveryCharge ?? 0, currency)
          }
          valueClassName={
            order.deliveryCharge === 0 ? "text-emerald-400" : "text-zinc-200"
          }
        />

        {/* {financial.tax !== undefined && financial.tax > 0 && (
          <SummaryRow
            icon={Wallet}
            label="Tax"
            value={formatCurrency(financial.tax, currency)}
          />
        )} */}
      </div>

      {/* Total */}
      <div className="border-t border-zinc-800/80 bg-zinc-950/30 px-4 py-4 sm:px-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              Total Amount
            </p>
            <p className="mt-1 text-xs text-zinc-600">Final order value</p>
          </div>

          <p className="text-xl font-bold tracking-tight text-white sm:text-2xl">
            {formatCurrency(order.totalAmount, currency)}
          </p>
        </div>
      </div>
    </section>
  );
};

export default FinancialSummary;
