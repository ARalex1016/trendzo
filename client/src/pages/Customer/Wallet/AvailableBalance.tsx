import { useNavigate } from "react-router-dom";

// Config
import { BRAND } from "@/config/brand";

// Components
import { Button } from "@/components/ui/button";

// Icons
import { Dot, ArrowRight } from "lucide-react";

const AvailableBalance = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-card border border-border rounded-2xl flex flex-col sm:flex-row justify-between gap-y-4 px-5 py-5 sm:py-6">
      {/* Display */}
      <div className="space-y-3">
        <div className="flex flex-row items-center gap-x-3">
          <p className="text-foreground/60 font-medium text-sm sm:text-base">
            Available Balance
          </p>

          <div className="text-success bg-success/5 border border-success/60 rounded-2xl flex flex-row items-center pr-3">
            <Dot strokeWidth={4.5} />

            <p className="text-xs sm:text-sm font-medium">Withdrawable</p>
          </div>
        </div>

        {/* Balance */}
        <p className="text-3xl sm:text-4xl text-foreground font-medium">
          {BRAND.currency.symbol} 4,250
        </p>

        {/* Date */}
        <p className="text-xs sm:text-sm text-foreground/40">
          Last updated: Aug 14, 2026 at 9:00 AM
        </p>
      </div>

      {/* Action */}
      <div className="flex flex-col justify-center gap-y-2">
        <Button
          onClick={() => navigate("withdraw")}
          className="w-full rounded-xl bg-primary-gradient hover:scale-105 transition-all duration-200"
        >
          <ArrowRight />
          <span>Withdraw Money</span>
        </Button>

        <p className="text-xs sm:text-sm text-foreground/40 text-center">
          Min Rs. 500
        </p>
      </div>
    </div>
  );
};

export default AvailableBalance;
