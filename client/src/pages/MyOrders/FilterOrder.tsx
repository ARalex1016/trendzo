// Components
import { StatusBadge } from "@/components/Badges/StatusBadge";

// Icons
import { Search } from "lucide-react";

// Utils
import { capitalize } from "@/utils/StringManager";

// Types
import type { OrderStatus } from "@/types/order/shared.type";

type OrderStatusProps = OrderStatus | "all";

const statusList: OrderStatusProps[] = [
  "all",
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
  "returned",
  "refunded",
];

const FilterOrder = () => {
  return (
    <div className="flex flex-col gap-y-3 rounded-2xl border border-border p-5">
      <div className="w-full flex flex-col lg:flex-row items-center gap-3">
        <div className="w-full flex-1 flex flex-row items-center gap-x-2 rounded-xl border border-border px-3 py-2">
          <Search size={18} className="text-muted-foreground" />

          <input
            type="search"
            name=""
            id=""
            placeholder="Search by order number..."
            className="w-full"
          />
        </div>

        <div className="w-full lg:w-fit flex flex-row gap-x-3">
          <select
            name=""
            id=""
            className="flex-1 rounded-xl border border-border px-3 py-2"
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>

          <select
            name=""
            id=""
            className="flex-1 rounded-xl border border-border px-3 py-2"
          >
            <option value="latestFirst">Latest First</option>
            <option value="oldestFirst">Oldest First</option>
          </select>
        </div>
      </div>

      <div className="flex flex-row gap-x-3 overflow-auto no-scrollbar">
        {statusList.map((status) => {
          return (
            <StatusBadge variant="gray" className="text-sm md:text-base">
              {capitalize(status)}
            </StatusBadge>
          );
        })}
      </div>
    </div>
  );
};

export default FilterOrder;
