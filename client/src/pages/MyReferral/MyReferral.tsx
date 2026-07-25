// Components
import { PageShell } from "@/components/Container";
import ReferralHeader from "./Components/ReferralHeader";
import ReferralStats from "./Components/ReferralStats";
import ReferralShare from "./Components/ReferralShare";

const MyReferral = () => {
  return (
    <PageShell className="flex flex-col gap-y-6 sm:gap-y-7">
      <ReferralHeader />

      <ReferralStats />

      <ReferralShare />
    </PageShell>
  );
};

export default MyReferral;
