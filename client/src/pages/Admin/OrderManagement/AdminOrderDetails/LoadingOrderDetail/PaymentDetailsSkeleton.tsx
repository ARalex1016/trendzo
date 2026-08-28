import { CreditCard } from "lucide-react";

interface PaymentDetailsSkeletonProps {
  className?: string;
}

export function PaymentDetailsSkeleton({
  className = "",
}: PaymentDetailsSkeletonProps) {
  return (
    <section
      className={[
        "overflow-hidden rounded-2xl",
        "border border-white/[0.06]",
        "bg-[#161618]",
        className,
      ].join(" ")}
    >
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-white/[0.06] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.04]">
            <CreditCard className="h-5 w-5 text-white/15" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>

        <Skeleton className="h-7 w-20 rounded-full" />
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6">
        {/* Method + Collection */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <SkeletonPaymentBox />
          <SkeletonPaymentBox />
        </div>

        {/* Summary */}
        <div className="mt-5 overflow-hidden rounded-xl border border-white/[0.06]">
          <div className="border-b border-white/[0.06] px-4 py-3">
            <Skeleton className="h-3 w-28" />
          </div>

          <div className="divide-y divide-white/[0.04]">
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow emphasized />
          </div>
        </div>

        {/* Message */}
        <div className="mt-5 flex gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          <Skeleton className="mt-0.5 h-4 w-4 rounded-full" />

          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-64 max-w-full" />
            <Skeleton className="h-3 w-full max-w-[420px]" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   Skeleton Primitives
========================================================= */

function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={[
        "animate-pulse rounded-md",
        "bg-white/[0.055]",
        className,
      ].join(" ")}
    />
  );
}

function SkeletonPaymentBox() {
  return (
    <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-4">
      <Skeleton className="h-3 w-24" />

      <div className="mt-3 flex items-center gap-3">
        <Skeleton className="h-9 w-9 rounded-lg" />

        <div className="space-y-2">
          <Skeleton className="h-3.5 w-28" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    </div>
  );
}

function SkeletonRow({ emphasized = false }: { emphasized?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3.5">
      <Skeleton className={emphasized ? "h-3.5 w-36" : "h-3 w-32"} />

      <Skeleton className={emphasized ? "h-4 w-24" : "h-3.5 w-20"} />
    </div>
  );
}
