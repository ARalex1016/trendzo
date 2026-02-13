import { env } from "./env.config.ts";

import nodemailer from "nodemailer";

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
    let res = await nodemailerTransporter.sendMail(mailOptions);

    return res;
  } catch (error) {
    throw error;
  }
};
