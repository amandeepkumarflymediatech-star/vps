import Payment from "../models/payment.js";
import { sendEmail } from "../config/mailer.js";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import Razorpay from "razorpay";
import crypto from "crypto";
import mongoose from "mongoose";
import { StandardCheckoutClient, Env, StandardCheckoutPayRequest } from '@phonepe-pg/pg-sdk-node';

// In-memory lock for race condition handling (use Redis in production)
const paymentLocks = new Map();

// Lock helper to prevent race conditions
const acquireLock = async (key, timeout = 10000) => {
  const start = Date.now();
  while (paymentLocks.has(key)) {
    if (Date.now() - start > timeout) {
      return false;
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  paymentLocks.set(key, true);
  return true;
};

const releaseLock = (key) => {
  paymentLocks.delete(key);
};

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

import Class from "../models/class.js";
import Course from "../models/course.js";
import CoursePackage from "../models/package.js";
import Enrollment from "../models/enrollment.js";

const grantAccess = async (userId, itemId, itemType) => {
  try {
    let classesToEnroll = [];

    if (itemType === "CLASS") {
      classesToEnroll.push(itemId);
    } else if (itemType === "COURSE") {
      // Find all classes for this course
      const classes = await Class.find({ courseId: itemId });
      classesToEnroll = classes.map((c) => c._id);
    } else if (itemType === "PACKAGE") {
      const pkg = await CoursePackage.findById(itemId).populate("courses");
      if (pkg && pkg.courses) {
        const courseIds = pkg.courses.map((c) => c._id);
        const classes = await Class.find({ courseId: { $in: courseIds } });
        classesToEnroll = classes.map((c) => c._id);
      }
    }

    for (const classId of classesToEnroll) {
      // Idempotent enrollment
      await Class.findByIdAndUpdate(classId, {
        $addToSet: { enrolledStudents: userId },
      });
      await Enrollment.updateOne(
        { userId, classId },
        { $setOnInsert: { userId, classId } },
        { upsert: true },
      );
    }
  } catch (error) {
    console.error("Error granting access:", error);
  }
};

// POST /api/payment/upi/log
export const logUpiPayment = async (req, res) => {
  try {
    const {
      tutorId,
      amount,
      lessons,
      status,
      clientPaymentId,
      itemId,
      itemType,
      packageId,
    } = req.body;

    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const paymentId = clientPaymentId || uuidv4();
    const payment = await Payment.findOneAndUpdate(
      { clientPaymentId: paymentId },
      {
        $setOnInsert: {
          clientPaymentId: paymentId,
          userId,
          tutorId,
          packageId,
          amount,
          lessons,
          itemId, // Store what was bought
          itemType, // CLASS, COURSE, PACKAGE
          method: "UPI",
          status: status || "PENDING",
        },
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      },
    );

    // If payment is SUCCESS/COMPLETED, grant access immediately
    if (payment.status === "SUCCESS" || payment.status === "COMPLETED") {
      if (itemId && itemType) {
        await grantAccess(userId, itemId, itemType);
      }
    }

    res.status(201).json({ success: true, payment });
  } catch (err) {
    console.error("logUpiPayment error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Logs a payment attempt/result into the database
// export const logUpiPayment = async (req, res) => {
//   try {
//     const userId = req.user?.id || req.user?._id;
//     const { tutorId, amount, status, lessons, txnId } = req.body;

//     if (!userId) {
//       return res.status(401).json({ message: "Unauthorized: user not found" });
//     }

//     if (!amount) {
//       return res.status(400).json({ message: "Amount is required" });
//     }

//     const normalizedStatus =
//       status === "FAILED" || status === "failed"
//         ? "FAILED"
//         : status === "PENDING" || status === "pending"
//         ? "PENDING"
//         : "SUCCESS";

//     const payment = await Payment.create({
//       userId,
//       tutorId,
//       amount,
//       lessons,
//       txnId,
//       status: normalizedStatus,
//     });

//     return res.status(201).json({ payment });
//   } catch (err) {
//     console.error("logUpiPayment error:", err);
//     return res.status(500).json({ message: "Failed to log payment" });
//   }
// };

// POST /api/payment/upload-proof
// export const uploadPaymentProof = async (req, res) => {
//   try {
//     const userId = req.user?.id || req.user?._id;
//     const { paymentId } = req.body;

//     if (!userId) {
//       return res.status(401).json({ message: "Unauthorized: user not found" });
//     }

//     if (!paymentId) {
//       return res.status(400).json({ message: "Payment ID is required" });
//     }

//     if (!req.file) {
//       return res.status(400).json({ message: "Payment image is required" });
//     }

//     // Update payment with image URL
//     const payment = await Payment.findOneAndUpdate(
//       { _id: paymentId, userId },
//       { paymentImage: req.file.path }, // Cloudinary URL
//       { new: true }
//     );

//     if (!payment) {
//       return res.status(404).json({ message: "Payment not found" });
//     }

//     // Send notification email to admin
//     const adminEmail = process.env.ADMIN_EMAIL || "admin@yopmail.com";
//     await sendEmail(
//       adminEmail,
//       "New Payment Proof Uploaded",
//       `New payment proof uploaded by user ${userId}. Payment ID: ${paymentId}, Amount: ₹${payment.amount}`
//     );

//     return res.status(200).json({
//       message: "Payment proof uploaded successfully",
//       payment
//     });
//   } catch (err) {
//     console.error("uploadPaymentProof error:", err);
//     return res.status(500).json({ message: "Failed to upload payment proof" });
//   }
// };

// GET /api/payment/admin/all - Get all payments for admin
export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find({})
      .populate("userId", "name email")
      .populate("tutorId", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({ payments });
  } catch (err) {
    console.error("getAllPayments error:", err);
    return res.status(500).json({ message: "Failed to fetch payments" });
  }
};

// PUT /api/payment/admin/verify/:paymentId - Verify payment (admin only)
export const verifyPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { status } = req.body; // "SUCCESS" or "FAILED"

    const payment = await Payment.findByIdAndUpdate(
      paymentId,
      { status },
      { new: true },
    ).populate("userId", "name email");

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    if (status === "SUCCESS" || status === "COMPLETED") {
      if (payment.itemId && payment.itemType) {
        await grantAccess(payment.userId._id, payment.itemId, payment.itemType);
      }
    }

    return res.status(200).json({
      message: `Payment ${status.toLowerCase()} successfully`,
      payment,
    });
  } catch (err) {
    console.error("verifyPayment error:", err);
    return res.status(500).json({ message: "Failed to verify payment" });
  }
};

export const uploadPaymentProof = async (req, res) => {
  try {
    const { paymentId } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image required" });
    }

    const payment = await Payment.findById(paymentId).populate("packageId");
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    payment.proofImage = req.file.path;
    payment.status = "UNDER_REVIEW";
    payment.lessons = payment?.packageId.lessons || 0;
    await payment.save();

    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ================= PHONEPE INTEGRATION =================

const phonePeClientId = process.env.PHONEPE_CLIENT_ID || "SANDBOX_CLIENT_ID";
const phonePeClientSecret = process.env.PHONEPE_CLIENT_SECRET || process.env.PHONEPE_SALT_KEY || "SANDBOX_SALT_KEY"; 
const phonePeClientVersion = process.env.PHONEPE_SALT_INDEX || 1;
const phonePeEnv = process.env.NODE_ENV === "production" ? Env.PRODUCTION : Env.SANDBOX;

let phonePeClient;
try {
  phonePeClient = StandardCheckoutClient.getInstance(
    phonePeClientId, 
    phonePeClientSecret, 
    phonePeClientVersion, 
    phonePeEnv
  );
} catch (e) {
  console.error("Failed to initialize PhonePe SDK", e);
}

/**
 * PhonePe Webhook Handler
 * POST /api/payment/phonepe/callback
 */
export const phonepeWebhook = async (req, res) => {
  try {
    const authorizationHeaderData = req.headers['x-verify'] || req.headers['authorization'];
    const phonepeS2SCallbackResponseBodyString = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);

    console.log("Webhook headers:", req.headers);
    console.log("Webhook body:", phonepeS2SCallbackResponseBodyString);

    let callbackResponse;
    try {
      callbackResponse = phonePeClient.validateCallback(
        "", // no username configured
        "", // no password configured
        authorizationHeaderData,
        phonepeS2SCallbackResponseBodyString 
      );
    } catch (e) {
      console.error("Checksum validation failed!", e.message);
      return res.status(401).send("Invalid signature");
    }

    const payload = callbackResponse.payload || req.body;
    const data = payload?.payload || payload;
    const transactionId = data?.orderId || callbackResponse.payload?.orderId;
    const state = data?.state || callbackResponse.payload?.state;

    if (!transactionId) {
      return res.status(400).send("Invalid webhook");
    }

    const updateData = {
      state,
      paymentResponse: payload,
    };

    if (state === "COMPLETED") {
      updateData.status = "SUCCESS";
      updateData.transactionId = data?.transactionId || callbackResponse.payload?.transactionId;
    } else if (state === "FAILED") {
      updateData.status = "FAILED";
    }

    const payment = await Payment.findOneAndUpdate(
      {
        clientPaymentId: transactionId,
        status: { $nin: ["SUCCESS"] },
      },
      { $set: updateData },
      { new: true },
    );

    // 🎁 Grant access
    if (payment && state === "COMPLETED" && payment.packageId) {
      await grantAccess(payment.userId, payment.packageId, "PACKAGE");
    }

    res.status(200).send("OK");
  } catch (err) {
    console.error("WEBHOOK ERROR:", err.message);
    res.status(500).send("Error");
  }
};

/**
 * Initiates a PhonePe payment
 * POST /api/payment/phonepe/initiate
 */
export const initiatePhonePePayment = async (req, res) => {
  try {
    const { amount, tutorId, packageId, lessons } = req.body;
    const userId = req.user?.id || req.user?._id || "guest_user";

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount",
      });
    }

    // 🆔 Generate Unique Transaction ID
    const merchantTransactionId = `MT_${Date.now()}`;

    // 💾 Save initial payment (PENDING)
    await Payment.create({
      clientPaymentId: merchantTransactionId,
      userId,
      tutorId,
      packageId,
      amount,
      lessons,
      method: "PHONEPE",
      status: "PENDING",
    });

    const redirectUrl = process.env.CLIENT_URL ? `${process.env.CLIENT_URL}/payment-success` : "http://localhost:3000/payment-success";

    // 📦 Build SDK Request
    const request = StandardCheckoutPayRequest.builder()
      .merchantOrderId(merchantTransactionId)
      .amount(amount * 100) // Paise
      .redirectUrl(redirectUrl)
      .build();

    // 📡 SDK API Call
    const response = await phonePeClient.pay(request);

    // ✅ Success Condition
    if (response && response.redirectUrl) {
      return res.json({
        success: true,
        redirectUrl: response.redirectUrl,
        merchantTransactionId,
      });
    }

    return res.status(400).json({
      success: false,
      message: "Payment initiation failed securely.",
      response
    });
  } catch (err) {
    console.error("INIT ERROR:", err.message);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * Check Payment Status
 * GET /api/payment/phonepe/checkout-status/:transactionId
 */
export const checkPaymentStatus = async (req, res) => {
  try {
    const { transactionId } = req.params;

    // 📡 SDK Status Check
    const response = await phonePeClient.getOrderStatus(transactionId);
    if (!response) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    const state = response.state || response?.data?.state;

    const updateData = {
      state,
      paymentResponse: response,
    };

    // ✅ SUCCESS
    if (state === "COMPLETED") {
      updateData.status = "SUCCESS";
      updateData.transactionId = response.transactionId || response?.data?.transactionId;
    }
    // ❌ FAILED
    else if (state === "FAILED") {
      updateData.status = "FAILED";
    }

    // 🔄 Update DB safely
    const payment = await Payment.findOneAndUpdate(
      {
        clientPaymentId: transactionId,
        status: { $nin: ["SUCCESS"] },
      },
      { $set: updateData },
      { new: true },
    );

    // 🎁 Grant access only once
    if (payment && state === "COMPLETED" && payment.packageId) {
      await grantAccess(payment.userId, payment.packageId, "PACKAGE");
    }

    return res.json(response);
  } catch (err) {
    console.error("STATUS ERROR:", err.message);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// export const checkPaymentStatus = async (req, res) => {
//   try {
//     const { transactionId } = req.params;
//     const tokenData = await getPhonePeAuthToken();
//     const accessToken = tokenData.token_data.access_token;
//     const url = process.env.PHONEPE_CHECKOUT_STATUS + `/${transactionId}/status`;
//     const response = await axios.get(url, {
//       headers: {
//         Authorization: `O-Bearer ${accessToken}`,
//       },
//     });

//     const paymentData = response.data;
//     const state = paymentData?.state || paymentData?.data?.state;

//     // Securely update the database if the payment was successful
//     if (state === "COMPLETED") {
//       const payment = await Payment.findOneAndUpdate(
//         {
//           clientPaymentId: transactionId,
//           status: { $nin: ["SUCCESS", "COMPLETED"] },
//         },
//         {
//           $set: {
//             status: "SUCCESS",
//             transactionId: paymentData?.data?.transactionId,
//           },
//         },
//         { new: true }
//       );

//       // Grant access if package was purchased
//       if (payment && payment.packageId) {
//         await grantAccess(payment.userId, payment.packageId, "PACKAGE");
//       }
//     } else if (state === "FAILED") {
//       await Payment.findOneAndUpdate(
//         { clientPaymentId: transactionId },
//         { $set: { status: "FAILED" } }
//       );
//     }

//     return res.json(paymentData);
//   } catch (err) {
//     console.error("STATUS ERROR:", err.response?.data || err.message);
//     res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };
export const fetchPhonePeAuthTokenRoute = async (req, res) => {
  const result = await getPhonePeAuthToken();
  if (result.success) {
    return res.status(200).json(result);
  } else {
    return res.status(500).json(result);
  }
};