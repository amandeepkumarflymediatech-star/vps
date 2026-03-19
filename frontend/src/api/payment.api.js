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
 * Check PhonePe payment status
 */
export const checkPhonePePaymentStatus = async (merchantTransactionId) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const response = await axios.get(`${API_URL}/payment/phonepe/checkout-status/${merchantTransactionId}`, {
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

/**
 * Fetch PhonePe auth token
 */
export const fetchPhonePeAuthToken = async () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const response = await axios.get(`${API_URL}/payment/phonepe/auth-token`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};