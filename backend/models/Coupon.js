import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    discountType: {
      type: String,
      enum: ["PERCENTAGE", "FIXED"],
      default: "PERCENTAGE",
    },
    discountValue: {
      type: Number,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    usageLimit: {
      type: Number,
      default: 100,
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Coupon || mongoose.model("Coupon", couponSchema);
