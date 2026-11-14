const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const Payment = require("../models/payment");
const Enrollment = require("../models/enrollment");
const CoursePackage = require("../models/coursePackage");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { auth, role } = require("../middlewares/auth.middleware");
const {
  cleanString,
  getAdminEnvCredentials,
  syncAdminUser,
} = require("../utils/adminAuthHelper");

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

router.get("/dashboard", auth, role("ADMIN"), async (req, res) => {
  try {
    // 1. User stats
    const [totalUsers, totalStudents, totalTutors, activeUsers] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: { $in: ["STUDENT", "student"] } }),
      User.countDocuments({ role: { $in: ["TUTOR", "tutor"] } }),
      User.countDocuments({ status: "ACTIVE" }),
    ]);

    // 2. Payment stats
    const [revenueAgg, allPaymentsAgg, pendingPaymentsCount] = await Promise.all([
      Payment.aggregate([
        {
          $match: {
            status: { $in: ["SUCCESS", "VERIFIED", "COMPLETED"] },
          },
        },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: "$amount" },
            count: { $sum: 1 },
          },
        },
      ]),
      Payment.aggregate([
        {
          $group: {
            _id: null,
            totalAmount: { $sum: "$amount" },
            count: { $sum: 1 },
          },
        },
      ]),
      Payment.countDocuments({
        status: { $in: ["PENDING", "UNDER_REVIEW"] },
      }),
    ]);

    const totalSuccessfulAmount = revenueAgg.length > 0 ? revenueAgg[0].totalAmount : 0;
    const successfulPaymentsCount = revenueAgg.length > 0 ? revenueAgg[0].count : 0;
    const totalPaymentsAmount = allPaymentsAgg.length > 0 ? allPaymentsAgg[0].totalAmount : 0;
    const totalPaymentsCount = allPaymentsAgg.length > 0 ? allPaymentsAgg[0].count : 0;

    // 3. Enrollment stats
    const [totalEnrollments, upcomingEnrollments, completedEnrollments] = await Promise.all([
      Enrollment.countDocuments(),
      Enrollment.countDocuments({ status: "UPCOMING" }),
      Enrollment.countDocuments({ status: "COMPLETED" }),
    ]);

    // 4. Packages stats
    const totalPackages = await CoursePackage.countDocuments({ isDeleted: { $ne: true } });

    // 5. Recent 5 Payments
    const recentPayments = await Payment.find()
      .populate("userId", "name email phone")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // 6. Recent 5 Enrollments
    const recentEnrollments = await Enrollment.find()
      .populate("userId", "name email")
      .populate("tutorId", "name email")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    res.render("dashboard", {
      user: req.user,
      stats: {
        totalUsers,
        totalStudents,
        totalTutors,
        activeUsers,
        totalSuccessfulAmount,
        totalPaymentsAmount,
        successfulPaymentsCount,
        totalPaymentsCount,
        pendingPaymentsCount,
        totalEnrollments,
        upcomingEnrollments,
        completedEnrollments,
        totalPackages,
      },
      recentPayments,
      recentEnrollments,
    });
  } catch (err) {
    console.error("Admin dashboard error:", err);
    res.status(500).render("layouts/error", {
      message: "Failed to load dashboard data",
      path: req.originalUrl,
    });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const inputEmail = cleanString(email).toLowerCase();
  const inputPass = cleanString(password);

  const adminCreds = getAdminEnvCredentials();
  const adminEmailClean = adminCreds.email.toLowerCase();
  const adminUserClean = adminCreds.username.toLowerCase();

  const isAdminAttempt =
    inputEmail === adminEmailClean ||
    inputEmail === adminUserClean ||
    inputEmail === "admin" ||
    inputEmail === "admin@theenglishraj.com";

  if (isAdminAttempt) {
    if (inputPass !== adminCreds.password) {
      return res.render("adminlogin", { error: "Invalid credentials" });
    }

    const targetEmail = adminCreds.email || "admin@theenglishraj.com";
    const admin = await syncAdminUser(targetEmail, adminCreds.password);

    // JWT Token
    const token = jwt.sign(
      {
        id: admin._id,
        role: "ADMIN",
        organizationId: admin.organizationId,
      },
      process.env.JWT_SECRET || "supersecretenglishraj",
        { expiresIn: process.env.JWT_EXPIRES_IN || "7d" },
    );

    // Store token in cookie (recommended for EJS)
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true in production
    });

    return res.redirect("/admin/dashboard");
  }

  // Reject if not matching active .env admin authority
  return res.render("adminlogin", { error: "Invalid credentials" });
});

module.exports = router;
