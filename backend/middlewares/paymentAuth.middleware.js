import jwt from "jsonwebtoken";

/**
 * Payment Auth Middleware
 * Checks JWT token in Authorization header or cookie
 */
export const paymentAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "No token provided for payment" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Payment Auth error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
