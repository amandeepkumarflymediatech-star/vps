import api from "./axios";

/* ================= SEND OTP ================= */
export const sendOtp = (data) => {
  return api.post("/otp/send", data);
};

/* ================= VERIFY OTP ================= */
export const verifyOtp = (data) => {
  return api.post("/otp/verify", data);
};

/* ================= RESEND OTP ================= */
// 🔁 resend = send again
export const resendOtp = (data) => {
  return api.post("/otp/send", data);
};
