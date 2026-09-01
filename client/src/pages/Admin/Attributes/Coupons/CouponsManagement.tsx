// Components
import { PageShell } from "@/components/Container";
import { TitleTextContainer } from "@/components/Container";
import { CreateCoupon } from "./CreateCoupon";
import CouponsStats from "./CouponsStats";
import CouponsHistory from "./CouponsHistory/CouponsHistory";

const CouponsManagement = () => {
  return (
    <PageShell>
      <div className="flex flex-row justify-between items-start">
        <TitleTextContainer title="Coupon Management">
          Manage promotional coupons and discount codes
        </TitleTextContainer>

        <CreateCoupon />
      </div>

      <CouponsStats />

      <CouponsHistory />
    </PageShell>
  );
};

export default CouponsManagement;
