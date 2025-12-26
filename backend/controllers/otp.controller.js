import Otp from "../models/Otp.js";
import sendEmail from "../utils/sendEmail.js";

// Generate random 6 digit OTP
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/* ================= SEND OTP ================= */
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const otp = generateOtp();

    // delete old OTP
    await Otp.deleteMany({ email });

    await Otp.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 min
    });

    // SEND EMAIL
    await sendEmail({
      to: email,
      subject: "Your OTP - The English Raj",
      html: `
        <div style="font-family: Arial;">
          <h2>Your OTP Code</h2>
          <h1 style="color:#0852A1">${otp}</h1>
          <p>This OTP is valid for 5 minutes.</p>
        </div>
      `,
    });

    res.status(200).json({
      message: "OTP sent to email successfully",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

/* ================= VERIFY OTP ================= */
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const record = await Otp.findOne({ email, otp });

    if (!record) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (record.expiresAt < new Date()) {
      await Otp.deleteOne({ _id: record._id });
      return res.status(400).json({ message: "OTP expired" });
    }

    await Otp.deleteOne({ _id: record._id });

    res.status(200).json({
      message: "OTP verified successfully",
    });

  } catch (error) {
    res.status(500).json({ message: "OTP verification failed" });
  }
};
