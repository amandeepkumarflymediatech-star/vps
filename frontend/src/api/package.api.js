import API from "./axios.instance";

// Public: get list of published packages (optionally filter by level/category/org)
export const getPackages = (params) => API.get("/packages", { params });

// Public: get a single package by id
export const getPackageById = (id) => API.get(`/packages/${id}`);

// Admin-only: create a package (expects JSON body)
export const createPackage = (data) => API.post("/packages", data);

// Admin-only: update a package by id
export const updatePackage = (id, data) => API.put(`/packages/${id}`, data);

// Admin-only: soft-delete a package by id
export const deletePackage = (id) => API.delete(`/packages/${id}`);

export default {
  getPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage,
};
