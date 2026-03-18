import express from "express";
import { paymentAuth } from "../middlewares/paymentAuth.middleware.js";
import {
  createUpiPayment,
  logUpiPayment,
  uploadPaymentProof,
  initiatePhonePePayment,
  phonePeCallback,
  initiatePhonePeUpiPayment,
  checkUpiPaymentStatus,
  fetchPhonePeAuthTokenRoute,
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

// PHONEPE ROUTES (Card/Netbanking/Wallet)
router.post("/phonepe/initiate", paymentAuth, initiatePhonePePayment);
 
router.post("/phonepe/callback", phonePeCallback);

// PHONEPE UPI ROUTES (Direct UPI payment)
router.post("/phonepe/upi", paymentAuth, initiatePhonePeUpiPayment);
router.get("/phonepe/status/:merchantTransactionId", paymentAuth, checkUpiPaymentStatus);

// PHONEPE AUTH TOKEN
router.get("/phonepe/auth-token", paymentAuth, fetchPhonePeAuthTokenRoute);

export default router;
