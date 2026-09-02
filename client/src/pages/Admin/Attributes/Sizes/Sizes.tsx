// Components
import { PageShell } from "@/components/Container";
import { TitleTextContainer } from "@/components/Container";
import SizeStats from "./SizeStats";
import SizeHistory from "./SizeHistory";
// import { CreateCoupon } from "./CreateCoupon";
// import CouponsStats from "./CouponsStats";
// import CouponsHistory from "./CouponsHistory/CouponsHistory";

const CouponsManagement = () => {
  return (
    <PageShell>
      <div className="flex flex-row justify-between items-start">
        <TitleTextContainer title="Size Management">
          Create, organize, and manage product sizes and measurements.
        </TitleTextContainer>

        {/* <CreateCoupon /> */}
      </div>

      <SizeStats />

      <SizeHistory />
    </PageShell>
  );
};

export default CouponsManagement;
