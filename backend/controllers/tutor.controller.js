import Tutor from "../models/Tutor.js";

export const getTutors = async (req, res) => {
  const tutors = await Tutor.find();
  res.json(tutors);
};
