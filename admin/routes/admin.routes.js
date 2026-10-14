const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { auth, role } = require("../middlewares/auth.middleware");

router.get("/login", (req, res) => {
  const token = req.cookies?.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if ((decoded.role || "").toUpperCase() === "ADMIN") {
        return res.redirect("/admin/dashboard");
      } else {
        res.clearCookie("token");
      }
    } catch (err) {
      res.clearCookie("token");
    }
  }
  return res.render("adminlogin", { error: null });
});

router.all("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
  if (req.xhr || (req.headers.accept && req.headers.accept.includes("application/json"))) {
    return res.json({ message: "Logout successful" });
  }
  return res.redirect("/admin/login");
});

router.get("/dashboard", auth, role("ADMIN"), (req, res) => {
  res.render("dashboard", {
    user: req.user,
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const normalizedEmail = (email || "").trim().toLowerCase();
  const admin = await User.findOne({
    email: { $regex: new RegExp(`^${normalizedEmail}$`, "i") },
    role: { $in: ["ADMIN", "admin"] },
  });
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
      role: (admin.role || "ADMIN").toUpperCase(),
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

  return res.redirect("/admin/dashboard");
});

module.exports = router;
