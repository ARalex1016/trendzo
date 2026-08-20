import React from "react";

// Componnets
import { PageShell } from "@/components/Container";

interface OrderNotFoundProps {
  orderNumber: string;
  onBack?: () => void;
  onRetry?: () => void;
}

export const OrderNotFound: React.FC<OrderNotFoundProps> = ({
  orderNumber,
  onBack,
  onRetry,
}) => {
  return (
    <PageShell>
      <div className="flex w-full flex-col items-center justify-center rounded-2xl border border-white/[0.06] bg-[#161618] px-6 py-14 text-center shadow-[0_8px_30px_rgba(0,0,0,0.25)]">
        {/* Icon */}
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.03]">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-7 w-7 text-white/40"
            aria-hidden="true"
          >
            <path
              d="M10.5 3H6.8C5.81 3 5 3.81 5 4.8v14.4c0 .99.81 1.8 1.8 1.8h10.4c.99 0 1.8-.81 1.8-1.8v-7.7"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <path
              d="M14 3h3.2L21 6.8v3.7"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle
              cx="15.5"
              cy="15.5"
              r="3.5"
              stroke="currentColor"
              strokeWidth="1.6"
            />
            <path
              d="m18.2 18.2 2.3 2.3"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Text */}
        <h3 className="mt-5 text-lg font-semibold tracking-tight text-white">
          Order not found
        </h3>

        <p className="mt-2 max-w-md text-sm leading-6 text-white/45">
          We couldn&apos;t find an order matching the order number you entered.
          Check the number and try again.
        </p>

        {/* Order number */}
        <div className="mt-5 rounded-xl border border-white/[0.06] bg-[#111113] px-4 py-3">
          <p className="text-[11px] font-medium uppercase tracking-wider text-white/35">
            Searched order number
          </p>

          <p className="mt-1 font-mono text-sm text-white/75">{orderNumber}</p>
        </div>

        {/* Actions */}
        {(onBack || onRetry) && (
          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-white/70 transition hover:bg-white/[0.06] hover:text-white focus:outline-none focus:ring-2 focus:ring-white/10"
              >
                Back
              </button>
            )}

            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/20"
              >
                Try again
              </button>
            )}
          </div>
        )}
      </div>
    </PageShell>
  );
};
