import api from "./axios";

export const getTutors = () => api.get("/tutors");
export const getTutorById = (id) => api.get(`/tutors/${id}`);
