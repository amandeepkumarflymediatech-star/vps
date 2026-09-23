import nodemailer from "nodemailer";

let transporter;

export const getTransporter = () => {
  if (!transporter) {
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    if (!user || !pass) {
      console.error("❌ CRITICAL: EMAIL_USER or EMAIL_PASS is missing in env!");
      return null;
    }

    const host = process.env.EMAIL_HOST;
    const port = process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT, 10) : 587;
    const isSecure = process.env.EMAIL_SECURE === "true" || process.env.EMAIL_SECURE === true || port === 465;

    if (host) {
      transporter = nodemailer.createTransport({
        host,
        port,
        secure: isSecure,
        auth: {
          user,
          pass,
        },
        tls: {
          rejectUnauthorized: process.env.EMAIL_TLS_REJECT_UNAUTHORIZED !== "false",
        },
      });
    } else {
      transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || "gmail",
        auth: {
          user,
          pass,
        },
      });
    }
  }
  return transporter;
};

export const sendOtpEmail = async (email, otp) => {
  const mailer = getTransporter();
  if (!mailer) {
    console.error("❌ CRITICAL: Mailer is not initialized!");
    throw new Error("Mailer is not initialized");
  }
  const fromAddress = process.env.EMAIL_FROM || `"EnglishRaj" <${process.env.EMAIL_USER}>`;
  return await mailer.sendMail({
    from: fromAddress,
    to: email,
    subject: "Your OTP",
    text: `Your OTP is ${otp}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #0852A1; text-align: center;">The English Raj</h2>
        <p style="font-size: 16px; color: #333;">Hello,</p>
        <p style="font-size: 14px; color: #555;">Your one-time verification code is:</p>
        <div style="background-color: #f4f6f8; padding: 15px; text-align: center; border-radius: 6px; font-size: 24px; font-weight: bold; letter-spacing: 4px; color: #0852A1; margin: 20px 0;">
          ${otp}
        </div>
        <p style="font-size: 13px; color: #777;">This OTP is valid for 5 minutes. Please do not share it with anyone.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #999; text-align: center;">&copy; ${new Date().getFullYear()} The English Raj. All rights reserved.</p>
      </div>
    `,
  });
};

export const sendEmail = async ({ to, subject, text, html }) => {
  const mailer = getTransporter();
  if (!mailer) {
    console.error("❌ CRITICAL: Mailer is not initialized!");
    throw new Error("Mailer is not initialized");
  }
  const fromAddress = process.env.EMAIL_FROM || `"EnglishRaj" <${process.env.EMAIL_USER}>`;
  return await mailer.sendMail({
    from: fromAddress,
    to,
    subject,
    text,
    ...(html ? { html } : {}),
  });
};

export default { getTransporter, sendOtpEmail, sendEmail };

