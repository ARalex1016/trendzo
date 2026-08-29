// Components
import { PageShell } from "@/components/Container";
import CouponsStats from "./CouponsStats";
import CouponsHistory from "./CouponsHistory/CouponsHistory";

const Coupons = () => {
  return (
    <PageShell>
      <CouponsStats />

      <CouponsHistory />
    </PageShell>
  );
};

export default Coupons;
