const nodemailer = require("nodemailer");

let transporter;

const getTransporter = () => {
  if (!transporter) {
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    if (!user || !pass) {
      console.error("❌ CRITICAL: EMAIL_USER or EMAIL_PASS is missing in admin env!");
      return null;
    }

    const host = process.env.EMAIL_HOST;
    const port = process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT, 10) : 587;
    const isSecure =
      process.env.EMAIL_SECURE === "true" ||
      process.env.EMAIL_SECURE === true ||
      port === 465;

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

module.exports = async ({ to, subject, html, text }) => {
  const mailer = getTransporter();
  if (!mailer) {
    console.error("❌ CRITICAL: Admin Mailer is not initialized!");
    throw new Error("Admin Mailer is not initialized");
  }

  const fromAddress =
    process.env.EMAIL_FROM || `"Admin" <${process.env.EMAIL_USER}>`;

  return await mailer.sendMail({
    from: fromAddress,
    to,
    subject,
    ...(text ? { text } : {}),
    ...(html ? { html } : {}),
  });
};

