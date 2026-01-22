import mongoose from "mongoose";

const SlotSchema = new mongoose.Schema({
  startTime: { type: String, required: true }, // "09:00"
  endTime: { type: String, required: true }, // "10:00"
  isAvailable: { type: Boolean, default: false },
  isBooked: { type: Boolean, default: false },
});

const tutorAvailabilitySchema = new mongoose.Schema(
  {
    tutorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    availability: [SlotSchema],
  },
  { timestamps: true },
);

// 🔒 Prevent duplicate rows for same tutor + same day ;
tutorAvailabilitySchema.index({ tutorId: 1, date: 1 });
tutorAvailabilitySchema.index({ "availability._id": 1 });
export default mongoose.model("TutorAvailability", tutorAvailabilitySchema);
