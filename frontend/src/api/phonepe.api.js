import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export const initiatePhonePePayment = async (data) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(`${API_URL}/payment/phonepe/initiate`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
