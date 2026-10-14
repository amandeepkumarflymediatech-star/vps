// middleware/auth.middleware.js
const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) return res.redirect("/admin/login");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.clearCookie("token");
    return res.render("layouts/alert-redirect", {
      type: "error",
      title: "Session Expired",
      message: "Your session has expired. Please log in again.",
      redirect: "/admin/login",
    });
  }
};

const role = (...roles) => {
  const allowed = roles.map((r) => String(r).toUpperCase());
  return (req, res, next) => {
    if (!req.user) {
      return res.redirect("/admin/login");
    }
    const userRole = (req.user.role || "").toUpperCase();
    if (!allowed.includes(userRole)) {
      if (req.xhr || (req.headers.accept && req.headers.accept.includes("application/json"))) {
        return res.status(403).json({ message: "Forbidden: Admin access required" });
      }
      // Clear conflicting non-admin cookie so the admin can log in
      res.clearCookie("token");
      return res.status(403).render("layouts/alert-redirect", {
        type: "error",
        title: "Access Denied",
        message: "You must be logged in as an Administrator to access this section.",
        redirect: "/admin/login",
      });
    }
    next();
  };
};

module.exports = { auth, role };
