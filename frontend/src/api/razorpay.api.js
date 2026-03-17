import axios from "./axios.instance";

/**
 * Creates Razorpay order
 */
export const createRazorpayOrder = (data) => 
  axios.post("/payment/razorpay/order", data);

/**
 * Verifies Razorpay signature
 */
export const verifyRazorpaySignature = (data) =>
  axios.post("/payment/razorpay/verify", data);
