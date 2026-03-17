import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    clientPaymentId: { type: String, unique: true, required: true }, // new unique ID
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    tutorId: { type: mongoose.Schema.Types.ObjectId, ref: "Tutor"},
    packageId: { type: mongoose.Schema.Types.ObjectId, ref: "CoursePackage"},
    amount: Number,
    lessons: Number,
    method: { type: String, default: "UPI" },
    status: { 
      type: String, 
      enum: ["PENDING", "UNDER_REVIEW", "SUCCESS", "FAILED", "COMPLETED"], 
      default: "PENDING" 
    },
    proofImage: String,
    upiRefNo: String, // optional - UPI reference number
    transactionId: String, // Payment gateway transaction ID
  },
  { timestamps: true }
);

// Index for faster queries
paymentSchema.index({ clientPaymentId: 1 });
paymentSchema.index({ status: 1 });

export default mongoose.model("Payment", paymentSchema);
