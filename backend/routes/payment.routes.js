import express from "express";
import { paymentAuth } from "../middlewares/paymentAuth.middleware.js";
import { createUpiPayment } from "../controllers/payment.controller.js";

const router = express.Router();

// POST /api/payment/upi
router.post("/upi", paymentAuth, createUpiPayment);

export default router;
