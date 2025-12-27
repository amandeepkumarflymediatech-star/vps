import mongoose from "mongoose";

const tutorSchema = new mongoose.Schema({
  name: String,
  rating: Number,
  students: Number,
  nextAvailable: String,
});

export default mongoose.model("Tutor", tutorSchema);
