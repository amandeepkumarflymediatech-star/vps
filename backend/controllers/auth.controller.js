import User from "../models/User.js";
import Otp from "../models/Otp.js";

/* ================= REGISTER (STEP 1) ================= */
export const register = async (req, res) => {
  try {
    const { email } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // OTP already sent from frontend
    res.status(200).json({
      message: "OTP sent to email. Please verify OTP",
    });

  } catch (error) {
    res.status(500).json({ message: "Register failed" });
  }
};

/* ================= VERIFY OTP & CREATE USER ================= */
export const verifyRegisterOtp = async (req, res) => {
  try {
    const { name, email, phone, password, otp } = req.body;

    const otpRecord = await Otp.findOne({ email, otp });

    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (otpRecord.expiresAt < new Date()) {
      await Otp.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({ message: "OTP expired" });
    }

    await User.create({
      name,
      email,
      phone,
      password,
    });

    await Otp.deleteOne({ _id: otpRecord._id });

    res.status(201).json({
      message: "Registration successful",
    });

  } catch (error) {
    res.status(500).json({ message: "OTP verification failed" });
  }
};
