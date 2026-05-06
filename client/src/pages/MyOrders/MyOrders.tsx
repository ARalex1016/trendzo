// Components
import { Title, BaseText } from "@/components/Text";
import { StatsCard } from "@/components/Stats/StatsCard";
import { StatsContainer } from "@/components/Stats/StatsContainer";
import OrderCard from "@/components/Cards/OrderCard";

// Icons
import { Package, CircleCheckBig, Clock } from "lucide-react";

const Orders = () => {
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

      <div>
        <OrderCard />
      </div>
    </div>
  );
};

export default Orders;
