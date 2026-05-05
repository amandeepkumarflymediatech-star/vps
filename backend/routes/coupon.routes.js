import express from "express";
import Coupon from "../models/Coupon.js";

const router = express.Router();

// POST /api/coupons/validate - Check if a coupon is valid
router.post("/validate", async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ message: "Coupon code is required" });

    const coupon = await Coupon.findOne({ 
      code: code.toUpperCase(),
      isActive: true,
      expiryDate: { $gt: new Date() }
    });

    if (!coupon) {
      return res.status(404).json({ message: "Invalid or expired coupon code" });
    }

    if (coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ message: "Coupon usage limit reached" });
    }

    res.status(200).json({
      success: true,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      code: coupon.code
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
