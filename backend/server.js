import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.routes.js";
import otpRoutes from "./routes/otp.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

/* ================= CORS ================= */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://theenglishraj.com",
      "https://www.theenglishraj.com",
    ],
    credentials: true,
  })
);

/* ================= BODY PARSER ================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================= ROUTES ================= */
app.use("/api/auth", authRoutes);
app.use("/api/otp", otpRoutes);

/* ================= HEALTH ================= */
app.get("/", (req, res) => {
  res.json({ success: true, message: "Backend running 🚀" });
});

/* ================= 404 HANDLER (SAFE) ================= */
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

/* ================= START SERVER ================= */
connectDB().then(() => {
  app.listen(PORT, () =>
    console.log(`🔥 Server running on port ${PORT}`)
  );
});
