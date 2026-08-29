// Components
import Filter from "@/components/Filter";

// Types
import type {
  CouponFilters,
  CouponStatusProps,
} from "./CouponsHistory/CouponsHistory";

interface FilterCouponProps {
  filters: CouponFilters;
  onFiltersChange: (filters: CouponFilters) => void;
}

const couponStatuses = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "In Active", value: "inactive" },
] satisfies {
  label: string;
  value: CouponStatusProps;
}[];

const CouponFilter = ({ filters, onFiltersChange }: FilterCouponProps) => {
  const updateFilter = <K extends keyof CouponFilters>(
    key: K,
    value: CouponFilters[K],
  ) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <Filter
      search={{
        value: filters.search,
        onChange: (value) => updateFilter("search", value),
        placeholder: "Search coupons...",
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
        ],
      }}
      tabs={{
        value: filters.status,
        onChange: (value) => updateFilter("status", value),
        options: couponStatuses,
      }}
    />
  );
};

export default CouponFilter;
