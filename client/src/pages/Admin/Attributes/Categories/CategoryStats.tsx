// Components
import { StatsGrid } from "@/components/Stats";
import { StatsCard } from "@/components/Stats";

// Icons
import { Layers, CircleCheckBig, Power, Star } from "lucide-react";

const CategoryStats = () => {
  return (
    <StatsGrid variant={"balanced"}>
      <StatsCard
        title="Total Categories"
        value={10}
        icon={Layers}
        variant="primary"
      />

      <StatsCard
        title="Active Categories"
        value={10}
        icon={CircleCheckBig}
        variant="success"
      />

      <StatsCard title="Inactive Categories" value={10} icon={Power} />

      <StatsCard
        title="Total Categories"
        value={10}
        icon={Star}
        variant="info"
      />
    </StatsGrid>
  );
};

export default CategoryStats;
