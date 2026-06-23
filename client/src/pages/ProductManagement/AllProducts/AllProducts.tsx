// Components
import { PageShell, TitleTextContainer } from "@/components/Container";
import { StatsContainer } from "@/components/Stats/StatsContainer";
import { StatsCard } from "@/components/Stats/StatsCard";

// Icons
import {
  Package,
  Grid3x3,
  Power,
  Star,
  Filter,
  Archive,
  List,
} from "lucide-react";

const kpiCards = [
  {
    label: "Total Products",
    value: "1,284",
    change: "+12.5%",
    icon: Grid3x3,
    color: "bg-[#A855F7]/10 text-[#A855F7]",
  },
  {
    label: "Active Products",
    value: "1,156",
    change: "+8.2%",
    icon: Power,
    color: "bg-[#3B82F6]/10 text-[#3B82F6]",
  },
  {
    label: "Featured Products",
    value: "89",
    change: "+4.1%",
    icon: Star,
    color: "bg-[#06B6D4]/10 text-[#06B6D4]",
  },
  {
    label: "Low Stock",
    value: "24",
    change: "-15.3%",
    icon: Filter,
    color: "bg-[#F59E0B]/10 text-[#F59E0B]",
  },
  {
    label: "Out of Stock",
    value: "12",
    change: "-8.7%",
    icon: Archive,
    color: "bg-[#EF4444]/10 text-[#EF4444]",
  },
  {
    label: "Total Inventory",
    value: "45.2K",
    change: "+18.9%",
    icon: List,
    color: "bg-[#10B981]/10 text-[#10B981]",
  },
];

const AllProducts = () => {
  return (
    <PageShell>
      <TitleTextContainer title="Product Catalog">
        Manage your luxury fashion inventory
      </TitleTextContainer>

      <StatsContainer className="py-3">
        {kpiCards.length >= 1 &&
          kpiCards.map((kpi) => {
            return (
              <StatsCard
                title={kpi.label}
                value={kpi.value}
                variant="gray"
                icon={kpi.icon}
              />
            );
          })}
      </StatsContainer>
    </PageShell>
  );
};

export default AllProducts;
