import { statusMeta } from "./status";

// Types
import type { ReferralStatus } from "@/types/referral.type";

const order: ReferralStatus[] = [
  "pending",
  "qualified",
  "holding",
  "completed",
  "cancelled",
];

const StatusLegend = () => {
  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-panel sm:p-5">
      <h2 className="text-[13px] font-semibold tracking-wide text-foreground">
        Referral Status Guide
      </h2>

      <div className="mt-3 grid gap-x-6 gap-y-3 sm:grid-cols-2 xl:grid-cols-3">
        {order.map((s) => {
          const meta = statusMeta[s];
          return (
            <div key={s} className="flex items-start gap-2.5">
              <span
                className={`mt-0.5 inline-flex shrink-0 items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${meta.className}`}
              >
                <span className={`size-1.5 rounded-full ${meta.dot}`} />
                {meta.label}
              </span>

              <p className="text-xs leading-relaxed text-muted-foreground">
                {meta.help}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default StatusLegend;
