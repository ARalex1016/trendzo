// Components
import Filter from "@/components/Filter";

// Types
import type { SizeFilters, SizeStatusProps } from "./SizeHistory";

interface FilterSizeProps {
  filters: SizeFilters;
  onFiltersChange: (filters: SizeFilters) => void;
}

const sizeStatuses = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "In Active", value: "inactive" },
] satisfies {
  label: string;
  value: SizeStatusProps;
}[];

const SizeFilter = ({ filters, onFiltersChange }: FilterSizeProps) => {
  const updateFilter = <K extends keyof SizeFilters>(
    key: K,
    value: SizeFilters[K],
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
        placeholder: "Search Sizes...",
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
        options: sizeStatuses,
      }}
    />
  );
};

export default SizeFilter;
