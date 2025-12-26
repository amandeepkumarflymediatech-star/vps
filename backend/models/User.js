import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: String,
    password: String,
    googleId: String,
    avatar: String,
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
