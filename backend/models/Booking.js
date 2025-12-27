import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    userId: mongoose.Schema.Types.ObjectId,
    tutorId: mongoose.Schema.Types.ObjectId,
    time: String,
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
