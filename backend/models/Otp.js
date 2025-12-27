import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: String,
  otp: String,
  type: { type: String, default: "register" }, // "register" or "password-reset"
  expiresAt: Date,
});

export default mongoose.model("Otp", otpSchema);
