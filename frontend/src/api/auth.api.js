// import api from "./axios";

// /* ================= REGISTER ================= */
// export const registerUser = (data) => {
//   return api.post("/auth/register", data);
// };

// /* ================= LOGIN ================= */
// export const loginUser = (data) => {
//   return api.post("/auth/login", data);
// };

// /* ================= GOOGLE LOGIN ================= */
// export const googleLogin = (data) => {
//   return api.post("/auth/google", data);
// };

// /* ================= FORGOT PASSWORD ================= */
// export const forgotPassword = (email) => {
//   return api.post("/auth/forgot-password", { email });
// };

// /* ================= RESET PASSWORD ================= */
// export const resetPassword = (data) => {
//   return api.post("/auth/reset-password", data);
// };






import api from "./axios";

/* ================= REGISTER ================= */
export const registerUser = (data) => {
  /*
    data: {
      name,
      email,
      phone,
      password
    }
  */
  return api.post("/auth/register", data);
};

/* ================= LOGIN ================= */
export const loginUser = (data) => {
  /*
    data: {
      email,
      password
    }
  */
  return api.post("/auth/login", data);
};

/* ================= GOOGLE LOGIN ================= */
export const googleLogin = (data) => {
  /*
    data: {
      token (google credential)
    }
  */
  return api.post("/auth/google", data);
};

/* ================= FORGOT PASSWORD ================= */
export const forgotPassword = (email) => {
  // email string
  return api.post("/auth/forgot-password", { email });
};

/* ================= RESET PASSWORD ================= */
export const resetPassword = (data) => {
  /*
    data: {
      email,
      otp,
      password
    }
  */
  return api.post("/auth/reset-password", data);
};
