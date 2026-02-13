import mongoose from "mongoose";

import { env } from "./env.config.ts";

import { startCronJobs } from "../Jobs/index.cron.ts";

export const connectDB = async () => {
  try {
    await mongoose.connect(env.MONGODB_CON);

    console.log("MongoDB connected Successfully!");

    // ✅ Start cron jobs AFTER DB connection
    startCronJobs();
    console.log("Cron Jobs started");
  } catch (error) {
    console.log("MongoDB connection error");
    process.exit(1);
  }
};
