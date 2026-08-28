export const OrderHeaderSkeleton = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#111113]">
      {/* Subtle loading glow */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/[0.02] blur-3xl"
      />

      <div className="relative animate-pulse p-4 sm:p-5 lg:p-6">
        {/* Main header */}

        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          {/* Identity */}

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-white/[0.06]" />

              <div className="h-7 w-36 rounded-lg bg-white/[0.08] sm:w-44" />

              <div className="h-6 w-20 rounded-full bg-white/[0.06]" />
            </div>

            <div className="mt-3 h-4 w-56 rounded bg-white/[0.05]" />
          </div>

          {/* Actions */}

          <div className="flex w-full gap-2 lg:w-auto">
            <div className="h-10 flex-1 rounded-xl bg-white/[0.08] lg:w-36 lg:flex-none" />

            <div className="h-10 w-11 rounded-xl bg-white/[0.06]" />
          </div>
        </div>

        {/* Summary */}

        <div className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
          <SkeletonSummary />
          <SkeletonSummary />
          <SkeletonSummary />
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   Skeleton Summary
========================================================= */

const SkeletonSummary = () => {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/[0.055] bg-white/[0.025] px-3.5 py-3">
      <div className="h-8 w-8 shrink-0 rounded-lg bg-white/[0.05]" />

      <div className="min-w-0 flex-1 space-y-2">
        <div className="h-2.5 w-20 rounded bg-white/[0.05]" />
        <div className="h-4 w-28 rounded bg-white/[0.07]" />
      </div>
    </div>
  );
};
