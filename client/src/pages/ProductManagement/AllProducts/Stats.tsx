import { cn } from "@/lib/utils";

// Components
import { StatsContainer } from "@/components/Stats/StatsContainer";

// Icons
import { Grid3x3, Power, Star, Filter, Archive, List } from "lucide-react";

const kpiCards = [
  {
    id: 1,
    label: "Total Products",
    value: "1,284",
    change: "+12.5%",
    icon: Grid3x3,
    color: "bg-[#A855F7]/10 text-[#A855F7]",
  },
  {
    id: 2,
    label: "Active Products",
    value: "1,156",
    change: "+8.2%",
    icon: Power,
    color: "bg-[#3B82F6]/10 text-[#3B82F6]",
  },
  {
    id: 3,
    label: "Featured Products",
    value: "89",
    change: "+4.1%",
    icon: Star,
    color: "bg-[#06B6D4]/10 text-[#06B6D4]",
  },
  {
    id: 4,
    label: "Low Stock",
    value: "24",
    change: "-15.3%",
    icon: Filter,
    color: "bg-[#F59E0B]/10 text-[#F59E0B]",
  },
  {
    id: 5,
    label: "Out of Stock",
    value: "12",
    change: "-8.7%",
    icon: Archive,
    color: "bg-[#EF4444]/10 text-[#EF4444]",
  },
  {
    id: 6,
    label: "Total Inventory",
    value: "45.2K",
    change: "+18.9%",
    icon: List,
    color: "bg-[#10B981]/10 text-[#10B981]",
  },
];

const Stats = () => {
  return (
    <StatsContainer className="w-full py-3">
      {kpiCards.length >= 1 &&
        kpiCards.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.id}
              className="bg-accent/30 border border-border/60 rounded-4xl hover:bg-accent/50 hover:border-border transition-all duration-200 space-y-3 p-5"
            >
              <div className="flex flex-row justify-between">
                <div className={cn("p-3 rounded-2xl", kpi.color)}>
                  <Icon className={"size-5"} />
                </div>

                <p className="text-success/80 text-sm font-medium">
                  {kpi.change}
                </p>
              </div>

              <div className="rounded-inherit space-y-1">
                <p className="text-foreground/80 font-medium">{kpi.value}</p>

                <p className="text-foreground/60 text-sm">{kpi.label}</p>
              </div>
            </div>
          );
        })}
    </StatsContainer>
  );
};

export default Stats;
