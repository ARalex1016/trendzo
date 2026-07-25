import { useState, useEffect } from "react";

// Components
import { StatsGrid, StatsCard } from "@/components/Stats";

// Store
import useReferralStore from "@/store/useReferralStore";

// Types
import type { IReferralStats } from "@/types/referral.type";

// Icons
import { Users, Clock3, Timer, BadgeCheck } from "lucide-react";

const ReferralStats = () => {
  const { getReferralStats } = useReferralStore();

  const [stats, setStats] = useState<IReferralStats | null>(null);

  const fetchReferralStats = async () => {
    try {
      let res = await getReferralStats();

      setStats(res);
    } catch (error) {}
  };

  useEffect(() => {
    fetchReferralStats();
  }, []);

  if (!stats) {
    return;
  }

  return (
    <StatsGrid>
      <StatsCard
        title="Total Referrals"
        value={stats?.total}
        icon={Users}
        variant="primary2"
      />

      <StatsCard
        title="Pending"
        value={stats?.pending}
        icon={Clock3}
        variant="warning"
      />

      <StatsCard
        title="Awaiting Reward"
        value={stats?.holding}
        icon={Timer}
        variant="primary"
      />

      <StatsCard
        title="Rewards Earned"
        value={stats?.completed}
        icon={BadgeCheck}
        variant="success"
      />
    </StatsGrid>
  );
};

export default ReferralStats;
