import mongoose from "mongoose";

import { env } from "./env.config.ts";

export const connectDB = async () => {
  try {
    await mongoose.connect(env.MONGODB_CON);

    console.log("MongoDB connected Successfully!");
  } catch (error) {
    console.log("MongoDB connection error");
  }
};
