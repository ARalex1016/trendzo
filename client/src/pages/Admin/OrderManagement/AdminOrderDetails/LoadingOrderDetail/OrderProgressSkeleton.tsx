export function OrderProgressSkeleton() {
  return (
    <section className="rounded-2xl border border-white/[0.06] bg-[#161618] p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="h-5 w-32 animate-pulse rounded-md bg-white/[0.07]" />

        <div className="mt-2 h-4 w-56 max-w-full animate-pulse rounded-md bg-white/[0.05]" />
      </div>

      {/* Timeline */}
      <div className="relative">
        {Array.from({ length: 4 }).map((_, index) => {
          const isLast = index === 3;

          return (
            <div key={index} className="relative flex gap-4">
              {/* Connector */}
              {!isLast && (
                <div className="absolute left-[17px] top-9 h-[calc(100%-16px)] w-px bg-white/[0.06]" />
              )}

              {/* Circle */}
              <div className="relative z-10 h-9 w-9 shrink-0 animate-pulse rounded-full bg-white/[0.07]" />

              {/* Content */}
              <div className={isLast ? "pb-0" : "pb-7"}>
                <div className="h-4 w-32 animate-pulse rounded-md bg-white/[0.07]" />

                <div className="mt-2 h-3 w-64 max-w-[70vw] animate-pulse rounded-md bg-white/[0.05]" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
