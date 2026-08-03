// Icons
import { Share2, UserRoundPlus, Gift, TrendingUp } from "lucide-react";

// Config
import { REFERRAL } from "@/config/referral";
import { BRAND } from "@/config/brand";

// Types
import type { LucideIcon } from "lucide-react";

type StepNumber = 1 | 2 | 3 | 4;

type ReferralStep = {
  step: StepNumber;
  icon: LucideIcon;
  title: string;
  text: string;
};

type ReferralCardProps = ReferralStep;

const referralSteps = [
  {
    step: 1,
    icon: Share2,
    title: "Share Your Link",
    text: "Send your unique referral link to friends",
  },
  {
    step: 2,
    icon: UserRoundPlus,
    title: "Friend Registers",
    text: "They sign up using your referral link",
  },
  {
    step: 3,
    icon: Gift,
    title: "Friend purchases",
    text: `Friend purchases above ${BRAND.currency.code} ${REFERRAL.program.referee.minimumPurchase}`,
  },
  {
    step: 4,
    icon: TrendingUp,
    title: "Earn Reward",
    text: `You receive ${BRAND.currency.code} ${REFERRAL.program.reward.amount} after ${REFERRAL.program.holdingPeriod.value}-${REFERRAL.program.holdingPeriod.unit} holding period`,
  },
] satisfies readonly ReferralStep[];

const ReferralCard = ({ step, icon: Icon, title, text }: ReferralCardProps) => {
  return (
    <div className="w-full bg-card/60 border border-border rounded-xl space-y-2.5 sm:space-y-4 transition-all duration-300 hover:border-primary/30 hover:bg-primary/5 group relative p-5 pt-8 sm:p-6 sm:pt-10">
      {/* Step */}
      <div className="bg-primary-gradient size-9 sm:size-11 aspect-square flex justify-center items-center rounded-xl absolute top-0 right-0 sm:left-0 translate-x-1/2 sm:-translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-all duration-300">
        <p className="text-base sm:text-xl font-medium">0{step}</p>
      </div>

      <div className="w-fit text-foreground/80 bg-primary/30 rounded-xl p-4 group-hover:scale-110 transition-all duration-300">
        <Icon className="size-5 sm:size-7" />
      </div>

      <p className="text-lg sm:text-xl text-foreground font-medium">{title}</p>

      <p className="text-base text-foreground/60">{text}</p>
    </div>
  );
};

const ReferralWorks = () => {
  return (
    <div className="space-y-5 sm:space-x-8">
      <p className="text-2xl font-medium">How Referrals Work</p>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5.5 lg:gap-7 sm:gap-10">
        {referralSteps &&
          referralSteps.map((step) => {
            return (
              <ReferralCard
                key={step.step}
                step={step.step}
                icon={step.icon}
                title={step.title}
                text={step.text}
              />
            );
          })}
      </div>

      <div className="bg-primary2/10 border border-primary2/40 rounded-xl flex flex-row items-center gap-x-3 px-4 py-3 sm:p-5">
        <div className="bg-primary2/20 rounded-full p-2">
          <Gift className="size-5 sm:size-6 text-primary2" />
        </div>

        <p className="text-primary2 text-sm sm:text-base font-medium">
          Referral rewards are credited only after successful order completion
          and a 7-day holding period.
        </p>
      </div>
    </div>
  );
};

export default ReferralWorks;
