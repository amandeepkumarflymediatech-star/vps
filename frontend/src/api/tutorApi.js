import API from "./axios.instance";

/* ================= APPLY TUTOR ================= */
export const applyTutorApi = (data) => {
  return API.post("/tutor/apply", data);
};

/* ================= PUBLIC: LIST TUTORS ================= */
export const getTutors = (params) => {
  return API.get("/tutor/list", { params });
};

/* ================= TUTOR LOGIN ================= */
export const tutorLogin = (data) => {
  return API.post("/auth/login", data);
};

/* ================= PUBLIC: TUTOR DETAIL ================= */
export const getTutorById = (id) => {
  return API.get(`/tutor/${id}`);
};

/* ================= TUTOR: PACKAGES (READ-ONLY) ================= */
// Tutors can view all published packages (same endpoint students use)
export const getTutorPackages = (params) => {
  return API.get("/packages", { params });
};

export const getTutorPackageById = (id) => {
  return API.get(`/packages/${id}`);
};

export default {
  applyTutorApi,
  getTutors,
  getTutorById,
  tutorLogin,
  getTutorPackages,
  getTutorPackageById,
};
