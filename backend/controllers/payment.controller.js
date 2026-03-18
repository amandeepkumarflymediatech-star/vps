import Payment from "../models/payment.js";
import { sendEmail } from "../config/mailer.js";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import Razorpay from "razorpay";
import crypto from "crypto";
import mongoose from "mongoose";

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

const generateChecksum = (payload, endpoint, saltKey, saltIndex) => {
  const string = payload + endpoint + saltKey;
  const sha256 = crypto.createHash("sha256").update(string).digest("hex");
  return `${sha256}###${saltIndex}`;
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

/**
 * Initiates a PhonePe payment
 * POST /api/payment/phonepe/initiate
 */

// export const initiatePhonePePayment = async (req, res) => {
//   try {
//     // 1️⃣ Get OAuth Token
//     const tokenData = await getPhonePeAuthToken();

//     if (!tokenData.success) {
//       return res.status(500).json({
//         success: false,
//         message: "Failed to generate PhonePe Auth Token",
//       });
//     }

//     const accessToken = tokenData.token_data.access_token;

//     // 2️⃣ Get request data
//     const { amount, tutorId, packageId, lessons } = req.body;
//     const userId = req.user?.id || req.user?._id;

//     if (!userId) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized",
//       });
//     }

//     if (!amount || amount <= 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid amount",
//       });
//     }

//     // 3️⃣ Env validation
//     if (!process.env.PHONEPE_MERCHANT_ID) {
//       return res.status(500).json({
//         success: false,
//         message: "PhonePe Merchant ID not configured",
//       });
//     }

//     // 4️⃣ Generate IDs
//     // const merchantTransactionId = `MT${Date.now()}${Math.floor(
//     //   Math.random() * 1000
//     // )}`;

//     // const merchantUserId = `MUID${userId.toString().slice(0, 10)}`;

//     // // 5️⃣ Create DB entry (PENDING)
//     // await Payment.create({
//     //   clientPaymentId: merchantTransactionId,
//     //   userId,
//     //   tutorId,
//     //   packageId,
//     //   amount,
//     //   lessons,
//     //   method: "PHONEPE",
//     //   status: "PENDING",
//     // });

//     // // 6️⃣ Create PhonePe request payload (NO base64)
//     // const payload = { 
//     //   merchantId: process.env.PHONEPE_MERCHANT_ID,
//     //   merchantTransactionId,
//     //   merchantOrderId:'M23XIV1J8JNND_2603171923',
//     //   merchantUserId,
//     //   amount: amount * 100, // paise
//     //   redirectUrl: process.env.PHONEPE_REDIRECT_URL,
//     //   callbackUrl: process.env.PHONEPE_CALLBACK_URL,
//     //   redirectMode: "POST",
//     //   paymentInstrument: {
//     //     type: "PAY_PAGE",
//     //   },
//     // };

//     // // 7️⃣ API Call (NEW FLOW)
//     // const response = await axios({
//     //   method: "POST",
//     //   url: "https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/pay",
//     //   headers: {
//     //     "Content-Type": "application/json",
//     //     Authorization: `O-Bearer ${accessToken}`,
//     //   },
//     //   data: payload,
//     // });



//     const requestHeaders = {
//       "Content-Type": "application/json",
//       "Authorization": `O-Bearer ${accessToken}`
//     };

//     const requestBody = {
//       "amount": 1000,
//       "expireAfter": 1200,
//       "metaInfo": {
//         "udf1": "additional-information-1",
//         "udf2": "additional-information-2",
//         "udf3": "additional-information-3",
//         "udf4": "additional-information-4",
//         "udf5": "additional-information-5",
//         "udf6": "additional-information-6",
//         "udf7": "additional-information-7",
//         "udf8": "additional-information-8",
//         "udf9": "additional-information-9",
//         "udf10": "additional-information-10",
//         "udf11": "additional-information-11",
//         "udf12": "additional-information-12",
//         "udf13": "additional-information-13",
//         "udf14": "additional-information-14",
//         "udf15": "additional-information-15"
//       },
//       "paymentFlow": {
//         "type": "PG_CHECKOUT",
//         "message": "Payment message used for collect requests",
//         "merchantUrls": {
//           "redirectUrl": ""
//         }
//       },
//       "merchantOrderId": "M23XIV1J8JNND_2603171923"
//     };

//     const options = {
//       method: 'POST',
//       url: 'https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/pay',
//       headers: requestHeaders,
//       data: requestBody
//     };
//     const response = await axios.post(options.url, options.data, { headers: options.headers })
//     // 8️⃣ Handle response
//     if (response.data?.success) {
//       const redirectUrl =
//         response.data.data.instrumentResponse.redirectInfo.url;

//       return res.status(200).json({
//         success: true,
//         redirectUrl,
//       });
//     } else {
//       return res.status(400).json({
//         success: false,
//         message: response.data?.message || "Payment initiation failed",
//       });
//     }
//   } catch (err) {
//     console.error("=== PHONEPE V2 ERROR ===");
//     console.error("Status:", err.response?.status);
//     console.error(
//       "Response:",
//       JSON.stringify(err.response?.data, null, 2)
//     );
//     console.error("Message:", err.message);

//     return res.status(500).json({
//       success: false,
//       message: err.response?.data?.message || err.message,
//     });
//   }
// };
// export const initiatePhonePePayment = async (req, res) => {
//   try {
//     let tokendata = await getPhonePeAuthToken()
//     if (!tokendata.success) {
//       return res.status(500).json({
//         success: false,
//         message: "Failed to generate PhonePe Auth Token",
//       });
//     }
//     const accessToken = tokendata.token_data.access_token;
//     const { amount, tutorId, packageId, lessons } = req.body;
//     const userId = req.user?.id || req.user?._id;

//     if (!userId) {
//       console.error("User not authenticated, req.user:", req.user);
//       return res.status(401).json({ success: false, message: "Unauthorized" });
//     }

//     if (!amount || amount <= 0) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid amount" });
//     }

//     // Check environment variables
//     if (!process.env.PHONEPE_MERCHANT_ID || !process.env.PHONEPE_SALT_KEY) {
//       console.error("PhonePe environment variables not configured");
//       return res
//         .status(500)
//         .json({ success: false, message: "Payment gateway not configured" });
//     }

//     const merchantTransactionId = `MT${Date.now()}${Math.floor(Math.random() * 1000)}`;
//     const merchantUserId = `MUID${userId.toString().substring(0, 10)}`;

//     const payload = {
//       merchantId: process.env.PHONEPE_MERCHANT_ID,
//       merchantTransactionId: merchantTransactionId,
//       merchantOrderId: accessToken, // Fixed: merchantOrderId should typically be your order/transaction ID
//       merchantUserId: merchantUserId,
//       amount: amount * 100, // Convert to paise
//       redirectUrl: process.env.PHONEPE_REDIRECT_URL,
//       redirectMode: "POST",
//       callbackUrl: process.env.PHONEPE_CALLBACK_URL,
//       paymentInstrument: {
//         type: "PAY_PAGE",
//       },
//     };

//     const base64Payload = Buffer.from(JSON.stringify(payload)).toString(
//       "base64",
//     );
//     const checksum = generateChecksum(
//       base64Payload,
//       "/pg/v1/pay",
//       process.env.PHONEPE_SALT_KEY,
//       process.env.PHONEPE_SALT_INDEX,
//     );

//     // Create a pending payment record
//     const result = await Payment.create({
//       clientPaymentId: merchantTransactionId,
//       userId,
//       tutorId,
//       packageId,
//       amount,
//       lessons,
//       method: "PHONEPE",
//       status: "PENDING",
//     });





//     // If an OAuth token was successfully generated, attach it to the headers.
//       const requestHeaders = {
//       "Content-Type": "application/json"
//     };
//     const options = {
//       method: 'POST',
//       url: 'https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/pay',
//       headers: requestHeaders,
//       data: payload
//     };
//     if (accessToken) {
//       options.headers["Authorization"] = `O-Bearer ${accessToken}`;
//       // Some standard PhonePe APIs also use X-AUTHORIZATION metadata
//       options.headers["X-AUTHORIZATION"] = `O-Bearer ${accessToken}`;
//     }




//     const response = await axios(options);
//     console.log(response, '===========================================')
//     if (response.data?.success) {
//       const redirectUrl = response.data.data.instrumentResponse.redirectInfo.url;
//       return res.status(200).json({ success: true, redirectUrl });
//     } else {
//       return res.status(400).json({
//         success: false,
//         message: response.data?.message || "Initiation failed",
//       });
//     }
//   } catch (err) {
//     console.error("=== initiatePhonePePayment ERROR ===");
//     console.error("PhonePe API URL:", process.env.PHONEPE_API_URL);
//     console.error("Merchant ID:", process.env.PHONEPE_MERCHANT_ID);
//     console.error("PhonePe response:", JSON.stringify(err.response?.data, null, 2));
//     console.error("HTTP Status:", err.response?.status);
//     console.error("Error message:", err.message);
//     res.status(500).json({
//       success: false,
//       message: err.message || "Payment initiation failed",
//     });
//   }
// };

// ================= PHONEPE UPI PAYMENT INTEGRATION =================

/**
 * Initiates a PhonePe UPI Collect payment (direct UPI payment)
 * POST /api/payment/phonepe/upi
 */
export const initiatePhonePeUpiPayment = async (req, res) => {
  try {
    const { amount, tutorId, packageId, lessons, upiId } = req.body;
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!amount || amount <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid amount" });
    }

    if (!upiId) {
      return res
        .status(400)
        .json({ success: false, message: "UPI ID is required" });
    }

    const merchantTransactionId = `MT${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const merchantUserId = `MUID${userId.toString().substring(0, 10)}`;

    // UPI Collect payment payload
    const payload = {
      merchantId: process.env.PHONEPE_MERCHANT_ID,
      merchantTransactionId: merchantTransactionId,
      merchantUserId: merchantUserId,
      amount: amount * 100, // Convert to paise
      redirectUrl: `${process.env.PHONEPE_REDIRECT_URL}?txnId=${merchantTransactionId}`,
      redirectMode: "REDIRECT",
      callbackUrl: process.env.PHONEPE_CALLBACK_URL,
      paymentInstrument: {
        type: "UPI_COLLECT",
        upi: {
          upiId: upiId,
        },
      },
    };

    const base64Payload = Buffer.from(JSON.stringify(payload)).toString(
      "base64",
    );
    const checksum = generateChecksum(
      base64Payload,
      "/pg/v1/pay",
      process.env.PHONEPE_SALT_KEY,
      process.env.PHONEPE_SALT_INDEX,
    );

    console.log("Initiating PhonePe UPI payment with payload:", payload);

    // Create a pending payment record with optimistic locking
    const payment = await Payment.findOneAndUpdate(
      { clientPaymentId: merchantTransactionId },
      {
        $setOnInsert: {
          clientPaymentId: merchantTransactionId,
          userId,
          tutorId,
          packageId,
          amount,
          lessons,
          method: "PHONEPE_UPI",
          status: "PENDING",
          upiRefNo: upiId,
        },
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      },
    );

    const options = {
      method: "post",
      url: process.env.PHONEPE_API_URL,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
      },
      data: {
        request: base64Payload,
      },
    };

    const response = await axios(options);

    if (response.data?.success) {
      const redirectUrl =
        response.data.data?.instrumentResponse?.redirectInfo?.url ||
        `${process.env.PHONEPE_REDIRECT_URL}?txnId=${merchantTransactionId}`;
      return res.status(200).json({
        success: true,
        redirectUrl,
        merchantTransactionId,
        message: "UPI payment request sent. Please approve on your UPI app.",
      });
    } else {
      // Update payment status to failed
      await Payment.findOneAndUpdate(
        { clientPaymentId: merchantTransactionId },
        { $set: { status: "FAILED" } },
      );
      return res.status(400).json({
        success: false,
        message: response.data?.message || "UPI payment initiation failed",
      });
    }
  } catch (err) {
    console.error(
      "initiatePhonePeUpiPayment error:",
      err.response?.data || err.message,
    );
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Check UPI payment status
 * GET /api/payment/phonepe/status/:merchantTransactionId
 */
export const checkUpiPaymentStatus = async (req, res) => {
  try {
    const { merchantTransactionId } = req.params;

    if (!merchantTransactionId) {
      return res
        .status(400)
        .json({ success: false, message: "Transaction ID required" });
    }

    const saltKey = process.env.PHONEPE_SALT_KEY;
    const saltIndex = process.env.PHONEPE_SALT_INDEX;

    // Generate checksum for status check
    const string = `/pg/v1/status/${process.env.PHONEPE_MERCHANT_ID}/${merchantTransactionId}${saltKey}`;
    const sha256 = crypto.createHash("sha256").update(string).digest("hex");
    const checksum = `${sha256}###${saltIndex}`;

    const options = {
      method: "get",
      url: `${process.env.PHONEPE_BASE_URL}/pg/v1/status/${process.env.PHONEPE_MERCHANT_ID}/${merchantTransactionId}`,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
        "X-MERCHANT-ID": process.env.PHONEPE_MERCHANT_ID,
      },
    };

    const response = await axios(options);
    const paymentData = response.data;

    if (paymentData?.success && paymentData.code === "PAYMENT_SUCCESS") {
      // Use lock to prevent race conditions when updating payment
      const lockKey = `payment:${merchantTransactionId}`;
      const lockAcquired = await acquireLock(lockKey);

      if (!lockAcquired) {
        // Another process is handling this, just return current status
        const existingPayment = await Payment.findOne({
          clientPaymentId: merchantTransactionId,
        });
        return res.status(200).json({
          success: true,
          payment: existingPayment,
          message: "Payment is being processed",
        });
      }

      try {
        // Idempotent update - only update if not already SUCCESS
        const payment = await Payment.findOneAndUpdate(
          {
            clientPaymentId: merchantTransactionId,
            status: { $nin: ["SUCCESS", "COMPLETED"] },
          },
          {
            $set: {
              status: "SUCCESS",
              transactionId: paymentData.data.transactionId,
              upiRefNo: paymentData.data.upiTransactionId,
            },
          },
          { new: true },
        );

        if (payment) {
          // Grant access after successful payment
          if (payment.packageId) {
            await grantAccess(payment.userId, payment.packageId, "PACKAGE");
          }
        }

        return res.status(200).json({
          success: true,
          payment,
          status: "SUCCESS",
        });
      } finally {
        releaseLock(lockKey);
      }
    } else if (paymentData?.code === "PAYMENT_PENDING") {
      return res.status(200).json({
        success: true,
        status: "PENDING",
        message: "Payment is pending. Please check your UPI app.",
      });
    } else {
      // Update failed status
      await Payment.findOneAndUpdate(
        { clientPaymentId: merchantTransactionId },
        { $set: { status: "FAILED" } },
      );
      return res.status(200).json({
        success: false,
        status: "FAILED",
        message: paymentData?.message || "Payment failed",
      });
    }
  } catch (err) {
    console.error(
      "checkUpiPaymentStatus error:",
      err.response?.data || err.message,
    );
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Enhanced callback handler with race condition prevention
 * POST /api/payment/phonepe/callback
 */
export const phonePeCallback = async (req, res) => {
  const lockKey = null;

  try {
    const { response } = req.body;

    // 1. Verify checksum from PhonePe
    const xVerify = req.headers["x-verify"];
    const saltKey = process.env.PHONEPE_SALT_KEY;
    const saltIndex = process.env.PHONEPE_SALT_INDEX;

    const string = response + saltKey;
    const sha256 = crypto.createHash("sha256").update(string).digest("hex");
    const calculatedChecksum = `${sha256}###${saltIndex}`;

    if (xVerify !== calculatedChecksum) {
      console.warn("PhonePe checksum mismatch!");
      return res.status(200).send("OK");
    }

    // 2. Decode response
    const decodedResponse = JSON.parse(
      Buffer.from(response, "base64").toString("utf-8"),
    );
    const { success, code, data } = decodedResponse;

    if (success && code === "PAYMENT_SUCCESS") {
      const { merchantTransactionId, transactionId, upiTransactionId } = data;

      // 3. Acquire lock for this transaction to prevent race conditions
      const lockKey = `payment:${merchantTransactionId}`;
      const lockAcquired = await acquireLock(lockKey, 5000);

      if (!lockAcquired) {
        // Another callback might be processing, just acknowledge
        console.log(
          `Payment ${merchantTransactionId} is being processed by another request`,
        );
        return res.status(200).send("OK");
      }

      try {
        // 4. Idempotent update - Only update if NOT already SUCCESS
        const payment = await Payment.findOneAndUpdate(
          {
            clientPaymentId: merchantTransactionId,
            status: { $nin: ["SUCCESS", "COMPLETED"] },
          },
          {
            $set: {
              status: "SUCCESS",
              transactionId: transactionId,
              upiRefNo: upiTransactionId || data.upiDetails?.upiId,
            },
          },
          { new: true },
        );

        if (payment) {
          console.log(
            `Payment ${merchantTransactionId} processed successfully`,
          );
          // 5. Grant access (Only if this callback actually updated the payment)
          if (payment.packageId) {
            await grantAccess(payment.userId, payment.packageId, "PACKAGE");
          }
        } else {
          console.log(
            `Payment ${merchantTransactionId} already processed or not found`,
          );
        }
      } finally {
        releaseLock(lockKey);
      }
    }

    res.status(200).send("OK");
  } catch (err) {
    console.error("phonePeCallback error:", err.message);
    // Always return 200 to PhonePe to prevent retry storms
    res.status(200).send("OK");
  }
};

/**
 * Helper to generate PhonePe OAuth Token
 */
export const getPhonePeAuthToken = async () => {
  try {
    const clientId = process.env.PHONEPE_CLIENT_ID || process.env.PHONEPE_CLIENT_ID;
    const clientSecret = process.env.PHONEPE_CLIENT_SECRET || process.env.PHONEPE_CLIENT_SECRET;
    const authUrl = process.env.PHONEPE_AUTH_URL || "https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token";

    if (!clientId || !clientSecret) {
      return { success: false, message: "PhonePe credentials not configured" };
    }

    const requestHeaders = {
      "Content-Type": "application/x-www-form-urlencoded"
    };
    const data = new URLSearchParams({
      "client_version": 1,
      "grant_type": "client_credentials",
      client_id: clientId,
      client_secret: clientSecret
    });
    console.log(data, 'dat')
    const options = {
      method: 'POST',
      url: authUrl,
      headers: requestHeaders,
      data: data
    };

    const response = await axios.request(options);
    return {
      success: true,
      token_data: response.data
    };
  } catch (err) {
    console.error("=== getPhonePeAuthToken ERROR ===");
    console.error("PhonePe Auth error:", err.response?.data || err.message);
    return {
      success: false,
      message: err.message || "Failed to generate PhonePe Auth Token",
      error_details: err.response?.data
    };
  }
};



// export const getPhonePeAuthToken = async () => {
//   try {
//     const response = await axios.post(
//       "https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token",
//       {
//         client_id: process.env.PHONEPE_CLIENT_ID,
//         client_secret: process.env.PHONEPE_CLIENT_SECRET,
//         grant_type: "client_credentials",
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );
//     console.log(response, '---------------------------------------')
//     return {
//       success: true,
//       token_data: response.data,
//     };
//   } catch (err) {
//     console.error("AUTH ERROR:", err.response?.data || err.message);

//     return {
//       success: false,
//     };
//   }
// };

export const initiatePhonePePayment = async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.user?.id || "guest_user";

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount",
      });
    }

    // 1️⃣ Get Token
    const tokenData = await getPhonePeAuthToken();
    if (!tokenData.success) {
      return res.status(500).json({
        success: false,
        message: "Token generation failed",
      });
    }

    const accessToken = tokenData.token_data.access_token;

    // 2️⃣ Generate IDs
    const merchantTransactionId = `MT_${Date.now()}`;
    const merchantUserId = `USER_${userId}`;

    // 3️⃣ (Optional) Save to DB
    // await Payment.create({ ... })

    // 4️⃣ Request Body
    const payload = {
      merchantId: process.env.PHONEPE_CLIENT_ID,
      merchantTransactionId,
      merchantUserId,
      amount: amount * 100, // paise
      merchantOrderId: process.env.PHONEPE_CLIENT_ID,
      redirectUrl: process.env.PHONEPE_REDIRECT_URL,
      redirectMode: "POST",

      callbackUrl: process.env.PHONEPE_CALLBACK_URL,

      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };

    // 5️⃣ API Call
    const response = await axios.post(
      process.env.PHONEPE_PAY_URL || "https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/pay",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `O-Bearer ${accessToken}`,
        },
      }
    );

    // 6️⃣ Response
    if (response.data?.success) {
      const redirectUrl =
        response.data.data.instrumentResponse.redirectInfo.url;

      return res.json({
        success: true,
        redirectUrl,
        merchantTransactionId,
      });
    }

    return res.status(400).json({
      success: false,
      message: response.data?.message,
    });
  } catch (err) {
    console.error("PAYMENT ERROR:", err.response?.data || err.message);

    return res.status(500).json({
      success: false,
      message: err.response?.data?.message || err.message,
    });
  }
};
/**
 * Express Route Handler for GET /api/payment/phonepe/auth-token
 */
export const fetchPhonePeAuthTokenRoute = async (req, res) => {
  const result = await getPhonePeAuthToken();
  if (result.success) {
    return res.status(200).json(result);
  } else {
    return res.status(500).json(result);
  }
};


export const phonepeWebhook = async (req, res) => {
  try {
    const data = req.body;

    console.log("WEBHOOK DATA:", JSON.stringify(data, null, 2));

    const merchantTransactionId = data.payload?.merchantTransactionId;
    const state = data.payload?.state;

    if (state === "COMPLETED") {
      // ✅ Payment success
      // Update DB
      console.log("Payment SUCCESS:", merchantTransactionId);
    } else {
      console.log("Payment FAILED:", merchantTransactionId);
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("WEBHOOK ERROR:", err.message);
    res.status(500).send("Webhook error");
  }
};

export const checkPaymentStatus = async (req, res) => {
  try {
    const { transactionId } = req.params;

    const tokenData = await getPhonePeAuthToken();
    const accessToken = tokenData.token_data.access_token;

    const url = `https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/order/${transactionId}/status`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `O-Bearer ${accessToken}`,
      },
    });

    return res.json(response.data);
  } catch (err) {
    console.error("STATUS ERROR:", err.response?.data || err.message);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};