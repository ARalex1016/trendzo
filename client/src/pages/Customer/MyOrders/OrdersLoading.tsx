const OrdersLoading = () => {
  return (
    <div className="w-full space-y-4">
      {/* Header skeleton */}
      <div className="flex items-center justify-between gap-4">
        <div className="h-7 w-32 animate-pulse rounded-lg bg-[var(--muted)]" />
        <div className="h-9 w-24 animate-pulse rounded-lg bg-[var(--muted)]" />
      </div>

      {/* Order cards */}
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="
            relative overflow-hidden
            rounded-2xl
            border border-[var(--border)]
            bg-[var(--card)]
            p-4 sm:p-5
          "
        >
          {/* Shimmer */}
          <div
            className="
              pointer-events-none absolute inset-0
              -translate-x-full
              animate-[shimmer_1.8s_infinite]
              bg-gradient-to-r
              from-transparent
              via-white/[0.04]
              to-transparent
            "
          />

          {/* Order header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <div className="h-4 w-28 animate-pulse rounded bg-[var(--muted)]" />
              <div className="h-3 w-40 animate-pulse rounded bg-[var(--muted)]" />
            </div>

            <div className="h-7 w-24 animate-pulse rounded-full bg-[var(--muted)]" />
          </div>

          {/* Divider */}
          <div className="my-4 h-px bg-[var(--border)]" />

          {/* Product */}
          <div className="flex gap-4">
            <div className="h-20 w-20 shrink-0 animate-pulse rounded-xl bg-[var(--muted)] sm:h-24 sm:w-24" />

            <div className="min-w-0 flex-1 space-y-3">
              <div className="h-4 w-3/4 animate-pulse rounded bg-[var(--muted)]" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-[var(--muted)]" />

              <div className="flex gap-3">
                <div className="h-3 w-14 animate-pulse rounded bg-[var(--muted)]" />
                <div className="h-3 w-14 animate-pulse rounded bg-[var(--muted)]" />
              </div>
            </div>

            <div className="hidden space-y-2 sm:block">
              <div className="ml-auto h-4 w-20 animate-pulse rounded bg-[var(--muted)]" />
              <div className="ml-auto h-3 w-12 animate-pulse rounded bg-[var(--muted)]" />
            </div>
          </div>

          {/* Footer */}
          <div className="mt-5 flex flex-col gap-3 border-t border-[var(--border)] pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="h-4 w-28 animate-pulse rounded bg-[var(--muted)]" />

            <div className="h-9 w-full animate-pulse rounded-lg bg-[var(--muted)] sm:w-28" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrdersLoading;
