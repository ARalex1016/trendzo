import { StatsGrid } from "@/components/Stats";
import { StatsCard } from "@/components/Stats";

// Icons
import { Wallet, Clock, TrendingUp, CircleCheckBig } from "lucide-react";

const StatsContainer = () => {
  return (
    <StatsGrid>
      <StatsCard
        title="Available Balance"
        value={"Rs. 4,250"}
        icon={Wallet}
        variant="primary"
      />
      <StatsCard
        title="Pending Earnings"
        value={"Rs. 4,250"}
        icon={Clock}
        variant="warning"
      />
      <StatsCard
        title="Total Earned"
        value={"Rs. 4,250"}
        icon={TrendingUp}
        variant="info"
      />
      <StatsCard
        title="Total Withdrawn"
        value={"Rs. 4,250"}
        icon={CircleCheckBig}
        variant="success"
      />
    </StatsGrid>
  );
};

export default StatsContainer;
