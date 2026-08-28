import React from "react";

interface FinancialSummarySkeletonProps {
  className?: string;
}

const SkeletonLine: React.FC<{
  className?: string;
}> = ({ className = "" }) => {
  return (
    <div className={`animate-pulse rounded-md bg-zinc-800/80 ${className}`} />
  );
};

const FinancialSummarySkeleton: React.FC<FinancialSummarySkeletonProps> = ({
  className = "",
}) => {
  return (
    <section
      className={`overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/60 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800/70 px-4 py-4 sm:px-5">
        <div className="flex items-center gap-3">
          <SkeletonLine className="h-9 w-9 rounded-xl" />

          <div className="space-y-2">
            <SkeletonLine className="h-3.5 w-32" />
            <SkeletonLine className="h-2.5 w-40" />
          </div>
        </div>

        <SkeletonLine className="hidden h-5 w-5 rounded-full sm:block" />
      </div>

      {/* Rows */}
      <div className="space-y-1 px-4 py-4 sm:px-5">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="flex items-center justify-between gap-4 py-2.5"
          >
            <div className="flex items-center gap-2.5">
              <SkeletonLine className="h-7 w-7 rounded-lg" />
              <SkeletonLine className="h-3 w-20 sm:w-24" />
            </div>

            <SkeletonLine className="h-3 w-20 sm:w-24" />
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="border-t border-zinc-800/80 bg-zinc-950/30 px-4 py-4 sm:px-5">
        <div className="flex items-end justify-between gap-4">
          <div className="space-y-2">
            <SkeletonLine className="h-2.5 w-20" />
            <SkeletonLine className="h-2.5 w-28" />
          </div>

          <SkeletonLine className="h-7 w-28 rounded-lg sm:w-32" />
        </div>
      </div>
    </section>
  );
};

export default FinancialSummarySkeleton;
