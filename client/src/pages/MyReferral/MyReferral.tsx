// Components
import { PageShell } from "@/components/Container";
import { Title, BaseText } from "@/components/Text";

const MyReferral = () => {
  return (
    <PageShell>
      <Title text="Invite Friends & Earn Rewards" />

      <BaseText>
        Share your referral link. When someone registers through your link and
        purchases products worth more than NPR 1000, you earn NPR 50.
      </BaseText>
    </PageShell>
  );
};

export default MyReferral;
