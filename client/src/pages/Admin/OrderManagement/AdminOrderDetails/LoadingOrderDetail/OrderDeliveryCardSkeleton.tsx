import { Skeleton } from "@/components/ui/skeleton";

interface OrderDeliveryCardSkeletonProps {
  className?: string;
}

export function OrderDeliveryCardSkeleton({
  className = "",
}: OrderDeliveryCardSkeletonProps) {
  return (
    <section
      className={[
        "rounded-2xl border border-white/[0.07] bg-[#161618] p-5 shadow-sm sm:p-6",
        className,
      ].join(" ")}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-xl" />

          <div className="space-y-2">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>

        <Skeleton className="h-6 w-20 rounded-full" />
      </div>

      {/* Timeline */}
      <div className="mt-7">
        <div className="flex items-start">
          {[0, 1, 2].map((step) => (
            <div key={step} className="flex min-w-0 flex-1 items-start">
              <div className="flex w-full flex-col items-center">
                <div className="flex w-full items-center">
                  {step > 0 && <Skeleton className="h-px flex-1" />}

                  <Skeleton className="h-8 w-8 shrink-0 rounded-full" />

                  {step < 2 && <Skeleton className="h-px flex-1" />}
                </div>

                <Skeleton className="mt-3 h-3 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recipient + Address */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-white/[0.06] bg-[#1a1a1d] p-4">
          <Skeleton className="mb-5 h-4 w-24" />

          <Skeleton className="h-4 w-32" />

          <div className="mt-3 space-y-2">
            <Skeleton className="h-3 w-36" />
            <Skeleton className="h-3 w-44" />
          </div>
        </div>

        <div className="rounded-xl border border-white/[0.06] bg-[#1a1a1d] p-4">
          <div className="mb-5 flex items-center justify-between">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-6 w-12 rounded-lg" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-3 w-full max-w-xs" />
            <Skeleton className="h-3 w-40" />
          </div>
        </div>
      </div>

      {/* Metadata */}
      <div className="mt-4 grid grid-cols-1 divide-y divide-white/[0.06] rounded-xl border border-white/[0.06] bg-[#1a1a1d] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {[0, 1, 2].map((item) => (
          <div key={item} className="p-4">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="mt-2 h-4 w-28" />
          </div>
        ))}
      </div>
    </section>
  );
}
