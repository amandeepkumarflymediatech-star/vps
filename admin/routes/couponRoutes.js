const express = require("express");
const router = express.Router();
const Coupon = require("../models/Coupon");
const { auth, role } = require("../middlewares/auth.middleware");

// GET /admin/coupons - List all coupons
router.get("/", auth, role("ADMIN"), async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.render("coupons/index", { coupons });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// GET /admin/coupons/add - Show add coupon form
router.get("/add", auth, role("ADMIN"), (req, res) => {
  res.render("coupons/add");
});

// POST /admin/coupons/add - Create a new coupon
router.post("/add", auth, role("ADMIN"), async (req, res) => {
  try {
    const { code, discountType, discountValue, expiryDate, usageLimit } = req.body;
    
    // Check if code already exists
    const existing = await Coupon.findOne({ code: code.toUpperCase() });
    if (existing) {
      return res.render("coupons/add", { error: "Coupon code already exists" });
    }

    await Coupon.create({
      code,
      discountType,
      discountValue,
      expiryDate,
      usageLimit,
    });

    res.redirect("/admin/coupons");
  } catch (err) {
    console.error(err);
    res.render("coupons/add", { error: "Failed to create coupon" });
  }
});

// GET /admin/coupons/edit/:id - Show edit coupon form
router.get("/edit/:id", auth, role("ADMIN"), async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.redirect("/admin/coupons");
    res.render("coupons/edit", { coupon });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// POST /admin/coupons/edit/:id - Update a coupon
router.post("/edit/:id", auth, role("ADMIN"), async (req, res) => {
  try {
    const { code, discountType, discountValue, expiryDate, usageLimit, isActive } = req.body;
    await Coupon.findByIdAndUpdate(req.params.id, {
      code: code.toUpperCase(),
      discountType,
      discountValue,
      expiryDate,
      usageLimit,
      isActive: isActive === "on",
    });
    res.redirect("/admin/coupons");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// POST /admin/coupons/delete/:id - Delete a coupon
router.post("/delete/:id", auth, role("ADMIN"), async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.redirect("/admin/coupons");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// POST /admin/coupons/toggle/:id - Toggle active status
router.post("/toggle/:id", auth, role("ADMIN"), async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (coupon) {
      coupon.isActive = !coupon.isActive;
      await coupon.save();
    }
    res.redirect("/admin/coupons");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
