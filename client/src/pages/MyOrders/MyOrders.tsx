import { useState, useEffect } from "react";

// Components
import { Title, BaseText } from "@/components/Text";
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
    <div className="w-full flex flex-col gap-y-2 px-side-spacing py-4 relative pb-20">
      <Title text="My Orders" />

      <BaseText>Track and manage all your purchases</BaseText>

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
    </div>
  );
};

export default Orders;
