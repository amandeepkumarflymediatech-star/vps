import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

/**
 * Initiate PhonePe payment (Card/Netbanking/Wallet)
 */
export const initiatePhonePePayment = async (data) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const response = await axios.post(`${API_URL}/payment/phonepe/initiate`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

/**
 * Initiate PhonePe UPI payment (Direct UPI)
 */
export const initiatePhonePeUpiPayment = async (data) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const response = await axios.post(`${API_URL}/payment/phonepe/upi`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

/**
 * Check UPI payment status
 */
export const checkUpiPaymentStatus = async (merchantTransactionId) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const response = await axios.get(`${API_URL}/payment/phonepe/status/${merchantTransactionId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

/**
 * Log UPI payment to backend
 */
export const logUpiPayment = async (data) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const response = await axios.post(`${API_URL}/payment/upi/log`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
