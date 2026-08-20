// Components
import { PageShell } from "@/components/Container";

interface LoadingOrderDetailsProps {
  orderNumber?: string;
}

export const LoadingOrderDetails: React.FC<LoadingOrderDetailsProps> = ({
  orderNumber,
}) => {
  return (
    <PageShell>
      <div className="w-full rounded-2xl border border-foreground/5 bg-card p-6 shadow-[0_8px_30px_rgba(0,0,0,0.25)]">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-foreground/5">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/10 border-t-white/70" />
            </div>

            <div className="space-y-2">
              <div className="h-4 w-32 animate-pulse rounded-md bg-white/[0.07]" />
              <div className="h-3 w-48 animate-pulse rounded-md bg-white/[0.04]" />
            </div>
          </div>

          <div className="hidden h-8 w-20 animate-pulse rounded-lg bg-white/[0.04] sm:block" />
        </div>

        {/* Search information */}
        <div className="mt-6 rounded-xl border border-white/[0.05] bg-[#111113] p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-white/40">
                Searching order
              </p>

              <p className="mt-1 font-mono text-sm text-white/80">
                {orderNumber || "Order number"}
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-white/50">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-400" />
              </span>
              Fetching order...
            </div>
          </div>
        </div>

        {/* Skeleton content */}
        <div className="mt-6 space-y-4">
          <div className="h-4 w-24 animate-pulse rounded bg-white/[0.06]" />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </div>
    </PageShell>
  );
};

const SkeletonCard = () => {
  return (
    <div className="rounded-xl border border-white/[0.05] bg-[#111113] p-4">
      <div className="h-3 w-20 animate-pulse rounded bg-white/[0.05]" />
      <div className="mt-3 h-5 w-28 animate-pulse rounded bg-white/[0.07]" />
      <div className="mt-2 h-3 w-36 animate-pulse rounded bg-white/[0.04]" />
    </div>
  );
};
