import axios from "./axios.instance";

export const getAdminDashboard = () =>
  axios.get("/admin/dashboard");

export const getUsers = () =>
  axios.get("/admin/users");

export const getTutors = () =>
  axios.get("/admin/tutors");
