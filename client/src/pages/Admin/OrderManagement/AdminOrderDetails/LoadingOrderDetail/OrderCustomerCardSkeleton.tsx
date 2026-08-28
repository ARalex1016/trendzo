interface OrderCustomerCardSkeletonProps {
  className?: string;
}

export function OrderCustomerCardSkeleton({
  className = "",
}: OrderCustomerCardSkeletonProps) {
  return (
    <section
      className={`rounded-2xl border border-white/[0.06] bg-[#161618] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.12)] ${className}`}
    >
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div>
          <div className="h-4 w-20 animate-pulse rounded-md bg-white/[0.07]" />
          <div className="mt-2 h-3 w-28 animate-pulse rounded-md bg-white/[0.04]" />
        </div>

        <div className="h-6 w-16 animate-pulse rounded-full bg-white/[0.06]" />
      </div>

      {/* Customer identity */}
      <div className="flex items-center gap-3.5">
        <div className="h-12 w-12 shrink-0 animate-pulse rounded-full bg-white/[0.07]" />

        <div className="min-w-0 flex-1">
          <div className="h-4 w-32 animate-pulse rounded-md bg-white/[0.07]" />
          <div className="mt-2 h-3 w-24 animate-pulse rounded-md bg-white/[0.04]" />
        </div>
      </div>

      {/* Contact information */}
      <div className="mt-5 space-y-2">
        <div className="flex items-center gap-3 rounded-xl bg-white/[0.025] px-3.5 py-3">
          <div className="h-8 w-8 shrink-0 animate-pulse rounded-lg bg-white/[0.05]" />

          <div className="min-w-0 flex-1">
            <div className="h-2.5 w-10 animate-pulse rounded bg-white/[0.04]" />
            <div className="mt-2 h-3 w-40 max-w-full animate-pulse rounded bg-white/[0.06]" />
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl bg-white/[0.025] px-3.5 py-3">
          <div className="h-8 w-8 shrink-0 animate-pulse rounded-lg bg-white/[0.05]" />

          <div className="min-w-0 flex-1">
            <div className="h-2.5 w-10 animate-pulse rounded bg-white/[0.04]" />
            <div className="mt-2 h-3 w-28 max-w-full animate-pulse rounded bg-white/[0.06]" />
          </div>
        </div>
      </div>
    </section>
  );
}
