export const REFERRAL = {
  program: {
    reward: {
      amount: 50,
    },

    referee: {
      minimumPurchase: 1000,
    },

    holdingPeriod: {
      value: 7,
      unit: "days",
    },

    limits: {
      maxRewardsPerMonth: null,
      maxReferralsPerUser: null,
    },

    eligibility: {
      requireSuccessfulRegistration: true,
      requireQualifiedPurchase: true,
    },
  },

  content: {
    title: "Refer & Earn",
    description:
      "Invite your friends and earn rewards when they make their first qualifying purchase.",
  },
} as const;
