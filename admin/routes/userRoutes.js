const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const Batch = require("../models/Batch");

const getUsers = async (req, res) => {
  const { role } = req.query;

  // ADMIN: can see everyone in organization
  if (req.user.role === "ADMIN") {
    const filter = { organizationId: req.user.organizationId };
    if (role) filter.role = role;

    const users = await User.find(filter).select("-password");
    return res.json(users);
  }

  // TUTOR: see only students enrolled in tutor's batches
  if (req.user.role === "TUTOR") {
    const batches = await Batch.find({
      tutorId: req.user.id,
    }).select("enrolledStudents");

    const studentIds = batches.flatMap((b) => b.enrolledStudents);

    const students = await User.find({
      _id: { $in: studentIds },
    }).select("-password");
    console.log(students);
    return res.json(students);
  }

  // STUDENT: see only own profile
  if (req.user.role === "STUDENT") {
    const user = await User.findById(req.user.id).select("-password");
    return res.json([user]);
  }

  res.status(403).json({ message: "Unauthorized" });
};
router.get("/", getUsers);

// Create a new user (admin only)
router.post("/create", (req, res) => {
  const { username, password } = req.body;
  const newUser = new User({ username, password });

  newUser
    .save()
    .then(() => res.redirect("/admin/users"))
    .catch((err) => res.status(500).send(err));
});


module.exports = router;
