import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Otp from "../models/Otp.js";
import generateOtp from "../utils/generateOtp.js";
import sendEmail from "../utils/sendEmail.js";

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || "your-secret-key", {
    expiresIn: "30d",
  });
};

// ================= REGISTER =================
export const register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Required field check
    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Password length check
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    // User exists check
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      isVerified: false,
    });

    res.status(201).json({
      message: "Registered successfully",
    });
  } catch (error) {
    console.error("Register error:", error);
    if (error.code === 11000) {
      return res.status(400).json({
        message: "User already exists",
      });
    }
    res.status(500).json({
      message: "Server error",
    });
  }
};

// ================= LOGIN =================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

// ================= GOOGLE LOGIN =================
export const googleLogin = async (req, res) => {
  try {
    const { name, email, picture, googleId } = req.body;

    if (!email || !googleId) {
      return res.status(400).json({
        message: "Email and Google ID are required",
      });
    }

    // Find or create user
    let user = await User.findOne({ email });

    if (user) {
      // Update user with Google ID if not present
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
      }
    } else {
      // Create new user
      user = await User.create({
        name: name || "User",
        email,
        googleId,
        isVerified: true, // Google users are pre-verified
        password: "", // No password for Google users
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: "Google login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Google login error:", error);
    if (error.code === 11000) {
      return res.status(400).json({
        message: "User already exists",
      });
    }
    res.status(500).json({
      message: "Server error",
    });
  }
};

// ================= FORGOT PASSWORD =================
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if user exists or not for security
      return res.json({
        message: "If email exists, password reset OTP has been sent",
      });
    }

    // Generate OTP
    const otp = generateOtp();

    // Delete old OTPs
    await Otp.deleteMany({ email, type: "password-reset" });

    // Create new OTP
    await Otp.create({
      email,
      otp,
      type: "password-reset",
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
    });

    // Send OTP email
    await sendEmail(email, otp);

    res.json({
      message: "If email exists, password reset OTP has been sent",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

// ================= RESET PASSWORD =================
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        message: "Email, OTP, and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    // Verify OTP
    const otpRecord = await Otp.findOne({
      email,
      otp,
      type: "password-reset",
    });

    if (!otpRecord || otpRecord.expiresAt < Date.now()) {
      return res.status(400).json({
        message: "Invalid or expired OTP",
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    user.password = hashedPassword;
    await user.save();

    // Delete OTP
    await Otp.deleteMany({ email, type: "password-reset" });

    res.json({
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

// ================= VERIFY REGISTER OTP =================
export const verifyRegisterOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
      });
    }

    // Verify OTP
    const otpRecord = await Otp.findOne({ email, otp });

    if (!otpRecord || otpRecord.expiresAt < Date.now()) {
      return res.status(400).json({
        message: "Invalid or expired OTP",
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    // Mark user as verified
    user.isVerified = true;
    await user.save();

    // Delete OTP
    await Otp.deleteMany({ email });

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: "OTP verified successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Verify register OTP error:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};
