const User = require("../models/userModel.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  cleanString,
  getAdminEnvCredentials,
  syncAdminUser,
} = require("../utils/adminAuthHelper");

const adminLogin = async (req, res) => {
  try {
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
        req.flash("error", "Invalid credentials");
        return res.redirect("/admin/login");
      }

      const targetEmail = adminCreds.email || "admin@theenglishraj.com";
      const admin = await syncAdminUser(targetEmail, adminCreds.password);

      const token = jwt.sign(
        { id: admin._id, role: "ADMIN", organizationId: admin.organizationId },
        process.env.JWT_SECRET || "thisisaverysecuresecretkeyforjwt",
        { expiresIn: process.env.JWT_EXPIRES_IN || "7d" },
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: false, // true in production
      });
      res.cookie("admin_token", token, {
        httpOnly: true,
        secure: false,
      });

      req.flash("success", "Welcome Admin!");
      return res.redirect("/admin/dashboard");
    }

    req.flash("error", "Invalid credentials");
    return res.redirect("/admin/login");
  } catch (err) {
    console.error(err);
    req.flash("error", "Server error");
    res.redirect("/admin/login");
  }
};

module.exports = { adminLogin };
