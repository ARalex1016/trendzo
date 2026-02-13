import cron from "node-cron";

// Repositories
import { ReferralRepository } from "../Repositories/referral.repository.ts";
import { LedgerRepository } from "../Repositories/ledger.repository.ts";

export const referralCronJob = () => {
  // Every night at 2 AM
  cron.schedule("0 2 * * *", async () => {
    // Every minute
    // cron.schedule("* * * * *", async () => {
    try {
      // Runs daily at 2 AM
      const now = new Date();

      // get all referrals, that as that has status = "holding", and holdUntil = now
      const expiredReferrals = await ReferralRepository.findHoldExpired(now);

      for (const referral of expiredReferrals) {
        // 1. Add reward to ledger
        await LedgerRepository.create({
          user: referral.inviter,
          amount: referral.rewardAmount,
          source: {
            type: "referral",
            id: referral._id,
          },
          reason: `Referral reward from invitee ${referral.invitee}`,
        });

        // 2. Mark referral as completed
        await ReferralRepository.markCompleted(referral._id);
      }

      console.log(
        `[ReferralCron] Processed ${expiredReferrals.length} referrals`
      );
    } catch (error) {
      console.error("[ReferralCron] Error:", error);
    } finally {
      console.log("Checked");
    }
  });
};
