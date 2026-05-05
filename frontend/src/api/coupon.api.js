import axiosInstance from "./axios.instance";

export const validateCoupon = (code) => {
  return axiosInstance.post("/coupons/validate", { code });
};
