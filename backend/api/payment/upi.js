import express from "express";
const router = express.Router();

router.post("/upi/initiate", async (req, res) => {
  const { userId, amount, txnId } = req.body;

  if (!userId || !amount || !txnId) {
    return res.status(400).json({ success: false, message: "All fields required" });
  }

  // Save to DB (or in-memory for testing)
  console.log("Payment recorded:", { userId, amount, txnId, status: "PENDING" });

  return res.json({ success: true, message: "Payment recorded. Verification pending." });
});

export default router;
