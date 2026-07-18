import nodemailer from "nodemailer";

// Config
import { env } from "../Config/env.config.ts";

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
  // host: "smtp.gmail.com",
  // port: 465,
  // secure: true,
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
    await nodemailerTransporter.verify();

    let res = await nodemailerTransporter.sendMail(mailOptions);

    return res;
  } catch (error) {
    throw error;
  }
};
