const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const Batch = require("../models/Batch");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const { auth, role } = require("../middlewares/auth.middleware");
const crypto = require("crypto");
const sendMail = require("../utils/sendmail");
// Get all users (admin only)
router.get("/", auth, role("ADMIN"), async (req, res) => {
  try {
    let data = await User.find({ _id: { $ne: req.user.id } }).lean();
    return res.render("users", { data: data });
  } catch (error) {
    return res.status(403).json({ message: error.message });
  }
});

// Create a new user (admin only)
router.post("/create", auth, role("ADMIN"), (req, res) => {
  const { username, password } = req.body;
  const newUser = new User({ username, password });
  newUser
    .save()
    .then(() => res.redirect("/admin/users"))
    .catch((err) => res.status(500).send(err));
});

// View user details
router.get("/:id", auth, role("ADMIN"), async (req, res) => {
  const { id } = req.params;

  // ✅ Check ObjectId validity
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).render("layouts/error", {
      message: "Invalid user ID",
      path: req.originalUrl,
    });
  }

  try {
    const data = await User.findById(id).lean();
    if (!data) {
      return res.status(404).render("layouts/error", {
        message: "User not found",
        path: req.originalUrl,
      });
    }
    return res.render("users/viewuser", { data });
  } catch (err) {
    console.error(err);
    return res.status(500).render("layouts/error", {
      message: "Something went wrong",
      path: req.originalUrl,
    });
  }
});

// Delete user (admin only)
router.post("/delete/:id", auth, role("ADMIN"), async (req, res) => {
  const { id } = req.params;
  // ✅ Check ObjectId validity
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: "Invalid user ID",
      path: req.originalUrl,
    });
  }
  try {
    const data = await User.findById(id).lean();
    if (!data) {
      return res.status(404).send({
        message: "User not found",
        path: req.originalUrl,
      });
    }
    const user = await User.findByIdAndDelete(id);
    console.log("Deleted User:", user);
    return res.status(200).send({
      message: "User delete successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Toggle user verification status (admin only)
// router.post("/toggle-status", async (req, res) => {
//   const { id, status } = req.body;

//   console.log("Toggle Status Request:", req.body);
//   // Validate ObjectId
//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return res.status(400).json({ message: "Invalid user ID" });
//   }

//   try {
//     const user = await User.findByIdAndUpdate(
//       id,
//       { isVerified: status === "true" || status === "true" },
//       { new: true }
//     );
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     return res.json({ isVerified: user.isVerified });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: "Server error" });
//   }
// });

router.post("/toggle-status", async (req, res) => {
  try {
    let { id, status } = req.body;
    status = status === true || status === "true";

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newStatus = status ? "ACTIVE" : "INACTIVE";

    if (newStatus === "ACTIVE") {
      // If activating a tutor who hasn't set password / verified, send setup link
      if (user.role === "TUTOR" && !user.isVerified) {
        const token = crypto.randomBytes(32).toString("hex");
        user.resetToken = token;
        user.resetTokenExpiry = Date.now() + 1000 * 60 * 30; // 30 min
        user.isVerified = true;
        user.password = undefined; // Force password setup
        user.status = "ACTIVE";

        await user.save();

        const resetLink = `${process.env.BASE_URL}/admin/users/setup-password/${token}`;
        await sendMail({
          to: user.email,
          subject: "Set your password",
          html: `
          <p>Your account is activated.</p>
          <p>Click below to set your password:</p>
          <a href="${resetLink}">Set Password</a>
          <p>This link expires in 30 minutes.</p>
        `,
        });
      } else {
        user.status = "ACTIVE";
        // keep verification state; if not verified, mark verified on activate
        if (!user.isVerified) user.isVerified = true;
      }
    } else {
      user.status = "INACTIVE";
    }

    await user.save();
    return res.json({
      success: true,
      status: user.status,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// Render password setup page
router.get("/setup-password/:token", async (req, res) => {
  const user = await User.findOne({
    resetToken: req.params.token,
    resetTokenExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return res.render("layouts/error", {
      message: "Invalid or expired link",
      path: req.originalUrl,
    });
  }

  res.render("auth/setup-password", { token: req.params.token });
});

// Handle password setup
router.post("/setup-password", async (req, res) => {
  const { token, password, confirmPassword } = req.body;
  console.log("Setup Password Request:", req.body, req.query);
  const tutorLoginLink = `${process.env.FRONTEND_URL}/tutor/login`;

  if (password !== confirmPassword) {
    return res.render("layouts/error", {
      message: "Passwords do not match",
      path: req.originalUrl,
    });
  }

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return res.render("layouts/error", {
      message: "Invalid or expired link",
    });
  }

  user.password = await bcrypt.hash(password, 10);
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;

  await user.save();

  res.redirect(tutorLoginLink);
});

module.exports = router;
