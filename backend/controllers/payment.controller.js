import Payment from "../models/Payment.js";

// Map lesson number to price
const lessonPricing = {
  8: 1,
  12: 3530,
  16: 4720,
};

// POST /api/payment/upi
export const createUpiPayment = (req, res) => {
  try {
    const { lessons } = req.body;

    if (!lessons || !lessonPricing[lessons]) {
      return res.status(400).json({ message: "Invalid lesson plan" });
    }

    const amount = lessonPricing[lessons];

    // This endpoint only calculates amount for a given lesson plan
    // Actual transaction logging happens in logUpiPayment

    return res.status(200).json({ amount, lessons });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// POST /api/payment/upi/log
// Logs a payment attempt/result into the database
export const logUpiPayment = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const { tutorId, amount, status, lessons, txnId } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: user not found" });
    }

    if (!amount) {
      return res.status(400).json({ message: "Amount is required" });
    }

    const normalizedStatus =
      status === "FAILED" || status === "failed"
        ? "FAILED"
        : status === "PENDING" || status === "pending"
        ? "PENDING"
        : "SUCCESS";

    const payment = await Payment.create({
      userId,
      tutorId,
      amount,
      lessons,
      txnId,
      status: normalizedStatus,
    });

    return res.status(201).json({ payment });
  } catch (err) {
    console.error("logUpiPayment error:", err);
    return res.status(500).json({ message: "Failed to log payment" });
  }
};
