import nodemailer from "nodemailer";

const sendEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"English Raj" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your OTP Verification",
    html: `<h2>Your OTP is <b>${otp}</b></h2>`,
  });
};

export default sendEmail;
