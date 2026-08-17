// Components
import Filter from "@/components/Filter";

// Types
import type { OrderStatus } from "@/types/order/shared.type";
import type { MyOrdersFilters } from "./MyOrders";

export type OrderStatusProps = OrderStatus | "all";

interface FilterOrderProps {
  filters: MyOrdersFilters;
  onFiltersChange: (filters: MyOrdersFilters) => void;
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
  value: OrderStatusProps;
}[];

const FilterOrder = ({ filters, onFiltersChange }: FilterOrderProps) => {
  const updateFilter = <K extends keyof MyOrdersFilters>(
    key: K,
    value: MyOrdersFilters[K],
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

// const FilterOrder = () => {
//   return (
//     <div className="bg-background1 flex flex-col gap-y-3 rounded-2xl border border-border p-5">
//       <div className="w-full flex flex-col lg:flex-row items-center gap-3">
//         <SearchInput />

//         <div className="w-full lg:w-fit flex flex-row gap-x-3">
//           <select
//             name=""
//             id=""
//             className="flex-1 rounded-xl border border-border px-3 py-2"
//           >
//             <option value="pending">Pending</option>
//             <option value="completed">Completed</option>
//             <option value="failed">Failed</option>
//           </select>

//           <select
//             name=""
//             id=""
//             className="flex-1 rounded-xl border border-border px-3 py-2"
//           >
//             <option value="latestFirst">Latest First</option>
//             <option value="oldestFirst">Oldest First</option>
//           </select>
//         </div>
//       </div>

//       <div className="flex flex-row gap-x-3 overflow-auto no-scrollbar">
//         {statusList.map((status, index) => {
//           return (
//             <StatusBadge
//               key={`${status}-${index}`}
//               variant="gray"
//               className="text-sm md:text-base"
//             >
//               {capitalize(status)}
//             </StatusBadge>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

export default FilterOrder;
