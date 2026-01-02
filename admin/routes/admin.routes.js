const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
router.get("/login", (req, res) => {
  res.render("adminlogin", { error: null });
});
router.post("/logout", (req, res) => {
  res.json({ message: "Logout successful" });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const admin = await User.findOne({ email, role: "ADMIN" });
  if (!admin) {
    return res.render("adminlogin", { error: "Admin not found" });
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    return res.render("adminlogin", { error: "Invalid credentials" });
  }

  // JWT Token
  const token = jwt.sign(
    {
      id: admin._id,
      role: admin.role,
      organizationId: admin.organizationId,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  // Store token in cookie (recommended for EJS)
  res.cookie("token", token, {
    httpOnly: true,
    secure: false, // true in production
  });

  res.redirect("/admin/dashboard");
});

module.exports = router;
