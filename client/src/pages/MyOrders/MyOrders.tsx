import { useState, useEffect } from "react";

// Components
import { Title, BaseText } from "@/components/Text";
import { StatsCard } from "@/components/Stats/StatsCard";
import { StatsContainer } from "@/components/Stats/StatsContainer";
import OrderCard from "@/components/Cards/OrderCard";

// Icons
import { Package, CircleCheckBig, Clock } from "lucide-react";

// Types
import type { IOrder } from "@/types/order.type";

// Store
import useAuthStore from "@/store/useAuthStore";
import useOrderStore from "@/store/useOrderStore";

const Orders = () => {
  const { isAuthenticated } = useAuthStore();
  const { getMyOrders } = useOrderStore();

  const [myOrders, setMyOrders] = useState<IOrder[] | null>(null);

  const fetchMyOrders = async () => {
    try {
      let res = await getMyOrders();

      if (res) {
        console.log(res);

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
    <div className="w-full min-h-svh flex flex-col gap-y-2 px-side-spacing py-4 relative pb-20">
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

      <div className="flex flex-col gap-y-3">
        {myOrders?.map((myOrder) => {
          return (
            <OrderCard
              key={myOrder.orderNumber || myOrder._id}
              orderNumber={myOrder.orderNumber}
              orderDate={myOrder.createdAt}
              totalAmount={myOrder.totalAmount}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Orders;
