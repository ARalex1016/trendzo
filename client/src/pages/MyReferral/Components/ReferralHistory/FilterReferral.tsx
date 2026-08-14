// Components
import Filter from "@/components/Filter";

// Types
import type { ReferralStatus } from "@/types/referral.type";
import type { ReferralFilters } from "./ReferralHistory";

type ReferralFilterStatus = ReferralStatus | "all";

const referralStatuses = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Qualified", value: "qualified" },
  { label: "Holding", value: "holding" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
] satisfies {
  label: string;
  value: ReferralFilterStatus;
}[];

interface FilterReferralProps {
  filters: ReferralFilters;
  onFiltersChange: (filters: ReferralFilters) => void;
}

const FilterReferral = ({ filters, onFiltersChange }: FilterReferralProps) => {
  const updateFilter = <K extends keyof ReferralFilters>(
    key: K,
    value: ReferralFilters[K],
  ) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div>
      <Filter
        search={{
          value: filters.search,
          onChange: (value) => updateFilter("search", value),
          placeholder: "Search referrals...",
        }}
        sort={{
          value: filters.sort,
          onChange: (value) => updateFilter("sort", value),
          options: [
            {
              label: "Newest",
              value: "newest",
            },
            {
              label: "Oldest",
              value: "oldest",
            },
            {
              label: "Reward (Lowest to Highest)",
              value: "reward_asc",
            },
            {
              label: "Reward (Highest to Lowest)",
              value: "reward_desc",
            },
          ],
        }}
        tabs={{
          value: filters.status,
          onChange: (value) => updateFilter("status", value),
          options: referralStatuses,
        }}
      />
    </div>
  );
};

export default FilterReferral;
