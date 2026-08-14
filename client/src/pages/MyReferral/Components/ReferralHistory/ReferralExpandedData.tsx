import React from "react";
import { Timeline } from "@/components/Timeline";

// Lib
import { cn } from "@/lib/utils";

// Utils
import { formatDateToReadable } from "@/utils/DateManager";

// Icons
import {
  BadgeCheck,
  CircleX,
  Clock3,
  UserPlus,
  WalletCards,
} from "lucide-react";

// Types
import type { Referral } from "./ReferralHistory";
import type { TimelineItem } from "@/components/Timeline";

export function referralToTimeline(referral: Referral): TimelineItem[] {
  const items: TimelineItem[] = [];

  // 1. Referral Created
  items.push({
    id: "created",
    title: "Referral Created",
    description: "The referral was successfully created.",
    date: formatDateToReadable(referral.createdAt),
    status: "completed",
    icon: UserPlus,
  });

  // 2. Qualified
  if (referral.qualifiedAt) {
    items.push({
      id: "qualified",
      title: "Qualified",
      description: "The referred user completed the qualifying purchase.",
      date: formatDateToReadable(referral.qualifiedAt),
      status: "completed",
      icon: BadgeCheck,
    });
  }

  // 3. Holding
  if (referral.deliveredAt) {
    items.push({
      id: "holding",
      title: "Reward Holding",
      description: referral.holdUntil
        ? `The reward is being held until ${formatDateToReadable(referral.holdUntil)}.`
        : "The reward is currently being held.",
      date: referral.holdUntil
        ? formatDateToReadable(referral.holdUntil)
        : undefined,
      status: referral.status === "holding" ? "current" : "completed",
      icon: Clock3,
    });
  }

  // 4. Completed
  if (referral.status === "completed") {
    items.push({
      id: "completed",
      title: "Reward Completed",
      description: "The referral reward has been credited to your wallet.",
      date: referral.deliveredAt
        ? formatDateToReadable(referral.deliveredAt)
        : undefined,
      status: "completed",
      icon: WalletCards,
    });
  }

  // 5. Cancelled
  if (referral.status === "cancelled") {
    items.push({
      id: "cancelled",
      title: "Referral Cancelled",
      description: referral.cancelReason || "This referral was cancelled.",
      date: formatDateToReadable(referral.updatedAt),
      status: "cancelled",
      icon: CircleX,
    });
  }

  return items;
}

const Container = ({
  title,
  children,
  className,
}: React.ComponentProps<"div"> & {
  title: string;
}) => {
  return (
    <div className={cn("space-y-3", className)}>
      <p className="text-foreground/60 text-sm font-medium">
        {title.toLocaleUpperCase()}
      </p>

      {children}
    </div>
  );
};

const DetailItem = ({
  label,
  value,
}: {
  label: string;
  value: string | number | Date | React.ReactNode;
}) => {
  return (
    <div className="flex flex-row justify-between">
      <p className="text-[10px] xs:text-xs md:text-sm lg:text-base text-foreground/60">
        {label}
      </p>

      {value instanceof Date ? (
        <p className="text-[10px] xs:text-xs md:text-sm xl:text-base text-foreground font-medium">
          {formatDateToReadable(value)}
        </p>
      ) : typeof value === "string" || typeof value === "number" ? (
        <p className="text-[10px] xs:text-xs md:text-sm xl:text-base text-foreground font-medium">
          {value}
        </p>
      ) : (
        value
      )}
    </div>
  );
};

const ReferralDetails = ({ referral }: { referral: Referral }) => {
  return (
    <div className="space-y-1 bg-card rounded-2xl border border-border shadow shadow-primary/30 px-3 py-4">
      <DetailItem label="Invitee Name" value={referral.customer.name} />
      <DetailItem label="Invitee Email" value={referral.customer.email} />
      <DetailItem
        label="Referral Code Used"
        value={referral.referralCodeUsed}
      />
      <DetailItem label="Current Status" value={referral.status} />
      <DetailItem label="Reward Amount" value={referral.reward} />
      <DetailItem
        label="Purchase Amount"
        value={referral.qualifyingOrderAmount ?? "-"}
      />
      <DetailItem
        label="Minimum Purchase Required"
        value={referral.minPurchaseRequired ?? "-"}
      />
      <DetailItem label="Joined Date" value={referral.createdAt} />
      <DetailItem label="Last Updated" value={referral.updatedAt} />
    </div>
  );
};

export const ReferralExpandedData = ({ referral }: { referral: Referral }) => {
  const timelineItems = referralToTimeline(referral);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 xl:grid-cols-2">
      <Container
        title="Referral Timeline"
        className="col-span-1 lg:col-span-1 xl:col-span-1"
      >
        <Timeline items={timelineItems} size={"sm"} />
      </Container>

      <Container
        title="Referral Information"
        className="col-span-1 lg:col-span-2 xl:col-span-1"
      >
        <ReferralDetails referral={referral} />
      </Container>
    </div>
  );
};
