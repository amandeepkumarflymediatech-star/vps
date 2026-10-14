// const express = require("express");
// const router = express.Router();

// const Payment = require("../models/payment");
// const User = require("../models/userModel");
// const { auth, role } = require("../middlewares/auth.middleware");
// const sendMail = require("../utils/sendmail");

// // LIST PAYMENTS
// router.get("/", auth, role("ADMIN"), async (req, res) => {
//   try {
//     const payments = await Payment.find()
//       .populate("userId", "name email role")
//       .sort({ createdAt: -1 })
//       .lean();

//     res.render("payments/list", { payments });
//   } catch (err) {
//     console.error("Admin payments list error:", err);
//     res.status(500).render("layouts/error", {
//       message: "Failed to load payments",
//       path: req.originalUrl,
//     });
//   }
// });

// // VIEW SINGLE PAYMENT
// router.get("/:id", auth, role("ADMIN"), async (req, res) => {
//   try {
//     const payment = await Payment.findById(req.params.id)
//       .populate("userId", "name email role isPaymentDone")
//       .lean();

//     if (!payment) {
//       return res.status(404).render("layouts/error", {
//         message: "Payment not found",
//         path: req.originalUrl,
//       });
//     }

//     res.render("payments/view", { payment });
//   } catch (err) {
//     console.error("Admin payment view error:", err);
//     res.status(500).render("layouts/error", {
//       message: "Failed to load payment",
//       path: req.originalUrl,
//     });
//   }
// });

// // VERIFY / UPDATE PAYMENT STATUS & USER.isPaymentDone
// router.post("/:id/verify", auth, role("ADMIN"), async (req, res) => {
//   const { status } = req.body; // PENDING | VERIFIED | REJECTED

//   if (!status || !["PENDING", "APPROVED", "REJECTED"].includes(status)) {
//     return res.status(400).json({ message: "Invalid status" });
//   }

//   try {
//     const payment = await Payment.findById(req.params.id);
//     if (!payment) {
//       return res.status(404).json({ message: "Payment not found" });
//     }

//     payment.status = status;
//     await payment.save();

//     // When verified, mark user.isPaymentDone = true and send activation email
//     if (status === "APPROVED" && payment.userId) {
//       const user = await User.findByIdAndUpdate(
//         payment.userId,
//         { $set: { isPaymentDone: true } },
//         { new: true }
//       );

//       // Send activation email
//       if (user && user.email) {
//         try {
//           await sendMail({
//             to: user.email,
//             subject: "Your account has been activated",
//             html: `
//               <p>Hi ${user.name || "there"},</p>
//               <p>Your payment has been verified and your account is now <strong>activated</strong>.</p>
//               <p>You can now log in and start viewing your courses.</p>
//               <p>If you did not make this payment, please contact support immediately.</p>
//             `,
//           });
//         } catch (mailErr) {
//           console.error("Payment activation email error:", mailErr);
//           // Do not fail the API just because email failed
//         }
//       }
//     }

//     return res.json({
//       success: true,
//       message: "Payment updated successfully",
//     });
//   } catch (err) {
//     console.error("Admin payment verify error:", err);
//     return res.status(500).json({ message: "Update failed" });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();

const Payment = require("../models/payment");
const User = require("../models/userModel");
const { auth, role } = require("../middlewares/auth.middleware");
const sendMail = require("../utils/sendmail");

// ================= LIST PAYMENTS =================
router.get("/", auth, role("ADMIN"), async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);
    const skip = (page - 1) * limit;
    const status = req.query.status ? req.query.status.trim() : "";
    const search = req.query.search ? req.query.search.trim() : "";
    const startDate = req.query.startDate ? req.query.startDate.trim() : "";
    const endDate = req.query.endDate ? req.query.endDate.trim() : "";
    const minAmount = req.query.minAmount ? req.query.minAmount.trim() : "";
    const maxAmount = req.query.maxAmount ? req.query.maxAmount.trim() : "";
    const sortBy = req.query.sortBy ? req.query.sortBy.trim() : "date"; // 'date' | 'amount'
    const sortOrder = req.query.sortOrder ? req.query.sortOrder.trim() : "desc"; // 'desc' | 'asc'

    const filter = {};
    if (status) {
      filter.status = status;
    }

    // Filter by Date Range
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) {
        const start = new Date(startDate);
        if (!isNaN(start.getTime())) {
          start.setHours(0, 0, 0, 0);
          filter.createdAt.$gte = start;
        }
      }
      if (endDate) {
        const end = new Date(endDate);
        if (!isNaN(end.getTime())) {
          end.setHours(23, 59, 59, 999);
          filter.createdAt.$lte = end;
        }
      }
      if (Object.keys(filter.createdAt).length === 0) {
        delete filter.createdAt;
      }
    }

    // Filter by Amount Range
    if (minAmount || maxAmount) {
      filter.amount = {};
      if (minAmount && !isNaN(Number(minAmount))) {
        filter.amount.$gte = Number(minAmount);
      }
      if (maxAmount && !isNaN(Number(maxAmount))) {
        filter.amount.$lte = Number(maxAmount);
      }
      if (Object.keys(filter.amount).length === 0) {
        delete filter.amount;
      }
    }

    if (search) {
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const searchRegex = new RegExp(escaped, "i");

      // Match users by name, email, or phone
      const matchingUsers = await User.find({
        $or: [
          { name: { $regex: searchRegex } },
          { email: { $regex: searchRegex } },
          { phone: { $regex: searchRegex } },
        ],
      })
        .select("_id")
        .lean();

      const matchingUserIds = matchingUsers.map((u) => u._id);

      const orConditions = [
        { clientPaymentId: { $regex: searchRegex } },
        { upiRefNo: { $regex: searchRegex } },
        { method: { $regex: searchRegex } },
      ];

      // If search query is a number, also match exact amount
      if (!isNaN(Number(search)) && Number(search) >= 0) {
        orConditions.push({ amount: Number(search) });
      }

      if (matchingUserIds.length > 0) {
        orConditions.push({ userId: { $in: matchingUserIds } });
      }

      filter.$or = orConditions;
    }

    // Determine Sort
    let sortObj = { createdAt: -1 };
    if (sortBy === "amount") {
      sortObj = { amount: sortOrder === "asc" ? 1 : -1, createdAt: -1 };
    } else if (sortBy === "date") {
      sortObj = { createdAt: sortOrder === "asc" ? 1 : -1 };
    }

    const totalPayments = await Payment.countDocuments(filter);
    const payments = await Payment.find(filter)
      .populate("userId", "name email phone role")
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .lean();

    return res.render("payments/list", {
      payments,
      currentPage: page,
      totalPages: Math.max(Math.ceil(totalPayments / limit) || 1, 1),
      totalPayments,
      limit,
      currentStatus: status || "",
      search,
      startDate,
      endDate,
      minAmount,
      maxAmount,
      sortBy,
      sortOrder,
    });
  } catch (err) {
    console.error("Admin payments list error:", err);
    return res.status(500).render("layouts/error", {
      message: "Failed to load payments",
      path: req.originalUrl,
    });
  }
});

// ================= VIEW SINGLE PAYMENT =================
router.get("/:id", auth, role("ADMIN"), async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate("userId", "name email role isPaymentDone")
      .lean();

    if (!payment) {
      return res.status(404).render("layouts/error", {
        message: "Payment not found",
        path: req.originalUrl,
      });
    }

    return res.render("payments/view", { payment });
  } catch (err) {
    console.error("Admin payment view error:", err);
    return res.status(500).render("layouts/error", {
      message: "Failed to load payment",
      path: req.originalUrl,
    });
  }
});

// Helper handler to modify payment (amount, date, status)
async function handlePaymentUpdate(req, res, paymentId) {
  const { status, amount, date, createdAt } = req.body;
  const isAjax = req.xhr || req.headers.accept?.includes("json") || req.is("json");

  try {
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      if (isAjax) {
        return res.status(404).json({ success: false, message: "Payment not found" });
      }
      return res.status(404).render("layouts/error", {
        message: "Payment not found",
        path: req.originalUrl,
      });
    }

    // Modify amount if provided
    if (amount !== undefined && amount !== "" && !isNaN(Number(amount))) {
      payment.amount = Number(amount);
    }

    // Modify date if provided
    const targetDate = date || createdAt;
    if (targetDate) {
      const parsedDate = new Date(targetDate);
      if (!isNaN(parsedDate.getTime())) {
        payment.createdAt = parsedDate;
      }
    }

    // Modify status if provided
    let statusChangedToSuccess = false;
    if (status && ["PENDING", "SUCCESS", "REJECTED"].includes(status)) {
      if (payment.status !== "SUCCESS" && status === "SUCCESS") {
        statusChangedToSuccess = true;
      }
      payment.status = status;
    }

    await payment.save();

    // ✅ SUCCESS → activate user & send mail
    if (statusChangedToSuccess && payment.userId) {
      const user = await User.findByIdAndUpdate(
        payment.userId,
        { $set: { isPaymentDone: true } },
        { new: true },
      );

      // 📧 Send activation email
      if (user?.email) {
        try {
          await sendMail({
            to: user.email,
            subject: "Payment SUCCESS – Account Activated",
            html: `
                <p>Hi ${user.name || "there"},</p>
                <p>Your payment of <strong>₹${payment.amount}</strong> has been successfully verified.</p>
                <p>Your account is now active. You can start your classes.</p>
                <p>Thank you!</p>
              `,
          });
        } catch (mailErr) {
          console.error("Payment activation email error:", mailErr);
        }
      }
    }

    if (isAjax) {
      return res.status(200).json({
        success: true,
        message: "Payment updated successfully",
        payment,
        path: "/admin/payments",
      });
    }

    return res.redirect(`/admin/payments/${payment._id}`);
  } catch (err) {
    console.error("Admin payment update error:", err);
    if (isAjax) {
      return res.status(500).json({ success: false, message: "Payment update failed: " + err.message });
    }
    return res.status(500).render("layouts/error", {
      message: "Payment update failed",
      path: req.originalUrl,
    });
  }
}

// ================= UPDATE PAYMENT (AMOUNT, DATE, STATUS) =================
router.post("/:id/update", auth, role("ADMIN"), async (req, res) => {
  return handlePaymentUpdate(req, res, req.params.id);
});

// Legacy / alias for verify
router.post("/:id/verify", auth, role("ADMIN"), async (req, res) => {
  return handlePaymentUpdate(req, res, req.params.id);
});

// Alias for generic update-status
router.post("/update-status", auth, role("ADMIN"), async (req, res) => {
  const paymentId = req.body.id || req.body.paymentId;
  if (!paymentId) {
    return res.status(400).json({ success: false, message: "Payment ID required" });
  }
  return handlePaymentUpdate(req, res, paymentId);
});

module.exports = router;
