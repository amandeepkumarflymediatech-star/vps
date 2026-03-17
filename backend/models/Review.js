import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tutorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Prevent multiple reviews from the same student for the same tutor
reviewSchema.index({ studentId: 1, tutorId: 1 }, { unique: true });

export default mongoose.model("Review", reviewSchema);
