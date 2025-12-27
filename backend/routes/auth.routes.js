import express from "express";
import {
  register,
  login,
  googleLogin,
  forgotPassword,
  resetPassword,
  verifyRegisterOtp,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleLogin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/verify-register-otp", verifyRegisterOtp);

export default router;

