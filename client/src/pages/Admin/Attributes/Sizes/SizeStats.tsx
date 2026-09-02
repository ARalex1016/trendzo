// Components
import { StatsGrid, StatsCard } from "@/components/Stats";

// Icons
import { Layers, CircleCheck, Power, Star } from "lucide-react";

const SizeStats = () => {
  return (
    <StatsGrid variant={"balanced"}>
      <StatsCard
        title="Total Sizes"
        value={10}
        icon={Layers}
        variant="primary"
      />

      <StatsCard
        title="Active Sizes"
        value={5}
        icon={CircleCheck}
        variant="success"
      />

      <StatsCard
        title="InActive Sizes"
        value={2}
        icon={Power}
        variant="default"
      />

      <StatsCard title="Custom Sizes" value={3} icon={Star} variant="warning" />
    </StatsGrid>
  );
};

export default SizeStats;
