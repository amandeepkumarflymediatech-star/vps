import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    batchId: { type: mongoose.Schema.Types.ObjectId, ref: "Batch" },
  },
  { timestamps: true }
);

export default mongoose.model("Enrollment", enrollmentSchema);
