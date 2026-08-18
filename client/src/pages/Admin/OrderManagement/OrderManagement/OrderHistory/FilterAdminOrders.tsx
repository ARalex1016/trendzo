// Components
import Filter from "@/components/Filter";

// Types
import type { OrderStatus } from "@/types/order/shared.type";
import type { AdminOrdersFilters } from "./OrderManagement/OrderHistory/OrderHistory";

export type AdminOrderStatusProps = OrderStatus | "all";

interface FilterAdminOrderProps {
  filters: AdminOrdersFilters;
  onFiltersChange: (filters: AdminOrdersFilters) => void;
}

const orderStatuses = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Returned", value: "returned" },
  { label: "Refunded", value: "refunded" },
] satisfies {
  label: string;
  value: AdminOrderStatusProps;
}[];

const FilterAdminOrders = ({
  filters,
  onFiltersChange,
}: FilterAdminOrderProps) => {
  const updateFilter = <K extends keyof AdminOrdersFilters>(
    key: K,
    value: AdminOrdersFilters[K],
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
          placeholder: "Search orders...",
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
          options: orderStatuses,
        }}
      />
    </div>
  );
};

export default FilterAdminOrders;
