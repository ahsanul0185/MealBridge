import nodemailer from "nodemailer";
import config from "../config/env.js";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

const transporter = nodemailer.createTransport({
  host: config.smtp_host,
  port: config.smtp_port,
  secure: config.smtp_secure,
  auth: {
    user: config.smtp_user,
    pass: config.smtp_pass,
  },
});

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  const { to, subject, html } = options;

  if (!config.smtp_host || !config.smtp_user || !config.smtp_pass) {
    if (config.NODE_ENV === "development") {
      console.warn("[sendEmail] SMTP not configured. Email would have been sent:");
      console.warn(`  To: ${to}`);
      console.warn(`  Subject: ${subject}`);
      console.warn(`  HTML: ${html}`);
      return;
    }
    throw new Error("SMTP configuration is missing");
  }

  await transporter.sendMail({
    from: config.email_from,
    to,
    subject,
    html,
  });
};

export default sendEmail;
