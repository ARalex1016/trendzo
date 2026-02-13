// Jobs/index.ts
import { referralCronJob } from "./referral.cron.ts";

export const startCronJobs = () => {
  referralCronJob();

  console.log("All cron jobs started");
};
