// import Otp from "../models/Otp.js";
// import User from "../models/User.js";
// import generateOtp from "../utils/generateOtp.js";
// import sendEmail from "../utils/sendEmail.js";

// export const sendOtp = async (req, res) => {
//   try {
//     const { email } = req.body;

//     if (!email) {
//       return res.status(400).json({ message: "Email is required" });
//     }

//     // Generate OTP
//     const otp = generateOtp();

//     // Delete old OTPs for this email (any type)
//     await Otp.deleteMany({ email });

//     // Create new OTP (default type is "register")
//     await Otp.create({
//       email,
//       otp,
//       type: "register",
//       expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
//     });

//     // Send OTP email
//     await sendEmail(email, otp);

//     res.json({ message: "OTP sent successfully" });
//   } catch (error) {
//     console.error("Send OTP error:", error);
//     res.status(500).json({ message: "Failed to send OTP" });
//   }
// };

// export const verifyOtp = async (req, res) => {
//   try {
//     const { email, otp } = req.body;

//     if (!email || !otp) {
//       return res.status(400).json({ message: "Email and OTP are required" });
//     }

//     // Find OTP record
//     const record = await Otp.findOne({ email, otp });

//     if (!record || record.expiresAt < Date.now()) {
//       return res.status(400).json({ message: "Invalid or expired OTP" });
//     }

//     // If this is a registration OTP, mark user as verified
//     if (record.type === "register") {
//       const user = await User.findOne({ email });
//       if (user && !user.isVerified) {
//         user.isVerified = true;
//         await user.save();
//       }
//     }

//     // Delete OTP after verification
//     await Otp.deleteMany({ email });

//     res.json({ message: "OTP verified successfully" });
//   } catch (error) {
//     console.error("Verify OTP error:", error);
//     res.status(500).json({ message: "Failed to verify OTP" });
//   }
// };



import Otp from "../models/Otp.js";
import User from "../models/User.js";
import generateOtp from "../utils/generateOtp.js";
import sendEmail from "../utils/sendEmail.js";

/* ================= REGISTER OTP ================= */
export const sendRegisterOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const otp = generateOtp();

    await Otp.deleteMany({ email, type: "register" });

    await Otp.create({
      email,
      otp,
      type: "register",
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    await sendEmail(email, otp);

    res.json({ message: "Register OTP sent successfully" });
  } catch (error) {
    console.error("Send register OTP error:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

/* ================= VERIFY REGISTER OTP ================= */
export const verifyRegisterOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const record = await Otp.findOne({ email, otp, type: "register" });

    if (!record || record.expiresAt < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    await User.updateOne({ email }, { isVerified: true });
    await Otp.deleteMany({ email, type: "register" });

    res.json({ message: "Registration verified successfully" });
  } catch (error) {
    console.error("Verify register OTP error:", error);
    res.status(500).json({ message: "OTP verification failed" });
  }
};

/* ================= PASSWORD RESET OTP ================= */
export const sendResetOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const otp = generateOtp();

    await Otp.deleteMany({ email, type: "password-reset" });

    await Otp.create({
      email,
      otp,
      type: "password-reset",
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    await sendEmail(email, otp);

    res.json({ message: "Password reset OTP sent" });
  } catch (error) {
    console.error("Send reset OTP error:", error);
    res.status(500).json({ message: "Failed to send reset OTP" });
  }
};
