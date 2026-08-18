// Components
import { PageShell } from "@/components/Container";
import { TitleTextContainer } from "@/components/Container";
import StatsContainer from "./StatsContainer";
import OrderHistory from "./OrderHistory/OrderHistory";

const OrderManagement = () => {
  return (
    <PageShell>
      <TitleTextContainer title="Orders">
        Manage, verify, process and track customer orders.
      </TitleTextContainer>

      <StatsContainer />

      <OrderHistory />
    </PageShell>
  );
};

export default OrderManagement;
