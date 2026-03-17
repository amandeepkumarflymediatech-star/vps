import express from "express";
import { paymentAuth } from "../middlewares/paymentAuth.middleware.js";
import {
  createUpiPayment,
  logUpiPayment,
  uploadPaymentProof,
  createRazorpayOrder,
  verifyRazorpaySignature,
} from "../controllers/payment.controller.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

// POST /api/payment/upi - calculate amount for lesson plan
router.post("/upi", paymentAuth, createUpiPayment);

// POST /api/payment/upi/log - store payment transaction in DB
router.post("/upi/log", paymentAuth, logUpiPayment);

// POST /api/payment/upload-proof - upload payment proof image
router.post(
  "/upload-proof",
  paymentAuth,
  upload.single("paymentImage"),
  uploadPaymentProof
);

// RAZORPAY ROUTES
router.post("/razorpay/order", paymentAuth, createRazorpayOrder);
router.post("/razorpay/verify", paymentAuth, verifyRazorpaySignature);

export default router;
