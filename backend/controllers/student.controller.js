import Class from "../models/class.js";
import Batch from "../models/batch.js";
import Enrollment from "../models/enrollment.js";

export const getClasses = async (req, res) => {
  const classes = await Class.find({
    organizationId: req.user.organizationId,
  });
  res.json(classes);
};

export const enrollBatch = async (req, res) => {
  const batch = await Batch.findById(req.body.batchId);

  if (batch.enrolledStudents.length >= batch.maxStudents) {
    return res.status(400).json({ message: "Batch full" });
  }

  batch.enrolledStudents.push(req.user.id);
  await batch.save();

  await Enrollment.create({
    userId: req.user.id,
    batchId: batch._id,
  });

  res.json({ message: "Enrolled successfully" });
};
