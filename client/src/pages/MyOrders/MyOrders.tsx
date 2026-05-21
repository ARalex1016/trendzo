import { useState, useEffect } from "react";

// Components
import { PageShell } from "@/components/Container";
import { TitleTextContainer } from "@/components/Container";
import { StatsCard } from "@/components/Stats/StatsCard";
import { StatsContainer } from "@/components/Stats/StatsContainer";
import FilterOrder from "./FilterOrder";
import OrderCard from "@/components/Cards/OrderCard";
import NoOrders from "./NoOrders";

// Icons
import { Package, CircleCheckBig, Clock } from "lucide-react";

// Types
import type { IOrderRes } from "@/types/order/order_response.type";

// Store
import useAuthStore from "@/store/useAuthStore";
import useOrderStore from "@/store/useOrderStore";

const Orders = () => {
  const { isAuthenticated } = useAuthStore();
  const { getMyOrders } = useOrderStore();

  const [myOrders, setMyOrders] = useState<IOrderRes[] | null>(null);

  const fetchMyOrders = async () => {
    try {
      let res = await getMyOrders();

      if (res) {
        setMyOrders(res?.data);
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchMyOrders();
    }
  }, [isAuthenticated]);

  return (
    <PageShell className="flex flex-col gap-y-5 relative">
      <TitleTextContainer title="My Orders">
        Track and manage all your purchases
      </TitleTextContainer>

      <StatsContainer>
        <StatsCard
          title={"Total Orders"}
          value={20}
          icon={Package}
          variant="purple"
        />

        <StatsCard
          title={"Delivered"}
          value={8}
          icon={CircleCheckBig}
          variant="success"
        />

        <StatsCard
          title={"Pending"}
          value={3}
          icon={Clock}
          variant="warning"
          className="col-span-full lg:col-span-1"
        />
      </StatsContainer>

      <FilterOrder />

      <div className="w-full flex flex-col gap-y-4">
        {myOrders && myOrders?.length <= 0 && <NoOrders />}

        {myOrders &&
          myOrders?.map((myOrder) => {
            return <OrderCard key={myOrder.orderNumber} order={myOrder} />;
          })}
      </div>
    </PageShell>
  );
};

export default Orders;
