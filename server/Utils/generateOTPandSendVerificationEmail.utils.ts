import type { IUser } from "../Models/user.model.ts";

// Utils
import { sendEmail } from "./sendEmail.ts";

// Lib
import { verificationEmailTemplate } from "../Lib/emailTemplates.lib.ts";

import { expiresAt } from "../Controllers/auth.controller.ts";

export const generateOTPandSendVerificationEmail = async (user: IUser) => {
  const verificationToken = Math.floor(
    100000 + Math.random() * 900000,
  ).toString();

  user.emailVerificationOTP = verificationToken;
  user.emailVerificationOTPExpiresAt = new Date(Date.now() + expiresAt);

  await sendEmail(
    user.email,
    "Verify your email",
    verificationEmailTemplate(verificationToken, user.name),
    "Email Verification",
  );

  await user.save();
};
