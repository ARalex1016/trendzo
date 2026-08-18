import { useState, useEffect } from "react";

// Components
import { PageShell } from "@/components/Container";
import { TitleTextContainer } from "@/components/Container";
import { StatsGrid, StatsCard } from "@/components/Stats";
import FilterOrder from "./FilterOrder";
import OrderCard from "@/components/Cards/OrderCard";
import OrdersLoading from "./OrdersLoading";
import NoOrders from "./NoOrders";

// Icons
import { Package, CircleCheckBig, Clock } from "lucide-react";

// Types
import type { IOrderRes } from "@/types/order/order_response.type";
import type { Meta } from "@/types/response.type";
import type { OrderStatusProps } from "./FilterOrder";

// Store
import useAuthStore from "@/store/useAuthStore";
import useOrderStore from "@/store/useOrderStore";

export type MyOrdersSort = "newest" | "oldest";

export type MyOrdersFilters = {
  search: string;
  status: OrderStatusProps;
  sort: MyOrdersSort;
};

const DEFAULT_FILTERS: MyOrdersFilters = {
  search: "",
  status: "all",
  sort: "newest",
};

const Orders = () => {
  const { isAuthenticated } = useAuthStore();
  const { getMyOrders } = useOrderStore();

  const [filters, setFilters] = useState<MyOrdersFilters>(DEFAULT_FILTERS);

  const [myOrders, setMyOrders] = useState<IOrderRes[] | null>(null);

  const [pagination, setPagination] = useState<Meta>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const [loading, setLoading] = useState<boolean>(false);

  const handleFiltersChange = (newFilters: MyOrdersFilters) => {
    setFilters(newFilters);

    setPagination((prev) => ({
      ...prev,
      page: 1,
    }));
  };

  const fetchMyOrders = async () => {
    setLoading(true);
    try {
      const res = await getMyOrders({
        page: pagination.page,
        limit: pagination.limit,
        ...(filters.search && {
          search: filters.search,
        }),

        ...(filters.status !== "all" && {
          status: filters.status,
        }),

        ...(filters.sort && {
          sortBy: filters.sort,
        }),
      });

      if (!res) return;

      setMyOrders(res?.data);

      if (!res.meta) return;

      setPagination(res?.meta);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchMyOrders();
    }
  }, [pagination.page, filters, isAuthenticated]);

  return (
    <PageShell>
      <TitleTextContainer title="My Orders">
        Track and manage all your purchases
      </TitleTextContainer>

      <StatsGrid>
        <StatsCard
          title={"Total Orders"}
          value={20}
          icon={Package}
          variant="primary"
        />

        <StatsCard
          title={"Delivered"}
          value={8}
          icon={CircleCheckBig}
          variant="success"
        />

        <StatsCard title={"Pending"} value={3} icon={Clock} variant="warning" />
      </StatsGrid>

      <FilterOrder filters={filters} onFiltersChange={handleFiltersChange} />

      <div className="w-full flex flex-col gap-y-4">
        {loading && <OrdersLoading />}

        {myOrders?.length === 0 && <NoOrders />}

        {myOrders &&
          myOrders?.map((myOrder) => {
            return <OrderCard key={myOrder.orderNumber} order={myOrder} />;
          })}
      </div>
    </PageShell>
  );
};

export default Orders;
