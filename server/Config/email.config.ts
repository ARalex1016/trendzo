import nodemailer from "nodemailer";

// Config
import { env } from "./env.config.ts";

interface sendNodeMailerMailParams {
  from: string;
  to: string;
  subject: string;
  text?: string;
  html: string;
  category: string;
}

export const nodemailerTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS,
  },
});

export const sendNodeMailerMail = async ({
  from,
  to,
  subject,
  text,
  html,
  category,
}: sendNodeMailerMailParams) => {
  const mailOptions = {
    from,
    to,
    subject,
    text,
    html,
    category,
  };

  try {
    console.log(env.EMAIL_USER);
    console.log(env.EMAIL_PASS);

    let res = await nodemailerTransporter.sendMail(mailOptions);
    console.log("Res: ", res);

    return res;
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
};
