// Config
import { BRAND } from "@/config/brand";

// Components
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

// Icons
import {
  TrendingUp,
  Clock,
  Gift,
  Megaphone,
  Dot,
  Info,
  ArrowRight,
} from "lucide-react";

// Types
import type { LedgerSource } from "@/types/ledger";
import type { LucideIcon } from "lucide-react";

interface EarningsSource {
  title: string;
  source: LedgerSource;
  icon?: LucideIcon;
  total: number;
  amount: number;
}

const earnings: EarningsSource[] = [
  {
    title: "Referral Rewards",
    source: "referral",
    icon: Gift,
    amount: 5000,
    total: 10,
  },
  {
    title: "Adds",
    source: "ads",
    icon: Megaphone,
    amount: 800,
    total: 15,
  },
];

const Earnings = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-5">
      {/* Earnings */}
      <div className="col-span-1 md:col-span-2 bg-card rounded-2xl border border-border overflow-hidden pb-3">
        {/* Header */}
        <div className="flex flex-row justify-between items-center border-b border-b-border px-4 py-3">
          <div className="flex flex-row items-center gap-x-2">
            <TrendingUp className="text-primary2 size-5" />
            <p className="text-sm sm:text-base font-medium">Earnings</p>
          </div>

          <p className="text-sm text-foreground/50">Lifetime summary</p>
        </div>

        {/* Earnings */}
        <div className="space-y-2 px-4 py-3">
          {earnings.map((earning) => {
            const { icon: Icon } = earning;

            return (
              <div
                key={earning.source}
                className="w-full flex flex-row justify-between items-center rounded-2xl p-3 hover:bg-accent transition-all duration-200"
              >
                <div className="flex flex-row items-center gap-x-2">
                  {/* Icon */}
                  {Icon && (
                    <div className="bg-primary/15 rounded-full p-2">
                      <Icon className="size-4.5 text-primary" />
                    </div>
                  )}

                  <div>
                    <p className="text-sm text-foreground font-medium">
                      {earning.title}
                    </p>

                    <p className="text-xs text-foreground/60">
                      {earning.total}
                    </p>
                  </div>
                </div>

                <p className="text-foreground font-medium">
                  {BRAND.currency.symbol}
                  {earning.amount}
                </p>
              </div>
            );
          })}
        </div>

        <Separator />

        {/* Total */}
        <div className="flex flex-row justify-between px-4 pt-3">
          <p className="text-foreground/60 font-medium">Total Earned</p>

          <p className="text-foreground font-medium">
            {BRAND.currency.symbol}8000
          </p>
        </div>
      </div>

      {/* Pending Earnings */}
      <div className="col-span-1 bg-card rounded-2xl border border-info/40 overflow-hidden pb-3">
        {/* Header */}
        <div className="bg-info/5 flex flex-row justify-between items-center border-b border-b-border px-4 py-3">
          <div className="flex flex-row items-center gap-x-2">
            <Clock className="text-info size-4" />

            <p className="text-sm sm:text-base font-medium">Pending Earnings</p>
          </div>
        </div>

        <div className="flex flex-col gap-y-3 px-4 pt-3">
          <div className="space-y-1">
            <p className="text-2xl font-medium">
              {BRAND.currency.symbol}
              <span>800</span>
            </p>

            <div className="text-info flex flex-row items-center">
              <Dot strokeWidth={5} className="animate-pulse" />

              <p className="text-sm">
                <span>5</span> referrals pending
              </p>
            </div>
          </div>

          <div className="bg-info/5 border border-info/20 rounded-xl flex flex-row gap-x-2 p-3">
            <Info className="size-5 text-info" />

            <p className="text-xs text-foreground/60">
              These earnings are currently on hold and will become available
              after the qualifying period.
            </p>
          </div>

          <Button
            variant={"outline"}
            size={"lg"}
            className="text-info! bg-info/5! border-info/40! hover:bg-info/15!"
          >
            <span>View Referrals</span>

            <ArrowRight />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Earnings;
