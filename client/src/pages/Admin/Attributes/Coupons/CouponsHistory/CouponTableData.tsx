import { useState } from "react";

// Lib
import { cn } from "@/lib/utils";

// Icons
import NPRIcon from "@/assets/Images/npr-currency-icon.png";
import { Percent, Infinity, AlertTriangle, CheckCircle2 } from "lucide-react";

// Utils
import { formatCurrency } from "@/utils/CurrencyManager";
import { formatDate } from "@/utils/DateManager";

// Types
import type { CouponDataTable } from "./CouponsHistory";
import type { LucideIcon } from "lucide-react";

type CouponTypeConfig = {
  class?: string;
  icon: LucideIcon | string;
};

type UsersConfig = {
  label: string;
  class?: string;
};

export const CouponCode = ({ code }: { code: CouponDataTable["code"] }) => {
  return (
    <div
      className={cn(
        "text-primary font-medium bg-primary/10 border border-primary/60 rounded-md px-3",
      )}
    >
      <p>{code}</p>
    </div>
  );
};

export const CouponTypeCompo = ({
  type,
}: {
  type: CouponDataTable["type"];
}) => {
  const couponTypeConfig: Record<CouponDataTable["type"], CouponTypeConfig> = {
    fixed: {
      icon: NPRIcon,
      class: "bg-success/10 border-success/60 py-0",
    },
    percentage: {
      icon: Percent,
      class: "bg-info/10 border-info/60",
    },
  };

  const Icon = couponTypeConfig[type].icon;

  return (
    <div
      className={cn(
        "border flex justify-center items-center rounded-md p-0.5",
        couponTypeConfig[type].class,
      )}
    >
      {typeof Icon === "string" ? (
        <img
          src={Icon}
          alt="NPR"
          className={cn("size-5 object-contain aspect-square")}
        />
      ) : (
        <Icon className={cn("size-4 shrink-0")} />
      )}
    </div>
  );
};

export const Discount = ({
  value,
  type,
}: {
  value: CouponDataTable["value"];
  type: CouponDataTable["type"];
}) => {
  if (type === "percentage") {
    return (
      <p className="text-foreground font-medium flex flex-row items-center">
        {value}
        <Percent className="size-3.5" />
      </p>
    );
  }

  return (
    <p className="text-foreground font-medium">
      {formatCurrency(value, {
        decimals: false,
        symbol: "alternate",
      })}
    </p>
  );
};

export const MinPurchase = ({
  minPurchase,
}: {
  minPurchase: CouponDataTable["minPurchase"];
}) => {
  return (
    <p className="text-foreground/60 font-medium">
      {formatCurrency(minPurchase, {
        decimals: false,
        symbol: "alternate",
      })}
    </p>
  );
};

export const MaxDiscount = ({
  maxDiscount,
}: {
  maxDiscount: CouponDataTable["maxDiscount"];
}) => {
  return (
    <p className="text-foreground/60 font-medium">
      {maxDiscount
        ? formatCurrency(maxDiscount, {
            decimals: false,
            symbol: "alternate",
          })
        : "Unlimited"}
    </p>
  );
};

export const Users = ({
  applicableUsers,
}: {
  applicableUsers: CouponDataTable["applicableUsers"];
}) => {
  // let UserTypeForCoupon = "all" | "firstTime";

  const userConfig: Record<CouponDataTable["applicableUsers"], UsersConfig> = {
    all: {
      label: "All",
      class: "text-foreground/70 bg-accent border-border",
    },
    firstTime: {
      label: "First Time",
      class: "text-warning bg-warning/10 border-warning/60",
    },
  };
  return (
    <p
      className={cn(
        "text-xs font-medium rounded-md border text-nowrap px-3 py-0.5",
        userConfig[applicableUsers].class,
      )}
    >
      {userConfig[applicableUsers].label.toUpperCase()}
    </p>
  );
};

export const Usage = ({ usageLimit, usedCount }: CouponDataTable["usage"]) => {
  const isUnlimited = usageLimit == null;

  if (isUnlimited) {
    return (
      <div className="flex w-28 flex-col gap-1">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium text-foreground text-nowrap">
            {usedCount} used
          </span>

          <span className="flex items-center gap-1 text-[11px] font-medium text-primary">
            <Infinity className="size-3.5" />
            {/* Unlimited */}
          </span>
        </div>

        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full w-full rounded-full bg-primary/50" />
        </div>
      </div>
    );
  }

  const percentage =
    usageLimit > 0 ? Math.min((usedCount / usageLimit) * 100, 100) : 100;

  const isComplete = usedCount >= usageLimit;
  const isCritical = percentage >= 90;
  const isWarning = percentage >= 70;

  const state = isComplete
    ? {
        color: "text-destructive",
        bar: "bg-destructive",
        icon: AlertTriangle,
      }
    : isCritical
      ? {
          color: "text-destructive",
          bar: "bg-destructive",
          icon: AlertTriangle,
        }
      : isWarning
        ? {
            color: "text-warning",
            bar: "bg-warning",
            icon: AlertTriangle,
          }
        : {
            color: "text-success",
            bar: "bg-success",
            icon: CheckCircle2,
          };

  const Icon = state.icon;

  return (
    <div className="flex w-28 flex-col gap-1">
      {/* Count */}
      <div className="flex items-center justify-between gap-2">
        <span className={`text-sm font-semibold ${state.color}`}>
          {usedCount}
          <span className="text-xs font-normal text-muted-foreground">
            {" "}
            / {usageLimit}
          </span>
        </span>

        <span className={`flex items-center gap-1 text-[11px] ${state.color}`}>
          <Icon className="size-3" />
          {Math.round(percentage)}%
        </span>
      </div>

      {/* Progress */}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full transition-all ${state.bar}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export const Expiry = ({
  expiryDate,
}: {
  expiryDate: CouponDataTable["expiryDate"];
}) => {
  const expiry = new Date(expiryDate);
  const now = new Date();

  // Consider a coupon "expiring soon" when it expires within 7 days.
  const SOON_THRESHOLD_MS = 7 * 24 * 60 * 60 * 1000;
  const timeUntilExpiry = expiry.getTime() - now.getTime();

  const isExpired = timeUntilExpiry <= 0;
  const isExpiringSoon = !isExpired && timeUntilExpiry <= SOON_THRESHOLD_MS;

  const formattedDate = expiry.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  if (isExpired) {
    return (
      <div className="flex flex-col gap-0.5">
        <div className="w-16 flex justify-center gap-1.5 text-xs font-bold rounded-sm text-destructive bg-destructive/10 border border-destructive py-0.5">
          <span>EXPIRED</span>
        </div>
        <span className="text-[10px] text-muted-foreground font-medium">
          {formatDate(formattedDate)}
        </span>
      </div>
    );
  }

  if (isExpiringSoon) {
    return (
      <div className="flex flex-col gap-0.5">
        <div className="w-16 flex justify-center gap-1.5 text-xs font-bold rounded-sm text-info bg-info/10 border border-info py-0.5">
          <span>SOON</span>
        </div>
        <span className="text-[10px] text-muted-foreground font-medium">
          {formatDate(formattedDate)}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0.5">
      <div className="w-16 flex justify-center gap-1.5 text-xs font-bold rounded-sm text-success bg-success/10 border border-success py-0.5">
        <span>VALID</span>
      </div>

      <span className="text-[10px] text-muted-foreground font-medium">
        {formatDate(formattedDate)}
      </span>
    </div>
  );
};

const Switch = ({
  state,
  loading = false,
  onToggle,
}: {
  state: boolean;
  loading?: boolean;
  onToggle: () => void | Promise<void>;
}) => {
  const handleToggle = () => {
    if (loading) return;

    onToggle();
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={loading}
      aria-pressed={state}
      className={cn(
        "w-10 h-full flex flex-row items-center rounded-xl overflow-hidden transition-all duration-500 p-0.5",
        state ? "bg-success" : "bg-accent",
        loading && "cursor-not-allowed opacity-60",
      )}
    >
      <div
        className={cn(
          "size-4.5 aspect-square rounded-full transition-all duration-500",
          state
            ? "bg-foreground translate-x-full"
            : "bg-background translate-x-0",
          loading && "animate-pulse",
        )}
      />
    </button>
  );
};

export const Status = ({
  status,
  onToggle,
}: {
  status: CouponDataTable["status"];
  onToggle: () => void | Promise<void>;
}) => {
  let [updating, setUpdating] = useState<boolean>(false);

  const handleToggleStatus = async () => {
    setUpdating(true);
    try {
      await onToggle();
    } catch (error) {
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Switch
      state={status === "active"}
      loading={updating}
      onToggle={handleToggleStatus}
    />
  );
};

export const CreatedBy = ({
  createdBy,
}: {
  createdBy: CouponDataTable["createdBy"];
}) => {
  return <p className="text-foreground/70 font-medium">{createdBy?.name}</p>;
};

export const CreatedAt = ({
  createdAt,
}: {
  createdAt: CouponDataTable["createdAt"];
}) => {
  return (
    <p className="text-nowrap text-xs text-foreground/70 font-medium">
      {formatDate(createdAt)}
    </p>
  );
};
