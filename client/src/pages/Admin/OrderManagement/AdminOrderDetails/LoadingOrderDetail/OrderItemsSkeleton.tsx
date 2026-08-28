import { Package } from "lucide-react";

interface OrderItemsSkeletonProps {
  itemCount?: number;
}

export default function OrderItemsSkeleton({
  itemCount = 3,
}: OrderItemsSkeletonProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#161618]">
      {/* =====================================================
          Header Skeleton
      ===================================================== */}

      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-4 sm:px-5">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 animate-pulse rounded-xl bg-white/[0.06]" />

          <div className="space-y-1.5">
            <div className="h-3.5 w-24 animate-pulse rounded bg-white/[0.07]" />
            <div className="h-2.5 w-16 animate-pulse rounded bg-white/[0.04]" />
          </div>
        </div>

        <div className="h-6 w-16 animate-pulse rounded-full bg-white/[0.05]" />
      </div>

      {/* =====================================================
          Items Skeleton
      ===================================================== */}

      <div className="divide-y divide-white/[0.05]">
        {Array.from({ length: itemCount }).map((_, index) => (
          <div key={index} className="px-4 py-4 sm:px-5">
            <div className="flex gap-3 sm:gap-4">
              {/* Image */}

              <div className="h-20 w-20 shrink-0 animate-pulse rounded-xl bg-white/[0.06] sm:h-24 sm:w-24" />

              {/* Content */}

              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 w-3/4 max-w-xs animate-pulse rounded bg-white/[0.07]" />

                    <div className="flex gap-4">
                      <div className="h-2.5 w-14 animate-pulse rounded bg-white/[0.04]" />
                      <div className="h-2.5 w-12 animate-pulse rounded bg-white/[0.04]" />
                    </div>

                    <div className="h-2 w-32 animate-pulse rounded bg-white/[0.03]" />
                  </div>

                  <div className="space-y-2 sm:text-right">
                    <div className="ml-auto h-3.5 w-20 animate-pulse rounded bg-white/[0.07]" />
                    <div className="ml-auto h-2.5 w-16 animate-pulse rounded bg-white/[0.04]" />
                  </div>
                </div>

                {/* Bottom */}

                <div className="mt-4 flex justify-between">
                  <div className="h-6 w-16 animate-pulse rounded-md bg-white/[0.04]" />
                  <div className="h-6 w-20 animate-pulse rounded-md bg-white/[0.04]" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* =====================================================
          Summary Skeleton
      ===================================================== */}

      <div className="border-t border-white/[0.06] bg-white/[0.015] px-4 py-4 sm:px-5">
        <div className="ml-auto w-full space-y-3 sm:max-w-sm">
          <div className="flex justify-between">
            <div className="h-3 w-24 animate-pulse rounded bg-white/[0.04]" />
            <div className="h-3 w-20 animate-pulse rounded bg-white/[0.05]" />
          </div>

          <div className="flex justify-between">
            <div className="h-3 w-20 animate-pulse rounded bg-white/[0.04]" />
            <div className="h-3 w-16 animate-pulse rounded bg-white/[0.05]" />
          </div>

          <div className="flex justify-between border-t border-white/[0.06] pt-3">
            <div className="h-4 w-24 animate-pulse rounded bg-white/[0.06]" />
            <div className="h-5 w-24 animate-pulse rounded bg-white/[0.07]" />
          </div>
        </div>
      </div>
    </section>
  );
}
