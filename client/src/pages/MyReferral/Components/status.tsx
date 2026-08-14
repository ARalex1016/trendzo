// Lib
import { cn } from "@/lib/utils";

// Icons
import {
  Clock,
  CheckCircle2,
  ShieldCheck,
  BadgeCheck,
  XCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// Types
import type { ReferralStatus } from "@/types/referral.type";

export const statusMeta: Record<
  ReferralStatus,
  {
    label: string;
    icon: LucideIcon;
    className: string;
    dot: string;
    help: string;
  }
> = {
  pending: {
    label: "Pending",
    icon: Clock,
    className: "bg-muted-foreground/5 text-foreground/80",
    dot: "bg-muted-foreground/80",
    help: "Friend joined but hasn't placed a qualifying order.",
  },
  qualified: {
    label: "Qualified",
    icon: CheckCircle2,
    className: "bg-primary2/10 text-primary2",
    dot: "bg-primary2",
    help: "Friend placed an eligible order.",
  },
  holding: {
    label: "Holding",
    icon: ShieldCheck,
    className: "bg-info/10 text-info",
    dot: "bg-info",
    help: "Reward is being verified before release.",
  },
  completed: {
    label: "Completed",
    icon: BadgeCheck,
    className: "bg-success/10 text-success",
    dot: "bg-success",
    help: "Reward has been credited successfully.",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    className: "bg-destructive/10 text-destructive",
    dot: "bg-destructive",
    help: "Referral became ineligible because the qualifying order was cancelled, refunded, or failed verification.",
  },
};

export function StatusBadge({ status }: { status: ReferralStatus }) {
  const meta = statusMeta[status];
  const Icon = meta.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
        meta.className,
      )}
    >
      <Icon size={13} strokeWidth={2.2} />

      {meta.label}
    </span>
  );
}
