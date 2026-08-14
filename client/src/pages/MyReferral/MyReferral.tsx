// Components
import { PageShell } from "@/components/Container";
import ReferralHeader from "./Components/ReferralHeader";
import ReferralStats from "./Components/ReferralStats";
import ReferralShare from "./Components/ReferralShare";
import ReferralWorks from "./Components/ReferralWorks";
import ReferralHistory from "./Components/ReferralHistory/ReferralHistory";
import StatusLegend from "./Components/StatusLegend";

const MyReferral = () => {
  return (
    <PageShell className="flex flex-col gap-y-6 sm:gap-y-7">
      <ReferralHeader />

      <ReferralStats />

      <ReferralShare />

      <ReferralWorks />

      <ReferralHistory />

      <StatusLegend />
    </PageShell>
  );
};

export default MyReferral;
