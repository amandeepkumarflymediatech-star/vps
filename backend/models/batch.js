import mongoose from "mongoose";

const batchSchema = new mongoose.Schema({
  classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class" },
  tutorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  startDate: Date,
  endDate: Date,
  timeSlot: String,
  maxStudents: Number,
  enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization" }
});

export default mongoose.model("Batch", batchSchema);
