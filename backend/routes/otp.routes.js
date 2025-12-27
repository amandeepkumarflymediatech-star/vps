import express from "express";
import {
  sendRegisterOtp,
  verifyRegisterOtp,
  sendResetOtp,
} from "../controllers/otp.controller.js";

const router = express.Router();

router.post("/send-register", sendRegisterOtp);
router.post("/verify-register", verifyRegisterOtp);
router.post("/send-reset", sendResetOtp);

export default router;
