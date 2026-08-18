// Components
import { StatsGrid } from "@/components/Stats";
import { StatsCard } from "@/components/Stats";

const StatsContainer = () => {
  return (
    <StatsGrid variant={"balanced"}>
      <StatsCard title="Total Orders" value={12} variant="primary" />
      <StatsCard title="Order Requests" value={12} variant="primary2" />
      <StatsCard title="Pending Payments" value={12} variant="destructive" />
      <StatsCard title="Delivered" value={12} variant="success" />
    </StatsGrid>
  );
};

export default StatsContainer;
