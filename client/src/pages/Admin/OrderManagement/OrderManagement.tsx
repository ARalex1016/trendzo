// Components
import { PageShell } from "@/components/Container";
import { TitleTextContainer } from "@/components/Container";
import StatsContainer from "./StatsContainer";

const OrderManagement = () => {
  return (
    <PageShell className="space-y-6 sm:space-y-7">
      <TitleTextContainer title="Orders">
        Manage, verify, process and track customer orders.
      </TitleTextContainer>

      <StatsContainer />
    </PageShell>
  );
};

export default OrderManagement;
