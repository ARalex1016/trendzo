// Lib
import { cn } from "@/lib/utils";

// Config
import { BRAND } from "@/config/brand";

// Utils
import { formatRelativeDate } from "@/utils/DateManager";

// Types
import type { Referral } from "./ReferralHistory";

export const CustomerData = ({ name, email }: Referral["customer"]) => {
  return (
    <div className="flex-col">
      <p className="text-sm font-medium text-foreground line-clamp-1">{name}</p>

      <p className="text-xs text-foreground/60 line-clamp-1">{email}</p>
    </div>
  );
};

export const Reward = ({
  reward,
  status,
}: {
  reward: Referral["reward"];
  status: Referral["status"];
}) => {
  return (
    <p
      className={cn(
        "text-foreground font-medium",
        status === "cancelled" && "text-foreground/60",
        status === "completed" && "text-success",
      )}
    >
      {status === "cancelled" ? "-" : `${BRAND.currency.code} ${reward}`}
    </p>
  );
};

export const JoinedAt = ({ date }: { date: Referral["createdAt"] }) => {
  return <p className="text-foreground/60">{formatRelativeDate(date)}</p>;
};
