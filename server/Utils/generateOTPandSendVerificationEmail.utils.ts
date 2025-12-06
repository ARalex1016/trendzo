// Utils
import { sendEmail } from "./sendEmail.ts";

// Lib
import { verificationEmailTemplate } from "../Lib/emailTemplates.lib.ts";

export const generateOTPandSendVerificationEmail = async (user: any) => {
  const verificationToken = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  user.emailVerificationOTP = verificationToken;
  user.emailVerificationOTPExpiresAt = Date.now() + 2 * 60 * 1000; // 2 minutes
  await user.save();

  await sendEmail(
    user.email,
    "Verify your email",
    verificationEmailTemplate(verificationToken, user.name),
    "Email Verification"
  );
};
