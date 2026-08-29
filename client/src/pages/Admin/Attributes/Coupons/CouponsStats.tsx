// Components
import { StatsGrid, StatsCard } from "@/components/Stats";

// Icons
import {
  TicketPercent,
  CircleCheck,
  Power,
  Clock,
  TrendingUp,
  Users,
} from "lucide-react";

const CouponsStats = () => {
  return (
    <StatsGrid>
      <StatsCard
        title="Total Coupons"
        value={10}
        icon={TicketPercent}
        variant="primary"
      />

      <StatsCard
        title="Active"
        value={5}
        icon={CircleCheck}
        variant="success"
      />

      <StatsCard title="In Active" value={2} icon={Power} variant="default" />

      <StatsCard title="Expired" value={3} icon={Clock} variant="destructive" />

      <StatsCard
        title="Total Users"
        value={100}
        icon={TrendingUp}
        variant="primary2"
      />

      <StatsCard title="First-time" value={3} icon={Users} variant="warning" />
    </StatsGrid>
  );
};

export default CouponsStats;
