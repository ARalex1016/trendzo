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
    <div className="w-full aspect-video bg-card/60 border border-border rounded-xl space-y-4 transition-all duration-300 hover:border-primary/30 hover:bg-primary/5 group relative p-6 pt-10">
      {/* Step */}
      <div className="bg-primary-gradient size-12 aspect-square flex justify-center items-center rounded-xl absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2">
        <p className="text-xl font-medium">0{step}</p>
      </div>

      <div className="w-fit text-foreground/80 bg-primary/30 rounded-xl p-4 group-hover:scale-110 transition-all duration-300">
        <Icon className="size-7" />
      </div>

      <p className="text-xl text-foreground font-medium">{title}</p>

      <p className="text-base text-foreground/60">{text}</p>
    </div>
  );
};

const ReferralWorks = () => {
  return (
    <div className="space-y-8">
      <p className="text-2xl font-medium">How Referrals Work</p>

      <div className="grid grid-cols-4 gap-10">
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

      <div className="bg-primary2/10 border border-primary2/40 rounded-xl flex flex-row items-center gap-x-3 p-5">
        <div className="bg-primary2/20 rounded-full p-2">
          <Gift className="text-primary2" />
        </div>

        <p className="text-primary2 font-medium">
          Referral rewards are credited only after successful order completion
          and a 7-day holding period.
        </p>
      </div>
    </div>
  );
};

export default ReferralWorks;
