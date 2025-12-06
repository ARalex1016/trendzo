import { env } from "../Config/env.config.ts";
import { sendNodeMailerMail } from "./../Config/email.config.ts";

export const sendEmail = async (
  email: string,
  subject: string,
  template: string,
  category: string
) => {
  await sendNodeMailerMail({
    from: env.EMAIL_USER,
    to: email,
    subject: subject,
    html: template,
    category: category,
  });
};
