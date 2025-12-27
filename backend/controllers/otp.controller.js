import Otp from "../models/Otp.js";
import User from "../models/User.js";
import generateOtp from "../utils/generateOtp.js";
import sendEmail from "../utils/sendEmail.js";

export const sendOtp = async (req, res) => {
  const { email } = req.body;

  const otp = generateOtp();
  await Otp.deleteMany({ email });

  await Otp.create({
    email,
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000,
  });

  await sendEmail(email, otp);

  res.json({ message: "OTP sent" });
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  const record = await Otp.findOne({ email, otp });
  if (!record || record.expiresAt < Date.now())
    return res.status(400).json({ message: "Invalid or expired OTP" });

  await User.updateOne({ email }, { isVerified: true });
  await Otp.deleteMany({ email });

  res.json({ message: "OTP verified" });
};
