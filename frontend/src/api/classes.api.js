import axios from "axios";

// ✅ Correct Base URL
const API = axios.create({
  baseURL: "http://localhost:8000/api/classes",
    withCredentials: true, 
});

// ✅ Attach token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

/**
 * CLASSES API
 */

// Get all classes
export const getAllClasses = (params) => API.get("/", { params });

// Get single class
export const getClassById = (id) => API.get(`/${id}`);

// Create class
export const createClass = (data) => API.post("/", data);

// Update class
export const updateClass = (id, data) => API.put(`/${id}`, data);

// Delete class
export const deleteClass = (id) => API.delete(`/${id}`);

export default {
  getAllClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
};
