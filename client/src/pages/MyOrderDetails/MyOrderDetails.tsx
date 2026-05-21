import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// Components
import { PageShell } from "@/components/Container";
import { StatusBadge } from "@/components/Badges/StatusBadge";
import { TextWithIcon } from "@/components/Text";

// Icons
import { Calendar, Dot } from "lucide-react";

const MyOrderDetails = () => {
  const { orderNumber } = useParams();

  useEffect(() => {}, [orderNumber]);

  return (
    <PageShell back="Back to My Orders" to="/myorders">
      <div className="bg-background1 rounded-xl border border-border p-6">
        <div className="flex flex-row justify-between">
          <div className="flex flex-col gap-y-2">
            <p className="text-xl text-foreground/90 font-medium">
              ORD-2026-5003 - Need Change
            </p>

            <div className="flex flex-row gap-x-3">
              <TextWithIcon
                icon={Calendar}
                text="May 2, 2026 at 04:45 PM"
                iconClassName="text-muted-foreground"
                textClassName="text-muted-foreground"
              />

              <TextWithIcon
                icon={Dot}
                text="Online Order"
                iconClassName="text-muted-foreground"
                textClassName="text-muted-foreground"
              />
            </div>
          </div>

          {/* Status */}
          <div className="h-fit flex flex-row gap-x-3">
            <StatusBadge size="lg">Confirmed</StatusBadge>

            <StatusBadge variant="success" size="lg">
              Paid
            </StatusBadge>
          </div>
        </div>

        <div className="flex flex-row justify-between gap-x-5 pt-4 ">
          <div className="w-full bg-background border border-border rounded-xl flex flex-col gap-y-1 p-3">
            <p className="text-muted-foreground">Payment Method</p>

            <p className="text-primary font-medium">Bank Transfer</p>
          </div>

          <div className="w-full bg-background border border-border rounded-xl flex flex-col gap-y-1 p-3">
            <p className="text-muted-foreground">Total Items</p>

            <p className="text-primary font-medium">2 items</p>
          </div>

          <div className="w-full bg-background border border-border rounded-xl flex flex-col gap-y-1 p-3">
            <p className="text-muted-foreground">Final Total</p>

            <p className="text-primary font-medium">NPR 5,100</p>
          </div>
        </div>
      </div>
    </PageShell>
  );
};

export default MyOrderDetails;
