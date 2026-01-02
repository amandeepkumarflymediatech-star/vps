import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
  title: String,
  description: String,
  tutorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization" }
});

export default mongoose.model("Class", classSchema);
