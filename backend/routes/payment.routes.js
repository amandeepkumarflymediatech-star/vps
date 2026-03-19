import express from "express";
import { paymentAuth } from "../middlewares/paymentAuth.middleware.js";
import {
  createUpiPayment,
  logUpiPayment,
  uploadPaymentProof,
  getAllPayments,
  verifyPayment,
  initiatePhonePePayment,
  checkPaymentStatus,
  fetchPhonePeAuthTokenRoute,
  phonepeWebhook
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

// ADMIN ROUTES
router.get("/admin/all", paymentAuth, getAllPayments);
router.put("/admin/verify/:paymentId", paymentAuth, verifyPayment);


// PHONEPE ROUTES (Card/Netbanking/Wallet)
router.post("/phonepe/initiate", paymentAuth, initiatePhonePePayment);
router.post("/phonepe/callback", phonepeWebhook);
router.get("/phonepe/checkout-status/:transactionId", paymentAuth, checkPaymentStatus);

// PHONEPE AUTH TOKEN
router.get("/phonepe/auth-token", paymentAuth, fetchPhonePeAuthTokenRoute);

export default router;
