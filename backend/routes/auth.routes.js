import express from "express";
import { register, verifyRegisterOtp } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/verify-register-otp", verifyRegisterOtp);

export default router;
