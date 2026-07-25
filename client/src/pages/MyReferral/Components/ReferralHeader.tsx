// Components
import { Title, BaseText } from "@/components/Text";
import HeroIllustration from "./HeroIllustration";

const ReferralHeader = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2">
      <div className="flex flex-col justify-center space-y-3 py-5">
        <div>
          <Title
            text="Invite Friends & Earn "
            className="inline text-5xl! sm:text-7xl!"
          />

          <Title
            text="Rewards"
            className="inline text-5xl! sm:text-7xl! text-primary-gradient"
          />
        </div>

        <BaseText className="text-base sm:text-lg">
          Share your referral link. When someone registers through your link and
          purchases products worth more than{" "}
          <span className="text-primary/80 font-medium">NPR 1000</span>, you
          earn <span className="text-primary/80 font-medium">NPR 50.</span>
        </BaseText>
      </div>

      <HeroIllustration />
    </div>
  );
};

export default ReferralHeader;
