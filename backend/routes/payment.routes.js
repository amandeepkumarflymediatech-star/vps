import express from "express";
import { paymentAuth } from "../middlewares/paymentAuth.middleware.js";
import { createUpiPayment, logUpiPayment } from "../controllers/payment.controller.js";

const router = express.Router();

// POST /api/payment/upi - calculate amount for lesson plan
router.post("/upi", paymentAuth, createUpiPayment);

// POST /api/payment/upi/log - store payment transaction in DB
router.post("/upi/log", paymentAuth, logUpiPayment);

export default router;
