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
    return res.render("layouts/alert-redirect", {
      type: "error",
      title: "Session Expired",
      message: err.message,
      redirect: "/admin/login",
    });
  }
};
const role = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};

module.exports = { auth, role };
