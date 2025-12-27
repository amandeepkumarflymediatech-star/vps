// import Otp from "../models/Otp.js";
// import User from "../models/User.js";
// import generateOtp from "../utils/generateOtp.js";
// import sendEmail from "../utils/sendEmail.js";

// export const sendOtp = async (req, res) => {
//   const { email } = req.body;

//   const otp = generateOtp();
//   await Otp.deleteMany({ email });

//   await Otp.create({
//     email,
//     otp,
//     expiresAt: Date.now() + 5 * 60 * 1000,
//   });

//   await sendEmail(email, otp);

//   res.json({ message: "OTP sent" });
// };

// export const verifyOtp = async (req, res) => {
//   const { email, otp } = req.body;

//   const record = await Otp.findOne({ email, otp });
//   if (!record || record.expiresAt < Date.now())
//     return res.status(400).json({ message: "Invalid or expired OTP" });

//   await User.updateOne({ email }, { isVerified: true });
//   await Otp.deleteMany({ email });

//   res.json({ message: "OTP verified" });
// };



import Otp from "../models/Otp.js";
import User from "../models/User.js";
import generateOtp from "../utils/generateOtp.js";
import sendEmail from "../utils/sendEmail.js";

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const otp = generateOtp();

    await Otp.deleteMany({ email });

    await Otp.create({
      email,
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    // 🔥 MOST LIKELY FAILING HERE
    await sendEmail(email, otp);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("SEND OTP ERROR 👉", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP required" });
    }

    const record = await Otp.findOne({ email, otp });

    if (!record || record.expiresAt < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    await User.updateOne({ email }, { isVerified: true });
    await Otp.deleteMany({ email });

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error("VERIFY OTP ERROR 👉", error);

    return res.status(500).json({
      success: false,
      message: "OTP verification failed",
    });
  }
};
