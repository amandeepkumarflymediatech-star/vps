import api from "./axios";

/* ================= REGISTER ================= */
export const registerUser = (data) => {
  return api.post("/auth/register", data);
};

/* ================= LOGIN ================= */
export const loginUser = (data) => {
  return api.post("/auth/login", data);
};

/* ================= GOOGLE LOGIN ================= */
export const googleLogin = (data) => {
  return api.post("/auth/google", data);
};

/* ================= FORGOT PASSWORD ================= */
export const forgotPassword = (email) => {
  return api.post("/auth/forgot-password", { email });
};

/* ================= RESET PASSWORD ================= */
export const resetPassword = (data) => {
  return api.post("/auth/reset-password", data);
};

/* ================= VERIFY REGISTER OTP ================= */
export const verifyRegisterOtp = (data) => {
  return api.post("/auth/verify-register-otp", data);
};
