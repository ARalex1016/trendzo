import dotenv from "dotenv";
dotenv.config();

export const env = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
  FRONTEND_URL: process.env.FRONTEND_URL || "https:localhost/5000",
  MONGODB_CON: process.env.MONGODB_CON || "",
  JWT_SECRET: process.env.JWT_SECRET || null,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  ADMIN_MASTER_KEY: process.env.ADMIN_MASTER_KEY || null,
  EMAIL_USER: process.env.EMAIL_USER || "aralex1016@gmail.com",
  EMAIL_PASS: process.env.EMAIL_PASS || "aslamsheikh@1016",
};
